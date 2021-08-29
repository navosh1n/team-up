import isEqual from 'lodash/isEqual';
import { ApiService } from '@/services/api/api-service';
import { answerTypes, testingModeTypes, testingStatusTypes } from '@/constants/testing';
import { questionStatusTypes, questionTypesFactors } from '@/constants/questions';
import { shuffleArray } from '@/utils/array';
import { makeMapFromArray } from '@/utils/collections';

const getPercent = (value, maxValue) => (maxValue ? +(value * 100 / maxValue).toFixed(2) : 0);

export class TestingService extends ApiService {
  #cache = {
    lastUpdate: null,
    workspaceId: null,
    params: {},
    data: [],
  };

  #questionsCache = {
    testingId: null,
    data: [],
  };

  constructor() {
    super('testing');
  }

  async get({ limit = 5, offset = 0, workspaceId, ...params } = {}) {
    const { intervieweeId, status, mode } = params;

    if (!workspaceId) {
      throw Error('Workspace is required param');
    }

    const { lastUpdate } = this.#cache;

    if (
      !lastUpdate
      || lastUpdate > new Date() + 300000
      || workspaceId !== this.#cache.workspaceId
      || !isEqual(this.#cache.params, params)
    ) {
      let ref = this.collection;

      ref = ref.where('workspaceId', '==', workspaceId);

      if (intervieweeId || status || mode) {
        intervieweeId && (ref = ref.where('intervieweeId', '==', intervieweeId));
        status && (ref = ref.where('status', '==', status));
        mode && (ref = ref.where('mode', '==', mode));
      }

      const snapshots = await ref.orderBy('startedAt', 'desc').get();

      this.#cache = {
        data: snapshots.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        workspaceId,
        params,
        lastUpdate: +new Date(),
      };
    }

    const { data } = this.#cache;

    return {
      meta: {
        total: data.length,
      },
      data: data.slice(offset, offset + limit),
    };
  }

  async getById(id) {
    const doc = await this.collection.doc(id).get();
    if (doc.exists) return { id: doc.id, ...doc.data() };
    throw Error('Тестирование с таким id не найдено.');
  }

  async getNextQuestion(id) {
    const currentTesting = await this.getById(id);

    const { workspaceId, categories, questions: testingQuestions = [] } = currentTesting;

    if (!workspaceId) throw Error('Workspace is required param');

    const filteredQuestions = await this.getFilteredQuestions(id, currentTesting);

    shuffleArray(filteredQuestions);

    const categoriesMapInitValue = categories.reduce((res, cat) => {
      res[cat] = 0;
      return res;
    }, {});

    const categoriesMap = testingQuestions.filter(q => !q.skipped).reduce((res, curr) => {
      res[curr.categoryId] = res[curr.categoryId] ? ++res[curr.categoryId] : 1;
      return res;
    }, categoriesMapInitValue);

    const categoriesEntries = Object.entries(categoriesMap);

    categoriesEntries.sort((a, b) => (a[1] >= b[1] ? -1 : 1));

    let nextQuestion = null;

    while (!nextQuestion && categoriesEntries.length) {
      const [nextCategoryId] = categoriesEntries.pop();
      nextQuestion = filteredQuestions.find(q => q.categoryId === nextCategoryId);
      if (nextQuestion) break;
    }

    return nextQuestion;
  }

  async create(data) {
    if (data.mode === testingModeTypes.testing) {
      const { data: testing } = await this.get({
        limit: 1,
        mode: data.mode,
        workspaceId: data.workspaceId,
        status: testingStatusTypes.finished,
        intervieweeId: data.intervieweeId,
      });

      const oldQuestionsMap = testing.reduce((res, testing) => {
        testing.questions.forEach(question => {
          if (
            question.answer
            !== answerTypes.correct
            && data.categories.includes(question.categoryId)
          ) {
            res.set(question.id, {
              id: question.id,
              categoryId: question.categoryId,
            });
          }
        });

        return res;
      }, new Map());

      data.questions = [...oldQuestionsMap.values()];

      if (!data.questions.length) {
        const filteredQuestions = await this.getFilteredQuestions(null, data);
        if (!filteredQuestions.length) {
          throw Error('Вопросы для заданных параметров не найдены!');
        }
      }
    }

    const doc = await this.collection.add({
      ...data,
      status: testingStatusTypes.inProgress,
      startedAt: this.getServerTimestamp(),
    });

    this.#cache.lastUpdate = null;

    return doc.id;
  }

  async update({ id, ...data }) {
    const finishedAt = data.status === testingStatusTypes.finished
      ? this.getServerTimestamp()
      : null;

    await this.collection.doc(id).update({
      ...data,
      finishedAt,
    });

    this.#cache.lastUpdate = null;

    const testing = await this.getById(id);

    if (finishedAt) {
      const updates = testing.questions.reduce((res, question) => {
        if (question.sharedId) res[`/questions/${question.sharedId}/isBlocked`] = true;
        return res;
      }, {});

      this.database.ref().update(updates).catch(() => {});
    }

    return testing;
  }

  async getResults(id) {
    const currentTesting = await this.getById(id);

    const questionsSnaps = await this.db.collection('questions')
      .where('workspaceId', '==', currentTesting.workspaceId)
      .where('status', '==', questionStatusTypes.ready)
      .orderBy('created', 'desc')
      .get();

    const questionsMap = makeMapFromArray(
      questionsSnaps.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    );

    const questions = currentTesting.questions
      .filter(question => !question.skipped && question.finishedAt)
      .map(question => ({
        ...questionsMap[question.id],
        ...question,
        history: [],
      }));

    let totalMaxScore = 0;
    let totalScore = 0;

    const categoriesScore = currentTesting.categories.reduce((res, categoryId) => {
      const { maxScore, score } = questions
        .filter(question => question.categoryId === categoryId)
        .reduce((res, question) => {
          // множитель в зависимости от типа вопроса
          const factor = questionTypesFactors[question.type] || questionTypesFactors.verbal;

          return {
            maxScore: res.maxScore + question.level * answerTypes.correct * factor,
            score: res.score + question.level * question.answer * factor,
          };
        }, { maxScore: 0, score: 0 });

      totalScore += score;
      totalMaxScore += maxScore;
      res[categoryId] = { score, maxScore, percent: getPercent(score, maxScore) };
      return res;
    }, {});

    const userDoc = await this.db.collection('users').doc(currentTesting.intervieweeId).get();
    const interviewee = userDoc.exists ? { id: userDoc.id, ...userDoc.data() } : null;

    const historyTesting = await this.get({
      workspaceId: currentTesting.workspaceId,
      intervieweeId: currentTesting.intervieweeId,
      status: testingStatusTypes.finished,
      mode: currentTesting.mode,
    });

    questions.forEach(question => {
      historyTesting.data.forEach(testing => {
        const historyQuestion = testing.questions.find(q => q.id === question.id && q.finishedAt);
        historyQuestion && question.history.push({
          answer: historyQuestion.answer,
          startedAt: historyQuestion.startedAt,
          comment: historyQuestion.comment,
        });
      });
    });

    return {
      ...currentTesting,
      score: totalScore,
      maxScore: totalMaxScore,
      percent: getPercent(totalScore, totalMaxScore),
      categoriesScore,
      interviewee,
      questions,
    };
  }

  async getFilteredQuestions(testingId, testing) {
    const { workspaceId, categories, questions: testingQuestions = [] } = testing;

    if (
      !testingId
      || this.#questionsCache.testingId !== testingId
      || !this.#questionsCache.data.length
    ) {
      const snapshots = await this.db.collection('questions')
        .where('workspaceId', '==', workspaceId)
        .where('categoryId', 'in', categories)
        .where('status', '==', questionStatusTypes.ready)
        .orderBy('created', 'desc')
        .get();

      this.#questionsCache.testingId = testingId;
      this.#questionsCache.data = snapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    const { data: questions } = this.#questionsCache;

    const excluded = testingQuestions.filter(q => q.finishedAt).map(q => q.id);

    return questions.filter(question => {
      let result = true;

      if (excluded) {
        result = !excluded.includes(question.id);
      }

      return result;
    });
  }
}

export default new TestingService();

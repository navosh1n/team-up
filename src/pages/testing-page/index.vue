<template>
  <main-layout>
    <el-card v-if="error">
      <el-alert
        title="Ошибка!"
        type="error"
        :description="error"
        show-icon
        :closable="false"
      />
    </el-card>

    <template v-else>
      <question-card
        v-loading="loadingQuestion"
        :question="currentQuestion"
        :categories="categoriesMap"
      />

      <app-block v-if="isLiveCode">
        <code-editor
          :value="sharedQuestion.code"
          :language="sharedQuestion.language"
          disabled
        />
      </app-block>

      <testing-controls
        v-if="currentTesting && currentQuestion"
        :disabled="loading"
        :time="currentTesting.time"
        :started-at="testingStartedAt"
        :question="currentQuestion"
        @next="onNext"
        @skip="onSkip"
        @finish="onFinish"
        @copy-link="onCopyLink"
      />
    </template>

    <div slot="aside">
      <testing-card
        v-loading="loadingTesting"
        :interviewee="interviewee"
        :categories="categoriesMap"
        :question-ind="currentQuestionInd"
        :question-started-at="questionStartedAt"
        :current-testing="currentTesting"
      />
    </div>
  </main-layout>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import MainLayout from '@/components/layouts/main-layout';
import QuestionCard from '@/pages/testing-page/question-card';
import TestingControls from '@/pages/testing-page/testing-controls';
import { testingStatusTypes } from '@/constants/testing';
import TestingCard from '@/pages/testing-page/testing-card';
import { RouteTypes } from '@/router';
import AppBlock from '@/components/elements/app-block';
import { questionTypes } from '@/constants/questions';
import questionService from '@/services/api/question-service';
import LoadingStub from '@/components/loading-stub';

const CodeEditor = () => ({
  component: import('@/components/code-editor/code-editor'),
  loading: LoadingStub,
  delay: 0,
});

export default {
  name: 'TestingPage',

  components: {
    CodeEditor,
    AppBlock,
    TestingCard,
    TestingControls,
    QuestionCard,
    MainLayout,
  },

  data: () => ({
    loadingTesting: false,
    loadingQuestion: false,
    updatingTesting: false,
    error: '',
    currentQuestion: null,
    currentQuestionInd: 0,
    interviewee: null,
    sharedQuestionId: null,
    sharedQuestion: {},
  }),

  computed: {
    ...mapState('testing', ['currentTesting']),
    ...mapGetters('categories', ['categoriesMap']),

    currentQuestionId() {
      return this.currentQuestion?.id;
    },

    testingId() {
      return this.$route.params.id;
    },

    testingStartedAt() {
      return this.currentTesting?.startedAt?.seconds;
    },

    questionStartedAt() {
      return this.currentQuestion?.startedAt;
    },

    loading() {
      return this.loadingQuestion || this.loadingTesting || this.updatingTesting;
    },

    isLiveCode() {
      return this.currentQuestion?.type === questionTypes.liveCode;
    },
  },

  watch: {
    sharedQuestionId(value) {
      this.unsubscribeSharedQuestion();

      if (value) {
        this.sharedQuestion.unsubscribe = questionService.subscribeSharedQuestion(
          value,
          ({ code, language }) => {
            this.$set(this.sharedQuestion, 'code', code);
            this.$set(this.sharedQuestion, 'language', language);
          },
        );
      }
    },
  },

  async created() {
    this.loadingTesting = true;

    this.loadCategories();

    try {
      await this.loadCurrentTesting(this.testingId);

      if (this.currentTesting.status === testingStatusTypes.finished) {
        return this.redirectToResult();
      }

      this.loadInterviewee();
      await this.loadNextQuestion();
    } catch (e) {
      this.error = e.message;
      console.error(e);
    } finally {
      this.loadingTesting = false;
    }
  },

  beforeDestroy() {
    this.unsubscribeSharedQuestion();
  },

  methods: {
    ...mapActions('users', ['loadUserById']),
    ...mapActions(
      'testing',
      ['loadCurrentTesting', 'loadTestingNextQuestion', 'updateCurrentTesting'],
    ),

    ...mapActions({
      loadCategories: 'categories/loadCategories',
      loadQuestionById: 'questions/loadQuestionById',
      createSharedQuestion: 'questions/createSharedQuestion',
      updateSharedQuestion: 'questions/updateSharedQuestion',
    }),

    async loadInterviewee() {
      this.interviewee = await this.loadUserById(this.currentTesting.intervieweeId);
    },

    async loadNextQuestion() {
      this.loadingQuestion = true;

      if (this.sharedQuestionId) {
        this.updateSharedQuestion({ id: this.sharedQuestionId, isBlocked: true });
      }

      this.sharedQuestionId = null;

      const { questions: testingQuestions = [] } = this.currentTesting;

      this.currentQuestionInd = testingQuestions.findIndex(question => !question.finishedAt);

      const currentTestingQuestion = testingQuestions[this.currentQuestionInd];

      if (currentTestingQuestion) {
        const question = await this.loadQuestionById(currentTestingQuestion.id);
        this.currentQuestion = {
          ...question,
          ...currentTestingQuestion,
          startedAt: currentTestingQuestion.startedAt || +new Date(),
        };
        this.sharedQuestionId = this.currentQuestion.sharedId;
        this.loadingQuestion = false;
        return;
      }

      const question = await this.loadTestingNextQuestion(this.testingId);

      if (question) {
        this.currentQuestion = {
          ...question,
          startedAt: +new Date(),
        };
        this.sharedQuestionId = this.currentQuestion.sharedId;
        this.currentQuestionInd = (testingQuestions.length || 1) - 1;
      } else {
        this.$notify.info({
          title: 'Тестирование завершено',
          message: 'Причина: закончились вопросы.',
          position: 'bottom-right',
        });

        await this.onFinish();
      }

      this.loadingQuestion = false;
    },

    updateCurrentQuestion(data = {}) {
      const answerKeys = [
        'id',
        'startedAt',
        'answer',
        'skipped',
        'comment',
        'finishedAt',
        'categoryId',
        'sharedId',
        'confidence',
      ];

      const { questions: testingQuestions = [] } = this.currentTesting;

      const currentQuestion = {
        ...this.currentQuestion,
        ...data,
      };

      const currentTestingQuestion = answerKeys.reduce((res, key) => {
        if (currentQuestion[key] !== undefined) res[key] = currentQuestion[key];
        return res;
      }, {});

      const ind = testingQuestions.findIndex(q => q.id === this.currentQuestionId);

      const questions = testingQuestions.slice();

      ~ind
        ? questions.splice(ind, 1, currentTestingQuestion)
        : questions.push(currentTestingQuestion);

      this.currentQuestion = currentQuestion;

      return questions;
    },

    async onNext({ answer, comment, confidence }) {
      this.loadingQuestion = true;
      this.updatingTesting = true;

      await this.updateCurrentTesting({
        questions: this.updateCurrentQuestion({
          answer,
          comment,
          confidence,
          finishedAt: +new Date(),
          skipped: false,
        }),
      });

      this.updatingTesting = false;

      this.loadNextQuestion();
    },

    async onSkip() {
      this.loadingQuestion = true;
      this.updatingTesting = true;

      await this.updateCurrentTesting({
        questions: this.updateCurrentQuestion({
          finishedAt: +new Date(),
          skipped: true,
        }),
      });

      this.updatingTesting = false;

      this.loadNextQuestion();
    },

    async onFinish({ answer, comment, confidence } = {}) {
      this.updatingTesting = true;

      const data = { status: testingStatusTypes.finished };

      if (typeof answer === 'number') {
        data.questions = this.updateCurrentQuestion({
          answer,
          comment,
          confidence,
          finishedAt: +new Date(),
          skipped: false,
        });
      }

      await this.updateCurrentTesting(data);

      this.updatingTesting = false;

      this.redirectToResult();
    },

    async onCopyLink() {
      const {
        id,
        description,
        title,
        type,
        sharedId,
      } = this.currentQuestion;

      try {
        sharedId && (this.sharedQuestionId = sharedId);

        if (!this.sharedQuestionId) {
          this.updatingTesting = true;
          this.sharedQuestionId = await this.createSharedQuestion({ id, description, title, type });

          await this.updateCurrentTesting({
            questions: this.updateCurrentQuestion({
              sharedId: this.sharedQuestionId,
            }),
          });
        }

        const url = `${window.location.origin}/shared-question/${this.sharedQuestionId}`;
        await navigator.clipboard.writeText(url);

        this.$notify.info({
          title: 'Ссылка скопирована',
          message: url,
          position: 'bottom-right',
        });
      } catch (e) {
        this.$notify.error({
          title: 'Ошибка при копировании ссылки!',
          message: e.message,
          position: 'bottom-right',
        });
      } finally {
        this.updatingTesting = false;
      }
    },

    redirectToResult() {
      this.$router.push({ name: RouteTypes.ResultsPage, params: { id: this.$route.params.id } });
    },

    unsubscribeSharedQuestion() {
      if (!this.sharedQuestion.unsubscribe) return;
      this.sharedQuestion.unsubscribe();
      this.sharedQuestion = {};
    },
  },
};
</script>

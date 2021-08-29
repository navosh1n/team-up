<template>
  <app-block
    v-loading="loading"
    class="total-results"
  >
    <h1>Результаты {{ getText('title') }}</h1>

    <p v-if="interviewee">
      Пользователь: <b>{{ interviewee.firstName }} {{ interviewee.lastName }}</b>
    </p>

    <template v-if="testing">
      <p>
        Дата: <b>{{ date }}</b>
      </p>

      <p>
        Продолжительность: <b> {{ factTime }} / {{ time }} мин.</b>
      </p>

      <p>Всего вопросов: <b>{{ questions.length }}</b></p>

      <p v-if="intervieweeLevel">
        Предварительный уровень:
        <el-tooltip
          class="item"
          effect="dark"
          content="Уровень определен исходя из набранных баллов и максимального уровня вопроса"
          placement="top-start"
        >
          <i
            class="el-icon-question"
            style="color: #999"
          />
        </el-tooltip>
        <b> {{ intervieweeLevel }} </b>
      </p>

      <p class="total-results__confidence">
        Уверенность ответов:
        <confidence-rate
          :value="confidence"
          disabled
          style="margin-left: 10px"
        />
      </p>

      <template v-if="questions.length">
        <br>

        <p>
          <el-divider content-position="left">
            <template>
              Общий результат {{ testing.score }}/{{ testing.maxScore }}
            </template>
          </el-divider>
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="testing.percent"
            :status="getStatus(testing.percent)"
          />
        </p>

        <p
          v-for="(item, key) of testing.categoriesScore"
          :key="key"
        >
          <el-divider content-position="left">
            <template>
              Результат по {{ getCategoryName(key) }} {{ item.score }}/{{ item.maxScore }}
            </template>
          </el-divider>

          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="item.percent"
            :status="getStatus(item.percent)"
          />
        </p>

        <p>
          <el-collapse
            accordion
            class="total-results__feedback"
          >
            <el-collapse-item name="1">
              <span slot="title">
                <b>Фидбек</b> <i class="total-results__feedback-icon el-icon-guide" />
              </span>

              <el-input
                type="textarea"
                autosize
                readonly
                :value="feedback"
              />
            </el-collapse-item>
          </el-collapse>
        </p>
      </template>
    </template>
  </app-block>
</template>

<script>
import AppBlock from '@/components/elements/app-block';
import { secondsToFullTime } from '@/utils/time';
import { answerTypes, testingModeTypes } from '@/constants/testing';
import { levels } from '@/constants/levels';
import ConfidenceRate from '@/components/elements/confidence-rate';
import { getDate } from '@/utils/date';

const texts = {
  title: {
    [testingModeTypes.interview]: 'собеседования',
    [testingModeTypes.testing]: 'тестирования',
  },
};

export default {
  name: 'TotalResults',

  components: { ConfidenceRate, AppBlock },

  props: {
    testing: {
      type: Object,
    },

    categories: {
      type: Object,
      default: () => ({}),
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    interviewee() {
      return this.testing?.interviewee;
    },

    testingMode() {
      return this.testing?.mode;
    },

    intervieweeLevel() {
      const questionMaxLevel = this.questions.reduce((res, curr) => (
        res > curr.level ? res : curr.level
      ), 0);

      const { score, maxScore } = this.testing;

      const level = Math.floor(score * questionMaxLevel / maxScore);

      return levels[level];
    },

    time() {
      return this.testing?.time;
    },

    factTime() {
      const { startedAt, finishedAt } = this.testing;
      const seconds = (finishedAt?.seconds ?? 0) - (startedAt?.seconds ?? 0);
      return secondsToFullTime(seconds);
    },

    date() {
      return getDate(this.testing.startedAt.seconds * 1000);
    },

    questions() {
      return this.testing?.questions || [];
    },

    confidence() {
      const sum = this.questions.reduce((res, question) => res += question.confidence, 0);
      return Math.floor(sum / this.questions.length);
    },

    feedback() {
      switch (this.testingMode) {
        case testingModeTypes.testing:
          return this.getTestingFeedback();
        case testingModeTypes.interview:
          return this.getInterviewFeedback();
        default:
          return '';
      }
    },
  },

  methods: {
    getStatus(percentage) {
      if (percentage >= 90) {
        return 'success';
      }
      if (percentage >= 80) {
        return undefined;
      }
      if (percentage >= 50) {
        return 'warning';
      }
      return 'exception';
    },

    getCategoryName(id) {
      return this.categories[id]?.name || id;
    },

    getText(key) {
      return texts[key][this.testing?.mode];
    },

    getInterviewFeedback() {
      const { categories } = this.testing;

      return categories.reduce((res, category) => {
        const comments = this.questions
          .filter(question => question.category === category && question.comment)
          .map(question => question.comment);
        res.push(`-- ${category} --`, ...comments, '');
        return res;
      }, []).join('\n');
    },

    getTestingFeedback() {
      const { literature, titles } = this.questions.reduce((res, question) => {
        if (question.answer !== answerTypes.correct) {
          question.literature
            ? res.literature.add(question.literature)
            : res.titles.add(question.title);
        }
        return res;
      }, { literature: new Set(), titles: new Set() });

      return [...literature, ...titles].join('\n');
    },
  },
};
</script>

<style lang="scss" scoped>
.total-results {
  min-height: 100px;
  padding: 20px 30px;

  &__confidence {
    display: flex;
    align-items: center;
  }

  &__feedback {
    margin-top: 52px;

    &__icon {
      margin-left: 5px;
    }
  }
}
</style>

<template>
  <app-block class="testing-card">
    <h4 class="testing-card__title">
      Тестирование
    </h4>
    <template v-if="currentTesting">
      <p>Пользователь: <b style="white-space: nowrap">{{ intervieweeName }}</b></p>

      <el-collapse class="testing-card__categories">
        <el-collapse-item name="1">
          <template slot="title">
            <p>
              Категории: <br>
              <span class="testing-card__categories-list">
                {{ categoriesList }}
              </span>
            </p>
          </template>
          <div>
            <p
              v-for="(value, key) in categoriesStats"
              :key="key"
            >
              {{ getCategoryName(key) }}: {{ getQuestionsLength(value) }}
            </p>
          </div>
        </el-collapse-item>
      </el-collapse>

      <el-divider />

      <p>Вопрос № {{ questionInd + 1 }}</p>

      <p>
        Осталось на вопрос:
        <span
          class="testing-card__time"
          :class="{'testing-card__time_overflow': questionTimer < 10}"
        >
          {{ questionTimerView }}
        </span>
      </p>

      <p>
        Всего времени:
        <span
          class="testing-card__time"
          :class="{'testing-card__time_overflow': isTimeEnd}"
        >
          {{ testingTimer }}/{{ testingTime }} мин.
        </span>
      </p>

      <el-alert
        v-if="isTimeEnd"
        title="Время закончилось!"
        type="warning"
        description="Рекомендуем завершить тестирование."
        :closable="false"
        class="testing-card__alert"
      />
    </template>
  </app-block>
</template>

<script>
import AppBlock from '@/components/elements/app-block';
import { secondsToFullTime } from '@/utils/time';
import { testingQuestionTime } from '@/constants/testing';
import { pluralize } from '@/utils/string';

export default {
  name: 'TestingCard',

  components: { AppBlock },

  props: {
    questionInd: {
      type: Number,
      default: 0,
    },

    currentTesting: {
      type: Object,
    },

    categories: {
      type: Object,
      default: () => ({}),
    },

    questionStartedAt: {
      type: Number,
    },

    interviewee: {
      type: Object,
    },
  },

  data: () => ({
    testingTimer: 0,
    testingTimerId: null,
    questionTimer: 0,
    questionTimerId: null,
  }),

  computed: {
    categoriesList() {
      return this.currentTesting.categories
        .map(categoryId => this.categories[categoryId].name)
        .join(', ');
    },

    categoriesStats() {
      const { questions, categories } = this.currentTesting;

      const categoriesMapInitValue = categories.reduce((res, cat) => {
        res[cat] = 0;
        return res;
      }, {});

      return questions.reduce((res, curr) => {
        res[curr.categoryId] = res[curr.categoryId] ? ++res[curr.categoryId] : 1;
        return res;
      }, categoriesMapInitValue);
    },

    isTimeEnd() {
      return this.testingTimer >= this.testingTime;
    },

    testingTime() {
      return this.currentTesting.time;
    },

    questionTimerView() {
      return secondsToFullTime(this.questionTimer);
    },

    intervieweeName() {
      if (!this.interviewee) return '-';
      const { firstName, lastName } = this.interviewee;
      return `${lastName} ${firstName}`;
    },
  },

  watch: {
    questionStartedAt: {
      immediate: true,
      handler(val) {
        if (!val) return;
        this.setQuestionTimer();
      },
    },

    currentTesting: {
      immediate: true,
      handler(val) {
        if (!val) return;
        this.setTestingTimer();
      },
    },
  },

  beforeDestroy() {
    this.testingTimerId && clearInterval(this.testingTimerId);
    this.questionTimerId && clearInterval(this.questionTimerId);
  },

  methods: {
    getCategoryName(categoryId) {
      return this.categories[categoryId]?.name;
    },

    getQuestionsLength(value) {
      return `${value} ${pluralize(value, ['вопрос', 'вопроса', 'вопросов'])}`;
    },

    setTestingTimer() {
      this.testingTimerId && clearInterval(this.testingTimerId);

      const getTestingTimer = () => {
        const { startedAt } = this.currentTesting;
        const seconds = Math.trunc(new Date() / 1000 - new Date(startedAt?.seconds));
        return Math.trunc(seconds / 60);
      };

      this.testingTimer = getTestingTimer();

      this.testingTimerId = setInterval(() => {
        this.testingTimer = getTestingTimer();
      }, 30000);
    },

    setQuestionTimer() {
      this.questionTimerId && clearInterval(this.questionTimerId);

      const questionTimeLimit = testingQuestionTime[this.currentTesting.mode] * 60;
      const questionElapsedTime = Math.floor((new Date() - this.questionStartedAt) / 1000);
      const questionTimer = questionTimeLimit - questionElapsedTime;

      this.questionTimer = questionTimer > 0 ? questionTimer : 0;

      this.questionTimerId = setInterval(() => {
        this.questionTimer && this.questionTimer--;
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.testing-card {
  &__title {
    margin-top: 0;
  }

  &__categories {
    line-height: 1;
    border: none;

    ::v-deep {
      .el-collapse-item.is-active {
        .testing-card__categories-list {
          display: none;
        }
      }

      .el-collapse-item__wrap {
        border: none;
      }

      .el-collapse-item__header {
        border: none;
        line-height: 1.3;
        font-weight: normal;
        color: #000;
        height: auto;
      }

      .el-collapse-item__content {
        margin-top: 5px;
        line-height: 1;
        padding: 0;
      }
    }
  }

  &__alert {
    padding: 5px 0;
  }

  &__time {
    white-space: nowrap;

    &_overflow {
      color: red;
      font-weight: bold;
    }
  }

  p {
    font-size: 14px
  }
}
</style>

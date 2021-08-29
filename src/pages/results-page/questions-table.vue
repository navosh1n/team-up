<template>
  <app-block
    v-loading="loading"
    class="questions-table"
  >
    <el-table
      :data="questions"
      row-key="id"
      :expand-row-keys="expandedRows"
      style="width: 100%"
      @expand-change="onExpandChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <p
            v-if="props.row.comment"
            style="color:#000;"
          >
            <b>Комментарий:</b> {{ props.row.comment }}
          </p>

          <p style="color:#000;">
            <b>История ответов: </b>
          </p>

          <el-timeline class="questions-table__timeline">
            <el-timeline-item
              v-for="question of history"
              :key="`${question.id}-${question.startedAt}`"
              :type="question.type"
              :timestamp="question.date"
            >
              {{ question.text }}
            </el-timeline-item>
          </el-timeline>
        </template>
      </el-table-column>

      <el-table-column
        label="№"
        width="50"
        align="center"
        type="index"
      />

      <el-table-column
        label="Вопрос"
        prop="title"
      />

      <el-table-column
        label="Время"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          {{ getQuestionTime(scope.row) }}
        </template>
      </el-table-column>

      <el-table-column
        label="Уровень"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <level-tag :level="scope.row.level" />
        </template>
      </el-table-column>

      <el-table-column
        label="Категория"
        align="center"
        width="100"
        prop="categoryId"
      >
        <template slot-scope="scope">
          {{ getCategoryName(scope.row.categoryId) }}
        </template>
      </el-table-column>

      <el-table-column
        label="Тип"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          {{ getQuestionType(scope.row.type) }}
        </template>
      </el-table-column>

      <el-table-column
        label="Ответ"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-tooltip :content="getAnswerText(scope.row.answer)">
            <i
              class="questions-table__answer"
              :class="getAnswerStyles(scope.row.answer)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </app-block>
</template>

<script>
import AppBlock from '@/components/elements/app-block';
import LevelTag from '@/components/elements/level-tag';
import { secondsToFullTime } from '@/utils/time';
import { answerTypes } from '@/constants/testing';
import { getDate } from '@/utils/date';
import { getQuestionType } from '@/utils/question';

export default {
  name: 'QuestionsTable',

  components: { LevelTag, AppBlock },

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

  data: () => ({
    history: [],
    expandedRows: [],
  }),

  computed: {
    questions() {
      return this.testing?.questions || [];
    },
  },

  methods: {
    getQuestionType,

    async onExpandChange(row, expandedRows) {
      const isExpanded = !!expandedRows.find(item => item.id === row.id);

      if (!isExpanded) return;

      this.history = [];

      this.expandedRows = [row.id];

      const question = this.questions.find(question => question.id === row.id);

      this.history = question
        ? question.history.map(({ answer, startedAt, comment }) => ({
          id: row.id,
          comment,
          text: this.getAnswerText(answer),
          type: this.getAnswerType(answer),
          startedAt,
          date: getDate(startedAt),
        }))
        : [];

      this.history.sort((a, b) => (a.startedAt >= b.startedAt ? -1 : 1));
    },

    getCategoryName(id) {
      return this.categories[id]?.name || id;
    },

    getAnswerText(answer) {
      switch (answer) {
        case answerTypes.notComplete:
          return 'Неполный ответ';
        case answerTypes.correct:
          return 'Правильный ответ';
        default:
          return 'Неправильный ответ';
      }
    },

    getAnswerStyles(answer) {
      switch (answer) {
        case answerTypes.notComplete:
          return ['el-icon-warning-outline', 'questions-table__answer_warning'];
        case answerTypes.correct:
          return ['el-icon-circle-check', 'questions-table__answer_success'];
        default:
          return ['el-icon-circle-close', 'questions-table__answer_error'];
      }
    },

    getAnswerType(answer) {
      switch (answer) {
        case answerTypes.notComplete:
          return 'warning';
        case answerTypes.correct:
          return 'success';
        default:
          return 'danger';
      }
    },

    getQuestionTime({ startedAt, finishedAt }) {
      return finishedAt && startedAt
        ? secondsToFullTime(Math.floor((finishedAt - startedAt) / 1000))
        : '-';
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/constants.scss";

.questions-table {
  ::v-deep {
    .el-table .cell {
      word-break: break-word;
    }
  }

  &__timeline {
    min-height: 30px;
    padding-left: 5px;
  }

  &__answer {
    &_success {
      color: $success-color;
    }

    &_warning {
      color: $warning-color;
    }

    &_error {
      color: $error-color;
    }
  }
}
</style>

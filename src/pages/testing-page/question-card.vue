<template>
  <app-block class="question-card">
    <template v-if="question">
      <h3 class="question-card__title">
        <level-tag
          :level="question.level"
          size="small"
          class="question-card__level"
        />
        {{ question.title }}
      </h3>

      <p v-if="question.description">
        <html-preview-block :value="question.description" />
      </p>

      <p
        v-if="question.help"
        class="question-card__help"
      >
        Ответ: {{ question.help }}
      </p>

      <p class="question-card__category">
        Категория: {{ category }}
      </p>
    </template>
  </app-block>
</template>

<script>
import AppBlock from '@/components/elements/app-block';
import LevelTag from '@/components/elements/level-tag';
import HtmlPreviewBlock from '@/components/html-preview-block';

export default {
  name: 'QuestionCard',

  components: { HtmlPreviewBlock, LevelTag, AppBlock },

  props: {
    question: {
      type: Object,
    },

    categories: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    category() {
      return this.categories[this.question.categoryId]?.name || '-';
    },
  },
};
</script>

<style lang="scss" scoped>
.question-card {
  padding: 20px;
  min-height: 100px;

  &__title {
    display: flex;
    margin-top: 0;
  }

  &__level {
    font-weight: normal;
    margin-right: 10px;
  }

  &__category {
    font-size: 12px;
  }

  &__help {
    font-size: 14px;
    color: #909399;
  }
}
</style>

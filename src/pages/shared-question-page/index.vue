<template>
  <error-stub
    v-if="error"
    title="Ошибка!"
    description="Вопрос не найден или ссылка больше не актуальна."
  />
  <div
    v-else
    v-loading="loading"
    class="shared-question"
  >
    <app-block
      v-if="question"
      class="shared-question__content"
    >
      <h3 class="shared-question__title">
        {{ question.title }}
      </h3>

      <div class="shared-question__description">
        <html-preview-block :value="question.description" />
      </div>
    </app-block>

    <app-block v-if="isLiveCode">
      <code-editor
        :value="question.code"
        :language="question.language"
        @input="onInputCode"
      />
    </app-block>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import debounce from 'lodash/debounce';
import AppBlock from '@/components/elements/app-block';
import HtmlPreviewBlock from '@/components/html-preview-block';
import ErrorStub from '@/components/error-stub';
import LoadingStub from '@/components/loading-stub';
import { questionTypes } from '@/constants/questions';
import questionService from '@/services/api/question-service';

const CodeEditor = () => ({
  component: import('@/components/code-editor/code-editor'),
  loading: LoadingStub,
  delay: 0,
});

export default {
  name: 'SharedQuestionPage',

  components: {
    CodeEditor,
    ErrorStub,
    HtmlPreviewBlock,
    AppBlock,
  },

  data: () => ({
    error: false,
    loading: false,
    question: null,
  }),

  computed: {
    sharedQuestionId() {
      return this.$route.params.id;
    },

    isLiveCode() {
      return this.question.type === questionTypes.liveCode;
    },
  },

  async mounted() {
    try {
      this.loading = true;
      this.question = await this.getSharedQuestion(this.sharedQuestionId);
      this.error = this.question.isBlocked;
      this.loading = false;

      if (!this.question.isBlocked) {
        const unsubscribe = questionService.subscribeSharedQuestion(
          this.sharedQuestionId,
          ({ isBlocked }) => {
            if (!isBlocked) return;
            this.error = true;
            unsubscribe();
          },
        );
      }

      await this.$nextTick();
    } catch (e) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  },

  methods: {
    ...mapActions({
      getSharedQuestion: 'questions/getSharedQuestion',
      updateSharedQuestion: 'questions/updateSharedQuestion',
    }),

    onInputCode: debounce(function ({ value, language }) {
      this.updateSharedQuestion({ id: this.sharedQuestionId, code: value, language });
    }, 500),
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/constants.scss";

.shared-question {
  @include page-horizontal-padding;
  width: 100%;
  padding-top: 40px;

  &__title {
    margin: 0 0 20px 0;
  }

  &__description {
    ::v-deep pre {
      max-height: none;
    }
  }
}
</style>

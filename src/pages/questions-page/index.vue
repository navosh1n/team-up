<template>
  <main-layout class="questions-page">
    <questions-filters
      v-loading="loadingCategories"
      :filters="filters"
      :categories="categoriesMap"
      @change="onChangeFilters"
    />

    <app-block
      v-loading="loadingQuestions"
      class="questions-page__content"
    >
      <div class="questions-page__actions">
        <el-button
          v-if="checkAccess('questions', 'create')"
          icon="el-icon-plus"
          type="primary"
          plain
          size="medium"
          @click="toggleQuestionModal(true)"
        >
          Добавить вопрос
        </el-button>
      </div>

      <questions-table
        :questions="questions"
        :categories="categoriesMap"
        @edit="onEditQuestion"
        @delete="onDeleteQuestion"
      />

      <app-pagination
        :total="meta.total"
        :current-page="currentPage"
        :page-size="pagination.limit"
        @current-change="onChangeCurrentPage"
      />
    </app-block>

    <question-modal
      v-if="questionModal.visible"
      :workspace-id="currentWorkspace.id"
      :question="editableQuestion"
      :categories="categoriesMap"
      @submit="onSubmitQuestion"
      @close="toggleQuestionModal(false)"
    />
  </main-layout>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import MainLayout from '@/components/layouts/main-layout';
import AppBlock from '@/components/elements/app-block';
import QuestionsFilters from '@/pages/questions-page/questions-filters';
import QuestionsTable from '@/pages/questions-page/questions-table';
import { filtersMixin } from '@/mixins/filters-mixin';
import { paginationMixin } from '@/mixins/pagination-mixin';
import AppPagination from '@/components/elements/app-pagination';

export default {
  name: 'QuestionsPage',

  components: {
    QuestionModal: () => import('@/pages/questions-page/question-modal'),
    AppPagination,
    QuestionsTable,
    QuestionsFilters,
    AppBlock,
    MainLayout,
  },

  mixins: [filtersMixin, paginationMixin],

  data: () => ({
    questionModal: { visible: false, questionId: null },
    loadingQuestions: false,
    loadingCategories: false,
    filtersKeys: ['query', 'level', 'categoryId', 'type', 'status'],
  }),

  computed: {
    ...mapState('questions', ['questions', 'meta']),
    ...mapState('workspaces', ['currentWorkspace']),
    ...mapGetters('categories', ['categoriesMap']),
    ...mapGetters('users', ['checkAccess']),

    editableQuestion() {
      const { questionId } = this.questionModal;
      return this.questions.find(({ id }) => id === questionId);
    },
  },

  async created() {
    this.loadQuestionsByParams();
    this.loadingCategories = true;
    await this.loadCategories();
    this.loadingCategories = false;
  },

  methods: {
    ...mapActions({
      loadQuestions: 'questions/loadQuestions',
      loadCategories: 'categories/loadCategories',
      deleteQuestion: 'questions/deleteQuestion',
    }),

    async loadQuestionsByParams(params = {}) {
      this.loadingQuestions = true;

      const { limit } = this.pagination;

      await this.loadQuestions({
        limit,
        offset: limit * (this.currentPage - 1),
        ...this.filters,
        ...params,
      });

      this.loadingQuestions = false;
    },

    toggleQuestionModal(visible, questionId) {
      this.questionModal = { visible, questionId: visible ? questionId : null };
    },

    async onChangeCurrentPage(page) {
      await this.changeCurrentPage(page);
      this.loadQuestionsByParams();
    },

    async onChangeFilters(filters) {
      await this.changeFilters(filters);
      this.loadQuestionsByParams();
    },

    onSubmitQuestion() {
      this.toggleQuestionModal(false);
      this.loadQuestionsByParams();
    },

    onEditQuestion(id) {
      this.toggleQuestionModal(true, id);
    },

    async onDeleteQuestion(id) {
      try {
        await this.$confirm('Вы действительно хотите удалить вопрос?', 'Подтверждение', {
          confirmButtonText: 'Да',
          cancelButtonText: 'Отмена',
          type: 'warning',
        });

        this.loadingQuestions = true;
        await this.deleteQuestion(id);
        this.loadingQuestions = false;

        this.loadQuestionsByParams();

        this.$message({
          type: 'success',
          message: 'Вопрос удален!',
        });
      } catch (e) {
        if (e === 'cancel') {
          return;
        }

        this.$message({
          type: 'error',
          message: 'Ошибка!',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.questions-page {
  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

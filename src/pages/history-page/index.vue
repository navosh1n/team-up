<template>
  <main-layout class="history-page">
    <app-block v-loading="loadingHistory">
      <history-table
        :current-user-id="currentUser.id"
        :testing="testing"
      />

      <app-pagination
        :total="meta.total"
        :current-page="currentPage"
        :page-size="pagination.limit"
        @current-change="changeCurrentPage"
      />
    </app-block>
  </main-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MainLayout from '@/components/layouts/main-layout';
import AppBlock from '@/components/elements/app-block';
import HistoryTable from '@/pages/history-page/history-table';
import AppPagination from '@/components/elements/app-pagination';
import { paginationMixin } from '@/mixins/pagination-mixin';

export default {
  name: 'HistoryPage',

  components: { AppPagination, HistoryTable, AppBlock, MainLayout },

  mixins: [paginationMixin],

  data: () => ({
    loadingHistory: true,
  }),

  computed: {
    ...mapState('users', ['currentUser']),
    ...mapState('testing', ['testing', 'meta']),
  },

  watch: {
    currentPage(val, oldVal) {
      if (val === oldVal) return;
      this.loadTestingByParams();
    },
  },

  created() {
    this.loadTestingByParams();
  },

  methods: {
    ...mapActions({
      loadTesting: 'testing/loadTesting',
    }),

    async loadTestingByParams(params = {}) {
      this.loadingHistory = true;

      const { limit } = this.pagination;

      await this.loadTesting({
        limit,
        offset: limit * (this.currentPage - 1),
        ...params,
      });

      this.loadingHistory = false;
    },
  },
};
</script>

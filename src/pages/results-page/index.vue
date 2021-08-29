<template>
  <main-layout class="results-page">
    <total-results
      :loading="loading"
      :testing="currentTesting"
      :categories="categoriesMap"
    />

    <questions-table
      :loading="loading"
      :testing="currentTesting"
      :categories="categoriesMap"
    />
  </main-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import MainLayout from '@/components/layouts/main-layout';
import QuestionsTable from '@/pages/results-page/questions-table';
import TotalResults from '@/pages/results-page/total-results';
import { testingStatusTypes } from '@/constants/testing';
import { RouteTypes } from '@/router';

export default {
  name: 'ResultsPage',

  components: { TotalResults, QuestionsTable, MainLayout },

  data: () => ({
    loading: true,
    currentTesting: null,
  }),

  computed: {
    ...mapGetters('categories', ['categoriesMap']),
  },

  async created() {
    const { id } = this.$route.params;

    this.loading = true;

    this.currentTesting = await this.loadTestingResults(id).catch(() => {
      this.$router.push({ name: 'Page404' });
    });

    if (this.currentTesting.status === testingStatusTypes.inProgress) {
      return this.redirectToTesting();
    }

    await this.loadCategories();

    this.loading = false;
  },

  methods: {
    ...mapActions('testing', ['loadTestingResults']),
    ...mapActions('categories', ['loadCategories']),

    redirectToTesting() {
      this.$router.push({ name: RouteTypes.TestingPage, params: { id: this.$route.params.id } });
    },
  },
};
</script>

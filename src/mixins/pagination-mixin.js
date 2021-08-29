export const paginationMixin = {
  data: () => ({
    pagination: {
      limit: 10,
    },
  }),

  computed: {
    currentPage() {
      return +this.$route.query.page || 1;
    },
  },

  methods: {
    async changeCurrentPage(page) {
      await this.$router.push({ query: { ...this.$route.query, page } });
    },
  },
};

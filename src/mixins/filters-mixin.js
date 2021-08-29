export const filtersMixin = {
  data: () => ({
    filtersKeys: [],
  }),

  computed: {
    filters() {
      const { query } = this.$route;
      return this.filtersKeys.reduce((res, key) => {
        res[key] = query[key];
        return res;
      }, {});
    },
  },

  methods: {
    async changeFilters(filters) {
      await this.$router.push({ query: { ...this.$route.query, ...filters, page: undefined } })
        .catch(() => {});
    },
  },
};

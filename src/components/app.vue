<template>
  <div
    id="app"
    v-loading="loading"
  >
    <router-view v-if="!loading && isAccess" />
    <error-stub
      v-else-if="!loading && !isAccess"
      title="Доступ запрещен!"
      description="Обратитесь к администратору, чтобы получить доступ."
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ErrorStub from '@/components/error-stub';

export default {
  name: 'App',

  components: { ErrorStub },

  data: () => ({
    loading: false,
  }),

  computed: {
    ...mapState('users', ['currentUserAccess']),

    isAccess() {
      const { name, meta } = this.$route;
      const { isAdmin, pages } = this.currentUserAccess;
      return meta.checkAccess ? isAdmin || pages?.includes(name) : true;
    },
  },

  async created() {
    this.loading = true;
    try {
      await this.loadCurrentUserData();
    } catch (e) {
      if (e.code !== 'permission-denied') {
        throw e;
      }
    } finally {
      this.loading = false;
    }
  },

  methods: {
    ...mapActions(['loadCurrentUserData']),
  },
};
</script>

<style lang="scss">
@import "~@/styles/constants.scss";
@import "~@/styles/index.scss";

#app {
  display: flex;
  height: 100%;
  overflow: hidden;
  font-family: $main-font;
  background: #edeef0;
}
</style>

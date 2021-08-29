<template>
  <div class="header-menu">
    <router-link
      v-for="link of links"
      :key="link.name"
      :to="{ name: link.name }"
    >
      {{ link.label }}
    </router-link>
  </div>
</template>

<script>
import { RouteTypes } from '@/router';

export default {
  name: 'HeaderMenu',

  computed: {
    links() {
      return [
        {
          name: RouteTypes.UsersPage,
          label: 'Пользователи',
          visible: true,
        },
        {
          name: RouteTypes.HistoryPage,
          label: 'История',
          visible: true,
        },
        {
          name: RouteTypes.QuestionsPage,
          label: 'База вопросов',
          visible: true,
        },
        {
          name: RouteTypes.TestingPage,
          label: 'Тестирование',
          visible: this.$route.name === RouteTypes.TestingPage,
        },
        {
          name: RouteTypes.ResultsPage,
          label: 'Результаты',
          visible: this.$route.name === RouteTypes.ResultsPage,
        },
      ].filter(link => link.visible);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/constants.scss";

.header-menu {
  display: flex;
  height: 100%;

  & > a {
    display: inline-flex;
    align-items: center;
    padding: 0 10px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    line-height: 1;
    font-size: 14px;

    &:hover {
      color: #fff;
      background-color: $primary-color-hover;
    }

    &.router-link-active {
      color: #fff;
      font-weight: 600;
    }
  }
}
</style>

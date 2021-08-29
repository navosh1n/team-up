<template>
  <div class="main-layout">
    <div class="main-layout__header">
      <router-link
        to="/"
        tag="h3"
        class="main-layout__title"
      >
        TeamUp
      </router-link>
      <header-menu class="main-layout__header-menu" />
      <mini-profile class="main-layout__mini-profile" />
    </div>

    <div class="main-layout__content">
      <div
        v-if="showAside"
        class="main-layout__aside"
      >
        <slot name="aside" />
      </div>

      <div class="main-layout__main">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import MiniProfile from '@/components/mini-profile';
import HeaderMenu from '@/components/header-menu';

export default {
  name: 'MainLayout',
  components: {
    HeaderMenu,
    MiniProfile,
  },
  computed: {
    showAside() {
      return !!this.$slots.aside;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/constants.scss";

.main-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &__header {
    @include page-horizontal-padding;

    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $page-header-height;
    background: #4a76a8;
    border-bottom: 1px solid #4872a3;
  }

  &__content {
    @include page-horizontal-padding;

    display: flex;
    justify-content: center;
    overflow: auto;
    height: 100%;
  }

  &__aside {
    padding: 20px 0;
    margin-right: 20px;
    width: 30%;
    min-width: 200px;
    max-width: 300px;
  }

  &__main {
    height: max-content;
    width: 100%;
    overflow: visible;
    padding: 20px 0;
    max-width: $page-content-max-width;
  }

  &__title {
    width: 200px;
    height: 100%;
    margin: 0;
    text-align: center;
    line-height: $page-header-height;
    color: #fff;
    cursor: pointer;
  }

  &__header-menu {
    margin: 0 20px;
  }

  &__mini-profile {
    width: 200px;
  }
}
</style>

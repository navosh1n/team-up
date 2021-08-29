<template>
  <div class="app-block">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'AppBlock',
};
</script>

<style lang="scss" scoped>
.app-block {
  padding: 15px;
  min-height: 50px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 0 0 #d7d8db, 0 0 0 1px #e3e4e8;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
}
</style>

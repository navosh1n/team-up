<template>
  <div
    v-loading="true"
    class="loading-stub"
  />
</template>

<script>
export default {
  name: 'LoadingStub',
};
</script>

<style lang="scss" scoped>
.loading-stub {
  width: 100%;
  height: 50px;
}
</style>

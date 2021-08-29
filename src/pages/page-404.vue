<template>
  <div class="page-404">
    <h1>Page 404</h1>
    <router-link to="/">
      На главную
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Page404',
};
</script>

<style scoped>
.page-404 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  text-align: center;
}
</style>

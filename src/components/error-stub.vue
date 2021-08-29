<template>
  <div class="error-stub">
    <el-card>
      <el-alert
        :title="title"
        type="error"
        :description="description"
        show-icon
        :closable="false"
      />
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ErrorStub',

  props: {
    title: {
      type: String,
    },

    description: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.error-stub {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}
</style>

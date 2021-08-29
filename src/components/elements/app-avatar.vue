<template>
  <el-avatar
    :src="src"
    :size="size"
    class="user__avatar"
  >
    {{ name }}
  </el-avatar>
</template>

<script>
export default {
  name: 'AppAvatar',

  props: {
    src: String,
    size: String,
    firstName: String,
    lastName: String,
  },

  computed: {
    name() {
      const { firstName = '', lastName = '' } = this;
      return (firstName[0] + lastName[0]).toUpperCase();
    },
  },
};
</script>

<style lang="scss">
.el-avatar--small {
  min-width: 28px;
  font-size: 12px;
}
</style>

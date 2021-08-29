<template>
  <el-rate
    v-bind="$attrs"
    :value="value"
    :texts="['Неуверенный ответ', 'Есть сомнения', 'Уверенный ответ']"
    show-text
    text-color="#666"
    :max="3"
    class="confidence-rate"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'ConfidenceRate',

  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
.confidence-rate {
  ::v-deep .el-rate__text {
    font-size: 12px;
  }
}
</style>

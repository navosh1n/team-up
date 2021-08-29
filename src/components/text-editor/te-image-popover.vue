<template>
  <el-popover
    v-model="visible"
    placement="right"
    width="400"
    trigger="click"
    popper-class="te-image-popover"
  >
    <div class="te-image-popover__wrap">
      <el-input
        v-model.lazy.trim="src"
        :disabled="loading"
        placeholder="Ссылка на изображение"
        class="te-image-popover__src"
      />
      <el-button
        type="primary"
        size="small"
        :loading="loading"
        :disabled="!src || loading"
        class="te-image-popover__add-btn"
        @click="onAdd"
      >
        Добавить
      </el-button>
    </div>
    <template slot="reference">
      <slot />
    </template>
  </el-popover>
</template>

<script>
import { checkImage } from '@/utils/image';

export default {
  name: 'TeImagePopover',

  data: () => ({
    src: '',
    visible: false,
    loading: false,
  }),

  methods: {
    async onAdd() {
      try {
        this.loading = true;
        await checkImage(this.src);
        this.$emit('change', this.src);
        this.src = '';
        this.visible = false;
      } catch (e) {
        this.$notify({
          type: 'error',
          title: 'Ошибка!',
          message: 'Произошла ошибка во время загрузки изображения.',
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.te-image-popover {
  &__add-btn {
    display: block;
    margin: 20px 0 0 auto;
    width: 110px;
  }
}
</style>

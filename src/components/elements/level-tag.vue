<template>
  <el-tag
    :type="levelType"
    :size="size"
  >
    {{ levelText }}
  </el-tag>
</template>

<script>
import { levels } from '@/constants/levels';

export default {
  name: 'LevelTag',

  props: {
    level: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
    },
  },

  computed: {
    levelText() {
      return levels[this.level] || '-';
    },

    levelType() {
      const { level } = this;
      if (level <= 1) {
        return 'info';
      }
      if (level >= 2 && level <= 4) {
        return 'success';
      }
      if (level >= 5 && level <= 7) {
        return 'warning';
      }
      if (level >= 8) {
        return 'danger';
      }
      return '';
    },
  },
};
</script>

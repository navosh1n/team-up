<template>
  <app-block class="questions-filters">
    <el-row
      type="flex"
      align="middle"
      justify="space-between"
      :gutter="10"
    >
      <el-col :span="12">
        <el-input
          v-model="search"
          clearable
          placeholder="Поиск"
          @keypress.enter.native="query = search"
          @clear="query = undefined"
          @change="query = search"
        />
      </el-col>

      <el-col :span="4">
        <el-select
          clearable
          placeholder="Уровень"
          class="questions-filters__select"
          :value="filters.level"
          @change="onChangeFilters('level', $event)"
        >
          <el-option
            v-for="(item, key) in levels"
            :key="key"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-col>

      <el-col :span="4">
        <el-select
          clearable
          placeholder="Категория"
          class="questions-filters__select"
          :value="filters.categoryId"
          @change="onChangeFilters('categoryId', $event)"
        >
          <el-option
            v-for="({ id, name }) in categories"
            :key="id"
            :label="name"
            :value="id"
          />
        </el-select>
      </el-col>

      <el-col :span="4">
        <el-select
          clearable
          placeholder="Тип"
          class="questions-filters__select"
          :value="filters.type"
          @change="onChangeFilters('type', $event)"
        >
          <el-option
            v-for="(name, key) in questionTypesLabels"
            :key="key"
            :label="name"
            :value="key"
          />
        </el-select>
      </el-col>

      <el-col :span="4">
        <el-select
          clearable
          placeholder="Статус"
          class="questions-filters__select"
          :value="filters.status"
          @change="onChangeFilters('status', $event)"
        >
          <el-option
            v-for="(name, key) in statuses"
            :key="key"
            :label="name"
            :value="key"
          />
        </el-select>
      </el-col>
    </el-row>
  </app-block>
</template>

<script>
import AppBlock from '@/components/elements/app-block';
import { levels } from '@/constants/levels';
import { questionStatuses, questionTypesLabels } from '@/constants/questions';

export default {
  name: 'QuestionsFilters',

  components: { AppBlock },

  props: {
    filters: {
      type: Object,
      required: true,
    },
    categories: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    levels,
    search: '',
    statuses: questionStatuses,
    questionTypesLabels,
  }),

  computed: {
    query: {
      get() {
        return this.filters.query;
      },
      set(value) {
        if (value === this.filters.query) return;
        this.onChangeFilters('query', value);
      },
    },
  },

  mounted() {
    this.search = this.filters.query;
  },

  methods: {
    onChangeFilters(name, value) {
      this.$emit('change', { ...this.filters, [name]: value || undefined });
    },
  },
};
</script>

<style lang="scss" scoped>
.questions-filters {
  &__select {
    width: 100%;
  }
}
</style>

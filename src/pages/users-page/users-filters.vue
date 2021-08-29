<template>
  <app-block class="users-filters">
    <el-row
      type="flex"
      align="middle"
      justify="space-between"
      :gutter="10"
    >
      <el-col :span="16">
        <el-input
          v-model="search"
          clearable
          placeholder="Поиск"
          @keypress.enter.native="query = search"
          @clear="query = undefined"
        >
          <el-select
            slot="prepend"
            :value="selectedType"
            class="users-filters__type"
            @change="onChangeSelectedType"
          >
            <el-option
              v-for="type of typeOptions"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-input>
      </el-col>

      <el-col :span="4">
        <el-select
          v-model="filters.cityId"
          clearable
          placeholder="Город"
          class="users-filters__city"
          @change="onChangeFilters('cityId', $event)"
        >
          <el-option
            v-for="item in cities"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col>

      <el-col :span="4">
        <el-select
          v-model="filters.roleId"
          clearable
          placeholder="Роль"
          class="users-filters__role"
          @change="onChangeFilters('roleId', $event)"
        >
          <el-option
            v-for="role in roles"
            :key="role.id"
            :label="role.name"
            :value="role.id"
          />
        </el-select>
      </el-col>
    </el-row>
  </app-block>
</template>

<script>
import AppBlock from '@/components/elements/app-block';

const typeOptions = [
  { value: 'fio', label: 'ФИО' },
  { value: 'email', label: 'Email' },
];

export default {
  name: 'UsersFilters',

  components: { AppBlock },

  props: {
    filters: {
      type: Object,
      required: true,
    },

    cities: {
      type: Object,
      required: true,
    },

    roles: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    selectedType: typeOptions[0].value,
    search: '',
    typeOptions,
  }),

  computed: {
    query: {
      get() {
        return this.filters[this.selectedType];
      },
      set(value) {
        this.onChangeFilters(this.selectedType, value);
      },
    },
  },

  async created() {
    const email = this.filters[typeOptions[1].value];
    this.selectedType = email ? typeOptions[1].value : typeOptions[0].value;
    await this.$nextTick();
    this.search = this.query;
  },

  methods: {
    onChangeFilters(name, value) {
      this.$emit('change', { ...this.filters, [name]: value || undefined });
    },

    onChangeSelectedType(type) {
      const oldType = this.selectedType;

      this.$emit('change', {
        ...this.filters,
        [oldType]: undefined,
        [type]: this.filters[oldType],
      });

      this.selectedType = type;
    },
  },
};
</script>

<style lang="scss" scoped>
.users-filters {
  &__type {
    width: 90px;
  }

  &__city {
    width: 100%;
  }
}
</style>

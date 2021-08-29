<template>
  <el-dialog
    :title="getText('title')"
    visible
    custom-class="testing-modal"
    @close="onClose"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="120px"
    >
      <el-form-item label="Пользователь:">
        {{ user.firstName }} {{ user.lastName }}
      </el-form-item>

      <el-form-item
        label="Время"
        prop="time"
      >
        <el-input-number
          v-model="form.time"
          controls-position="right"
          :min="10"
          :max="60"
          :step="10"
        />
      </el-form-item>

      <el-form-item
        v-if="isShowLevel"
        label="Уровень"
        prop="level"
      >
        <el-select v-model="form.level">
          <el-option
            v-for="(level, key) in levels"
            :key="key"
            :label="level"
            :value="+key"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="Категории"
        prop="categories"
      >
        <el-select
          v-model="form.categories"
          :loading="loadingCategories"
          multiple
          :multiple-limit="10"
        >
          <el-option
            v-for="({ id, name }) of categories"
            :key="id"
            :label="name"
            :value="id"
          />
        </el-select>
      </el-form-item>

      <div class="testing-modal__actions">
        <el-button
          :loading="sending"
          type="primary"
          @click="onSubmit"
        >
          Запустить
        </el-button>

        <el-button @click="onClose">
          Отмена
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { levels } from '@/constants/levels';
import { testingModeTypes } from '@/constants/testing';

const texts = {
  title: {
    [testingModeTypes.testing]: 'Запустить режим тестирования',
  },
};

const rules = {
  required: { required: true, message: 'Обязательное поле' },
};

export default {
  name: 'TestingModal',

  props: {
    mode: {
      type: String,
      required: true,
    },

    user: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    levels,
    sending: false,
    loadingCategories: false,

    form: {
      time: 40,
      level: null,
      categories: [],
    },

    rules: {
      time: [rules.required],
      level: [rules.required],
      categories: [rules.required],
    },
  }),

  computed: {
    ...mapState('categories', ['categories']),
    ...mapState('users', ['currentUser']),

    isShowLevel() {
      return this.mode === testingModeTypes.interview;
    },
  },

  async created() {
    this.loadingCategories = true;
    await this.loadCategories();
    this.loadingCategories = false;
  },

  methods: {
    ...mapActions({
      loadCategories: 'categories/loadCategories',
      createTesting: 'testing/createTesting',
    }),

    getText(key) {
      return texts[key][this.mode];
    },

    onClose() {
      this.$emit('close');
    },

    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) { return; }
        try {
          this.sending = true;
          const id = await this.createTesting({
            ...this.form,
            mode: this.mode,
            interviewerId: this.currentUser.id,
            intervieweeId: this.user.id,
          });
          this.$emit('submit', id);
        } catch (e) {
          console.error(e);
          this.$message({
            type: 'error',
            message: e.message,
          });
        } finally {
          this.sending = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.testing-modal {
  ::v-deep &.el-dialog {
    width: 100%;
    max-width: 450px;
  }

  &__actions {
    display: flex;
    justify-content: center;
  }
}
</style>

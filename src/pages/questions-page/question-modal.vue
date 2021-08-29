<template>
  <el-dialog
    :title="getText('title')"
    visible
    custom-class="question-modal"
    @close="onClose"
  >
    <el-form
      ref="form"
      :model="form"
      :disabled="sending"
      :rules="rules"
      label-position="right"
      label-width="110px"
    >
      <el-form-item
        label="Вопрос"
        prop="title"
      >
        <el-input
          v-model="form.title"
          type="textarea"
          autosize
          maxlength="200"
        />
      </el-form-item>

      <el-form-item
        label="Тип"
        prop="type"
      >
        <el-select v-model.number="form.type">
          <el-option
            v-for="(label, key) in questionTypesLabels"
            :key="key"
            :label="label"
            :value="key"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="Уровень"
        prop="level"
      >
        <el-select v-model.number="form.level">
          <el-option
            v-for="(item, key) in levels"
            :key="key"
            :label="item"
            :value="+key"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="Категория"
        prop="categoryId"
      >
        <el-select
          :value="form.categoryId"
          :loading="creatingCategory"
          allow-create
          filterable
          @change="onChangeCategory"
        >
          <el-option
            v-for="({ id, name }) in categories"
            :key="id"
            :label="name"
            :value="id"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="Статус"
        prop="status"
      >
        <el-select v-model.number="form.status">
          <el-option
            v-for="(item, key) in questionStatuses"
            :key="key"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="Описание"
        prop="description"
      >
        <text-editor
          v-model="form.description"
          :disabled="sending"
        />
      </el-form-item>

      <el-form-item
        label="Подсказка"
        prop="help"
      >
        <el-input
          v-model="form.help"
          type="textarea"
          autosize
          maxlength="300"
        />
      </el-form-item>

      <el-form-item
        label="Литература"
        prop="literature"
      >
        <el-input
          v-model="form.literature"
          type="textarea"
          autosize
          maxlength="300"
        />
      </el-form-item>

      <div class="question-modal__actions">
        <el-button
          :loading="sending"
          type="primary"
          @click="submit"
        >
          Сохранить
        </el-button>
        <el-button
          :disabled="sending"
          @click="onClose"
        >
          Отмена
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import { levels } from '@/constants/levels';
import cloneDeep from 'lodash/cloneDeep';
import {
  questionStatuses,
  questionStatusTypes,
  questionTypes,
  questionTypesLabels,
} from '@/constants/questions';
import TextEditor from '@/components/text-editor/text-editor';

const texts = {
  title: ['Добавить вопрос', 'Редактировать вопрос'],
};

const rules = {
  required: { required: true, message: 'Обязательное поле' },
};

export default {
  name: 'QuestionModal',

  components: { TextEditor },

  props: {
    question: {
      type: Object,
      default: null,
    },
    categories: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    questionTypesLabels,
    sending: false,
    creatingCategory: false,

    levels,
    questionStatuses,

    form: {
      title: '',
      type: questionTypes.verbal,
      description: '',
      help: '',
      literature: '',
      level: '',
      categoryId: '',
      status: questionStatusTypes.draft,
    },

    rules: {
      title: [{ ...rules.required, min: 5 }],
      type: [rules.required],
      level: [rules.required],
      categoryId: [rules.required],
      status: [rules.required],
    },
  }),

  computed: {
    isEditing() {
      return !!this.question;
    },
  },

  created() {
    if (this.question) {
      this.form = Object.keys(this.form).reduce((res, key) => {
        res[key] = this.question[key] !== undefined
          ? cloneDeep(this.question[key])
          : this.form[key];
        return res;
      }, {});
    }
  },

  methods: {
    ...mapActions({
      updateQuestion: 'questions/updateQuestion',
      createQuestion: 'questions/createQuestion',
      createCategory: 'categories/createCategory',
    }),

    getText(key) {
      return texts[key][+this.isEditing];
    },

    async onChangeCategory(categoryId) {
      if (this.categories[categoryId]) {
        this.form.categoryId = categoryId;
      } else {
        try {
          await this.$confirm(
            'Вы действительно хотите добавить новую категорию?',
            'Такой категории не существует',
            {
              confirmButtonText: 'Да',
              cancelButtonText: 'Отмена',
              type: 'warning',
            },
          );

          this.creatingCategory = true;
          const category = await this.createCategory(categoryId);
          this.form.categoryId = category.id;
          this.creatingCategory = false;
        } catch (e) {
          if (e !== 'cancel') throw e;
        }
      }
    },

    submit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) { return; }
        try {
          this.sending = true;
          await (
            this.question
              ? this.updateQuestion({ ...this.question, ...this.form })
              : this.createQuestion(this.form)
          );
          this.$emit('submit');
        } catch (e) {
          console.error(e);
        } finally {
          this.sending = false;
        }
      });
    },

    onClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.question-modal {
  ::v-deep &.el-dialog {
    width: 100%;
    max-width: 550px;
  }

  &__actions {
    display: flex;
    justify-content: center;
  }
}
</style>

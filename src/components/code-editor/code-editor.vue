<template>
  <div class="code-editor">
    <el-select
      v-model="currentLanguage"
      filterable
      size="small"
      placeholder="Авто"
      :disabled="disabled"
      class="code-editor__select"
      @change="onChangeLanguage"
    >
      <el-option
        v-for="language of languages"
        :key="language.id"
        :value="language.id"
      >
        {{ language.id }}
      </el-option>
    </el-select>
    <div
      ref="editor"
      class="code-editor__container"
    />
  </div>
</template>

<script>
import * as monaco from 'monaco-editor';

const defaultLanguage = 'javascript';

export default {
  name: 'CodeEditor',

  props: {
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: defaultLanguage,
    },
  },

  data: () => ({
    editor: null,
    currentLanguage: defaultLanguage,
  }),

  computed: {
    languages() {
      return monaco.languages.getLanguages();
    },
  },

  watch: {
    value(value) {
      this.editor.getModel().setValue(value);
    },
    language(value) {
      this.currentLanguage = value;
      this.onChangeLanguage(value);
    },
  },

  mounted() {
    this.editor = monaco.editor.create(this.$refs.editor, {
      value: this.value,
      language: this.language,
      theme: 'vs-dark',
      automaticLayout: true,
      readOnly: this.disabled,
    });

    this.editor.getModel().updateOptions({ tabSize: 2 });

    !this.disabled && this.editor.onDidChangeModelContent(() => {
      this.onChangeValue();
    });
  },

  methods: {
    onChangeLanguage(language) {
      monaco.editor.setModelLanguage(this.editor.getModel(), language);
      this.onChangeValue();
    },

    onChangeValue() {
      this.$emit('input', { value: this.editor.getValue(), language: this.currentLanguage });
    },
  },
};
</script>

<style lang="scss" scoped>
.code-editor {
  position: relative;

  &__container {
    border-radius: 4px;
    padding-top: 42px;
    min-height: 500px;
    background: #1e1e1e;
  }

  &__select {
    margin-bottom: 10px;
    position: absolute;
    right: 5px;
    top: 5px;

    ::v-deep .el-input {
      opacity: 0.6;

      &:hover,
      &.is-focus {
        opacity: 1;
      }
    }
  }
}
</style>

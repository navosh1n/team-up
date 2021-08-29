<template>
  <node-view-wrapper class="te-code-block">
    <el-select
      v-model="selectedLanguage"
      size="small"
      placeholder="Авто"
      class="te-code-block__select"
    >
      <el-option
        v-for="(language, index) in languages"
        :key="index"
        :value="language"
      >
        {{ language }}
      </el-option>
    </el-select>
    <pre class="te-code-block__code"><node-view-content as="code" /></pre>
  </node-view-wrapper>
</template>

<script>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-2';
import 'highlight.js/scss/darcula.scss';

export default {
  name: 'TeCodeBlock',

  components: {
    NodeViewWrapper,
    NodeViewContent,
  },

  props: nodeViewProps,

  data() {
    return {
      languages: this.extension.options.lowlight.listLanguages(),
    };
  },

  computed: {
    selectedLanguage: {
      get() {
        return this.node.attrs.language;
      },
      set(language) {
        this.updateAttributes({ language });
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.te-code-block {
  position: relative;
  background: #2b2b2b;
  border-radius: 10px;

  color: white;
  line-height: 1.5;

  &__code {
    padding: 10px 15px;
    margin: 0;
    min-height: 53px;
    max-height: 200px;
    overflow: auto;
  }

  &__select {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 110px;
    opacity: 0.7;

    &:hover,
    &:focus {
      opacity: 1;
    }
  }
}
</style>

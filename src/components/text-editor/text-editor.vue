<template>
  <div
    v-if="editor"
    class="text-editor"
    :class="{'text-editor_preview': preview}"
  >
    <div
      v-if="!preview"
      class="text-editor__menu"
    >
      <te-image-popover @change="onAddImage">
        <el-button
          size="small"
          type="text"
          :disabled="disabled"
          class="text-editor__menu-btn"
        >
          <image-icon />
        </el-button>
      </te-image-popover>
      <el-button
        size="small"
        type="text"
        :disabled="disabled"
        class="text-editor__menu-btn"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        <code-icon />
      </el-button>
    </div>
    <editor-content
      :editor="editor"
      class="text-editor__content"
    />
  </div>
</template>

<script>
import { Editor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TeCodeBlock from '@/components/text-editor/te-code-block';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';

import lowlight from 'lowlight/lib/core.js';
import CodeIcon from '@/components/icons/code-icon';
import TeImagePopover from '@/components/text-editor/te-image-popover';
import ImageIcon from '@/components/icons/image-icon';

lowlight.registerLanguage('javascript', javascript);
lowlight.registerLanguage('typescript', typescript);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('scss', scss);
lowlight.registerLanguage('html', xml);

export default {
  name: 'TextEditor',

  components: {
    ImageIcon,
    TeImagePopover,
    CodeIcon,
    EditorContent,
  },

  props: {
    value: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    preview: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    editor: null,
  }),

  watch: {
    value(value) {
      if (this.editor.getHTML() === value) return;
      this.editor.commands.setContent(this.value, false);
    },
    disabled(value) {
      this.editor.setOptions({ editable: !value });
    },
  },

  mounted() {
    this.editor = new Editor({
      content: this.value,
      editable: !this.disabled,
      extensions: [
        StarterKit,
        ImageExtension,
        CodeBlockLowlight
          .extend({
            addNodeView() {
              return VueNodeViewRenderer(TeCodeBlock);
            },
          })
          .configure({ lowlight }),
      ],
      onUpdate: () => {
        this.$emit('input', this.editor.getHTML());
      },
    });
  },

  beforeDestroy() {
    this.editor.destroy();
  },

  methods: {
    onAddImage(src) {
      this.editor.chain().focus().setImage({ src }).run();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/constants.scss";

.text-editor {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;

  &_preview {
    border: none;
  }

  &__menu {
    display: flex;
    align-items: center;
    padding: 5px;
    line-height: 0;
    border-bottom: 1px solid #dcdfe6;
  }

  &__menu-btn {
    padding: 0;
    width: 24px;
    height: 24px;
    margin-right: 10px;

    &.is-active {
      border: none;

      svg {
        fill: $primary-color;
      }
    }
  }

  &__content {
    display: block;
    box-sizing: border-box;
    width: 100%;
    font-size: inherit;
    color: #606266;
    line-height: 1.5;

    ::v-deep {
      .ProseMirror {
        padding: 5px;
        outline: none !important;

        & > p {
          margin: 0;
        }

        img {
          max-width: 100%;
        }
      }
    }
  }
}
</style>

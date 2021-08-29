<template>
  <div
    ref="codeBlock"
    class="code-block"
    v-html="htmlContent"
  />
</template>

<script>
import lowlight from 'lowlight/lib/core.js';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import hljs from 'highlight.js/lib';
import { htmlDecode } from '@/utils/string';
import 'highlight.js/scss/darcula.scss';

lowlight.registerLanguage('javascript', javascript);
lowlight.registerLanguage('typescript', typescript);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('scss', scss);
lowlight.registerLanguage('html', xml);

export default {
  name: 'HtmlPreviewBlock',

  props: {
    value: {
      type: String,
      default: '',
    },
  },

  computed: {
    htmlContent() {
      const $wrapper = document.createElement('div');
      $wrapper.innerHTML = this.value;

      const $code = $wrapper.querySelectorAll('code');

      $code.forEach(item => {
        item.innerHTML = hljs.highlightAuto(htmlDecode(item.innerHTML)).value;
      });

      return $wrapper.innerHTML;
    },
  },
};
</script>

<style lang="scss" scoped>
.code-block {
  ::v-deep {
    img {
      width: 100%;
    }

    pre {
      background: #2b2b2b;
      border-radius: 10px;
      padding: 10px 15px;
      margin: 0;
      min-height: 53px;
      max-height: 200px;
      overflow: auto;
      color: white;
    }
  }
}
</style>

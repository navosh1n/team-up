<template>
  <app-block class="testing-controls">
    <div class="testing-controls__answer-controls">
      <div class="testing-controls__answers">
        <el-radio
          v-model="form.answer"
          :label="2"
          size="small"
          border
          :disabled="disabled"
        >
          Правильный ответ
        </el-radio>
        <el-radio
          v-model="form.answer"
          :label="1"
          size="small"
          border
          :disabled="disabled"
        >
          Неполный ответ
        </el-radio>
        <el-radio
          v-model="form.answer"
          :label="0"
          size="small"
          border
          :disabled="disabled"
        >
          Неправильный ответ
        </el-radio>
      </div>

      <div class="testing-controls__confidence">
        <span>Уверенность ответа:</span>
        <confidence-rate
          v-model="form.confidence"
          :disabled="disabled"
        />
      </div>

      <el-input
        v-model="form.comment"
        type="textarea"
        :disabled="disabled"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="Комментарий"
        class="testing-controls__comment"
      />
    </div>

    <div class="testing-controls__question-controls">
      <el-button
        v-if="isShowCopyLink"
        type="info"
        plain
        :disabled="disabled"
        icon="el-icon-link"
        class="testing-controls__next"
        @click="onCopyLink"
      >
        Скопировать ссылку
      </el-button>

      <el-button
        type="primary"
        icon="el-icon-arrow-right"
        :disabled="typeof form.answer !== 'number' || disabled"
        class="testing-controls__next"
        @click="onNext"
      >
        Следующий вопрос
      </el-button>

      <el-button
        size="small"
        :disabled="disabled"
        class="testing-controls__skip"
        @click="onSkip"
      >
        Пропустить вопрос
      </el-button>

      <el-popover
        placement="bottom"
        width="200"
      >
        <p>Вы действительно хотите завершить тестирование?</p>

        <div style="text-align: right; margin: 0">
          <el-button
            type="primary"
            size="mini"
            @click="onFinish"
          >
            Да
          </el-button>
        </div>

        <el-button
          slot="reference"
          type="danger"
          :disabled="disabled"
          class="testing-controls__submit"
        >
          Завершить
        </el-button>
      </el-popover>
    </div>
  </app-block>
</template>

<script>
import AppBlock from '@/components/elements/app-block';
import ConfidenceRate from '@/components/elements/confidence-rate';
import { questionTypes } from '@/constants/questions';

export default {
  name: 'TestingControls',

  components: { ConfidenceRate, AppBlock },

  props: {
    time: {
      type: Number,
      required: true,
    },

    question: {
      type: Object,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    form: {
      answer: null,
      comment: '',
      confidence: 0,
    },
  }),

  computed: {
    isShowCopyLink() {
      return [questionTypes.visual, questionTypes.liveCode].includes(this.question.type);
    },
  },

  watch: {
    question: {
      immediate: true,
      handler(value, oldValue) {
        if (!value || value.id === oldValue?.id) return;
        const { answer = null, comment = '', confidence = 0 } = value;
        this.form = { answer, comment, confidence };
      },
    },
  },

  methods: {
    onNext() {
      this.$emit('next', this.form);
    },

    onSkip() {
      this.$emit('skip');
    },

    onFinish() {
      this.$emit('finish', this.form);
    },

    onCopyLink() {
      this.$emit('copy-link');
    },
  },
};
</script>

<style lang="scss" scoped>
.testing-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 20px;

  &__answer-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
  }

  &__question-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .el-button + .el-button {
      margin-left: 0;
    }
  }

  &__confidence {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 20px;
    font-size: 14px;

    & > span {
      margin-right: 10px;
    }

    ::v-deep .el-rate__text {
      font-size: 12px;
    }
  }

  &__comment {
    width: 100%;
    margin-top: 20px;
  }

  &__prev,
  &__next,
  &__skip,
  &__submit {
    width: 200px;
  }

  &__next {
    margin-bottom: 10px;
  }

  &__skip {
    margin-bottom: 10px;
  }

  &__answers {
    display: flex;
    justify-content: space-between;

    .el-radio {
      margin-right: 0;
    }
  }
}
</style>

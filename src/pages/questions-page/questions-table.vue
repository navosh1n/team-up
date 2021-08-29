<template>
  <el-table
    :data="questions"
    height="58vh"
    class="questions-table"
  >
    <el-table-column type="expand">
      <template slot-scope="props">
        <p>
          <b>Описание</b>:
          <html-preview-block :value="props.row.description" />
        </p>
        <p><b>Подсказка</b>: {{ props.row.help }}</p>
        <p
          v-if="props.row.literature"
          class="questions-table__literature"
        >
          <span><b>Литература</b>:</span>
          <el-input
            :value="props.row.literature"
            type="textarea"
            autosize
            readonly
            style="margin-top: 5px"
          />
        </p>
      </template>
    </el-table-column>

    <el-table-column
      label="№"
      width="50"
      align="center"
      type="index"
    />

    <el-table-column
      label="Вопрос"
      prop="title"
    />

    <el-table-column
      label="Уровень"
      align="center"
      width="100"
    >
      <template slot-scope="scope">
        <level-tag :level="scope.row.level" />
      </template>
    </el-table-column>

    <el-table-column
      label="Категория"
      align="center"
      width="100"
    >
      <template slot-scope="scope">
        {{ getCategory(scope.row.categoryId) }}
      </template>
    </el-table-column>

    <el-table-column
      label="Тип"
      width="110"
      align="center"
    >
      <template slot-scope="scope">
        {{ getQuestionType(scope.row.type) }}
      </template>
    </el-table-column>

    <el-table-column
      label="Статус"
      align="center"
      width="100"
    >
      <template slot-scope="scope">
        {{ getQuestionStatus(scope.row.status) }}
      </template>
    </el-table-column>

    <el-table-column
      label="Дата"
      align="center"
      width="100"
    >
      <template slot-scope="scope">
        {{ getDate(scope.row.created.seconds * 1000) }}
      </template>
    </el-table-column>

    <el-table-column
      align="center"
      width="60"
    >
      <template slot-scope="scope">
        <el-dropdown v-if="getActions(scope.row.status).length">
          <i class="el-icon-more" />

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item of getActions(scope.row.status)"
              :key="item.label"
              @click.native="item.action(scope.row.id)"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters } from 'vuex';
import LevelTag from '@/components/elements/level-tag';
import { getQuestionStatus, getQuestionType } from '@/utils/question';
import { getDate } from '@/utils/date';
import { questionStatusTypes } from '@/constants/questions';

export default {
  name: 'QuestionsTable',

  components: {
    HtmlPreviewBlock: () => import('@/components/html-preview-block'),
    LevelTag,
  },

  props: {
    questions: {
      type: Array,
      required: true,
    },

    categories: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters('users', ['checkAccess']),
  },

  methods: {
    getQuestionStatus,
    getQuestionType,
    getDate,

    getActions(status) {
      const { cache } = this.getActions;

      if (cache && cache[status]) return cache[status];

      const actions = [
        {
          visible: status !== questionStatusTypes.ready && this.checkAccess('questions', 'update'),
          label: 'Редактировать',
          action: (id) => this.onAction('edit', id),
        },
        {
          visible: status !== questionStatusTypes.ready && this.checkAccess('questions', 'delete'),
          label: 'Удалить',
          action: (id) => this.onAction('delete', id),
        },
      ].filter(item => item.visible);

      this.getActions.cache = { [status]: actions };

      return actions;
    },

    getCategory(categoryId) {
      return this.categories[categoryId]?.name || '-';
    },

    onAction(event, id) {
      this.$emit(event, id);
    },
  },
};
</script>

<style lang="scss" scoped>
.questions-table {
  &__literature {
    display: flex;
    flex-direction: column;
  }

  .el-icon-more {
    cursor: pointer;
  }

  ::v-deep .cell {
    word-break: break-word;
  }
}
</style>

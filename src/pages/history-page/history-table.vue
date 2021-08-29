<template>
  <el-table
    :data="testing"
    height="70vh"
    class="history-table"
  >
    <el-table-column
      label="№"
      width="50"
      align="center"
      type="index"
    />
    <el-table-column
      label="Собеседуемый"
      align="center"
    >
      <template slot-scope="scope">
        {{ getUserName(scope.row.interviewee) || scope.row.intervieweeId }}
      </template>
    </el-table-column>
    <el-table-column
      label="Собеседующий"
      align="center"
    >
      <template slot-scope="scope">
        {{ getUserName(scope.row.interviewer) || scope.row.interviewerId }}
      </template>
    </el-table-column>
    <el-table-column
      label="Режим"
      align="center"
    >
      <template slot-scope="scope">
        {{ getTestingMode(scope.row.mode) }}
      </template>
    </el-table-column>
    <el-table-column
      label="Дата"
      align="center"
    >
      <template slot-scope="scope">
        {{ getDate(scope.row.startedAt) }}
      </template>
    </el-table-column>
    <el-table-column
      label="Статус"
      align="center"
    >
      <template slot-scope="scope">
        <el-tag :type="getStatusType(scope.row.status)">
          {{ getTestingStatus(scope.row.status) }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="Действия"
      align="center"
    >
      <template slot-scope="scope">
        <el-button
          v-for="action of getActions(scope.row)"
          :key="action.label"
          size="mini"
          round
          @click="onAction(scope.row.status, scope.row.id)"
        >
          {{ action.label }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { testingStatusTypes } from '@/constants/testing';
import { RouteTypes } from '@/router';
import { getUserName } from '@/utils/user';
import { getTestingMode, getTestingStatus } from '@/utils/testing';

export default {
  name: 'HistoryTable',

  props: {
    currentUserId: {
      type: String,
      required: true,
    },

    testing: {
      type: Array,
      required: true,
    },
  },

  methods: {
    getUserName,
    getTestingMode,
    getTestingStatus,

    getActions(testing) {
      const { inProgress, finished } = testingStatusTypes;
      return [
        {
          visible: testing.status === inProgress && testing.interviewerId === this.currentUserId,
          label: 'Продолжить',
        },
        {
          visible: testing.status === finished,
          label: 'Результат',
        },
      ].filter(item => item.visible);
    },

    getStatusType(status) {
      return {
        [testingStatusTypes.inProgress]: 'success',
        [testingStatusTypes.finished]: 'info',
      }[status] || '-';
    },

    getDate({ seconds }) {
      return new Date(seconds * 1000).toLocaleDateString();
    },

    onAction(status, id) {
      const name = status === testingStatusTypes.inProgress
        ? RouteTypes.TestingPage
        : RouteTypes.ResultsPage;

      this.$router.push({ name, params: { id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.history-table {
  ::v-deep .cell {
    word-break: break-word;
  }
}
</style>

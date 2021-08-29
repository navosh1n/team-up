<template>
  <el-table
    :data="users"
    max-height="500px"
  >
    <el-table-column
      label="№"
      width="50"
      type="index"
    />
    <el-table-column
      label="Пользователь"
    >
      <template slot-scope="scope">
        <div class="users-table__user">
          <app-avatar
            :src="scope.row.photo"
            size="small"
            :first-name="scope.row.firstName"
            :last-name="scope.row.lastName"
            class="user__avatar"
          />
          {{ scope.row.lastName }} {{ scope.row.firstName }}
        </div>
      </template>
    </el-table-column>

    <el-table-column
      label="Город"
      width="150"
    >
      <template slot-scope="scope">
        {{ getUserCity(scope.row.cityId) }}
      </template>
    </el-table-column>

    <el-table-column label="Роли">
      <template slot-scope="scope">
        {{ getUserRoles(scope.row.workspaces) }}
      </template>
    </el-table-column>

    <el-table-column
      width="60"
    >
      <template slot-scope="scope">
        <el-dropdown v-if="getActions(scope.row.id).length">
          <i class="el-icon-more el-icon--right" />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item of getActions(scope.row.id)"
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
import AppAvatar from '@/components/elements/app-avatar';
import { testingModes, testingModeTypes } from '@/constants/testing';

export default {
  name: 'UsersTable',

  components: { AppAvatar },

  props: {
    currentUserId: {
      type: String,
      required: true,
    },

    users: {
      type: Array,
      required: true,
    },

    cities: {
      type: Object,
      default: () => {},
    },

    workspaceId: {
      type: String,
      required: true,
    },

    roles: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    ...mapGetters('users', ['checkAccess']),
  },

  methods: {
    getActions(userId) {
      const { cache } = this.getActions;

      if (cache && cache[userId]) return cache[userId];

      const actions = [
        {
          visible: userId !== this.currentUserId && this.checkAccess(
            'testing',
            testingModeTypes.testing,
          ),
          label: testingModes.testing,
          action: (id) => this.onAction(testingModeTypes.testing, id),
        },
        {
          visible: this.checkAccess('users', 'update'),
          label: 'Редактировать',
          action: (id) => this.onAction('edit', id),
        },
        {
          visible: this.checkAccess('users', 'delete'),
          label: 'Удалить',
          action: (id) => this.onAction('delete', id),
        },
      ].filter(item => item.visible);

      this.getActions.cache = { [userId]: actions };

      return actions;
    },

    getUserCity(id) {
      return this.cities[id]?.name;
    },

    getUserRoles(workspaces = {}) {
      const { roles = [] } = workspaces[this.workspaceId] || {};
      return roles.map(roleId => this.roles[roleId]?.name).join(', ') || '-';
    },

    onAction(event, id) {
      this.$emit(event, id);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-icon-more {
  cursor: pointer;
}

.users-table {
  &__user {
    display: inline-flex;
    align-items: center;

    .user__avatar {
      margin-right: 8px;
    }
  }
}
</style>

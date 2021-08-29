<template>
  <main-layout class="users-page">
    <users-filters
      v-loading="loadingCities"
      :filters="filters"
      :cities="citiesMap"
      :roles="currentWorkspaceRolesMap"
      @change="onChangeFilters"
    />

    <app-block
      v-loading="loadingUsers"
      class="users-page__content"
    >
      <div class="users-page__actions">
        <el-button
          v-if="checkAccess('users', 'create')"
          icon="el-icon-plus"
          type="primary"
          plain
          size="medium"
          @click="toggleUserModal(true)"
        >
          Добавить пользователя
        </el-button>
      </div>

      <users-table
        :current-user-id="currentUser.id"
        :users="users"
        :cities="citiesMap"
        :workspace-id="currentWorkspace.id"
        :roles="currentWorkspaceRolesMap"
        @edit="onEditUser"
        @delete="onDeleteUser"
        @testing="onTesting"
      />

      <app-pagination
        :total="meta.total"
        :current-page="currentPage"
        :page-size="pagination.limit"
        @current-change="onChangeCurrentPage"
      />
    </app-block>

    <user-modal
      v-if="userModal.visible"
      :user="editableUser"
      :cities="citiesMap"
      :workspace-id="currentWorkspace.id"
      :roles="currentWorkspaceRolesMap"
      @submit="onSubmitUser"
      @close="toggleUserModal(false)"
    />

    <testing-modal
      v-if="testingModal.visible"
      :mode="testingModal.mode"
      :user="testingModal.user"
      @submit="onSubmitTesting"
      @close="toggleTestingModal(false)"
    />
  </main-layout>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import MainLayout from '@/components/layouts/main-layout';
import AppBlock from '@/components/elements/app-block';
import UsersFilters from '@/pages/users-page/users-filters';
import UsersTable from '@/pages/users-page/users-table';
import AppPagination from '@/components/elements/app-pagination';
import { paginationMixin } from '@/mixins/pagination-mixin';
import { filtersMixin } from '@/mixins/filters-mixin';
import { testingModeTypes } from '@/constants/testing';
import { RouteTypes } from '@/router';

export default {
  name: 'UsersPage',

  components: {
    TestingModal: () => import('@/pages/users-page/testing-modal'),
    UserModal: () => import('@/pages/users-page/user-modal'),
    AppPagination,
    UsersTable,
    UsersFilters,
    AppBlock,
    MainLayout,
  },

  mixins: [filtersMixin, paginationMixin],

  data: () => ({
    userModal: { visible: false, userId: null },
    testingModal: { visible: false },
    loadingUsers: false,
    loadingCities: false,
    filtersKeys: ['cityId', 'fio', 'email', 'roleId'],
  }),

  computed: {
    ...mapState('users', ['currentUser', 'users', 'meta']),
    ...mapState('workspaces', ['currentWorkspace']),
    ...mapGetters('roles', ['currentWorkspaceRolesMap']),
    ...mapGetters('cities', ['citiesMap']),
    ...mapGetters('users', ['checkAccess']),

    editableUser() {
      const { userId } = this.userModal;
      return this.users.find(({ id }) => id === userId);
    },
  },

  async created() {
    this.loadUsersByParams();
    this.loadingCities = true;
    await this.loadCities();
    this.loadingCities = false;
  },

  methods: {
    ...mapActions('cities', ['loadCities']),
    ...mapActions('users', ['loadUsers', 'deleteUser']),

    async loadUsersByParams(params = {}) {
      this.loadingUsers = true;

      const { limit } = this.pagination;

      await this.loadUsers({
        limit,
        offset: limit * (this.currentPage - 1),
        ...this.filters,
        ...params,
      });

      this.loadingUsers = false;
    },

    toggleUserModal(visible, userId) {
      this.userModal = { visible, userId };
    },

    toggleTestingModal(visible, mode, user) {
      this.testingModal = { visible, mode, user };
    },

    async onChangeCurrentPage(page) {
      await this.changeCurrentPage(page);
      this.loadUsersByParams();
    },

    async onChangeFilters(filters) {
      await this.changeFilters(filters);
      this.loadUsersByParams();
    },

    onEditUser(id) {
      this.toggleUserModal(true, id);
    },

    onSubmitUser() {
      this.toggleUserModal(false);
      this.loadUsersByParams();
    },

    async onDeleteUser(id) {
      try {
        await this.$confirm('Вы действительно хотите удалить пользователя?', 'Подтверждение', {
          confirmButtonText: 'Да',
          cancelButtonText: 'Отмена',
          type: 'warning',
        });

        this.loadingUsers = true;
        await this.deleteUser(id);
        this.loadUsersByParams();

        this.$message({
          type: 'success',
          message: 'Пользователь удален!',
        });
      } catch (e) {
        if (e === 'cancel') return;

        this.$message({
          type: 'error',
          message: 'Ошибка!',
        });
      }
    },

    onTesting(userId) {
      const user = this.users.find(item => item.id === userId);
      this.toggleTestingModal(true, testingModeTypes.testing, user);
    },

    onSubmitTesting(id) {
      this.toggleTestingModal(false);
      this.$router.push({ name: RouteTypes.TestingPage, params: { id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.users-page {
  &__content {
    margin-bottom: 40px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

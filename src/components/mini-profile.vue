<template>
  <el-dropdown
    trigger="click"
    placement="bottom"
    class="mini-profile"
  >
    <div class="el-dropdown-link mini-profile__profile">
      <app-avatar
        :src="currentUser.photo"
        size="small"
        :first-name="currentUser.firstName"
        :last-name="currentUser.lastName"
        class="mini-profile__avatar"
      />
      <span>{{ currentUser.firstName }}</span>
      <i class="el-icon-arrow-down el-icon--right" />
    </div>

    <el-dropdown-menu
      slot="dropdown"
      class="mini-profile__dropdown"
    >
      <div class="mini-profile__workspace">
        <span>Рабочее пространство:</span>
        <span>{{ workspaceName }}</span>
      </div>
      <el-dropdown-item
        disabled
        divided
      >
        Уведомления
      </el-dropdown-item>
      <el-dropdown-item disabled>
        Профиль
      </el-dropdown-item>
      <el-dropdown-item disabled>
        Пропущенные вопросы
      </el-dropdown-item>
      <el-dropdown-item
        divided
        @click.native="logout"
      >
        Выйти
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AppAvatar from '@/components/elements/app-avatar';

export default {
  name: 'MiniProfile',

  components: { AppAvatar },

  computed: {
    ...mapState('users', ['currentUser']),
    ...mapState('workspaces', ['currentWorkspace']),

    workspaceName() {
      return this.currentWorkspace?.name;
    },
  },

  methods: {
    ...mapActions('auth', ['signOutGoogle']),

    async logout() {
      try {
        await this.signOutGoogle();
      } catch ({ message }) {
        this.$notify.error({
          title: 'Ошибка',
          message,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/constants.scss";

.mini-profile {
  width: 100%;
  height: 100%;

  &__workspace {
    display: flex;
    flex-direction: column;
    padding: 10px 20px;

    span {
      font-size: 14px;
      line-height: 20px;

      &:first-child {
        font-size: 12px;
        color: #666;
      }
    }
  }

  &__profile {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    color: #fff;
    font-weight: 600;
    cursor: pointer;

    &:hover,
    &:focus {
      background-color: $primary-color-hover;
    }
  }

  &__avatar {
    margin-right: 8px;
    border: 1px solid rgba(232, 232, 232, .5);
  }

  &__dropdown {
    min-width: 150px;
  }
}
</style>

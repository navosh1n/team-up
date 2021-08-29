<template>
  <el-row
    class="auth-page"
    type="flex"
    justify="center"
    align="middle"
  >
    <el-col :span="6">
      <el-card
        v-loading="loading"
        shadow="always"
        class="auth-page__card"
      >
        <h2 class="auth-page__title">
          Авторизация
        </h2>

        <p class="auth-page__desc">
          Войдите с помощью корпоративного google-аккаунта
        </p>

        <el-button
          class="auth-button"
          @click="onLogin"
        >
          <div class="auth-button__content">
            <img
              src="~@/assets/images/google.svg"
              class="auth-button__icon"
            >
            Sign up with Google
          </div>
        </el-button>

        <el-alert
          v-if="error"
          title="Ошибка авторизации"
          type="error"
          :description="error.message"
          show-icon
          class="auth-page__error"
        />
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AuthPage',

  data: () => ({
    loading: false,
    error: null,
  }),

  methods: {
    ...mapActions(['loadCurrentUserData']),
    ...mapActions('auth', ['signInGoogle']),

    async onLogin() {
      this.loading = true;
      this.error = null;

      try {
        await this.signInGoogle();
        await this.loadCurrentUserData();
        this.$router.push('/');
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/animations.scss";

.auth-page {
  height: 100vh;
  width: 100%;
  background: linear-gradient(154deg, #0c4072, #fff);
  background-size: 400% 400%;
  animation: animate-bg 4s ease infinite;

  &__card {
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 49px 71px -30px rgba(27, 27, 81, 0.23);
  }

  &__title {
    color: #1a1d28;
    font-size: 22px;
    font-weight: 700;
    line-height: 27px;
    text-align: center;
    margin-top: 0;
  }

  &__desc {
    margin: 0 auto 20px;
    color: #1a1d28;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
  }

  &__error {
    margin-top: 20px;
  }
}

.auth-button {
  display: flex;
  margin: 0 auto;

  &__content {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__icon {
    width: 30px;
    height: 30px;
    margin-right: 15px;
  }
}
</style>

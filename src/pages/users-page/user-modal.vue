<template>
  <el-dialog
    :title="getText('title')"
    visible
    custom-class="user-modal"
    @close="onClose"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :disabled="sending"
      label-position="right"
      label-width="100px"
      class="user-modal__form"
    >
      <el-form-item
        label="Фамилия"
        prop="lastName"
      >
        <el-input v-model="form.lastName" />
      </el-form-item>

      <el-form-item
        label="Имя"
        prop="firstName"
      >
        <el-input v-model="form.firstName" />
      </el-form-item>

      <el-form-item
        label="Отчество"
        prop="middleName"
      >
        <el-input v-model="form.middleName" />
      </el-form-item>

      <el-form-item
        label="Город"
        prop="city"
      >
        <el-select
          :value="form.cityId"
          :loading="creatingCity"
          :disabled="creatingCity"
          filterable
          allow-create
          placeholder="Начните вводить название"
          style="width: 100%"
          @change="onChangeCity"
        >
          <el-option
            v-for="item in cities"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="Email"
        prop="email"
      >
        <el-input v-model="form.email" />
      </el-form-item>

      <el-form-item
        label="Роли"
        prop="roles"
      >
        <el-select
          v-model="userRoles"
          placeholder="Выберите роли"
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <div class="user-modal__actions">
        <el-button
          :loading="sending"
          type="primary"
          @click="onSubmit"
        >
          Сохранить
        </el-button>
        <el-button
          :disabled="sending"
          @click="onClose"
        >
          Отмена
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';

const texts = {
  title: ['Добавить пользователя', 'Редактировать пользователя'],
};

const rules = {
  required: { required: true, message: 'Обязательное поле' },
};

export default {
  name: 'UserModal',

  props: {
    user: {
      type: Object,
      default: null,
    },

    cities: {
      type: Object,
      default: () => [],
    },

    roles: {
      type: Object,
      required: true,
    },

    workspaceId: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    sending: false,
    creatingCity: false,

    form: {
      lastName: '',
      firstName: '',
      middleName: '',
      cityId: '',
      email: '',
      workspaces: {},
      defaultWorkspaceId: '',
    },

    rules: {
      lastName: [{ ...rules.required, min: 3, max: 15 }],
      firstName: [{ ...rules.required, min: 3, max: 15 }],
      cityId: [rules.required],
      email: [
        { type: 'email', message: 'Введите email' },
      ],
    },
  }),

  computed: {
    isEditing() {
      return !!this.user;
    },

    currentUserWorkspace() {
      return this.form.workspaces[this.workspaceId] || {};
    },

    userRoles: {
      get() {
        const { roles = [] } = this.currentUserWorkspace;
        return roles;
      },
      set(roles) {
        this.$set(this.form.workspaces, this.workspaceId, {
          ...this.currentUserWorkspace,
          roles,
        });
      },
    },
  },

  created() {
    if (this.user) {
      this.form = Object.keys(this.form).reduce((res, key) => {
        res[key] = this.user[key] !== undefined ? cloneDeep(this.user[key]) : this.form[key];
        return res;
      }, {});
    } else {
      this.form.defaultWorkspaceId = this.workspaceId;
    }
  },

  methods: {
    ...mapActions('users', ['createUser', 'updateUser']),
    ...mapActions('cities', ['createCity']),

    getText(key) {
      return texts[key][+this.isEditing];
    },

    async onChangeCity(value) {
      if (this.cities[value]) {
        this.form.cityId = value;
      } else {
        try {
          await this.$confirm(
            'Вы действительно хотите добавить новый город?',
            'Такого города не существует',
            {
              confirmButtonText: 'Да',
              cancelButtonText: 'Отмена',
              type: 'warning',
            },
          );

          this.creatingCity = true;
          const city = await this.createCity(value);
          this.form.cityId = city.id;

          this.creatingCity = false;
        } catch (e) {
          if (e !== 'cancel') throw e;
        }
      }
    },

    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) { return; }
        try {
          this.sending = true;
          await (
            this.isEditing
              ? this.updateUser({ ...this.user, ...this.form })
              : this.createUser(this.form)
          );
          this.$emit('submit');
        } catch (e) {
          console.error(e);
        } finally {
          this.sending = false;
        }
      });
    },

    onClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.user-modal {
  ::v-deep &.el-dialog {
    width: 100%;
    max-width: 550px;
  }

  &__actions {
    display: flex;
    justify-content: center;
  }
}
</style>

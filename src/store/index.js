import Vue from 'vue';
import Vuex from 'vuex';
import cities from '@/store/modules/cities';
import users from '@/store/modules/users';
import auth from '@/store/modules/auth';
import categories from '@/store/modules/categories';
import questions from '@/store/modules/questions';
import testing from '@/store/modules/testing';
import workspaces from '@/store/modules/workspaces';
import roles from '@/store/modules/roles';
import { mergeAccess } from '@/utils/user';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  actions: {
    async loadCurrentUserData({ commit, dispatch }) {
      const currentUser = await dispatch('users/getCurrentUser');

      if (currentUser) {
        const { defaultWorkspaceId, workspaces } = currentUser;
        await dispatch('workspaces/loadCurrentWorkspace', defaultWorkspaceId);
        const workspaceRoles = await dispatch('roles/loadCurrentWorkspaceRoles');
        const { roles = [], isAdmin } = workspaces[defaultWorkspaceId] || {};
        const currentUserRoles = workspaceRoles.filter(role => roles.includes(role.id));
        const currentUserAccess = currentUserRoles.reduce((access, role) => {
          const { pages = [], modules = {} } = role;
          access.pages = [...new Set([...access.pages, ...pages])];
          access.modules = mergeAccess(access.modules, modules);
          return access;
        }, { isAdmin, pages: [], modules: {} });
        commit('users/setCurrentUserAccess', currentUserAccess);
      } else {
        throw Error('Пользователь не найден. Обратитесь к администратору');
      }
    },
  },

  modules: {
    cities,
    users,
    auth,
    categories,
    questions,
    testing,
    workspaces,
    roles,
  },
});

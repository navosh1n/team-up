import userStorage from '@/services/storage/user-storage';
import userService from '@/services/api/user-service';

const state = {
  currentUser: null,
  currentUserAccess: {},
  users: [],
  meta: {},
};

const getters = {
  checkAccess: (state) => (module, access) => {
    const { isAdmin, modules = {} } = state.currentUserAccess;
    return !!(isAdmin || (modules[module] && modules[module][access]));
  },
};

const mutations = {
  setCurrentUser: (state, user) => state.currentUser = user,
  setCurrentUserAccess: (state, user) => state.currentUserAccess = user,
  setUsers: (state, { data, meta }) => {
    state.users = data;
    state.meta = meta;
  },
  updateUser: (state, user) => {
    const ind = state.users.findIndex(({ id }) => user.id === id);
    state.users.splice(ind, 1, user);
  },
};

const actions = {
  async loadUsers({ commit, state, rootState }, params = {}) {
    const workspaceId = params.workspaceId || rootState.workspaces.currentWorkspace?.id;
    const response = await userService.get({ ...params, workspaceId });
    commit('setUsers', response);
    return state.users;
  },

  async getCurrentUser({ state, commit }) {
    if (state.currentUser) return state.currentUser;

    const { userId } = userStorage;
    if (!userId) return null;

    const currentUser = await userService.getById(userId);

    if (!currentUser) return null;

    commit('setCurrentUser', currentUser);
    return currentUser;
  },

  async updateUser({ commit }, data) {
    const user = await userService.update(data);
    commit('updateUser', user);
    return user;
  },

  createUser(ctx, data) {
    return userService.create(data);
  },

  deleteUser(ctx, id) {
    return userService.deleteById(id);
  },

  loadUserById(ctx, id) {
    return userService.getById(id);
  },

  getUserByEmail(ctx, email) {
    return userService.getByEmail(email);
  },
};

export default { namespaced: true, state, getters, mutations, actions };

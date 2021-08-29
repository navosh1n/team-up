import roleService from '@/services/api/role-service';

const state = {
  currentWorkspaceRoles: [],
};

const getters = {
  currentWorkspaceRolesMap: (state) => state.currentWorkspaceRoles.reduce((res, role) => {
    res[role.id] = role;
    return res;
  }, {}),
};

const mutations = {
  setCurrentWorkspaceRoles: (state, roles) => state.currentWorkspaceRoles = roles || [],
};

const actions = {
  async loadCurrentWorkspaceRoles({ state, commit, rootState }) {
    const workspaceId = rootState.workspaces?.currentWorkspace?.id;
    const roles = await roleService.get({ workspaceId });
    commit('setCurrentWorkspaceRoles', roles);
    return state.currentWorkspaceRoles;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

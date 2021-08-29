import workspaceService from '@/services/api/workspace-service';

const state = {
  currentWorkspace: null,
};

const mutations = {
  setCurrentWorkspace: (state, workspace) => state.currentWorkspace = workspace,
};

const actions = {
  async loadCurrentWorkspace({ state, commit }, workspaceId) {
    const currentWorkspace = await workspaceService.getById(workspaceId);
    commit('setCurrentWorkspace', currentWorkspace);
    return state.currentWorkspace;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

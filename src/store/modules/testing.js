import testingService from '@/services/api/testing-service';
import userService from '@/services/api/user-service';
import { makeMapFromArray } from '@/utils/collections';

const state = {
  testing: [],
  meta: {},
  currentTesting: null,
};

const mutations = {
  setCurrentTesting: (state, testing) => {
    state.currentTesting = testing;
  },
  setTesting: (state, { data, meta }) => {
    state.testing = data;
    state.meta = meta;
  },
};

const actions = {
  async loadTesting({ commit, state, rootState }, params = {}) {
    const workspaceId = params.workspaceId || rootState.workspaces.currentWorkspace?.id;
    const testing = await testingService.get({ ...params, workspaceId });
    // todo удалить users после переезда на node
    const { data: users } = await userService.getAll({ workspaceId });
    const usersMap = makeMapFromArray(users);

    testing.data = testing.data.map(item => {
      item.interviewee = usersMap[item.intervieweeId];
      item.interviewer = usersMap[item.interviewerId];
      return item;
    });

    commit('setTesting', testing);
    return state.testing;
  },

  async loadCurrentTesting({ commit }, id) {
    const testing = await testingService.getById(id);
    commit('setCurrentTesting', testing);
    return testing;
  },

  loadTestingResults(ctx, id) {
    return testingService.getResults(id);
  },

  loadTestingNextQuestion(ctx, id) {
    return testingService.getNextQuestion(id);
  },

  createTesting({ rootState }, params = {}) {
    const workspaceId = params.workspaceId || rootState.workspaces?.currentWorkspace?.id;
    return testingService.create({ ...params, workspaceId });
  },

  updateTesting(ctx, data) {
    return testingService.update(data);
  },

  async updateCurrentTesting({ state, dispatch, commit }, data) {
    const currentTesting = await dispatch('updateTesting', { id: state.currentTesting.id, ...data });
    commit('setCurrentTesting', currentTesting);
    return state.currentTesting;
  },
};

export default { namespaced: true, state, mutations, actions };

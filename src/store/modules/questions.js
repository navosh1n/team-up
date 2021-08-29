import questionService from '@/services/api/question-service';

const state = {
  currentQuestion: {},
  questions: [],
  meta: {},
};

const mutations = {
  setQuestions: (state, { data, meta = {} }) => {
    state.questions = data;
    state.meta = meta;
  },
};

const actions = {
  async loadQuestions({ commit, state, rootState }, params = {}) {
    const workspaceId = params.workspaceId || rootState.workspaces.currentWorkspace?.id;
    const response = await questionService.get({ workspaceId, ...params });
    commit('setQuestions', response);
    return state.questions;
  },

  async loadQuestionById(ctx, id) {
    return questionService.getById(id);
  },

  async createQuestion({ rootState }, data) {
    await questionService.create({
      ...data,
      workspaceId: rootState.workspaces?.currentWorkspace?.id,
      authorId: rootState.users.currentUser.id,
    });
  },

  updateQuestion(ctx, data) {
    return questionService.update(data);
  },

  deleteQuestion(ctx, id) {
    return questionService.deleteById(id);
  },

  createSharedQuestion(ctx, data) {
    return questionService.createSharedQuestion(data);
  },

  getSharedQuestion(ctx, id) {
    return questionService.getSharedQuestion(id);
  },

  updateSharedQuestion(ctx, data) {
    return questionService.updateSharedQuestion(data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

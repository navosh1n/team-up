import categoryService from '@/services/api/category-service';
import { makeMapFromArray } from '@/utils/collections';

const state = {
  categories: [],
};

const getters = {
  categoriesMap: (state) => makeMapFromArray(state.categories),
};

const mutations = {
  setCategories: (state, categories) => state.categories = categories,
  addCategory: (state, category) => state.categories.push(category),
};

const actions = {
  async loadCategories({ commit, state, rootState }, params = {}) {
    const workspaceId = params.workspaceId || rootState.workspaces.currentWorkspace?.id;
    const categories = await categoryService.get({ workspaceId });
    commit('setCategories', categories);
    return state.categories;
  },

  async createCategory({ commit, rootState }, name) {
    const workspaceId = rootState.workspaces.currentWorkspace?.id;
    const category = await categoryService.create({ workspaceId, name });
    commit('addCategory', category);
    return category;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

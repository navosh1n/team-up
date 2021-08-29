import cityService from '@/services/api/city-service';
import { makeMapFromArray } from '@/utils/collections';

const state = {
  cities: [],
};

const getters = {
  citiesMap: (state) => makeMapFromArray(state.cities),
};

const mutations = {
  setCities: (state, cities) => { state.cities = cities; },
  addCity: (state, city) => { state.cities.push(city); },
};

const actions = {
  async loadCities({ state, commit }) {
    const cities = await cityService.get();
    commit('setCities', cities);
    return state.cities;
  },

  async createCity({ commit }, name) {
    const city = await cityService.create(name);
    commit('addCity', city);
    return city;
  },
};

export default { namespaced: true, state, getters, mutations, actions };

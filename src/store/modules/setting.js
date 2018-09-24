/* eslint-disable promise/param-names */
import { SET_PERPAGE } from '../actions/setting'

const state = {
  perPage: localStorage.getItem('per-page') || 25
}

const getters = {
  perPage: state => state.perPage
}

const mutations = {
  [SET_PERPAGE]: (state, payload) => {
    state.perPage = payload
  }
}

const actions = {
  [SET_PERPAGE]: ({commit}, payload) => {
    localStorage.setItem('per-page', payload)
    commit(SET_PERPAGE, payload)
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}

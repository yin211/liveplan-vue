/* eslint-disable promise/param-names */
import { SET_PERPAGE } from '../actions/setting'

const state = {
  perPage: 10
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
    commit(SET_PERPAGE, payload)
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}

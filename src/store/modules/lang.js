/* eslint-disable promise/param-names */
import { app } from '@/main'
import { SET_LANG } from '../actions/lang'

const state = {
  lang: 'en'
}

const mutations = {
  [SET_LANG]: (state, payload) => {
    state.lang = payload
    app.$i18n.locale = payload
  }
}

const actions = {
  [SET_LANG]: ({commit}, payload) => {
    commit(SET_LANG, payload)
  }
}

export default {
  state,
  actions,
  mutations
}

import axios from 'axios'

const defaultState = {
  record: {},
  app: {}
}

const state = () => defaultState

const getters = {
  getRecord: state => state.record,
  getApp: state => state.app
}
const mutations = {
  SET_APP(state, payload) {
    state.app = payload
  },
  SET_RECORD(state, payload) {
    state.record = payload
  }
}

const actions = {
  getApp({ commit }, payload = 1) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/app/${payload}`).then(({ data }) => {
        commit('SET_APP', data)
        commit('SET_RECORD', data.records.length ? data.records[0] : {})
        resolve(data)
      }).catch(e => reject(e))
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

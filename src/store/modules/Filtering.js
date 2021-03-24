import axios from 'axios'

const state = {
  filterSettings: {},
  recordSearchModel: {}
}

const getters = {}

const mutations = {
  saveFilterSettings(_, payload) {
    window.localStorage.setItem('filterData', JSON.stringify(payload))
  },

  getFilterSettings(state) {
    const payload = JSON.parse(window.localStorage.getItem('filterData'))
    state.filterSettings = payload || {}
  },

  saveRecordSearchModel(_, payload) {
    window.localStorage.setItem('recordSearchModal', JSON.stringify(payload))
  },

  getRecordSearchModal(state) {
    const payload = JSON.parse(window.localStorage.getItem('recordSearchModal'))
    state.recordSearchModel = payload || {}
  }
}

const actions = {
  filterRecordsByFields(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/filter/records`, payload)
        .then(resolve)
        .catch(reject)
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

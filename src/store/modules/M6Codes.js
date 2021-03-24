import axios from 'axios'

const state = {
  unspc: {},
  companyTypes: {},
  regions: {},
  naics: {}
}

const getters = {
  getSpecificUNSPC(state) {
    return id => state.unspc[id]
  }
}

const mutations = {
  setUnspc(state, payload) {
    const unspc = { ...state.unspc }
    unspc[payload.id] = payload.data
    state.unspc = unspc
  },

  multiSetUnspc(state, payload) {
    state.unspc = { ...state.unspc, ...payload }
  },

  setRegions(state, payload) {
    state.regions[payload.id] = payload.data
  },

  multiSetRegions(state, payload) {
    state.regions = { ...state.regions, ...payload }
  },

  setNaics(state, payload) {
    state.naics[payload.id] = payload.data
  },

  multiSetNaics(state, payload) {
    state.naics = { ...state.naics, ...payload }
  },

  setCompanyTypes(state, payload) {
    state.companyTypes[payload.id] = payload.data
  },

  multiSetTypes(state, payload) {
    state.companyTypes = { ...payload }
  }
}

const actions = {
  getUnspcCodes({ state, commit }, parents = '0') {
    if (state.unspc[parents]) return Promise.resolve(state.unspc[parents])
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/search/unspcCodes`, {
        parents
      })
        .then(res => {
          commit('setUnspc', { data: res.data, id: parents })
          resolve(res.data)
        })
        .catch(reject)
    })
  },

  getUnspcCodesByIds({ commit }, ids = []) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/search/unspcCodes/ids`, {
        ids
      })
        .then(res => {
          commit('multiSetUnspc', res.data)
          resolve(res.data)
        })
        .catch(reject)
    })
  },

  getCompanyTypes({ state, commit }, parents = '0') {
    if (state.unspc[parents]) return Promise.resolve(state.unspc[parents])
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/search/companyTypes`, {
        parents
      })
        .then(res => {
          commit('setCompanyTypes', { data: res.data, id: parents })
          resolve(res.data)
        })
        .catch(reject)
    })
  },

  getCompanyTypesByIds({ commit }, ids = []) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/search/companyTypes/ids`, {
        ids
      })
        .then(res => {
          commit('multiSetTypes', res.data)
          resolve(res.data)
        })
        .catch(reject)
    })
  },

  getRegions({ state, commit }, parents = '0') {
    if (state.unspc[parents]) return Promise.resolve(state.unspc[parents])
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/search/regions`, {
        parents
      })
        .then(res => {
          commit('setRegions', { data: res.data, id: parents })
          resolve(res.data)
        })
        .catch(reject)
    })
  },

  getRegionsByIds({ commit }, ids = []) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/search/regions/ids`, {
        ids
      })
        .then(res => {
          commit('multiSetRegions', res.data)
          resolve(res.data)
        })
        .catch(reject)
    })
  },


  getNaics({ state, commit }, parents = '0') {
    if (state.unspc[parents]) return Promise.resolve(state.unspc[parents])
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/search/naicsCodes`, {
        parents
      })
        .then(res => {
          commit('setNaics', { data: res.data, id: parents })
          resolve(res.data)
        })
        .catch(reject)
    })
  },

  getNaicsByIds({ commit }, ids = []) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/search/naicsCodes/ids`, {
        ids
      })
        .then(res => {
          commit('multiSetNaics', res.data)
          resolve(res.data)
        })
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

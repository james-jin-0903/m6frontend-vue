import router from '@/router'

const currentKey = () => `${window.Drupal.settings.m6_platform.uid}_${router.currentRoute.params.id}`
const stringify = obj => JSON.stringify(obj)
const parse = str => JSON.parse(str)

const saveToLocalStorage = obj => window.localStorage.setItem(currentKey(), stringify(obj))
const getFromLocalStorage = () => parse(window.localStorage.getItem(currentKey()))

const state = {
  settings: {}
}

const getters = {
  getSettings(state) {
    return state.settings || {}
  }
}

const actions = {
  initGanttSettings({ commit }) {
    return new Promise((resolve, reject) => {
      const payload = getFromLocalStorage()
      commit('setSettings', payload)
      resolve(true)
    })
  },
  saveGanttSettings({ commit }, payload) {
    return new Promise(async (resolve, reject) => {
      payload.id = currentKey()
      saveToLocalStorage(payload)
      commit('setSettings', payload)
      resolve(true)
    })
  }
}

const mutations = {
  setSettings(state, payload) {
    state.settings = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

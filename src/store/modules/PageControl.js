// meant to control top level vue widgets

const state = {
  showSidePanels: true,
  showChatPanel: false, // The idea is to create handlers for each panel, and hide all of them with hidePAnels method.
  darkModeGlobal: false
}

const getters = {
  getShowSidePanels: state => state.showSidePanels,
  getShowChatPanel: state => state.showChatPanel,
  getDarkModeGlobal: state => state.darkModeGlobal
}

const mutations = {
  setShowSidePanels(state, payload) {
    state.showSidePanels = payload
  },
  setShowChatPanel(state, payload) {
    state.showChatPanel = payload
  },
  setDarkModeGlobal(state, payload) {
    state.darkModeGlobal = payload
  }
}

const actions = {
  setShowSidePanels({ commit }, payload = true) {
    commit('setShowSidePanels', payload)
  },
  setShowChatPanel({ commit }, payload = true) {
    commit('setShowChatPanel', payload)
  },
  setDarkModeGlobal({ commit }, payload = true) {
    commit('setDarkModeGlobal', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

const state = {
  forceIndex: false
}

const getters = {
  forceIndex(state) {
    return state.forceIndex
  }
}

const mutations = {
  setForceIndex(state) {
    state.forceIndex = !state.forceIndex
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}

const state = {
  secondColumnComponent: {
    name: ''
  },
  thirdColumnComponent: {},
  userToShow: {}
}

const getters = {}

const mutations = {
  setSecondColumnComponent: (state, payload) => {
    state.userToShow = {}
    state.thirdColumnComponent = {}
    state.secondColumnComponent = payload
  },
  setThirdColumnComponent: (state, payload) => state.thirdColumnComponent = payload,
  setUserToShow(state, payload) {
    state.userToShow = payload
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

const iconData = {
  iconName: 'mdi-account-circle',
  iconBackgroundColor: '#AAA',
  iconColor: '#AAA'
} // DefaultFields.vue && BuilderActions.vue

const state = {
  iconData,
  activeTab: 0
}

const getters = {}

const mutations = {
  setIconData(state, payload) { // { iconName, iconBackgroundColor, iconColor })
    return new Promise((resolve, _) => {
      state.iconData = { ...payload }
      resolve()
    })
  },

  setActiveTab(state, payload) {
    state.activeTab = payload
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

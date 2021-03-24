import planned from './planned'
import projects from './projects'
import settings from './settings'

const state = {}

const getters = {}

const mutations = {}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
  modules: {
    planned,
    projects,
    settings
  }
}

import cashflow from './cashflow'
import forecasts from './forecasts'
import gantt from './gantt'

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
    cashflow,
    forecasts,
    gantt
  }
}

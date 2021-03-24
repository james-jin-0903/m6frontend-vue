
const state = {
  componentKey: 1,
  config: false,
  columns: {
    width: 312,
    title: true,
    startDate: true,
    endDate: true,
    duration: true,
    predecessors: true,
    assignee: true,
    hours: true,
    progress: true
  }
}

const getters = {
  componentKey: state => state.componentKey,
  columns: state => state.columns,
  config: state => state.config
}

const mutations = {
  updateComponent: state => {
    state.componentKey++
  },
  setColumns: (state, payload) => {
    state.columns = payload
  },
  setConfig: (state, payload) => {
    state.config = payload
  }
}

const actions = {
  updateComponent: context => {
    context.commit('updateComponent')
  },
  setColumns: (context, payload) => {
    context.commit('setColumns', payload)
  },
  setConfig: (context, payload) => {
    context.commit('setConfig', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

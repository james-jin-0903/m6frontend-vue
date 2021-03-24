
const state = {
    notifShow : false,
    notifSuccess : false,
    notifDanger : false,
    notifText : ''
}

const getters = {}

const mutations = {
    notifDanger(state, message) {
        state.notifText = message
        state.notifDanger = true
        state.notifShow = true
    },
    notifSuccess(state, message) {
        state.notifText = message
        state.notifSuccess = true
        state.notifShow = true
    },
    notifClose(state) {
        state.notifShow = false
        state.notifSuccess = false
        state.notifText = ''
    }
}

const actions = { 
    notifDanger({ commit }, text){
        commit('notifDanger', text)
    },
    notifSuccess({ commit }, text) {
        commit('notifSuccess', text)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
  
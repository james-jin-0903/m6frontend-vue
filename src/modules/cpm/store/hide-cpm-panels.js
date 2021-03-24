import { db } from '@/utils/Firebase'

const state = {
  panelSettings: {}
}

const getters = {
  getPanelSettings(state) {
    return state.panelSettings || {}
  }
}

const mutations = {
  setSettings(state, payload) {
    state.panelSettings = payload
  }
}

const actions = {
  getSettings({ commit, rootState, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (Object.keys(state.panelSettings).length) resolve()

        const res = await db
          .collection('settings')
          .doc(rootState.Companies.currentCompany.id)
          .collection('settings')
          .doc('cpmPanels')
          .get()
        const data = res.exists ? res.data() : []
        const payload = {}

        ;
        (data.panels || []).map(s => {
          payload[s.key] = s.hide
        })
        commit('setSettings', payload)
        resolve(payload)
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

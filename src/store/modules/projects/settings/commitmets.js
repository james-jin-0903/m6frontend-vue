import { db } from '@/utils/Firebase'

const state = {
  types: []
}

const getters = {
  types (state) {
    return state.types
  }
}

const mutations = {
  setTypes (state, types = []) {
    state.types = types
  }
}

const actions = {
  async getTypes ({ commit }, { companyId } = {}) {
    if (!companyId) return Promise.reject('Missing Company ID')

    try {
      const { types = [] } = (await db.collection('settings')
        .doc(companyId)
        .collection('settings')
        .doc('commitments')
        .get()).data() || {}
      
      commit('setTypes', types)
    } catch (error) {
      this.notifyError(error)
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}

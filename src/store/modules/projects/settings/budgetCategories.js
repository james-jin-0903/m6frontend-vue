import { db } from '@/utils/Firebase'
import { ffGetDocs } from '@/utils/helpers'

const state = {
  budgetCategories: []
}

const getters = {
  budgetCategories (state) {
    return state.budgetCategories
  }
}

const mutations = {
  setBudgetCategories(state, budgetCategories = []) {
    state.budgetCategories = budgetCategories
  }
}

const actions = {
  async getBudgetCategories ({ commit }, { companyId } = {}) {
    if (!companyId) return Promise.reject('Missing company ID')

    try {
      const collectionRef = db.collection('settings')
        .doc(companyId)
        .collection('settings')
        .doc('budgets')
        .collection('budget_categories')

      const budgetCategories = await ffGetDocs({
        collectionRef
      })

      commit('setBudgetCategories', budgetCategories)
    } catch (e) {
      throw new Error(e)
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

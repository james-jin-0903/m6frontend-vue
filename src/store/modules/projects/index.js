import { db } from '@/utils/Firebase'
import search from './search'
import settings from './settings'

const state = {
  projects: []
}

const mutations = {
  setProjects(state, projects = []) {
    state.projects = projects
  }
}

const actions = {
  async getProjects({ commit }, { companyId } = {}) {
    try {
      if (!companyId) return []

      const docs = (
        await db.collection('cpm_projects')
        .where('company_nid', '==', companyId)
        .get()
      ).docs || []
      
      const projects = docs.map(doc => {
        const data = doc.data()
        
        return {
          number: data.number,
          title: data.title
        }
      })
      commit('setProjects', projects)

      return projects
    } catch (error) {
      throw new Error(error)
    }
  }
}

export default {
  actions,
  mutations,
  state,
  modules: {
    search,
    settings
  },
  namespaced: true
}

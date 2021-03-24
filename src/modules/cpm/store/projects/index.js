import commitments from './commitments'
import forecasts from './forecasts'
import spending from './spending'
import { db } from '@/utils/Firebase'

const state = {
  project: {}
}

const getters = {
  project: state => state.project
}

const mutations = {
  setProject(state, project) {
    state.project = project
  }
}

const actions = {
  // WIP - The idea is to have the project information centralized
  getProject({ commit }, { projectId }) {
    if (!projectId) return Promise.reject('getProject - Missing project id')

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(projectId)
        .get()
        .then(projectSnap => {
          if (!projectSnap.exists) return resolve({})
          const {
            title = '',
            lockMilestoneDates = false
          } = projectSnap.data()
          const project = {
            title,
            lockMilestoneDates,
            id: projectSnap.id
          }

          commit('setProject', project)
          resolve(project)
        })
        .catch(reject)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
  modules: {
    commitments,
    forecasts,
    spending
  }
}

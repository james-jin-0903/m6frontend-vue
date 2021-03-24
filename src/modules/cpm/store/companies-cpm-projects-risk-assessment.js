import { db } from '@/utils/Firebase.js'

const state = {
  riskAssessments: []
}

const getters = {
  riskAssessments(state) {
    return state.riskAssessments
  },
  lastRiskAssessment(state) {
    if (state.riskAssessments.length) {
      return state.riskAssessments[0]
    } else return
  }
}

const mutations = {
  setRiskAssessments(state, payload) {
    state.riskAssessments = payload
  }
}

const actions = {
  fetchRiskAssessments({ commit }, { projectId }) {
    if (!projectId) return Promise.reject()

    return new Promise(async (resolve, reject) => {
      try {
        const snap = await db.collection('cpm_projects')
          .doc(projectId)
          .collection('risk_assessments')
          .orderBy('date', 'desc')
          .get()

        if (!snap.empty) {
          const riskAssessments = await Promise.all(snap.docs.map(async risk => {
            const data = risk.data()

            return {
              ...data,
              status: await solveStatus(data.status),
              id: risk.id
            }
          }))

          commit('setRiskAssessments', riskAssessments)
          resolve()
        } else {
          commit('setRiskAssessments', [])
          resolve()
        }
      } catch (error) {
        reject(error)
      }
    })
  },
  create({ dispatch }, { projectId, risk }) {
    if (!projectId || !risk) return Promise.reject()

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(projectId)
        .collection('risk_assessments')
        .add(risk)
        .then(() => {
          dispatch('fetchRiskAssessments', { projectId })
          resolve()
        })
        .catch(reject)
    })
  },
  update({ dispatch }, { projectId, risk }) {
    if (!projectId || !risk.id) return Promise.reject()

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(projectId)
        .collection('risk_assessments')
        .doc(risk.id)
        .update(risk)
        .then(() => {
          dispatch('fetchRiskAssessments', { projectId })
          resolve()
        })
        .catch(reject)
    })
  },
  delete({ dispatch }, { projectId, riskId }) {
    if (!projectId || !riskId) return Promise.reject()

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(projectId)
        .collection('risk_assessments')
        .doc(riskId)
        .delete()
        .then(() => {
          dispatch('fetchRiskAssessments', { projectId })
          resolve()
        })
        .catch(reject)
    })
  }
}

function solveStatus(statusReference) {
  if (!statusReference) return ''

  return new Promise(async (resolve, reject) => {
    try {
      const status = await statusReference.get()
      resolve({
        ...status.data(),
        id: status.id
      })
    } catch (error) {
      reject(error)
    }
  })
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

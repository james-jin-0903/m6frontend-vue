import { db } from '@/utils/Firebase'
const defaultState = {
  preset: {}
}
const state = () => defaultState

const getters = {
  preset: state => state.preset
}

const mutations = {
  SET_PRESET: (state, payload) => {
    state.preset = payload
  }
}

const actions = {
  addPreset({ rootState }, payload) {
    return new Promise(resolve => {
      const resource = {
        ...payload,
        companyID: rootState.Companies.currentCompany.id,
        createdAt: new Date()
      }

      db.collection('import_presets').add(resource).then(response => {
        resolve(response)
      })
    })
  },
  updatePreset(_, payload) {
    return new Promise(resolve => {
      const resource = {
        ...payload,
        updatedAt: new Date()
      }
      delete resource.id

      db.collection('import_presets').doc(payload.id).update(resource).then(response => {
        resolve(response)
      })
    })
  },
  getPresets({ rootState }) {
    return new Promise(resolve => {
      db.collection('import_presets').where('companyID', '==', rootState.Companies.currentCompany.id).get().then(async response => {
        const docs = await Promise.all(response.docs.map(item => ({
          id: item.id,
          ...item.data()
        })))
        resolve(docs)
      })
    })
  }
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

import axios from 'axios'
const defaultState = {
  taxonomy: []
}

const state = () => defaultState

const getters = {}
const mutations = {}
const actions = {
  fetchTerms(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data: { setting } } = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/settings/taxonomy/get`, payload)
        resolve(setting)
      } catch (e) {
        reject(e)
      }
    })
  },
  fetchTaxonomyTerms(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data: { setting } } = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/settings/taxonomy/get/terms`, payload)
        resolve(setting)
      } catch (e) {
        reject(e)
      }
    })
  },
  listTaxonomyTerms(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data: { settings } } = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/settings/taxonomy/list`, payload)
        resolve(settings)
      } catch (e) {
        reject(e)
      }
    })
  },
  createTerm(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/settings/taxonomy/create`, payload)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  },
  updateTerm(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/settings/taxonomy/update`, payload)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  },
  deleteTerm(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/settings/taxonomy/delete`, payload)
        resolve(data)
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
  mutations,
  actions
}

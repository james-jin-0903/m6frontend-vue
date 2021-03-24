import axios from 'axios'
const defaultState = {
  taxonomy: []
}

const state = () => defaultState

const getters = {}
const mutations = {}
const actions = {
  fetchTemplates(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data: { templates } } = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/mail/template/list`, payload)
        resolve(templates)
      } catch (e) {
        reject(e)
      }
    })
  },
  createTemplate(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data: { template } } = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/mail/template/create`, payload)
        resolve(template)
      } catch (e) {
        reject(e)
      }
    })
  },
  updateTemplate(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data: { template } } = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/mail/template/update`, payload)
        resolve(template)
      } catch (e) {
        reject(e)
      }
    })
  },
  deleteTemplate(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data: { template } } = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/mail/template/delete`, payload)
        resolve(template)
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

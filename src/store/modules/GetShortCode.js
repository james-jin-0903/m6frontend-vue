import axios from 'axios'

const state = {}

const getters = {}

const mutations = {}

const actions = {
  getFilesByName({}, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/get_short_code/activity/by/name`,
        payload
      ).then(response => {
        resolve(response.data)
      }).catch(e => reject(e))
    })
  },
  getFilesByAppId({}, appId) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/records/${appId}`
      ).then(response => {
        resolve(response.data)
      }).catch(e => reject(e))
    })
  },
  getAppsValue({}, label) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/get_short_code/apps/by/name`, {
        name: label
      }).then(response => {
        resolve(response.data)
      }).catch(e => reject(e))
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

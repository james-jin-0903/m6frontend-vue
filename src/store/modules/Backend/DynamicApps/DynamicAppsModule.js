import axios from 'axios'
import generalListModule from '../../GeneralListModule'
const convertApps = require('@/store/models/m6apps')

export default {
  namespaced: true,
  state: {
    appsList: [],
    appId: {}
  },
  getters: {
    getApps: state => state.appsList,
    getAppId: state => state.appId
  },
  mutations: {
    SET_APPS: (state, payload) => state.appsList = payload,
    PUSH_APP_ID: (state, payload) => state.appId = payload
  },
  actions: {
    async set_apps({ commit }) {
      const apps = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/apps/selects`)
      commit('SET_APPS', apps['data'])
    },
    async post_app({}, data) {
      return await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/dynamic_apps`, data)
    },
    push_app_id({ commit }, data) {
      commit('PUSH_APP_ID', data)
    },
    async get_all_apps_by_id({}, app) {
      const apps = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/dynamic_apps/by/${app}`)
      const fieldList = []
      apps['data'].map((row, index) => {
        fieldList[index] = row.fieldValues
        delete row.fieldValues
      })
      generalListModule.state.fieldLists = fieldList
      generalListModule.state.general_list = apps['data']
    },
    async get_apps({}) {
      const apps = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/dynamic_apps/apps`)
      return apps['data']
    },
    async getAllFields(_, { id, roleId }) {
      return new Promise((resolve, reject) => {
        axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/field/list/all`, {
          appId: id,
          role_id: roleId
        }).then(response => {
          resolve(response.data)
        }).catch(reject)
      })
    }
  }
}

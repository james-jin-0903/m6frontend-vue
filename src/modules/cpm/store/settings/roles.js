import { db } from '@/utils/Firebase'
import { dataGet } from '@/utils/helpers'
import axios from 'axios'

const state = {
  userRoles: []
}

const getters = {
  userRoles: state => state.userRoles,
  userIsManager: state => state.userRoles.includes('manager')
}

const mutations = {
  addUserRole(state, role) {
    state.userRoles.push(role)
  }
}

const actions = {
  async checkUserRole({ rootState }, { commit }, { role }) {
    try {
      const constfirebaseUrl = process.env.VUE_APP_FIREBASE_APIURL
      const userId = dataGet(window, 'window.Drupal.settings.m6_platform.uid')
      const companyId = rootState.Companies.currentCompany.id
      const { data = false } = await axios
        .get(`${constfirebaseUrl}/api/company/${companyId}/user/${userId}/role/${role}/`)

      if (data) {
        commit('addUserRole', role)
      }

      return data
    } catch (e) {
      console.error(e)
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

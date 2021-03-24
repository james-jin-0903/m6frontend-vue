import { dataGet } from '@/utils/helpers'
import { db } from '@/utils/Firebase'

const state = {
  roles: [],
  roleNames: []
}

const getters = {
  roles(state) {
    return state.roles
  },
  roleNames(state) {
    return state.roleNames
  }
}

const mutations = {
  setRoles(state, roles) {
    state.roles = roles
  },
  setRoleNames(state, roleNames) {
    state.roleNames = roleNames
  }
}

const actions = {
  fetchRoles({ commit }, { companyId = '' }) {
    if (!companyId) return Promise.reject()
    return new Promise((resolve, reject) => {
      db
        .collection('settings')
        .doc(companyId)
        .collection('settings')
        .doc('roles')
        .get()
        .then(doc => {
          if (doc.exists) {
            const roles = dataGet(doc.data(), 'roles', [])
            const roleNames = roles.map(role => dataGet(role, 'name'))
            commit('setRoleNames', roleNames)
            commit('setRoles', roles)
          } else {
            resolve()
          }
        })
        .catch(reject)
    })
  }
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

import axios from 'axios'

const defaultState = {
  roles: []
}
const state = () => defaultState

const getters = {
  getRoles: state => state.roles
}

const mutations = {
  SET_ROLES: (state, payload) => state.roles = payload
}

const actions = {
  fetchRoles({ commit }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`${process.env.VUE_APP_LAMBDA}/companies/roles`)
        commit('SET_ROLES', data.roles)
        resolve(data.roles)
      } catch (e) {
        reject(e)
      }
    })
  },
  fetchInstanceRoles(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios
          .post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app_roles/get_user_roles`, payload)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  },
  saveRoles(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/roles/user/assign`, payload)
        resolve(data.msg)
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

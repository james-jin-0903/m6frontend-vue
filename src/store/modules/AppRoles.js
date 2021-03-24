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
        const { data } = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app_roles/get_roles`)

        commit('SET_ROLES', data)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  },
  getPermissions(_, { id }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app_roles/get_roles`)

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
  },
  saveInstanceRoles(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios
          .post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app_roles/assign_role`, payload)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  },
  updateRolePermissions(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app_roles/saveRole`, payload)

        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  },
  createRole(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app_roles/create`, payload)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  },
  updateRole(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app_roles/update`, payload)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  },
  deleteRole(_, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app_roles/delete`, {
          id: payload.id
        })
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

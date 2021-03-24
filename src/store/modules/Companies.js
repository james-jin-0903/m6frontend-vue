/* eslint-disable no-empty-pattern */
import axios from 'axios'
import { dataGet } from '@/utils/helpers'

const state = {
  list: [],
  currentCompany: {},
  currentUser: {},
  companyInsuranceStatus: [
    { label: 'Bondable', val: 'BONDABLE' },
    { label: 'Bonded', val: 'BONDED' },
    { label: 'Insured', val: 'INSURED' }
  ],
  locationTypes: [
    { label: 'Main Location', value: 'main-location' },
    { label: 'Headquarters', value: 'headquarters' },
    { label: 'Branch', value: 'branch' },
    { label: 'Division', value: 'division' },
    { label: 'Remote Location', value: 'remote-location' },
    { label: 'Subsidiary', value: 'subsidiary' },
    { label: 'Region', value: 'region' },
    { label: 'Administrative', value: 'administrative' },
    { label: 'Trailer', value: 'trailer' },
    { label: 'Department', value: 'department' },
    { label: 'Field Office', value: 'field-office' }
  ],
  auxiliarCodes: []
}

const getters = {
  getCurrentCompanyUsers(state) {
    return dataGet(state, 'currentCompany.users', [])
  },
  getCurrentCompany: state => state.currentCompany,
  getCurrentUser: state => state.currentUser,
  getAuxiliarCodes: state => state.auxiliarCodes
}

const mutations = {
  setCompanyList(state, payload) {
    state.list = payload
  },
  setCurrentCompany(state, payload) {
    state.currentCompany = payload
    if (process.env.VUE_APP_COMPANY_ID) {
      state.currentCompany.id = process.env.VUE_APP_COMPANY_ID
    }
  },
  setCurrentUser(state, payload) {
    state.currentUser = payload
  },
  SET_AUXILIAR_CODES: (state, payload) => state.auxiliarCodes = payload
}

const actions = {
  getList({ commit }) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_LAMBDA}/companies/list`, {
        name: '',
        type: 'company'
      })
        .then(res => {
          resolve(res)
          commit('setCompanyList', res.data.companies)
        })
        .catch(err => reject(err))
    })
  },
  getCurrentUserByProfileID({ commit, state }, profileID) {
    const companyUsers = dataGet(state, 'currentCompany.users', [])
    const currentUser = companyUsers.filter(function (user) {
      return ((user.firstName.toLowerCase().trim() + user.lastName.toLowerCase().trim()) === profileID)
    })
    console.log(currentUser)
    commit('setCurrentUser', currentUser.length ? currentUser[0] : [])
  },
  async getRequestUsers({ state }) {
    const users = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/get/requestToJoin`, {
      'companyId': state.currentCompany.result.id
    })

    return users['data']['result']
  },
  async getDataProject({}, companyId) {
    const res = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/get/spec`, {
      'companyId': companyId
    })
    return res.data.dataValues
  },
  async updateDataProject({}, payload) {
    const res = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/update/spec`, {
      ...payload
    })
    return res.data
  },
  async getDataSocial({}, companyID) {
    const res = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/get/social`, {
      'companyId': companyID
    })
    return res.data
  },
  async updateDataSocial({}, payload) {
    return await Promise.all(
      payload.data.map(async request => {
        await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/update/social`, {
          companyId: payload.companyId,
          data: { ...request, id: request.id ? request.id : null }
        })
      })
    )
  },
  async getDataLocations({}, companyID) {
    const res = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/get/location`, {
      'companyId': companyID
    })
    return res.data
  },
  async getDataCodes({ state }) {
    const res = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/get/code`, {
      'companyId': state.currentCompany.result.id
    })
    return res.data
  },

  async updateCodesData({}, data) {
    const res = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/update/code`, data)
    return res.data
  },

  getCompanyByID({ commit }, companyID) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_LAMBDA}/companies/get/users`, {
        'companyId': companyID
      })
        .then(res => {
          res['data']['users'] = res['data']['result']['Users']
          res['data']['users'].forEach((user, i) => {
            if (user['User']) {
              res['data']['users'][i] = user['User']
            }
          })
          commit('setCurrentCompany', res.data)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  updateUserCompany({}, userCompany) {
    axios.post(`${process.env.VUE_APP_LAMBDA}/companies/requestToJoin/update`, {
      id: userCompany.id,
      status: userCompany.status
    })
  },
  async getUserCompanies({}, userId) {
    const users = await axios.post(`${process.env.VUE_APP_LAMBDA}/users/get/companies`, {
      userId: userId
    })

    return users.data
  },
  createUserCompany({ rootState, dispatch }, data) {
    data.userID = rootState.Auth.user.id
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_LAMBDA}/companies/request/join`, data)
        .then(res => {
          dispatch('Auth/getUserData', {}, { root: true })
          resolve(res)
        })
        .catch(reject)
    })
  },
  switchCompanies({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_LAMBDA}/users/switch/company`, {
        'id': params.nextCompany.id
      }).then(res => {
        dispatch('Auth/getUserData', {}, { root: true })
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  updateCompany({ state }, company) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_LAMBDA}/companies/update/basic`, {
        companyId: state.currentCompany.result.id,
        data: company
      }).then(resolve).catch(reject)
    })
  },
  updateDataLocation({}, locations) {
    locations.data.forEach(async request => {
      await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/update/location`, {
        companyId: locations.companyId,
        data: { ...request, id: request.createdAt ? request.id : null }
      })
    })
  },
  postCodesData({}, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_LAMBDA}/companies/post/code`, payload)
        .then(resolve).catch(reject)
    })
  },
  saveCode({}, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/code/save`, payload)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  },
  deleteCode({}, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/code/delete`, payload)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  },
  getCodes({}, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post(`${process.env.VUE_APP_LAMBDA}/companies/code/get`, payload)
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  },
  saveAuxliarCodes({ commit }, payload) {
    commit('SET_AUXILIAR_CODES', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

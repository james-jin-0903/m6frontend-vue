import axios from 'axios'
import { dataGet } from '@/utils/helpers'

const state = {
  AccessToken: '',
  IdToken: '',
  exp: '',
  user: {},
  statusColors: {
    pending: '#e3aa27',
    deny: '#e53935',
    accept: '#59cf51',
    active: '#59cf51',
    inactive: '#bf2121'
  }
}

const getters = {
  loggedIn(state) {
    if (Date.now() >= state.exp * 1000) {
      return false
    }
    return true
  },
  getUser(state) {
    return state.user
  },
  getCurrentUserCompanies(state) {
    return dataGet(state, 'user.companies', [])
  },
  getSwitchCompanies: state => state.user.switchCompanies,
  getAccessToken(state) {
    return state.AccessToken
  }
}

const mutations = {
  setTokens(state, payload) {
    state.exp = payload.exp
    state.AccessToken = payload.AccessToken
    window.localStorage.setItem('m6Token', JSON.stringify({
      AccessToken: payload.AccessToken,
      exp: payload.exp
    }))
  },
  setUser(state, payload) {
    state.user = payload
  },
  logoutUser(state) {
    state.AccessToken = ''
    state.IdToken = ''
    state.exp = ''
    state.user = {}
    window.localStorage.removeItem('m6Token')
  }
}

const actions = {
  getUserData({ state, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      const { AccessToken } = state
      axios.post(`${process.env.VUE_APP_LAMBDA}/users/get`, {
        accessToken: AccessToken
      })
        .then(res => {
          res['data']['user']['companies'] = res.data.companiesData
          res['data']['user']['switchCompanies'] = res.data.companies
          commit('setUser', res.data.user)
          dispatch('Companies/getCompanyByID', res.data.user.currentCompany, {
            root: true
          })

          resolve(res)
        })
        .catch(reject)
    })
  },
  searchForToken({ commit }) {
    const str = window.localStorage.getItem('m6Token')
    if (str) {
      const m6token = JSON.parse(str)
      if (m6token.AccessToken) {
        commit('setTokens', m6token)
      }
    }
  },
  async signUp(cont, payload) {
    if (payload.createCompany) {
      payload.company = {
        name: payload.company,
        logo: '',
        email: '',
        website: '',
        phone: ''
      }
      payload.companyId = null
      payload.requestToJoin = false
    } else {
      payload.companyId = payload.company.id
      payload.requestToJoin = true
    }
    return await axios.post(`${process.env.VUE_APP_LAMBDA}/users/signup`, payload)
  },
  confirmCode(cont, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_LAMBDA}/users/signup/confirm`, payload)
        .then(res => {
          resolve(res)
        })
        .catch(reject)
    })
  },
  signin({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_LAMBDA}/users/login`, payload)
        .then(res => {
          res['data']['user']['companies'] = res.data.companiesData
          res['data']['user']['switchCompanies'] = res.data.companies

          commit('setTokens', res['data']['tokenData'])
          commit('setUser', res['data']['user'])
          dispatch('Companies/getCompanyByID', res.data.user.currentCompany, {
            root: true
          })
          resolve(res.data['user'])
        })
        .catch(err => {
          reject(dataGet(err, 'response'))
        })
    })
  },
  resetConfirmCode(cont, email) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_LAMBDA}/users/resend/code`, {
        email: email
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(dataGet(err, 'response.data'))
        })
    })
  },
  confirmPasswordReset(cont, params) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_LAMBDA}/users/password/reset`, params)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(dataGet(err, 'response.data'))
        })
    })
  },
  startPasswordReset(cont, email) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_LAMBDA}/users/password/forgot`, {
        username: email
      })
        .then(resolve)
        .catch(err => {
          reject(dataGet(err, 'response.data'))
        })
    })
  },
  updateUserData({ commit, state, dispatch }, user) { // update user in dynamo
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_LAMBDA}/users/update`, { ...user })
        .then(res => {
          res.data.user = Object.assign(...[res.data.user, state.user])
          commit('setUser', res.data.user)
          dispatch('Companies/getCompanyByID', res.data.user.currentCompany, {
            root: true
          })
          resolve(res)
        })
        .catch(reject)
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

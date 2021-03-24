import axios from 'axios'
import { dataGet } from '@/utils/helpers'
import { db } from '@/utils/Firebase'
import { some, uniqBy } from 'lodash'

const state = {
  bidManagers: [],
  projectManagers: [],
  vendors: []
}

const getters = {
  isManager(state) {
    const isCompanyAdmin = dataGet(window, 'Drupal.settings.m6_platform_header.company_admin')

    const currentUserEmail = dataGet(window, 'Drupal.settings.m6_platform.user.email')
    const allManagers = [...state.bidManagers, ...state.projectManagers]
    const isManager = some(allManagers, { 'email': currentUserEmail })

    return Boolean(isCompanyAdmin || isManager)
  },
  getVendors(state) {
    return state.vendors
  }
}

const mutations = {
  setBidManagers(state, bidManagers) {
    state.bidManagers = bidManagers
  },
  setProjectmanagers(state, projectmanagers) {
    state.projectManagers = projectmanagers
  },
  setVendors(state, vendors) {
    state.vendors = vendors
  }
}

const actions = {
  fetchVendors({ commit }) {
    return new Promise((resolve, reject) => {
      axios
        .post('https://apps.m6connect.com/m6-platform/api/general', {
          action: 'get_vendors'
        })
        .then(response => {
          commit('setVendors', dataGet(response, 'data.result', []))
        })
    })
  },
  fetchM6User({ commit }, uid) {
    if (!uid) return Promise.reject()

    return new Promise((resolve, reject) => {
      db.collection('m6user')
        .doc(uid)
        .get()
        .then(doc => {
          if (doc.exists) {
            resolve(doc.data())
          } else {
            resolve()

            const tours = {
              cpmProjects: false
            }

            db
              .collection('m6user')
              .doc(uid)
              .set({
                tours
              }, { merge: true })
          }
        })
        .catch(reject)
    })
  },
  fetchBidManagers({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      const cid = rootState.Companies.currentCompany.id
      db.collection('settings')
        .doc(cid)
        .collection('settings')
        .doc('roles')
        .get()
        .then(docSnapshot => {
          let allBidManagers = []
          if (docSnapshot.exists) {
            const roles = dataGet(docSnapshot.data(), 'roles', [])

            const bidManagers = roles.find(role => {
              const roleName = role.name || ''
              const strLower = roleName.toLowerCase()
              const name = strLower.replace(/\s/g, '')

              return name === 'bidmanager'
            })

            if (dataGet(bidManagers, 'users') && bidManagers.users.length) {
              allBidManagers = bidManagers.users.map(user => ({
                email: user.email,
                name: user.label
              }))
            }
          }
          commit('setBidManagers', allBidManagers)
          resolve()
        })
        .catch(reject)
    })
  },
  fetchProjectManagers({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      const cid = rootState.Companies.currentCompany.id
      db.collection('settings')
        .doc(cid)
        .collection('settings')
        .doc('users')
        .get()
        .then(doc => {
          let projectManagers = []
          if (doc.exists) {
            const users = doc.data()
            projectManagers = dataGet(users, 'projectManager', [])
          }
          commit('setProjectmanagers', projectManagers)
          resolve()
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

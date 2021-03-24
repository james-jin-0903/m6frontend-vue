import { db } from '@/utils/Firebase.js'
import { dataGet } from '@/utils/helpers'
import { i18n } from '@/plugins/i18n'

const state = {
  covidRiskStatus: []
}

const getters = {
  getCovidRiskStatus(state) {
    return state.covidRiskStatus
  }
}

const mutations = {
  setCovidRiskStatus(state, status) {
    state.covidRiskStatus = status
  }
}

const actions = {
  fetchCovidRiskStatus({ commit }) {
    return new Promise((resolve, reject) => {
      const covidRef = db.collection('settings')
        .doc(dataGet(window, 'Drupal.settings.m6_platform_header.company_nid'))
        .collection('covidRiskStatus')

      covidRef
        .orderBy('createdAt')
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            const riskStatus = []
            querySnapshot.forEach(doc => {
              riskStatus.push({
                id: doc.id,
                ...doc.data()
              })
            })
            commit('setCovidRiskStatus', riskStatus)
            resolve()
          } else {
            const defaultItems = [
              {
                name: i18n.t('cpmSettings.settings.covidRiskStatus.low'),
                color: '#238823'
              },
              {
                name: i18n.t('cpmSettings.settings.covidRiskStatus.medium'),
                color: '#FFBF00'
              },
              {
                name: i18n.t('cpmSettings.settings.covidRiskStatus.high'),
                color: '#D2222D'
              }
            ]

            const promises = defaultItems.map(async item => {
              const date = new Date()
              item.createdAt = date.getTime()
              const response = await covidRef.add(item)
              item.id = response.id
            })

            Promise.all(promises).then(() => {
              commit('setCovidRiskStatus', defaultItems)
              resolve()
            })
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

import { db } from '@/utils/Firebase'
const elkConfig = {
  url: process.env.VUE_APP_ELK_INDEXER_URL,
  key: process.env.VUE_APP_ELK_INDEXER_KEY
}

import axios from 'axios'


const state = {
}

const getters = {
}

const mutations = {
}

const actions = {
  getSpendings(_, { projectId }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const result = await axios.post(`${process.env.VUE_APP_FIREBASE_APIURL}/api/projects/get/spendings`, {
          projectId
        })
        resolve(result.data)
      } catch (e) {
        reject(e)
      }
    })
  },

  create({ dispatch }, { projectId, spending }) {
    if (!projectId || !spending) return Promise.reject('Bad Request when creating spending')

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(projectId)
        .collection('spendings')
        .add(spending)
        .then(async doc => {
          const post = {
            reference: `/cpm_projects/${projectId}/spendings/${doc.id}`,
            mainUID: projectId,
            mainCollection: 'cpm_projects',
            secondCollection: 'spendings',
            secondUID: doc.id,
            action: 'create',
            target: 'spendings'
          }

          await axios.post(elkConfig.url, post, {
            headers: {
              'x-api-key': elkConfig.key
            }
          })
          dispatch('cpm/projects/forecasts/debounceGetForecastTasks', {
            projectId
          }, {
            root: true
          })
          resolve(doc)
        })
        .catch(reject)
    })
  },

  update({ dispatch }, { projectId, spending = {} }) {
    if (!projectId || !spending.id) return Promise.reject('Bad Request when updating spending')

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(projectId)
        .collection('spendings')
        .doc(spending.id)
        .update(spending)
        .then(async doc => {
          const post = {
            reference: `/cpm_projects/${projectId}/spendings/${spending.id}`,
            mainUID: projectId,
            mainCollection: 'cpm_projects',
            secondCollection: 'spendings',
            secondUID: spending.id,
            action: 'update',
            target: 'spendings'
          }

          await axios.post(elkConfig.url, post, {
            headers: {
              'x-api-key': elkConfig.key
            }
          })
          dispatch('cpm/projects/forecasts/debounceGetForecastTasks', {
            projectId
          }, {
            root: true
          })
          resolve(doc)
        })
        .catch(reject)
    })
  },

  delete({ dispatch }, { projectId, spendingId = {} }) {
    if (!projectId || !spendingId) return Promise.reject('Bad Request when deleting spending')

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const post = {
        reference: `/cpm_projects/${projectId}/spendings/${spendingId}`,
        mainUID: projectId,
        mainCollection: 'cpm_projects',
        secondCollection: 'spendings',
        secondUID: spendingId,
        action: 'delete',
        target: 'spendings'
      }

      await axios.post(elkConfig.url, post, {
        headers: {
          'x-api-key': elkConfig.key
        }
      })

      db.collection('cpm_projects')
        .doc(projectId)
        .collection('spendings')
        .doc(spendingId)
        .delete()
        .then(() => {
          dispatch('cpm/projects/forecasts/debounceGetForecastTasks', {
            projectId
          }, {
            root: true
          })
          resolve()
        })
        .catch(reject)
    })
  },

  createLineItem({ dispatch }, { spendingRef, lineItem, projectId }) {
    if (!spendingRef || !lineItem) return Promise.reject()

    return new Promise((resolve, reject) => {
      spendingRef
        .collection('line_items')
        .add(lineItem)
        .then(() => {
          dispatch('cpm/projects/forecasts/debounceGetForecastTasks', {
            projectId
          }, {
            root: true
          })
          resolve()
        })
        .catch(reject)
    })
  },

  updateLineItem({ dispatch }, { spendingRef, lineItem, lineItemId, projectId }) {
    if (!spendingRef || !lineItem || !lineItemId) return Promise.reject('bad request when updating line item')

    return new Promise((resolve, reject) => {
      spendingRef
        .collection('line_items')
        .doc(lineItemId)
        .update(lineItem)
        .then(() => {
          dispatch('cpm/projects/forecasts/debounceGetForecastTasks', {
            projectId
          }, {
            root: true
          })
          resolve()
        })
        .catch(reject)
    })
  },

  updateAccrual(_, projectId) {
    db.collection('cpm_projects')
      .doc(projectId)
      .collection('spendings')
      .get().then(async response => {
        let accrual = 0
        await Promise.all(response.docs.map(async line => {
          const data = await line.data()
          accrual += data.accrual || 0
        }))
        db.collection('cpm_projects')
          .doc(projectId).set({
            spendingsAccrual: accrual
          }, { merge: true })
      })
  },

  deleteLineItem({ dispatch }, { projectId, spendingId, lineItemId }) {
    if (!projectId || !spendingId || !lineItemId) return Promise.reject('bad request when updating line item')

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(projectId)
        .collection('spendings')
        .doc(spendingId)
        .collection('line_items')
        .doc(lineItemId)
        .delete()
        .then(() => {
          dispatch('cpm/projects/forecasts/debounceGetForecastTasks', {
            projectId
          }, {
            root: true
          })
          resolve()
        })
        .catch(reject)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}

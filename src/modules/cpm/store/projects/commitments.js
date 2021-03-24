import { db } from '@/utils/Firebase'
import axios from 'axios'

const elkConfig = {
  url: process.env.VUE_APP_ELK_INDEXER_URL,
  key: process.env.VUE_APP_ELK_INDEXER_KEY
}
const state = {
}

const getters = {
}

const mutations = {
}

const actions = {
  getCommitments(_, { projectId }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const result = await axios.post(`${process.env.VUE_APP_FIREBASE_APIURL}/api/projects/get/commitments`, {
          projectId
        })
        resolve(result.data)
      } catch (e) {
        reject(e)
      }
    })
  },

  create(_, { projectId, commitment }) {
    if (!projectId || !commitment) return Promise.reject('Bad Request when creating commitmnet')

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(projectId)
        .collection('commitments')
        .add(commitment)
        .then(async doc => {
          const post = {
            reference: `/cpm_projects/${projectId}/commitments/${doc.id}`,
            mainUID: projectId,
            mainCollection: 'cpm_projects',
            secondCollection: 'commitments',
            secondUID: doc.id,
            action: 'create',
            target: 'commitments'
          }

          await axios.post(elkConfig.url, post, {
            headers: {
              'x-api-key': elkConfig.key
            }
          })
          resolve(doc)
        })
        .catch(reject)
    })
  },

  update(_, { projectId, commitment = {} }) {
    if (!projectId || !commitment.id) return Promise.reject('Bad Request when updating commitment')

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(projectId)
        .collection('commitments')
        .doc(commitment.id)
        .update(commitment)
        .then(async doc => {
          const post = {
            reference: `/cpm_projects/${projectId}/commitments/${commitment.id}`,
            mainUID: projectId,
            mainCollection: 'cpm_projects',
            secondCollection: 'commitments',
            secondUID: commitment.id,
            action: 'update',
            target: 'commitments'
          }

          await axios.post(elkConfig.url, post, {
            headers: {
              'x-api-key': elkConfig.key
            }
          })
          resolve(doc)
        })
        .catch(reject)
    })
  },

  delete(_, { projectId, commitmentId = {} }) {
    if (!projectId || !commitmentId) return Promise.reject('Bad Request when deleting commitment')

    return new Promise(async (resolve, reject) => {
      const post = {
        reference: `/cpm_projects/${projectId}/commitments/${commitmentId}`,
        mainUID: projectId,
        mainCollection: 'cpm_projects',
        secondCollection: 'commitments',
        secondUID: commitmentId,
        action: 'delete',
        target: 'commitments'
      }
      await axios.post(elkConfig.url, post, {
        headers: {
          'x-api-key': elkConfig.key
        }
      })

      db.collection('cpm_projects')
        .doc(projectId)
        .collection('commitments')
        .doc(commitmentId)
        .delete()
        .then(resolve())
        .catch(reject)
    })
  },

  createLineItem(_, { commitmentRef, lineItem }) {
    if (!commitmentRef || !lineItem) return Promise.reject()

    return new Promise((resolve, reject) => {
      commitmentRef
        .collection('line_items')
        .add(lineItem)
        .then(resolve)
        .catch(reject)
    })
  },

  updateLineItem(_, { commitmentRef, lineItem, lineItemId }) {
    if (!commitmentRef || !lineItem || !lineItemId) return Promise.reject('bad request when updating line item')

    return new Promise((resolve, reject) => {
      commitmentRef
        .collection('line_items')
        .doc(lineItemId)
        .update(lineItem)
        .then(resolve)
        .catch(reject)
    })
  },

  updateAccrual(_, projectId) {
    db.collection('cpm_projects')
      .doc(projectId)
      .collection('commitments')
      .get().then(async response => {
        let totalAccrual = 0
        let accrual = 0
        await Promise.all(response.docs.map(async item => {
          const lines = await item.ref.collection('line_items').get()
          await Promise.all(lines.docs.map(async line => {
            const data = await line.data()
            accrual += data.accrual || 0
          }))
          item.ref.update({ accrual })
          totalAccrual += accrual
        }))
        db.collection('cpm_projects')
          .doc(projectId).update({ accrual: totalAccrual })
      })
  },

  deleteLineItem(_, { projectId, commitmentId, lineItemId }) {
    if (!projectId || !commitmentId || !lineItemId) return Promise.reject('bad request when updating line item')

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(projectId)
        .collection('commitments')
        .doc(commitmentId)
        .collection('line_items')
        .doc(lineItemId)
        .delete()
        .then(resolve)
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

import { db } from '@/utils/Firebase'
import { dataGet } from '@/utils/helpers'
import * as gqlBuilder from 'gql-query-builder'
import gql from 'graphql-tag'

import graphqlClient from '@/utils/graphql'
import axiosConfig from '@/modules/cpm/config/axios'

import Common from './_common'
const getTotals = new Common('/api/project', {
  host: axiosConfig.firestoreApiUrl
})

const actions = {
  index: (
    _,
    {
      projectId,
      search = '',
      filter,
      limit = 8,
      page = 1,
      sort = 'DESC',
      sortBy
    } = {}
  ) => {
    if (!projectId) return Promise.reject()

    return new Promise((resolve, reject) => {
      const { query, variables } = gqlBuilder.query({
        operation: 'cpmProjectCommitments',
        fields: [
          {
            meta: ['total', 'lastPage']
          },
          {
            data: [
              'id',
              'amount',
              'commit',
              'budgetCategory',
              'completionDate',
              'notes',
              'number',
              'openAmount',
              'spendingAmount',
              'vendor',
              'verifiedNotes',
              'verifiedStatus',
              { budget_category: ['id', 'name', 'code'] }
            ]
          }
        ],
        variables: {
          projectId: { value: projectId, type: 'ID', required: true },
          search: { value: search, type: 'String' },
          filter: {
            value: filter ? JSON.stringify(filter) : '',
            type: 'JSON'
          },
          limit: { value: limit, type: 'Int' },
          page: { value: page, type: 'Int' },
          sort: { value: sort, type: 'Sort' },
          sortBy: { value: sortBy[0] || 'number', type: 'String' }
        }
      })

      graphqlClient
        .query({
          query: gql(query),
          variables
        })
        .then(async response => {
          if (response.errors || response.error) {
            return reject(response.errors || response.error)
          }

          const result = response.data.cpmProjectCommitments

          if (result.data.length) {
            result.data = await Promise.all(result.data.map(async (i, index) => {
              const ref = db
                .collection('cpm_projects')
                .doc(`${projectId}`)
                .collection('commitments')
                .doc(i.id)

              const snap = await ref.collection('line_items').get()
              const promises = []
              snap.docs.forEach(lines => {
                promises.push(lines.data())
              })

              await Promise.all(promises)
              i.vendors = promises.map(li => {
                if (li.vendor && li.vendor.title) {
                  return li.vendor.title
                }
              })
              i.vendors = [...new Set(i.vendors)]
              return i
            }))
            resolve(result)
          } else {
            return resolve(result)
          }
        })
        .catch(reject)
    })
  },

  update(_, { commitment = {}, projectId }) {
    if (!commitment.id || !projectId) return Promise.reject()


    if (dataGet(commitment, 'budget_category.ref.id')) {
      commitment.budget_category.ref = db.collection('settings')
        .doc(window.Drupal.settings.m6_platform.company_nid)
        .collection('settings')
        .doc('budgets')
        .collection('budget_categories')
        .doc(commitment.budget_category.ref.id)
    } else {
      delete commitment.budget_category
    }

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(projectId)
        .collection('commitments')
        .doc(commitment.id)
        .update(commitment)
        .then(() => {
          resolve()
        })
        .catch(reject)
    })
  }
}

export default {
  namespaced: true,
  actions
}

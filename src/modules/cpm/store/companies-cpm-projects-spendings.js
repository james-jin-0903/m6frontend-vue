import * as gqlBuilder from 'gql-query-builder'
import gql from 'graphql-tag'

import { db } from '@/utils/Firebase'
import graphqlClient from '@/utils/graphql'

const actions = {
  index(
    /* eslint-disable-next-line */
    { commit },
    { projectId, endToday, timeAgo, orderBy, asSnapshot = false } = {}
  ) {
    if (!projectId) return Promise.reject()

    let ref = db
      .collection('cpm_projects')
      .doc(`${projectId}`)
      .collection('spendings')

    if (endToday) {
      ref = ref.where('paidDate', '<=', endToday)
    }

    if (timeAgo) {
      ref = ref.where('paidDate', '>=', timeAgo)
    }

    if (orderBy) {
      ref = ref.orderBy('paidDate')
    }

    if (asSnapshot) {
      return ref.get()
    }

    return new Promise((resolve, reject) =>
      ref
        .get()
        .then(({ docs }) =>
          Promise.all(
            docs.map(async item => {
              const data = await item.data()

              return { ...data, id: data.id }
            })
          ).then(resolve)
        )
        .catch(reject)
    )
  },

  indexELK: (
    /* eslint-disable-next-line */
    { commit },
    {
      projectId,
      search = '',
      filter,
      limit = 8,
      page = 1,
      sort = 'ASC',
      sortBy
    } = {}
  ) => {
    if (!projectId) return Promise.reject()
    return new Promise((resolve, reject) => {
      const { query, variables } = gqlBuilder.query({
        operation: 'cpmProjectSpendings',
        fields: [
          {
            meta: ['total', 'lastPage']
          },
          {
            data: [
              'id',
              'amount',
              'description',
              'costCodeText',
              'dateOpenedText',
              'number',
              'paidDateText',
              'po_number',
              // { files: ['name', 'url', 'file', 'size', 'path'] },
              { commitment: ['id', 'number', 'vendor'] },
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
            // eslint-disable-next-line no-console
            console.error(response.errors || response.error)
          }
          const result = response.data.cpmProjectSpendings

          if (result.data.length) {
            result.data = await Promise.all(result.data.map(async (i, index) => {
              const ref = db
                .collection('cpm_projects')
                .doc(`${projectId}`)
                .collection('spendings')
                .doc(i.id)

              const snap = await ref.collection('line_items').get()
              const promises = []
              snap.docs.forEach(lines => {
                promises.push(lines.data())
              })

              await Promise.all(promises)
              i.vendors = promises.map(li => {
                if (li.line_number === '1' || li.line_number === 1) {
                  if (i.dateOpenedText !== li.dateText) {
                    ref.update({ dateOpenedText: li.dateText })
                    i.dateOpenedText = li.dateText
                  }
                }
                return li.vendor.title
              })
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

  create(_, { projectId, spending }) {
    if (!projectId || !spending) return Promise.reject()

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(projectId)
        .collection('spendings')
        .add(spending)
        .then(resolve)
        .catch(reject)
    })
  }
}

export default {
  namespaced: true,
  actions
}

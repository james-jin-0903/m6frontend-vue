import axios from 'axios'
import { firestoreAction } from 'vuexfire'
import * as gqlBuilder from 'gql-query-builder'
import gql from 'graphql-tag'

import { db } from '@/utils/Firebase'
import graphqlClient from '@/utils/graphql'

import Common from './_common'


import cpmProjects from './companies-cpm-projects'


const companySave = new Common('/m6-platform/company/save')

const state = {
  companies: [],
  isMyMember: false
}

const getters = {
  companies: state => state.companies.filter(({ deleted }) => !deleted),
  getIsMyMember: state => state.isMyMember
}

const actions = {
  bindCompanies: firestoreAction(({ bindFirestoreRef }) =>
    bindFirestoreRef('companies', db.collection('m6companies'), {
      maxRefDepth: 0
    })
  ),

  index: (
    _,
    { search = '', filter, limit = 8, page = 1, sort = 'DESC', sortBy } = {}
  ) =>
    new Promise((resolve, reject) => {
      const { query, variables } = gqlBuilder.query({
        operation: 'm6companies',
        fields: [
          {
            meta: ['total', 'lastPage']
          },
          {
            data: [
              'nid',
              'logo',
              'title',
              'description',
              'address',
              'website',
              'phone'
            ]
          }
        ],
        variables: {
          search: { value: search ? `*${search}*` : '', type: 'String' },
          filter: {
            value: filter ? JSON.stringify(filter) : '',
            type: 'JSON'
          },
          limit: { value: limit, type: 'Int' },
          page: { value: page, type: 'Int' },
          sort: { value: sort, type: 'Sort' },
          searchType: { value: 'query_string', type: 'String' },
          sortBy: { value: sortBy || 'createdAt', type: 'String' }
        }
      })

      graphqlClient
        .query({
          query: gql(query),
          variables
        })
        .then(response => {
          if (response.errors || response.error) {
            return reject(response.errors || response.error)
          }

          return resolve(response.data.m6companies)
        })
        .catch(reject)
    }),

  store(_, { resource = {} }) {
    if (!resource.nid) return Promise.reject()

    return db
      .collection('m6companies')
      .doc(resource.nid)
      .set(resource)
  },

  update: (_, data = {}) => {
    if (!data.company_id) return Promise.reject()

    return new Promise(async (mainResolve, mainReject) => {
      db.collection('m6companies')
        .doc(`${data.company_id}`)
        .update(data.company)
        .then(
          () =>
            new Promise((resolve, reject) =>
              companySave
                .store({}, data)
                .then(resolve)
                .catch(reject)
            )
        )
        .then(data => mainResolve(data))
        .catch(e => mainReject(e))
    })
  },

  destroy(_, { companyNid }) {
    if (!companyNid) return Promise.reject()

    return db
      .collection('m6companies')
      .doc(companyNid)
      .update({ deleted: true })
      .then(() =>
        axios.post('/m6-platform/api/companies', {
          company_nid: companyNid,
          action: 'delete_company'
        })
      )
  },

  isMyMemberUpdate: ({ commit }, isMyMember) => {
    commit('setIsMyMember', isMyMember)
  }
}

const mutations = {
  setIsMyMember(state, payload) {
    state.isMyMember = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
    cpmProjects
  }
}

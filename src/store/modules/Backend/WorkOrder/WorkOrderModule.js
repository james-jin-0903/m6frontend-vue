/* eslint-disable no-empty-pattern */
import axios from 'axios'
import auth from '../../Auth'

export default {
  namespaced: true,
  state: {
    actionFeed: [],
    filter: {},
    sort: {}
  },
  getters: {
    getActionFeed: state => {
      if (state.sort) {
        function compare(a, b) {
          if (a[state.sort.key] > b[state.sort.key]) {
            return -1
          }
          if (a[state.sort.key] < b[state.sort.key]) {
            return 1
          }
          return 0
        }
        return state.actionFeed.sort(compare)
      } else {
        return state.actionFeed
      }
    },
    getFilter: state => state.filter,
    getSort: state => state.sort
  },
  mutations: {
    SET_WORK_ORDER: (state, payload) => state.actionFeed = payload,
    SET_WORK_FILTER: (state, payload) => state.filter = payload,
    SET_WORK_SORT: (state, payload) => state.sort = payload,
    UPDATE_ACTION_ITEM: async ({}, payload) => await axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/wo_assignments/${payload.id}`, payload)
  },
  actions: {
    updateActionItem({ commit }, data) {
      const item = data['items'].filter(e => e.assignee === auth.state.user.id)
      if (item.length > 0) {
        commit('UPDATE_ACTION_ITEM', {
          id: item[0]['id'],
          status: data['value']
        })
      }
    },
    updateActionItemInfo({ commit }, data) {
      const item = data['assignment_list'].filter(e => e === auth.state.user.id)
      if (item.length > 0) {
        axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/work_order/${data['id']}`, data)
      }
    },
    async getActionsFeed({}, payload) {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/dynamic_apps/by/${payload}`)
    },
    async getAvailableApps() {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/dynamic_apps/apps`)
    },
    setWorkFilter({ commit }, data) {
      commit('SET_WORK_FILTER', data)
    },
    setWorkSort({ commit }, data) {
      commit('SET_WORK_SORT', data)
    },
    async setWorkOrder(state) {
      const usr = auth.state.user
      if (Object.keys(usr).length > 0) {
        const res = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/work_order/${usr.id}/${state.state.filter.key}/${usr.currentCompany}`)
        state.commit('SET_WORK_ORDER', res['data'] ? res['data'] : [])
      }
    },
    async getUsersList({}, data) {
      return await axios.post(`${process.env.VUE_APP_LAMBDA}/users/list/ids`, {
        ids: data
      })
    },
    async getRecords({}, type) {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/records/${type}`)
    },
    async postAction({}, data) {
      if (data.application_id > 0) {
        data['app_record_id'] = data['record_id']
        data['record_id'] = data['application_id']
        data['application_id'] = null
      }

      return await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/work_order`, data)
    },
    putAction({}, data) {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/work_order/${data['id']}`, data['query'])
    },
    deleteAction({}, actionID) {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/work_order/${actionID}`)
    }
  }
}

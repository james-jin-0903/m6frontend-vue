import axios from 'axios'

const state = {}

const getters = {}

const mutations = {}

const actions = {
  createTable(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/app_tables`, payload)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(e => {
          console.log(e.response)
          console.log(e)
          reject(e)
        })
    })
  },

  // eslint-disable-next-line camelcase
  updateTable(_, { id, title, add_totals_row, add_sub_totals } = {}) {
    return new Promise((resolve, reject) => {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/app_tables/${id}`, {
        title,
        // eslint-disable-next-line camelcase
        add_totals_row,
        // eslint-disable-next-line camelcase
        add_sub_totals
      })
        .then(({ data }) => {
          resolve(data)
        })
        .catch(e => {
          console.log(e)
          console.log(e.response)
          reject(e)
        })
    })
  },

  getTableFields(_, tableID) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/app_tables/${tableID}/fields`)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(e => reject(e))
    })
  },

  createAppTableRow(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/table_rows`, payload)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(e => reject(e))
    })
  },

  getTableRowValues(_, { tableID, recordID } = {}) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/table_rows/${tableID}/record/${recordID}`)
        .then(({ data }) => {
          resolve(data.results)
        })
        .catch(e => {
          reject(e)
        })
    })
  },

  deleteTableRowByID(_, tableRowID) {
    return new Promise((resolve, reject) => {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/table_rows/${tableRowID}`)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },

  updateFieldsList(_, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/fields`, payload)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(e => reject(e))
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

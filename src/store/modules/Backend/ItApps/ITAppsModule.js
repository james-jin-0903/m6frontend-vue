/* eslint-disable no-empty-pattern */
/* eslint-disable camelcase */
import axios from 'axios'
import generalListModule from '../../GeneralListModule'
const ItAppDescription = require('@/store/models/itapp_description')
const ItAppDependencies = require('@/store/models/itapp_dependencies')

export default {
  namespaced: true,
  state: {
    itappsRecords: [],
    filter: {}
  },
  getters: {
    getFilter: state => state.filter
  },
  mutations: {
    SET_FILTER_TAG: (state, payload) => state.filter = payload
  },
  actions: {
    set_filter_tag({ commit }, data) {
      commit('SET_FILTER_TAG', data)
    },
    // Push record
    async push_record({}, id) {
      const a = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/itapps/get_itapp_info/${id}`)
      generalListModule.state.general_list.push(a.data)
    },
    async get_filter_apps(cont, data) {
      const response = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/filter/apps`, data)

      cont.state.itappsRecords = response['data']
      generalListModule.state.general_list = cont.state.itappsRecords
    },
    async get_filter_builder_apps(cont, data) {
      const response = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/filter/builder-apps`, data)

      cont.state.itappsRecords = response['data']
      generalListModule.state.general_list = cont.state.itappsRecords
    },
    async search_apps(cont, keyword) {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/apps/search?keyword=${keyword}`)
    },
    async get_select_apps() {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/apps/selects`)
    },
    // GET Apps
    async get_all_apps(cont) {
      let response = []
      switch (cont.state.filter.key) {
        case 'everyone':
          response = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/apps`)
          break
        case 'itapps':
          response = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/itapps`)
          break
        case 'dynamicapps':
          response = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/dynamic_apps`)
          break
      }
      cont.state.itappsRecords = response['data']
      generalListModule.state.general_list = cont.state.itappsRecords
    },
    async get_description({}, id) {
      const response = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/itapps/get_itapp_info/${id}`)
      return ItAppDescription.toItappsDescription(response.data)
    },
    // POST ITApp
    async post_it_apps({}, data) {
      return await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/record/itapp`, data).then(record => {
        generalListModule.state.general_list.push(record.data.record)
      })
    },
    // Put Itapps
    async put_itapp_description({}, data) {
      data.also_known.forEach((item, index) => {
        if (typeof item === 'string') {
          data.also_known[index] = {
            created_at: undefined,
            field: 'also_know_as',
            foreign_id: data.id,
            id: undefined,
            updated_at: undefined,
            value: item
          }
        }
      })
      data.formerly_known.forEach((item, index) => {
        if (typeof item === 'string') {
          data.formerly_known[index] = {
            created_at: undefined,
            field: 'formerly_known_as',
            foreign_id: data.id,
            id: undefined,
            updated_at: undefined,
            value: item
          }
        }
      })
      return await axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/itapps/update_all_info/${data.id}`, ItAppDescription.itappsDescriptionToJson(data))
    },
    // Licensing
    async get_licensing({}, appId) {
      const response = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/licensing/${appId}`)
      return Object.keys(response.data).length === 0 ? {} : {
        id: response.data.id,
        licenseType: response.data.type,
        users: response.data.estimated_users,
        concurrentUsers: response.data.estimated_current_users,
        licenses: response.data.number_of_licenses,
        details: response.data.details
      }
    },
    async post_licensing({}, data) {
      return await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/licensing`, data)
    },
    put_licensing({}, data) {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/licensing/${data.id}`, data)
    },
    delete_licensing({}, id) {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/licensing/${id}`)
    },
    // Dependencies
    async get_dependencies({}, appId) {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/dependencie/${appId}`)
    },
    async post_dependency({}, data) {
      return await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/dependencie`, data)
    },
    put_dependencies({}, data) {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/dependencie/${data.id}`, ItAppDependencies.dependenciesToJson(data))
    },
    delete_dependency({}, id) {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/dependencie/${id}`)
    },
    // Notifications
    async post_notification({}, data) {
      const res = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/notification`, data)
      return res.data
    },
    async get_notifications({}, id) {
      const res = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/notifications/${id}`)
      return res.data
    },
    delete_notification({}, id) {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/notification/${id}`)
    },
    async put_notification({}, obj) {
      return await axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/notification/${obj.notification.id}`, obj)
    },
    // Contracts
    async get_contracts({}, id) {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/contract/${id}`)
    },
    async post_contract({}, data) {
      const res = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/contract`, data)
      return res.data
    },
    put_contract({}, contract) {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/contract/${contract.id}`, contract)
    },
    delete_contract({}, id) {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/contract/${id}`)
    },
    // Installation
    async get_installation({}, id) {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/itapps/get_install_info/${id}`)
    },
    update_installation({}, data) {
      data.general_info.odbc_connection_required = data.general_info.odbc_connection_required === 'Yes' ? true : false
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/install`, data)
    },
    // Rationalization Cost
    async post_ratio_cost({}, data) {
      return await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_costs`, data)
    },
    async get_ratio_cost({}, appID) {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_costs/${appID}`)
    },
    put_ratio_cost({}, data) {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_costs/${data.id}`, data)
    },
    delete_ratio_cost({}, id) {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_costs/${id}`)
    },
    // Rationalization License
    async get_ratio_lic({}, appID) {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_licensing/${appID}`)
    },
    async post_ratio_lic({}, data) {
      return await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_licensing`, data)
    },
    put_ratio_list({}, data) {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_licensing/${data.id}`, data)
    },
    delete_ratio_lic({}, id) {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_licensing/${id}`)
    },
    // Rationalization License
    async get_ratio_fte({}, appID) {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_fte/${appID}`)
    },
    async post_ratio_fte({}, data) {
      return await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_fte`, data)
    },
    put_ratio_fte({}, data) {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_fte/${data.id}`, data)
    },
    delete_ratio_fte({}, id) {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_fte/${id}`)
    },
    // Rationalization Users
    async get_ratio_usr({}, appID) {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_user/${appID}`)
    },
    async post_ratio_usr({}, data) {
      return await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_user`, data)
    },
    put_ratio_usr({}, data) {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_user/${data.id}`, data)
    },
    delete_ratio_usr({}, id) {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_user/${id}`)
    },
    // Rationalization Governance
    async get_ratio_gov({}, appID) {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_governance/${appID}`)
    },
    async post_ratio_gov({}, data) {
      return await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_governance`, data)
    },
    put_ratio_gov({}, data) {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_governance/${data.id}`, data)
    },
    delete_ratio_gov({}, id) {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_governance/${id}`)
    },
    // Rationalization Attribute
    async get_ratio_att({}, appID) {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_attribute/${appID}`)
    },
    put_ratio_att({}, data) {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/rationalization_attribute/${data.id}`, data)
    },
    // GETS Selects
    async get_selects({}, url) {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/apps_settings/specifi/field${url}`)
    },
    async get_all_selects({}, data) {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/apps_settings/per_param/field`, {
        params: data
      })
    },
    // Tags
    async getTagsAkaFka({}, id) {
      return await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/tag/specifi/foreign_id/${id}`)
    },
    put_tags({}, obj) {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/some_tags`, {
        params: obj
      })
    }
  }
}

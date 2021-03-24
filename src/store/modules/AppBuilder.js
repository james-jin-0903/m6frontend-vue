import axios from 'axios'
const PreviewTabsManager  = () => import("@/components/RecordMode/RecordComponents/RecordType/DynamicApp/PreviewTabsBuilder.vue")
import { dataGet } from '@/utils/helpers'
const defaultState = {
  app: {},
  appsList: [],
  iconData: {}
}
const state = () => defaultState
const getters = {}
const mutations = {
  setIconData(state, payload) { 
    if (!payload || Object.keys(payload).length === 0) {
      state.iconData = {
        icon: 'mdi-account-circle',
        background: '#AAA',
        iconColor: '#AAA',
      }
    } else {
      state.iconData = {...payload}
    }
  },
  setCurrentApp(state, payload) {
    state.app = payload
  },
  setAppList(state, payload) {
    state.appsList = payload
  },
  deleteTab(state, payload) {
    const tab = state.app.tabs.filter(row => row.id !== payload)
    state.app.tabs = tab
  }
}

const actions = {
  async getNavigationPreView(context, appID) {
    const tabs = []
    const app = await context.dispatch('getApp', appID)

    app.tabs.forEach((tab, i) => {
      tabs.push({
        name: tab.title,
        index: i,
        component: PreviewTabsManager,
        icon: 'mdi-table-row'
      })
    })

    return tabs
  },
  getApp({ commit }, payload = 1) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/app/${payload}`).then(({ data }) => {
        const appIcon = JSON.parse(data.metadata)
        if(appIcon){
          commit('setIconData', dataGet(appIcon, 'appIcon', ''))
        }else{
          commit('setIconData', "")
        }
        commit('setCurrentApp', data)
        resolve(data)
      }).catch(e => reject(e))
    })
  },

  getAppList({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/app/list`).then(({ data }) => {
        commit('setAppList', data)
        resolve(data)
      })
        .catch(e => reject(e))
    })
  },

  updateApp(_, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/app`, payload)
        .then(resolve)
        .catch(reject)
    })
  },

  listTabs(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/tab/list`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  listPanels(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/panel/list`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  listFields(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/field/list`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  listRecords(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/record/list`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },

  listFieldValue(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/fieldValue/list`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },


  saveTab(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/tab`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => {
        console.log(e)
        console.log(e.response);
        reject(e)})
    })
  },

  updateTab(_, { id, tabToEdit }) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/tab/${id}`, {
        tabToEdit
      }).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },

  switchOrderTabs(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/tab/switch-order`, payload)
        .then(resolve)
        .catch(reject)
    })
  },

  copyPanel(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/panel/${payload}/copy`).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  copyPanelFromApp(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/panel/${payload.panelId}/copy`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  savePanel(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/panel`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  saveField(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/field`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  saveFieldsFromExcel(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/fields`, payload).then((response) => {
        resolve(response.data.result)
      }).catch(e => reject(e))
    })
  },
  createRecord(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/record`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },

  saveFieldValue(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/fieldValue`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },

  updatePanel(_, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/panel/${payload.id}`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },

  async movePanel(_, payload) {
    return await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/panel/${payload.id}/move`, payload)
      .then(({ data }) => data);
  },

  updateField(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/field/${payload.id}/update`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },

  async moveField(_, payload) {
    return await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/field/${payload.id}/move`, payload)
      .then(({ data }) => data);
  },

  updateRecord(_, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/record/${payload.id}`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  updateFieldValue(_, payload) {
    return new Promise((resolve, reject) => {
      axios.patch(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/fieldValue/${payload.id}`, payload).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  deleteTab(_, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/tab/${payload}`).then((response) => {
        if (response.status === 200) {

        }
        resolve(response)
      }).catch(e => reject(e))
    })
  },
  deletePanel(_, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/panel/${payload}`).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  deleteField(_, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/field/${payload}`).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },
  deleteTable(_, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/app_tables/${payload}`).then(({ data }) => {
        resolve(data)
      }).catch(e => {
        reject(e)
      })
    })
  },
  deleteRecord(_, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/record/${payload}`).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },

  deleteFieldValue(_, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/fieldValue/${payload}`).then(({ data }) => {
        resolve(data)
      }).catch(e => reject(e))
    })
  },

  bulkSaveFieldValues(_, payload) {
    return new Promise(resolve => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/field_values`, payload).then(({ data }) => {
        resolve(data)
      })
        .catch(err => resolve(err))
    })
  },

  getFieldValuesPerPanel(_, { recordID, panelID, ids } = {}) {
    return new Promise((resolve, reject) => {
      // axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/field_values/by_panel/${recordID}/${panelID}`)
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/field_values/by_panel/${recordID}/${panelID}`, { ids })
        .then(({ data }) => {
          resolve(data)
        })
        .catch(e => reject(e))
    })
  },

  updateSomeFieldValues(_, payload) {
    return new Promise((resolve, reject) => {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/field_values/some`, payload)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(e =>{reject(e); console.log(e.response)})
    })
  },

  deleteFieldsByIds(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/field_values/fieldsByIds`, payload)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(e => reject(e))
    })
  },

  deleteApp(_, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/app/${payload}`)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(e => reject(e))
    })
  },

  recordsByApps(_, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/records_by_apps`, payload)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(e => reject(e))
    })
  },

  getSingleRecordFieldValue(_, { currentRecordID, referenceRecordID, fieldID, refID } = {}) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/field_values/reference/${currentRecordID}/${referenceRecordID}/${fieldID}/${refID}`)
        .then(({ data }) => {
          resolve(data)
        })
        .catch(e => reject(e))
    })
  },

  async getAppActivitiesById({}, id) {
    const res = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/apps_settings/m6works/${parseInt(id)}/activities`)
    return res.data
  },

  async getAllAppFields({}, id) {
    const res = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/field/list/all`,{
      appId: parseInt(id)
    })
    return res.data
  },

  getAppFields(_, appID) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/app/fields/${appID}`)
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

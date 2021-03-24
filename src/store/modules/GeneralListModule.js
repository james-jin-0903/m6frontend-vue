/* eslint-disable camelcase */
import NavStack from './NavigationStack'
import MockData from '../MockData'
import _ from 'lodash'

export default {
  namespaced: true,
  state: {
    screen_status: false,
    record_full_screen: {},
    active_previews: [
      {},
      {}
    ],
    idle_previews: [],
    general_list: [],
    companies_list: [],
    fieldLists: []
  },
  getters: {
    get_record_full_screen: state => () => state.record_full_screen,
    get_active_previews: state => () => state.active_previews,
    get_screen_status: state => () => state.screen_status,
    get_idle_previews: state => () => state.idle_previews,
    get_general_list: state => () => state.general_list,
    get_companies_list: state => () => state.companies_list,
    get_fields_list: state => state.fieldLists
  },
  mutations: {
    set_companies_list_data(state, proj) {
      state.companies_list = proj
    },
    set_general_list_data(state, proj) {
      state.general_list = proj
    },
    set_active_previews(state, new_data) {
      state.active_previews = new_data
    },
    set_idle_previews(state, new_data) {
      state.idle_previews = new_data
    },
    preview_screen(state) {
      state.screen_status = false
    },
    full_screen(state, item) {
      state.record_full_screen = item
      state.screen_status = true
    },
    push_to_idle(state, data) {
      let onArray = false
      state.idle_previews.forEach(item => {
        if (item === data) {
          onArray = true
        }
      })
      if (!onArray) {
        state.idle_previews.push(data)
      }
    },
    unshift_to_idle(state, data) {
      let onArray = false
      state.idle_previews.forEach(item => {
        if (item === data) {
          onArray = true
        }
      })
      if (!onArray) {
        state.idle_previews.unshift(data)
      }
    }
  },
  actions: {
    // API simulation
    load_mock_general_data({ commit }) {
      const data = MockData.fake_records
      commit('set_general_list_data', data)
    },
    // companies
    load_mock_companies_data({ commit }) {
      const data = MockData.fake_companies
      commit('set_companies_list_data', data)
    },
    // Active Settings
    push_data_to_active(context, preview_object) {
      let validator = false
      if (context.state.active_previews[0] === preview_object || context.state.active_previews[1] === preview_object) {
        validator = true
      }
      if (!validator) {
        const newArray = _.remove(context.state.idle_previews, function (n) {
          return n !== preview_object
        })
        context.commit('set_idle_previews', newArray)

        let val = false
        let i

        for (i = 0; i < 2; i++) {
          if (!val && Object.keys(context.state.active_previews[i]).length === 0) {
            val = true
            if (i === 0) {
              if (
                NavStack.state.hidden1 &&
                !NavStack.state.hidden2 &&
                context.state.idle_previews.length !== 0 &&
                Object.keys(context.state.active_previews[1]).length === 0) {
                i++
              } else {
                NavStack.state.hidden1 = false
              }
            } else {
              NavStack.state.hidden2 = false
            }
            context.state.active_previews.splice(i, 1, preview_object)
          }
        }
        if (!val) {
          context.state.active_previews.unshift(preview_object)
          context.dispatch('push_data_to_idle', context.state.active_previews[i])

          context.state.active_previews.splice(i, 1, preview_object)
        }
      }
    },
    unshift_data_to_active(context, record) {
      if (Object.keys(context.state.active_previews[1]).length !== 0) {
        context.dispatch('push_data_to_idle', context.state.active_previews[1])
      }
      context.state.active_previews.splice(1, 1, record)
      NavStack.state.hidden2 = false
      context.dispatch('remove_from_idle', record)
    },
    remove_record_from_active(context, record) {
      const index = context.state.active_previews.indexOf(record)
      context.state.active_previews.splice(index, 1, new Object)

      const lengthActive1 = Object.keys(context.state.active_previews[0]).length
      const lengthActive2 = Object.keys(context.state.active_previews[1]).length
      if (
        lengthActive1 === 0 && lengthActive2 === 0 &&
        context.state.idle_previews.length > 0
      ) {
        NavStack.state.hidden1 = true
        NavStack.state.hidden2 = true
      } else if (lengthActive1 === 0) {
        NavStack.state.hidden1 = true
        NavStack.state.hidden2 = false
      } else if (lengthActive2 === 0) {
        NavStack.state.hidden1 = false
        NavStack.state.hidden2 = true
      } else {
        index === 0 ? NavStack.state.hidden1 = true : NavStack.state.hidden2 = true
      }
    },
    hidden_preview(context, item) {
      if (Object.keys(item).length !== 0) {
        const index = context.state.active_previews.indexOf(item)
        context.dispatch('remove_record_from_active', item)
        index === 0 ? context.dispatch('push_data_to_idle', item) : context.dispatch('unshift_data_to_idle', item)
      }
    },
    // Idle Settings
    push_data_to_idle({ commit }, previewObject) {
      if (Object.keys(previewObject).length !== 0) {
        commit('push_to_idle', previewObject)
      }
    },
    unshift_data_to_idle({ commit }, previewObject) {
      if (Object.keys(previewObject).length !== 0) {
        commit('unshift_to_idle', previewObject)
      }
    },
    remove_from_idle(context, item) {
      const newArray = _.remove(context.state.idle_previews, function (n) {
        return n !== item
      })
      context.commit('set_idle_previews', newArray)
      if (context.state.idle_previews.length === 0) {
        NavStack.state.hidden1 = false
        NavStack.state.hidden2 = false
      }
      if (context.state.idle_previews.length === 1 &&
        NavStack.state.hidden1 === true && NavStack.state.hidden2 === true
      ) {
        NavStack.state.hidden1 = true
        NavStack.state.hidden2 = false
      }
    },
    show_preview_of_idle(context, item) {
      if (context.state.screen_status) {
        context.dispatch('remove_from_idle', item)
        context.dispatch('push_data_to_idle', context.state.record_full_screen)
        context.dispatch('full_screen', item)
      } else {
        context.dispatch('push_data_to_active', item)
      }
    },
    // Screen
    full_screen(context, item) {
      for (let i = 0; i < 2; i++) {
        context.dispatch('push_data_to_idle', context.state.active_previews[i])
        context.dispatch('remove_record_from_active', context.state.active_previews[i])
      }
      context.dispatch('push_data_to_idle', context.state.record_full_screen)
      context.dispatch('remove_from_idle', item)
      context.commit('full_screen', item)
      if (context.state.idle_previews.length === 1) {
        NavStack.state.hidden1 = true
        NavStack.state.hidden2 = false
      }
    },
    preview_screen(context, item) {
      context.dispatch('push_data_to_active', item)
      const lengthActive1 = Object.keys(context.state.active_previews[0]).length
      const lengthActive2 = Object.keys(context.state.active_previews[1]).length

      if (
        lengthActive1 === 0 && lengthActive2 === 0 &&
        context.state.idle_previews.length > 0
      ) {
        NavStack.state.hidden1 = true
        NavStack.state.hidden2 = true
      } else if (lengthActive1 === 0) {
        NavStack.state.hidden1 = true
        NavStack.state.hidden2 = false
      } else if (lengthActive2 === 0) {
        NavStack.state.hidden1 = false
        NavStack.state.hidden2 = true
      }
    },
    preview_screen_from_full_screen(cont, item) {
      cont.dispatch('close_full_screen')
      NavStack.state.hidden1 === true && NavStack.state.hidden2 === false ?
        cont.dispatch('unshift_data_to_active', item) :
        cont.dispatch('preview_screen', item)
    },
    close_full_screen(cont) {
      cont.state.record_full_screen = new Object
      cont.commit('preview_screen')
    },
    hidden_full_screen(cont, object) {
      cont.commit('preview_screen')
      cont.state.idle_previews.length === 0 ? cont.commit('push_to_idle', object) : cont.commit('unshift_to_idle', object)
      if (cont.state.idle_previews.length !== 0 && Object.keys(cont.state.active_previews[1]) === 0) {
        NavStack.state.hidden2 = true
      }
      if (
        Object.keys(cont.state.active_previews[1]) === 0 &&
        Object.keys(cont.state.active_previews[0]) === 0 &&
        cont.state.idle_previews.length === 1
      ) {
        NavStack.state.hidden1 = true
        NavStack.state.hidden2 = false
      }
    }
  }
}

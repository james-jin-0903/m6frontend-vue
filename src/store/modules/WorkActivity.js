import axios from 'axios'

const state = {
  list: []
}

const mutations = {
  setActionList(state, payload) {
    state.list = payload
  },

  updateActivity(state, { id, activity }) {
    const idx = state.list.findIndex(a => a.id === id)
    state.list.splice(idx, 1, { ...state.list[idx], ...activity })
  },

  deleteActivity(state, id) {
    const idx = state.list.findIndex(a => a.id === id)
    state.list.splice(idx, 1)
  }
}

const actions = {
  async getList({ commit, dispatch }) {
    const { data: activities } = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/work_order`)
    const uids = [
      ...new Set(activities.map(a => a.wo_assignments.map(w => w.assignee)).flat())
    ]
    const { data: users } = await dispatch('WorkOrderModule/getUsersList', uids, {
      root: true
    })

    activities.forEach(a => {
      a.assignees = []
      a.wo_assignments.forEach(w => {
        a.assignees.push(users.find(u => u.id === w.assignee))
      })
    })

    commit('setActionList', activities)
  },

  async updateWork({ commit, dispatch }, { id, activity }) {
    activity.colors = JSON.stringify({
      background: '#161615',
      text: '#E8E8E7'
    })
    console.log(activity.colors);
    await axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/work_order/${id}`, activity)
    if (activity.assignment_list.length) {
      const uids = activity.assignment_list
      const { data: users } = await dispatch('WorkOrderModule/getUsersList', uids, {
        root: true
      })
      activity.assignees = users
    } else {
      activity.assignees = []
    }

    commit('updateActivity', { id, activity })
  },

  deleteWork({ commit }, id) {
    return axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/work_order/${id}`)
      .then(({ data }) => {
        commit('deleteActivity', id)
        return data
      })
  },

  async getTasksByIds({}, ids) {
    const res = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/work_order/tasks_by_ids`, {
      'data': ids
    })
    return res.data
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

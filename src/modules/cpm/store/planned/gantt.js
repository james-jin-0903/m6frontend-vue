import { dataGet } from '@/utils/helpers'
import axios from 'axios'

const state = {
  milestones: [],
  tasks: [],
  links: [],
  forceRefresh: false,
  softRefreshData: false
}

const getters = {
  milestones: state => state.milestones,
  ticketsAvailables: state => state.tasks,
  links: state => state.links,
  tasks: state => ({
    data: state.tasks,
    links: state.links
  }),
  softRefreshData: state => state.softRefreshData,
  forceRefresh: state => state.forceRefresh
}

const mutations = {
  setMilestones(state, milestones) {
    state.milestones = milestones
  },
  setTasks(state, tasks) {
    state.tasks = tasks
  },
  setLinks(state, links) {
    state.links = links
  },
  setSoftRefreshData(state) {
    state.softRefreshData = !state.softRefreshData
  },
  setForceRefresh(state) {
    state.forceRefresh = !state.forceRefresh
  }
}

const actions = {
  async getProjectMilestonesTasksAndLinks({ rootState }, { commit }, { projectId }) {
    if (!projectId) return Promise.reject('missing projectId getProjectTasksAndLinks')
    try {
      const constfirebaseUrl = process.env.VUE_APP_FIREBASE_APIURL
      const companyId = rootState.Companies.currentCompany.id
      const response = await axios
        .post(`${constfirebaseUrl}/api/company/${companyId}/forecasting/${projectId}/milestones-tasks-links/`, {
          queryTaskFields: [
            'budget',
            'budgetPercentage',
            'duration',
            'due_date',
            'gantt',
            'in_schedule',
            'parent',
            'parentTask',
            'priority',
            'progress',
            'projectType',
            'start_date',
            'title'
          ]
        })

      const {
        milestones = [],
        tasks = [],
        links = []
      } = dataGet(response, 'data', {})

      commit('setMilestones', milestones)
      commit('setTasks', tasks)
      commit('setLinks', links)
      commit('setSoftRefreshData')

      return
    } catch (e) {
      console.error(e)
      throw e
    }
  },
  async generateProjectTaskLinks({ rootState }, { dispatch }, { projectId }) {
    if (!projectId) return Promise.reject('missing projectId generateProjectTaskLinks')
    try {
      const constfirebaseUrl = process.env.VUE_APP_FIREBASE_APIURL
      const companyId = rootState.Companies.currentCompany.id
      await axios
        .post(`${constfirebaseUrl}/api/company/${companyId}/forecasting/${projectId}/links/create/`)

      dispatch('getProjectMilestonesTasksAndLinks', { projectId })

      return
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}

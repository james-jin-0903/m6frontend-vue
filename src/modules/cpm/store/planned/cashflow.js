import gql from 'graphql-tag'
import * as gqlBuilder from 'gql-query-builder'
import graphqlClient from '@/utils/graphql'

import { db } from '@/utils/Firebase'
import { dataGet } from '@/utils/helpers'
import axios from 'axios'

import { debounce, differenceBy } from 'lodash'

const state = {
  budgetAndCumulativeTasks: [],
  tasksToDeleteInGantt: [],
  cashflowMonths: [],
  data: [],
  links: [],
  projectIds: [],
  reloadGantt: false,
  reloadBudgetAndCumulativeTasks: false,
  serieBudgetsByMonthTasks: {
    name: 'Budgets by month',
    data: []
  },
  serieCumulativeTasks: {
    name: 'Cumulative Budgets',
    data: []
  },
  totals: {}
}

const getters = {
  tasksToDeleteInGantt: state => state.tasksToDeleteInGantt,
  budgetAndCumulativeTasks: state => state.budgetAndCumulativeTasks,
  cashflowMonths: state => state.cashflowMonths,
  projectIds: state => state.projectIds,
  serieBudgetsByMonthTasks: state => state.serieBudgetsByMonthTasks,
  serieCumulativeTasks: state => state.serieCumulativeTasks,
  tasks(state) {
    return {
      data: state.data,
      links: state.links
    }
  },
  reloadGantt: state => state.reloadGantt,
  reloadBudgetAndCumulativeTasks: state => state.reloadBudgetAndCumulativeTasks,
  totals: state => state.totals
}

const mutations = {
  setCashflowMonths(state, months) {
    state.cashflowMonths = months
  },
  setData(state, data) {
    state.data = []
    state.data = data
  },
  setLinks(state, links) {
    state.links = []
    state.links = links
  },
  setProjectIds(state, ids) {
    state.projectIds = ids
  },
  setReloadGantt(state) {
    state.reloadGantt = !state.reloadGantt
  },
  setReloadBudgetAndCumulativeTasks(state) {
    state.reloadBudgetAndCumulativeTasks = !state.reloadBudgetAndCumulativeTasks
  },
  setSerieBudgetsByMonthTasks(state, payload) {
    state.serieBudgetsByMonthTasks = payload
  },
  setSerieCumulativeTasks(state, payload) {
    state.serieCumulativeTasks = payload
  },
  setTotals(state, totals) {
    state.totals = totals
  },
  setTasksToDeleteInGantt(state, tasks) {
    state.tasksToDeleteInGantt = tasks
  },
  updateTaskLocally(state, { id, field, value }) {
    const taskToUpdate = state.data.find(task => task.id === id)

    if (!taskToUpdate) return

    taskToUpdate[field] = value
  },
  addTaskLocally(state, { index, task }) {
    state.data.splice(index, 0, task)
  },
  setBudgetAndCumulativeTasks(state, tasks = []) {
    state.budgetAndCumulativeTasks = tasks
  },
  updateBudgetAndCumulativeTasks(state, tasks) {
    if (!tasks.length) return

    let tasksToDeleteInGantt = []
    if (state.budgetAndCumulativeTasks.length) {
      tasksToDeleteInGantt = differenceBy(state.budgetAndCumulativeTasks, tasks, 'id')
      state.tasksToDeleteInGantt = tasksToDeleteInGantt
    }

    state.budgetAndCumulativeTasks = tasks
    // const stateTasks = cloneDeep(state.data)
    // const filteredTasks = state.data.filter(task => !task.isBudgetsByMonthTask && !task.isCumulativeTask)
    // state.data = [...filteredTasks, ...tasks]

    state.reloadBudgetAndCumulativeTasks = !state.reloadBudgetAndCumulativeTasks
  }
}

const actions = {
  index(
    /* eslint-disable-next-line */
    { commit },
    {
      companyId,
      userId,
      search = '',
      filter,
      limit = 8,
      page = 1,
      sort = 'ASC',
      sortBy
    }
  ) {
    if (!companyId || !userId) return Promise.reject('Bad request index')

    return new Promise((resolve, reject) => {
      const { query, variables } = gqlBuilder.query({
        operation: 'cpmProjects',
        fields: [
          {
            meta: ['total', 'lastPage']
          },
          {
            data: [
              'id',
              'number',
              'title',
              { campus: ['name'] },
              { manager: ['label', 'value'] }
            ]
          }
        ],
        variables: {
          companyId: { value: companyId, type: 'ID', required: true },
          userId: { value: userId, type: 'ID', required: true },
          search: { value: search, type: 'String' },
          filter: {
            value: filter ? JSON.stringify(filter) : '',
            type: 'JSON'
          },
          limit: { value: limit, type: 'Int' },
          page: { value: page, type: 'Int' },
          sort: { value: sort, type: 'Sort' },
          sortBy: { value: sortBy || 'title', type: 'String' }
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

          return resolve(response.data.cpmProjects)
        })
        .catch(reject)
    })
  },

  async getProjectsTasksAndLinks({ rootState, commit }, { projectIds = [] } = {}) {
    try {
      const constfirebaseUrl = process.env.VUE_APP_FIREBASE_APIURL

      const response = await axios
        .post(`${constfirebaseUrl}/api/planned/projects/cash-flow/`, {
          companyId: rootState.Companies.currentCompany.id,
          projectIds
        })
      const data = dataGet(response, 'data.tasks', [])
      const links = dataGet(response, 'data.links', [])
      const cashflowMonths = dataGet(response, 'data.cashflowMonths', [])
      const totals = dataGet(response, 'data.totals', {})

      const serieBudgetsByMonthTasks = dataGet(response, 'data.serieBudgetsByMonthTasks')
      const serieCumulativeTasks = dataGet(response, 'data.serieCumulativeTasks')

      if (serieBudgetsByMonthTasks) {
        commit('setSerieBudgetsByMonthTasks', serieBudgetsByMonthTasks)
      }
      if (serieCumulativeTasks) {
        commit('setSerieCumulativeTasks', serieCumulativeTasks)
      }

      if (data.length) {
        const budgetAndCumulativeTasks = data.filter(task => task.isCumulativeTask || task.isBudgetsByMonthTask)
        commit('setBudgetAndCumulativeTasks', budgetAndCumulativeTasks)
      }

      commit('setCashflowMonths', cashflowMonths)
      commit('setProjectIds', projectIds)
      commit('setData', data)
      commit('setLinks', links)
      commit('setTotals', totals)
      commit('setReloadGantt')

      return
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  async createTask({ commit }, { task = {}, project = {}, taskIndex }) {
    if (task.type === 'project' || !project.id) return Promise.reject('bad request creating task')

    if (task.parent === project.id) {
      delete task.parent
    }

    delete task.id
    const newTask = {
      due_date: dataGet(task, 'end_date'),
      duration: dataGet(task, 'duration'),
      end_date: dataGet(task, 'end_date'),
      start_date: dataGet(task, 'start_date'),
      text: dataGet(task, 'text'),
      title: dataGet(task, 'text'),
      gantt: dataGet(project, 'gantt', 'forecasted'),
      parent: dataGet(task, 'parent', ''),
      projectId: project.id
    }

    const { id } = await db.collection('cpm_projects')
      .doc(project.id)
      .collection('tasks')
      .add(newTask)

    if (taskIndex) {
      commit('addTaskLocally', { task: { ...task, id }, index: taskIndex })
    }

    return id
  },

  async updateTask({ rootState }, { dispatch }, { task = {}, projectId }) {
    if (task.type === 'project' || !projectId) return Promise.reject('bad request updating task')

    return new Promise((resolve, reject) => {
      const budgetPercentage = Math.floor(dataGet(task, 'progress', 0) * 100)
      const budget = dataGet(task, 'fiscalYearBudget', 0) * (budgetPercentage / 100)

      db.collection('cpm_projects')
        .doc(projectId)
        .collection('tasks')
        .doc(task.id)
        .update({
          budget,
          due_date: dataGet(task, 'end_date'),
          duration: dataGet(task, 'duration'),
          end_date: dataGet(task, 'end_date'),
          start_date: dataGet(task, 'start_date'),
          text: dataGet(task, 'text'),
          budgetPercentage
        })
        .then(async () => {
          const constfirebaseUrl = process.env.VUE_APP_FIREBASE_APIURL

          // Update task forecast data
          const response = await axios
            .post(`${constfirebaseUrl}/api/planned/${projectId}/forecast-tasks/${task.id}/`, {
              companyId: rootState.Companies.currentCompany.id
            })

          // Update project forecast data
          dispatch('updateProjectForecastData', projectId)

          const updatedTask = dataGet(response, 'data')
          resolve(updatedTask)
        })
        .catch(reject)
    })
  },

  updateProjectForecastData: debounce(async ({ rootState }, { dispatch }, projectId) => {
    const constfirebaseUrl = process.env.VUE_APP_FIREBASE_APIURL
    await axios
      .post(`${constfirebaseUrl}/api/planned/${projectId}/forecast-tasks/`, {
        companyId: rootState.Companies.currentCompany.id
      })

    dispatch('getBudgetAndCumulativeTasks')
  }, 1000),

  async getBudgetAndCumulativeTasks({ rootState }, { commit, getters }) {
    const constfirebaseUrl = process.env.VUE_APP_FIREBASE_APIURL
    const response = await axios
      .post(`${constfirebaseUrl}/api/planned/projects/cash-flow/cumulative-tasks/`, {
        companyId: rootState.Companies.currentCompany.id,
        projectIds: getters.projectIds
      })

    const serieBudgetsByMonthTasks = dataGet(response, 'data.serieBudgetsByMonthTasks')
    const serieCumulativeTasks = dataGet(response, 'data.serieCumulativeTasks')

    if (serieBudgetsByMonthTasks) {
      commit('setSerieBudgetsByMonthTasks', serieBudgetsByMonthTasks)
    }

    if (serieCumulativeTasks) {
      commit('setSerieCumulativeTasks', serieCumulativeTasks)
    }

    const cashflowMonths = dataGet(response, 'data.cashflowMonths', [])

    commit('setCashflowMonths', cashflowMonths)
    commit('updateBudgetAndCumulativeTasks', dataGet(response, 'data.tasks', []))
  },

  async deleteTask({ dispatch }, { task = {}, projectId }) {
    if (task.type === 'project' || !projectId) return Promise.reject('bad request deleting task')

    try {
      await db.collection('cpm_projects')
        .doc(projectId)
        .collection('tasks')
        .doc(task.id)
        .delete()

      // Update project forecast data
      dispatch('updateProjectForecastData', projectId)
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  async createLink(_, { link = {}, project }) {
    if (!project.id) return Promise.reject('bad request creating link')

    delete link.id
    link.gantt = dataGet(project, 'gantt', 'forecasted')

    const { id } = await db.collection('cpm_projects')
      .doc(project.id)
      .collection('taskLinks')
      .add(link)

    return id
  },

  async updateLink(_, { link = {}, projectId }) {
    if (!link.id || !projectId) return Promise.reject('bad request updating link')

    db.collection('cpm_projects')
      .doc(projectId)
      .collection('taskLinks')
      .doc(link.id)
      .update(link)
  },

  async deleteLink(_, { link = {}, projectId }) {
    if (!link.id || !projectId) return Promise.reject('bad request deleting link')

    db.collection('cpm_projects')
      .doc(projectId)
      .collection('taskLinks')
      .doc(link.id)
      .delete()
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}

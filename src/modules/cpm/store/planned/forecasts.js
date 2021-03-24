import { db } from '@/utils/Firebase'
import { dataGet } from '@/utils/helpers'
import moment from 'moment'
import axios from 'axios'
import { orderBy, sortBy, union } from 'lodash'

const state = {
  allFiscalYears: [],
  allMonths: [],
  allScheduleMonths: [],
  budgetTotals: {},
  budgets: {},
  defaultTasks: [],
  fiscalYear: {},
  fiscalYearMonths: [],
  selectedFiscalYear: {},
  selectedFiscalYearsToCalulateAmounts: ['fy21'],
  showCurrentFiscalYearArea: true,
  tasks: []
}

const getters = {
  allFiscalYears: state => state.allFiscalYears,
  allMonths: state => {
    const allMonths = union(state.allScheduleMonths, state.fiscalYearMonths)

    const sortedMonths = sortBy(allMonths, date => new Date(date))

    return sortedMonths
  },
  allScheduleMonths: state => state.allScheduleMonths,
  budgets: state => state.budgets,
  budgetFiscalYear: state => state.fiscalYear,
  budgetTotals: state => state.budgetTotals,
  defaultTasks: state => state.defaultTasks,
  fiscalYearMonths: state => state.fiscalYearMonths,
  // Fiscals years that start after the current fiscal year
  futureFiscalYears: state => {
    if (!state.fiscalYear) {
      return state.allFiscalYears
    } else {
      const startDateCurentFiscalyear = new Date(dataGet(state, 'fiscalYear.startDate', ''))
      return state.allFiscalYears.filter(fiscalYear => {
        const date = new Date(dataGet(fiscalYear, 'startDate', ''))

        if (date > startDateCurentFiscalyear) {
          return true
        }
      })
    }
  },
  previousFiscalYears: state => {
    if (!state.fiscalYear) {
      return []
    } else {
      const startDateCurentFiscalyear = new Date(dataGet(state, 'fiscalYear.startDate', ''))
      return state.allFiscalYears.filter(fiscalYear => {
        const date = new Date(dataGet(fiscalYear, 'startDate', ''))

        if (date < startDateCurentFiscalyear) {
          return true
        }
      })
    }
  },
  monthsForForecastsTable: state => getMonthsBetweenTwoDate(dataGet(state.tasks, '0.start_date', ''), dataGet(state.fiscalYear, 'endDate', '')),
  selectedFiscalYear: state => state.selectedFiscalYear,
  selectedFiscalYearsToCalulateAmounts: state => [
    dataGet(state, 'selectedFiscalYear.value', '')
  ],
  showCurrentFiscalYearArea: state => state.showCurrentFiscalYearArea,
  tasks: state => state.tasks
}

const mutations = {
  setTasks(state, tasks) {
    state.tasks = tasks
  },
  setAllScheduleMonths(state, months) {
    state.allScheduleMonths = months
  },
  setFiscalYear(state, fiscalYear) {
    state.fiscalYear = fiscalYear
  },
  setFiscalYearMonths(state, fiscalYearMonths) {
    state.fiscalYearMonths = fiscalYearMonths
  },
  setBudgets(state, budgets) {
    state.budgets = budgets
  },
  setAllFiscalYears(state, budgets) {
    state.allFiscalYears = budgets
  },
  setBudgetTotals(state, budgetTotals) {
    state.budgetTotals = budgetTotals
  },
  setDefaultTasks(state, tasks) {
    state.defaultTasks = tasks
  },
  setSelectedFiscalYear(state, fiscalYear) {
    state.selectedFiscalYear = fiscalYear
  },
  setSelectedFiscalYearsToCalculateAmounts(state, fiscalYears) {
    state.selectedFiscalYearsToCalulateAmounts = fiscalYears
  },
  toggleShowCurrentFiscalyearArea(state) {
    state.showCurrentFiscalYearArea = !state.showCurrentFiscalYearArea
  }
}

const actions = {
  async setForecastTasksData({ rootState }, { dispatch }, { projectId }) {
    if (!projectId) return Promise.reject('Bad request, missing projectId createForecastTasks')

    try {
      const constfirebaseUrl = process.env.VUE_APP_FIREBASE_APIURL

      await axios
        .post(`${constfirebaseUrl}/api/planned/${projectId}/forecast-tasks/`, {
          companyId: rootState.Companies.currentCompany.id
        })

      dispatch('getTaksFromSelectedGantt', { projectId })
    } catch (e) {
      console.error(e)
      throw e
    }
  },
  async getTaksFromSelectedGantt({ commit }, { projectId }) {
    if (!projectId) return Promise.reject('Bad request, missing projectId createForecastTasks')

    try {
      const constfirebaseUrl = process.env.VUE_APP_FIREBASE_APIURL

      const response = await axios
        .get(`${constfirebaseUrl}/api/planned/${projectId}/forecast-tasks/`)

      const tasks = dataGet(response, 'data.tasks', [])
      const totals = dataGet(response, 'data.totals', [])

      const allScheduleMonths = getAllScheduleMonths(tasks)
      commit('setAllScheduleMonths', allScheduleMonths)

      commit('setTasks', tasks)
      commit('setBudgetTotals', totals)
    } catch (e) {
      console.error(e)
      throw e
    }
  },
  async getCurrentFiscalYear({ commit }, { projectId }) {
    if (!projectId) return Promise.reject()

    try {
      const projectDoc = await db.collection('cpm_projects')
        .doc(projectId)
        .get()

      const selectedGanttValue = dataGet(projectDoc.data(), 'selectedGantt.value')

      projectDoc.ref
        .collection('fiscalYearsByScheduleType')
        .where('scheduleValue', '==', selectedGanttValue)
        .get()
        .then(snap => {
          let data = {}
          let fiscalYearMonths = []

          if (!snap.empty) {
            data = dataGet(snap.docs[0].data(), 'fiscalYear', {})
            fiscalYearMonths = getMonthsBetweenTwoDate(data.startDate, data.endDate)
          }

          commit('setFiscalYearMonths', fiscalYearMonths)
          commit('setFiscalYear', data)
          commit('setSelectedFiscalYear', data)

          return data
        })
    } catch (e) {
      console.error(e)
      throw e
    }
  },
  async getBudgetsByFiscalYear({ commit }, { projectId }) {
    if (!projectId) return new Promise.reject('Bad request, missing projectID')

    try {
      const constfirebaseUrl = process.env.VUE_APP_FIREBASE_APIURL
      const response = await axios
        .get(`${constfirebaseUrl}/api/project/${projectId}/get-budgets-by-fiscal-year/`)

      const budgets = dataGet(response, 'data.budgets', {})
      commit('setBudgets', budgets)
    } catch (e) {
      throw e
    }
  },
  // Fiscals years that starts after the selected fiscal year (Fiscar year is selected in the schedule panel)
  async getAllFiscalYears({ rootState }, { commit }) {
    try {
      const projectSnap = await db.collection('settings')
        .doc(rootState.Companies.currentCompany.id)
        .collection('planned_settings')
        .doc('projects')
        .get()

      let fiscalYearsOrderByStartDate = []

      if (projectSnap.exists) {
        const settings = projectSnap.data()
        const fiscalYears = dataGet(settings, 'fiscalYears', [])
        fiscalYearsOrderByStartDate = sortBy(fiscalYears, ['startDate'])
        commit('setAllFiscalYears', fiscalYearsOrderByStartDate)
      }

      return fiscalYearsOrderByStartDate
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  async getDefaultTasks({ rootState }, { commit }) {
    try {
      const defaultTasks = []

      await db.collection('settings')
        .doc(rootState.Companies.currentCompany.id)
        .collection('planned_settings')
        .doc('default_schedule')
        .get().then(doc => {
          const data = doc.data()
          if (data.tasks) {
            data.tasks.forEach(row => {
              defaultTasks.push(row)
              if (row.displaySubTasks && row.cat_1.length) {
                row.cat_1.forEach(cat_1 => {
                  defaultTasks.push(cat_1)
                  if (cat_1.displaySubTasks && cat_1.cat_2.length) {
                    cat_1.cat_2.forEach(cat_2 => {
                      defaultTasks.push(cat_2)
                    })
                  }
                })
              }
            })
          }
        })
      commit('setDefaultTasks', defaultTasks)

      return defaultTasks
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

function getMonthsBetweenTwoDate(startDate, endDate) {
  if (!startDate || !endDate) return []

  const dateStart = moment(startDate)
  const dateEnd = moment(endDate)
  const timeValues = []

  while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
    timeValues.push(dateStart.format('YYYY-MM'))
    dateStart.add(1, 'month')
  }

  return timeValues
}

function getAllScheduleMonths(tasks) {
  let allScheduleMonths = []

  if (tasks.length) {
    const [taskWithLastestEndDate = {}] = orderBy(tasks, [
      'due_date'
    ], [
      'desc'
    ])
    allScheduleMonths = getMonthsBetweenTwoDate(
      dataGet(tasks[0], 'start_date', ''),
      dataGet(taskWithLastestEndDate, 'due_date', '')
    )
  }

  return allScheduleMonths
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}

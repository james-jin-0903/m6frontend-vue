import { db } from '@/utils/Firebase'
import { dataGet } from '@/utils/helpers'
import moment from 'moment'
import axios from 'axios'
import { debounce, sortBy } from 'lodash'

const state = {
  allFiscalYears: [],
  allScheduleMonths: [],
  budgetTaskTotals: null,
  budgetsByFiscalYear: null,
  forecastTasks: [],
  selectedFiscalYear: {},
  selectedFiscalYearMonths: []
}

const getters = {
  allFiscalYears: state => state.allFiscalYears,
  allScheduleMonths: state => state.allScheduleMonths,
  budgetsByFiscalYear: state => state.budgetsByFiscalYear,
  budgetTaskTotals: state => state.budgetTaskTotals,
  tasks: state => state.forecastTasks,
  futureFiscalYears: state => {
    if (!state.selectedFiscalYear) {
      return state.allFiscalYears
    } else {
      const startDateSelectedFiscalyear = new Date(dataGet(state, 'selectedFiscalYear.startDate', ''))
      return state.allFiscalYears.filter(fiscalYear => {
        const date = new Date(dataGet(fiscalYear, 'startDate', ''))

        if (date > startDateSelectedFiscalyear) {
          return true
        }
      })
    }
  },
  monthsForForecastTable: state => getMonthsBetweenTwoDate(
    dataGet(state.forecastTasks, '0.start_date', ''),
    dataGet(state.selectedFiscalYear, 'endDate', '')
  ),
  previousFiscalYears: state => {
    if (!state.selectedFiscalYear) {
      return []
    } else {
      const startDateSelectedFiscalyear = new Date(dataGet(state, 'selectedFiscalYear.startDate', ''))
      return state.allFiscalYears.filter(fiscalYear => {
        const date = new Date(dataGet(fiscalYear, 'startDate', ''))

        if (date < startDateSelectedFiscalyear) {
          return true
        }
      })
    }
  },
  selectedFiscalYear: state => state.selectedFiscalYear,
  selectedFiscalYearMonths: state => state.selectedFiscalYearMonths
}

const mutations = {
  setAllFiscalYears(state, fiscalYears = []) {
    state.allFiscalYears = fiscalYears
  },
  setAllScheduleMonths(state, months = []) {
    state.allScheduleMonths = months
  },
  setBudgetsByFiscalYear(state, budgets) {
    state.budgetsByFiscalYear = budgets
  },
  setBudgetTaskTotals(state, totals) {
    state.budgetTaskTotals = totals
  },
  setForecastTasks(state, tasks = []) {
    state.forecastTasks = tasks
  },
  setSelectedFiscalYear(state, fiscalYear) {
    state.selectedFiscalYear = fiscalYear
  },
  setSelectedFiscalYearMonths(state, months = []) {
    state.selectedFiscalYearMonths = months
  }
}

const actions = {
  async getForecastTasks({ rootState }, { commit }, { projectId }) {
    if (!projectId) return Promise.reject('Bad request, missing projectId createForecastTasks')

    try {
      const companyId = rootState.Companies.currentCompany.id
      const { data } = await axios
        .post(`${firebaseURL}/api/company/${companyId}/projects/${projectId}/forecast-tasks/`, {
          getSpending: true,
          queryTaskFields: [
            'budget',
            'budgetPercentage',
            'budgetCategories',
            'currentMonthlyForecast',
            'duration',
            'forecast',
            'fyValue',
            'start_date',
            'due_date',
            'title',
            'gantt'
          ]
        })

      commit('setBudgetsByFiscalYear', dataGet(data, 'budgetsByFiscalYear'))
      commit('setAllScheduleMonths', dataGet(data, 'allScheduleMonths'))
      commit('setForecastTasks', dataGet(data, 'tasks', []))
      commit('setBudgetTaskTotals', dataGet(data, 'budgetTaskTotals', {}))
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  debounceGetForecastTasks: debounce(async ({ rootState }, { dispatch }, { projectId } = {}) => {
    if (!projectId) return
    dispatch('getForecastTasks', { projectId })
  }, 1000),

  async getAllFiscalYears({ commit }) {
    try {
      const projectSnap = await db.collection('settings')
        .doc(rootState.Companies.currentCompany.id)
        .collection('planned_settings')
        .doc('projects')
        .get()

      if (projectSnap.exists) {
        const settings = projectSnap.data()
        const fiscalYears = dataGet(settings, 'fiscalYears', [])
        const fiscalYearsOrderByStartDate = sortBy(fiscalYears, ['startDate'])
        commit('setAllFiscalYears', fiscalYearsOrderByStartDate)

        const selectedFiscalYear = fiscalYearsOrderByStartDate.find(fy => fy.value === 'fy21')

        if (selectedFiscalYear) {
          const fiscalYearMonths = getMonthsBetweenTwoDate(selectedFiscalYear.startDate,
            selectedFiscalYear.endDate)

          commit('setSelectedFiscalYear', selectedFiscalYear)
          commit('setSelectedFiscalYearMonths', fiscalYearMonths)
        }
      }
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  async updateTaskCurrentMonthlyForecast({ dispatch }, { projectId, taskId, total, month }) {
    if (!projectId || !taskId || !total || !month) throw 'Bad Request - updateTaskCurrentMonthlyForecast'

    try {
      const months = {}
      months[month] = {}
      months[month].total = total

      await db.collection('cpm_projects')
        .doc(projectId)
        .collection('forecasting_tasks')
        .doc(taskId)
        .set({
          currentMonthlyForecast: {
            months
          }
        }, { merge: true })

      dispatch('getForecastTasks', { projectId })
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

const firebaseURL = process.env.VUE_APP_FIREBASE_APIURL

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}

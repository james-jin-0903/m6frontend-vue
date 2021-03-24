import {
  getForecastPeriodFromCapitalPlan,
  getSpendingPeriodFromProject,
  getVariancePeriodFromCapitalPlan,
  getPeriods
} from './Helpers'

const defaultPeriod = {
  text: '',
  value: '',
  spending: 0,
  forecast: 0,
  variance: 0
}

const defaultGroup = {
  items: [],
  period: '',
  spending: 0,
  forecast: 0,
  variance: 0
}

class Quarters {
  constructor(projects = [], forecasts = {}, fiscalYear = {}) {
    this.forecasts = forecasts
    this.projects = projects
    this.fiscalYear = fiscalYear
    this.totals = {
      spending: 0,
      forecast: 0,
      variance: 0
    }
  }


  addGroup(groupByArray = [], group = []) {
    if (group.length <= 0) {
      return
    }

    const auxGroup = { ...defaultGroup }
    auxGroup.items = group

    const period = 'From ' + group[0].text + ' to ' + group[group.length - 1].text
    auxGroup.period = period

    group.forEach(item => {
      auxGroup.spending += item.spending
      auxGroup.forecast += item.forecast
      auxGroup.variance += item.variance
    })

    this.totals.spending += auxGroup.spending
    this.totals.forecast += auxGroup.forecast
    this.totals.variance += auxGroup.variance

    groupByArray.push(auxGroup)
  }

  // function for grouping by N months in an array
  groupByNMonth(arr, numberOfMonths = 3) {
    if (arr.length <= 0) {
      return []
    }

    const groupByArray = []
    let group = []

    for (let i = 0; i < arr.length; i++) {
      const element = arr[i]
      group.push(element)

      if (group.length == numberOfMonths) {
        this.addGroup(groupByArray, group)
        group = []
      }
    }

    if (group.length > 0) {
      this.addGroup(groupByArray, group)
    }


    return groupByArray
  }

  solveProject(period, project) {
    const spending = getSpendingPeriodFromProject(period.value, project)
    const forecast = getForecastPeriodFromCapitalPlan(this.forecasts, period.value, project.id)
    const variance = getVariancePeriodFromCapitalPlan(this.forecasts, period.value, project.id)

    period.spending += parseFloat(spending)
    period.forecast += parseFloat(forecast)
    period.variance += parseFloat(variance)
  }

  solvePeriodProjects(period) {
    this.projects.forEach(project => {
      this.solveProject(period, project)
    })
  }

  getPeriodsAmounts(periods) {
    periods.forEach(period => {
      this.solvePeriodProjects(period)
    })
  }

  getPeriodsByQuarters() {
    const periods = getPeriods(this.fiscalYear, defaultPeriod)
    this.getPeriodsAmounts(periods)
    const periodsByQuarters = this.groupByNMonth(periods, 3)
    return periodsByQuarters
  }


  getQuarters() {
    const periodsByQuarters = this.getPeriodsByQuarters()

    return {
      periods: periodsByQuarters,
      totals: this.totals
    }
  }
}

export default Quarters

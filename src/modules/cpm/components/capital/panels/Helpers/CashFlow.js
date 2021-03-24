import {
  getForecastPeriodFromCapitalPlan,
  getVariancePeriodFromCapitalPlan,
  setForecastedAmount,
  isPeriodLowerThanCurrentMonth,
  isPeriodGreaterThanCurrentMonth,
  setVariancePeriodFromCapitalPlan
} from './Helpers'

class CashFlow {
  constructor(forecasts = {}, projects = [], periods = [], fiscalYearsAvailable = [], currentMonth = '') {
    this.forecasts = forecasts
    this.projects = projects
    this.periods = periods
    this.fiscalYearsAvailable = fiscalYearsAvailable
    this.currentMonth = currentMonth
  }

  resetSolvePeriods(project) {
    // Solving periods
    this.periods.forEach(period => {
      // If the period is less or equal than the current month reset
      if (isPeriodLowerThanCurrentMonth(period.value, this.currentMonth) || period.value == this.currentMonth) {
        const forecast = getForecastPeriodFromCapitalPlan(this.forecasts, period.value, project.id)
        setForecastedAmount(this.forecasts, project.id, 'forecasted', period.value, forecast, project)
      }
      // If the period is greater then reset forecast to 0
      else {
        setForecastedAmount(this.forecasts, project.id, 'forecasted', period.value, 0, project)
      }
    })
  }

  resetSolveFiscalYears(project) {
    // Solving fiscalYears
    this.fiscalYearsAvailable.forEach(fiscalYear => {
      setForecastedAmount(this.forecasts, project.id, 'fiscalYears', fiscalYear.value, 0)
    })
  }

  resetProject(project) {
    this.resetSolvePeriods(project)
    this.resetSolveFiscalYears(project)
  }

  reset() {
    this.projects.forEach(project => {
      this.resetProject(project)
    })
  }

  setVariancePeriodsAndGetVariance(project) {
    let variances = 0
    let monthsLeft = 0
    // Solving periods
    this.periods.forEach(period => {
      // If the period is less or equal than the current month reset
      if (isPeriodLowerThanCurrentMonth(period.value, this.currentMonth)) {
        const variance = getVariancePeriodFromCapitalPlan(this.forecasts, period.value, project.id)
        variances += variance
        setVariancePeriodFromCapitalPlan(this.forecasts, project.id, period.value, 0)
      }
      // If the period is greater then reset forecast to 0
      else if (isPeriodGreaterThanCurrentMonth(period.value, this.currentMonth)) {
        monthsLeft++
      }
    })

    // Get months left  to spread
    let amountToSpread = 0

    if (monthsLeft > 0) {
      amountToSpread = variances / monthsLeft
    }

    return {
      variances: variances,
      monthsLeft: monthsLeft,
      amountToSpread: amountToSpread
    }
  }

  setSpreadAmountOnFutureMonths(project = {}, spreadAmount = 0) {
    // Solving periods
    this.periods.forEach(period => {
      // If the period is less or equal than the current month reset
      if (isPeriodGreaterThanCurrentMonth(period.value, this.currentMonth)) {
        setForecastedAmount(this.forecasts, project.id, 'forecasted', period.value, spreadAmount, project)
      }
    })
  }

  run() {
    this.projects.forEach(project => {
      // Get all variance and set that to 0 until the current month
      const aux = this.setVariancePeriodsAndGetVariance(project)
      // Assign equal spread on the future months and fiscal years
      this.setSpreadAmountOnFutureMonths(project, aux.amountToSpread)
    })
  }
}

export default CashFlow

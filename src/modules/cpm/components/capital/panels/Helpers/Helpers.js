import moment from 'moment'

function getForecastPeriodFromCapitalPlan(forecasts = {}, periodValue = '', projectId = '') {
  if (
    projectId &&
    periodValue &&
    forecasts &&
    forecasts[projectId] &&
    forecasts[projectId]['forecasted'][periodValue] &&
    forecasts[projectId]['forecasted'][periodValue].amount
  ) {
    return forecasts[projectId]['forecasted'][periodValue].amount
  }

  return 0
}

function getVariancePeriodFromCapitalPlan(forecasts = {}, periodValue = '', projectId = '') {
  if (
    projectId &&
    periodValue &&
    forecasts &&
    forecasts[projectId] &&
    forecasts[projectId]['forecasted'][periodValue] &&
    forecasts[projectId]['forecasted'][periodValue].variance
  ) {
    return forecasts[projectId]['forecasted'][periodValue].variance
  }
  return 0
}

function getSpendingPeriodFromProject(periodValue = '', project = {}) {
  if (
    project.spendingsByPeriod &&
    periodValue &&
    project.spendingsByPeriod[periodValue]
  ) {
    return project.spendingsByPeriod[periodValue]
  }

  return 0
}

function getForecastFiscalYearFromCapitalPlan(forecasts = {}, fiscalYearValue = '', projectId = '') {
  if (
    projectId &&
    fiscalYearValue &&
    forecasts &&
    forecasts[projectId] &&
    forecasts[projectId]['fiscalYears'] &&
    forecasts[projectId]['fiscalYears'][
      fiscalYearValue
    ] &&
    forecasts[projectId]['fiscalYears'][fiscalYearValue]
      .amount
  ) {
    return forecasts[projectId]['fiscalYears'][
      fiscalYearValue
    ].amount
  }

  return 0
}


function setVariancePeriodFromCapitalPlan(forecasts = {}, projectId = '', elementToEditValue = '', amount = 0) {
  if (!forecasts[projectId]) {
    forecasts[projectId] = {
      forecasted: {},
      fiscalYears: {}
    }
  }

  if (!forecasts[projectId]['forecasted'][elementToEditValue]) {
    forecasts[projectId]['forecasted'][elementToEditValue] = {
      amount: 0,
      variance: 0
    }
  }
  forecasts[projectId]['forecasted'][elementToEditValue].variance = parseFloat(amount)
}

function setForecastedAmount(forecasts = {}, projectId = '', type = '', elementToEditValue = '', amount = 0, project = {}) {
  if (!forecasts[projectId]) {
    forecasts[projectId] = {
      forecasted: {},
      fiscalYears: {}
    }
  }
  switch (type) {
    case 'forecasted':

      if (!forecasts[projectId]['forecasted'][elementToEditValue]) {
        forecasts[projectId]['forecasted'][elementToEditValue] = {
          amount: 0,
          variance: 0
        }
      }

      // Calculate variance = forecast - spending
      forecasts[projectId]['forecasted'][elementToEditValue].amount = amount
      const spending = getSpendingPeriodFromProject(elementToEditValue, project)
      forecasts[projectId]['forecasted'][elementToEditValue].variance = parseFloat(amount - spending)

      break

    case 'fiscalYears':
      if (!forecasts[projectId]['fiscalYears'][elementToEditValue]) {
        forecasts[projectId]['fiscalYears'][elementToEditValue] = { amount: 0 }
      }
      forecasts[projectId]['fiscalYears'][elementToEditValue].amount = parseFloat(amount)
      break
  }
}

function isPeriodLowerThanCurrentMonth(period, currentMonth) {
  const periodAux = moment(period)

  return periodAux.isBefore(moment(currentMonth))
}

function isPeriodGreaterThanCurrentMonth(period, currentMonth) {
  const periodAux = moment(period)

  return periodAux.isAfter(moment(currentMonth))
}

function getPeriods(fiscalYear = {}, defaultPeriod = {
  text: '',
  value: '',
  type: 'period'
}) {
  const startDate = fiscalYear.startDate
    ? moment(fiscalYear.startDate)
    : moment()
  const endDate = fiscalYear.endDate
    ? moment(fiscalYear.endDate)
    : moment()

  const interim = startDate.clone()
  const periods = []

  while (endDate > interim || interim.format('M') === endDate.format('M')) {
    const aux = { ...defaultPeriod }
    aux.text = interim.format('YYYY-MMMM')
    aux.value = interim.format('YYYY-MM')
    aux.type = 'period'


    periods.push(aux)
    interim.add(1, 'month')
  }

  return periods
}

export {
  getForecastPeriodFromCapitalPlan,
  getSpendingPeriodFromProject,
  getVariancePeriodFromCapitalPlan,
  getForecastFiscalYearFromCapitalPlan,
  setForecastedAmount,
  setVariancePeriodFromCapitalPlan,
  isPeriodLowerThanCurrentMonth,
  isPeriodGreaterThanCurrentMonth,
  getPeriods
}

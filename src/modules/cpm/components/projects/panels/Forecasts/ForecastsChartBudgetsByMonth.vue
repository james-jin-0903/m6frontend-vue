<template>
  <div id="chart">
    <apexchart
      v-if="allMonths && allMonths.length && series.length"
      height="350"
      :options="chartOptions"
      :series="series"
      type="bar"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ForecastsChartBudgetsByMonth',

  props: {
    tasks: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    ...mapGetters(['appLabel']),
    ...mapGetters('cpm/planned/forecasts', [
      'allMonths',
      'budgetFiscalYear',
      'defaultTasks',
      'selectedFiscalYearsToCalulateAmounts',
      'showCurrentFiscalYearArea'
    ]),
    series() {
      let tasks = [...this.tasks]

      if (this.defaultTasks.length) {
        tasks = this.tasks.filter(row => {
          const find = this.defaultTasks.find(task => task.name === row.title)
          if (find) return true
        })
      }

      const formattedTasks = tasks.map(task => {
        const item = {}
        item.name = task.title,

        item.data = this.allMonths.map(month => parseFloat(this.getAmount(this.$h.dg(task, `forecast.${month}`, 0))))
        return item
      })
      return formattedTasks
    },

    chartOptions() {
      const chartOptions = {
        title: {
          text: `${this.$t('cpm.forecasting.chart.budgetsByMonthTitle')} | ${this.$h.dg(this.budgetFiscalYear, 'name', '')}`
        },
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        dataLabels: {
          enabled: true,
          formatter: n => {
            let amount = ''
            if (n < 1e3) amount = Math.ceil(n)
            if (n >= 1e3 && n < 1e6) amount += (n / 1e3).toFixed(0) + 'K'
            if (n >= 1e6 && n < 1e9) amount += (n / 1e6).toFixed(1) + 'M'
            if (n >= 1e9 && n < 1e12) amount += (n / 1e9).toFixed(1) + 'B'
            if (n >= 1e12) amount += (n / 1e12).toFixed(1) + 'T'

            return `$${amount}`
          }
        },
        xaxis: {
          type: 'datetime',
          categories: this.allMonths
        },
        annotations: {
          xaxis: []
        },
        yaxis: {
          labels: {
            style: {
              colors: '#008FFB'
            },
            formatter: n => {
              if (n < 1e3) return n
              if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(0) + 'K'
              if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M'
              if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B'
              if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T'
            }
          }
        },
        legend: {
          position: 'right',
          offsetY: 40
        },
        fill: {
          opacity: 1
        }
      }

      if (this.showCurrentFiscalYearArea) {
        chartOptions.annotations.xaxis.push(
          {
            x: new Date(this.$h.dg(this.budgetFiscalYear, 'startDate', '')).getTime(),
            x2: new Date(this.$h.dg(this.budgetFiscalYear, 'endDate', '')).getTime(),
            fillColor: '#2E93fA',
            label: {
              borderColor: '#2E93fA',
              style: {
                color: '#fff',
                background: '#2E93fA'
              },
              text: `${this.$h.dg(this.budgetFiscalYear, 'name', '')}`
            }
          }
        )
      }

      return chartOptions
    }
  },

  methods: {
    getAmount(amountByFiscalYear) {
      if (!amountByFiscalYear || !this.selectedFiscalYearsToCalulateAmounts.length) return 0
      return this.selectedFiscalYearsToCalulateAmounts.reduce((sum, fyValue = '') => sum + parseFloat(this.$h.dg(amountByFiscalYear, fyValue, 0)), 0)
    }
  }
}
</script>

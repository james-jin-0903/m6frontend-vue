<template>
  <div
    v-if="serieCumulativeTasks && cashflowMonths.length"
    id="chart"
  >
    <apexchart
      height="350"
      :options="chartOptions"
      :series="series"
      type="line"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ForecastingChart',

  computed: {
    ...mapGetters('cpm/planned/cashflow', [
      'cashflowMonths',
      'serieBudgetsByMonthTasks',
      'serieCumulativeTasks',
      'totals'
    ]),
    series() {
      return [
        this.serieBudgetsByMonthTasks,
        this.serieCumulativeTasks
      ]
    },
    chartOptions() {
      return {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Forecasting Budgets'
        },
        grid: {
          row: {
            colors: [
              '#f3f3f3',
              'transparent'
            ], // takes an array which will be repeated on columns
            opacity: 0.5
          }
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
        xaxis: {
          categories: this.cashflowMonths
        }
      }
    }
  }
}
</script>

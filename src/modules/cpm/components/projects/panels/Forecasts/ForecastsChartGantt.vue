<template>
  <div
    id="chart"
  >
    <template>
      <v-row
        align="center"
        :class="{ 'disabled': !showCurrentFiscalYearArea, 'button-fiscal-year': true }"
        @click="toggleShowCurrentFiscalyearArea"
      >
        <v-col
          class="dot ml-5 mr-1 shrink"
        />
        <v-col>Fiscal Year Area</v-col>
      </v-row>
      <apexchart
        height="350"
        :options="chartOptions"
        :series="series"
        type="rangeBar"
      />
    </template>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'ForecastsChartGantt',

  props: {
    tasks: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      showFicalYearArea: false
    }
  },

  computed: {
    ...mapGetters(['appLabel']),
    ...mapGetters('cpm/planned/forecasts', [
      'budgetFiscalYear',
      'defaultTasks',
      'showCurrentFiscalYearArea'
    ]),
    series() {
      let tasks = this.tasks

      if (this.defaultTasks.length) {
        tasks = this.tasks.filter(row => {
          const find = this.defaultTasks.find(task => task.name === row.title)
          if (find) return true
        })
      }
      const formattedTasks = tasks.map(task => {
        const item = {}
        item.name = task.title
        item.data = [{
          x: task.title,
          y: [
            new Date(task.start_date).getTime(),
            new Date(task.due_date).getTime()
          ]
        }]
        return item
      })
      return formattedTasks
    },

    chartOptions() {
      const chartOptions = {
        chart: {
          height: 350,
          type: 'rangeBar',
          toolbar: {
            show: true
          }
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            const a = moment(val[0])
            const b = moment(val[1])
            const diff = b.diff(a, 'days')
            return diff + (diff > 1 ? ' days' : ' day')
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [50, 0, 100, 100]
          }
        },
        xaxis: {
          type: 'datetime'
        },
        annotations: {
          xaxis: [
            {
              x: this.getCurrentDate(),
              strokeDashArray: 0,
              borderColor: '#FF4560',
              label: {
                borderColor: '#FF4560',
                style: {
                  color: '#fff',
                  background: '#FF4560'
                },
                text: 'Now'
              }
            }
          ]
        },
        legend: {
          position: 'top'
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
    ...mapMutations('cpm/planned/forecasts', [
      'toggleShowCurrentFiscalyearArea'
    ]),
    getCurrentDate() {
      const date = new Date()

      return date.getTime()
    }
  }
}
</script>

<style lang="scss" scoped>
  .button-fiscal-year {
    cursor: pointer !important;
    z-index: 10;
    font-size: 12px;
  }

  .disabled {
    opacity: .5;
  }

  .dot {
    height: 12px;
    width: 12px;
    background-color: #2E93fA;
    border-radius: 50%;
    display: inline-block;
  }
</style>

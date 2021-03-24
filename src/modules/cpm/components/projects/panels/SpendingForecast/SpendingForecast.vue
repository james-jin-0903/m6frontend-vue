<template>
  <m6-card-dialog
    :title="`${$t('cpm.projects.spendingForecast')} ${$t('general.beta')}`"
  >
    <template v-slot:after:title>
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <a
            class="pointer"
            v-on="on"
            @click="printFromVue('chart')"
          >
            <v-icon
              class="grey--text pointer text--darken-1"
              text
            >
              mdi-printer
            </v-icon>
          </a>
        </template>
        <span>{{ $t('general.print') }}</span>
      </v-tooltip>
      <v-tooltip
        v-if="$route.name === 'cpm.projects.show'"
        left
      >
        <template v-slot:activator="{ on }">
          <a
            class="pointer"
            :href="
              '/m6apps#/cpm/projects/' +
                $route.params.id +
                '/fullscreen/spending-forecast'
            "
            target="_blank"
            v-on="on"
          >
            <v-icon
              text
            >
              mdi-launch
            </v-icon>
          </a>
        </template>
        <span>{{ $t('general.openNewTab') }}</span>
      </v-tooltip>
    </template>

    <div id="chart">
      <apexchart
        ref="apexChart"
        class="apexClass"
        height="350"
        :options="chartOptions"
        :series="series"
        type="line"
      />
    </div>
    <project-final-cost
      v-if="budget && startDate && endDate"
      @generateForecast="generateForecast"
    />
    <forecasting-table />
  </m6-card-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'
import ProjectFinalCost from './ProjectFinalCost'
import ForecastingTable from './ForecastingTable'
export default {
  name: 'SpendingForecast',

  components: {
    ForecastingTable,
    ProjectFinalCost
  },

  data() {
    return {
      spendingByPeriod: [],
      forecast: false,
      budget: 0,
      startDate: '',
      endDate: ''
    }
  },

  computed: {
    chartOptions() {
      return {
        title: {
          text: this.$t('cpm.projects.spendingForecast')
        },
        chart: {
          height: 350,
          type: 'line',
          stacked: false
        },
        xaxis: {
          categories: this.spendingMonths
        },
        yaxis: [
          {
            axisTicks: {
              show: true
            },
            axisBorder: {
              show: true,
              color: '#008FFB'
            },
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
            },
            title: {
              text: this.$t('cpm.projects.budget'),
              style: {
                color: '#008FFB'
              }
            }
          }
        ]
      }
    },
    series() {
      const series = [
        {
          name: this.$t('cpm.projects.spending'),
          type: 'column',
          data: this.spendingByMonth
        },
        {
          name: this.$t('cpm.projects.cumulativeSpending'),
          type: 'line',
          data: this.cumulativeSpending
        },
        {
          name: this.$t('cpm.projects.budget'),
          type: 'line',
          data: this.cumulativeBudget
        }
      ]
      if (this.forecast) {
        series.push({
          name: this.$t('cpm.projects.forecast'),
          type: 'line',
          data: this.curveForecast
        })
      }
      return series
    },
    cumulativeBudget() {
      const budgets = []
      this.spendingByPeriod.reduce((sum, item, index) => {
        const accumulative = sum - item.amount
        budgets[index] = accumulative
        return accumulative
      }, this.budget)

      return budgets
    },
    curveForecast() {
      let spendingMonths = []
      if (this.forecast) {
        spendingMonths = this.spendingByPeriod.map(item => item.forecast)
      }
      return spendingMonths
    },
    spendingMonths() {
      let spendingMonths = []
      if (this.spendingByPeriod.length) {
        spendingMonths = this.spendingByPeriod.map(item => item.month)

        return spendingMonths
      }

      return spendingMonths
    },
    spendingByMonth() {
      let spendingAmountByMonth = []
      if (this.spendingByPeriod.length) {
        spendingAmountByMonth = this.spendingByPeriod.map(item =>
          Math.round(item.amount)
        )

        return spendingAmountByMonth
      }

      return []
    },
    cumulativeSpending() {
      const cumulativeSpending = []

      this.spendingByPeriod.reduce((sum, item, index) => {
        const accumulative = sum + item.amount
        cumulativeSpending[index] = accumulative
        return accumulative
      }, 0)

      return cumulativeSpending
    }
  },

  created() {
    const projectId = this.$route.params.id
    this.getSpendingsByPeriod(projectId)
    this.getBudget()
  },
  mounted() {
    const interval = setInterval(() => {
      if (document.getElementsByClassName('apexcharts-legend-series')[2]) {
        document.getElementsByClassName('apexcharts-legend-series')[2].children[0].click()
        clearInterval(interval)
      }
    }, 2000)
  },
  methods: {
    getMonths() {
      let count = 0
      const dateIni = new Date(this.startDate)
      let currentDate = dateIni.toISOString().substr(0, 7)
      const endDate = this.endDate.substr(0, 7)

      const budget = this.budget
      while (currentDate !== endDate) {
        currentDate = dateIni.toISOString().substr(0, 7)
        this.spendingByPeriod.push({
          amount: 0,
          month: currentDate,
          forecast: 0,
          budget: budget
        })
        count++
        dateIni.setMonth(dateIni.getMonth() + 1)
        if (count > 100) break
      }
    },
    async getBudget() {
      let project = await db
        .collection('cpm_projects')
        .doc(this.$route.params.id)
        .get()
      project = project.data()
      if (project.startDate && project.endDate) {
        this.startDate = project.startDate
        this.endDate = project.endDate
      }

      let data = await db
        .collection('cpm_projects')
        .doc(this.$route.params.id)
        .collection('budgets')
        .where('active', '==', true)
        .get()
      if (!data.empty) {
        data = data.docs[0].data()
        this.budget = parseFloat(data.total)
      }
      if (this.budget && this.startDate && this.endDate) {
        this.getMonths()
      }
    },
    normal(x, mu, sigma) {
      return this.stdNormal((x - mu) / sigma)
    },
    stdNormal(z) {
      let j,
        k,
        kMax,
        m,
        values,
        total,
        subtotal,
        item,
        z2,
        z4,
        a,
        b

      // Power series is not stable at these extreme tail scenarios
      if (z < -6) {
        return 0
      }
      if (z > 6) {
        return 1
      }

      m = 1 // m(k) == (2**k)/factorial(k)
      b = z // b(k) == z ** (2*k + 1)
      z2 = z * z // cache of z squared
      z4 = z2 * z2 // cache of z to the 4th
      values = []

      // Compute the power series in groups of two terms.
      // This reduces floating point errors because the series
      // alternates between positive and negative.
      for (k = 0; k < 100; k += 2) {
        a = 2 * k + 1
        item = b / (a * m)
        item *= 1 - (a * z2) / ((a + 1) * (a + 2))
        values.push(item)
        m *= 4 * (k + 1) * (k + 2)
        b *= z4
      }
      // Add the smallest terms to the total first that
      // way we minimize the floating point errors.
      total = 0
      for (k = 49; k >= 0; k--) {
        total += values[k]
      }

      // Multiply total by 1/sqrt(2*PI)
      // Then add 0.5 so that stdNormal(0) === 0.5
      return 0.5 + 0.3989422804014327 * total
    },
    generateForecast(data) {
      this.forecast = data
      let max = 0
      if (this.forecast) {
        let totalAmount = this.budget
        const stDev = this.forecast.type.stDev

        this.spendingByPeriod.forEach(row => {
          if (!row.amount) {
            max++
          } else {
            totalAmount -= parseFloat(row.amount)
          }
        })

        let initial = 0
        let sum = 0
        this.spendingByPeriod.forEach(row => {
          if (!row.amount) {
            const result =
              ((this.normal(initial + 1, max / 2, max / stDev) -
                this.normal(initial, max / 2, max / stDev)) /
                (1 - 2 * this.normal(0, max / 2, max / stDev))) *
              totalAmount
            const amount = result.toFixed(2)
            row.forecast = amount
            initial++
          } else {
            row.forecast = row.amount
          }
          sum += parseFloat(row.forecast)
        })
      }
    },
    async getSpendingsByPeriod(projectId) {
      try {
        const periods = {}
        const spendingRef = db
          .collection('cpm_projects')
          .doc(projectId)
          .collection('spendings')
          .orderBy('paidDateText')

        const snapshot = await spendingRef.get()
        await Promise.all(
          snapshot.docs.map(async item => {
            const spending = {
              ...item.data(),
              id: item.id
            }

            let paidDate = 'date-not-found'
            if (spending.paidDateText) {
              paidDate = this.$moment(spending.paidDateText).format('YYYY-MM')
            }
            const total = await this.solveSpendings(projectId, spending)
            if (!periods[paidDate]) {
              periods[paidDate] = 0
            }
            periods[paidDate] += total
          })
        )

        const spendingByPeriod = []
        for (const key in periods) {
          const find = this.spendingByPeriod.find(item => item.month === key)
          if (find) {
            find.amount = periods[key]
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    solveSpendings(projectId, spending) {
      const auxPromise = new Promise(async (resolve, reject) => {
        try {
          let total = 0

          const snap = await db
            .collection('cpm_projects')
            .doc(projectId)
            .collection('spendings')
            .doc(spending.id)
            .collection('line_items')
            .get()

          await Promise.all(
            snap.docs.map(doc => {
              const lineItem = doc.data()
              total += parseFloat(lineItem.amount)
            })
          )
          resolve(total)
        } catch (error) {
          reject(error)
        }
      })

      return auxPromise
    },
    printFromVue(id) {
      const prtHtml = document.getElementById(id).innerHTML

      let stylesHtml = ''
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style')
      ]) {
        stylesHtml += node.outerHTML
      }

      const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0')

      WinPrint.document.write(`<!DOCTYPE html>
      <html>
        <head>
          ${stylesHtml}
        </head>
        <body>
          ${prtHtml}
        </body>
      </html>`)

      WinPrint.document.close()
      WinPrint.focus()
      WinPrint.print()
      WinPrint.close()
    }
  }
}
</script>

<style lang="scss">
.apexClass .apexcharts-canvas {
  z-index: 1 !important;
}
</style>

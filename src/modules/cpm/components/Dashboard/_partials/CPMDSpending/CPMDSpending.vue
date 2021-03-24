<template>
  <v-col
    class="mt-3"
    cols="12"
    style="min-height: 300px"
  >
    <v-card
      class="elevation-0"
    >
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">Spending</span>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-card-text class="vertical-scroll white">
        <chart
          ref="chart"
          :chart-data="dataCollection"
        />
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { debounce } from 'lodash'
import { DateTime } from 'luxon'
import { mapActions } from 'vuex'

import chart from './chart'

const now = DateTime.local()

export default {
  name: 'CPMDSpending',

  components: {
    chart
  },

  props: {
    companiesCpmProjects: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    dataCollection: {
      labels: [],
      datasets: [
        {
          label: 'Spending',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointBorderColor: '#1464F4',
          borderColor: '#1464F4',
          pointBackgroundColor: 'white',
          data: []
        }
      ]
    },

    endToday: now.endOf('day').valueOf(),

    dataTable: [],
    qty: 30,

    updateChart: 0
  }),

  computed: {
    timeAgo() {
      return now
        .minus({ day: this.qty })
        .startOf('day')
        .valueOf()
    }
  },

  watch: {
    companiesCpmProjects: {
      deep: true,
      handler() {
        this.loadData()
      }
    },

    updateChart: debounce(function () {
      this.$refs.chart.$data._chart.update()
    }, 500)
  },

  created() {
    this.setDataCollection().then(this.loadData)
  },

  methods: {
    ...mapActions('companies/cpmProjects/spendings', {
      indexCompaniesCpmProjectsSpendings: 'index'
    }),

    setDataCollection() {
      return new Promise(resolve => {
        let date

        for (let day = this.qty; day >= 0; day--) {
          date = now.minus({ day })

          this.setDataTable(date)
          this.setLabels(date)
        }

        resolve()
      })
    },

    setDataTable(date) {
      this.dataTable.push({
        endDate: date.endOf('day').valueOf(),
        startDate: date.startOf('day').valueOf(),
        amount: 0
      })
    },

    setLabels(date) {
      this.dataCollection.labels.push(date.toFormat('LLL dd'))
    },

    setDatasetData() {
      this.dataCollection.datasets[0].data = this.dataTable.map(
        item => item.amount
      )

      this.updateChart += 1
    },

    loadData: debounce(function () {
      this.dataTable.forEach(item => (item.amount = 0))

      Promise.all(
        this.companiesCpmProjects.map(
          project =>
            new Promise(resolve =>
              this.indexCompaniesCpmProjectsSpendings({
                projectId: project.id,
                endToday: this.endToday,
                timeAgo: this.timeAgo,
                orderBy: 'paidDate'
              })
                .then(lines =>
                  Promise.all(
                    lines.map(line => {
                      const find = this.dataTable.find(
                        rowLine =>
                          rowLine.startDate <= line.paidDate &&
                          rowLine.endDate >= line.paidDate
                      )

                      if (find) {
                        find.amount += parseFloat(line.amount)
                      }
                    })
                  ).then(resolve)
                )
                .catch(resolve)
            )
        )
      ).then(this.setDatasetData)
    }, 500)
  }
}
</script>


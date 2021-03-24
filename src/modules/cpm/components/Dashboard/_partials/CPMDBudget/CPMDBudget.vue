<template>
  <v-col
    class="pa-3"
    cols="12"
  >
    <v-card
      class="elevation-0 white--text"
      color="transparent"
    >
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">
          Budget: {{ budgetTotal | currency }}
        </span>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-card-text class="vertical-scroll">
        <chart
          ref="chart"
          :chart-data="dataCollection"
          :options="options"
        />
      </v-card-text>

      <v-row
        v-for="(label, index) in dataCollection.labels"
        :key="index"
        class="font-weight-bold labels my-2 px-3 py-2 subheading text-truncate white--text"

        :style="{ 'background-color': $h.dg(dataCollection, `datasets.0.backgroundColor.${index}`) }"
      >
        <span class="mr-1">
          {{ (($h.dg(dataCollection, `datasets.0.data.${index}`) / budgetTotal) * 100).toFixed(2) }}%
        </span>

        <span class="text-truncate">
          {{ label }}
        </span>

        <v-spacer />

        <span>
          {{ $h.dg(dataCollection, `datasets.0.data.${index}`) | currency }}
        </span>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
import { debounce } from 'lodash'
import { mapActions } from 'vuex'

import chart from './chart'

export default {
  name: 'CPMDBudget',

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
    budgetTotal: 0,

    dataCollection: {
      labels: [],
      datasets: [
        {
          backgroundColor: [],
          data: []
        }
      ]
    },

    options: {
      legend: {
        display: false
      }
    },

    colors: [
      '#41B883',
      '#E46651',
      '#00D8FF',
      '#228B22',
      '#ffd700',
      '#d62d0e',
      '#66CD00',
      '#1464F4',
      '#67C8FF',
      '#191919',
      '#999999',
      '#662266',
      '#333399',
      '#006666',
      '#aa3333',
      '#666666',
      '#333333'
    ],

    updateChart: 0
  }),

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
    this.loadData()
  },

  methods: {
    ...mapActions('companies/cpmProjects/budgets', {
      indexCompaniesCpmProjectsBudgets: 'index'
    }),

    loadData: debounce(function () {
      this.budgetTotal = 0
      this.dataCollection = {
        labels: [],
        datasets: [
          {
            backgroundColor: [],
            data: []
          }
        ]
      }

      let count = 0

      this.companiesCpmProjects.map(project =>
        this.indexCompaniesCpmProjectsBudgets({
          projectId: project.id,
          active: true,
          asSnapshot: true
        }).then(budgets => {
          // TODO: improve whole this method logic
          budgets.docs.forEach(budget => {
            budget.ref
              .collection('lineItems')
              .get()
              .then(items => {
                items.docs.forEach(item => {
                  const itemData = item.data()
                  let amount = 0

                  if (itemData.type === 'Percentage') {
                    if (
                      itemData.percentageType === undefined ||
                      itemData.percentageType === 'Subtotal'
                    ) {
                      amount = Math.floor(
                        budget.data().subTotal *
                          (parseFloat(itemData.amount) / 100)
                      )
                    } else if (itemData.percentageType === 'Category') {
                      budget.ref
                        .collection('lineItems')
                        .get()
                        .then(snap => {
                          let categoryAmount = 0
                          snap.forEach(catDoc => {
                            const catDocData = catDoc.data()
                            if (
                              itemData.percentageBudgetCategories.includes(
                                catDocData.budgetCategory
                              ) &&
                              catDocData.type === 'Amount' &&
                              !catDocData.belowSubtotal
                            ) {
                              categoryAmount += catDocData.amount
                            }
                          })

                          const resultAmount = parseFloat(
                            Math.floor(categoryAmount * (itemData.amount / 100))
                          )
                          const budgetCategory = this.dataCollection.labels.find(
                            label => label === itemData.budgetCategory
                          )

                          if (budgetCategory) {
                            const index = this.dataCollection.labels.indexOf(
                              budgetCategory
                            )

                            this.dataCollection.datasets[0].data[
                              index
                            ] += resultAmount

                            this.budgetTotal += resultAmount
                            this.updateChart++
                          } else {
                            if (count >= this.colors.length) {
                              count = 0
                            }

                            this.dataCollection.labels.push(
                              itemData.budgetCategory
                            )

                            this.dataCollection.datasets[0].data.push(
                              resultAmount
                            )

                            this.dataCollection.datasets[0].backgroundColor.push(
                              this.colors[count]
                            )

                            this.budgetTotal += resultAmount
                            this.updateChart++
                            count++
                          }
                        })
                    }
                  } else {
                    amount = parseFloat(itemData.amount)
                  }

                  if (amount > 0) {
                    const budgetCategory = this.dataCollection.labels.find(
                      label => label === itemData.budgetCategory
                    )

                    if (budgetCategory) {
                      const index = this.dataCollection.labels.indexOf(
                        budgetCategory
                      )

                      this.dataCollection.datasets[0].data[index] += amount
                      this.budgetTotal += amount
                      this.updateChart++
                    } else {
                      if (count >= this.colors.length) {
                        count = 0
                      }

                      this.dataCollection.labels.push(itemData.budgetCategory)
                      this.dataCollection.datasets[0].data.push(amount)
                      this.dataCollection.datasets[0].backgroundColor.push(
                        this.colors[count]
                      )

                      this.budgetTotal += amount
                      this.updateChart++
                      count++
                    }
                  }
                })
              })
          })
        })
      )
    }, 500)
  }
}
</script>

<style lang="scss" scoped>
.labels {
  border-radius: 25px !important;
}
</style>

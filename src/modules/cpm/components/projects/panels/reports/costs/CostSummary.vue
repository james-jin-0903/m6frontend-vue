<template>
  <div>
    <div class="summary-table">
      <table class="theme--light v-table">
        <tr>
          <th class="text-left">
            Budget Category
          </th>
          <th class="text-center">
            Budget
          </th>
          <th class="text-center">
            Commitments
          </th>
          <th class="text-center">
            Spending
          </th>
          <th class="text-center">
            Total Allocated
          </th>
          <th class="text-center">
            Changes
          </th>
          <th class="text-center">
            Projected Final Cost
          </th>
          <th class="text-right">
            Variance
          </th>
        </tr>
        <tr
          v-for="(category, index) in categories"
          v-show="parseFloat(category.budget) > 0 || parseFloat(category.commitmentsTotal) > 0 || parseFloat(category.spendingTotal) > 0 || parseFloat(category.changesTotal) > 0"
          :key="index"
        >
          <td class="text-left">
            {{ category.code ? category.code + ' -' : '' }} {{ category.title }}
          </td>
          <td class="text-center">
            {{ parseFloat(category.budget).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}
          </td>
          <td class="text-center">
            {{ parseFloat(category.commitmentsTotal).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}
          </td>
          <td class="text-center">
            {{ parseFloat(category.spendingTotal).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}
          </td>
          <td
            class="text-center"
            :class="{overdraft: category.totalAllocated > category.budget}"
          >
            {{ parseFloat(category.totalAllocated).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}
          </td>
          <td class="text-center">
            {{ parseFloat(category.changesTotal).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}
          </td>
          <td
            class="text-center"
            :class="{overdraft: (category.totalAllocated + category.changesTotal) > category.budget}"
          >
            {{ parseFloat(category.totalAllocated + category.changesTotal).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}
          </td>
          <td class="text-right">
            {{ parseFloat(category.budget - (category.totalAllocated + category.changesTotal)).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}
          </td>
        </tr>
        <tr style="background: #eee">
          <td class="text-left">
            <strong>Totals</strong>
          </td>
          <td class="text-center">
            {{ parseFloat(totals.budget).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}
          </td>
          <td class="text-center">
            {{ parseFloat(totals.commitments).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}
          </td>
          <td class="text-center">
            {{ parseFloat(totals.spending).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}
          </td>
          <td class="text-center">
            {{ parseFloat(totals.allocated).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}
          </td>
          <td class="text-center">
            {{ parseFloat(totals.changes).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}
          </td>
          <td
            class="text-center"
            :class="{overdraft: (totals.allocated + totals.changes) > totals.budget}"
          >
            {{ parseFloat(totals.allocated + totals.changes).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}
          </td>
          <td class="text-right">
            {{ parseFloat(totals.budget - (totals.allocated + totals.changes)).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'
import { mapState, mapGetters } from 'vuex'
import {
  skipIterationForItems
} from '@/components/cpm/helpers/HelpersFunction'
export default {
  name: 'CostSummary',
  props: {
    pid: {
      type: [String, Number],
      default: '',
      required: false
    },
    dateRule: {
      type: Object,
      default: () => ({
        month: null,
        year: ''
      })
    }

  },
  data() {
    let projectRef = null
    projectRef = db.collection('cpm_projects').doc(this.pid)
    return {
      projectRef,
      budget: {},
      budgetRef: {},
      lineItems: [],
      budgetExists: false,
      categories: [],
      budgetCategories: [],
      totals: {
        budget: 0,
        commitments: 0,
        spending: 0,
        allocated: 0,
        changes: 0,
        pfc: 0,
        variance: 0
      }
    }
  },
  computed: {
    ...mapGetters(['appLabel']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  watch: {
    dateRule: function () {
      this.getTable()
    }
  },
  fireStore() {
    return {}
  },
  mounted() {
    this.getTable()
  },
  methods: {
    calculateTable() {
      this.categories = []
      this.budgetCategories.forEach(cat => {
        const lineItem = this.lineItems.find(li => li.budgetCategory === cat.name)
        this.categories.push({
          title: cat.name,
          code: cat.code,
          budget: lineItem ? lineItem.amount : 0
        })
      })
    },
    resetValues() {
      this.totals = {
        budget: 0,
        commitments: 0,
        spending: 0,
        allocated: 0,
        changes: 0,
        pfc: 0,
        variance: 0
      }

      this.categories = []
    },
    getTable() {
      this.resetValues()

      this.projectRef.collection('budgets').where('active', '==', true).limit(1).get().then(res => {
        if (!res.empty) {
          this.budgetExists = true
          this.budget = res.docs[0].data()
          this.budgetRef = res.docs[0].ref

          db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('budgets').get().then(budgetDoc => {
            this.budgetCategories = budgetDoc.data().costCodes
            this.budgetCategories.forEach(cat => {
              this.categories.push({
                title: cat.name,
                code: cat.code,
                budget: 0,
                commitmentsTotal: 0,
                spendingTotal: 0,
                totalAllocated: 0,
                changesTotal: 0,
                pfc: 0,
                variance: 0
              })

              // Budget
              this.budgetRef.collection('lineItems').where('budgetCategory', '==', cat.name).get().then(res => {
                res.forEach(doc => {
                  const itemData = doc.data()
                  let amount = 0
                  if (itemData.type === 'Amount') {
                    amount = itemData.amount
                  } else if (itemData.type === 'Percentage') {
                    if (itemData.percentageType === undefined || itemData.percentageType === 'Subtotal') {
                      amount = parseFloat(Math.floor(parseFloat(this.budget.subTotal) * (doc.data().amount / 100)))
                    } else if (itemData.percentageType === 'Category') {
                      this.budgetRef.collection('lineItems').get().then(snap => {
                        let categoryAmount = 0
                        snap.forEach(catDoc => {
                          const catDocData = catDoc.data()
                          if (itemData.percentageBudgetCategories.includes(catDocData.budgetCategory) && catDocData.type === 'Amount' && !catDocData.belowSubtotal) {
                            categoryAmount += catDocData.amount
                          }
                        })
                        const resultAmount = parseFloat(Math.floor(categoryAmount * (itemData.amount / 100)))
                        const tableRow = this.categories.find(c => c.title === cat.name)
                        tableRow.budget += parseFloat(resultAmount)
                        this.totals.budget += parseFloat(resultAmount)
                        // tableRow.pfc = tableRow.commitmentsTotal + tableRow.changesTotal;
                        // this.totals.pfc += tableRow.pfc;
                        // tableRow.variance = tableRow.budget - tableRow.pfc;
                        // this.totals.variance = this.totals.budget - this.totals.pfc;
                      })
                    }
                  }

                  if (amount > 0) {
                    const tableRow = this.categories.find(c => c.title === cat.name)
                    tableRow.budget += parseFloat(amount)
                    this.totals.budget += parseFloat(amount)
                    // tableRow.pfc = tableRow.commitmentsTotal + tableRow.changesTotal;
                    // this.totals.pfc += tableRow.pfc;
                    // tableRow.variance = tableRow.budget - tableRow.pfc;
                    // this.totals.variance = this.totals.budget - this.totals.pfc;
                  }
                })
              })
              // Commitments
              this.projectRef.collection('commitments').where('budgetCategory', '==', cat.name).get().then(res => {
                res.forEach(doc => {
                  // Skipping verification
                  const commitment = doc.data()
                  const auxDate = new Date(commitment.startDate)

                  const skip = skipIterationForItems(auxDate, this.dateRule)
                  if (skip) {
                    return
                  }

                  const amount = commitment.amount
                  if (amount) {
                    const tableRow = this.categories.find(c => c.title === cat.name)

                    // Calculate Total Allocated overspent commitments
                    this.projectRef.collection('spendings').where('commitment', '==', doc.ref).get().then(res => {
                      let totalSpent = 0
                      res.forEach(doc => {
                        const spending = doc.data()

                        const auxDate = new Date(spending.date)
                        const skip = skipIterationForItems(auxDate, this.dateRule)

                        if (skip) {
                          return
                        }

                        totalSpent += spending.amount
                      })
                      if (totalSpent > amount) {
                        const overspent = totalSpent - amount
                        tableRow.totalAllocated += parseFloat(overspent)
                        this.totals.allocated += parseFloat(overspent)
                      }
                    })

                    tableRow.commitmentsTotal += parseFloat(amount)
                    this.totals.commitments += parseFloat(amount)
                    tableRow.totalAllocated += parseFloat(amount)
                    this.totals.allocated += parseFloat(amount)
                    // tableRow.pfc = tableRow.commitmentsTotal + tableRow.changesTotal
                    // this.totals.pfc += tableRow.pfc
                    // tableRow.variance = tableRow.budget - tableRow.pfc
                    // this.totals.variance = this.totals.budget - this.totals.pfc
                  }
                })
              })

              // Spending
              this.projectRef.collection('spendings').get().then(res => {
                res.forEach(doc => {
                  const data = doc.data()

                  const auxDate = new Date(data.date)
                  const skip = skipIterationForItems(auxDate, this.dateRule)

                  if (skip) {
                    return
                  }

                  if (data.budgetCategory && data.budgetCategory === cat.name) {
                    const amount = data.amount
                    if (amount) {
                      const tableRow = this.categories.find(c => c.title === cat.name)
                      tableRow.spendingTotal += parseFloat(amount)
                      this.totals.spending += parseFloat(amount)
                      tableRow.totalAllocated += parseFloat(amount)
                      this.totals.allocated += parseFloat(amount)
                    }
                  } else {
                    if (data.commitment) {
                      data.commitment.get().then(snap => {
                        const commitData = snap.data()
                        if (commitData.budgetCategory && commitData.budgetCategory === cat.name) {
                          const tableRow = this.categories.find(c => c.title === cat.name)
                          tableRow.spendingTotal += parseFloat(data.amount)
                          this.totals.spending += parseFloat(data.amount)
                        }
                      })
                    }
                  }
                })
              })

              // Changes
              this.projectRef.collection('changes').where('budgetCategory', '==', cat.name).where('forecast', '==', true).get().then(res => {
                res.forEach(doc => {
                  const change = doc.data()

                  const auxDate = new Date(change.date)
                  const skip = skipIterationForItems(auxDate, this.dateRule)
                  if (skip) {
                    return
                  }

                  const amount = change.amount
                  if (amount) {
                    const tableRow = this.categories.find(c => c.title === cat.name)
                    tableRow.changesTotal += parseFloat(amount)
                    this.totals.changes += parseFloat(amount)
                    tableRow.pfc = tableRow.commitmentsTotal + tableRow.changesTotal
                    this.totals.pfc += tableRow.pfc
                    tableRow.variance = tableRow.budget - tableRow.pfc
                    this.totals.variance = this.totals.budget - this.totals.pfc
                  }
                })
              })
            })
          })
        }
      })
    }
  }
}
</script>

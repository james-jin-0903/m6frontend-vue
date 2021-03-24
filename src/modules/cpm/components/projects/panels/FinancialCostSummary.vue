<template>
  <m6-card-dialog title="Cost Summary">
    <template v-slot:after:title>
      <v-tooltip
        v-if="$route.name === 'cpm.projects.show'"
        left
      >
        <template v-slot:activator="{ on }">
          <a
            class="pointer"
            :href="'/m6apps#/cpm/projects/' + $route.params.id + '/fullscreen/financial-cost-summary'"
            target="_blank"
            v-on="on"
          >
            <v-icon
              small
              text
            >
              mdi-launch
            </v-icon>
          </a>
        </template>
        <span>{{ $t('general.openNewTab') }}</span>
      </v-tooltip>
    </template>
    <!--This should not be displayed yet-->
    <cost-summary
      v-if="false"
      :table-totals="totals"
    />

    <v-data-table
      :loading="gettingData"
      :key="tableKey"
      :headers="headers"
      item-key="name"
      :items="filteredCategories"
      :items-per-page-options="[5,10,15,200]"
      :options="pagination"
    >
      <template
        slot="item"
        slot-scope="props"
      >
        <tr
          v-if="categoryHasPositiveTotals(props.item, 'totalCategoryOnly')"
          v-show="props.item.showRow"
          class="pointer step4"
          :class="{
            'blue lighten-2': props.expanded || props.item.showChildren,
            'low-opacity':
              props.item.lowOpacity && !isCollapsed && !props.expanded,
            'white--text no-opacity': props.item.showChildren,
            'child-category grey lighten-2': props.item.type !== 'parent'
          }"
          @click.stop="expandSelection(props)"
        >
          <td class="text-left">
            {{ props.item.code ? props.item.code + ' -' : '' }}
            {{ props.item.name }}
          </td>

          <td class="text-right">
            {{ props.item.totalCategoryOnly.budgetTotal | currency }}
          </td>

          <td class="text-right">
            {{ props.item.totalCategoryOnly.commitmentsTotal | currency }}
          </td>

          <td class="text-right">
            {{ props.item.totalCategoryOnly.spendingTotal | currency }}
          </td>

          <td
            class="text-right"
            :class="{
              overdraft: props.item.totalAllocated > props.item.budget
            }"
          >
            {{ props.item.totalCategoryOnly.totalAllocated | currency }}
          </td>

          <td class="text-right">
            {{ props.item.totalCategoryOnly.changesTotal | currency }}
          </td>

          <td
            class="text-right"
            :class="{
              overdraft:
                props.item.totalAllocated + props.item.changesTotal >
                props.item.budget
            }"
          >
            {{ props.item.totalCategoryOnly.projectFinalCost | currency }}
          </td>

          <td class="text-right">
            {{ props.item.totalCategoryOnly.variance | currency }}
          </td>
        </tr>
      </template>

      <template v-slot:body.append>
        <tr>
          <td class="gray-row   text-left">
            <strong>{{ $tc('general.total', 1) }}</strong>
          </td>

          <td class="gray-row text-right">
            {{ totals.budget | currency }}
          </td>

          <td class="gray-row text-right">
            {{ totals.commitments | currency }}
          </td>

          <td class="gray-row text-right">
            {{ totals.spending | currency }}
          </td>

          <td class="gray-row text-right">
            {{ totals.allocated | currency }}
          </td>

          <td class="gray-row text-right">
            {{ totals.changes | currency }}
          </td>

          <td
            class="gray-row text-right"
            :class="{
              overdraft: totals.allocated + totals.changes > totals.budget
            }"
          >
            {{ (totals.allocated + totals.changes) | currency }}
          </td>

          <td class="gray-row text-right">
            {{ (totals.budget - (totals.allocated + totals.changes)) | currency }}
          </td>
        </tr>
      </template>

      <template v-slot:expand="props">
        <v-row
          v-if="props.item.type !== 'parent' || !props.item.children.length"
          justify="center"
        >
          <v-col cols="11">
            <v-data-table
              class="elevation-1"
              :headers="commitmentHeaders"
              :items="selectedRow.totalRefs"
            >
              <template
                slot="items"
                slot-scope="props"
              >
                <tr style="background-color: rgba(0, 0, 0, 0.05);">
                  <td>
                    {{ props.item.number }}
                  </td>

                  <td>{{ getDate(props.item.startDate) }}</td>

                  <td>
                    {{ props.item.amount | currency }}
                  </td>

                  <td>
                    {{ (props.item.spendingAmount || 0) | currency }}
                  </td>

                  <td>
                    {{ (props.item.openAmount || 0) | currency }}
                  </td>
                </tr>
              </template>

              <template v-slot:body.append>
                <tr style="background-color: rgba(0, 0, 0, 0.05);">
                  <td>
                    Totals:
                  </td>

                  <td />

                  <td>
                    <div>
                      {{ totalFilteredResorces.amount | currency }}
                    </div>
                  </td>

                  <td>
                    <div>
                      {{ totalFilteredResorces.spending | currency }}
                    </div>
                  </td>

                  <td>
                    <div>
                      {{ totalFilteredResorces.balance | currency }}
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </template>
    </v-data-table>
  </m6-card-dialog>
</template>

<script>
import axios from 'axios'
import EventBus from '@/Eventbus'
import { db } from '@/utils/Firebase'
import { mapState } from 'vuex'

import FirebaseReportComponent from './FirebaseReportComponent.vue'
import CostSummaryPanel from './CostSummary'
import moment from 'moment'
import { isEqual } from 'lodash'

export default {
  name: 'FinancialCostSummary',
  components: {
    'cost-summary': CostSummaryPanel
  },

  extends: FirebaseReportComponent,

  props: {
    pid: {
      type: [String, Number],
      default: undefined
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
    const projectId = this.pid || this.$route.params.id

    return {
      gettingData: true,
      isCollapsed: true,
      filteredCategories: [],
      projectRef: db.collection('cpm_projects').doc(projectId),
      selectedRow: {},
      allCommitments: [],
      commitments: [],
      project: {},
      projectId,
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
        variance: 0,
        contingency: 0
      },
      headers: [
        {
          text: this.$t('cpm.projects.budgetCategory'),
          value: 'code'
        },
        {
          text: this.$t('cpm.projects.budget'),
          value: 'budgetTotal'
        },
        {
          text: this.$tc('cpm.projects.commitment', 2),
          value: 'commitmentsTotal'
        },
        {
          text: this.$t('cpm.projects.spending'),
          value: 'spendingTotal'
        },
        {
          text: this.$t('cpm.projects.totalAllocated'),
          value: 'totalAllocated'
        },
        {
          text: this.$t('cpm.pendingBulletins'),
          value: 'changesTotal'
        },
        {
          text: this.$t('cpm.projects.projectedFinalCost'),
          value: 'projectFinalCost'
        },
        {
          text: this.$t('cpm.projects.variance'),
          value: 'variance'
        }
      ],
      commitmentHeaders: [
        { text: this.$t('cpm.projects.poNumber'), value: 'number' },
        {
          text: 'Date',
          value: 'date'
        },
        { text: this.$t('general.amount'), value: 'amount' },
        { text: this.$t('cpm.projects.spending'), value: 'spendings' },
        { text: this.$t('general.balance'), value: 'balance' }
      ],
      pagination: {
        rowsPerPage: -1
      },
      tableKey: 1,
      headers1: [
        {
          text: 'Dessert (100g serving)',
          value: 'name'
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' }
      ],
      desserts1: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%'
        }
      ]
    }
  },

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    totalFilteredResorces() {
      const data = {
        amount: 0,
        balance: 0,
        spending: 0
      }
      if (this.$h.dg(this.selectedRow, 'refs')) {
        this.selectedRow.totalRefs.map(item => {
          data.amount += this.$h.dg(item, 'amount', 0)
          data.balance += this.$h.dg(item, 'openAmount', 0)
          data.spending += this.$h.dg(item, 'spendingAmount', 0)
        })
      }

      return data
    },
    totalParents() {
      return this.categories.reduce((accumulator, category) => {
        if (this.categoryHasPositiveTotals(category)) {
          accumulator++
        }
        return accumulator
      }, 0)
    }
  },

  watch: {
    dateRule: function () {
      this.getTable()
    },
    'project.totals': function () {
      this.getTable()
    },
    pagination(newValue, oldValue) {
      if (!isEqual(newValue, oldValue)) {
        this.setFilteredCategories()
      }
    }
  },
  firestore() {
    return {
      project: db.collection('cpm_projects').doc(this.projectId)
    }
  },
  mounted() {
    console.log(this.projectId)
    this.getTable()
    this.getCommitments()

    // TODO: Change behaviour instead of refreshing everytime when something change or an spending event change to something better
    EventBus.$on('refresh-financial-cost-summary', () => {
      this.getTable()
      this.getCommitments()
    })
  },

  methods: {
    calculateTable() {
      this.categories = []
      this.budgetCategories.forEach(cat => {
        const lineItem = this.lineItems.find(
          li => li.budgetCategory === cat.name
        )
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
        variance: 0,
        contingency: 0
      }
      this.categories = []
    },

    getTable() {
      this.resetValues()
      const url = `${this.firebaseUrl}/api/company/${this.currentCompany.id}/project/${this.projectId}/reports-by-categories`
      const data = {
        environment: this.environment
      }
      axios({
        method: 'post',
        url,
        data
      }).then(response => {
        this.setCategories(this.$h.dg(response, 'data.results'))
        this.totals.budget = this.$h.dg(response, 'data.totals.budgetTotal', 0)
        this.totals.commitments = this.$h.dg(
          response,
          'data.totals.commitmentsTotal',
          0
        )
        this.totals.spending = this.$h.dg(
          response,
          'data.totals.spendingTotal',
          0
        )
        this.totals.allocated = this.$h.dg(
          response,
          'data.totals.totalAllocated',
          0
        )
        this.totals.changes = this.$h.dg(
          response,
          'data.totals.changesTotal',
          0
        )
        this.totals.variance = this.$h.dg(response, 'data.totals.variance', 0)
        this.totals.contingency = this.calculateContingency()
      })
      .finally(() => this.gettingData = false)
    },

    calculateContingency() {
      const contingencyCategories = this.categories.filter(
        category => category.contingency === true
      )

      let contingencyTotal = 0
      contingencyCategories.forEach(category => {
        contingencyTotal += category.budgetTotal
      })

      return contingencyTotal
    },
    async getCommitments() {
      const commitmentsArray = []

      const commitments = await this.projectRef
        .collection('commitments')
        .orderBy('number')
        .get()
      await commitments.docs.map(async c => {
        const commitmentObject = c.data()
        commitmentObject.id = c.id

        this.$set(commitmentObject, 'line_items', [])

        const snapshot = await this.projectRef
          .collection('commitments')
          .doc(c.id)
          .collection('line_items')
          .get()

        snapshot.docs.forEach(doc => {
          const lineItem = doc.data()
          lineItem.id = doc.id
          commitmentObject.line_items.push(lineItem)
        })

        this.$set(commitmentObject, 'invoices', [])

        const spendings = await this.projectRef
          .collection('spendings')
          .where('commitment', '==', c.ref)
          .get()

        spendings.docs.forEach(spend => {
          const spendData = spend.data()
          spendData.id = spend.id
          spendData.amount = 0
          commitmentObject.invoices.push(spendData)
        })

        commitmentsArray.push(commitmentObject)

        if (this.commitmentToShow) {
          this.commitmentToShow = {
            ...commitmentsArray.find(c => c.id === this.commitmentToShow.id)
          }
        }
      })

      this.commitments = commitmentsArray
    },
    setCategories(categories = []) {
      this.categories = []
      categories.map((category, index) => {
        const totalRefs = this.$h.dg(category, 'totalRefs', [])
        const refsData = []
        if (totalRefs.length) {
          totalRefs.map((ref, i) => {
            if (this.$h.dg(ref, 'ref._path.segments')) {
              const commitmentRef = this.$h.ffGetRef(ref.ref._path.segments)
              commitmentRef.get().then(docData => {
                refsData[i] = { ...docData.data(), total: ref.total || 0 }
              })
            }
          })

          this.categories[index] = { ...category, totalRefs: refsData }
        } else {
          this.categories[index] = category
        }
      })

      this.setFilteredCategories()
    },

    categoryHasPositiveTotals(category, totalPropName = 'totals') {
      return Boolean(
        category[totalPropName].budgetTotal ||
          category[totalPropName].commitmentsTotal ||
          category[totalPropName].spendingTotal ||
          category[totalPropName].totalAllocated ||
          category[totalPropName].changesTotal ||
          category[totalPropName].variance
      )
    },
    getDate(date) {
      if (!date) return ''

      return moment(date).format('MM/DD/YYYY')
    },

    expandSelection(category) {
      if (category.item.type !== 'parent' || !category.item.children.length) {
        category.expanded = !category.expanded
        this.setSelectedRow(category.item)
      } else {
        category.item.showChildren = !category.item.showChildren
        category.item.children.map(childCategory => {
          childCategory.showRow = !childCategory.showRow
          childCategory.children.map(grandChildCategory => {
            grandChildCategory.showRow = !grandChildCategory.showRow
          })
        })
        this.filteredCategories.map(filteredCategory => {
          if (filteredCategory.name === category.item.name) {
            filteredCategory.showRow = !filteredCategory.showRow
          }
          if (
            filteredCategory.type === 'parent' &&
            filteredCategory.showChildren
          ) {
            filteredCategory.lowOpacity = false
          } else if (
            filteredCategory.type !== 'parent' &&
            filteredCategory.showRow
          ) {
            filteredCategory.lowOpacity = false
          } else {
            filteredCategory.lowOpacity = true
          }
        })
        category.item.showRow = true
        this.tableKey++
      }
      this.setTableStatus()
    },
    getPagination() {
      const page = this.$h.dg(this.pagination, 'page', 1)
      let rowsPerPage = this.$h.dg(this.pagination, 'rowsPerPage', -1)

      if (rowsPerPage < 0) {
        rowsPerPage = 100
      }

      let start = 0
      let end = rowsPerPage - 1

      if (page > 1) {
        start = (page - 1) * rowsPerPage
        end = start + rowsPerPage
      }

      return {
        start,
        end
      }
    },
    setFilteredCategories() {
      const { start, end } = this.getPagination()
      const categories = []
      let totalParents = 0

      this.categories.map(category => {
        if (
          this.categoryHasPositiveTotals(category) &&
          totalParents >= start &&
          totalParents <= end
        ) {
          categories.push({
            type: 'parent',
            showRow: true,
            lowOpacity: false,
            showChildren: false,
            ...category,
            name: `${this.$h.dg(category, 'name', '')}`,
            totalCategoryOnly: this.$h.dg(category, 'totals', {})
          })

          let childrenHasPositiveTotals = false
          if (this.$h.dg(category, 'children', []).length) {
            category.children.map(category => {
              if (this.categoryHasPositiveTotals(category)) {
                childrenHasPositiveTotals = true
              }
            })
            if (childrenHasPositiveTotals) {
              categories.push({
                showRow: false,
                lowOpacity: false,
                ...category
              })
              category.children.map(category => {
                category.showRow = false
                categories.push(category)
                if (this.$h.dg(category, 'children', []).length) {
                  category.children.map(category => {
                    category.showRow = false
                    ;
                    (category.lowOpacity = false), categories.push(category)
                  })
                }
              })
            }
          }
          totalParents++
        } else if (this.categoryHasPositiveTotals(category)) {
          totalParents++
        }
      })

      this.filteredCategories = categories
    },
    setTableStatus() {
      let isCollapsed = true

      this.filteredCategories.map(category => {
        if (category.type !== 'parent' && category.showRow) {
          isCollapsed = false
        }
      })
      this.isCollapsed = isCollapsed
    },
    setSelectedRow(selectedRow) {
      if (this.$h.dg(selectedRow, 'refs')) {
        selectedRow.totalRefs.map((item, i) => {
          if (this.$h.dg(item, 'commitment')) {
            selectedRow.totalRefs[i] = item.commitment
          }
        })
      }
      this.selectedRow = selectedRow
    }
  }
}
</script>

<style lang="scss" scoped>
.cpm-panel {
  margin-bottom: 10px;
}
.card-container {
  padding: 17px;
  /*max-height: 480px; */
  overflow-y: auto;
  overflow-x: hidden;
}
.dependency-details {
  line-height: 1.2;
  p:first-child {
    font-size: 16px;
  }
  font-size: 12px;
}
.gray-row {
  background: #eee;
}
.child-category {
  border: 1px solid #64b5f6;
}

.low-opacity {
  opacity: 0.6;
}

.no-opacity {
  opacity: 1 !important;
}
</style>

<template>
  <div>
    <v-card class="licensing-edit-modal rounded-lg">
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">
          {{ $t('cpm.projects.budgetPanel.editBudget.lineItems') }}
        </span>
        <v-spacer />
        <v-btn
          color="blue darken-2"
          dark
          fab
          small
          @click="openNewItem"
        >
          <v-icon light>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class="grey lighten-3" />
      <v-card-text class="vertical-scroll">
        <new-item
          v-if="showNewItem"
          :budget-categories-select="budgetCategoriesSelect"
          :budget-id="budget.id"
          :cost-codes="costCodesAllArray"
          :settings="settings"
          @cancel="cancelLineItem"
          @created="lineItemCreated"
        />
        <edit-item
          v-if="showEditItem"
          :budget-categories-select="budgetCategoriesSelect"
          :budget-id="budget.id"
          :cost-codes="costCodesAllArray"
          :line-item="lineItemToEdit"
          :settings="settings"
          @cancel="cancelEditLineItem"
          @edited="lineItemEdited"
        />
        <v-data-table
          disable-sort
          :headers="headers"
          item-key="category.name"
          :items="budgetCategories"
          :items-per-page-options="[5,10,15,200]"
        >
          <template v-slot:item.category="{item}">
            {{ item.items[0].budget_category.ref.name || '' }}
          </template>
          <template v-slot:items="props">
            <tr
              @click="
                props.expanded = !props.expanded
                selectedBudgetCategory = props.item
              "
            >
              <td>
                <v-icon v-if="!props.expanded">
                  mdi-arrow-right-box
                </v-icon>
                <v-icon v-if="props.expanded">
                  mdi-arrow-down-box
                </v-icon>
              </td>
              <td>
                <template v-if="$h.dg(props, 'item.category', false)">
                  {{ props.item.category.code }} - {{ props.item.category.name }}
                </template>
                <template v-else>
                  {{ $t('cpm.projects.budgetPanel.editBudget.noDefined') }}
                </template>
              </td>
              <td>
                {{ props.item.amount | currency }}
              </td>
            </tr>
          </template>

          <template v-slot:item.lineitems="props">
            <div class="py-3">
              <v-data-table
                class="elevation-1"
                disable-sort
                :headers="subHeaders"
                :hide-default-footer="true"
                :items="props.item.items"
              >
                <template v-slot:item.createdat="props">
                  {{ getDate(props.item.createdAt) }}
                </template>
                <template v-slot:item.amount="props">
                  {{ props.item.amount | currency }}
                </template>
                <template v-slot:item.actions="props">
                  <div class="d-flex">
                    <v-icon
                      class="ml-0 mr-2 pointer"
                      color="#757575"
                      size="20"
                      @click.stop="editLineItem(props.item)"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon
                      class="ml-0 mr-2 pointer"
                      color="#f44336"
                      size="20"
                      @click.stop="deleteLineItem(props.item)"
                    >
                      mdi-delete
                    </v-icon>
                  </div>
                </template>
              </v-data-table>
            </div>
          </template>
        </v-data-table>
        <div class="totals-container">
          <v-chip>{{ $t('general.subTotal') }}: {{ total | currency }}</v-chip>
          <v-chip>{{ $tc('general.total', total) }}: {{ total | currency }}</v-chip>
        </div>
        <br>
      </v-card-text>
    </v-card>
    <m6-loading :loading="showLoading" />
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'
import NewLineItem from './forms/NewLineItem'
import EditLineItem from './forms/EditLineItem'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  name: 'LineItems',
  components: {
    'new-item': NewLineItem,
    'edit-item': EditLineItem
  },

  props: {
    budget: { type: Object, default: () => {} },
    value: { type: Boolean, default: false },
    type: { type: String, default: 'project' }
  },

  data() {
    return {
      budgetCategories: [],
      expand: false,
      projectRef: db.collection('cpm_projects').doc(this.$route.params.id),
      settings: {},
      headers: [
        {
          text: this.$t('cpm.projects.budgetPanel.editBudget.budgetCategory'),
          value: 'category',
          sortable: false
        },
        {
          text: this.$t('cpm.projects.budgetPanel.editBudget.amount'),
          value: 'amount'
        },
        {
          text: 'Line Items',
          value: 'lineitems'
        }
      ],
      subHeaders: [
        {
          text: this.$t('cpm.projects.budgetPanel.editBudget.createdAt'),
          sortable: false,
          value: 'createdat'
        },
        {
          text: this.$t('cpm.projects.budgetPanel.editBudget.type'),
          value: 'type'
        },
        {
          text: this.$t('cpm.projects.budgetPanel.editBudget.amount'),
          value: 'amount'
        },
        { text: this.$t('general.actions'), sortable: false, value: 'actions' }
      ],
      showNewItem: false,
      showEditItem: false,
      budgetCategoriesSelect: [],
      costCodesSortArray: [],
      costCodesAllArray: [],
      firebaseBudget: {},
      showLoading: false,
      lineItems: { type: Object, default: () => {} },
      lineItemToDelete: {},
      selectedBudgetCategory: null
    }
  },

  firestore() {
    return {
      firebaseBudget: db
        .collection('cpm_projects')
        .doc(this.$route.params.id)
        .collection('budgets')
        .doc(this.budget.id),
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('budgets'),
      lineItems: db
        .collection('cpm_projects')
        .doc(this.$route.params.id)
        .collection('budgets')
        .doc(this.budget.id)
        .collection('lineItems')
    }
  },

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    total() {
      if (this.budgetCategories.length) {
        let total = 0
        this.budgetCategories.map(category => {
          total += category.amount || 0
        })

        return total
      } else return 0
    },

    dialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },

    settingCollectionName() {
      if (this.type === 'forecasted') {
        return 'planned_settings'
      } else {
        return 'settings'
      }
    }
  },
  watch: {
    lineItems(val) {
      this.$emit('updateLineItems', val)
    },
    settings() {
      this.costCodesSortArray = []
      this.costCodesAllArray = []
      if (this.$h.dg(this.settings, 'costCodes')) {
        this.settings.costCodes.forEach(cl1 => {
          this.costCodesSortArray.push(cl1.name)
          const itemName = cl1.code ? `${cl1.code} - ${cl1.name}` : cl1.name
          this.costCodesAllArray.push({
            item: cl1,
            name: itemName,
            level: 1
          })
          this.budgetCategoriesSelect.push(cl1.name)
          if (this.$h.dg(cl1, 'cat_1')) {
            cl1.cat_1.forEach(cl2 => {
              this.costCodesSortArray.push(cl1.name + ' - ' + cl2.name)
              let itemL2Name = itemName + ' | '
              itemL2Name += cl2.code ? `${cl2.code} - ${cl2.name}` : cl2.name
              this.costCodesAllArray.push({
                item: cl1,
                itemL2: cl2,
                name: itemL2Name,
                level: 2
              })
              if (this.$h.dg(cl2, 'cat_2')) {
                cl2.cat_2.forEach(cl3 => {
                  this.costCodesSortArray.push(
                    cl1.name + ' - ' + cl2.name + ' - ' + cl3.name
                  )
                  let itemL3Name = itemL2Name + ' | '
                  itemL3Name += cl3.code
                    ? `${cl3.code} - ${cl3.name}`
                    : cl3.name
                  this.costCodesAllArray.push({
                    item: cl1,
                    itemL2: cl2,
                    itemL3: cl3,
                    name: itemL3Name,
                    level: 3
                  })
                })
              }
            })
          }
        })
      }
    }
  },
  created() {
    this.fetchLineItems()
  },
  methods: {
    async fetchLineItems() {
      const lineItems = []
      const query = db
        .collection('cpm_projects')
        .doc(this.$route.params.id)
        .collection('budgets')
        .doc(this.budget.id)
        .collection('lineItems')

      const { docs } = await query.get()

      await Promise.all(docs.map(async doc => {
        const data = { ...doc.data(), id: doc.id }

        if (this.$h.dg(data, 'budget_category.ref.id')) {
          const response = await db
            .collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('budgets')
            .collection('budget_categories')
            .doc(data.budget_category.ref.id)
            .get()

          data.budget_category.ref = { ...response.data(), id: response.id }
        }
        lineItems.push({
          ...data
        })
      }))

      const lineItemsGroupedByCategory = this.lodash.groupBy(
        lineItems,
        'budget_category.ref.name'
      )

      const budgetCategories = []
      Object.keys(lineItemsGroupedByCategory).map(key => {
        let amount = 0
        const items = lineItemsGroupedByCategory[key]
        items.map(item => {
          amount += parseFloat(item.amount) || 0
        })

        const categoryName = {
          code: this.$h.dg(items[0], 'budget_category.ref.code', this.$t('general.nA')),
          name: this.$h.dg(items[0], 'budget_category.ref.name', this.$t('cpm.projects.budgetPanel.editBudget.noDefined'))
        }

        budgetCategories.push({
          items,
          category: categoryName,
          amount
        })
      })

      this.budgetCategories = budgetCategories
    },
    cancelLineItem() {
      this.showNewItem = false
    },

    cancelEditLineItem() {
      this.showEditItem = false
    },

    editLineItem(lineItem) {
      this.lineItemToEdit = lineItem
      this.cancelLineItem()
      this.showEditItem = true
    },

    deleteLineItem(item) {
      this.lineItemToDelete = item
      this.$emit('showDeleteLineItemModal', true)
    },

    cancelDelete() {
      this.$emit('showDeleteLineItemModal', false)
      this.lineItemToDelete = {}
    },

    async deleteConfirmed() {
      this.showLoading = true
      this.projectRef
        .collection('budgets')
        .doc(this.budget.id)
        .collection('lineItems')
        .doc(this.lineItemToDelete.id)
        .delete()
        .then(() => {
          this.showLoading = false
          this.$snotify.success(this.$t('general.lineItemDeleted'), this.$t('alerts.success'))
          this.cancelDelete()
          this.calculateBudgetTotal()
          this.updateBudgetInformation()
          this.fetchLineItems()
        })
        .catch(() => {
          this.cancelDelete()
          this.$snotify.error(
            this.$t('general.lineItemNotDeleted'),
            this.$t('alerts.error')
          )
        })
    },

    updateBudgetInformation() {
      this.$emit('updateBudgetInformation')
    },

    lineItemCreated() {
      this.calculateBudgetTotal()
      this.cancelLineItem()
      this.updateBudgetInformation()
      this.fetchLineItems()
    },

    lineItemEdited() {
      this.calculateBudgetTotal()
      this.cancelEditLineItem()
      this.updateBudgetInformation()
      this.fetchLineItems()
    },

    calculateBudgetTotal() {
      let budgetSubTotal = parseFloat(0.0)
      const lineItems = Object.values(this.$h.dg(this, 'lineItems', []))
      lineItems.forEach(item => {
        if (item.type === 'Amount' && !item.belowSubtotal) {
          budgetSubTotal += parseFloat(item.amount)
        }
      })

      let budgetTotal = parseFloat(budgetSubTotal)
      this.lineItems.forEach(item => {
        if (item.type === 'Percentage') {
          if (
            item.percentageType === undefined ||
            item.percentageType === 'Subtotal'
          ) {
            budgetTotal += parseFloat(
              Math.floor(budgetSubTotal * (item.amount / 100))
            )
          } else if (item.percentageType === 'Category') {
            budgetTotal += this.calculateBudgetPercentage(
              item.percentageBudgetCategories,
              item.amount
            )
          }
        } else if (item.belowSubtotal) {
          budgetTotal += parseFloat(item.amount)
        }
      })

      db.collection('cpm_projects')
        .doc(this.$route.params.id)
        .collection('budgets')
        .doc(this.budget.id)
        .update({
          subTotal: budgetSubTotal.toFixed(2),
          total: budgetTotal.toFixed(2)
        })
        .then(() => {
          this.sortLineItems()
        })
    },

    calculateBudgetPercentage(categories, amount) {
      let resultAmount = 0
      this.lineItems.forEach(li => {
        if (
          categories.includes(li.budgetCategory) &&
          li.type === 'Amount' &&
          !li.belowSubtotal
        ) {
          resultAmount += li.amount
        }
      })
      return parseFloat(Math.floor(resultAmount * (amount / 100)))
    },

    sortLineItems() {
      this.budgetLineItems = []
      const tempLineItems = []
      this.lineItems.forEach(li => {
        this.costCodesSortArray.find((s, i) => {
          if (s === li.costCodeText) {
            li.sortIndex = i
          }
        })
        tempLineItems.push(li)
      })
      tempLineItems.sort((a, b) => a.sortIndex - b.sortIndex)
      this.budgetLineItems = tempLineItems
    },
    getDate(timestamp) {
      return moment(timestamp.toDate()).format('MM/DD/YYYY')
    },
    openNewItem() {
      this.cancelEditLineItem()
      this.showNewItem = !this.showNewItem
    }
  }
}
</script>

<style lang="scss" scoped>
.input-margin-right {
  margin-right: 0.9375rem;

  &:last-child {
    margin-right: 0;
  }
}

.edit-cost-form {
  margin-top: 1.5625rem;
}

.budget-title {
  align-items: center;
}

.padding-top-10 {
  padding-top: 0.625rem;
}

.text-right {
  text-align: right;
}

.totals-container {
  margin-top: 0.3125rem;
  text-align: right;
}
</style>

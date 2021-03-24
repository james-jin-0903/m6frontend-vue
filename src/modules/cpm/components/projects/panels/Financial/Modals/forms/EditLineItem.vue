<template>
  <transition
    mode="out-in"
    name="router-anim"
  >
    <div class="px-3">
      <div class="w-full">
        <budget-category-select
          :category="lineItem.budget_category.ref"
          :errors="budgetCategoryErrors"
          @newCategory="setBudgetCategory"
        />
      </div>
      <div class="w-full">
        <v-text-field
          v-model="lineItem.costCodeNumber"
          :append-icon="
            categorySelected && lineItem.budgetCategory ? 'check_circle' : ''
          "
          color="blue"
          label="Cost Code"
          readonly
        />
      </div>

      <div class="margin-top-25 w-full">
        <template v-if="lineItem.type === 'Amount'">
          <label>{{ lineItem.type }}</label>
          <money
            v-model="lineItem.amount"
            v-bind="money"
            color="blue"
            label="Amount"
          />
        </template>
        <template v-else>
          <money
            v-model="lineItem.amount"
            v-bind="money"
            color="blue"
            label="Amount"
          />
        </template>
      </div>

      <div
        v-if="!fields.type.hide"
        class="col-xs-7"
        style="margin-top: 14px"
      >
        <label>Type</label>
        <v-select
          v-model="lineItem.type"
          clearable
          :items="settings.lineItemTypes"
        />
      </div>

      <div
        v-if="lineItem.type === 'Amount'"
        class="checkbox-fix col-xs-12 margin-top-10"
      >
        <v-checkbox
          v-model="lineItem.belowSubtotal"
          color="blue"
          label="Below Subtotal"
        />
      </div>

      <div class="clearfix" />

      <div
        v-if="lineItem.type === 'Percentage'"
        class="checkbox-fix col-xs-6 margin-top-10"
      >
        <label>Apply To:</label>
        <v-select
          v-model="lineItem.percentageType"
          clearable
          :items="['Subtotal', 'Category']"
        />
      </div>
      <div
        v-if="lineItem.type === 'Percentage'"
        class="checkbox-fix col-xs-6 margin-top-10"
      >
        <template v-if="lineItem.percentageType === 'Category'">
          <label>Apply To:</label>
          <v-select
            v-model="lineItem.percentageBudgetCategories"
            clearable
            :items="budgetCategoriesSelect"
            multiple
          />
        </template>
      </div>

      <div class="col-xs-12 margin-top-25">
        <v-textarea
          v-model="lineItem.description"
          auto-grow
          color="blue"
          label="Notes"
          rows="1"
        />
      </div>

      <div class="actions col-xs-12 margin-top-25 text-right">
        <v-btn
          class="mr-2"
          color="white"
          @click="cancelLineItem"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-2"
          dark
          @click="saveLineItem"
        >
          Update
        </v-btn>
      </div>
      <div class="clearfix" />
      <br>
    </div>
  </transition>
</template>

<script>
import { db } from '@/utils/Firebase'
import { Money } from 'v-money'
import BudgetCategorySelect from '../../../../_partials/BudgetCategorySelect'
import { mapState } from 'vuex'

export default {
  name: 'EditLineItem',
  components: {
    money: Money,
    BudgetCategorySelect
  },
  props: {
    lineItem: { type: Object, default: () => {} },
    settings: { type: Object, default: () => {} },
    budgetId: { type: String, default: '' },
    costCodes: { type: Array, default: () => [] },
    budgetCategoriesSelect: { type: Array, default: () => [] },
    type: { type: String, default: 'project' }
  },
  data() {
    return {
      showBudgetCategorySearch: false,
      showCostCodes: false,
      categorySelected: false,
      fields: {
        type: { hide: true }
      },
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '$',
        precision: 2,
        masked: false
      },
      formWasValidated: false
    }
  },
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    searchBudgetCategoriesArray() {
      if (
        this.lineItem.costCodeText === undefined ||
        this.lineItem.costCodeText === ''
      ) {
        return []
      }

      const result = []
      this.costCodes.map(cc => {
        if (
          cc.name
            .toLowerCase()
            .includes(this.lineItem.costCodeText.toLowerCase())
        ) {
          result.push(cc)
        }
      })
      return result
    },
    settingCollectionName() {
      if (this.$route.name.includes('forecasting')) {
        return 'planned_settings'
      } else {
        return 'settings'
      }
    },
    budgetCategoryErrors() {
      if (this.formWasValidated && !this.$h.dg(this.lineItem, 'budget_category.ref')) {
        return 'Budget Category is required'
      } else return []
    }
  },
  mounted() {
    this.getFields()

    if (this.lineItem.budgetCategory && this.lineItem.budgetCategory !== '') {
      this.categorySelected = true
    }
  },

  methods: {
    startSearchBudgetCategory() {
      this.showBudgetCategorySearch = true
      this.showCostCodes = false
      this.categorySelected = false
    },

    budgetCategoriesDropDown() {
      this.showCostCodes = !this.showCostCodes
      this.showBudgetCategorySearch = false
    },

    budgetCategorySearchSelect(catItem) {
      if (catItem.level === 1) {
        this.setCostCodeL1(catItem.item)
      } else if (catItem.level === 2) {
        this.setCostCodeL2(catItem.item, catItem.itemL2)
      } else if (catItem.level === 3) {
        this.setCostCodeL3(catItem.item, catItem.itemL2, catItem.itemL3)
      }
      this.showBudgetCategorySearch = false
    },

    setCostCodeL1(item) {
      this.lineItem.costCodeText = item.name
      this.lineItem.budgetCategory = item.name
      this.lineItem.costCode = item.name
      this.lineItem.costCodeNumber = item.code
      delete this.lineItem.costCodeL2
      delete this.lineItem.costCodeL3
      this.showCostCodes = false
      this.categorySelected = true
      this.lineItem.contingency = this.getContingency(item)
    },

    setCostCodeL2(item, itemL2) {
      this.lineItem.costCodeText = item.name + ' - ' + itemL2.name
      this.lineItem.budgetCategory = item.name
      this.lineItem.costCode = item.name
      this.lineItem.costCodeL2 = itemL2.name
      this.lineItem.costCodeNumber = itemL2.code
      delete this.lineItem.costCodeL3
      this.showCostCodes = false
      this.categorySelected = true
      this.lineItem.contingency = this.getContingency(itemL2)
    },

    setCostCodeL3(item, itemL2, itemL3) {
      this.lineItem.costCodeText =
        item.name + ' - ' + itemL2.name + ' - ' + itemL3.name
      this.lineItem.budgetCategory = item.name
      this.lineItem.costCode = item.name
      this.lineItem.costCodeL2 = itemL2.name
      this.lineItem.costCodeL3 = itemL3.name
      this.lineItem.costCodeNumber = itemL3.code
      this.showCostCodes = false
      this.categorySelected = true
      this.lineItem.contingency = this.getContingency(itemL3)
    },

    getFields() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('fields')
        .get()
        .then(settings => {
          if (settings.exists) {
            const data = settings.data()
            if (data.budget.type) {
              this.fields = data.budget
            } else {
              this.fields.type.hide = false
            }
          } else {
            this.fields.type.hide = false
          }
        })
    },

    cancelLineItem() {
      this.$emit('cancel')
    },

    getContingency(budgetCategory) {
      let contingency = false

      if (budgetCategory.contingency) {
        contingency = budgetCategory.contingency
      }
      return contingency
    },

    saveLineItem() {
      this.formWasValidated = true
      if (!this.$h.dg(this.lineItem, 'budget_category.ref')) {
        this.$snotify.warning('Please select a Budget Category')
        return
      }

      if (!this.lineItem.costCodeNumber) {
        this.lineItem.costCodeNumber = ''
      }

      this.lineItem.costCode = this.$h.dg(this.lineItem, 'budget_category.ref.name')
      this.lineItem.costCodeNumber = this.$h.dg(this.lineItem, 'budget_category.ref.code')
      this.lineItem.costCodeText = this.$h.dg(this.lineItem, 'budget_category.ref.name')

      const lineItemsRef = db
        .collection('cpm_projects')
        .doc(this.$route.params.id)
        .collection('budgets')
        .doc(this.budgetId)
        .collection('lineItems')

      const budgetCategoryRef = db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('budgets')
        .collection('budget_categories')
        .doc(this.lineItem.budget_category.ref.id)

      if (this.lineItem.id !== undefined) {
        // Save Existing Item
        this.lineItem.budget_category.ref = budgetCategoryRef
        lineItemsRef
          .doc(this.lineItem.id)
          .set(this.lineItem)
          .then(editedDoc => {
            this.$emit('edited', editedDoc)
          })
      } else {
        // Save New Item
        this.lineItem.createdAt = new Date()
        lineItemsRef.add(this.lineItem).then(editedDoc => {
          this.$emit('edited', editedDoc)
        })
      }
    },
    setCodes(category) {
      if (!category) return
      this.lineItem.costCode = category.name
      this.lineItem.costCodeNumber = category.code
      this.lineItem.costCodeText = category.name
    },
    setBudgetCategory(category) {
      this.lineItem.budget_category.ref = category
      this.setCodes(category)
    }
  }
}
</script>

<style lang="scss">
.budget-cat-select {
  height: 200px;
  overflow-y: scroll;
}
</style>

<template>
  <transition
    mode="out-in"
    name="router-anim"
  >
    <v-row>
      <v-col cols="12">
        <budget-category-select
          :category="newItem.budget_category.ref"
          :errors="budgetCategoryErrors"
          @newCategory="setBudgetCategory"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="newItem.costCodeNumber"
          :append-icon="
            categorySelected && newItem.budgetCategory ? 'check_circle' : ''
          "
          color="blue"
          label="Cost Code"
          readonly
        />
      </v-col>
      <v-col cols="12">
        <template v-if="newItem.type === 'Amount'">
          <label>{{ newItem.type }}</label>
          <money
            v-model="newItem.amount"
            v-bind="money"
            color="blue"
            label="Amount"
          />
        </template>
        <template v-else>
          <money
            v-model="newItem.amount"
            v-bind="money"
            color="blue"
            label="Amount"
          />
        </template>
      </v-col>

      <v-col
        v-if="!checkTypeHide"
        cols="12"
        style="margin-top: 14px"
      >
        <label>Type</label>
        <v-select
          v-model="newItem.type"
          clearable
          :items="settings.lineItemTypes"
        />
      </v-col>

      <v-col
        v-if="newItem.type === 'Amount'"
        class="checkbox-fix margin-top-10"
        cols="12"
      >
        <v-checkbox
          v-model="newItem.belowSubtotal"
          color="blue"
          label="Below Subtotal"
        />
      </v-col>

      <div class="clearfix" />

      <v-col
        v-if="newItem.type === 'Percentage'"
        class="checkbox-fix margin-top-10"
        cols="12"
      >
        <label>Apply To:</label>
        <v-select
          v-model="newItem.percentageType"
          clearable
          :items="['Subtotal', 'Category']"
        />
      </v-col>
      <v-col
        v-if="newItem.type === 'Percentage'"
        class="checkbox-fix margin-top-10"
        cols="12"
      >
        <template v-if="newItem.percentageType === 'Category'">
          <label>Apply To:</label>
          <v-select
            v-model="newItem.percentageBudgetCategories"
            clearable
            :items="budgetCategoriesSelect"
            multiple
          />
        </template>
      </v-col>

      <v-col
        class="margin-top-25"
        cols="12"
      >
        <v-textarea
          v-model="newItem.description"
          auto-grow
          color="blue"
          label="Notes"
          rows="1"
        />
      </v-col>

      <v-col
        class="actions margin-top-25 text-right"
        cols="12"
      >
        <v-btn
          class="mr-3"
          color="grey lighten-2"
          @click="cancelLineItem"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-3"
          dark
          @click="saveLineItem"
        >
          Save
        </v-btn>
      </v-col>
      <div class="clearfix" />
      <br>
    </v-row>
  </transition>
</template>

<script>
import { db } from '@/utils/Firebase'
import { Money } from 'v-money'
import BudgetCategorySelect from '../../../../_partials/BudgetCategorySelect'
import { mapState } from 'vuex'

export default {
  name: 'NewLineItem',
  components: {
    money: Money,
    BudgetCategorySelect
  },
  props: {
    settings: { type: Object, default: () => {} },
    budgetId: { type: String, default: '' },
    costCodes: { type: Array, default: () => [] },
    budgetCategoriesSelect: { type: Array, default: () => [] },
    type: { type: String, default: 'project' }
  },
  data() {
    return {
      newItem: {
        type: 'Amount',
        budget_category: {
          ref: ''
        }
      },
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

    checkTypeHide: function () {
      if (this.fields.type && this.fields.type.hide) {
        return this.fields.type.hide
      } else {
        return false
      }
    },

    searchBudgetCategoriesArray() {
      if (
        this.newItem.costCodeText === undefined ||
        this.newItem.costCodeText === ''
      ) {
        return []
      }

      const result = []
      this.costCodes.map(cc => {
        if (
          cc.name
            .toLowerCase()
            .includes(this.newItem.costCodeText.toLowerCase())
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
      if (this.formWasValidated && !this.$h.dg(this.newItem, 'budget_category.ref')) {
        return 'Budget Category is required'
      } else return []
    }
  },

  mounted() {
    this.getFields()
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
      this.newItem.costCodeText = item.name
      this.newItem.budgetCategory = item.name
      this.newItem.costCode = item.name
      this.newItem.costCodeNumber = item.code
      delete this.newItem.costCodeL2
      delete this.newItem.costCodeL3
      this.showCostCodes = false
      this.categorySelected = true
      this.newItem.contingency = this.getContingency(item)
    },

    setCostCodeL2(item, itemL2) {
      this.newItem.costCodeText = item.name + ' - ' + itemL2.name
      this.newItem.budgetCategory = item.name
      this.newItem.costCode = item.name
      this.newItem.costCodeL2 = itemL2.name
      this.newItem.costCodeNumber = itemL2.code
      delete this.newItem.costCodeL3
      this.showCostCodes = false
      this.categorySelected = true
      this.newItem.contingency = this.getContingency(itemL2)
    },

    setCostCodeL3(item, itemL2, itemL3) {
      this.newItem.costCodeText =
        item.name + ' - ' + itemL2.name + ' - ' + itemL3.name
      this.newItem.budgetCategory = item.name
      this.newItem.costCode = item.name
      this.newItem.costCodeL2 = itemL2.name
      this.newItem.costCodeL3 = itemL3.name
      this.newItem.costCodeNumber = itemL3.code
      this.showCostCodes = false
      this.categorySelected = true
      this.newItem.contingency = this.getContingency(itemL3)
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
      if (!this.$h.dg(this.newItem, 'budget_category.ref')) {
        this.$snotify.warning('Please select a Budget Category')
        return
      }

      if (this.$h.dg(this.newItem, 'budget_category.ref.id')) {
        this.newItem.budget_category.ref = db.collection('settings')
          .doc(this.currentCompany.id)
          .collection('settings')
          .doc('budgets')
          .collection('budget_categories')
          .doc(this.newItem.budget_category.ref.id)
      } else {
        if (this.newItem.budget_category) {
          delete this.newItem.budget_category
        }
      }


      const lineItemsRef = db
        .collection('cpm_projects')
        .doc(this.$route.params.id)
        .collection('budgets')
        .doc(this.budgetId)
        .collection('lineItems')

      if (this.newItem.id !== undefined) {
        // Save Existing Item
        lineItemsRef
          .doc(this.newItem.id)
          .set(this.newItem)
          .then(newDoc => {
            this.$emit('created', newDoc)
          })
      } else {
        // Save New Item
        this.newItem.createdAt = new Date()
        lineItemsRef.add(this.newItem).then(newDoc => {
          this.$emit('created', newDoc)
        })
      }
    },
    setCodes(category) {
      if (!category) return
      this.newItem.costCode = category.name
      this.newItem.costCodeNumber = category.code
      this.newItem.costCodeText = category.name
    },
    setBudgetCategory(category) {
      this.newItem.budget_category.ref = category
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
input.v-money {
  padding: 5px;
  border-bottom: 1px solid gray;
  width: 100%;
}
label {
  display: block;
}
input.v-money:focus {
  border-color: var(--v-primary-base)
}
</style>

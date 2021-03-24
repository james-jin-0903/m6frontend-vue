<template>
  <div>
    <v-row>
      <v-col cols="3">
        <v-text-field
          v-model="search"
          label="Search"
          outlined
          dense
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :items="items"
      :headers="headers"
      :search="search"
      :item-class= "row_classes"
      :custom-sort="customSort"
    >
      <template v-for="header in headers.filter((header) => header.hasOwnProperty('formatter'))" v-slot:[`item.${header.value}`]="{ item }">
        {{ header.formatter(item) }}
      </template>

      <template v-slot:item.vendor="{ item }">
        <template v-if="(item.vendors || []).length">
          <div
            v-for="(vendor, index) in item.vendors"
            :key="index"
          >
            {{ vendor.title ? vendor.title :vendor.custom_id }}
          </div>
        </template>
      </template v-slot:item>
      <template v-slot:item.actions="{ item }">
        <v-menu offset-y :disabled="financialType === 'spendings'">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            small
          >
            Actions
          </v-btn>
        </template>
        <v-list>
          <template v-for="(actionItem, index) in actionsItems">
            <v-hover v-slot="{ hover }" :key="index + 'hover'">
              <v-list-item
                :key="index"
                :class="{ 'on-hover-list-item': hover }"
                :elevation="hover ? 12 : 2"
                @click="actionItem.action(item)"
              >
                  <v-list-item-title
                    :class="{ 'on-hover-list-item-title': hover }"
                  >{{ actionItem.text }}</v-list-item-title>
              </v-list-item>
            </v-hover>
          </template>
        </v-list>
      </v-menu>
      </template>
      <template #loading>
        <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
      </template>
    </v-data-table>
    <commitment-form
      v-if="showForm"
      @update="updateItem"
      @close="closeFormModal"
      :commitment-to-edit="itemToEdit"
    ></commitment-form>
    <m6-confirm-delete
      :show="!!itemToDelete"
      @cancel="itemToDelete = null"
      @confirm="deleteItem"
    />
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'
import { mapGetters, mapMutations, mapState } from 'vuex'
import CommitmentForm from './Commitments/CommitmentForm'
import axios from 'axios'

export default {
  name: 'FinancialsTable',

  components: {
    CommitmentForm
  },

  props: {
    financialType: {
      type: String,
      default: 'commitments'
    },
    poNumbers: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    projectNumber: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      search: '',
      poNumberSearch: '',
      vendorSearch: '',
      firebaseUrl: process.env.VUE_APP_FIREBASE_APIURL,
      actionsItems: [
        {
          text: 'Edit',
          action: this.openFormModal
        },
        {
          text: 'Delete',
          action: this.openDeleteForm
        },
      ],
      projectId: null,
      itemToEdit: null,
      itemToDelete: null,
      showForm: false
    }
  },

  computed: {
    ...mapGetters('projects/settings/budgetCategories', [
      'budgetCategories'
    ]),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    filteredItems() {
      return this.items.filter(this.applyFilters)
    },
    viewingCommitments() {
      return this.financialType === 'commitments'
    },
    viewingSpendings() {
      return this.financialType === 'spendings'
    },
    allHeaders() {
      return {
        poNumber: {
          text: this.viewingCommitments ? 'PO Number' : 'Invoice #',
          value: 'number',
          align: '',
          class: '',
          width: 120
        },
        spendingPoNumber: {
          text: 'PO #',
          value: 'poNumber',
          align: '',
          class: '',
          width: 120
        },
        amount: {
          text: 'Amount',
          value: 'amount',
          align: 'end',
          class: '',
          formatter: this.formatterCurrency,
          width: 100
        },
        budgetCategory: {
          text: 'Budget Category',
          value: 'budgetCategory',
          align: '',
          class: '',
          width: 230
        },
        vendors: {
          text: 'Vendors',
          value: 'vendorToShow',
          align: '',
          class: ''
        },
        description: {
          text: 'Description',
          value: 'description',
          align: '',
          class: '',
          sortable: false
        },
        actions: {
          text: 'Actions',
          value: 'actions',
          align: 'center',
          class: '',
          sortable: false,
          width: 100
        }
      }
    },
    headers() {
      if (this.financialType === 'commitments') {
        return [
          this.allHeaders.poNumber,
          this.allHeaders.amount,
          this.allHeaders.budgetCategory,
          this.allHeaders.vendors,
          this.allHeaders.description,
          this.allHeaders.actions,
        ]
      } else if (this.financialType === 'spendings') {
        return [
          this.allHeaders.poNumber,
          this.allHeaders.spendingPoNumber,
          this.allHeaders.amount,
          this.allHeaders.budgetCategory,
          this.allHeaders.vendors,
          this.allHeaders.actions,
        ]
      }

      return []
    }
  },

  created() {
    this.setBudgetCategoryDataInItems()
  },

  methods: {
    ...mapMutations('projects/search/financials', [
      'setForceIndex'
    ]),
    async setBudgetCategoryDataInItems() {
      try {
        this.items.map(async item => {
          if (this.$h.dg(item, 'budget_category.ref.id')) {
            const ref = this.getBudgetCategoryRefFromID(item.budget_category.ref.id)
            const doc = await ref.get()

            if (doc.exists) {
              this.$set(item, 'budgetCategory', doc.data().code + ' - ' + doc.data().name)
              item.budget_category.ref = doc.data()
              item.budget_category.ref.ref = doc.ref
            }
          }
        })
      } catch (error) {
        throw new Error(error)
      }
    },
    applyFilters(item) {
      let response = true

      if (this.poNumberSearch) {
        response = item.number.includes(this.poNumberSearch)
      }

      return response
    },
    formatterCurrency(value) {
      let amount = this.$h.dg(value, 'amount', 0)

      return this.$options.filters.currency(amount);
    },
    openFormModal(item = null) {
      this.itemToEdit = item
      this.itemToEdit.projectNumber = this.projectNumber
      this.showForm = true
    },
    closeFormModal() {
      this.itemToEdit = null
      this.showForm = false
    },
    openDeleteForm(item) {
      if (!item.projectId || !item.ref) return

      this.itemToDelete = item
    },
    async deleteItem() {
      await this.itemToDelete.ref.delete()
      await this.updateFinancialTotalData(this.itemToDelete.projectId)
      this.itemToDelete = null
      this.projectId = null

      this.$emit('on-delete')
    },
    async updateFinancialTotalData(id) {
      const projectId = id || this.projectId

      if (!projectId) return
      
      let url = `${this.firebaseUrl}/api/projects/${projectId}/update-commitments`
      await axios.post(url)

      let url2 = `${this.firebaseUrl}/api/project/${projectId}/totals-calculator`
      await axios.post(url2)
    },
    updateItem() {
      this.itemToEdit = null
      this.showForm = false

      this.setForceIndex()
    },
    notifyError(e) {
      this.gettingData = false
      this.$snotify.error('Unexpected Error')
      throw new Error(e)
    },
    row_classes(item) {
      if (this.poNumbers.includes(item.number)) {
        return 'teal lighten-3'
      }
    },
    getBudgetCategoryRefFromID(id) {
      if (!id) return
      
      return db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('budgets')
        .collection('budget_categories')
        .doc(id)
    },
    customSort(items) {
      const itemsPerPage = 10
      if (items.length && this.poNumbers.length >= itemsPerPage) {
        return items
      }

      let firstElements = []
      let rest = []

      items.map(item => {
        if (this.poNumbers.includes(item.number)) {
          firstElements.push(item)
        } else {
          rest.push(item)
        }
      })

      return [ ...firstElements, ...rest ]
    }
  }
}
</script>

<style scoped>
.on-hover-list-item {
  background-color: #708a93;
  cursor: pointer;
  color: white !important;
}
.on-hover-list-item-title {
  color: white;
}
</style>

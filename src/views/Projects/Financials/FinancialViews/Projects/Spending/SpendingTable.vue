<template>
  <div>
    <v-data-table
      :items="items"
      :headers="headers"
      :options="pagination"
      :items-per-page="itemsPerPage"
      :page.sync="pagination.page"
      :server-items-length="totalItems"
      disable-filtering
      :footer-props="footerProps"
      :loading="gettingData"
    >
      <template v-for="header in headers.filter((header) => header.hasOwnProperty('formatter'))" v-slot:[`item.${header.value}`]="{ item }">
        {{ header.formatter(item) }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-menu offset-y>
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
    <spending-form
      v-if="showForm"
      @update="updateItem"
      @close="closeFormModal"
      :spending-to-edit="itemToEdit"
    ></spending-form>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'
import { mapGetters, mapState } from 'vuex'
import SpendingForm from './SpendingForm'

export default {
  name: 'SpendingTable',

  components: {
    SpendingForm
  },

  props: {
    poNumbers: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
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
      gettingData: true,
      orderBy: 'number',
      totalItems: 0,
      items: [],
      itemsRef: [],
      itemsPerPage: 30,
      itemToEdit: null,
      pagination: {
        page: 1,
        itemsPerPage: 30,
        pageCount: 0
      },
      footerProps: {
        itemsPerPageOptions: [ 30 ]
      },
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
    headers() {
      return [
        {
          text: 'Project',
          value: 'projectTitle',
          align: '',
          class: '',
          sortable: false,
          width: 300
        },
        {
          text: 'PO Number',
          value: 'number',
          align: '',
          class: '',
          sortable: false,
          width: 100
        },
        {
          text: 'Amount',
          value: 'amount',
          align: 'end',
          class: '',
          sortable: false,
          formatter: this.formatterCurrency
        },
        {
          text: 'Budget Category',
          value: 'budgetCategory',
          align: '',
          class: '',
          sortable: false,
          width: '200'
        },
        {
          text: 'Actions',
          value: 'actions',
          align: '',
          class: '',
          sortable: false,
          width: 120
        },
      ]
    }
  },

  watch: {
    pagination: {
      handler () {
        this.index()
      },
      deep: true,
    },
    poNumbers() {
      this.pagination.page = 1
      this.getInitData()
    }
  },

  created () {
    this.getTotalItemsCount()
        .then(this.index)
  },

  methods: {
    getInitData () {
      this.getTotalItemsCount()
        .then(this.index)
    },
    async index () {
      if (!this.$h.dg(this.currentCompany, 'id')) return

      try {
        if (!this.itemsRef.length) return

        const index = (this.pagination.page * this.itemsPerPage) - this.itemsPerPage
        const startAt = this.itemsRef[index]

        let query = null

        if (!this.poNumbers.length) {
          query = db.collectionGroup('spendings')
            .where('company_nid', '==', this.currentCompany.id)
            //.where('isCommitment', '==', true)
            .orderBy(this.orderBy)
            .startAt(startAt)
            .limit(this.itemsPerPage)
        } else if (this.poNumbers.length) {
          query = db.collectionGroup('spendings')
            .where('company_nid', '==', this.currentCompany.id)
            //.where('isCommitment', '==', true)
            .where('number', 'in', this.poNumbers)
        }

        const snap = await query.get()
        if (!snap.empty) {
          this.items = await Promise.all(snap.docs.map(doc => {
            return {
              id: doc.id,
              ref: doc.ref,
              ...doc.data()
            }
          }))
          this.setProjectDataInItems()
          this.setBudgetCategoryDataInItems()
        } else {
          this.items = []
        }
        this.gettingData = false
      } catch (error) {
        this.notifyError(error)
      }
    },
    async getTotalItemsCount () {
      if (!this.$h.dg(this.currentCompany, 'id')) return

      try {
        this.gettingData = true
        let query = null

        if (!this.poNumbers.length) {
          query = db.collectionGroup('spendings')
            .where('company_nid', '==', this.currentCompany.id)
            //.where('isCommitment', '==', true)
        } else if (this.poNumbers.length) {
          query = db.collectionGroup('spendings')
            .where('company_nid', '==', this.currentCompany.id)
            //.where('isCommitment', '==', true)
            .where('number', 'in', this.poNumbers)
        }

        const snap = await query.get()
        this.totalItems = snap.size
        this.itemsRef = snap.docs
      } catch (error) {
        this.notifyError(error)
      }
    },
    async setProjectDataInItems() {
      try {
        this.items.map(async item => {
          if (this.$h.dg(item, 'ref.path')) {
            const [, projectId ] = item.ref.path.split('/')
            if (projectId) {
              const { title = 'Undefined' } = (await db.collection('cpm_projects').doc(projectId).get()).data() || {}

              this.$set(item, 'projectTitle', title)
            }
          }
        })
      } catch (error) {
        throw new Error(error)
      }
    },
    async setBudgetCategoryDataInItems() {
      try {
        this.items.map(async item => {
          if (this.$h.dg(item, 'budget_category.ref.path')) {
            const path = item.budget_category.ref.path
            const doc = await db.doc(path).get()

            if (doc.exists) {
              item.budgetCategory = doc.data().code + ' - ' + doc.data().name
            }
          }
        })
      } catch (error) {
        throw new Error(error)
      }
    },
    formatterBudgetCategory(value) {
      if (!value) return

      const code = value.wbsElement
      let budgetCategory = code || 'Undefined'
      if (code) {
        budgetCategory += ' - ' + (this.budgetCategories.find(budgetCategory => budgetCategory.code === code) || {}).name || 'Undefined'
      }

      return budgetCategory
    },
    formatterCurrency(value) {
      let amount = this.$h.dg(value, 'amount', 0)

      return this.$options.filters.currency(amount);
    },
    openFormModal(item = null) {
      this.itemToEdit = item
      this.showForm = true
    },
    closeFormModal() {
      this.itemToEdit = null
      this.showForm = false
    },
    openDeleteForm(item) {
    },
    updateItem() {
      this.getInitData()
    },
    notifyError(e) {
      this.gettingData = false
      this.$snotify.error('Error unexpected')
      throw new Error(e)
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

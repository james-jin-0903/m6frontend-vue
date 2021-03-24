<template>
  <financial-form-modal
    @close="close"
  >
    <template #title>
      {{ action.title }}
    </template>
    <template #form>
      <div v-if="item">
        <v-autocomplete
          :items="projects"
          item-value="number"
          v-model="item.projectNumber"
          :filter="projectNumberFilter"
          :error="!!projectNumberErrors.length"
          :error-messages="projectNumberErrors"
          @change="getProjectByNumber"
          :disabled="isEditing"
          outlined
          hide-details
        >
          <template #label>
            Project Number
            <span class="error--text">
              *
            </span>
          </template>
          <template #selection="{ item }">
            <v-row>
              <v-col cols="3">{{ item.number }}</v-col>
              <v-col>{{ item.title }}</v-col>
            </v-row>
          </template>
          <template #item="{ item }">
            <v-row>
              <v-col cols="3">{{ item.number }}</v-col>
              <v-divider vertical></v-divider>
              <v-col>{{ item.title }}</v-col>
            </v-row>
          </template>
        </v-autocomplete>
        <template v-if="projectNumberErrors.length">
          <span
            class="caption red--text"
            v-for="(error, index) in projectNumberErrors"
            :key="index"
          >
            {{ error }}
          </span>
        </template>

        <v-text-field
          outlined
          class="my-3"
          v-model="item.number"
          :disabled="isEditing"
          hide-details
          :rules="[ rules.required ]"
        >
          <template #label>
            {{ financialNumberLabel }}
            <span class="error--text">
              *
            </span>
          </template>
        </v-text-field>

        <v-autocomplete
          class="mt-3"
          hide-details
          outlined
          :items="commitmentTypes"
          v-model="item.commit"
          :rules="[ rules.required ]"
        >
          <template #label>
            {{ financialTypeLabel }}
            <span class="error--text">
              *
            </span>
          </template>
        </v-autocomplete>
        
        <budget-category-select
          colClass=""
          hide-details
          outline
          requiredLabel
          :disabled="!!item.id"
          :category="item.budget_category"
          @newCategory="setBudgetCategory"
        ></budget-category-select>

        <v-card v-if="isEditing" class="mt-2 pa-3 light-blue lighten-5">
          <span class="font-weight-bold">Edit or Create Line Item</span>
          <v-autocomplete
            label="Line Item"
            placeholder="Search Line Item"
            :items="lineItems"
            single-line
            clearable
            :filter="lineItemsFilter"
            v-model="lineItemToEdit"
          >
            <template #selection="{ item }">
              <v-row>
                <v-col class="shrink">
                  {{ removeTimeStamp(item.startDateText) }}
                </v-col>
                <v-col>
                  {{ item.description }}
                </v-col>
                <v-col>
                  {{ item.amount | currency }}
                </v-col>
              </v-row>
            </template>
            <template #item="{ item }">
              <v-row>
                <v-col class="shrink">
                  {{ removeTimeStamp(item.startDateText) }}
                </v-col>
                <v-col>
                  {{ item.description }}
                </v-col>
                <v-col>
                  {{ item.amount | currency }}
                </v-col>
              </v-row>
            </template>
            <template #append-outer>
              <v-btn text @click="editLineItem()" v-if="!lineItemToEdit">
                <v-icon >
                  mdi-plus
                </v-icon>
                Create
              </v-btn>
            </template>
          </v-autocomplete>
          <commitment-line-item
            v-if="lineItemToEdit"
            :lineItemToEdit="lineItemToEdit"
            @close="lineItemToEdit = null"
            @change="onChangeLineItem"
          ></commitment-line-item>
        </v-card>

        <v-card v-if="isCreating && (lineItems || []).length" class="pa-3 mt-2 light-blue lighten-5">
          <span class="font-weight-bold">Create Line Items</span>
          <v-row 
            v-for="(lineItem, index) in lineItems"
            :key="index + 'lineItem'"
            class="align-end mb-2"
          >
            <v-col cols="12 py-0 caption font-weight-bold">
              Line Item {{ index + 1 }}
            </v-col>
            <v-col class="py-0">
              <date-picker
                :menu="lineItem.menu"
                @on-change="(dates) => onPickerChange(lineItem, dates)"
              ></date-picker>
            </v-col>
            <v-col class="py-0">
              <v-textarea
                label="Description"
                v-model="lineItem.description"
                rows="1"
                auto-grow
                clearable
                dense
                counter
                maxlength="65"
              ></v-textarea>
            </v-col>
            <v-col class="py-0">
              <vuetify-money
                class="light-blue lighten-5"
                outline
                v-model="lineItem.amount"
                label="Amount"
                :options="options"
                dense
              />
            </v-col>
            <v-col class="pa-0" cols="2">
              <v-icon
                @click="addLineItem"
              >
                mdi-plus-circle-outline
              </v-icon>
              <v-icon
                v-if="index !== 0"
                @click="removeLineItem(index)"
              >
                mdi-minus-circle-outline
              </v-icon>
            </v-col>
          </v-row>
        </v-card>

        <vuetify-money
          outlined
          class="my-4"
          v-model="amount"
          label="Amount"
          :options="options"
          disabled
          dense
          hide-details
        />

        <v-textarea
          outlined
          label="Description"
          v-model="item.description"
          auto-grow
          rows="2"
        ></v-textarea>
      </div>
    </template>
    <template #actions>
      <v-spacer></v-spacer>
        <v-btn @click="close" class="mr-2">Cancel</v-btn>
        <v-btn 
          @click="action.onSave()" 
          color="primary" 
          :disabled="disableActionButton"
          :loading="loading"
        >
          {{ action.button }}
        </v-btn>
    </template>
  </financial-form-modal>
</template>

<script>
import { db } from '@/utils/Firebase'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import axios from 'axios'
import BudgetCategorySelect from '@/modules/cpm/components/projects/_partials/BudgetCategorySelect'
import DatePicker from '../Components/DatePicker'
import CommitmentLineItem from '../Components/CommitmentLineItem'
import FinancialFormModal from '../Components/FinancialFormModal'

const DEFAULT_LINE_ITEM = {
  amount: 0,
  description: '',
  date: '',
  menu: false
}

export default {
  name: 'CommitmentForm',

  components: {
    BudgetCategorySelect,
    DatePicker,
    CommitmentLineItem,
    FinancialFormModal
  },

  props: {
    commitmentToEdit: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      loading: false,
      lineItemToEdit: null,
      firebaseUrl: process.env.VUE_APP_FIREBASE_APIURL,
      projectNumberErrors: [],
      financialName: 'Commitment',
      lineItems: [ 
        {
          amount: 0,
          description: '',
          date: '',
          menu: false
        }
      ],
      item: {},
      options: {
        locale: 'en-US',
        decimal: '.',
        thousands: ',',
        prefix: '$',
        suffix: '',
        length: 12,
        precision: 2
      },
      project: null,
      rules: {
        required: (v) => !!v
      }
    }
  },

  computed: {
    ...mapState('projects', [
      'projects'
    ]),
    ...mapGetters('projects/settings', {
      commitmentTypes: 'commitments/types'
    }),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    amount() {
      return this.lineItems.reduce((amount, lineItem) => {
        return amount + parseFloat(this.$h.dg(lineItem, 'amount', 0))
      }, 0)
    },
    action() {
      let action = {
      }

      if (this.item.id) {
        action = {
          title: `Update ${ this.financialName }`,
          button: 'Update',
          onSave: this.updateItem
        }
      } else {
        action = {
          title: `Create ${ this.financialName }`,
          button: 'Create',
          onSave: this.createItem
        }
      }

      return action
    },
    financialNumberLabel () {
      return `${ this.financialName } Number`
    },
    financialTypeLabel () {
      return `${ this.financialName } Type`
    },
    isCreating () {
      return !this.$h.dg(this.$h.dg(this.item, 'id'))
    },
    isEditing () {
      return !this.isCreating 
    },
    disableActionButton () {
      let disable = false

      if (
        !this.$h.dg(this.item, 'projectNumber') ||
        !this.$h.dg(this.item, 'number') ||
        !this.$h.dg(this.item, 'commit') ||
        !this.$h.dg(this.item, 'budget_category')
      ) {
        disable = true
      }

      return disable
    }
  },

  created() {
    if (!(this.commitmentTypes || []).length) {
      this.getCommitmentTypes({
        companyId: this.$h.dg(this.currentCompany, 'id')
      })
    }

    if ((this.commitmentToEdit || {}).id) {
      this.setDataToEdit()
    }

    if (!(this.projects || []).length) {
      this.getProjects({
        companyId: this.currentCompany.id
      })
    }
  },

  methods: {
    ...mapActions('projects/settings', {
      getCommitmentTypes: 'commitments/getTypes'
    }),
    ...mapActions('projects', {
      getProjects: 'getProjects'
    }),
    ...mapMutations('projects/search/financials', [
      'setForceIndex'
    ]),
    async setDataToEdit() {
      try {
        this.item = { ...this.commitmentToEdit }
        this.getLineItemsByCommitmentRef(this.commitmentToEdit.ref)
      } catch (error) {
        throw new Error(error)
      }
    },
    async updateItem() {
      try {
        this.loading = true
        const item = { ...this.item }
        
        if (item.ref) {
          delete item.ref
        }

        if (item.budget_category) {
          delete item.budget_category
        }

        await this.commitmentToEdit.ref.update(item)
        await this.updateFinancialTotalData(item.projectId)
        this.loading = false
        this.$emit('update')
      } catch (error) {
        this.loading = false
        throw new Error(error)
      }
    },
    async getProjectByNumber () {
      const number = (this.item.projectNumber || '').trim()
      this.projectNumberErrors = []

      if (number) {
        const collectionRef = db.collection('cpm_projects')
        const options = {
          where: ['number', '==', number]
        }

        this.project = (await this.$h.ffGetDocs({
          collectionRef,
          options
        }))[0]

        this.item.projectNumber = this.$h.dg(this.project, 'number')
      }
      
      if (!this.project) {
        this.projectNumberErrors = [ `Project doesn't exists` ]
      }
    },
    async createItem() {
      try {
        this.loading = true
        const batch = db.batch()
        const commitmentRef = db.collection('cpm_projects')
          .doc(this.project.id)
          .collection('commitments')
          .doc()
        
        this.lineItems.map(async lineItem => {
          const lineItemRef = commitmentRef.collection('line_items').doc()
          batch.set(lineItemRef, lineItem)
        })

        const item = { 
          ...this.item,
          ...(this.$h.dg(this.item, 'budget_category.ref.id') && { budget_category: {
            ref: this.getBudgetCategoryRefFromID(this.item.budget_category.ref.id)
          }})
        }

        item.company_nid = this.currentCompany.id
        item.isCommitment = true
        
        if (item.ref) {
          delete item.ref
        }

        batch.set(commitmentRef, item)

        await batch.commit()
        await this.updateFinancialTotalData()
        this.loading = false

        this.$emit('on-financial-update')
      } catch (error) {
        this.loading = false
        throw new Error(error)
      }
    },
    close() {
      this.$emit('close')
    },
    notifyError (e) {
      this.$snotify.error('Unexpected Error')
      throw new Error(e)
    },
    addLineItem () {
      this.lineItems.push({ ...DEFAULT_LINE_ITEM })
    },
    removeLineItem(index) {
      this.lineItems.splice(index, 1)
    },
    async updateFinancialTotalData(id) {
      const projectId = id || this.$h.dg(this.project, 'id')

      if (!projectId) return

      const urlToupdateCommitments = `${this.firebaseUrl}/api/projects/${projectId}/update-commitments`
      const urlToupdateTotals = `${this.firebaseUrl}/api/project/${projectId}/totals-calculator`

      await Promise.all([
        axios.post(urlToupdateCommitments),
        axios.post(urlToupdateTotals)
      ])
    },
    async getLineItemsByCommitmentRef(commitmentRef) {
      if (!commitmentRef) return

      const collectionRef = commitmentRef.collection('line_items')

      this.lineItems = await this.$h.ffGetDocs({
        collectionRef
      })
    },
    setBudgetCategory({ id: budgetCategoryID } = {}) {
      if (!budgetCategoryID) return

      this.item.budget_category = {
        ref: this.getBudgetCategoryRefFromID(budgetCategoryID)
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
    onPickerChange(lineItem, { usaDateFormat: startDateText = '', timestamp } = {}) {
      lineItem.startDate = timestamp
      lineItem.startDateText = startDateText
    },
    lineItemsFilter (item, queryText) {
      const description = item.description.toLowerCase()
      const date = item.startDateText
      const searchText = queryText.toLowerCase()

      return description.indexOf(searchText) > -1 ||
        date.indexOf(searchText) > -1
    },
    editLineItem(lineItem = DEFAULT_LINE_ITEM) {
      this.lineItemToEdit = lineItem
    },
    async onChangeLineItem({ lineItem, action} = {}) {
      try {
        const commitmentRef = this.commitmentToEdit.ref

        switch (action) {
          case 'save':
            if(lineItem.id) {
              await commitmentRef.collection('line_items').doc(lineItem.id).update(lineItem)
            } else {
              await commitmentRef.collection('line_items').add(lineItem)
            }
            this.$snotify.success('Saved')
            break;

          case 'delete':
            await commitmentRef.collection('line_items').doc(lineItem.id).delete()
            this.$snotify.success('Deleted')
            break;
        
          default:
            break;
        }
      
      this.lineItemToEdit = null
      this.getLineItemsByCommitmentRef(commitmentRef)
      this.updateFinancialTotalData(this.commitmentToEdit.projectId)
      this.setForceIndex()
      } catch (error) {
        this.notifyError(error)
      }
    },
    projectNumberFilter(item, queryText, itemText) {
      const number = item.number.toLowerCase()
      const title = item.title.toLowerCase()
      const searchText = queryText.toLowerCase()

      return number.indexOf(searchText) > -1 ||
        title.indexOf(searchText) > -1
    },
    removeTimeStamp(date = '') {
      return date.split(' ')[0]
    }
  }
}
</script>

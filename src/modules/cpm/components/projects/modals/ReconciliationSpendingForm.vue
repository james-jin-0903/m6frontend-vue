<template>
  <v-dialog
    persistent
    scrollable
    :value="true"
    :width="800"
    @input="closeDialog"
  >
    <v-card>
      <v-card-title class="card-title display-1 primary white--text">
        <v-row>
          <v-col cols="12">
            <v-icon
              class="icon-close"
              large
              light
              @click="closeDialog"
            >
              mdi-close
            </v-icon>
          </v-col>
          <v-col
            class="text-center"
            cols="12"
          >
            {{ $t('cpm.projects.createSpending') }}
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="vertical-scroll">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="spending.number"
              :loading="!spending.number"
              outline
              :rules="[rules.required]"
            >
              <template v-slot:label>
                <span>{{ $t('general.invoiceNumber') }}</span>
                <span class="error--text"> *</span>
              </template>
            </v-text-field>

            <v-text-field
              v-model="commitment.number"
              disabled
              outline
            >
              <template v-slot:label>
                <span>{{ $tc('cpm.projects.commitment', 1) }}</span>
                <span class="error--text"> *</span>
              </template>
            </v-text-field>

            <budget-category-select
              :category="spending.budget_category"
              :errors="budgetCategoryErrors"
              outline
              required-label
              @newCategory="setBudgetCategory"
            />

            <v-text-field
              v-model="spending.dateOpened"
              clearable
              :label="$t('general.dateOpened')"
              outline
              type="date"
            />

            <v-text-field
              v-model="spending.paidDate"
              clearable
              :label="$t('general.dateOpened')"
              outline
              type="date"
            />

            <v-textarea
              v-model="spending.description"
              auto-grow
              :label="$t('general.description')"
              outline
              :rows="3"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          color="primary"
          @click="createSpending"
        >
          {{ $t('general.create') }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <M6Loading
      :loading="showLoading"
    />
  </v-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'
import { mapState, mapActions } from 'vuex'
import BudgetCategorySelect from '../_partials/BudgetCategorySelect'

export default {
  name: 'ReconciliationSpendingForm',

  components: {
    BudgetCategorySelect
  },

  props: {
    commitment: {
      type: Object,
      default: null,
      required: true
    }
  },

  data() {
    return {
      formWasValidated: false,
      gettingSpendingNumber: true,
      projectId: '',
      rules: {
        required: v => !!v || this.$t('rules.required')
      },
      showLoading: false,
      spending: {
        budget_category: {
          ref: ''
        }
      }
    }
  },

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    budgetCategoryErrors() {
      if (
        this.formWasValidated &&
          !this.$h.dg(this.spending, 'budget_category.ref')
      ) {
        return this.$t('rules.required')
      }
      return []
    },
    loadingSpendingNumber() {
      return Boolean(
        !this.spending.number || !this.gettingSpendingNumber
      )
    }
  },

  created() {
    this.updateProjectId()
      .finally(() => this.gettingSpendingNumber = false)
    this.projectId = this.$route.params.id
  },

  methods: {
    ...mapActions('companies/cpmProjects/spendings', [
      'create'
    ]),
    async createSpending() {
      try {
        this.formWasValidated = true
        if (!this.$h.dg(this.spending, 'budget_category.ref')) {
          this.$snotify.warning(
            `${this.$t('general.pleaseSelectResource', {
              resource: this.$tc('cpm.projects.budgetCategory')
            })}`
          )
          return
        }
        this.showLoading = true
        const spending = this.parseFormData()

        await this.create({
          projectId: this.projectId,
          spending
        })
        this.$snotify.success(this.$t('alerts.successfullyCreated'))
        this.$emit('refresh')
      } catch (error) {
        console.error(error)
        this.$snotify.error(this.$t('alerts.unexpectedError'))
      } finally {
        this.showLoading = false
      }
    },
    parseFormData() {
      if (!this.$h.dg(this.commitment, 'id')) {
        throw new Error('Commitment ID is missing')
      }

      return {
        ...this.spending,
        amount: 0,
        date: new Date().toISOString(),
        commitment: db.collection('cpm_projects')
          .doc(this.projectId)
          .collection('commitments')
          .doc(this.commitment.id),
        dateOpenedText: this.getFormattedDate(this.spending.dateOpened),
        paidDateText: this.getFormattedDate(this.spending.paidDate)
      }
    },
    getFormattedDate(date, format = 'MM/DD/YYYY') {
      if (!date) return ''

      return this.$moment(date).format(format)
    },
    setBudgetCategory(budgetCategory) {
      this.formWasValidated = false
      if (this.$h.dg(budgetCategory, 'id')) {
        this.spending.budget_category.ref = db
          .collection('settings')
          .doc(this.currentCompany.id)
          .collection('settings')
          .doc('budgets')
          .collection('budget_categories')
          .doc(budgetCategory.id)
      }
      this.spending.costCode = this.$h.dg(budgetCategory, 'code', '')
      this.spending.costCodeNumber = this.$h.dg(budgetCategory, 'code', '')
      this.spending.costCodeText = this.$h.dg(budgetCategory, 'name', '')
    },
    closeDialog() {
      this.$emit('close')
    },
    updateProjectId() {
      return new Promise((resolve, reject) => {
        try {
          const projectRef = db.collection('cpm_projects').doc(this.$route.params.id)
          projectRef.get().then(async doc => {
            const data = await doc.data()
            const invoiceNumber = this.$h.dg(data, 'nextInvoiceNumber', '')
            await projectRef.update({
              nextInvoiceNumber: parseInt(invoiceNumber) + 1
            })
            let idString = '00000' + invoiceNumber
            const year = new Date().getFullYear()
            idString = idString.substr(idString.length - 5)
            this.$set(this.spending, 'number', `INV-${idString}-${year}`)
            resolve(true)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .card-title {
    display: block;
  }
</style>

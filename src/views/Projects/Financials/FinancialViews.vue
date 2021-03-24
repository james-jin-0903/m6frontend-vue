<template>
  <div>
    <v-row class="align-center">
      <v-col class="shrink">
        <v-btn
          class="mr-2"
          color="#0277BD"
          dark
          fab
          small
          @click="close"
        >
          <v-icon
            light
            size="20"
          >
            mdi-keyboard-return
          </v-icon>
        </v-btn>
      </v-col>
      <v-col class="shrink">
        <v-select
          solo
          hide-details
          flat
          background-color="grey lighten-3"
          append-icon="mdi-chevron-down"
          :items="views"
          item-text="text"
          item-value="value"
          v-model="view"
        >
          <template #selection="{ item }">
            <span class="headline font-weight-bold select__financial">{{ item.text }}</span>
          </template>
        </v-select>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="3">
        <v-combobox
          label="Search by Project Name or Number"
          hide-selected
          v-model="searchTerms"
          multiple
          persistent-hint
          small-chips
          clearable
          deletable-chips
          outlined
          dense
          hide-details
        >
        <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  Press <kbd>enter</kbd> to search Project By Title or Number
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-combobox>
      </v-col>
      <v-col cols="3">
        <v-combobox
          v-model="poNumbers"
          :search-input.sync="search"
          hide-selected
          label="Search by PO Number"
          multiple
          persistent-hint
          small-chips
          clearable
          deletable-chips
          outlined
          dense
          hide-details
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  Press <kbd>enter</kbd> to search by PO Number
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-combobox>
      </v-col>
      <v-col class="shrink">
        <v-btn
          class="mr-10"
          color="#0277BD"
          dark
          fab
          small
          @click="openForm"
          :disabled="viewingSpending"
        >
          <v-icon
            light
            size="20"
          >
            mdi-plus
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <projects-table
      :po-numbers="poNumbers"
      :search-terms="searchTerms"
      :financial-type="view"
      ref="projectsTableRef"
    ></projects-table>
    <component 
      :is="formComponent"
      @close="closeForm"
      @on-financial-update="onFinancialUpdate"
    ></component>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import CommitmentsTable from './FinancialViews/Projects/Commitments/CommitmentsTable'
import CommitmentForm from './FinancialViews/Projects/Commitments/CommitmentForm'
import SpendingTable from './FinancialViews/Projects/Spending/SpendingTable'
import SpendingForm from './FinancialViews/Projects/Spending/SpendingForm'
import ProjectsTable from './FinancialViews/Projects/ProjectsTable'

export default {
  name: 'POView',

  components: {
    CommitmentForm,
    CommitmentsTable,
    SpendingForm,
    SpendingTable,
    ProjectsTable
  },

  data () {
    return {
      searchTerms: [],
      formComponent: null,
      poNumbers: [],
      view: 'commitments',
      views: [
        {
          value: 'commitments',
          text: 'Commitments'
        },
        {
          value: 'spendings',
          text: 'Spending'
        }
      ],
      search: ''   
    }
  },

  computed: {
    ...mapGetters('projects/settings/budgetCategories', [
      'budgetCategories'
    ]),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    switchButton () {
      return {
        text: this.viewingCommitment ? 'Switch to Spending View' : 'Switch to Commitments View'
      }
    },
    viewingCommitment () {
      return this.view === 'commitments'
    },
    viewingSpending () {
      return this.view === 'spendings'
    }
  },

  created() {
    if (!(this.budgetCategories || []).length) {
      this.getBudgetCategories({
        companyId: this.$h.dg(this.currentCompany, 'id')
      })
    }
  },

  methods: {
    ...mapActions('projects/settings/budgetCategories', [
      'getBudgetCategories'
    ]),
    openForm () {
      switch (this.view) {
        case 'commitments':
          this.formComponent = 'CommitmentForm'
          break

        case 'spendings':
          this.formComponent = 'SpendingForm'
          break
        default:
          this.formComponent = null
          break
      }
    },
    closeForm () {
      this.formComponent = null
    },
    toggleView () {
      if (this.viewingCommitment) {
        this.view = 'spendings'
      } else if (this.viewingSpending) {
        this.view = 'commitments'
      }
    },
    close () {
      this.$emit('close')
    },
    onFinancialUpdate () {
      this.formComponent = null
      this.$refs.projectsTableRef.index()
    }
  }
}
</script>

<style lang="scss" scoped>
.select__financial {
  color: #303fe1;
}
</style>

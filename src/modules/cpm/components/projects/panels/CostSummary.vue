<template>
  <v-col
    class="cpm-panel"
    cols="12"
  >
    <v-card class="elevation-0 rounded-lg">
      <v-card-text class="vertical-scroll">
        <div class="stats-container">
          <div class="knob-container">
            <knob-custom
              :knob-title="$t('cpm.projects.budget')"
              :max="totals.budgetTotal"
              primary-color="#19949E"
              :size="150"
              text-color="#19949E"
              :value="totals.commitmentTotal"
              :value-display-function="formatCurrency"
              :value-to-display="totals.budgetTotal"
            />
            <p class="total-text">
              {{ $t('cpm.costSummary.vs') }} <br>
              {{ $t('cpm.costSummary.committed') }} <br>
              {{ formatCurrency(totals.commitmentTotal) }}
            </p>
          </div>

          <div class="knob-container">
            <knob-custom
              :knob-title="$t('cpm.costSummary.committed')"
              :max="totals.commitmentTotal"
              primary-color="#95C025"
              :size="150"
              text-color="#95C025"
              :value="totals.spendingTotal"
              :value-display-function="formatCurrency"
              :value-to-display="totals.commitmentTotal"
            />
            <p class="total-text">
              {{ $t('cpm.costSummary.vs') }} <br>
              {{ $t('cpm.costSummary.spending') }} <br>
              {{ formatCurrency(totals.spendingTotal) }}
            </p>
          </div>

          <div class="knob-container">
            <knob-custom
              :knob-title="$t('cpm.costSummary.contingency')"
              :max="totals.budgetContingencyTotal"
              primary-color="#2F7BBE"
              :size="150"
              text-color="#2F7BBE"
              :value="totals.changesTotal"
              :value-display-function="formatCurrency"
              :value-to-display="totals.budgetContingencyTotal"
            />
            <p class="total-text">
              {{ $t('cpm.costSummary.vs') }} <br>
              {{ $t('cpm.pendingBulletins') }} <br>
              {{ formatCurrency(totals.changesTotal) }}
            </p>
          </div>

          <div class="knob-container">
            <knob-custom
              :knob-title="$t('cpm.projects.budget')"
              :max="totals.budgetTotal"
              primary-color="#F78C07"
              :size="150"
              text-color="#F78C07"
              :value="totals.totalAllocated + totals.changesTotal"
              :value-display-function="formatCurrency"
              :value-to-display="totals.budgetTotal"
            />
            <p class="total-text">
              {{ $t('cpm.costSummary.vs') }} <br>
              {{ $t('cpm.costSummary.projectFinalCost') }} <br>
              {{ formatCurrency(totals.totalAllocated + totals.changesTotal) }}
            </p>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { db } from '@/utils/Firebase'
import KnobCustom from './KnobCustom/KnobCustom'
import Helpers from '../../Helpers'
import FirebaseReportComponent from './FirebaseReportComponent.vue'

export default {
  name: 'CostSummary',
  components: {
    'knob-custom': KnobCustom
  },

  extends: FirebaseReportComponent,

  props: {
    dateRule: {
      type: Object,
      default: () => ({
        month: null,
        year: ''
      })
    },
    tableTotals: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      project: {
        totals: {
          budgetContingencyTotal: 0,
          budgetTotal: 0,
          changesTotal: 0,
          commitmentTotal: 0,
          projectFinalCost: 0,
          spendingContingencyTotal: 0,
          spendingTotal: 0,
          totalAllocated: 0
        }
      },
      projectRef: db.collection('cpm_projects').doc(this.$route.params.id),
      budget: {},
      budgetRef: {},
      lineItems: [],
      budgetExists: false,
      categories: [],
      budgetCategories: [],
      spendingList: [],
      activeBudgets: [],
      budgetContingencyTotal: 0
    }
  },

  firestore() {
    const projectRef = db.collection('cpm_projects').doc(this.$route.params.id)
    return {
      project: projectRef,
      spendingList: db
        .collection('cpm_projects')
        .doc(this.$route.params.id)
        .collection('spendings')
        .where('contingency', '==', true),
      activeBudgets: db
        .collection('cpm_projects')
        .doc(this.$route.params.id)
        .collection('budgets')
        .where('active', '==', true)
    }
  },
  computed: {
    totals() {
      const totals = {
        budgetContingencyTotal: 0,
        budgetTotal: 0,
        changesTotal: 0,
        commitmentTotal: 0,
        projectFinalCost: 0,
        spendingContingencyTotal: 0,
        spendingTotal: 0,
        totalAllocated: 0
      }

      if (this.project.totals) {
        Object.keys(totals).forEach(total => {
          if (this.project.totals[total]) {
            totals[total] = this.project.totals[total]
          }
        })
      }

      return totals
    }
  },
  methods: {
    formatCurrency(value = '0') {
      return Helpers.formatCurrency(Math.ceil(value)).split('.')[0]
    }

  }
}
</script>

<style lang="scss">
.knob-control__text-display {
  font-size: 0.9em !important;
}

.cpm-panel {
  margin-bottom: 10px;
}

.stats-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

p.total-text {
  padding: 0 10px;
  font-size: 14px;
  text-align: center;
  color: grey;
}

div.knob-container {
  text-align: center;
}
</style>

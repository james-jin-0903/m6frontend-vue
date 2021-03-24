<template>
  <v-container fluid>
    <v-row class="white--text title primary pa-3">
      Financials
    </v-row>
    <v-row v-if="projectId" :key="number">
      <financial-cost-summary :pid="projectId"></financial-cost-summary>
    </v-row>
  </v-container>
</template>

<script>
import FinancialCostSummary from '@/modules/cpm/components/projects/panels/FinancialCostSummary'

export default {
  name: 'FinancialPanels',

  components: {
    FinancialCostSummary
  },

  props: {
    projectId: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      number: 0
    }
  },

  watch: {
    projectId() {
      this.number++
    }
  }
}
</script>

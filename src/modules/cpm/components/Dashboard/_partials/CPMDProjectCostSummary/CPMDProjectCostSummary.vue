<template>
  <v-col
    cols="12"
    style="min-height: 300px"
  >
    <v-card
      class="elevation-0 white"
    >
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">Cost Summary</span>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-card-text class="vertical-scroll white">
        <v-data-table
          :headers="headers"
          :items="companiesCpmProjects"
          :rows-per-page-items="[]"
        >
          <template v-slot:items="{ index, item }">
            <c-p-m-d-project-cost-summary-item
              :key="(new Date()).getTime() + index"
              :item="item"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import CPMDProjectCostSummaryItem from './CPMDProjectCostSummaryItem'

export default {
  name: 'CPMDProjectCostSummary',

  components: { CPMDProjectCostSummaryItem },

  props: {
    companiesCpmProjects: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    headers: [
      { text: '', sortable: false },
      { text: 'Project', value: 'title' },
      { text: 'Start Date', value: 'startDate' },
      { text: 'End Date', value: 'endDate' },
      { text: 'Budget', value: 'totalBudgets' },
      { text: 'Commitments', value: 'totalCommitments' },
      { text: 'Spending', value: 'totalSpendings' },
      { text: 'Total Allocated', value: 'totalAllocated' },
      { text: 'PFC', value: 'totalCost' },
      { text: 'Variance', value: 'variance' },
      { text: 'Status', value: 'status' }
    ]
  })
}
</script>


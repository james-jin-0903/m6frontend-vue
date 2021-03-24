<template>
  <tr>
    <td class="px-0">
      <v-img
        contain
        height="50"
        :src="item.projectImage"
        width="50"
      />
    </td>
    <td>
      <div
        style="min-width: 200px"
        v-text="item.title || 'N/A'"
      />
    </td>
    <td v-text="formatDate(item.startDate)" />
    <td v-text="formatDate(item.endDate)" />
    <td
      class="text-right"
      v-text="totalBudgets"
    />
    <td
      class="text-right"
      v-text="totalCommitments"
    />
    <td
      class="text-right"
      v-text="totalSpendings"
    />
    <td
      class="text-right"
      v-text="totalAllocated"
    />
    <td
      class="text-right"
      v-text="totalCost"
    />
    <td
      class="text-right"
      v-text="variance"
    />
    <td>
      <v-row
        align="center"
        class="fill-height"

        style="width: 85px"
      >
        <v-icon
          :color="item.priority"
          style="margin-left: -4px"
        >
          fiber_manual_record
        </v-icon>

        <span>
          {{ item.status || 'N/A' }}
        </span>
      </v-row>
    </td>
  </tr>
</template>

<script>
import format from 'date-fns/format'
import { mapActions } from 'vuex'

export default {
  name: 'CPMDProjectCostSummaryItem',

  props: {
    item: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    totalAllocatedRaw: 0,
    totalBudgetsRaw: 0,
    totalCommitmentsRaw: 0,
    totalCostRaw: 0,
    totalSpendingsRaw: 0,
    varianceRaw: 0
  }),

  computed: {
    totalAllocated() {
      return (
        this.item.totalAllocated || this.totalAllocatedRaw
      ).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    },

    totalBudgets() {
      return (this.item.totalBudgets || this.totalBudgetsRaw).toLocaleString(
        'en-US',
        { style: 'currency', currency: 'USD' }
      )
    },

    totalCommitments() {
      return (
        this.item.totalCommitments || this.totalCommitmentsRaw
      ).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    },

    totalCost() {
      return (this.item.totalCost || this.totalCostRaw).toLocaleString(
        'en-US',
        { style: 'currency', currency: 'USD' }
      )
    },

    totalSpendings() {
      return (
        this.item.totalSpendings || this.totalSpendingsRaw
      ).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
    },

    variance() {
      return (this.item.variance || this.varianceRaw).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
    }
  },

  created() {
    if (this.item.variance === undefined) {
      this.showCompaniesCpmProjectsCostSummary({
        projectId: this.item.id
      }).then(({ data }) => {
        this.totalAllocatedRaw = this.item.totalAllocated =
          data.totalAllocated || 0

        this.totalBudgetsRaw = this.item.totalBudgets = data.totalBudgets || 0

        this.totalCommitmentsRaw = this.item.totalCommitments =
          data.totalCommitments || 0

        this.totalSpendingsRaw = this.item.totalSpendings =
          data.totalSpendings || 0

        this.item.totalCost = data.totalChanges || 0

        this.totalCostRaw = this.item.totalCost += data.totalAllocated || 0

        this.varianceRaw = this.item.variance =
          (this.item.totalBudgets || this.totalBudgetsRaw) -
          (this.item.totalCost || this.totalCostRaw)
      })
    }
  },

  methods: {
    ...mapActions('companies/cpmProjects/costSummary', {
      showCompaniesCpmProjectsCostSummary: 'show'
    }),

    formatDate(date) {
      if (!date) return 'N/A'

      return format(date, 'MM/DD/YYYY')
    }
  }
}
</script>


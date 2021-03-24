<template>
  <v-dialog
    v-model="show"
    max-width="800px"
    persistent
  >
    <v-card>
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1 text-center w-full">
          Budget Settings
        </span>
        <portal-target :name="`budget-${tab}`" />
      </v-card-title>
      <v-divider class="grey lighten-3" />
      <v-tabs
        v-model="tab"
        centered
        color="primary"
        fixed-tabs
      >
        <v-tab>Budget Status</v-tab>
        <v-tab>Cost Codes</v-tab>
        <v-tab>Budget Types</v-tab>
        <v-tab>Budget Line Items</v-tab>
      </v-tabs>

      <v-card-text
        class="pa-0 vertical-scroll"
        :style="{ height: getViewPortHeight }"
      >
        <v-container
          class="pa-0 rounded-lg"
          fluid
        >
          <div v-if="tab === 0">
            <budget-status :included="true" />
          </div>
          <div v-if="tab === 1">
            <budget-categories :included="true" />
          </div>
          <div v-if="tab === 2">
            <budget-types :included="true" />
          </div>
          <div v-if="tab === 3">
            <budget-line :included="true" />
          </div>
        </v-container>
      </v-card-text>

      <v-divider />
      <m6-loading :loading="showLoading" />
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="gray"
          text
          @click="$emit('close')"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import BudgetStatus from '../../settings/components/settings/BudgetStatus'
import BudgetCategories from '../../settings/components/settings/BudgetCategories'
import BudgetTypes from '../../settings/components/settings/BudgetTypes'
import BudgetLine from '../../settings/components/settings/BudgetLine'
export default {
  components: {
    'budget-status': BudgetStatus,
    'budget-categories': BudgetCategories,
    'budget-types': BudgetTypes,
    'budget-line': BudgetLine
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tab: 0,
      showLoading: false,
      viewPortHeight:
        Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        ) * 0.6
    }
  },
  computed: {
    getViewPortHeight() {
      return `${this.viewPortHeight}px`
    }
  }
}
</script>

<style lang="sass">
$dialog-max-height: 70%
</style>

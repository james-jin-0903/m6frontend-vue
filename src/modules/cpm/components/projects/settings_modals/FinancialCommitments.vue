<template>
  <v-dialog
    v-model="show"
    max-width="800px"
    persistent
  >
    <v-card>
      <v-card-title
        class="grey--text headline text--darken-1 white"
      >
        <div class="py-2 text-center w-full">
          Commitment Settings
        </div>
        <v-spacer />

        <portal-target :name="`commitments-${tab}`" />
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-tabs
        v-model="tab"
        centered
        class="capitalize mx-0"
        color="primary"
        fixed-tabs
      >
        <v-tab>Commitment Status</v-tab>
        <v-tab>Commitment Types</v-tab>
      </v-tabs>

      <v-card-text
        class="pa-0 vertical-scroll"
        :style="{ height: getViewPortHeight }"
      >
        <v-container
          class="pa-6 rounded-lg"
          fluid
        >
          <div v-if="tab == 0">
            <commitments-status :included="true" />
          </div>
          <div v-if="tab == 1">
            <commitments-types :included="true" />
          </div>
        </v-container>
      </v-card-text>

      <v-divider />
      <m6-loading :loading="showLoading" />
      <v-card-actions class="px-6 py-4">
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
import CommitmentsStatus from '../../settings/components/settings/CommitmentsStatus'
import CommitmentsTypes from '../../settings/components/settings/CommitmentsTypes'

export default {
  components: {
    'commitments-status': CommitmentsStatus,
    'commitments-types': CommitmentsTypes
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

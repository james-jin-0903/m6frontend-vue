<template>
  <m6-card-dialog title="Forecasts">
    <v-expansion-panel
      v-if="capitalPlans && capitalPlans.length"
    >
      <v-expansion-panel-content
        v-for="capitalPlan in capitalPlans"
        :key="capitalPlan.id"
      >
        <template v-slot:header>
          <div>{{ capitalPlan.name }}</div>
        </template>
        <v-card>
          <spendings-and-forecasted
            :capital-plan-prop="capitalPlan"
          />
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </m6-card-dialog>
</template>

<script>
import axios from 'axios'
import SpendingsAndForecasted from '@/components/cpm/capital/panels/SpendingsAndForecastedPlanned'

export default {
  name: 'Forecasts',

  components: {
    SpendingsAndForecasted
  },

  data() {
    return {
      capitalPlans: []
    }
  },

  mounted() {
    this.getCapitalPlans()
  },

  methods: {
    async getCapitalPlans() {
      const projectId = this.$route.params.id
      await this.axios.post(`${process.env.VUE_APP_FIREBASE_APIURL}/api/projects/${projectId}/capital-plans/`)
        .then(response => {
          this.capitalPlans = this.$h.dg(response, 'data', [])
        })
        .catch(console.error)
    }
  }
}
</script>

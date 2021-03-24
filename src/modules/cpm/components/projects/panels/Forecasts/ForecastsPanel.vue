<template>
  <m6-card-dialog title="Forecasts">
    <v-row>
      <v-col cols="12">
        <forecasts-table
          :tasks="tasks"
        />
      </v-col>
      <v-col cols="12">
        <forecasts-chart-budgets-by-month
          v-if="tasks.length"
          :tasks="tasks"
        />
      </v-col>
      <v-col cols="12">
        <forecasts-chart-gantt
          v-if="tasks.length"
          :tasks="tasks"
        />
      </v-col>
    </v-row>
  </m6-card-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ForecastsChartBudgetsByMonth from './ForecastsChartBudgetsByMonth'
import ForecastsChartGantt from './ForecastsChartGantt'
import ForecastsTable from './ForecastsTable'
export default {
  name: 'ForecastsPanel',

  components: {
    ForecastsChartBudgetsByMonth,
    ForecastsChartGantt,
    ForecastsTable
  },

  computed: {
    ...mapGetters('cpm/planned/forecasts', [
      'tasks'
    ])
  },

  mounted() {
    const projectId = this.$route.params.id
    this.getDefaultTasks({
      projectId
    })
  },

  methods: {
    ...mapActions('cpm/planned/forecasts', [
      'getDefaultTasks'
    ])
  }
}
</script>

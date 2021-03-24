<template>
  <div
    id="dashboard-container"
    class="dashboard"
  >
    <v-row class="mb-5">
      <v-col cols="12">
        <forecasting-gantt />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="11">
        <forecasting-chart />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ForecastingChart from './ForecastingChart'
import ForecastingGantt from './ForecastingGantt'
export default {
  name: 'ForecastingDashboard',

  components: {
    ForecastingChart,
    ForecastingGantt
  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    overflow: auto;
    background-color: white;
  }
</style>

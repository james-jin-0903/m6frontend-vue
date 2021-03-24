<template>
  <v-dialog
    persistent
    :value="true"
    :width="400"
    @input="close"
  >
    <v-card>
      <v-card-title class="headline white px-6 py-4">
        <span class="grey--text text--darken-1">
          Current Monthly Forecast
        </span>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-card-text class="vertical-scroll">
        <money
          v-model="total"
          v-bind="money"
          color="blue"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="close"
        >
          cancel
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="onSave"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { Money } from 'v-money'
export default {
  name: 'CurrentMonthlyForecastDialog',

  components: {
    Money
  },

  props: {
    monthlyForecastToUpdate: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      total: 0,
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '$',
        precision: 2,
        masked: false
      }
    }
  },

  mounted() {
    if (this.monthlyForecastToUpdate) {
      this.total = this.$h.dg(this.monthlyForecastToUpdate, 'total', 0)
    }
  },

  methods: {
    ...mapActions('cpm/projects/forecasts', [
      'updateTaskCurrentMonthlyForecast'
    ]),
    onSave() {
      this.updateTaskCurrentMonthlyForecast({
        projectId: this.$route.params.id,
        total: this.total,
        taskId: this.monthlyForecastToUpdate.taskId,
        month: this.monthlyForecastToUpdate.month
      })
        .then(() => {
          this.$snotify.success(this.$t('alerts.successfullyUpdated'))
          this.close()
        })
        .catch(console.error)
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

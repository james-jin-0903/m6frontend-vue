<template>
  <m6-card-dialog title="Quarters">
    <v-container
      class="pa-0 rounded-lg"
      fluid
      grid-list-md
    >
      <v-row>
        <v-col md="12">
          <v-data-table
            :headers="headers"
            :items="items"
          >
            <template
              slot="items"
              slot-scope="props"
            >
              <td class="text-center">
                Quarter #{{ props.item.index + 1 }}
              </td>
              <td class="text-center">
                {{ props.item.period }}
              </td>
              <td class="text-right">
                {{ props.item.spending | currency }}
              </td>
              <td class="text-right">
                {{ props.item.forecast | currency }}
              </td>
              <td class="text-right">
                {{ props.item.variance | currency }}
              </td>
            </template>

            <template v-slot:footer>
              <td class="text-center">
                <strong>{{ capitalPlan.fiscalYear.name }}</strong>
                Total
              </td>
              <td class="text-center">
                {{ getPeriodYear() }}
              </td>
              <td class="text-right">
                {{ totals.spending | currency }}
              </td>
              <td class="text-right">
                {{ totals.forecast | currency }}
              </td>
              <td class="text-right">
                {{ totals.variance | currency }}
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </m6-card-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'
import Quarters from './Helpers/Quarters'

export default {
  name: 'Quarters',
  data() {
    const capitalPlanId = this.$route.params.id
    return {
      capitalPlanId: capitalPlanId,
      headers: [
        { text: 'Name', value: 'index' },
        { text: 'Period', value: 'period' },
        { text: 'Spending Amount', value: 'spending' },
        { text: 'Forecast Amount', value: 'forecast' },
        { text: 'Variance Amount', value: 'variance' }
      ],
      items: [],
      capitalPlan: {
        fiscalYear: {
          text: ''
        }
      },
      totals: {
        spending: 0,
        forecast: 0,
        variance: 0
      }
    }
  },
  async mounted() {
    await this.getCapitalPlan()
  },
  methods: {
    getPeriodYear() {
      if (
        this.capitalPlan.fiscalYear &&
        this.capitalPlan.fiscalYear.startDate &&
        this.capitalPlan.fiscalYear.endDate
      ) {
        return (
          'Start Date: ' +
          this.capitalPlan.fiscalYear.startDate +
          ' End Date: ' +
          this.capitalPlan.fiscalYear.endDate
        )
      }
      return ''
    },
    getCapitalPlan() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          const snap = await db
            .collection('cpm_capital_plan')
            .doc(this.capitalPlanId)
            .get()
          if (!snap.exists) {
            reject(new Error('Capital plan not found'))
          }

          const capitalPlan = snap.data()

          const projects = []
          // the projects are ref
          await Promise.all(
            capitalPlan.projects.map(async ref => {
              const snapProject = await ref.get()
              if (snapProject.exists) {
                const project = snapProject.data()
                project.id = snapProject.id
                projects.push(project)
              }
            })
          )

          this.capitalPlan = capitalPlan
          this.capitalPlan.projects = projects

          const quartersInstance = new Quarters(
            this.capitalPlan.projects,
            this.capitalPlan.forecasts,
            this.capitalPlan.fiscalYear
          )
          const response = quartersInstance.getQuarters()
          this.items = response.periods
          this.totals = response.totals

          // Add index to each quarter
          this.items.forEach((item, index) => {
            item.index = index
          })

          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    }
  }
}
</script>

<template>
  <m6-card-dialog title="Forecasts">
    <v-row
      align="center"
    >
      <v-col
        class="mb-5"
        sm="12"
      >
        <div class="text-right">
          <div
            class="d-inline-block"
            style="width: 300px"
          >
            <v-select
              v-model="fiscalYear"
              :hint="getHintFiscalYear()"
              item-text="name"
              :items="fiscalYears"
              label="Fiscal Year"
              persistent-hint
              return-object
              @change="onChangeFiscalYear"
            />
          </div>

          <v-btn
            color="primary"
            :disabled="loading"
            :loading="loading"
            @click="openConfirm('reset')"
          >
            Reset
          </v-btn>
          <v-btn
            color="primary"
            :disabled="loading"
            :loading="loading"
            @click="openConfirm('runCashFlow')"
          >
            Run Cash Flow
          </v-btn>
          <v-btn
            color="primary"
            :disabled="loading"
            :loading="loading"
            @click="saveSnapshot"
          >
            Save Snapshot
          </v-btn>
          <v-btn
            color="primary"
            :disabled="loading"
            :loading="loading"
            @click="copyCapitalPlan"
          >
            Copy Capital Plan
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col md="12">
        <v-data-table
          :headers="headers"
          :items="projects"
        >
          <template
            slot="headers"
            slot-scope="props"
          >
            <tr>
              <th
                v-for="(header, index) in props.headers"
                :key="index"
              >
                <template v-if="index == 0">
                  <v-container
                    class="pa-0 rounded-lg"
                    grid-list-md
                  >
                    <v-row>
                      <v-col md="12">
                        {{ header.text }}
                      </v-col>
                    </v-row>
                  </v-container>
                </template>

                <template v-else>
                  <template v-if="header.type == 'period'">
                    <template
                      v-if="header.value == currentMonth || isPeriodLowerThanCurrentMonth(header.value, currentMonth)"
                    >
                      <v-container
                        class="pa-0 rounded-lg"
                        grid-list-md
                      >
                        <v-row>
                          <v-col md="12">
                            {{ header.text }}
                          </v-col>
                        </v-row>
                        <v-row
                          class="row-fiscal-year"
                        >
                          <v-col
                            class="text-center"
                            md="4"
                          >
                            Spending
                          </v-col>
                          <v-col
                            class="text-center"
                            md="4"
                          >
                            Forecast
                          </v-col>
                          <v-col
                            class="text-center"
                            md="4"
                          >
                            Variance
                          </v-col>
                        </v-row>
                      </v-container>
                    </template>

                    <!-- If period is lower than current month -->
                    <!--
                    <template
                      v-else-if="
                        isPeriodLowerThanCurrentMonth(
                          header.value,
                          currentMonth
                        )
                      "
                    >
                      <v-container grid-list-md class="pa-0 rounded-lg">
                        <v-layout row wrap>
                          <v-flex md12>{{ header.text }}</v-flex>
                        </v-layout>
                        <v-layout row wrap>
                          <v-flex md12 class="text-xs-center">Spending</v-flex>
                        </v-layout>
                      </v-container>
                    </template>
-->

                    <!-- If period is higher than current month -->
                    <template v-else>
                      <v-container
                        class="pa-0 rounded-lg"
                        grid-list-md
                      >
                        <v-row>
                          <v-col md="12">
                            {{ header.text }}
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col
                            class="text-center"
                            md="12"
                          >
                            Forecast
                          </v-col>
                        </v-row>
                      </v-container>
                    </template>
                  </template>

                  <template v-if="header.type == 'fiscal-year'">
                    <v-container
                      class="pa-0 rounded-lg"
                      grid-list-md
                    >
                      <v-row>
                        <v-col md="12">
                          {{ header.text }}
                        </v-col>
                      </v-row>
                    </v-container>
                  </template>
                </template>
              </th>
            </tr>
          </template>

          <template
            slot="items"
            slot-scope="props"
          >
            <td>
              <span
                class="d-inline-block text-truncate"
                style="max-width: 150px;"
              >
                {{ props.item.title }}
              </span>
            </td>

            <td
              v-for="(period, index) in periods"
              :key="index + 'period'"
            >
              <v-container
                class="pa-0 rounded-lg"
                grid-list-md
              >
                <v-row
                  v-if="period.value == currentMonth || isPeriodLowerThanCurrentMonth(period.value, currentMonth)"
                  align="center"
                >
                  <v-col
                    class="text-center"
                    md="4"
                  >
                    {{
                      getSpendingPeriodFromProject(period.value, props.item) | currency
                    }}
                  </v-col>

                  <v-col
                    class="text-center"
                    md="4"
                  >
                    <v-container
                      class="pa-0 rounded-lg"
                      fluid
                      grid-list-md
                    >
                      <v-row
                        align="center"
                      >
                        <v-col
                          md="6"
                          sm="12"
                        >
                          {{
                            getForecastPeriodFromCapitalPlan(
                              capitalPlan.forecasts,
                              period.value,
                              props.item.id
                            ) | currency
                          }}
                        </v-col>
                        <v-col
                          md="6"
                          sm="12"
                        >
                          <v-btn
                            color="primary"
                            icon
                            small
                            @click="openDialogForecast(period, props.item)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-col>

                  <v-col
                    class="text-center"
                    md="4"
                  >
                    {{
                      getVariancePeriodFromCapitalPlan(
                        capitalPlan.forecasts,
                        period.value,
                        props.item.id
                      ) | currency
                    }}
                  </v-col>
                </v-row>

                <!--
                <v-layout
                  v-else-if="
                    isPeriodLowerThanCurrentMonth(period.value, currentMonth)
                  "
                  row
                  wrap
                  align-center
                >
                  <v-flex md12 class="text-xs-right">
                    {{
                      getSpendingPeriodFromProject(period.value, props.item) | currency
                    }}
                  </v-flex>
                </v-layout>
-->

                <v-row
                  v-else
                  align="center"
                >
                  <v-col
                    class="text-right"
                    md="12"
                  >
                    <v-container
                      class="pa-0 rounded-lg"
                      fluid
                      grid-list-md
                    >
                      <v-row
                        align="center"
                      >
                        <v-col
                          md="6"
                          sm="12"
                        >
                          {{
                            getForecastPeriodFromCapitalPlan(
                              capitalPlan.forecasts,
                              period.value,
                              props.item.id
                            ) | currency
                          }}
                        </v-col>
                        <v-col
                          md="6"
                          sm="12"
                        >
                          <v-btn
                            color="primary"
                            icon
                            small
                            @click="openDialogForecast(period, props.item)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-col>
                </v-row>
              </v-container>
            </td>

            <td
              v-for="(fiscalYear, index) in fiscalYearsAvailable"
              :key="index"
              class="text-center"
            >
              <v-container
                class="pa-0 rounded-lg"
                fluid
                grid-list-md
              >
                <v-row
                  align="center"
                >
                  <v-col
                    md="6"
                    sm="12"
                  >
                    {{
                      getForecastFiscalYearFromCapitalPlan(
                        capitalPlan.forecasts,
                        fiscalYear.value,
                        props.item.id
                      ) | currency
                    }}
                  </v-col>
                  <v-col
                    md="6"
                    sm="12"
                  >
                    <v-btn
                      color="primary"
                      icon
                      small
                      @click="openDialogFiscalYear(fiscalYear, props.item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialogForecasted"
      max-width="500px"
      persistent
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            {{ getTitleDialog() }}
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <v-container
            class="pa-0 rounded-lg"
            grid-list-md
          >
            <v-row>
              <v-col md="12">
                <v-text-field
                  v-model="elementToEdit.amount"
                  label="Amount"
                  prepend-icon="mdi-cash"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="loading"
            :loading="loading"
            text
            @click="cancelForecast"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :disabled="loading"
            :loading="loading"
            @click="saveForecast"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <m6-confirm-delete
      :message="confirmData.message"
      :show="confirmData.show"
      :title="confirmData.title"
      @cancel="confirmData.cancel"
      @confirm="confirmData.confirm"
    />
  </m6-card-dialog>
</template>

<script>
import { mapState } from 'vuex'

import moment from 'moment'

import { db } from '@/utils/Firebase'

import CashFlow from './Helpers/CashFlow'
import {
  getForecastPeriodFromCapitalPlan,
  getSpendingPeriodFromProject,
  getVariancePeriodFromCapitalPlan,
  getForecastFiscalYearFromCapitalPlan,
  setForecastedAmount,
  isPeriodLowerThanCurrentMonth,
  getPeriods
} from './Helpers/Helpers'

const headerDefault = {
  text: '',
  value: '',
  type: ''
}
const fiscalYearDefault = {
  endDate: '',
  name: '',
  startDate: '',
  value: ''
}
const snapshotDefault = {
  headers: [],
  projects: [],
  periods: [],
  fiscalYearsAvailable: [],
  currentMonth: '',
  createdAt: '',
  forecasts: []
}

const initialHeaders = [{ text: 'Project', type: 'default' }]

export default {
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  data() {
    const capitalPlanId = this.$route.params.id
    const currentMonth = moment().format('YYYY-MM')

    return {
      capitalPlanId: capitalPlanId,

      fiscalYear: {},
      headers: initialHeaders,
      capitalPlan: {
        projects: [],
        forecasts: {}
      },
      fiscalYears: [],
      projects: [],
      periods: [],
      fiscalYearsAvailable: [],
      elementToEdit: {
        period: headerDefault,
        fiscalYear: fiscalYearDefault,
        project: {},
        type: 'forecasted',
        amount: 0
      },
      dialogForecasted: false,
      currentMonth: currentMonth,
      loading: false,
      confirmData: {
        title: '',
        message: '',
        show: false,
        confirm: () => {},
        cancel: () => {}
      }
    }
  },
  async mounted() {
    await this.getFiscalYears()
    await this.getCapitalPlan()
  },
  methods: {
    getForecastPeriodFromCapitalPlan,
    getSpendingPeriodFromProject,
    isPeriodLowerThanCurrentMonth,
    getVariancePeriodFromCapitalPlan,
    getForecastFiscalYearFromCapitalPlan,
    setForecastedAmount,
    getPeriods,
    cancelConfirm(type = '') {
      if (type == 'fiscalYear') {
        this.fiscalYear = this.capitalPlan.fiscalYear
      }

      this.confirmData = {
        title: '',
        message: '',
        show: false,
        confirm: () => {},
        cancel: () => {}
      }
    },
    openConfirm(type = '') {
      switch (type) {
        case 'reset':
          this.confirmData.title = 'Reset Forecast table'
          this.confirmData.message =
            'Are you sure you want to reset the forecasts table'
          this.confirmData.confirm = () => this.resetCashFlow()
          this.confirmData.cancel = () => this.cancelConfirm()
          break
        case 'runCashFlow':
          this.confirmData.title = 'Run Cash Flow'
          this.confirmData.message = 'Are you sure you want to Run Cash Flow'
          this.confirmData.confirm = () => this.runCashFlow()
          this.confirmData.cancel = () => this.cancelConfirm()
          break
        case 'fiscalYear':
          this.confirmData.title = 'Change Fiscal Year'
          this.confirmData.message =
            'Are you sure you want to change the Fiscal Year'
          this.confirmData.confirm = () => this.changeFiscalYear()
          this.confirmData.cancel = () => this.cancelConfirm('fiscalYear')
          break
      }
      this.confirmData.show = true
    },
    saveCapitalPlanForecast(forecasts = {}) {
      const aux = new Promise(async (resolve, reject) => {
        try {
          this.loading = true

          await db
            .collection('cpm_capital_plan')
            .doc(this.capitalPlanId)
            .update({
              forecasts: forecasts
            })

          this.calculateHeaders()

          this.cancelForecast()
          this.loading = false
          this.$emit('refresh-quarters')
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    async resetCashFlow() {
      const cashFlow = new CashFlow(
        this.capitalPlan.forecasts,
        this.projects,
        this.periods,
        this.fiscalYearsAvailable,
        this.currentMonth
      )
      cashFlow.reset()
      await this.saveCapitalPlanForecast(this.capitalPlan.forecasts)
      this.$emit('refresh-quarters')
      this.$snotify.success('The forecast has been reset', 'Succcess')
      this.cancelConfirm()
    },
    async runCashFlow() {
      const cashFlow = new CashFlow(
        this.capitalPlan.forecasts,
        this.projects,
        this.periods,
        this.fiscalYearsAvailable,
        this.currentMonth
      )
      cashFlow.run()
      await this.saveCapitalPlanForecast(this.capitalPlan.forecasts)
      this.$emit('refresh-quarters')
      this.$snotify.success('The forecast has Run Cash Flow', 'Succcess')
      this.cancelConfirm()
    },
    addCapitalRefToTheProjects(capitalId) {
      const aux = new Promise(async (resolve, reject) => {
        try {
          await Promise.all(
            this.capitalPlan.projects.map(async project => {
              const snap = await db
                .collection('cpm_projects')
                .doc(project.id)
                .get()

              if (snap.exists) {
                const auxProject = snap.data()
                const capitalPlans = auxProject.capitalPlans

                const find = capitalPlans.findIndex(capitalPlan => capitalPlan.id == capitalId)

                if (find == -1) {
                  capitalPlans.push(
                    db.collection('cpm_capital_plan').doc(capitalId)
                  )
                  await db
                    .collection('cpm_projects')
                    .doc(project.id)
                    .update({
                      capitalPlans: capitalPlans
                    })
                }
              }
            })
          )
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    copyCapitalPlan() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          this.loading = true
          const capitalPlan = { ...this.capitalPlan }

          const snap = await db.collection('cpm_capital_plan').add(capitalPlan)

          const capitalId = snap.id

          await this.addCapitalRefToTheProjects(capitalId)

          this.$snotify.success(
            'The capital plan has been duplicated',
            'Succcess'
          )
          this.loading = false

          this.$router.push({
            name: 'cpm.capitalPlan.show',
            params: { id: capitalId }
          })

          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    saveSnapshot() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          this.loading = true
          const snapshotAux = { ...snapshotDefault }

          snapshotAux.headers = this.headers
          snapshotAux.projects = this.projects
          snapshotAux.periods = this.periods
          snapshotAux.fiscalYearsAvailable = this.fiscalYearsAvailable
          snapshotAux.currentMonth = this.currentMonth
          snapshotAux.forecasts = this.capitalPlan.forecasts
          snapshotAux.createdAt = new Date()

          await db
            .collection('cpm_capital_plan')
            .doc(this.capitalPlanId)
            .collection('forecasts_history')
            .add(snapshotAux)

          this.$snotify.success('The snapshot has been saved', 'Succcess')

          this.loading = false
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    getTitleDialog() {
      let firstPart = 'Forecast amount'
      let secondPart = ''

      if (this.elementToEdit.type == 'forecasted') {
        secondPart = this.elementToEdit.period.text
      } else {
        firstPart = 'Fiscal Year amount'
        secondPart = this.elementToEdit.fiscalYear.text
      }

      return firstPart + ' in ' + secondPart
    },
    cancelForecast() {
      this.dialogForecasted = false

      this.elementToEdit.period = headerDefault
      this.elementToEdit.fiscalYear = fiscalYearDefault
      this.elementToEdit.project = {}
      this.elementToEdit.amount = 0
      this.elementToEdit.type = 'forecasted'
    },
    async saveForecast() {
      const amount = parseFloat(this.elementToEdit.amount)
      let elementToEditValue = ''
      switch (this.elementToEdit.type) {
        case 'forecasted':
          elementToEditValue = this.elementToEdit.period.value
          break

        case 'fiscalYears':
          elementToEditValue = this.elementToEdit.fiscalYear.value
          break
      }
      this.setForecastedAmount(
        this.capitalPlan.forecasts,
        this.elementToEdit.project.id,
        this.elementToEdit.type,
        elementToEditValue,
        amount,
        this.elementToEdit.project
      )

      await this.saveCapitalPlanForecast(this.capitalPlan.forecasts)
      this.$snotify.success('The forecast has been saved', 'Succcess')
    },
    openDialogForecast(period, project) {
      const projectId = project.id

      this.elementToEdit.period = JSON.parse(JSON.stringify(period))
      this.elementToEdit.project = {
        id: projectId,
        spendingsByPeriod: project.spendingsByPeriod
      }
      this.elementToEdit.type = 'forecasted'

      if (
        projectId &&
        this.capitalPlan.forecasts &&
        this.capitalPlan.forecasts[projectId] &&
        this.capitalPlan.forecasts[projectId]['forecasted'] &&
        this.capitalPlan.forecasts[projectId]['forecasted'][period.value]
      ) {
        this.elementToEdit.amount = this.capitalPlan.forecasts[projectId][
          'forecasted'
        ][period.value].amount
      } else {
        this.elementToEdit.amount = 0
      }
      this.dialogForecasted = true
    },
    openDialogFiscalYear(fiscalYear, project) {
      const projectId = project.id

      this.elementToEdit.fiscalYear = JSON.parse(JSON.stringify(fiscalYear))
      this.elementToEdit.project = {
        id: projectId,
        spendingsByPeriod: project.spendingsByPeriod
      }
      this.elementToEdit.type = 'fiscalYears'
      if (
        projectId &&
        this.capitalPlan.forecasts &&
        this.capitalPlan.forecasts[projectId] &&
        this.capitalPlan.forecasts[projectId]['fiscalYears'] &&
        this.capitalPlan.forecasts[projectId]['fiscalYears'][fiscalYear.value]
      ) {
        this.elementToEdit.amount = this.capitalPlan.forecasts[projectId][
          'fiscalYears'
        ][fiscalYear.value].amount
      } else {
        this.elementToEdit.amount = 0
      }
      this.dialogForecasted = true
    },
    getFiscalYearsAvailable() {
      const indexFiscalYear = this.fiscalYears.findIndex(fiscalYear => fiscalYear.value == this.fiscalYear.value)
      if (indexFiscalYear == -1 || indexFiscalYear == this.fiscalYears.length) {
        return []
      }

      const fiscalYears = []

      for (
        let index = indexFiscalYear + 1;
        index < this.fiscalYears.length;
        index++
      ) {
        const element = this.fiscalYears[index]

        const aux = { ...headerDefault }
        aux.text = element.name
        aux.value = element.value
        aux.type = 'fiscal-year'

        fiscalYears.push(aux)
      }
      return fiscalYears
    },
    calculateHeaders() {
      this.periods = getPeriods(this.fiscalYear, headerDefault)
      this.fiscalYearsAvailable = this.getFiscalYearsAvailable()

      this.headers = [
        ...initialHeaders,
        ...this.periods,
        ...this.fiscalYearsAvailable
      ]
    },
    onChangeFiscalYear() {
      this.openConfirm('fiscalYear')
    },
    async changeFiscalYear() {
      this.calculateHeaders()
      await this.saveFiscalYear()
      this.cancelConfirm()
      this.$snotify.success('The Fiscal Year has been saved')
    },
    getHintFiscalYear() {
      if (
        this.fiscalYear &&
        this.fiscalYear.startDate &&
        this.fiscalYear.endDate
      ) {
        return (
          'Start Date: ' +
          this.fiscalYear.startDate +
          ' End Date: ' +
          this.fiscalYear.endDate
        )
      }
      return ''
    },
    saveFiscalYear() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          await db
            .collection('cpm_capital_plan')
            .doc(this.capitalPlanId)
            .update({
              fiscalYear: this.fiscalYear
            })
          this.capitalPlan.fiscalYear = this.fiscalYear

          this.$emit('refresh-quarters')
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    getFiscalYears() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          const snap = await db
            .collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('projects')
            .get()

          if (!snap.exists) {
            resolve(true)
          }

          const project = snap.data()

          if (project.fiscalYears && project.fiscalYears.length > 0) {
            this.fiscalYears = project.fiscalYears
            this.calculateHeaders()
          }
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    getCapitalPlan() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          const snap = await db
            .collection('cpm_capital_plan')
            .doc(this.capitalPlanId)
            .get()

          if (!snap.exists) {
            resolve(true)
          }

          this.capitalPlan = snap.data()
          this.projects = []
          if (
            this.capitalPlan.projects &&
            this.capitalPlan.projects.length > 0
          ) {
            await this.capitalPlan.projects.forEach(async projectRef => {
              const snap = await projectRef.get()
              const project = snap.data()
              project.id = snap.id
              this.projects.push(project)
            })
          }

          if (this.capitalPlan.fiscalYear) {
            this.fiscalYear = this.capitalPlan.fiscalYear
            this.calculateHeaders()
          }
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

<style scoped>
.row-fiscal-year {
  min-width: 220px;
}
</style>

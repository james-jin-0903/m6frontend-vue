<template>
  <div v-if="$h.dg(selectedFiscalYear, 'value') && tasksWithPositiveAmount.length">
    <v-row>
      <v-col class="shrink">
        <v-checkbox
          v-model="showPreviewsFY"
          color="blue-grey darken-1"
          hide-details
          :label="$t('cpm.forecasting.previousFiscalYears')"
        />
      </v-col>
      <v-col class="shrink">
        <v-checkbox
          v-model="showFuturesFY"
          color="light-blue darken-2"
          hide-details
          :label="$t('cpm.forecasting.futureFiscalYears')"
        />
      </v-col>
    </v-row>
    <m6-data-table
      disable-initial-sort
      :headers="headers"
      item-key="id"
      :items="tasksWithPositiveAmount"
    >
      <template
        v-slot:headers="headerProps"
      >
        <tr>
          <th
            v-if="previousFiscalYearsColspan && showPreviewsFY"
            :class="[previousFYStyles[0], 'pa-0']"
            :colspan="previousFiscalYearsColspan"
          >
            {{ $t('cpm.forecasting.previousFiscalYears') }}
          </th>

          <th
            :class="['text-xs-left', 'black--text', 'cell-solid-border']"
            :colspan="minimunColumnNumbers"
            v-html="headerDescriptionText"
          />

          <th
            v-for="(month, index) in monthsForForecastTable"
            :key="index + 'monthsForForecastTableLevel2'"
            :class="headerMonthStyles"
            :colspan="colspanForMonths"
          >
            {{ getMonthHeaderText(month) }}
          </th>

          <th
            v-if="futureFiscalYearsColspan && showFuturesFY"
            :class="[headerStyles[1], 'pa-0']"
            :colspan="futureFiscalYearsColspan"
          >
            {{ $t('cpm.forecasting.futureFiscalYears') }}
          </th>
        </tr>
        <!--THIRD LEVEL-->
        <tr>
          <th
            v-for="(header, index) in headerProps.headers"
            :key="header.text + index"
            :class="header.class"
            @click="setFiscalYear(header)"
          >
            <span v-html="header.text" />
          </th>
        </tr>
      </template>

      <template
        v-slot:items="props"
      >
        <tr @click="props.expanded = !props.expanded">
          <template v-if="showPreviewsFY">
            <td
              v-for="({ value: previousFiscalYearValue }, index) in previousFiscalYears"
              :key="index + 'previousFiscalYear'"
              class="text-right"
            >
              {{ $h.dg(props.item, `forecast.totals.${previousFiscalYearValue}.${props.item.fyValue}`, 0) | currency }}
            </td>
          </template>
          <td class="text-left">
            <span class="font-weight-bold">{{ props.item.title }}</span><br>
            <span class="caption">{{ $t('cpm.projects.budgetCategories') }}: {{ objectArrayToString(props.item.budgetCategories, 'code') }}</span>
          </td>
          <td class="text-right">
            {{ Math.round(props.item.budgetPercentage) }}%
          </td>
          <td class="text-right">
            {{ $h.dg(props.item, 'budget') | currency }}
          </td>

          <template
            v-for="(month, index) in monthsForForecastTable"
          >
            <td
              :key="index + 'monthItem'"
              :class="[originalForecastStyle, 'text-xs-right']"
            >
              {{ getOriginalForecastAmount(props.item, month) | currency }}
            </td>
            <td
              :key="index + 'actualSpendingItem'"
              :class="[actualSpendingStyle, 'text-xs-right']"
            >
              {{ $h.dg(props.item, `spending.months.${month}.total`, 0) | currency }}
            </td>
            <td
              :key="index + 'M6AutocalculatedItem'"
              :class="[autocalculatedMonthlyForecastStyle, 'text-xs-right', 'current-monthly-cell']"
            >
              <div>
                {{ $h.dg(props.item, `currentMonthlyForecast.months.${month}.total`, 0) | currency }}
                <v-icon
                  class="current-monthly-cell__icon"
                  color="primary"
                  size="15"
                  @click.stop="openMonthlyForecastForm(props.item, month, $h.dg(props.item, `currentMonthlyForecast.months.${month}.total`, 0))"
                >
                  mdi-pencil
                </v-icon>
              </div>
            </td>
          </template>

          <template v-if="showFuturesFY">
            <td
              v-for="({ value: futureFiscalYearValue }, index) in futureFiscalYears"
              :key="index + 'futureFiscalYear'"
              class="text-right"
            >
              {{ $h.dg(props.item, `forecast.totals.${futureFiscalYearValue}.${props.item.fyValue}`, 0) | currency }}
            </td>
          </template>
        </tr>
      </template>

      <template
        v-slot:footer
      >
        <tr class="grey lighten-2">
          <template v-if="showPreviewsFY">
            <td
              v-for="(previousFiscalYear, index) in previousFiscalYears"
              :key="index + 'previousFiscalYearFooter'"
              class="text-right"
            >
              {{ budgetsByFiscalYear[$h.dg(previousFiscalYear, 'value', '')] | currency }}
            </td>
          </template>

          <td class="font-weight-bold">
            {{ $tc('general.total', 2) }}
          </td>
          <td class="text-right">
            {{ Math.round($h.dg(budgetTaskTotals, 'allTasksPercentage', 0)) }}%
          </td>
          <td class="text-right">
            {{ getTotalBudgetAmount() | currency }}
          </td>

          <template
            v-for="(month, index) in monthsForForecastTable"
          >
            <td
              :key="index + 'monthsForForecastTableFooter'"
              :class="[originalForecastStyle, 'text-xs-right']"
            >
              {{ $h.dg(budgetTaskTotals, `months.${month}.total`, 0) | currency }}
            </td>
            <td
              :key="index + 'actualSpendingFooter'"
              :class="[actualSpendingStyle, 'text-xs-right']"
            >
              {{ $h.dg(budgetTaskTotals, `totalActualSpending.${month}`, 0) | currency }}
            </td>
            <td
              :key="index + 'M6AutocalculatedFooter'"
              :class="[autocalculatedMonthlyForecastStyle, 'text-xs-right']"
            >
              {{ $h.dg(budgetTaskTotals, `totalCurrentMonthlyForecast.${month}`, 0) | currency }}
            </td>
          </template>

          <template v-if="showFuturesFY">
            <td
              v-for="(futureFiscalYear, index) in futureFiscalYears"
              :key="index + 'futureFiscalYearFooter'"
              class="text-right"
            >
              {{ budgetsByFiscalYear[$h.dg(futureFiscalYear, 'value', '')] | currency }}
            </td>
          </template>
        </tr>
      </template>
      <template v-slot:expand="props">
        <forecasting-sub-table
          :future-fiscal-years-colspan="futureFiscalYearsColspan"
          :headers="headers"
          :items="$h.dg(props.item, 'spending.budgetCategories', [])"
          :minimun-column-numbers="minimunColumnNumbers"
          :months-for-forecast-table="monthsForForecastTable"
          :previous-fiscal-years-colspan="previousFiscalYearsColspan"
          :show-futures-f-y="showFuturesFY"
          :show-previews-f-y="showPreviewsFY"
        />
      </template>
    </m6-data-table>
    <current-monthly-forecast-dialog
      v-if="showMonthlyForecastForm"
      :monthly-forecast-to-update="monthlyForecastToUpdate"
      @close="showMonthlyForecastForm = false"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ForecastingSubTable from './ForecastingSubTable'
import CurrentMonthlyForecastDialog from './components/CurrentMonthlyForecastDialog'
export default {
  name: 'ForecastingTable',

  components: {
    CurrentMonthlyForecastDialog,
    ForecastingSubTable
  },

  data() {
    return {
      menu: false,
      colspanForMonths: 3,
      headerStyles: [
        'light-blue darken-1 white--text',
        'light-blue darken-2 white--text',
        'light-blue darken-3 white--text',
        'light-blue darken-4 white--text',
        'cyan darken-1 white--text',
        'cyan darken-2 white--text',
        'cyan darken-3 white--text',
        'cyan darken-4 white--text'
      ],
      headerMonthStyles: 'grey lighten-3 black--text cell-solid-border',
      previousFYStyles: [
        'blue-grey darken-1 white--text',
        'blue-grey darken-2 white--text',
        'blue-grey darken-3 white--text',
        'blue-grey darken-4 white--text'
      ],
      actualSpendingStyle: 'light-blue darken-1 white--text cell-solid-border',
      originalForecastStyle: 'deep-purple darken-1 white--text cell-solid-border',
      autocalculatedMonthlyForecastStyle: 'grey lighten-5 black--text cell-solid-border',
      // No matter if there is no data, there will always be a minimum number of headers
      minimunColumnNumbers: 3,
      showFuturesFY: true,
      showPreviewsFY: false,
      headerDescriptionText: `Active Project <br>
        Ability to look at <span class="deep-purple--text darken-1">original monthly forecasted cash flow</span>
        vs <br><span class="light-blue--text darken-1">actual spending</span> vs 
        <span class="grey--text lighten-5">new monthly forecast</span> by project phase.
        `,
      monthlyForecastToUpdate: null,
      showMonthlyForecastForm: false
    }
  },

  computed: {
    ...mapGetters('cpm/projects/forecasts', [
      'allFiscalYears',
      'allScheduleMonths',
      'budgetTaskTotals',
      'budgetsByFiscalYear',
      'tasks',
      'futureFiscalYears',
      'previousFiscalYears',
      'monthsForForecastTable',
      'selectedFiscalYear'
    ]),
    currentMonth() {
      return this.$moment(new Date()).format('YYYY-MM')
    },
    selectedFiscalYearName() {
      return this.$h.dg(this.selectedFiscalYear, 'name', '')
    },
    selectedFiscalYearValue() {
      return this.$h.dg(this.selectedFiscalYear, 'value', '')
    },
    currentFiscalYearColspan() {
      return this.minimunColumnNumbers + this.monthsForForecastTable.length
    },
    futureFiscalYearsColspan() {
      return this.futureFiscalYears.length * 1
    },
    previousFiscalYearsColspan() {
      return this.previousFiscalYears.length * 1
    },
    tasksWithPositiveAmount() {
      return this.tasks.filter(task => this.$h.dg(task, 'budgetPercentage', 0) > 0)
    },
    headers() {
      const headers = [
        {
          text: this.$tc('cpm.projects.projectPhase', 2),
          value: 'title',
          class: this.headerStyles[0] + ' cell-width',
          sortable: false
          // fixed: true
        },
        {
          text: this.$t('cpm.forecasting.budgetPercentage'),
          value: 'budgetPercentage',
          class: this.headerStyles[0] + ' cell-width',
          sortable: false
          // fixed: true
        },
        {
          text: this.$t('general.amount'),
          value: 'budget',
          class: this.headerStyles[0] + ' cell-width',
          sortable: false
          // fixed: true
        }
      ]

      const monthHeaders = []
      if (this.monthsForForecastTable.length) {
        this.monthsForForecastTable.map(() => {
          // Forecast Budget Moths
          monthHeaders.push({
            text: this.$t('cpm.forecasting.originalForecast'),
            class: this.originalForecastStyle + ' cell-width',
            sortable: false
          })
          // Actual Spending
          monthHeaders.push({
            text: this.$t('cpm.forecasting.actualSpending'),
            class: this.actualSpendingStyle + ' cell-width',
            sortable: false
          })
          // Thrid Column
          monthHeaders.push({
            text: 'Current Monthly <br> Forecast',
            class: this.autocalculatedMonthlyForecastStyle + ' cell-width',
            sortable: false
          })
        })
      }

      if (monthHeaders.length) {
        headers.push(...monthHeaders)
      }

      // Adding future fiscal year headers
      if (this.showFuturesFY) {
        const fyHeaders = []
        if (this.futureFiscalYears.length) {
          this.futureFiscalYears.map((fy, index) => {
            fyHeaders.push({
              text: this.$h.dg(fy, 'name', ''),
              class: this.headerStyles[index + 1] + ' cell-width',
              sortable: false
            })
          })
        }
        headers.push(...fyHeaders)
      }

      // Adding previous fiscal year headers
      if (this.showPreviewsFY) {
        const previousFYHeaders = []
        if (this.previousFiscalYears.length) {
          this.previousFiscalYears.map((fy, index) => {
            previousFYHeaders.push({
              text: this.$h.dg(fy, 'name', ''),
              class: this.previousFYStyles[index + 1] + ' cell-width',
              sortable: false
            })
          })
        }
        headers.unshift(...previousFYHeaders)
      }

      return headers
    }
  },

  created() {
    const projectId = this.$route.params.id

    this.getForecastTasks({
      projectId
    })
    this.getAllFiscalYears()
  },

  methods: {
    ...mapActions('cpm/projects/forecasts', [
      'getForecastTasks',
      'getAllFiscalYears'
    ]),
    ...mapMutations('cpm/projects/forecasts', [
      'setSelectedFiscalYear'
    ]),
    setFiscalYear(fiscalYear) {
      const selectedFiscalYear = this.allFiscalYears.find(fy => this.$h.dg(fy, 'name') === this.$h.dg(fiscalYear, 'text'))
      if (selectedFiscalYear) {
        this.setSelectedFiscalYear(selectedFiscalYear)
      }
    },
    getMonthHeaderText(month) {
      return this.$moment(month, 'YYYY-MM').format('MMMM YYYY')
    },
    objectArrayToString(array = [], value, separator = ', ') {
      return array.map(element => element[value]).join(separator)
    },
    getOriginalForecastAmount(task, month) {
      return this.$h.dg(task, `forecast.${month}.${task.fyValue}`, 0)
    },
    getTotalBudgetAmount() {
      return this.tasksWithPositiveAmount.reduce((totalBudgetAmount, task) => totalBudgetAmount + this.$h.dg(task, 'budget', 0), 0)
    },
    openMonthlyForecastForm(task, month, total = 0) {
      this.monthlyForecastToUpdate = {
        taskId: task.id,
        month,
        total
      }
      this.showMonthlyForecastForm = true
    }
  }
}
</script>

<style lang="scss" scoped>
  tr td {
    border: 1px solid !important;
  }

  .cell-solid-border {
    border: black 1px solid !important;
  }

  .cell-width {
    min-width: 140px !important;
    width: 140px !important;
    max-width: 140px !important
  }

  .current-monthly-cell {
    position: relative;

    &__icon {
      position: absolute;
      display: none;
    }

    &:hover &__icon {
      display: inline;
      cursor: pointer;
    }
  }

</style>

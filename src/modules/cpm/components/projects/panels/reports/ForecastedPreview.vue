<template>
  <v-container
    class="rounded-lg"
    fluid
    grid-list-md
  >
    <v-row>
      <v-col
        class="text-right"
        md="12"
      >
        <v-btn
          :color="!fields ? 'grey' : 'blue'"
          dark
          fab
          icon
          small
          @click="fields = !fields"
        >
          <v-icon>mdi-filter-menu</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      v-if="fields"
    >
      <v-col md="12">
        <v-radio-group
          class="mb-0 mt-0"
          row
        >
          <v-checkbox
            v-for="(row,index) in defaultHeaders"
            :key="index"
            v-model="row.active"
            class="ml-3"
            :label="row.text"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-data-table
          class="mt-0"
          :headers="headers"
          item-key="index"
          :items="projects"
        >
          <template
            slot="items"
            slot-scope="props"
          >
            <td v-if="defaultHeaders.number.active">
              {{ props.item.number }}
            </td>
            <td
              v-if="defaultHeaders.title.active"
              class="blue--text"
              style="cursor:pointer;"
              @click="openSchedule(props.item)"
            >
              {{ props.item.title }}
            </td>
            <td v-if="defaultHeaders.campus.active">
              {{ props.item.campus }}
            </td>
            <td v-if="defaultHeaders.projectType.active">
              {{ props.item.projectType }}
            </td>
            <td v-if="defaultHeaders.status.active">
              {{ props.item.status }}
            </td>
            <td v-if="defaultHeaders.calories.active">
              {{ getBoardDate(props.item) }}
            </td>
            <td v-if="defaultHeaders.startDate.active">
              {{ parseDate(props.item.startDate) }}
            </td>
            <td v-if="defaultHeaders.endDate.active">
              {{ parseDate(props.item.endDate) }}
            </td>

            <td
              v-for="(columnDate,index) in columnsDates"
              v-show="defaultHeaders.fiscalYear.active"
              :key="index"
            >
              {{ getFiscalYearItem(columnDate,props.item) }}
            </td>
            <td v-if="defaultHeaders.total.active">
              $ {{ formatMoney(props.item.fyTotal) }}
            </td>

            <td>
              <v-btn
                color="blue"
                dark
                icon
                @click="openSchedule(props.item)"
              >
                <v-icon>mdi-calendar-arrow-right</v-icon>
              </v-btn>
            </td>
          </template>

          <template
            v-if="defaultHeaders.total.active"
            v-slot:footer
          >
            <td :colspan="colspan">
              <strong>Total</strong>
            </td>
            <td
              v-for="(columnDate,index) in columnsDates"
              :key="index"
            >
              {{ getFiscalYearItem(columnDate,totalRow) }}
            </td>
            <td>
              $ {{ formatMoney(totalRow.total) }}
            </td>
            <td />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>


const headerDate = {
  text: '',
  value: '',
  sortable: false
}

const ganttTask = {
  // id: 1,
  text: '',
  duration: 1,
  start_date: new Date,
  end_date: new Date
}

export default {
  props: {
    projectsResult: {
      type: Array,
      required: true
    },
    fiscalYears: {
      type: Array,
      default: (() => [])
    }
  },

  data() {
    return {
      fields: false,
      defaultHeaders: {
        number: { text: 'Project #', value: 'number', active: false },
        title: { text: 'Project Name', value: 'title', active: true },
        campus: { text: 'Campus', value: 'campus', active: false },
        projectType: {
          text: 'Project Type',
          value: 'projectType',
          active: false
        },
        status: { text: 'Funding Status', value: 'status', active: true },
        calories: {
          text: 'Anticipated Funding Date',
          value: 'calories',
          sortable: false,
          active: false
        },
        startDate: { text: 'Start Date', value: 'startDate', active: false },
        endDate: { text: 'End Date', value: 'endDate', active: false },
        fiscalYear: {
          text: 'Fiscal Years',
          value: 'fiscalYear',
          active: true
        },
        total: { text: 'Total', value: 'total', active: true }
      },
      columnsDates: [],
      tasks: {
        data: [],
        links: []
      }
    }
  },
  computed: {
    headers() {
      const header = []
      for (const index in this.defaultHeaders) {
        if (this.defaultHeaders[index].active && index != 'fiscalYear' && index != 'total') {
          header.push(this.defaultHeaders[index])
        }
      }
      this.columnsDates = []

      if (this.fiscalYears && this.fiscalYears.length > 0 && this.defaultHeaders.fiscalYear.active) {
        this.fiscalYears.forEach(fiscalYear => {
          // Adding to header
          const aux = { ...headerDate }
          aux.text = fiscalYear.name
          aux.value = fiscalYear.value
          header.push(aux)

          // Adding to columns
          this.columnsDates.push(fiscalYear)
        })
      }

      if (this.defaultHeaders.total.active) {
        const aux = { ...headerDate }
        aux.text = 'Total'
        aux.value = 'fyTotal'
        header.push(aux)
      }

      const actions = { ...headerDate }
      actions.text = 'Actions'
      actions.value = ''
      header.push(actions)

      return header
    },
    projects() {
      const projects = []
      this.projectsResult.forEach(element => {
        element.projects.forEach(project => {
          projects.push(project)
        })
      })

      projects.forEach((project, index) => {
        project.index = index
      })

      return projects
    },
    totalRow() {
      const row = {
        total: 0
      }

      this.fiscalYears.forEach(fiscalYear => {
        const key = fiscalYear.value
        row[key] = 0

        this.projects.forEach(project => {
          if (project[key]) {
            const amount = parseFloat(project[key])
            row[key] += amount
            row.total += amount
          }
        })
      })

      return row
    },
    colspan() {
      let colspan = 0

      if (this.defaultHeaders.number.active) {
        colspan++
      }
      if (this.defaultHeaders.title.active) {
        colspan++
      }
      if (this.defaultHeaders.campus.active) {
        colspan++
      }
      if (this.defaultHeaders.projectType.active) {
        colspan++
      }
      if (this.defaultHeaders.status.active) {
        colspan++
      }
      if (this.defaultHeaders.calories.active) {
        colspan++
      }
      if (this.defaultHeaders.startDate.active) {
        colspan++
      }
      if (this.defaultHeaders.endDate.active) {
        colspan++
      }
      return colspan
    }
  },
  methods: {
    openSchedule(item) {
      const aux = []


      item.tasks.forEach((task, index) => {
        if (item.selectedGantt && item.selectedGantt.value && task.gantt && item.selectedGantt.value == task.gantt) {
          const auxElement = { ...ganttTask }

          auxElement.text = task.title
          auxElement.start_date = task.start_date ? new Date(task.start_date) : ''
          auxElement.end_date = task.end_date ? new Date(task.end_date) : ''

          aux.push(auxElement)
        }
      })

      this.tasks.data = aux

      const payload = {
        tasks: this.tasks
      }

      this.$emit('open-gantt-modal', payload)
    },
    formatMoney(amount, decimalCount = 2, decimal = '.', thousands = ',') {
      try {
        decimalCount = Math.abs(decimalCount)
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount

        const negativeSign = amount < 0 ? '-' : ''

        const i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString()
        const j = (i.length > 3) ? i.length % 3 : 0

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : '')
      } catch (e) {
        console.log(e)
      }
    },
    getFiscalYearItem(columnDate, item) {
      const key = columnDate.value
      return '$' + this.formatMoney(item[key])
    },
    parseDate(auxDate = '') {
      if (auxDate == '' || auxDate == null) {
        return ''
      }
      const date = new Date(auxDate)

      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    },
    getBoardDate(item) {
      let key = ''
      if (item.selectedGantt && item.selectedGantt.value) {
        key = item.selectedGantt.value
      }

      if (key == '') {
        return ''
      }

      key = key + '-board-date'
      if (item[key]) {
        return this.parseDate(item[key])
      }
      return ''
    }
  }
}
</script>

<style scope>
  table {
    margin-top: 0;
  }
</style>

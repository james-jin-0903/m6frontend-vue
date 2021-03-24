<template>
  <div style="position: relative;">
    <v-dialog
      v-model="dialogApplyMilestone"
      max-width="600px"
      persistent
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            Apply Schedule
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <v-container
            class="pa-0 rounded-lg"
            fluid
            grid-list-md
          >
            <v-row
              align="center"
            >
              <v-col cols="12">
                <v-select
                  v-if="isPlannedProject"
                  v-model="selectedFiscalYear"
                  clearable
                  color="blue"
                  item-text="name"
                  :items="fiscalYears"
                  label="Fiscal Year"
                  return-object
                >
                  <template v-slot:item="{ item }">
                    {{ item.name }}
                  </template>
                </v-select>
              </v-col>
              <v-col md="4">
                {{ nameMilestone }}
              </v-col>
              <v-col md="8">
                <v-menu
                  v-if="!validDates.length"
                  ref="menuMilestone"
                  v-model="milestoneDatePicker"
                  :close-on-content-click="false"
                  full-width
                  lazy
                  max-width="290px"
                  min-width="290px"
                  :nudge-right="120"
                  offset-y
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="milestoneDateUsa"
                      :error-messages="milestoneDateError"
                      hint="MM/DD/YYYY format"
                      label="Date milestone"
                      persistent-hint
                      prepend-inner-icon="event"
                      v-on="on"
                    />
                  </template>

                  <v-date-picker
                    v-model="milestoneDateForPicker"
                    no-title
                    @input="milestoneDatePicker = false"
                  />
                </v-menu>
                <v-select
                  v-else
                  v-model="milestoneDateUsa"
                  :items="validDates"
                  label="Date Milestone"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                Start date will be set to be {{ daysMilestone }} days before the
                above date
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-col md="2">
            <v-btn @click="cancelApplyMilestone">
              Cancel
            </v-btn>
          </v-col>
          <v-col md="2">
            <v-btn
              color="blue"
              dark
              :loading="loadingMilestone"
              @click="saveApplyMilestone"
            >
              Apply
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div
      v-show="loading"
      class="data-loading"
    />
    <!-- <div v-if="showTicket" class="task-modal-overlay" @click.prevent="closeTask"></div> -->

    <v-container
      class="rounded-lg"
      fluid
      grid-list-md
    >
      <v-row justify="end">
        <v-col class="shrink">
          <v-btn
            color="primary"
            :small="editing"
            :text="editing"
            @click="editing = !editing"
          >
            {{ editBtnName }}
            <v-icon
              v-show="editing"
              class="mb-1 ml-1"
              right
              small
            >
              mdi-close
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row
        v-if="editing"
        align="center"
      >
        <v-btn @click.prevent="$store.dispatch('gantt/setConfig', !config)">
          {{ getConfigurationLabel() }}
        </v-btn>
        <v-btn @click="showMilestones = !showMilestones">
          <span v-if="!showMilestones">SHOW MILESTONES</span>
          <span v-else>HIDE MILESTONES</span>
        </v-btn>

        <v-spacer />
        <v-btn
          v-if="selectedGantt && selectedGantt.hasCalculatedDates"
          color="blue"
          dark
          @click="openResetMilestone"
        >
          Apply Schedule
        </v-btn>
        <v-col
          md="2"
          sm="4"
        >
          <v-select
            clearable
            item-text="name"
            :items="ganttsSettings"
            label="Schedule Type"
            return-object
            :value="selectedGantt"
            @input="setSelectedGantt"
          />
        </v-col>

        <v-menu
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              color="blue"
              dark
              fab
              small
              v-on="on"
            >
              ?
            </v-btn>
          </template>

          <v-card>
            <table class="scheduleTypesTable">
              <tr>
                <th>Schedule Type</th>
                <th width="70%">
                  Description
                </th>
              </tr>
              <tr
                v-for="(row, index) in ganttsSettings"
                :key="index"
              >
                <td>{{ row.name }}</td>
                <td>{{ row.description }}</td>
              </tr>
            </table>
          </v-card>
        </v-menu>
      </v-row>
    </v-container>

    <v-container
      v-show="config"
      class="rounded-lg"
      fluid
      grid-list-md
    >
      <v-row>
        <v-col
          cols="12"
          md="12"
        >
          <v-container
            class="pa-0 rounded-lg"
            fluid
            grid-list-md
          >
            <v-row>
              <v-col md="3">
                <v-checkbox
                  v-model="columns.title"
                  class="ma-0 pa-0"
                  color="blue"
                  label="Activity Name"
                />
              </v-col>
              <v-col md="3">
                <v-checkbox
                  v-model="columns.startDate"
                  class="ma-0 pa-0"
                  color="blue"
                  label="Start Date"
                />
              </v-col>
              <v-col md="3">
                <v-checkbox
                  v-model="columns.predecessors"
                  class="ma-0 pa-0"
                  color="blue"
                  label="Predecessors"
                />
              </v-col>
              <v-col md="3">
                <v-checkbox
                  v-model="columns.assignee"
                  class="ma-0 pa-0"
                  color="blue"
                  label="Resource Name"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col md="3">
                <v-checkbox
                  v-model="columns.endDate"
                  class="ma-0 pa-0"
                  color="blue"
                  label="End Date"
                />
              </v-col>
              <v-col md="3">
                <v-checkbox
                  v-model="columns.duration"
                  class="ma-0 pa-0"
                  color="blue"
                  label="Duration"
                />
              </v-col>
              <v-col md="3">
                <v-checkbox
                  v-model="columns.hours"
                  class="ma-0 pa-0"
                  color="blue"
                  label="Hours"
                />
              </v-col>
              <v-col md="3">
                <v-checkbox
                  v-model="columns.progress"
                  class="ma-0 pa-0"
                  color="blue"
                  label="Progress"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
      <v-row>
        <v-btn @click.prevent="$store.dispatch('gantt/setConfig', false)">
          Close
        </v-btn>
        <v-btn @click.prevent="updateGantt">
          Save
        </v-btn>
        <v-btn
          color="red accent-2"
          dark
          @click="confirmReset"
        >
          Reset Timeline
        </v-btn>
      </v-row>
    </v-container>

    <v-container
      v-show="config"
      class="pa-0 rounded-lg"
      fluid
      grid-list-md
    >
      <v-row>
        <v-col
          class="slider-config-width"
          md="12"
        >
          <v-slider
            v-model="columns.width"
            color="blue"
            max="915"
            min="0"
            step="1"
            @change="updateGantt"
          />
        </v-col>
      </v-row>
    </v-container>

    <v-row
      class="gantt-header mx-0 py-2"
    >
      <v-col
        class="align-center gantt-header-item py-0 shrink"
      >
        <v-btn
          class="ma-0"
          small
          text
          @click="setScale(0)"
        >
          <v-icon>
            mdi-calendar
          </v-icon>
          Daily
        </v-btn>
      </v-col>
      <v-col
        class="align-center gantt-header-item py-0 shrink"
      >
        <v-btn
          class="ma-0"
          small
          text
          @click="setScale(1)"
        >
          <v-icon>
            mdi-calendar-range
          </v-icon>
          Monthly
        </v-btn>
      </v-col>
    </v-row>
    <div
      id="gantt-container"
      :style="ganttStyle"
    />
    <v-dialog
      v-if="showTicket"
      v-model="showTicket"
      persistent
      scrollable
      width="600px"
    >
      <task
        :id="ticketId"
        :gantt="selectedGantt.value"
        @closeTask="closeTask"
      />
    </v-dialog>

    <v-btn
      absolute
      bottom
      color="primary"
      dark
      fab
      right
      small
      @click="expandGantt"
    >
      <v-icon v-if="!expandTasksOnGantt">
        mdi-arrow-expand-down
      </v-icon>
      <v-icon v-else>
        mdi-arrow-expand-up
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
/* global gantt*/
/* eslint no-undef: "error"*/

import { db } from '@/utils/Firebase'
import EventBus from '@/Eventbus'
import 'dhtmlx-gantt'
// import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_marker'
// import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_tooltip'
import Task from './Task'
import format from 'date-fns/format'
import {
  mapGetters,
  mapState,
  mapActions,
  mapMutations
} from 'vuex'
import _ from 'lodash'
import axios from 'axios'

const defaultMilestone = {
  title: 'New Milestone',
  in_report: false,
  original: new Date().toISOString(),
  projected: null,
  actual: null,
  days: 212,
  activeResetDays: false
}
export default {
  name: 'Gantt',
  components: {
    Task
  },
  props: {
    type: {
      type: String,
      default: 'project'
    }
  },
  data() {
    return {
      budgetFiscalYear: null,
      budgets: {},
      company: {},
      daysMilestone: 0,
      defaultTasks: [],
      dialogApplyMilestone: false,
      editing: false,
      expandTasksOnGantt: false,
      fiscalYear: '',
      fiscalYears: [],
      ganttExpands: [],
      ganttsSettings: [],
      ganttStyle: {
        height: '500px'
      },
      loading: false,
      loadingMilestone: false,
      loadingTasks: false,
      menu: false,
      menuMilestoneDate: false,
      milestoneDateForPicker: '',
      milestoneDatePicker: false,
      milestoneDateUsa: '',
      milestonesSettings: [],
      modalDate: false,
      nameMilestone: '',
      project: {},
      scaleSelected: 'month',
      scales: [
        { label: 'Month', value: 'month' },
        { label: 'Quarter', value: 'quarter' },
        { label: 'Year', value: 'year' }
      ],
      selectedFiscalYear: null,
      settings: {},
      showMilestones: false,
      taskId: '',
      tasksByGantts: {},
      ticketData: [],
      todayMarker: {},
      validDates: []
    }
  },

  firestore() {
    return {
      company: db.collection('companies').where('cid', '==', this.company_id)
    }
  },
  computed: {
    ...mapState({
      selectedGantt: state => state.tickets.selectedGantt
    }),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    ...mapGetters({
      appLabel: 'appLabel',
      axiosSettings: 'axiosSettings',
      columns: 'gantt/columns',
      config: 'gantt/config',
      showTicket: 'tickets/showTicket',
      ticketId: 'tickets/ticketId',
      userGanttSettings: 'ganttSettings/getSettings'
    }),
    ...mapGetters('cpm/planned/gantt', {
      links: 'links',
      milestones: 'milestones',
      ticketsAvailables: 'ticketsAvailables',
      tasks: 'tasks',
      softRefreshData: 'softRefreshData',
      forceRefresh: 'forceRefresh'
    }),
    company_id() {
      return this.currentCompany.id
    },
    yearsAvailables() {
      const years = {}
      let auxYear = this.getFullYear()
      auxYear = auxYear - 2
      for (let i = 0; i < 5; i++) {
        let classBool = false
        if (i % 2 === 0) {
          classBool = true
        }

        if (!years[auxYear]) {
          years[auxYear] = {}
        }

        for (let j = 0; j < 12; j++) {
          // oct. 1 - sept. 30
          if (j < 9) {
            years[auxYear][j] = classBool ? 'fiscal-year' : 'no-fiscal-year'
          } else {
            years[auxYear][j] = classBool ? 'no-fiscal-year' : 'fiscal-year'
          }
        }

        auxYear++
      }
      return years
    },
    settingCollectionName() {
      if (this.$route.name.includes('forecasting')) {
        return 'planned_settings'
      } else {
        return 'settings'
      }
    },
    milestoneDateError() {
      if (!this.$moment(this.milestoneDateUsa, 'MM/DD/YYYY', true).isValid() && this.milestoneDateUsa !== '') {
        return 'Invalid Date MM/DD/YYYY'
      } else return []
    },
    editBtnName() {
      if (!this.editing) {
        return this.$t('cpm.projects.editSchedule')
      } else {
        return this.$t('general.hide')
      }
    },
    isPlannedProject() {
      return this.$h.dg(this.$route, 'name') === 'cpm.forecasting.show'
    },
    projectRef() {
      return db
        .collection(this.appLabel.firebaseCollection)
        .doc(this.projectId)
    },
    projectId() {
      return this.$route.params.id
    }
  },
  watch: {
    showMilestones: function () {
      this.updateUserSettings()
        .then(() => {
          this.triggerUpdate()
        })
    },
    fiscalYear: function () {
      this.triggerUpdate()
    },
    selectedGantt: function () {
      this.triggerUpdate()
    },
    softRefreshData: function () {
      // this.debounceForecastsAfterRefresh()
    },
    forceRefresh: function () {
      this.$nextTick(() => {
        this.loadGantt()
      })
    },
    company: function (newValue) {
      const company = newValue[0]
      if (company) {
        const data = db.collection('companies').doc(this.company_id)
        this.$store.dispatch('tickets/setCompany', data)
      }
    },
    milestoneDateUsa(value) {
      this.originalDateForPicker = this.$moment(value).format('YYYY-MM-DD')
    },
    milestoneDateForPicker(value) {
      this.milestoneDateUsa = this.$moment(value).format('MM/DD/YYYY')
    }
  },
  created() {
    this.getProjectMilestonesTasksAndLinks({
      projectId: this.projectId
    }).then(() => {
      this.processTableData()
    })
  },
  async mounted() {
    this.loadGantt()
    await Promise.all([this.loadDefaultTasksAndSettings(), this.getBudgets()])
    this.fiscalYear = this.getFullYear()

    this.gettingUserSettings()
    this.getFiscalYears()
    this.getBudgetFiscalYear()
    this.getCurrentFiscalYear({
      projectId: this.projectId
    })

    let oldOne = false
    this.getSettingMilestones()
    this.projectRef
      .get()
      .then(async doc => {
        const projectObj = doc.data()
        projectObj.id = doc.id
        projectObj.ref = doc.ref

        this.project = projectObj
        this.setProject(projectObj)

        if (this.project.selectedGantt) {
          // looking into the options
          const index = this.ganttsSettings.findIndex(ganttSetting => ganttSetting.value === this.project.selectedGantt.value)

          if (index > -1) {
            this.setSelectedGantt(this.ganttsSettings[index], false)
          }
        }

        if (projectObj.setDefaultSchedule === undefined) {
          await projectObj.ref.update({ setDefaultSchedule: true })
          oldOne = true
        }

        if (
          (projectObj.setDefaultSchedule &&
            projectObj.startDate !== undefined &&
            projectObj.startDate !== '') ||
          oldOne
        ) {
          await this.setDefaultTasks(projectObj.startDate)
        }

        this.$nextTick(() => {
          this.triggerUpdate()
          this.loadExternalAPI()
        })
      })
  },

  destroyed() {
    gantt.clearAll()
  },
  methods: {
    getSettingMilestones() {
      db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('milestones').get().then(milestones => {
          const data = milestones.data()
          this.milestonesSettings = data.milestones ? data.milestones : []
        })
    },
    loadExternalAPI() {
      const script = document.createElement('script')
      script.setAttribute('src', 'https://export.dhtmlx.com/gantt/api.js')
      document.head.appendChild(script)
    },
    ...mapActions({
      setGantt: 'tickets/setGantt',
      setProject: 'tickets/setProject',
      saveUserGanttSettings: 'ganttSettings/saveGanttSettings',
      initUserGanttSettings: 'ganttSettings/initGanttSettings'
    }),
    ...mapActions('cpm/planned/forecasts', [
      'getCurrentFiscalYear',
      'setForecastTasksData',
      'getTaksFromSelectedGantt'
    ]),
    ...mapActions('cpm/planned/gantt', {
      getProjectMilestonesTasksAndLinks: 'getProjectMilestonesTasksAndLinks',
      generateProjectTaskLinks: 'generateProjectTaskLinks'
    }),
    ...mapMutations('cpm/planned/forecasts', {
      setCurrentFiscalYear: 'setFiscalYear'
    }),
    setScale(scale) {
      this.scaleSelected = scale === 0 ? 'day' : 'month'
      this.loadGantt()
    },
    updateGanttExpands(item) {
      new Promise((resolve, reject) => {
        const itemExists = this.ganttExpands.find(g => g.id === item.id)
        if (itemExists) {
          itemExists.open = item.open
        } else {
          this.ganttExpands.push(item)
        }
        resolve()
      })
    },
    updateUserSettings() {
      return new Promise(async (resolve, reject) => {
        try {
          await this.saveUserGanttSettings({
            showMilestones: this.showMilestones,
            ganttExpands: this.ganttExpands
          })
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    },
    gettingUserSettings() {
      return new Promise(async (resolve, reject) => {
        await this.initUserGanttSettings()
        this.showMilestones = Boolean(this.$h.dg(this.userGanttSettings, 'showMilestones'))
        this.ganttExpands = this.$h.dg(this.userGanttSettings, 'ganttExpands', [])
        this.applyGanttExpands()
        resolve()
      })
    },
    applyGanttExpands() {
      this.ganttExpands.map(g => {
        // this.ticketData.find(t => t.id === g.id).$open = g.open
      })
      this.triggerUpdate()
    },
    expandGantt() {
      this.expandTasksOnGantt = !this.expandTasksOnGantt
      this.setHeightGantt()
    },
    getHeightGantt() {
      const aux = {
        height: '500px'
      }
      if (this.expandTasksOnGantt && this.tasks.data.length > 0) {
        const height = (this.tasks.data.length * 35) + 90 + 35
        if (height > 500) {
          aux.height = height + 'px'
        }
      }

      return aux
    },
    getConfigurationLabel() {
      if (this.config) {
        return 'Hide Configuration'
      }
      return 'Show Configuration'
    },
    async openResetMilestone() {
      // get values date
      this.validDates = []
      if (!this.selectedGantt.hasCalculatedDates) {
        return
      }
      this.nameMilestone = this.selectedGantt.milestoneName
      this.daysMilestone = this.selectedGantt.projectStartDateDays

      const find = this.milestonesSettings.find(m => m.name === this.nameMilestone)
      if (find && find.validDates) {
        this.validDates = find.validDates ? find.validDates.map(row => this.$moment(row).format('MM/DD/YYYY')) : []
      }

      this.dialogApplyMilestone = true
    },
    async generateMilestonesToCreate() {
      const milestones = []

      let auxDate = new Date(this.milestoneDateUsa)
      auxDate.setHours(0, 0, 0)
      auxDate.setDate(auxDate.getDate())

      let aux = { ...defaultMilestone }
      aux.title = this.selectedGantt.milestoneName
      aux.in_report = true
      aux.days = 0
      aux.original = auxDate.toISOString()
      aux.gantt = this.selectedGantt.value
      milestones.push(aux)

      let days = parseInt(this.selectedGantt.projectStartDateDays)
      auxDate = new Date(this.milestoneDateUsa)
      auxDate.setHours(0, 0, 0)
      auxDate.setDate(auxDate.getDate())

      auxDate.setDate(auxDate.getDate() - days)

      // Creating Start Date by forcing it
      aux = { ...defaultMilestone }
      aux.title = 'Start Date'
      aux.in_report = true
      aux.days = days
      aux.original = auxDate.toISOString()
      aux.gantt = this.selectedGantt.value
      milestones.push(aux)

      // saving date
      await this.projectRef
        .update({
          startDate: auxDate.toISOString()
        })

      this.selectedGantt.milestoneItems.forEach(element => {
        aux = { ...defaultMilestone }
        aux.title = element.name
        aux.in_report = element.inReport

        auxDate = new Date(this.milestoneDateUsa)
        auxDate.setHours(0, 0, 0)
        auxDate.setDate(auxDate.getDate())

        days = parseInt(element.days)
        if (!element.after) {
          // if it is before
          days = days * -1
        }

        auxDate.setDate(auxDate.getDate() + days)

        aux.original = auxDate.toISOString()
        aux.gantt = this.selectedGantt.value
        milestones.push(aux)
      })
      // save milestones
      await Promise.all(milestones.map(async element => {
        await this.projectRef
          .collection('milestones')
          .add(element)
      }))
    },
    cancelApplyMilestone() {
      this.dialogApplyMilestone = false
      this.milestoneDateUsa = ''
      this.nameMilestone = ''
    },
    async saveApplyMilestone() {
      try {
        if (!this.milestoneDateUsa) {
          this.$snotify.error(
            `The ${this.nameMilestone} date is required`,
            'Error'
          )
          return
        }

        this.loadingMilestone = true
        // Deleting milestones
        await this.deleteMilestonesFromSelectedGantt()

        // create new milestones
        await this.generateMilestonesToCreate()

        const auxDate = new Date(this.milestoneDateUsa)
        await this.resetTimelineGivenMilestone(
          auxDate.toISOString(),
          this.daysMilestone
        )
        this.setFiscalYear()
        this.loadingMilestone = false
        this.cancelApplyMilestone()
        EventBus.$emit('cpm_project_schedule_changed')
      } catch (error) {
        console.error(error)
      }
    },
    async generateTaskLinks() {
      try {
        await this.generateProjectTaskLinks({
          projectId: this.projectId
        })

        await this.getProjectMilestonesTasksAndLinks({
          projectId: this.projectId
        })
        this.debounceForecastsAfterRefresh()
        this.processTableData()
      } catch (e) {
        console.error(e)
      }
    },
    async deleteMilestonesFromSelectedGantt() {
      try {
        const milestones = await this.projectRef
          .collection('milestones')
          .where('gantt', '==', this.selectedGantt.value)
          .get()

        await milestones.docs.forEach(async doc => {
          await doc.ref.delete()
        })
      } catch (e) {
        throw e
      }
    },
    async setFiscalYear() {
      db.collection('cpm_projects')
        .doc(this.projectId)
        .update({
          selectedFiscalYear: this.$h.dg(this.selectedGantt, 'value', '')
        })
      const fiscalYearsByScheduleTypeRef = db.collection('cpm_projects')
        .doc(this.projectId)
        .collection('fiscalYearsByScheduleType')

      fiscalYearsByScheduleTypeRef
        .where('scheduleValue', '==', this.$h.dg(this.selectedGantt, 'value'))
        .get()
        .then(async snap => {
          const data = {
            fiscalYear: this.selectedFiscalYear || {},
            scheduleValue: this.$h.dg(this.selectedGantt, 'value')
          }

          this.setCurrentFiscalYear(this.selectedFiscalYear)

          if (snap.empty) {
            await fiscalYearsByScheduleTypeRef.add(data)
          } else {
            snap.docs.map(async doc => {
              await doc.ref.set(data)
            })
          }

          this.getCurrentFiscalYear({
            projectId: this.projectId
          })
        })
    },
    setHeightGantt() {
      this.ganttStyle = this.getHeightGantt()
      // Refreshing gantt
      this.$nextTick(() => {
        this.loadGantt()
      })
    },
    async setSelectedGantt(value, dontSetHeight = true) {
      await this.projectRef
        .update({
          selectedGantt: value
        })
      this.getProjectMilestonesTasksAndLinks({
        projectId: this.projectId
      }).then(() => {
        this.processTableData()
      })
      this.setGantt(value)
      this.expandTasksOnGantt = false
      this.getCurrentFiscalYear({
        projectId: this.projectId
      })
      this.getTaksFromSelectedGantt({
        projectId: this.projectId
      })
      if (dontSetHeight) this.setHeightGantt()
    },
    getFullYear() {
      const aux = new Date()
      return parseInt(aux.getFullYear())
    },
    closeTask() {
      this.$store.dispatch('tickets/closeModal')
      // this.processTableData()
    },
    isoToDate(date) {
      date = date.replace(/\D/g, ' ')
      const dtcomps = date.split(' ')
      dtcomps[1]--
      return new Date(Date.UTC(dtcomps[0], dtcomps[1], dtcomps[2], +18))
    },
    updateGantt() {
      this.loadGantt()
    },
    triggerUpdate() {
      this.runUpdate(this)
    },
    runUpdate: _.debounce(vm => {
      vm.processTableData()
    }, 400),
    processTableData() {
      this.loadingTasks = true
      let tasks = {}
      tasks = _.cloneDeep(this.tasks)
      gantt.clearAll()

      this.todayMarker = gantt.addMarker({
        start_date: new Date(),
        css: 'today',
        text: 'Now',
        title: format(new Date(), 'YYYY-MM-DD')
      })
      // Refresh the 'Now' marker every hour
      setInterval(() => {
        const today = gantt.getMarker(this.todayMarker)
        today.start_date = new Date()
        today.title = format(today.start_date, 'YYYY-MM-DD')
        gantt.updateMarker(this.todayMarker)
      }, 1000 * 60 * 60)


      if (this.showMilestones) {
        this.milestones.forEach(m => {
          m.text = m.title
          m.start_date = m.original
          m.duration = 1
          m.is_milestone = true
          // m.readonly = true;
          gantt.addMarker({
            start_date: this.isoToDate(m.original),
            css: 'milestone'
          })
          m.type = gantt.config.types.milestone
          tasks.data.push(m)
        })
      }

      this.assignColorsToTask(tasks)

      gantt.parse(tasks)
      gantt.refreshData()
      this.$forceUpdate()

      this.loadingTasks = false
    },
    trimSpaces(auxString) {
      return auxString.replace(/^\s+|\s+$/gm, '')
    },
    assignColorsToTask(tasks) {
      tasks.data.map(task => {
        const auxTask = this.defaultTasks.find(defaultTask => {
          if (task.title && defaultTask.name) {
            return (
              this.trimSpaces(task.title.toLowerCase()) ===
              this.trimSpaces(defaultTask.name.toLowerCase())
            )
          } else {
            return false
          }
        })
        if (auxTask && auxTask.color) {
          task.color = auxTask.color.hex
        }
      })
    },
    loadGantt() {
      gantt.plugins({
	      auto_scheduling: true,
	      fullscreen: true,
        marker: true,
        quick_info: true,
        tooltip: true
      })

      gantt.showLightbox = id => {
        const task = gantt.getTask(id)
        if (task.is_milestone) return
        this.$store.dispatch('tickets/showTicket', id)
      }
      // TEMPLATES
      gantt.templates.task_text = function (start, end, task) {
        return task.title
      }
      gantt.templates.leftside_text = function (start, end, task) {
        if (task.is_milestone) {
          return task.title
        }
        return task.status
      }

      gantt.templates.xml_date = function (date) {
        if (date === undefined || date === '') {
          return new Date()
        }

        if (date.seconds) {
          const aux = new Date(Date.parse(date.seconds))
          aux.setHours(0, 0, 0)
          return aux
        }

        return new Date(date.substring(0, 10) + ' 00:00:00')
      }
      gantt.templates.tooltip_text = (start, end, task) => {
        const budgetCurrentFiscalYearValue = this.$h.dg(this.budgetFiscalYear, 'value', '')
        let budget = 0
        budget = this.budgets[budgetCurrentFiscalYearValue] * (task.budgetPercentage / 100)
        const formattedBudget = this.$options.filters.currency(budget)

        if (start && task.duration) {
          const duration = task.duration
          const result = new Date(start)
          result.setDate(result.getDate() + duration)
          end = result
        }

        return (
          '<b>Task:</b> ' +
          task.title +
          '<br/><b>Start Date:</b> ' +
          format(task.start_date, 'MM/DD/YYYY') +
          '<br/><b>End Date:</b> ' +
          (!isNaN(new Date(end)) ? format(end, 'MM/DD/YYYY') : 'None') +
          '<br/><b>Calculated budget:</b> ' +
          formattedBudget
        )
      }
      gantt.templates.task_class = function (start, end, task) {
        let today = new Date()
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const taskDate = new Date(
          end.getFullYear(),
          end.getMonth(),
          end.getDate(),
          -1
        )
        const taskDate2 = new Date(
          end.getFullYear(),
          end.getMonth(),
          end.getDate()
        )
        if (task.is_milestone) {
          return 'task-milestone'
        } else if (gantt.hasChild(task.id)) {
          return 'task-activity'
        } else if (
          taskDate2.getTime() === today.getTime() &&
          task.progress < 1
        ) {
          return 'task-yellow'
        } else if (taskDate.getTime() < today.getTime() && task.progress < 1) {
          return 'task-red'
        } else {
          return 'task-green'
        }
      }
      // CONFIG
      const editors = {
        predecessors: { type: 'predecessor', map_to: 'auto' }
      }
      gantt.config.columns = [
        { name: 'wbs', label: 'Index', width: 40, template: gantt.getWBSCode }
      ]
      if (this.columns.title) {
        gantt.config.columns.push({
          name: 'title',
          label: 'Activity name',
          tree: true,
          width: 170,
          resize: true
        })
      }
      if (this.columns.startDate) {
        gantt.config.columns.push({
          name: 'start_date',
          label: 'Start Date',
          width: 110,
          template: function (obj) {
            return format(obj.start_date, 'MM/DD/YYYY')
          }
        })
      }
      if (this.columns.endDate) {
        gantt.config.columns.push({
          name: 'end_date',
          label: 'End Date',
          width: 110,
          template: function (obj) {
            return format(obj.due_date, 'MM/DD/YYYY')
          }
        })
      }
      if (this.columns.duration) {
        gantt.config.columns.push({
          name: 'duration',
          width: 60,
          template: function (obj) {
            return obj.duration + ' days'
          }
        })
      }
      if (this.columns.predecessors) {
        gantt.config.columns.push({
          name: 'predecessors',
          label: 'Predecessors',
          width: 100,
          editor: editors.predecessors,
          template: task => {
            const labels = []
            if (this.ticketsAvailables.length && this.milestones.length) {
              const links = task.$target
              for (let i = 0; i < links.length; i++) {
                const link = gantt.getLink(links[i])
                const pred = gantt.getTask(link.source)
                labels.push(gantt.getWBSCode(pred))
              }
            }
            return labels.join(', ')
          }
        })
      }
      if (this.columns.assignee) {
        gantt.config.columns.push({
          name: 'assignee',
          label: 'Resource Name',
          width: 155,
          template: obj => {
            if (
              obj.assignee !== undefined &&
              obj.assignee !== null &&
              obj.assignee.constructor === Array
            ) {
              axios
                .get(
                  `${this.axiosSettings.baseUrl}/api/project/${this.projectId}/tasks/${obj.id}/assignee/`,
                  this.axiosSettings.config
                )
                .then(response => {
                  obj.assignee = response.data.assignee
                  gantt.refreshData()
                })
                .catch(e => {
                  console.error(e)
                })
            }
            return typeof obj.assignee === 'string' ? obj.assignee : ''
          }
        })
      }
      if (this.columns.hours) {
        gantt.config.columns.push({
          name: 'hours',
          label: 'Man Hours',
          width: 85,
          template: function (obj) {
            return obj.hours ? obj.hours + ' hours' : ''
          }
        })
      }
      if (this.columns.progress) {
        gantt.config.columns.push({
          name: 'progress',
          label: 'Progress',
          width: 85,
          template: function (obj) {
            return obj.progress ? parseInt(obj.progress * 100) + ' %' : '0%'
          }
        })
      }

      gantt.config.work_time = false

      switch (this.scaleSelected) {
        case 'day':
          gantt.config.work_time = false
          gantt.config.scale_unit = 'day'
          gantt.config.step = 1
          gantt.config.date_scale = '%d %M, %D'
          gantt.config.min_column_width = 70
          gantt.config.scale_height = 90
          gantt.config.show_errors = false
          gantt.config.subscales = []
          break
        case 'month':
          gantt.config.work_time = false
          gantt.config.scale_unit = 'month'
          gantt.config.step = 1
          gantt.config.date_scale = '%M,%Y'
          gantt.config.min_column_width = 70
          gantt.config.scale_height = 90
          gantt.config.show_errors = false
          gantt.config.subscales = []
          break
        case 'quarter':
          gantt.config.scale_unit = 'month'
          gantt.config.date_scale = '%F'
          var monthScaleTemplate = function(date) { // eslint-disable-line
            const dateToStr = gantt.date.date_to_str('%M %Y')
            const endDate = gantt.date.add(date, 2, 'month')
            return dateToStr(date) + ' - ' + dateToStr(endDate)
          }
          gantt.config.subscales = [
            { unit: 'month', step: 3, template: monthScaleTemplate }
          ]
          gantt.config.scale_height = 50
          gantt.templates.date_scale = null
          break

        case 'year':
          gantt.config.scale_unit = 'year'
          gantt.config.step = 1
          gantt.config.date_scale = '%Y'
          gantt.config.min_column_width = 50
          gantt.config.scale_height = 90
          gantt.templates.date_scale = null
          gantt.config.subscales = []
          break
      }

      gantt.config.tooltip_offset_x = 30
      gantt.config.tooltip_offset_y = 0
      gantt.config.sort = true
      gantt.config.order_branch = true
      gantt.config.order_branch_free = true

      gantt.config.layout = {
        css: 'gantt_container',
        cols: [
          {
            width: this.columns.width,
            min_width: 300,
            rows: [
              {
                view: 'grid',
                scrollX: 'gridScroll',
                scrollable: true,
                scrollY: 'scrollVer'
              },
              { view: 'scrollbar', id: 'gridScroll', group: 'horizontal' }
            ]
          },
          { resizer: true, width: 1 },
          {
            rows: [
              { view: 'timeline', scrollX: 'scrollHor', scrollY: 'scrollVer' },
              { view: 'scrollbar', id: 'scrollHor', group: 'horizontal' }
            ]
          },
          { view: 'scrollbar', id: 'scrollVer' }
        ]
      }
      gantt.templates.scale_cell_class = date => {
        let className = 'no-fiscal-year'
        if (
          this.yearsAvailables[date.getFullYear()] &&
          this.yearsAvailables[date.getFullYear()][date.getMonth()]
        ) {
          className = this.yearsAvailables[date.getFullYear()][date.getMonth()]
        }
        return className
      }
      gantt.templates.timeline_cell_class = (item, date) => {
        // a fiscal year is from october to september
        const initialDate = new Date(this.fiscalYear, 9, 1)
        const endDate = new Date(this.fiscalYear + 1, 8, 30)
        if (date >= initialDate && date <= endDate) {
          return 'fiscal-year'
        }
        return 'no-fiscal-year'
      }
      gantt.templates.task_text = function (start, end, task) {
        return '<span style=\'color:black\'>' + task.title + '</span>'
      }
      // gantt.locale.labels.confirm_link_deleting = "Link will be deleted, are you sure?"
      // EVENTS
      gantt.attachEvent('onParse', () => {
        gantt.sort('start_date')
        gantt.sort((a, b) => {
          const aDate = new Date(a.start_date)
          const bDate = new Date(b.start_date)
          if (aDate < bDate) {
            return -1
          }
          if (aDate > bDate) {
            return 1
          }
          // Ordering by if it is milestone to putting it first
          // A & b are the same
          if (a.is_milestone && !b.is_milestone) {
            return -1
          } else if (!a.is_milestone && b.is_milestone) {
            return 1
          }
          // A & b are the same and are milestone
          return 0
        })
      })
      // Delente onTaskDblClick if you want to open the task popup with double click
      gantt.attachEvent('onTaskDblClick', (id, item) => {
        // gantt.hideQuickInfo();
        // this.moveTaskLinked(item)
      })
      gantt.attachEvent('onAfterLinkAdd', (id, item) => {
        this.debounceOnAfterLinkAdd(item)
        // this.moveTaskLinked(item)
      })
      gantt.attachEvent('onAfterLinkDelete', id => {
        this.projectRef
          .collection('taskLinks')
          .doc(id)
          .delete()
          .then(() => {
            this.debounceGetMilestonesTasksAndLinks()
          })
      })
      gantt.attachEvent('onAfterTaskUpdate', (id, item) => {
        this.projectRef
          .collection('tasks')
          .doc(id)
          .update({
            progress: item.progress ? item.progress : 0,
            duration: item.duration,
            start_date: format(item.start_date, 'YYYY-MM-DD') + 'T00:00:00.000Z',
            due_date: new Date(item.end_date).toISOString()
          })
          .then(() => {
            gantt.autoSchedule()
            this.debounceForecastsAfterRefresh()
            // gantt.refreshData()
          })

        this.debounceGetMilestonesTasksAndLinks()
      })
      gantt.attachEvent('onBeforeTaskDrag', function (id) {
        if (gantt.getTask(id).is_milestone) {
          return false
        }
        return true
      })

      gantt.attachEvent('onTaskClick', async (id, e) => {
        if (e.target.className === 'gantt_tree_icon gantt_close') {
          await this.updateGanttExpands({ id, open: false })
          await this.updateUserSettings()
        } else if (e.target.className === 'gantt_tree_icon gantt_open') {
          await this.updateGanttExpands({ id, open: true })
          await this.updateUserSettings()
        }

        return true
      })
      gantt.attachEvent('onAfterTaskDelete', async (id, item) => {
        const children = this.tasks.data.filter(task => this.$h.dg(task, 'parent') === id).map(task => task.id)
        const tasksToDelete = [id, ...children]
        await Promise.all(tasksToDelete.map(async taskId => {
          this.projectRef
            .collection('tasks')
            .doc(taskId)
            .delete()
        }))
        this.debounceGetMilestonesTasksAndLinks()
        this.debounceForecastsAfterRefresh()
      })

      this.assignColorsToTask(this.tasks)

	    gantt.config.drag_project = true
	    gantt.config.auto_scheduling = true
	    gantt.config.auto_scheduling_strict = true
	    gantt.config.auto_scheduling_compatibility = true
	    // gantt.config.auto_scheduling_descendant_links = true;
      gantt.config.open_tree_initially = true
      gantt.config.cascade_delete = true
      gantt.init(document.getElementById('gantt-container'))
      gantt.parse(this.tasks)
    },
    deleteAllTasksFromProjects(tasks) {
      const auxPromise = new Promise(async (resolve, reject) => {
        try {
          // Deleting all tasks from the project
          if (tasks.empty) {
            resolve(true)
          }
          await tasks.docs.forEach(async d => {
            const auxTask = d.data()
            // Deleting the tasks of the gantt selected
            if (
              (!auxTask.gantt && this.selectedGantt.value === 'default') ||
              auxTask.gantt === this.selectedGantt.value
            ) {
              await d.ref.delete()
            }
          })
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return auxPromise
    },
    saveTask(task, taskDate, type = 'add') {
      const auxPromise = new Promise(async (resolve, reject) => {
        try {
          if (type === 'add') {
            // Saving task
            task.start_date = taskDate
            task.showTicket = false

            if (
              task.budgetFiscalYear &&
              task.budgetPercentage &&
              this.budgets[task.budgetFiscalYear.value]
            ) {
              const base = this.budgets[task.budgetFiscalYear.value]
              const budgetPercentage = parseFloat(task.budgetPercentage) / 100
              task.budget = budgetPercentage * base
            }

            const returnPayload = await this.$store.dispatch(
              'tickets/addNew',
              task
            )
            // Adding subtaks
            if (task.cat_1 && task.cat_1.length > 0) {
              let newDate = new Date(taskDate)

              for (let i = 0; i < task.cat_1.length; i++) {
                const subtask = task.cat_1[i]

                subtask.start_date = newDate.toISOString()
                subtask.showTicket = false
                subtask.parent = returnPayload.taskId
                subtask.parentTask = {
                  id: returnPayload.taskId,
                  title: returnPayload.taskTitle
                }

                if (
                  subtask.budgetFiscalYear &&
                  subtask.budgetPercentage &&
                  this.budgets[subtask.budgetFiscalYear.value]
                ) {
                  const base = this.budgets[subtask.budgetFiscalYear.value]
                  const budgetPercentage =
                    parseFloat(subtask.budgetPercentage) / 100
                  subtask.budget = budgetPercentage * base
                }

                let duration = 0
                // Find duration of the task
                if (subtask.gantts.length > 0) {
                  const gantt = subtask.gantts.find(auxGantt => this.selectedGantt.value === auxGantt.gantt.value)

                  if (gantt) {
                    duration = gantt.duration
                  }
                }

                subtask.duration = duration

                await this.$store.dispatch('tickets/addNew', subtask)

                newDate = newDate.setDate(
                  newDate.getDate() + parseInt(subtask.duration)
                )
                newDate = new Date(newDate)
              }

              resolve(true)
            } else {
              resolve(true)
            }
          } else {
            await this.projectRef
              .collection('tasks')
              .doc(task.id)
              .update({
                start_date: taskDate
              })
            resolve(true)
          }
        } catch (error) {
          reject(error)
        }
      })
      return auxPromise
    },
    saveAllTasks(tasks = [], taskDate) {
      const auxPromise = new Promise(async (resolve, reject) => {
        try {
          let taskDateAux = taskDate

          const dates = []
          dates.push(taskDate)
          tasks.forEach(async task => {
            const newDate = new Date(taskDateAux)
            newDate.setDate(newDate.getDate() + parseInt(task.duration))
            taskDateAux = newDate.toISOString()
            dates.push(taskDateAux)
          })

          await Promise.all(tasks.map(async (task, index) => {
            await this.saveTask(task, dates[index])
          }))
          this.generateTaskLinks()

          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return auxPromise
    },
    async resetTimelineGivenDate(initialDate, projectRef) {
      if (this.$h.dg(this.tasks, 'data', []).length) {
        const tasks = await projectRef.collection('tasks').get()

        await this.deleteAllTasksFromProjects(tasks)
        // Getting the new ones
        if (
          this.tasksByGantts[this.selectedGantt.value].tasks &&
          this.tasksByGantts[this.selectedGantt.value].tasks.length > 0
        ) {
          const taskDate = initialDate
          await this.saveAllTasks(
            this.tasksByGantts[this.selectedGantt.value].tasks,
            taskDate
          )
          await this.projectRef
            .update({ setDefaultSchedule: false })

          this.$snotify.success('The timeline has been reset', 'Succcess')
        }
      } else {
        if (
          this.tasksByGantts[this.selectedGantt.value].tasks &&
          this.tasksByGantts[this.selectedGantt.value].tasks.length > 0
        ) {
          const taskDate = initialDate

          await this.saveAllTasks(
            this.tasksByGantts[this.selectedGantt.value].tasks,
            taskDate
          )
          await this.projectRef
            .update({ setDefaultSchedule: false })
          this.$snotify.success('The timeline has been reset', 'Succcess')
        }
      }
    },
    async confirmReset() {
      const response = confirm(
        'Resetting the timeline will revert all changes and restore the default schedule. This process is irreversible. \nWould you like to continue?'
      )

      if (!response) {
        return
      }
      await this.resetTimeline()
    },
    async resetTimeline() {
      const doc = await this.projectRef
        .get()
      const projectObj = doc.data()
      projectObj.id = doc.id
      projectObj.ref = doc.ref
      this.$store.dispatch('tickets/setProject', projectObj)

      if (projectObj.startDate === undefined || projectObj.startDate === '') {
        let msg = 'Project Start Date is Required'
        if (this.appLabel.singular === 'Opportunity') {
          msg = 'Date Created is Required'
        }
        this.$snotify.error(msg, 'Error')
        return
      }

      await this.resetTimelineGivenDate(projectObj.startDate, projectObj.ref)
    },
    async resetTimelineGivenMilestone(dateString = '', daysBefore = 0) {
      const aux = new Promise(async (resolve, reject) => {
        try {
          if (
            daysBefore !== '' &&
            !isNaN(Date.parse(dateString)) // Is a number and valid date
          ) {
            const days = parseInt(daysBefore)

            const auxDate = new Date(dateString)
            auxDate.setDate(auxDate.getDate() - days)

            await this.resetTimelineGivenDate(auxDate.toISOString(), this.projectRef)
          } else {
            // No Date on
            await this.resetTimeline()
          }
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    saveTaskIntoGantt(task) {
      if (task.gantts && task.gantts.length > 0) {
        const newTaskParents = {}

        // Adding parent
        for (let i = 0; i < task.gantts.length; i++) {
          const element = task.gantts[i]
          const aux = {
            duration: element.duration,
            name: task.name,
            cat_1: []
          }

          if (element.budgetFiscalYear && element.budgetPercentage) {
            aux.budgetFiscalYear = element.budgetFiscalYear
            aux.budgetPercentage = element.budgetPercentage
          }
          // check for children
          if (task.cat_1 && task.cat_1.length > 0) {
            for (let j = 0; j < task.cat_1.length; j++) {
              const elementChild = task.cat_1[j]
              // check for gantts in the children
              if (elementChild.gantts && elementChild.gantts.length > 0) {
                for (let k = 0; k < elementChild.gantts.length; k++) {
                  const ganttChild = elementChild.gantts[k]
                  // If the children and parent has the same gantt can be its son
                  if (ganttChild.gantt.value === element.gantt.value) {
                    if (
                      ganttChild.budgetFiscalYear &&
                      ganttChild.budgetPercentage
                    ) {
                      elementChild.budgetFiscalYear =
                        ganttChild.budgetFiscalYear
                      elementChild.budgetPercentage =
                        ganttChild.budgetPercentage
                    }
                    elementChild.duration = ganttChild.duration

                    aux.cat_1.push(elementChild)
                  }
                  // else {
                  // Not adding repeated
                  // if (!newTaskParents[ganttChild.gantt.value]) {
                  //   // If the children and parent has not the same gantt
                  //   let newParent = {
                  //     duration: elementChild.duration,
                  //     name: elementChild.name
                  //   };

                  //   if (
                  //     ganttChild.budgetFiscalYear &&
                  //     ganttChild.budgetPercentage
                  //   ) {
                  //     newParent.budgetFiscalYear =
                  //       ganttChild.budgetFiscalYear;
                  //     newParent.budgetPercentage =
                  //       ganttChild.budgetPercentage;
                  //   }
                  //   newTaskParents[ganttChild.gantt.value] = newParent;
                  // }
                  // }
                }
              }
            }
          }

          if (this.tasksByGantts[element.gantt.value]) {
            this.tasksByGantts[element.gantt.value].tasks.push(aux)
          }
        }

        // check for new taskParents
        for (let i = 0; i < Object.keys(newTaskParents).length; i++) {
          const key = Object.keys(newTaskParents)[i]
          const element = newTaskParents[key]
          if (this.tasksByGantts[key]) {
            this.tasksByGantts[key].tasks.push(element)
          }
        }
      }
    },
    loadDefaultTasksAndSettings() {
      const aux = new Promise((resolve, reject) => {
        try {
          db.collection('settings')
            .doc(this.company_id)
            .collection(`${this.settingCollectionName}`)
            .doc(this.appLabel.settingsCollection)
            .get()
            .then(snap => {
              // load settings for the gantts
              this.ganttsSettings = snap.data().gantts

              // creating hash
              for (let i = 0; i < this.ganttsSettings.length; i++) {
                const element = this.ganttsSettings[i]
                this.tasksByGantts[element.value] = element
                this.tasksByGantts[element.value].tasks = []
              }

              // query for getting the labels on exporting
              db.collection('settings')
                .doc(this.company_id)
                .collection(`${this.settingCollectionName}`)
                .doc(this.appLabel.scheduleCollection)
                .get()
                .then(snap => {
                  const defaultSchedule = snap.data()
                  const aux = []

                  defaultSchedule.tasks.forEach((task, index) => {
                    task.id = index
                    aux.push(task)
                    // Saving into hash
                    this.saveTaskIntoGantt(task)

                    if (task.cat_1 && task.cat_1.length > 0) {
                      task.cat_1.forEach(cat1 => {
                        aux.push(cat1)
                      })
                    }
                  })

                  // For exporting into the labels excel
                  this.defaultTasks = aux
                  this.processTableData()
                  resolve(true)
                })
            })
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    async setDefaultTasks(taskDate) {
      this.ganttsSettings.forEach(async ganttSettings => {
        this.setSelectedGantt(ganttSettings)

        await this.saveAllTasks(ganttSettings.tasks, taskDate).then(() => {
          this.projectRef
            .update({ setDefaultSchedule: false })
            .then(() => {})
        })
      })
    },
    saveExportingGantt(selectedGantt) {
      this.projectRef
        .update({ selectedGantt })
        .then(() => {})
    },
    getBudgets() {
      axios
        .get(
          `${this.axiosSettings.baseUrl}/api/project/${this.projectId}/get-budgets-by-fiscal-year/`,
          this.axiosSettings.config
        )
        .then(response => {
          this.budgets = response.data.budgets
        })
        .catch(e => {
          console.error(e)
        })
    },
    getFiscalYears() {
      const aux = new Promise((resolve, reject) => {
        try {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection(`${this.settingCollectionName}`)
            .doc('projects')
            .get()
            .then(snap => {
              if (snap.exists) {
                const settings = snap.data()
                this.fiscalYears = this.$h.dg(settings, 'fiscalYears', [])
              }

              resolve(true)
            })
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    getBudgetFiscalYear() {
      const fiscalYearsByScheduleTypeRef = db.collection('cpm_projects')
        .doc(this.projectId)
        .collection('fiscalYearsByScheduleType')
        .where('scheduleValue', '==', this.$h.dg(this.selectedGantt, 'value'))

      fiscalYearsByScheduleTypeRef
        .get()
        .then(snap => {
          if (!snap.empty) {
            const data = this.$h.dg(snap.docs[0].data(), 'fiscalYear', null)
            this.budgetFiscalYear = data
          }
        })
    },
    printFromVue(mode) {
      if (gantt && typeof gantt.exportToPNG === 'function') {
        gantt.exportToPNG({
          callback: ({ url }) => {
            if (mode === 'print') {
              this.printImage(url)
            } else if (mode === 'share') {
              this.$emit('showShareModal', url)
            }
          }
        })
      }
    },
    printImage(src) {
      const win = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0')
      win.document.open()
      win.document.write([
        '<html>',
        '   <body onload="window.print()" onafterprint="window.close()">',
        '       <img src="' + src + '"/>',
        '   </body>',
        '</html>'
      ].join(''))
      win.document.close()
    },
    async moveTaskLinked(item) {
      const source = await this.projectRef
        .collection('tasks')
        .doc(item.source).get()
      const info = source.data()

      const target = await this.projectRef
        .collection('tasks')
        .doc(item.target).get()
      const infoTarget = target.data()

      const result = new Date(info.due_date)
      result.setDate(result.getDate() + infoTarget.duration)

      target.ref.update({
        start_date: info.due_date,
        end_date: new Date(result).toISOString(),
        due_date: new Date(result).toISOString()
      })

      const data = this.tasks.data.find(row => row.id == target.id)
      const links = data.$source
      for (let i = 0; i < links.length; i++) {
        const link = gantt.getLink(links[i])
        this.moveTaskLinked(link)
      }
    },
    debounceGetMilestonesTasksAndLinks: _.debounce(function () {
      this.getProjectMilestonesTasksAndLinks({
        projectId: this.projectId
      })
    }, 1000),
    debounceOnAfterLinkAdd: _.debounce(function (link) {
      link.gantt = this.$h.dg(this.selectedGantt, 'value')
      this.projectRef
        .collection('taskLinks')
        .add(link)
    }, 1000),
    debounceForecastsAfterRefresh: _.debounce(function (link) {
      if (this.isPlannedProject) {
        this.setForecastTasksData({
          projectId: this.projectId
        })
      }
    }, 1000)
  }
}
</script>

<style lang="scss">
@import '~dhtmlx-gantt/codebase/dhtmlxgantt.css';
@import '~dhtmlx-gantt/codebase/skins/dhtmlxgantt_material.css';

.data-loading {
  position: absolute;
  z-index: 99;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
}

.slider-config-width {
  margin-bottom: -35px;
  z-index: 2;
}

.gantt_grid_data .gantt_row.odd,
.gantt_grid_data .gantt_row {
  box-shadow: inset 0 -1px 0 0 rgba(100, 121, 143, 0.122);
}

.gantt_grid_data .gantt_row.odd:hover,
.gantt_grid_data .gantt_row:hover {
  background-color: transparent;
  box-shadow: inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0,
    0 1px 2px 0 rgba(60, 64, 67, 0.3),
    inset 0 -1px 0 0 rgba(100, 121, 143, 0.122);
  z-index: 1;
}

.gantt_grid_editor_placeholder {
  background: #fff;
  z-index: 2;
}

.task-modal-overlay {
  width: 500%;
  height: 500%;
  position: absolute;
  top: -50%;
  left: -50%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99;
}

.custom-modal {
  overflow-y: auto;
  position: absolute;
  top: 0;
  left: 0;
  background: rgb(255, 255, 255);
  z-index: 999;
  width: 100%;
  height: 90vh;
  max-height: 90%;
}

.status-circle {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
}

.task-milestone {
  background: url(/sites/all/themes/m6connect/images/milestone-diamond.png)
    no-repeat center center;
  background-size: contain;
  z-index: 2;
  border: none;

  .gantt_task_content {
    color: transparent;
    padding: 0;
    z-index: 2;
  }
  .gantt_side_content.gantt_left {
    color: #265a7f;
    font-weight: bold;
    z-index: 1;
  }

  &.gantt_task_line {
    .gantt_task_drag,
    .gantt_task_progress_drag {
      display: none !important;
    }
  }
}

.task-activity {
  border: 2px solid #404040;
  border-bottom: none;
  border-radius: 0;
  background-color: transparent;

  .gantt_task_content {
    color: #404040;
  }
}
.task-red {
  background-color: #fb3b3b;
  .gantt_task_progress {
    background: #e50505;
  }
}
.task-green {
  background-color: #66cd00;
  .gantt_task_progress {
    background: #0e8f67;
  }
}
.task-yellow {
  background-color: #ffda3e;
  .gantt_task_progress {
    background: #d8ad00;
  }
}

.fiscal-year {
  background: #f4f7f4 !important;
}

.no-fiscal-year {
  background: none !important;
}

.gantt_grid .gantt_grid_scale .gantt_grid_head_cell {
  font-size: 12px;
}
.gantt_modal_box {
  width: 270px;
}
.gantt_marker {
  width: 1px;

  .gantt_marker_content {
    top: 5%;
    transition: all 0.25s;

    &:hover {
      transform: scale(1.6);
      opacity: 1;
    }
  }

  &.milestone {
    background-color: #404040;

    .gantt_marker_content {
      top: 20%;
      background: green;
      opacity: 0.7;
      max-width: 22px;
      transform: rotate(45deg) scale(1);
      overflow: hidden;
      color: green;
      margin-left: 5px;

      &:hover {
        animation: milestone 0.4s forwards;
      }
    }
  }
}

@keyframes milestone {
  50% {
    transform: rotate(0) scale(1.2);
    max-width: 22px;
    color: green;
  }
  100% {
    transform: rotate(0) scale(1.4);
    color: #fff;
    max-width: 800px;
  }
}
</style>


<style lang="scss" scoped>
  .gantt-header {
    background-color: white;
    border: 1px solid #ebebeb;
    border-bottom: none;
  }

  .gantt-header-item {
    display: flex;
  }
  .scheduleTypesTable {
    padding: 5px;
    width: 100%;

    th {
      background: #CCC;
    }

    td {
      padding: 5px;
    }
  }
</style>

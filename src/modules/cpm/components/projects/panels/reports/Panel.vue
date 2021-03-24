<template>
  <v-card
    id="reports"
    class="cpm-panel"
  >
    <v-card-title class="pa-0">
      <v-toolbar
        color="green"
        dark
        flat
        style="z-index:99;"
      >
        <h3 class="headline mb-0">
          Reports
        </h3>
      </v-toolbar>
    </v-card-title>

    <v-card-text class="pa-0 vertical-scroll">
      <v-container
        class="check-options-container pa-0 rounded-lg"
        grid-list-xs
        style="width: 100%;"
      >
        <v-row
          justify="space-between"
        >
          <v-col
            class="steps-label"
            md="3"
          >
            1. Select a project
          </v-col>
          <v-col md="9">
            <v-card
              class="rounded-lg"
              flat
            >
              <v-card-text class="vertical-scroll">
                <label>Choose Project(s)</label>
                <v-autocomplete
                  v-model="options.projects"
                  chips
                  item-value="id"
                  :items="projects"
                  multiple
                  return-object
                  @input="changeReports"
                >
                  <template v-slot:selection="{ item, index, selected }">
                    <v-chip
                      close
                      :selected="selected"
                      @input="remove(item)"
                    >
                      {{ item.number }} - {{ item.title }}
                    </v-chip>
                  </template>
                  <template v-slot:item="{ item, index }">
                    {{ item.number }} - {{ item.title }}
                  </template>
                </v-autocomplete>
                <v-btn
                  class="ma-0"
                  small
                  text
                  @click="selectAllProjects"
                >
                  Select All
                </v-btn>
                <v-btn
                  class="ma-0"
                  small
                  text
                  @click="options.projects = []"
                >
                  Clear
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            class="steps-label"
            md="3"
          >
            2. Select attributes
          </v-col>
          <v-col md="4">
            <v-card
              class="rounded-lg"
              flat
            >
              <v-card-text class="vertical-scroll">
                <label>{{ appLabel.singular }} Manager</label>
                <v-select
                  v-model="managerFilter"
                  item-text="label"
                  :items="alphabetical(users.projectManager, 'asc', 'label')"
                  multiple
                  return-object
                  @input="filterManager"
                >
                  <template
                    slot="option"
                    slot-scope="option"
                  >
                    {{ option.label }}
                  </template>
                  <template slot="no-options">
                    type to search users..
                  </template>
                </v-select>
                <v-btn
                  class="ma-0"
                  small
                  text
                  @click="selectAllManagers"
                >
                  Select All
                </v-btn>
                <v-btn
                  class="ma-0"
                  small
                  text
                  @click="managerFilter = []"
                >
                  Clear
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col md="5">
            <v-card
              class="rounded-lg"
              flat
            >
              <v-card-text class="vertical-scroll">
                <label>Campus</label>
                <v-select
                  v-model="campusFilter"
                  item-text="name"
                  :items="alphabetical(campus, 'asc', 'name')"
                  multiple
                  return-object
                  @input="filterCampus"
                >
                  <template
                    slot="option"
                    slot-scope="option"
                  >
                    {{ option.name }}
                  </template>
                  <template slot="no-options">
                    type to search users..
                  </template>
                </v-select>
                <v-btn
                  class="ma-0"
                  small
                  text
                  @click="selectAllCampus"
                >
                  Select All
                </v-btn>
                <v-btn
                  class="ma-0"
                  small
                  text
                  @click="campusFilter = []"
                >
                  Clear
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer md3 />
          <v-col md="4">
            <v-card
              class="rounded-lg"
              flat
            >
              <v-card-text class="vertical-scroll">
                <label>Project Types</label>
                <v-select
                  v-model="projectTypes"
                  :items="alphabetical(settings.projectTypes, 'asc')"
                  multiple
                  @input="filterByProjectTypes"
                >
                  <template
                    slot="option"
                    slot-scope="option"
                  >
                    {{ option.label }}
                  </template>
                </v-select>
                <v-btn
                  class="ma-0"
                  small
                  text
                  @click="selectAllProjectTypes"
                >
                  Select All
                </v-btn>
                <v-btn
                  class="ma-0"
                  small
                  text
                  @click="projectTypes = []"
                >
                  Clear
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col md="5">
            <v-card
              class="rounded-lg"
              flat
            >
              <v-card-text class="vertical-scroll">
                <label>Project Status</label>
                <v-select
                  v-model="projectStatus"
                  :items="alphabetical(settings.status, 'asc')"
                  multiple
                  @input="filterByStatus"
                />
                <v-btn
                  class="ma-0"
                  small
                  text
                  @click="selectAllProjectStatus"
                >
                  Select All
                </v-btn>
                <v-btn
                  class="ma-0"
                  small
                  text
                  @click="projectStatus = []"
                >
                  Clear
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row
          align="center"
        >
          <v-spacer />
          <v-col
            class="pl-3"
            md="3"
          >
            <v-checkbox
              v-model="selectAMonth"
              label="Filter Comments by Month"
            />
          </v-col>
          <v-spacer v-show="!selectAMonth" />
          <v-spacer v-show="!selectAMonth" />

          <v-col
            v-show="selectAMonth"
            md="3"
          >
            <v-card
              class="rounded-lg"
              flat
            >
              <v-card-text class="vertical-scroll">
                <label>Choose Month</label>
                <v-select
                  v-model="dateSelected.month"
                  item-text="label"
                  item-value="id"
                  :items="dates.months"
                />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            v-show="selectAMonth"
            md="3"
          >
            <v-card
              class="rounded-lg"
              flat
            >
              <v-card-text class="vertical-scroll">
                <label>Choose Year</label>
                <v-select
                  v-model="dateSelected.year"
                  :items="dates.years"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row
          align="center"
        >
          <v-col md="3" />
          <v-col
            class="pl-3"
            md="3"
          >
            <v-checkbox
              v-model="selectFiscalYear"
              label="Filter by Fiscal Year"
            />
          </v-col>
          <v-col
            v-show="selectFiscalYear"
            class="md3"
          >
            <label>Forecasted Fiscal Year</label>
            <v-select
              v-model="fiscalYearSelected"
              color="blue"
              item-text="name"
              item-value="value"
              :items="fiscalYears"
            >
              <template
                slot="option"
                slot-scope="option"
              >
                {{ option.name }}
              </template>
              <template slot="no-options">
                type to search users..
              </template>
            </v-select>
          </v-col>
          <v-spacer />
        </v-row>
        <v-row
          align="center"
        >
          <v-col
            class="steps-label"
            md="3"
          >
            3. Choose a report type
          </v-col>

          <v-col md="3">
            <v-card
              class="rounded-lg"
              flat
            >
              <v-card-text class="vertical-scroll">
                <label>Choose Report</label>
                <v-select
                  v-model="reportSelectedAux"
                  item-text="label"
                  item-value="value"
                  :items="alphabetical(options.reports, 'asc')"
                  @input="selectReport"
                />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col md="1">
            <v-btn
              class="mt-4"
              color="blue lighten-2"
              dark
              fab
              small
              @click="showSectionOptions = !showSectionOptions"
            >
              <v-icon small>
                mdi-pencil
              </v-icon>
            </v-btn>
          </v-col>
          <v-col md="3">
            <v-switch
              v-model="showSchedule"
              color="blue lighten-2"
              label="Show Schedule Table"
            />
          </v-col>
        </v-row>
        <v-row>
          <template v-if="showSectionOptions">
            <v-spacer />
            <v-col md="3">
              <v-card
                flat
                style="border-left: 1px solid #808080"
              >
                <v-card-title>Details</v-card-title>
                <v-card-text class="vertical-scroll">
                  <v-checkbox
                    v-model="previewOptions.checkProfile"
                    class="ma-0"
                    label="Project Profile"
                  />
                  <v-checkbox
                    v-model="previewOptions.checkProjectDescription"
                    class="ma-0"
                    label="Project Description"
                  />
                  <v-checkbox
                    v-model="previewOptions.comments"
                    class="ma-0"
                    label="Comments"
                  />
                  <v-checkbox
                    v-model="previewOptions.checkProjectPhotos"
                    class="ma-0"
                    label="Project Photos"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="3">
              <v-card
                class="mt-5"
                flat
              >
                <v-card-text class="vertical-scroll">
                  <v-checkbox
                    v-model="previewOptions.checkCostSummary"
                    class="ma-0"
                    label="Cost Summary"
                  />
                  <v-checkbox
                    v-model="previewOptions.checkCommitments"
                    class="ma-0"
                    label="Commitments"
                  />
                  <v-checkbox
                    v-model="previewOptions.checkSpending"
                    class="ma-0"
                    label="Spending"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="3">
              <v-card
                class="mt-5"
                flat
              >
                <v-card-text class="vertical-scroll">
                  <v-checkbox
                    v-model="previewOptions.checkMilestones"
                    class="ma-0"
                    label="Milestones"
                  />
                  <v-checkbox
                    v-model="previewOptions.checkCommitmentPictures"
                    class="ma-0"
                    label="Commitment Pictures"
                  />
                  <v-checkbox
                    v-model="previewOptions.checkSpendingPictures"
                    class="ma-0"
                    label="Spending Pictures"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </template>
        </v-row>
        <v-row>
          <v-col
            class="steps-label"
            md="3"
          >
            4. Export
          </v-col>
          <v-col md="9">
            <v-btn
              color="blue"
              dark
              :loading="loading"
              @click="exportExcel"
            >
              Export Report
            </v-btn>
            <v-btn
              v-if="showWebReport"
              color="yellow darken-2"
              dark
              :loading="loading"
              @click="preview"
            >
              Preview Report
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-text class="vertical-scroll">
      <v-tabs
        v-if="showWebReport"
        v-model="tabActive"
        color="green lighten-1"
        dark
        slider-color="green lighten-2"
      >
        <v-tab
          v-for="(projectGroup, index) in projectsResult"
          :key="index"
          ripple
        >
          {{ projectGroup.managerName }}
        </v-tab>
        <v-tab-item
          v-for="(projectGroup, index) in projectsResult"
          :key="index"
        >
          <preview-project-group
            :check-project-cards="previewOptions.checkProjectCards"
            :preview-options="previewOptions"
            :project-group="projectGroup"
          />
        </v-tab-item>
      </v-tabs>

      <forecasted-preview
        v-show="showSchedule"
        :fiscal-years="settings.fiscalYears"
        :projects-result="projectsResult"
        @open-gantt-modal="openGantt"
      />
      <v-dialog
        v-model="dialogGantt"
        max-width="800px"
        transition="dialog-transition"
      >
        <v-card>
          <v-container
            fluid
            grid-list-md
          >
            <v-row>
              <v-col
                class="title"
                md="12"
              >
                Schedule
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <div
                  ref="forecastedGantt"
                  style="height:500px;"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
import { db } from '@/utils/Firebase'
import { mapState, mapGetters } from 'vuex'
import axios from 'axios'
import CostSummary from './costs/CostSummary'
import Commitments from './costs/Commitments'
import Spendings from './costs/Spendings'
import Milestones from '../schedule/Milestones'
import ForecastedPreview from './ForecastedPreview'
import PreviewProjectGroup from './PreviewProjectGroup'
import 'dhtmlx-gantt'

export default {
  components: {
    CostSummary,
    Commitments,
    Spendings,
    Milestones,
    ForecastedPreview,
    PreviewProjectGroup
  },
  data() {
    return {
      dialog: false,
      loader: null,
      loading: false,
      showSectionOptions: false,
      previewOptions: {
        checkAllProjects: false,
        checkProjectCards: false,
        checkProfile: false,
        checkProjectDescription: false,
        comments: false,
        checkProjectPhotos: false,
        checkCostSummary: false,
        checkMilestones: false,
        checkCommitments: false,
        checkSpending: false,
        checkCommitmentPictures: false,
        checkSpendingPictures: false
      },
      managerFilter: [],
      campusFilter: [],
      commitmentPictures: [],
      reportSelected: '',
      reportSelectedAux: null,
      options: {
        projects: [],
        reports: [

          /* { label: "Full Report", value: "Full Report" },*/
          { label: 'Monthly Report', value: 'Monthly Report' },
          { label: 'Project Schedule Roll-Up', value: 'Gantt' },
          { label: 'Forecasted Projects', value: 'Forecasted Projects' }
        ],
        format: 'Web - Table'
      },
      cpmsInfoHeaders: [
        { text: 'Campus', value: 'campus' },
        { text: 'Project Number', value: 'number' },
        { text: 'Project Name', value: 'title' },
        { text: 'Project Status', value: 'status' },
        { text: 'Licensing', value: 'license' },
        { text: 'Phase', value: 'phase' },
        { text: 'Phase Date', value: 'phaseTargetDate' },
        { text: 'Construction Start', value: 'startDate' },
        { text: 'Construction End', value: 'endDate' },
        { text: 'Completed', value: 'percentage' },
        { text: 'Budget Status', value: 'budgetStatus' },
        { text: 'Total Budget', value: 'budgetTotal' },
        { text: 'Commitments', value: 'commitmentsTotal' },
        { text: 'Spend to Date', value: 'spendingTotal' },
        { text: 'Proposed Spend', value: 'changesTotal' }
      ],
      projects: [],
      settings: {},
      projectsResult: [],
      users: [],
      selectAMonth: false,
      dates: {
        months: [
          { label: 'January', id: '0' },
          { label: 'February', id: '01' },
          { label: 'March', id: '02' },
          { label: 'April', id: '03' },
          { label: 'May', id: '04' },
          { label: 'June', id: '05' },
          { label: 'July', id: '06' },
          { label: 'August', id: '07' },
          { label: 'September', id: '08' },
          { label: 'October', id: '9' },
          { label: 'November', id: '10' },
          { label: 'December', id: '11' }
        ],
        years: []
      },
      dateSelected: {
        month: '',
        year: ''
      },
      projectTypes: [],
      projectStatus: [],
      defaultTasks: [],
      defaultGantts: [],
      fiscalYears: [],
      fiscalYearSelected: {},
      selectFiscalYear: false,
      tasks: {
        data: [],
        links: []
      },
      dialogGantt: false,
      showSchedule: false,
      url: '',
      tabActive: null
    }
  },
  computed: {
    ...mapGetters(['appLabel', 'axiosSettings']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    showWebReport() {
      return (
        this.previewOptions.checkAllProjects ||
        this.previewOptions.checkProjectCards ||
        this.previewOptions.checkCostSummary ||
        this.previewOptions.checkProfile ||
        this.previewOptions.checkMilestones ||
        this.previewOptions.checkCommitments ||
        this.previewOptions.checkSpending ||
        this.previewOptions.checkCommitmentPictures ||
        this.previewOptions.checkSpendingPictures ||
        this.previewOptions.checkProjectPhotos
      )
    },
    campus() {
      const campusOptions = []
      if (!this.settings.campus) {
        return []
      }
      this.settings.campus.forEach(cl1 => {
        const itemName = cl1.abbr ? `(${cl1.abbr}) ${cl1.name}` : cl1.name
        campusOptions.push({
          name: itemName,
          levelName: cl1.name,
          levelAbbr: cl1.abbr,
          level: 1
        })
        if (cl1.lvl_1.length) {
          cl1.lvl_1.forEach(cl2 => {
            let itemL2Name = itemName + ' > '
            itemL2Name += cl2.abbr ? `(${cl2.abbr}) ${cl2.name}` : cl2.name
            campusOptions.push({
              name: itemL2Name,
              levelName: cl2.name,
              levelAbbr: cl2.abbr,
              level: 2
            })
            if (cl2.lvl_2.length) {
              cl2.lvl_2.forEach(cl3 => {
                let itemL3Name = itemL2Name + ' > '
                itemL3Name += cl3.abbr ? `(${cl3.abbr}) ${cl3.name}` : cl3.name
                campusOptions.push({
                  name: itemL3Name,
                  levelName: cl3.name,
                  levelAbbr: cl3.abbr,
                  level: 3
                })
              })
            }
          })
        }
      })
      return campusOptions
    },
    dateRule() {
      return {
        month: this.dateSelected.month,
        year: this.dateSelected.year
      }
    },
    environment() {
      return this.getEnvironment()
    },
    allProjects() {
      return this.projects.filter(project => {
        if (project.manager) {
          project.managerLabel = project.manager.label
        }
        return (
          this.canView(project) &&
          (!project.soft_delete || project.soft_delete != 1)
        )
      })
    }
  },
  watch: {
    selectAMonth: function (newVal) {
      if (newVal) {
        const auxDate = new Date()
        auxDate.setMonth(auxDate.getMonth() - 1)
        this.dateSelected.year = auxDate.getFullYear().toString()
        this.dateSelected.month = this.dates.months.find(month => month.id == auxDate.getMonth())
        this.reportSelected = 'Monthly Report'
        this.selectReport()
        // this.selectFiscalYear = false;
      } else {
        this.dateSelected.month = ''
        this.dateSelected.year = ''
      }
    },
    'dateSelected.month': function (newVal) {
      if (newVal == null) return
    },
    'dateSelected.year': function (newVal) {
      if (newVal == '') return
    },
    dialogGantt: function (newVal) {
      if (!newVal) {
        this.tasks = {
          data: [],
          links: []
        }
        gantt.clearAll()

        this.$nextTick(() => {
          this.forceReload()
        })
      }
    }
  },
  firestore() {
    return {
      users: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('users'),
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
    }
  },
  mounted() {
    this.dates.years = this.getYears()
    this.getProjects()
    this.loadDefaultTasks()
    this.loadGantts()
  },
  methods: {
    remove(item) {
      this.options.projects.splice(this.options.projects.indexOf(item), 1)
      this.options.projects = [...this.options.projects]
    },
    canView(project) {
      return !this.findProjectAccess(this.userId)
        ? !this.findProjectRolMember(this.userId, project)
          ? false
          : true
        : true
    },
    findProjectAccess(userId) {
      if (this.appLabel.firebaseCollection === 'opportunities') {
        return false
      } else if (
        this.projectAccess &&
        this.projectAccess.projectManager &&
        this.projectRoles &&
        this.projectRoles.roles
      ) {
        const projectManager = this.projectAccess.projectManager.find(manager => manager.value === userId)
        const projectRoles = this.projectRoles.roles.find(role => role.name == 'Project Coordinator')
        const projectCoordinator = projectRoles.users.find(coordinator => coordinator.value === userId)
        return projectManager != undefined || projectCoordinator != undefined
      } else {
        // it is vendor
        if (Drupal.settings.m6_platform_header.isVendorMember) {
          return true
        }

        return false
      }
    },
    findProjectRolMember(userId, project) {
      if (this.appLabel.firebaseCollection === 'opportunities') {
        const collaborators = project.collaborators || []
        const isCollaborator =
          collaborators.length > 0
            ? collaborators.find(c => c.value === userId)
            : {}
        return (
          project.company_nid ==
            this.currentCompany.id || isCollaborator
        )
      } else if (
        project.manager &&
        project.manager.value &&
        project.teamMembers
      ) {
        const isManager = project.manager.value === userId
        const isTeamMember = project.teamMembers.find(
          member => member.value === userId
        )

        return isManager || isTeamMember != undefined
      } else {
        return false
      }
    },
    openGantt(payload) {
      this.dialogGantt = true
      this.tasks = payload.tasks

      this.$nextTick(() => {
        this.forceReload()
      })
    },
    clearProjectFilter() {
      this.managerFilter = []
      this.campusFilter = []
      this.projectTypes = []
      this.projectStatus = []
      this.selectAMonth = false
    },
    getCampusAvailableInProjects(auxArray = []) {
      const aux = []
      auxArray.map(projectResult => {
        if (projectResult.campus && projectResult.campus.length > 0) {
          projectResult.campus.map(campus => {
            aux.push(campus)
          })
        }
      })
      return aux
    },
    getProjectManagersAvailablesInProjects(auxArray = []) {
      const aux = []
      auxArray.map(projectResult => {
        if (projectResult.manager && projectResult.manager.label) {
          aux.push(projectResult.manager.label)
        }
      })
      return aux
    },
    alphabetical(val, order = '', prop = '') {
      if (Array.isArray(val) && val.length > 0) {
        let value = [...val]
        switch (order) {
          case 'Ascending':
          case 'asc':
            value = value.sort((a, b) => {
              if (prop != '') {
                return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0
              } else return a > b ? 1 : a < b ? -1 : 0
            })
            break
          case 'Descending':
          case 'desc':
            value = value.sort((a, b) => {
              if (prop != '') {
                return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0
              } else return a > b ? 1 : a < b ? -1 : 0
            })
            break
          default:
            break
        }
        return value
      } else {
        return val
      }
    },
    changeReports() {
      if (this.options.projects.length <= 0) {
        return
      }

      // Check for campus
      const campusAvailableInProjects = this.getCampusAvailableInProjects(
        this.options.projects
      )
      if (this.campusFilter.length > 0) {
        this.campusFilter = this.campusFilter.filter(campus => {
          const campusAux = campusAvailableInProjects.find(campusInProjects => campus.levelAbbr == campusInProjects)

          return campusAux ? true : false
        })
      }

      // Check for managers
      const managersAvailableInProjects = this.getProjectManagersAvailablesInProjects(
        this.options.projects
      )
      // Check for campus
      if (this.managerFilter.length > 0) {
        this.managerFilter = this.managerFilter.filter(manager => {
          const found = managersAvailableInProjects.find(managersInProjects => manager.label == managersInProjects)
          return found ? true : false
        })
      }
    },
    getProjects() {
      db.collection('cpm_projects')
        .where(
          'company_nid',
          '==',
          this.currentCompany.id
        )
        .orderBy('number')
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            const auxProject = doc.data()
            if (
              (!auxProject.soft_delete || auxProject.soft_delete != 1) &&
              auxProject.status &&
              auxProject.status.toLowerCase() != 'archived' &&
              auxProject.status.toLowerCase() != 'archive'
            ) {
              auxProject.id = doc.id
              this.projects.push(auxProject)
            }
          })
        })
    },
    clearReport() {
      this.previewOptions.checkAllProjects = false
      this.previewOptions.checkProjectCards = false
      this.previewOptions.checkProfile = false
      this.previewOptions.checkProjectDescription = false
      this.previewOptions.comments = false
      this.previewOptions.checkCostSummary = false
      this.previewOptions.checkMilestones = false
      this.previewOptions.checkCommitments = false
      this.previewOptions.checkSpending = false
      this.previewOptions.checkProjectPhotos = false
    },
    filterCampus(campus) {
      this.options.projects = []
      this.projects.forEach(p => {
        if (p.campus) {
          if (Array.isArray(p.campus)) {
            p.campus.forEach(pc => {
              campus.forEach(c => {
                if (pc.levelName === c.levelName) {
                  const option = this.options.projects.find(pf => pf.id === p.id)
                  if (!option) {
                    this.options.projects.push(p)
                  }
                }
              })
            })
          } else {
            const pc = p.campus
            campus.forEach(c => {
              if (pc.levelName === c.levelName) {
                const option = this.options.projects.find(pf => pf.id === p.id)
                if (!option) {
                  this.options.projects.push(p)
                }
              }
            })
          }
        }
      })
    },
    filterByProjectTypes(projectTypes) {
      this.options.projects = []
      this.projects.forEach(p => {
        if (p.projectType) {
          projectTypes.forEach(m => {
            if (p.projectType === m) {
              this.options.projects.push(p)
            }
          })
        }
      })
    },
    filterByStatus(projectStatus) {
      this.options.projects = []
      this.projects.forEach(p => {
        if (p.status) {
          projectStatus.forEach(auxStatus => {
            if (p.status === auxStatus) {
              this.options.projects.push(p)
            }
          })
        }
      })
    },
    filterManager(managers) {
      this.options.projects = []
      this.projects.forEach(p => {
        if (p.manager) {
          managers.forEach(m => {
            if (p.manager.email == m.email) {
              this.options.projects.push(p)
            }
          })
        }
      })
    },
    selectAllProjects() {
      this.options.projects = []
      this.projects.forEach(p => {
        this.options.projects.push(p)
      })
    },
    selectAllManagers() {
      this.managerFilter = []
      this.users.projectManager.forEach(m => {
        this.managerFilter.push(m)
      })
    },
    selectAllCampus() {
      this.options.projects = []
      this.campusFilter = []
      this.campus.forEach(c => {
        this.campusFilter.push(c)
      })
    },
    selectReport(selection) {
      if (selection) {
        this.reportSelected = selection
      }

      switch (this.reportSelected) {
        case 'Full Report':
          this.previewOptions.checkProfile = true
          this.previewOptions.checkProjectDescription = true
          this.previewOptions.comments = true
          this.previewOptions.checkCostSummary = true
          this.previewOptions.checkMilestones = true
          this.previewOptions.checkCommitments = true
          this.previewOptions.checkSpending = true
          this.previewOptions.checkProjectPhotos = true
          break

        case 'Monthly Report':
          this.clearReport()
          this.previewOptions.checkProfile = true
          this.previewOptions.checkProjectDescription = true
          this.previewOptions.comments = true
          this.previewOptions.checkCostSummary = true
          this.previewOptions.checkProjectPhotos = true
          break

        case 'Forecasted Projects':
          this.previewOptions.checkProfile = false
          this.previewOptions.checkProjectDescription = false
          this.previewOptions.comments = false
          this.previewOptions.checkCostSummary = false
          this.previewOptions.checkMilestones = false
          this.previewOptions.checkCommitments = false
          this.previewOptions.checkSpending = false
          this.previewOptions.checkProjectPhotos = false

          this.clearProjectFilter()

          this.projects.forEach(p => {
            if ((p.status && p.status == 'Forecasted') || p.forecasted) {
              this.options.projects.push(p)
            }
          })
          break
      }
    },
    monthDiff(dateFrom, dateTo) {
      // Same date
      if (dateFrom.getTime() == dateTo.getTime()) {
        return 1
      }

      const months = dateTo.getMonth() - dateFrom.getMonth()
      // counting plus one if the months are in the same year
      return months + 12 * (dateTo.getFullYear() - dateFrom.getFullYear()) + 1
    },
    runReport() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          this.loading = true

          const data = {
            projects: this.options.projects,
            defaultGantts: this.defaultTasks,
            selectFiscalYear: this.selectFiscalYear,
            fiscalYearSelected: this.fiscalYearSelected,
            environment: this.environment,
            fiscalYears: this.fiscalYears,
            dateSelected: this.dateSelected
          }

          const response = await axios
            .post(
              `${this.axiosSettings.baseUrl}/api/cpm-reports/`,
              data,
              this.axiosSettings.config
            )
          this.projectsResult = response.data.results
          this.loading = false
          resolve(true)
        } catch (error) {
          this.$snotify.error(error, 'Error')
          this.loading = false
          reject(error)
        }
      })
      return aux
    },
    areMutipleCampus() {
      const originalCampus = this.projectsResult[0].projects[0].campus
      let multiple = false
      this.projectsResult.forEach(projectResult => {
        if (projectResult.projects[0].campus != originalCampus) {
          multiple = true
        }
      })
      return multiple
    },
    getLabelsReport() {
      let aux = new Date()
      const dateComplete = aux.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      const columnDate = aux.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })

      const originalCampus = this.projectsResult[0].projects[0].campus
      let columnSite = 'Sites: ' + originalCampus
      let columnSiteTitle = originalCampus + ' '

      const multiple = this.areMutipleCampus()
      if (multiple) {
        columnSite = 'Sites: Multiple'
        columnSiteTitle = ''
      }

      const labels = {
        dateComplete: dateComplete,
        columnDate: columnDate,
        columnSite: columnSite,
        columnSiteTitle: columnSiteTitle
      }

      if (this.dateSelected.month != '' && this.dateSelected.year != '') {
        aux = new Date(
          this.dateSelected.year,
          parseInt(this.dateSelected.month.id),
          1
        )

        labels.dateComplete = aux.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })

        labels.columnDate = aux.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        })
      }

      return labels
    },
    getGanttDates(projects = []) {
      let firstDate = null
      let endDate = null

      if (projects.length > 0) {
        firstDate =
          projects[0].projects[0].taskFirstDate != null
            ? new Date(projects[0].projects[0].taskFirstDate)
            : new Date(8640000000000000)
        endDate =
          projects[0].projects[0].taskEndDate != null
            ? new Date(projects[0].projects[0].taskEndDate)
            : new Date(-8640000000000000)

        for (let i = 1; i < projects.length; i++) {
          const project = projects[i]

          for (let j = 0; j < project.projects.length; j++) {
            const elementProject = project.projects[j]

            const projectFirstDate =
              elementProject.taskFirstDate != null
                ? new Date(elementProject.taskFirstDate)
                : new Date(8640000000000000)
            const projectEndDate =
              elementProject.taskEndDate != null
                ? new Date(elementProject.taskEndDate)
                : new Date(-8640000000000000)

            if (projectFirstDate < firstDate) {
              firstDate = projectFirstDate
            }
            if (projectEndDate > endDate) {
              endDate = projectEndDate
            }
          }
        }
      }

      return {
        firstDate: firstDate,
        endDate: endDate
      }
    },
    async exportExcel() {
      this.loading = true

      await this.runReport()

      if (!this.projectsResult.length) {
        this.$snotify.warning('Please Select 1 or More Projects', 'Warning')
        return false
      }
      this.dialog = true

      const labels = this.getLabelsReport()

      const data = {
        projects: this.projectsResult,
        labels: labels,
        reportSelected: this.reportSelected,

        // for updating column q in the report export (not gantt)
        fyProposedSpend20:
          this.settings && this.settings.fyProposedSpend20
            ? this.settings.fyProposedSpend20
            : false
      }

      const dates = this.getGanttDates(this.projectsResult)
      switch (this.reportSelected) {
        case 'Forecasted Projects':
          data.fyColumns = this.settings.fiscalYears
          break

        case 'Gantt':
          data.defaultTasks = this.defaultTasks
          data.ganttFirstDate = dates.firstDate
          data.ganttEndDate = dates.endDate
          data.gantts = this.defaultGantts
          break
      }
      axios({
        data: data,
        url: '/fm-dev/reports/monthly',
        method: 'POST',
        responseType: 'blob'
      })
        .then(response => {
          if (response.headers.error) {
            this.$snotify.error(response.headers.error, 'Error')
          } else {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', response.headers['file-name'])
            document.body.appendChild(link)
            link.click()
          }
          this.loading = false
          this.dialog = false
        })
        .catch(error => {
          console.log('Error', error.message)
        })
    },
    getYears() {
      const date = new Date()
      const yearActual = date.getFullYear()
      const years = []
      for (let year = yearActual - 9; year <= yearActual; year++) {
        years.push(year.toString())
      }
      return years
    },
    selectAllProjectTypes() {
      this.projectTypes = this.settings.projectTypes
    },
    selectAllProjectStatus() {
      this.projectStatus = this.settings.status
    },
    loadDefaultTasks() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('default_schedule')
        .get()
        .then(snap => {
          const aux = snap.data()

          this.defaultTasks = []
          aux.tasks.forEach(task => {
            this.defaultTasks.push(task)

            if (task.cat_1 && task.cat_1.length > 0) {
              task.cat_1.forEach(cat1 => {
                this.defaultTasks.push(cat1)
              })
            }
          })
        })
    },
    loadGantts() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
        .get()
        .then(snap => {
          const aux = snap.data()
          if (aux.gantts) {
            this.defaultGantts = aux.gantts
            this.fiscalYears = aux.fiscalYears
          }
        })
    },
    $_initGanttEvents: function () {
      if (gantt.$_eventsInitialized) return

      gantt.attachEvent('onAfterTaskDrag', (id, link, e) => {
        this.$emit('on-after-task-drag', id, link, e)
      })

      // Block default modal
      gantt.showLightbox = id => {
        const task = gantt.getTask(id)
        this.$emit('task-selected', task)
        return
      }

      gantt.attachEvent('onTaskSelected', id => {
        const task = gantt.getTask(id)
        this.$emit('task-selected', task)
      })

      gantt.attachEvent('onTaskSelected', id => {
        const task = gantt.getTask(id)
        this.$emit('task-selected', task)
      })

      gantt.attachEvent('onAfterTaskAdd', (id, task) => {
        this.$emit('task-updated', id, 'inserted', task)
        task.progress = task.progress || 0
        if (gantt.getSelectedId() == id) {
          this.$emit('task-selected', task)
        }
      })
      gantt.attachEvent('onAfterTaskUpdate', (id, task) => {
        this.$emit('task-updated', id, 'updated', task)
      })
      gantt.attachEvent('onAfterTaskDelete', id => {
        this.$emit('task-updated', id, 'deleted')
        if (!gantt.getSelectedId()) {
          this.$emit('task-selected', null)
        }
      })
      gantt.attachEvent('onAfterLinkAdd', (id, link) => {
        this.$emit('link-updated', id, 'inserted', link)
      })
      gantt.attachEvent('onAfterLinkUpdate', (id, link) => {
        this.$emit('link-updated', id, 'updated', link)
      })
      gantt.attachEvent('onAfterLinkDelete', id => {
        this.$emit('link-updated', id, 'deleted')
      })

      gantt.config.drag_move = false
      gantt.config.drag_resize = false
      gantt.config.drag_links = false
      gantt.config.drag_progress = false

      gantt.config.duration_unit = 'month'
      // gantt.config.duration_step = 1;
      gantt.config.fit_tasks = true
      gantt.config.full_day = true
      gantt.config.scale_unit = 'month'
      gantt.config.date_scale = '%M,%Y'

      gantt.attachEvent('onError', function (errorMessage) {
        // debugger;
        console.log(errorMessage)
        return true
      })

      gantt.config.columns = [
        { name: 'text', label: 'Date', tree: true, width: 250, resize: true }
      ]
      gantt.config.layout = {
        // css: "gantt_container",
        cols: [
          {
            width: 250,
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

      gantt.$_eventsInitialized = true
    },
    forceReload() {
      this.$_initGanttEvents()
      gantt.init(this.$refs.forecastedGantt)
      gantt.parse(this.tasks)
    },
    async preview() {
      this.dialog = true
      if (this.options.projects.length == 0) {
        this.$snotify.warning('Please Select 1 or More Projects', 'Warning')
      } else if (this.reportSelectedAux == null) {
        this.$snotify.warning('Please Select report type', 'Warning')
      } else {
        await this.runReport()
      }
      this.dialog = false
    },
    getUrl() {
      const url = location.host
      return url
    },
    getEnvironment() {
      let environment = ''

      const url = this.getUrl()

      switch (url) {
        case 'sharp.m6connect.com':
        case 'thr.m6connect.com':
        case 'apps.m6connect.com':
        case 'm6connect.com':
          environment = 'production'
          break

        default:
          environment = 'test'
          break
      }

      return environment
    }
  }
}
</script>

<style lang="scss" scoped>
.check-options-container {
  .v-input--selection-controls .v-input__slot {
    margin-bottom: 0;
  }
  .v-input--selection-controls.v-input .v-label {
    margin-bottom: 0;
  }
}

.hollow-div {
  background: transparent;

  .v-expansion-panel__header {
    background: #2196f3;
  }
}

.steps-label {
  text-align: center;
  align-self: center;
}
</style>

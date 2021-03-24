<template>
  <v-row ref="fullscreen">
    <v-col
      class="main-tabs relative"
      cols="3"
    >
      <v-btn
        id="step1"
        ref="step1"
        class="edit-button"
        color="white"
        dark
        fab
        small
        :style="{
          'z-index': showFakeButton ? 9999 : -1
        }"
      >
        <v-icon color="black">
          mdi-pencil
        </v-icon>
      </v-btn>
      <sidebar
        :type="type"
        @changeTab="changeTab"
      >
        <template v-slot:after:description>
          <v-list dense>
            <v-list-tile
              v-for="item in panelsGroups"
              :id="item.id"
              :key="item.title"
              active-class="light-blue lighten-4"
              class="list-tile-border"
              :class="{
                'list-tile-border-active': showingGroup === item.group
              }"
              :disabled="showingGroup === item.group"
              :value="showingGroup === item.group"
              @click="showingGroup = item.group"
            >
              <v-list-tile-action>
                <v-icon :color="showingGroup === item.group ? 'blue' : ''">
                  {{ item.icon }}
                </v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title
                  :class="{ 'blue--text': showingGroup === item.group }"
                >
                  {{ item.title }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </template>
      </sidebar>
    </v-col>

    <v-col
      class="pa-2"
      cols="9"
    >
      <div class="group-panels pr-2">
        <div v-show="showingGroup === 'financials'">
          <v-row
            v-if="!panelSettings.finCostSum && showPanelProject"
            id="step2"
          >
            <v-col cols="12">
              <spending-forecast />
            </v-col>
          </v-row>

          <v-row
            v-if="!panelSettings.finCostSum && showPanelProject"
            id="step2"
          >
            <v-col cols="12">
              <financial-cost-summary />
            </v-col>
          </v-row>

          <v-row
            class="mt-2"
          >
            <v-col
              v-if="!panelSettings.finCommit && showPanelProject"
              id="step5"
              class="pr-1"
              md="6"
              sm="12"
            >
              <financial-commitments />
            </v-col>
          </v-row>
          <v-row
            class="mt-2"
          >
            <v-col
              v-if="!panelSettings.finReconciliation && showPanelProject"
              cols="12"
            >
              <reconciliation />
            </v-col>
          </v-row>

          <v-row
            class="mt-2"
          >
            <v-col
              v-show="!panelSettings.finSpend && showPanelProject"
              cols="12"
            >
              <financial-spendings />
            </v-col>
          </v-row>

          <v-row
            class="mt-2"
          >
            <v-col
              v-if="!panelSettings.finBulletins && showPanelProject"
              cols="12"
            >
              <financial-changes />
            </v-col>
          </v-row>

          <v-row
            class="mt-2"
          >
            <v-col
              v-if="!panelSettings.finChangeOrders"
              cols="12"
            >
              <change-orders />
            </v-col>
          </v-row>

          <v-row
            class="mt-2"
          >
            <v-col
              v-if="!panelSettings.finBuyOut"
              cols="12"
            >
              <buy-out />
            </v-col>
          </v-row>

          <v-row
            v-if="!panelSettings.finBudget"
            class="mt-2"
          >
            <v-col cols="12">
              <financials-budgets :type="type" />
            </v-col>
          </v-row>

          <v-row
            v-if="!panelSettings.finEstim"
            class="mt-2"
          >
            <v-col cols="12">
              <estimations />
            </v-col>
          </v-row>
        </div>

        <div v-if="showingGroup === 'schedule'">
          <v-row
            v-if="!panelSettings.mileTracker"
          >
            <v-col cols="12">
              <milestones :type="type" />
            </v-col>
          </v-row>

          <v-row
            v-if="!panelSettings.mileSchedule"
            class="mt-2"
          >
            <v-col cols="12">
              <schedule :type="type" />
            </v-col>
          </v-row>

          <v-row
            v-if="isPlannedProject"
            class="mt-2"
          >
            <v-col cols="12">
              <forecasts />
            </v-col>
          </v-row>
        </div>

        <div v-show="showingGroup === 'files'">
          <v-row
            v-if="!panelSettings.filesProject"
          >
            <v-col cols="12">
              <project-files />
            </v-col>
          </v-row>
        </div>

        <div v-show="showingGroup === 'updates'">
          <v-row>
            <v-col
              v-if="!panelSettings.updatesBudget"
              class="pr-1"
              md="6"
              sm="12"
            >
              <budget-comment />
            </v-col>

            <v-col
              v-if="!panelSettings.updatesStatus"
              class="pl-1"
              md="6"
              sm="12"
            >
              <status-comment />
            </v-col>
          </v-row>
        </div>

        <div v-show="showingGroup === 'other'">
          <v-row>
            <v-col
              v-if="!panelSettings.otherProj"
              class="pr-1"
              md="6"
              sm="12"
            >
              <project-assignment :type="type" />
            </v-col>
            <v-col
              v-show="showPanelProject"
              class="pr-1"
              cols="12"
              md="6"
            >
              <rfps />
            </v-col>
          </v-row>

          <v-row
            class="pt-2"
          >
            <v-col
              class="pl-1"
              md="6"
              sm="12"
            >
              <project-contracts />
            </v-col>
          </v-row>
        </div>
      </div>
    </v-col>

    <coming-soon
      :dialog="dialogSoon"
      @close-dialog="dialogSoon = false"
    />

    <m6-confirm-delete
      message="Please confirm that you wish to approve this project"
      :show="showApprovalModal"
      title="Confirm Project Approval"
      @cancel="showApprovalModal = false"
      @confirm="approveProject"
    />

    <portal to="destination">
      <v-toolbar-items>
        <v-btn
          v-show="showingGroup === 'financials' || showingGroup === 'files'"
          id="step10"
          class="mr-2"
          color="primary"
          data-step="10"
          small
          @click="startTour"
        >
          <v-icon small>
            mdi-near-me
          </v-icon>
          {{ $t('tourProjectList.start') }}
        </v-btn>
        <v-btn
          v-if="!showPanelProject"
          class="btn-ticket"
          :loading="loading"
          small
          target="_new"
          text
          @click="showApprovalModal = true"
        >
          Approve Project
        </v-btn>

        <v-btn
          class="btn-ticket"
          small
          target="_new"
          text
          @click="dialogSoon = true"
        >
          Print
        </v-btn>

        <v-tooltip
          debounce="1s"
          top
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="breadcrumb-button"
              fab
              icon
              small
              v-on="on"
              @click="fullScreen"
            >
              <i class="material-icons">fullscreen</i>
            </v-btn>
          </template>

          <span>Full Screen</span>
        </v-tooltip>

        <v-tooltip
          debounce="1s"
          top
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="breadcrumb-button"
              fab
              icon
              small
              v-on="on"
              @click="dialogSoon = true"
            >
              <i class="material-icons">access_time</i>
            </v-btn>
          </template>

          <span>History</span>
        </v-tooltip>

        <v-tooltip
          debounce="1s"
          top
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="breadcrumb-button"
              fab
              icon
              small
              v-on="on"
              @click="!disableFavBtn ? addFavorites() : removeFavorites()"
            >
              <i
                v-if="!disableFavBtn"
                class="material-icons"
              >
                favorite_border
              </i>
              <i
                v-else
                class="favorite-button material-icons"
              >favorite</i>
            </v-btn>
          </template>

          <span v-if="!disableFavBtn">Add to favorites</span>

          <span v-else>Remove from favorites</span>
        </v-tooltip>

        <v-tooltip
          debounce="1s"
          top
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="breadcrumb-button"
              fab
              icon
              small
              v-on="on"
              @click="closeProject"
            >
              <i class="material-icons">close</i>
            </v-btn>
          </template>

          <span>Close</span>
        </v-tooltip>
      </v-toolbar-items>
    </portal>
    <m6-loading
      :loading="showLoading"
      message="We are preparing the project tour"
    />
  </v-row>
</template>

<script>
import { db } from '@/utils/Firebase'
import Sidebar from './Sidebar'
import StatusComment from './panels/StatusComment'
import BudgetComment from './panels/BudgetComment'
import SpendingForecast from './panels/SpendingForecast/SpendingForecast'
import ProjectContracts from './panels/ProjectContracts'
import ProjectFiles from './panels/ProjectFiles'
import FinancialChanges from './panels/FinancialChanges'
import FinancialCostSummary from './panels/FinancialCostSummary'
import FinancialSpendings from './panels/FinancialSpendings'
import FinancialCommitments from './panels/FinancialCommitments'
import Schedule from './panels/schedule/SchedulePanel'
import Milestones from './panels/schedule/Milestones'
import FinancialsBudgets from './panels/Financial/Budgets'
import ProjectAssignment from './panels/ProjectAssignment'
import ComingSoon from './modals/ComingSoon'
import Estimations from './panels/Estimations'
import axios from 'axios'
import Rfps from './panels/Rfp/Rfps'
import Reconciliation from './panels/Reconciliation'
import ChangeOrders from './panels/ChangeOrders'
import Forecasts from './panels/Forecasts/ForecastsPanel'
import BuyOut from './panels/BuyOut'
import { mapState, mapActions, mapGetters } from 'vuex'
import EventBus from '@/Eventbus'


export default {
  name: 'ProjectProfile',
  components: {
    sidebar: Sidebar,
    StatusComment,
    BudgetComment,
    ProjectContracts,
    ProjectFiles,
    FinancialChanges,
    FinancialCostSummary,
    FinancialSpendings,
    FinancialCommitments,
    Forecasts,
    Schedule,
    FinancialsBudgets,
    ProjectAssignment,
    ComingSoon,
    Milestones,
    Rfps,
    Estimations,
    SpendingForecast,
    Reconciliation,
    ChangeOrders,
    BuyOut
  },

  props: {
    type: {
      type: String,
      default: 'project' // project,forecasted
    }
  },

  data: () => ({
    showFakeButton: false,
    showLoading: false,
    showApprovalModal: false,
    loading: false,
    favProjects: [],
    dialogSoon: false,
    firebaseUrl: process.env.VUE_APP_FIREBASE_APIURL,
    fullScreenModalOpen: false,
    componentToOpenFullScreen: '',
    showingGroup: 'financials',
    roles: [],
    access: {
      files: false,
      financials: false,
      other: false,
      schedule: false,
      updates: false
    }
  }),

  firestore() {
    return {
      roles: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('roles')
    }
  },

  computed: {
    ...mapGetters({
      panelSettings: 'hideCpmPanels/getPanelSettings'
    }),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    disableFavBtn() {
      return this.favProjects.indexOf(this.$route.params.id) > -1
    },
    showPanelProject() {
      return this.getShowPanelProject()
    },

    panelsGroups() {
      return [
        {
          title: this.$t('cpm.projectProfile.sidebar.financials'),
          icon: 'mdi-scale-balance',
          group: 'financials',
          access: this.access.financials
        },
        {
          title: this.$t('cpm.projectProfile.sidebar.schedule'),
          icon: 'mdi-calendar',
          group: 'schedule',
          access: this.access.schedule
        },
        {
          title: this.$t('cpm.projectProfile.sidebar.files'),
          icon: 'mdi-folder-open',
          id: 'step11',
          group: 'files',
          access: this.access.files
        },
        {
          title: this.$t('cpm.projectProfile.sidebar.updates'),
          icon: 'chat_bubble_outline',
          group: 'updates',
          access: this.access.updates
        },
        {
          title: this.$t('cpm.projectProfile.sidebar.other'),
          icon: 'indeterminate_check_box',
          group: 'other',
          access: this.access.other
        }
      ].filter(item => item.access === true)
    },

    userRoles() {
      const aux = []
      if (this.roles && this.roles.roles && this.roles.roles.length > 0) {
        this.roles.roles.map(role => {
          role.users.map(user => {
            if (user.value === window.Drupal.settings.m6_platform.uid) {
              aux.push(role)
            }
          })
        })
      }
      return aux
    },
    isPlannedProject() {
      return this.$h.dg(this.$route, 'name') === 'cpm.forecasting.show'
    }
  },

  watch: {
    userRoles: function () {
      this.userRoles.map(role => {
        // WE NEED TO LOOK INTO EVERY SINGLE ROLE TO CHECK IF HAS ACCESS TO EVERY BUTTON
        if (role.access) {
          Object.keys(role.access).map(key => {
            // THE ACCESS ONLY WILL BE SETTED TO TRUE IF THE ROLE ACCESS ITERATED IS TRUE FOR AVOID OVERRIDE FALSE ON THE NEXT ITERATION
            if (role.access[key]) {
              this.access[key] = role.access[key]
            }
          })
        }
      })
    },

    showingGroup() {
      if (this.showingGroup === 'files') {
        const projectsFilesTourViewed = localStorage.getItem(
          'projectsFilesTourViewed'
        )
        if (!projectsFilesTourViewed) {
          this.startTour()
          localStorage.setItem('projectsFilesTourViewed', 'true')
        }
      }
    }
  },

  async mounted() {
    if (this.$h.dg(this.$route, 'params.autoStartTour')) {
      this.$intro().exit()
      this.showLoading = true
    }

    this.getProject({
      projectId: this.$route.params.id
    })

    this.getFavorites()
    await this.getPanelSettings()

    if (this.showLoading) {
      // TODO: Improve the following code. The tour has to wait for all components to be mounted
      setTimeout(() => {
        this.showLoading = false
        this.startTour()
      }, 5000)
    }
  },

  methods: {
    ...mapActions({
      getPanelSettings: 'hideCpmPanels/getSettings'
    }),
    ...mapActions('cpm/projects', [
      'getProject'
    ]),

    fullScreen() {
      const elem = document.documentElement
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      } else if (elem.mozRequestFullScreen) {
        // Firefox
        elem.mozRequestFullScreen()
      } else if (elem.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        elem.webkitRequestFullscreen()
      } else if (elem.msRequestFullscreen) {
        // IE/Edge
        elem.msRequestFullscreen()
      }
    },

    closeProject() {
      if (this.type === 'forecasted') {
        this.$router.push('/cpm/forecasting/')
      } else {
        this.$router.push('/cpm/projects/')
      }
    },

    async approveProject() {
      if (this.type === 'project') {
        this.$snotify.error('The Project can\'t be approved', 'Error')
        this.showApprovalModal = false
        return
      }
      this.loading = true
      // Only forecasted projects
      const projectId = this.$route.params.id
      const url = `${this.firebaseUrl}/api/project/${projectId}/approve-project`
      const response = await axios({
        method: 'POST',
        url: url
      })

      this.loading = false

      this.$router.push({
        name: 'cpm.projects.show',
        params: { id: response.data.project.id }
      })
      this.$snotify.success('The Project has been approved', 'Success')
      this.showApprovalModal = false
    },

    getShowPanelProject() {
      if (this.type === 'project') {
        return true
      }
      return false
    },

    getFavorites() {
      db.collection('m6user')
        .doc(window.Drupal.settings.m6_platform.uid)
        .get()
        .then(querySnapshot => {
          const m6user = querySnapshot.data()
          this.favProjects = m6user.favProjects ? m6user.favProjects : [] // if favcontracts doesnt exist then an empty array is returned
        })
    },

    addFavorites() {
      db.collection('m6user')
        .doc(window.Drupal.settings.m6_platform.uid)
        .update({ favProjects: [...this.favProjects, this.$route.params.id] })
      this.favProjects.push(this.$route.params.id)
    },

    removeFavorites() {
      const filteredFavs = this.favProjects.filter(
        f => f !== this.$route.params.id
      )

      this.favProjects = filteredFavs

      db.collection('m6user')
        .doc(window.Drupal.settings.m6_platform.uid)
        .update({ favProjects: filteredFavs })
    },

    changeTab(tabName) {
      if (!tabName) return

      if (tabName === 'schedule') {
        this.showingGroup = tabName
      }
    },

    startTour() {
      if (this.showingGroup === 'financials') {
        this.financialTour()
      } else if (this.showingGroup === 'files') {
        this.fileTour()
      }
    },

    financialTour() {
      this.$intro().exit()
      let currentStepId = 'step1'
      this.showFakeButton = true
      const steps = [
        {
          element: '#step1',
          intro: this.$t('tourProjectList.edit')
        },
        {
          element: '#step2',
          intro: this.$t('tourProjectList.costSummary')
        },
        {
          element: '.step3',
          intro: this.$t('tourProjectList.expandPanel')
        },
        {
          element: '.step4',
          intro: this.$t('tourProjectList.expandRow')
        },
        {
          element: '#step5',
          intro: this.$t('tourProjectList.commitments')
        },
        {
          element: '.step6',
          intro: this.$t('tourProjectList.expandRow')
        },
        {
          element: '#step7',
          intro: this.$t('tourProjectList.spending')
        },
        {
          element: '#step8',
          intro: this.$t('tourProjectList.budget')
        },
        {
          element: '#step9',
          intro: this.$t('tourProjectList.budgetDetail')
        },
        {
          element: '#step10',
          intro: this.$t('tourProjectList.end'),
          position: 'left'
        }
      ]
      const introJS = this.$intro()
      introJS.addSteps(steps)
      introJS.setOptions({ tooltipClass: 'subheading' })
      introJS
        .start()
        .onchange(e => {
          currentStepId = this.$h.dg(e, 'id', 'step1')
          if (currentStepId === 'step1') {
            this.showFakeButton = true
          } else {
            this.showFakeButton = false
          }
        })
        .onbeforeexit(() => {
          if (currentStepId !== 'step10') {
            introJS.goToStep(steps.length)
            return false
          }
        })
        .oncomplete(() => {
          this.showFakeButton = false
        })
    },

    fileTour() {
      this.$intro().exit()
      let currentStepId = 'step11'

      EventBus.$emit('projects-files-tour-show-up', true)

      const steps = [
        {
          element: '#step11',
          intro: this.$t('tourProjectList.sharingProject')
        },
        {
          element: '#step12',
          intro: this.$t('tourProjectList.uploadDocuments')
        },
        {
          element: '#step13',
          intro: this.$t('tourProjectList.createSubFolder')
        },
        {
          element: '#step14',
          intro: this.$t('tourProjectList.openDocument')
        },
        {
          element: '#step15',
          intro: this.$t('tourProjectList.shareDocument')
        },
        {
          element: '#step16',
          intro: this.$t('tourProjectList.documentBeShared')
        },
        {
          element: '#step17',
          intro: this.$t('tourProjectList.selectMail')
        },
        {
          element: '#step18',
          intro: this.$t('tourProjectList.enterEmail')
        },
        {
          element: '#step19',
          intro: this.$t('tourProjectList.confirmExpiration')
        },
        {
          element: '#step20',
          intro: this.$t('tourProjectList.enterCustomMessage')
        },
        {
          element: '#step21',
          intro: this.$t('tourProjectList.previewEmail')
        },
        {
          element: '#step10',
          intro: this.$t('tourProjectList.end'),
          position: 'left'
        }
      ]
      const introJS = this.$intro()
      introJS.setOptions({
        steps,
        tooltipClass: 'subheading',
        disableInteraction: true
      })
      introJS
        .onchange(e => {
          currentStepId = this.$h.dg(e, 'id', 'step11')

          if (currentStepId === 'step15') {
            EventBus.$emit('projects-files-tour-open-share-modal', true)
          } else if (currentStepId === 'step14') {
            EventBus.$emit('projects-files-tour-open-share-modal', false)
          }
        })
        .onbeforeexit(() => {
          if (currentStepId !== 'step10') {
            introJS.goToStep(steps.length)
            return false
          }

          EventBus.$emit('projects-files-tour-open-share-modal', false)
          EventBus.$emit('projects-files-tour-show-up', false)
        })

      setTimeout(() => introJS.start(), 250)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-tabs {
  height: calc(100vh - 105px);
  overflow-y: auto;
}

.group-panels {
  height: calc(100vh - 120px);
  overflow-y: auto;
}

.favorite-button {
  color: red;
}

.breadcrumb-button {
  float: right;
}

.list-tile-border {
  border: solid 5px;
  border-color: white;
  border-right: 0;
  border-top: 0;
  border-bottom: 0;
}

.list-tile-border-active {
  border-color: #2196f3;
}

.edit-button {
  position: absolute;
  right: 1.2rem;
  z-index: 99999999999999;
}
</style>

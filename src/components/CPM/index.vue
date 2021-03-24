<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <v-container
    class="d-flex dont-show-scroll h-sidepanel ma-0 mt-10 pb-0 pt-5 px-0 rounded-lg vertical-scroll w-full"
    fluid
  >
    <v-row>
      <app-template-plain :props-dialog="true">
        <div
          slot="header"
          class="align-center d-flex justify-space-between max-w-lg mx-auto px-8 py-5 w-full"
        >
          <m6-loading :loading="loading" />
          <v-btn
            absolute
            class="ml-3 mt-10"
            fab
            left
            top
            @click="$router.push('/app/cpm')"
          >
            <v-icon color="red">
              mdi-close
            </v-icon>
          </v-btn>

          <div class="align-center d-flex">
            <div
              v-if="project"
              style="display:flex;flex-wrap:wrap"
            >
              <div style="display: flex;flex-direction: column;justify-content: space-around;margin-right: 15px;">
                <m6-upload
                  @loading="loading = !loading"
                  @response="uploadProjectImage"
                >
                  <v-btn
                    color="primary"
                    dark
                    fab
                    small
                  >
                    <v-icon>mdi-camera-enhance-outline</v-icon>
                  </v-btn>
                </m6-upload>
                <v-btn
                  color="error"
                  dark
                  fab
                  small
                  @click="deleteProjectImage"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
              <v-img
                v-if="project.projectImage"
                alt="Project Image"
                :src="project.projectImage"
                style="width: 150px; height: 150px; border-radius: 5px;margin-right:15px;"
              />
              <div
                v-else
                class="d-flex grey items-center justify-center lighten-3 mr-6"
                style="width: 150px; height: 150px; border-radius: 5px;margin-right: 15px;"
              >
                <v-icon
                  color="grey lighten-1"
                  size="38"
                >
                  mdi-image-filter-hdr
                </v-icon>
              </div>
            </div>
            <div>
              <h3 class="font-weight-medium">
                {{ $h.dg(project, "title", "") }}
              </h3>
              <p
                class="mb-0"
                v-text="$h.dg(project, 'description', '')"
              />
              <p
                class="mb-0"
                v-text="$h.dg(project, 'manager.label', '')"
              />
            </div>
          </div>
          <!-- <div class="absolute mr-3 mt-3 right-0 top-0">
            <div class="relative">
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    v-on="on"
                    @click="$router.replace('/app/cpm')"
                  >
                    <v-icon color="blue lighten-1">
                      mdi-keyboard-return
                    </v-icon>
                  </v-btn>
                </template>
                <span
                  class="grey lighten-4 px-3 py-2 rounded"
                >Project List</span>
              </v-tooltip>
            </div>
          </div> -->
        </div>
        <div
          slot="tabs"
          class="align-center d-flex"
        >
          <v-tabs
            v-model="activeTab"
            active-class="font-weight-black blue--text active-tab-company"
          >
            <v-tab
              v-for="tab in tabs"
              :key="tab.id"
              class="blue--text capitalize"
            >
              {{ tab }}
            </v-tab>
          </v-tabs>
        </div>
        <div
          slot="btns"
          class="align-center d-flex"
        />
        <div
          slot="content"
          class="w-full"
        >
          <template v-if="activeTab === 0">
            <panel-two-columns
              :left-column="5"
              :right-column="7"
            >
              <div
                slot="leftPanel"
                class=""
              >
                <edit-panel-dialog
                  v-if="panelToEdit.items"
                  v-model="showEditPanel"
                  :panel.sync="panelToEdit"
                  @update="updateProject"
                />
                <v-col
                  v-for="(panel, index) in projectInformation"
                  :key="index"
                  class="card-custom-shadow mb-3 px-6 py-5 rounded-lg white"
                  @mouseenter="isPanelHover = true"
                  @mouseleave="isPanelHover = false"
                >
                  <h3
                    class="font-weight-bold grey--text spacing-tight text--darken-3"
                    style="position: relative"
                  >
                    {{ panel.title }}
                    <v-btn
                      v-show="isPanelHover"
                      absolute
                      fab
                      right
                      x-small
                      @click="showPanelEditModal(panel)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </h3>
                  <div
                    v-for="(item, panelIndex) in panel.items"
                    :key="panelIndex"
                  >
                    <v-row
                      v-if="!item.hidden"
                    >
                      <v-col
                        class="align-center d-flex flex-grow-0 flex-shrink-0"
                      >
                        <img
                          v-if="item.icon === 'mdi-currency-usd'"
                          alt="Money Icon"
                          src="../../assets/money-icon.svg"
                          width="30"
                        >
                        <v-icon
                          v-else
                          color="grey lighten-1"
                        >
                          {{ item.icon || 'mdi-information' }}
                        </v-icon>
                      </v-col>
                      <v-col
                        class="flex-grow-1 flex-shrink-0"
                      >
                        <v-input :messages="item.label">
                          <template v-if="item.icon === 'mdi-currency-usd'">
                            <b class="grey--text text--darken-3 text--lighten-2">
                              {{ '$' + currencyFormatting(item.model) }}
                            </b>
                          </template>
                          <div v-else-if="item.label === 'Current FY Actuals w/Forecasted'">
                            <b>{{ item.model }}</b>
                          </div>
                          <b
                            v-else
                            class="grey--text text--darken-3 text--lighten-2"
                          >{{ item.model || '' }}</b>
                        </v-input>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <div class="d-none overflow-hidden">
                  <div class="align-center d-flex my-3">
                    <v-icon
                      class="grey--text text--darken-3"
                      size="22"
                    >
                      mdi-clipboard-file-outline
                    </v-icon>
                    <p
                      class="font-weight-ligshten grey--text mb-0 ml-3 text--darken-3 text-body-2 w-4/5"
                    >
                      Company Name
                    </p>
                  </div>
                  <div class="align-center d-flex my-3">
                    <v-icon
                      class="grey--text text--darken-3"
                      size="22"
                    >
                      mdi-email-outline
                    </v-icon>
                    <p
                      class="font-weight-ligshten grey--text mb-0 ml-3 text--darken-3 text-body-2 w-4/5"
                    >
                      company@gmail.com
                    </p>
                  </div>
                  <div class="align-center d-flex my-3">
                    <v-icon
                      class="grey--text text--darken-3"
                      size="22"
                    >
                      mdi-clipboard-file-outline
                    </v-icon>
                    <p
                      class="font-weight-ligshten grey--text mb-0 ml-3 text--darken-3 text-body-2 w-4/5"
                    >
                      Company Last Name
                    </p>
                  </div>
                  <div class="align-center d-flex my-3">
                    <v-icon
                      class="grey--text text--darken-3"
                      size="22"
                    >
                      mdi-phone
                    </v-icon>
                    <p
                      class="font-weight-ligshten grey--text mb-0 ml-3 text--darken-3 text-body-2 w-4/5"
                    >
                      (+51) 9874363722
                    </p>
                  </div>
                  <div class="align-center d-flex my-3">
                    <v-icon
                      class="grey--text text--darken-3"
                      size="22"
                    >
                      mdi-earth
                    </v-icon>
                    <p
                      class="font-weight-ligshten grey--text mb-0 ml-3 text--darken-3 text-body-2 w-4/5"
                    >
                      www.company.com
                    </p>
                  </div>
                </div>
              </div>

              <div
                slot="rightPanel"
                class="mb-4 panel px-0"
              >
                <project-social-media
                  class="px-0"
                  :external="true"
                />
              </div>
            </panel-two-columns>
          </template>
          <!--FINANCIALS-->
          <template v-if="activeTab === 1">
            <panel-full>
              <template slot="content">
                <financial-cost-summary />
              </template>
            </panel-full>
            <v-spacer />
            <panel-full>
              <template slot="content">
                <reconciliation />
              </template>
            </panel-full>
            <v-spacer />
            <panel-full>
              <template slot="content">
                <financial-commitments />
              </template>
            </panel-full>
            <v-spacer />
            <panel-full>
              <template slot="content">
                <financial-spendings />
              </template>
            </panel-full>
            <panel-full>
              <template slot="content">
                <budgets />
              </template>
            </panel-full>
            <v-spacer />
          </template>
          <!--FINANCIALS-->

          <!--SCHEDULE-->
          <template v-if="activeTab === 2">
            <!-- <panel-full
              v-if="!panelSettings.mileTracker"
            >
              <template slot="content">
                <milestones :type="type" />
              </template>
            </panel-full> -->
            <!-- <panel-full v-if="!panelSettings.mileSchedule">
              <template slot="content">
                <schedule :type="type" />
              </template>
            </panel-full>
            <panel-full v-if="isPlannedProject">
              <template slot="content">
                <forecasts />
              </template>
            </panel-full> -->
          </template>
          <!--SCHEDULE-->

          <!--DOCUMENT MANAGER-->
          <template v-if="activeTab === 3">
            <panel-full>
              <template slot="content">
                <project-files />
              </template>
            </panel-full>
          </template>
          <!--DOCUMENT MANAGER-->

          <!-- UPDATES -->
          <template v-if="activeTab === 4">
            <panel-two-columns>
              <budget-comment slot="leftPanel" />
              <status-comment slot="rightPanel" />
            </panel-two-columns>
          </template>
          <!-- UPDATES -->

          <!--REPORTS-->
          <template v-if="activeTab === 5">
            <!-- <panel-full v-if="!panelSettings.mileSchedule">
              <template slot="content">
                <schedule :type="type" />
              </template>
            </panel-full>
            <panel-full v-if="isPlannedProject">
              <template slot="content">
                <forecasts />
              </template>
            </panel-full> -->
          </template>
          <!--REPORTS-->

          <!--SETTINGS-->
          <template v-if="activeTab === 6">
            <panel-full>
              <settings-tab slot="content" />
            </panel-full>
          </template>
        </div>
      </app-template-plain>
    </v-row>
  </v-container>
</template>

<script>
const defaults = {
  money: '0.00',
  text: 'N/A',
  date: '--/--/----',
  percent: '0'
}
import { mapGetters, mapActions } from 'vuex'
import AppTemplatePlain from '@/views/Home/AppTemplatePlain'
import PanelFull from '@/components/AppBuilder/Content/PanelFull'
import PanelTwoColumns from '@/components/AppBuilder/Content/PanelTwoColumns'
import FinancialCostSummary from '@/modules/cpm/components/projects/panels/FinancialCostSummary'
import Budgets from '@/modules/cpm/components/projects/panels/Financial/Budgets'
import Reconciliation from '@/modules/cpm/components/projects/panels/Reconciliation'
import FinancialCommitments from '@/modules/cpm/components/projects/panels/FinancialCommitments'
import FinancialSpendings from '@/modules/cpm/components/projects/panels/FinancialSpendings'
import ProjectSocialMedia from '@/views/Home/ProjectSocialMedia'
import ProjectFiles from '@/modules/cpm/components/projects/panels/ProjectFiles'
import SettingsTab from '@/modules/cpm/components/settings/Settings.vue'
import {
  db,
  newFirebaseInit,
  doFirebaseAuth
} from '@/utils/Firebase'
import StatusComment from '../../modules/cpm/components/projects/panels/StatusComment.vue'
import BudgetComment from '../../modules/cpm/components/projects/panels/BudgetComment.vue'
import EditPanelDialog from '../Dialogs/EditPanelDialog'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'Apps',
  components: {
    EditPanelDialog,
    AppTemplatePlain,
    PanelFull,
    PanelTwoColumns,
    FinancialCostSummary,
    Reconciliation,
    ProjectSocialMedia,
    FinancialCommitments,
    FinancialSpendings,
    SettingsTab,
    Budgets,
    ProjectFiles,
    StatusComment,
    BudgetComment
  },
  data: () => ({
    showEditPanel: false,
    panelToEdit: {},
    tab: null,
    isPanelHover: false,
    items: ['Profile', 'People', 'Details'],
    currentTab: 0,
    project: {
      basic: {}
    },
    type: 'project',
    tabs: [
      'Home',
      'Financials',
      'Schedule',
      'Document Manager',
      'Updates',
      'Reports',
      'Settings'
    ],
    activeTab: 0,
    loading: false
  }),
  computed: {
    isPlannedProject() {
      return this.$h.dg(this.$route, 'name') === 'cpm.forecasting.show'
    },
    ...mapGetters({
      getScreenStatus: 'GeneralListModule/get_screen_status',
      getRecordFullScreen: 'GeneralListModule/get_record_full_screen',
      getImagePreviewOverlay: 'get_image_preview_overlay'
    }),
    ...mapGetters({
      panelSettings: 'hideCpmPanels/getPanelSettings'
    }),
    projectInformation() {
      return [
        {
          title: 'Project Quickview',
          type: 'basic',
          items: [
            {
              label: 'Project Title',
              model: this.project.title,
              default: defaults.text,
              hidden: false,
              icon: 'mdi-information'
            },
            {
              label: 'Project Manager',
              model: this.project.basic.projectManager,
              default: defaults.text,
              hidden: false,
              icon: 'mdi-badge-account'
            },
            {
              label: 'Location',
              model: this.project.basic.location,
              default: defaults.autocomplete,
              hidden: false,
              icon: 'mdi-google-maps'
            },
            {
              label: 'Status',
              model: this.project.status,
              default: defaults.text,
              hidden: false,
              icon: 'mdi-list-status'
            },
            {
              label: 'Category 1',
              model: this.project.basic.category1,
              default: defaults.text,
              hidden: false,
              icon: 'mdi-subtitles-outline'
            },
            {
              label: 'Range',
              model: this.project.basic.range,
              default: defaults.text,
              hidden: false,
              icon: 'mdi-information'
            },
            {
              label: 'Prior Spend',
              model: this.project.basic.priorSpend,
              default: defaults.text,
              hidden: false,
              icon: 'mdi-information'
            },
            {
              label: 'Current FY Actuals w/Forecasted',
              model: this.project.basic.currentFYActualsWForecasted,
              default: defaults.autocomplete,
              hidden: false,
              icon: 'mdi-information'
            },
            {
              label: 'YTD Actuals Capitals',
              model: this.project.basic.yTDActualsCapitals,
              default: defaults.money,
              hidden: false,
              icon: 'mdi-currency-usd'
            },
            {
              label: 'CPA Capital',
              model: this.project.basic.cPACapital,
              default: defaults.money,
              hidden: false,
              icon: 'mdi-currency-usd'
            },
            {
              label: 'CPA Capital With Contingency',
              model: this.project.basic.cPACapitalWithContingency,
              default: defaults.money,
              hidden: false,
              icon: 'mdi-currency-usd'
            },
            {
              label: 'General Contractor',
              model: this.project.basic.generalContractor,
              default: defaults.text,
              hidden: false,
              icon: 'mdi-badge-account'
            },
            {
              label: 'Description',
              model: this.project.description,
              default: defaults.text,
              hidden: false,
              icon: 'mdi-information'
            },
            {
              label: 'Phase',
              model: this.project.basic.phase,
              default: defaults.text,
              hidden: true,
              icon: 'mdi-badge-account'
            },
            {
              label: 'Target Date / Phase',
              model: this.project.basic.targetDatePhase,
              default: defaults.date,
              hidden: true,
              icon: 'mdi-calendar'
            },
            {
              label: 'Construction Start',
              model: this.project.basic.constructionStart,
              default: defaults.date,
              hidden: true,
              icon: 'mdi-calendar'
            },
            {
              label: 'Anticipated Construction Finish',
              model: this.project.basic.anticipatedConstructionFinish,
              default: defaults.date,
              hidden: true,
              icon: 'mdi-calendar'
            },
            {
              label: 'Complete Budget',
              model: this.project.basic.completeBudget,
              default: defaults.percent,
              hidden: true,
              icon: 'mdi-percent'
            },
            {
              label: 'Complete Schedule',
              model: this.project.basic.completeSchedule,
              default: defaults.percent,
              hidden: true,
              icon: 'mdi-percent'
            },
            {
              label: 'Complete',
              model: this.project.basic.complete,
              default: defaults.percent,
              hidden: true,
              icon: 'mdi-percent'
            },
            {
              label: 'Budget Status',
              model: this.project.basic.budgetStatus,
              default: defaults.percent,
              hidden: true,
              icon: 'mdi-percent'
            },
            {
              label: 'Total Capital',
              model: this.project.basic.totalCapital,
              default: defaults.money,
              hidden: false,
              icon: 'mdi-currency-usd'
            },
            {
              label: 'Spent to Date',
              model: this.project.basic.spentToDate,
              default: defaults.money,
              hidden: false,
              icon: 'mdi-currency-usd'
            }
          ]
        }
      ]
    }
  },
  async created() {
    // Init Firebase
    await newFirebaseInit()
    await doFirebaseAuth()

    const res = await db
      .collection('cpm_projects')
      .doc(this.$route.params.id)
      .get()
    this.project = await res.data()

    await this.$store.dispatch('GSFeed/setRoom', 'cpm')
    await this.$store.dispatch('GSFeed/setCpmFeed', this.$route.params.id)
    await this.$store.dispatch('GSFeed/retrieveFeed')
  },
  mounted() {
    this.setShowSidePanels(false)
  },
  beforeDestroy() {
    this.setShowSidePanels(true)
  },
  methods: {
    async updateProject() {
      const res = await db
        .collection('cpm_projects')
        .doc(this.$route.params.id)
        .get()
      this.project = res.data()
    },
    uploadProjectImage(data) {
      try {
        this.loading = true
        if (data.ok) {
          const projectImage = data.data.link

          db.collection('cpm_projects')
            .doc(this.$route.params.id)
            .update({
              projectImage: projectImage
            })
            .then(() => {
              this.project.projectImage = projectImage
              this.$snotify.success('The image was uploaded', 'Success')
            })
            .catch(() =>
              this.$snotify.error(
                'There was an error while uploading',
                'Error'
              )
            )
            .finally(() => {
              this.loading = false
            })
        } else {
          this.loading = false
          this.$snotify.error(
            'There was an error while uploading',
            'Error'
          )
        }
      } catch (e) {
        this.$snotify.error(
          'There was an error while uploading',
          'Error'
        )
        this.loading = false
      }
    },
    deleteProjectImage() {
      const confirmDelete = confirm('Are you sure to delete the project image?')
      if (confirmDelete) {
        this.loading = true

        const projectImage = ''

        db.collection('cpm_projects')
          .doc(this.$route.params.id)
          .update({
            projectImage: projectImage
          })
          .then(() => {
            this.project.projectImage = projectImage
            this.$snotify.success('The image was deleted', 'Success')
          })
          .catch(() =>
            this.$snotify.error(
              'There was an error while deleting',
              'Error'
            )
          )
          .finally(() => {
            this.loading = false
          })
      }
    },
    showPanelEditModal(panel) {
      this.panelToEdit = { ...panel }
      this.showEditPanel = true
    },
    camelize(str) {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase()
        })
        .replace(/\s+/g, '')
        .replace('/', '')
    },
    ...mapActions('PageControl', {
      setShowSidePanels: 'setShowSidePanels'
    }),
    currencyFormatting(value) {
      if (!value) {
        return 0
      }
      if (typeof value === 'number') {
        return Math.round(value).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
      } else if (typeof value === 'string') {
        value = value.trim()
        return value
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>

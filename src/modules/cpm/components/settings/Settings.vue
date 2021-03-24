<template>
  <v-container class="pa-0 rounded-lg">
    <v-row class="ma-0 pa-0">
      <v-col
        class="pa-0 pr-1"
        cols="4"
      >
        <v-card class="card-custom-shadow px-5 rounded-lg">
          <v-list>
            <v-row
              v-for="(setting, sindex) in settings"
              :key="sindex"
            >
              <template>
                <v-list-item
                  :class="activeSetting === setting ? 'settingActive' : ''"
                  @click="activateSettingFn(setting)"
                >
                  <v-list-item-icon>
                    <v-icon size="30">
                      {{ setting.icon }}
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ setting.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-row>
          </v-list>
        </v-card>
      </v-col>

      <v-col
        v-if="activeSetting.options"
        class="py-0"
        cols="4"
      >
        <options
          :options="activeSetting.options"
          @updateOption="updateOption"
        />
      </v-col>

      <v-col
        class="pa-0 pl-1"
        cols="4"
      >
        <v-card
          v-if="currentComponent"
          class="card-custom-shadow holis pa-4 white"
        >
          <component :is="currentComponent" />
        </v-card>
      </v-col>
    </v-row>

    <m6-loading :loading="showLoading" />
  </v-container>
</template>

<script>
import Options from './components/settingsOptions'
import CompanyLocations from './components/settings/CompanyLocations'
import Category from './components/settings/Categories'
import Status from './components/settings/Status'
import Types from './components/settings/Types'
import Phases from './components/settings/Phases'
import Licensing from './components/settings/Licensing'
import Campus from './components/settings/Campus'
import DefaultPolicyProcedure from './components/settings/DefaultPolicyProcedure'
import FYApproved from './components/settings/FYApproved'
import FiscalYears from './components/settings/FiscalYears'
import Order from './components/settings/Order'
import ExpirationDate from './components/settings/ExpirationDate'
import CapitalType from './components/settings/CapitalType'
import BudgetStatus from './components/settings/BudgetStatus'
import BudgetCategories from './components/settings/BudgetCategories'
import BudgetTypes from './components/settings/BudgetTypes'
import BudgetLine from './components/settings/BudgetLine'
import ChangesReasons from './components/settings/ChangesReasons'
import ChangesStatus from './components/settings/ChangesStatus'
import ChangesTypes from './components/settings/ChangesTypes'
import CommitmentsStatus from './components/settings/CommitmentsStatus'
import CommitmentsTypes from './components/settings/CommitmentsTypes'
import CompanyTypes from './components/settings/CompanyTypes'
import Covid19RiskStatus from './components/settings/Covid19RiskStatus'
import HideBudgetFields from './components/settings/HideBudgetFields'
import GanttAdmin from './components/settings/GanttAdmin'
import RfpStatus from './components/settings/RfpStatus'
import TimelineAdmin from './components/settings/TimelineAdmin'
import TaskTypes from './components/settings/TaskTypes'
import TaskStatus from './components/settings/TaskStatus'
import TaskTags from './components/settings/TaskTags'
import ProjectManager from './components/settings/ProjectManager'
import BudgetApprover from './components/settings/BudgetApprover'
import Roles from './components/settings/Roles'
import CategoriesPolicy from './components/settings/CategoriesPolicy'
import CategoriesTypesPolicy from './components/settings/CategoriesTypesPolicy'
import MilestonesStatus from './components/settings/MilestonesStatus'
import MilestonesNames from './components/settings/MilestonesNames'
import DefaultSchedule from './components/settings/DefaultSchedule'
import FundingStatus from './components/settings/FundingStatus'
import ProjectListColors from './components/settings/ProjectListColors'
import HideProjectDetails from './components/settings/HideProjectDetails'
import HideCpmPanels from './components/settings/HideCpmPanels'

export default {
  name: 'Settings',
  components: {
    BudgetApprover,
    BudgetCategories,
    BudgetLine,
    BudgetStatus,
    BudgetTypes,
    Campus,
    CapitalType,
    CategoriesPolicy,
    CategoriesTypesPolicy,
    CompanyLocations,
    Category,
    ChangesReasons,
    ChangesStatus,
    ChangesTypes,
    CommitmentsStatus,
    CommitmentsTypes,
    CompanyTypes,
    Covid19RiskStatus,
    DefaultPolicyProcedure,
    DefaultSchedule,
    ExpirationDate,
    FYApproved,
    FiscalYears,
    FundingStatus,
    GanttAdmin,
    HideBudgetFields,
    HideCpmPanels,
    HideProjectDetails,
    Licensing,
    MilestonesNames,
    MilestonesStatus,
    Options,
    Order,
    Phases,
    ProjectListColors,
    ProjectManager,
    RfpStatus,
    Roles,
    Status,
    TaskStatus,
    TaskTags,
    TaskTypes,
    TimelineAdmin,
    Types
  },
  data() {
    return {
      showLoading: false,
      settings: [
        {
          name: this.$t('cpmSettings.settings.project'),
          icon: 'mdi-ballot',
          options: [
            {
              name: this.$t('cpmSettings.settings.projOptions.locations'),
              component: 'CompanyLocations'
            },
            {
              name: this.$t('cpmSettings.settings.projOptions.category'),
              component: 'category'
            },
            {
              name: this.$t('cpmSettings.settings.projOptions.status'),
              component: 'status'
            },
            {
              name: this.$t('cpmSettings.settings.projOptions.type'),
              component: 'types'
            },
            {
              name: this.$t('cpmSettings.settings.projOptions.phase'),
              component: 'phases'
            },
            {
              name: this.$t('cpmSettings.settings.projOptions.licensing'),
              component: 'licensing'
            },
            {
              name: this.$t('cpmSettings.settings.projOptions.campus'),
              component: 'campus'
            },
            {
              name: this.$t('cpmSettings.settings.projOptions.defPolicy'),
              component: 'default-policy-procedure'
            },
            {
              name: this.$t('cpmSettings.settings.projOptions.fyApproved'),
              component: 'FYApproved'
            },
            {
              name: this.$t('cpmSettings.settings.projOptions.fiscalYears'),
              component: 'fiscal-years'
            },
            {
              name: this.$t('cpmSettings.settings.projOptions.order'),
              component: 'order'
            },
            {
              name: this.$t('cpmSettings.settings.projOptions.fundingStatus'),
              component: 'funding-status'
            },
            {
              name: this.$t('cpmSettings.settings.projOptions.capitalType'),
              component: 'capital-type'
            },
            {
              name: this.$t('cpmSettings.settings.projOptions.projListColors'),
              component: 'project-list-colors'
            },
            {
              name: this.$t(
                'cpmSettings.settings.projOptions.covid19RiskStatus'
              ),
              component: Covid19RiskStatus
            },
            {
              name: this.$t('cpmSettings.settings.projOptions.documentDefault'),
              component: 'expiration-date'
            },
            {
              name: 'Contractor Type',
              component: 'company-types'
            }
          ]
        },
        {
          name: this.$t('cpmSettings.settings.cost'),
          component: 'cost-options',
          icon: 'mdi-currency-usd',
          options: [
            {
              name: this.$t('cpmSettings.settings.costOptions.budgetStatus'),
              component: 'budget-status'
            },
            {
              name: this.$t('cpmSettings.settings.costOptions.budgetCat'),
              component: 'budget-categories'
            },
            {
              name: this.$t('cpmSettings.settings.costOptions.budgetTypes'),
              component: 'budget-types'
            },
            {
              name: this.$t('cpmSettings.settings.costOptions.budgetLineItems'),
              component: 'budget-line'
            },
            {
              name: this.$t('cpmSettings.settings.costOptions.changesReasons'),
              component: 'changes-reasons'
            },
            {
              name: this.$t('cpmSettings.settings.costOptions.changesStatus'),
              component: 'changes-status'
            },
            {
              name: this.$t('cpmSettings.settings.costOptions.changesTypes'),
              component: 'changes-types'
            },
            {
              name: this.$t('cpmSettings.settings.costOptions.commitStatus'),
              component: 'commitments-status'
            },
            {
              name: this.$t('cpmSettings.settings.costOptions.commitTypes'),
              component: 'commitments-types'
            }
          ]
        },
        {
          name: this.$t('cpmSettings.settings.scheduleCpm'),
          component: 'cost-options',
          icon: 'mdi-calendar',
          options: [
            {
              name: this.$t(
                'cpmSettings.settings.scheduleCpmOptions.scheduleType'
              ),
              component: 'gantt-admin'
            },
            {
              name: this.$t(
                'cpmSettings.settings.scheduleCpmOptions.milestoneStatus'
              ),
              component: 'milestones-status'
            },
            {
              name: this.$t(
                'cpmSettings.settings.scheduleCpmOptions.milestoneNames'
              ),
              component: 'milestones-names'
            },
            {
              name: this.$t(
                'cpmSettings.settings.scheduleCpmOptions.defaultSchedule'
              ),
              component: 'default-schedule'
            }
          ]
        },
        {
          name: this.$t('cpmSettings.settings.rfpTimeline'),
          component: 'cost-options',
          icon: 'mdi-currency-usd',
          options: [
            {
              name: this.$t(
                'cpmSettings.settings.rfpTimelineOptions.timelineAdmin'
              ),
              component: 'timeline-admin'
            }
          ]
        },
        {
          name: this.$t('cpmSettings.settings.tasks'),
          component: 'cost-options',
          icon: 'mdi-file-tree',
          options: [
            {
              name: this.$t('cpmSettings.settings.tasksOptions.taskStatus'),
              component: 'task-status'
            },
            {
              name: this.$t('cpmSettings.settings.tasksOptions.taskTypes'),
              component: 'task-types'
            },
            {
              name: this.$t('cpmSettings.settings.tasksOptions.messengerTags'),
              component: 'task-tags'
            }
          ]
        },
        {
          name: this.$t('cpmSettings.settings.users'),
          component: 'cost-options',
          icon: 'mdi-account-group',
          options: [
            {
              name: this.$t('cpmSettings.settings.usersOptions.projManager'),
              component: 'project-manager'
            },
            {
              name: this.$t('cpmSettings.settings.usersOptions.BudgetApprover'),
              component: 'budget-approver'
            },
            {
              name: this.$t('cpmSettings.settings.usersOptions.roles'),
              component: 'roles'
            }
          ]
        },
        {
          name: this.$t('cpmSettings.settings.policy'),
          component: 'cost-options',
          icon: 'mdi-briefcase',
          options: [
            {
              name: this.$t('cpmSettings.settings.policyOptions.cat'),
              component: 'categories-policy'
            },
            {
              name: this.$t('cpmSettings.settings.policyOptions.type'),
              component: 'categories-types-policy'
            }
          ]
        },
        {
          name: this.$t('cpmSettings.settings.rfp'),
          component: 'cost-options',
          icon: 'mdi-domain',
          options: [
            {
              name: this.$t('cpmSettings.settings.rfpOptions.status'),
              component: 'rfp-status'
            }
          ]
        },
        {
          name: this.$t('cpmSettings.settings.hideFields'),
          component: 'cost-options',
          icon: 'mdi-eye-outline',
          options: [
            {
              name: this.$t('cpmSettings.settings.hideFieldsOptions.budget'),
              component: 'hide-budget-fields'
            },
            {
              name: this.$t(
                'cpmSettings.settings.hideFieldsOptions.projDetails'
              ),
              component: 'hide-project-details'
            }
          ]
        },
        {
          name: this.$t('cpmSettings.settings.general'),
          component: 'cost-options',
          icon: 'mdi-cog',
          options: [
            {
              name: this.$t('cpmSettings.settings.generalOptions.hidePanels'),
              component: 'hide-cpm-panels'
            }
          ]
        }
      ],
      activeSetting: {},
      currentComponent: null
    }
  },
  methods: {
    activateSettingFn(setting) {
      this.activeSetting = setting
      this.currentComponent = null
    },
    updateOption(item) {
      this.currentComponent = item.component
    }
  }
}
</script>

<style lang="scss">
#cpmSettings {
  .showRequiredFields {
    h3 {
      margin-top: 10px;
    }
  }

  .flex-container {
    display: flex;
    flex-flow: row wrap;
  }

  .flex-column {
    flex: 1 0 calc(50% - 20px);
    max-width: calc(50% - 20px);
  }

  .setting-vcard {
    .v-card__title {
      padding: 10px;
      background: #0277bd;
      color: #fff;

      h3 {
        font-weight: 100;
      }
    }
  }

  .settingActive {
    color: #fff;
    background: #0277bd;
  }

  .blockbtn {
    .v-btn__content {
      display: block !important;
    }
  }

  .status-dot {
    height: 25px;
    width: 25px;
    border-radius: 50%;
    display: inline-block;
  }
  .xs-btn {
    width: 20px;
    height: 20px;
    i {
      font-size: 16px;
    }
  }
  .vs__dropdown-toggle {
    border: none;
    border-bottom: 1px solid #999;
    border-radius: 0px;
    margin-bottom: 16px;
    margin-top: 16px;
  }
}
</style>

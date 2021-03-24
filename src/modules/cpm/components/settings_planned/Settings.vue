<template>
  <v-container
    class="planned-settings rounded-lg"
    fluid
    grid-list-md
  >
    <v-row
      class="fill-height"
    >
      <v-col cols="4">
        <v-card class="card-settings px-2 rounded-lg">
          <div style="flex-container">
            <div
              v-for="(setting, sindex) in settings"
              :key="sindex"
            >
              <v-btn
                class="blockbtn flex-column"
                :class="activeSetting === setting ? 'settingActive' : ''"
                icon
                style="height:150px; width:100%; cursor: pointer;"
                v-on="on"
                @click="activateSettingFn(setting)"
              >
                <v-icon style="font-size:80px;">
                  {{ setting.icon }}
                </v-icon>
                <div>{{ setting.name }}</div>
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <options-list
          v-if="activeSetting !== null"
          :options="activeSetting.options"
          @updateOption="updateOption"
        />
      </v-col>
      <v-col cols="4">
        <keep-alive>
          <component :is="currentComponent" />
        </keep-alive>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BudgetApprover from './components/settings/BudgetApprover'
import BudgetCategories from './components/settings/BudgetCategories'
import BudgetLine from './components/settings/BudgetLine'
import BudgetStatus from './components/settings/BudgetStatus'
import BudgetTypes from './components/settings/BudgetTypes'
import Campus from './components/settings/Campus'
import CapitalType from './components/settings/CapitalType'
import Category from './components/settings/Categories'
import ChangesReasons from './components/settings/ChangesReasons'
import ComponentTemplate from './components/ComponentTemplate'
import DefaultSchedule from './components/settings/DefaultSchedule'
import FYApproved from './components/settings/FYApproved'
import FiscalYears from './components/settings/FiscalYears'
import GanttAdmin from './components/settings/GanttAdmin'
import HideBudgetFields from './components/settings/HideBudgetFields'
import HideProjectDetails from './components/settings/HideProjectDetails'
import Licensing from './components/settings/Licensing'
import MilestonesNames from './components/settings/MilestonesNames'
import MilestonesStatus from './components/settings/MilestonesStatus'
import Options from './components/SettingsOptions'
import ProjectManager from './components/settings/ProjectManager'
import Phases from './components/settings/Phases'
import ProjectListColors from './components/settings/ProjectListColors'
import Roles from './components/settings/Roles'
import ScheduleAdmin from './components/settings/ScheduleAdmin'
import Status from './components/settings/Status'
import TaskTags from './components/settings/TaskTags'
import TaskStatus from './components/settings/TaskStatus'
import TaskTypes from './components/settings/TaskTypes'

export default {
  name: 'Settings',
  components: {
    'budget-approver': BudgetApprover,
    'budget-categories': BudgetCategories,
    'budget-line': BudgetLine,
    'budget-status': BudgetStatus,
    'budget-types': BudgetTypes,
    'campus': Campus,
    'category': Category,
    'changes-reasons': ChangesReasons,
    'default-schedule': DefaultSchedule,
    'fya': FYApproved,
    'fy': FiscalYears,
    'gantt': GanttAdmin,
    'hide-budget': HideBudgetFields,
    'hide-project-details': HideProjectDetails,
    'licensing': Licensing,
    'milestones-names': MilestonesNames,
    'milestones-status': MilestonesStatus,
    'options-list': Options,
    'project-manager': ProjectManager,
    'phase': Phases,
    'project-list-colors': ProjectListColors,
    'rfp-admin': ScheduleAdmin,
    'roles': Roles,
    'status': Status,
    'task-tags': TaskTags,
    'task-status': TaskStatus,
    'task-types': TaskTypes,
    'tor': CapitalType,
    ComponentTemplate
  },
  data() {
    return {
      settings: [
        {
          name: 'Project',
          icon: 'ballot',
          options: [
            {
              name: 'Category',
              component: 'category'
            },
            {
              name: 'Status',
              component: 'status'
            },
            {
              name: 'Phase',
              component: 'phase'
            },
            {
              name: 'Licensing',
              component: 'licensing'
            },
            {
              name: 'Campus',
              component: 'campus'
            },
            {
              name: 'FY Approved',
              component: 'fya'
            },
            {
              name: 'Fiscal Years',
              component: 'fy'
            },
            {
              name: 'Capital type',
              component: 'tor'
            },
            {
              name: 'Project List Colors',
              component: 'project-list-colors'
            }
          ]
        },
        {
          name: 'Cost',
          component: 'cost-options',
          icon: 'attach_money',
          options: [
            {
              name: 'Budget Status',
              component: 'budget-status'
            },
            {
              name: 'Cost Element Category',
              component: 'budget-categories'
            },
            {
              name: 'Budget Types',
              component: 'budget-types'
            },
            {
              name: 'Budget Line Items',
              component: 'budget-line'
            },
            {
              name: 'Changes Reasons',
              component: 'changes-reasons'
            }
          ]
        },
        {
          name: 'Schedule CPM',
          component: 'cost-options',
          icon: 'schedule',
          options: [
            {
              name: 'Schedule Type',
              component: 'gantt'
            },
            {
              name: 'Milestone Status',
              component: 'milestones-status'
            },
            {
              name: 'Milestone Names',
              component: 'milestones-names'
            },
            {
              name: 'Default Schedule',
              component: 'default-schedule'
            }
          ]
        },
        {
          name: 'Schedule RFP',
          component: 'cost-options',
          icon: 'schedule',
          options: [
            {
              name: 'Schedule Admin',
              component: 'rfp-admin'
            }
          ]
        },
        {
          name: 'Tasks',
          component: 'cost-options',
          icon: 'list_alt',
          options: [
            {
              name: 'Tasks Status',
              component: 'task-status'
            },
            {
              name: 'Tasks Types',
              component: 'task-types'
            },
            {
              name: 'Messenger Tags',
              component: 'task-tags'
            }
          ]
        },
        {
          name: 'Users',
          component: 'cost-options',
          icon: 'emoji_people',
          options: [
            {
              name: 'Project Manager',
              component: 'project-manager'
            },
            {
              name: 'Budget Approver',
              component: 'budget-approver'
            },
            {
              name: 'Roles',
              component: 'roles'
            }
          ]
        },
        {
          name: 'Hide Fields',
          component: 'cost-options',
          icon: 'visibility',
          options: [
            {
              name: 'Budget',
              component: 'hide-budget'
            },
            {
              name: 'Project Details',
              component: 'hide-project-details'
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
.planned-settings {
  .card-settings {
    height: 100%;
  }
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

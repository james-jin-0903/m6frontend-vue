import Blank from '@/components/_partials/M6Blank'

const endpoint = '/cpm'
const name = 'cpm'

const Dashboard = () =>
  import(/* webpackChunkName: "cpm" */ '@/modules/cpm/components/Dashboard')

const ProjectList = () =>
  import(/* webpackChunkName: "cpm" */ '@/modules/cpm/components/projects/ListELK')

const ProjectProfile = () =>
  import(
    /* webpackChunkName: "cpm" */ '@/modules/cpm/components/projects/ProjectProfile'
  )

const ProjectProfileFullscreenComponent = () =>
  import(
    /* webpackChunkName: "cpm" */ '@/modules/cpm/components/projects/ProjectProfileFullscreenComponent'
  )

const Reports = () =>
  import(
    /* webpackChunkName: "cpm" */ '@/modules/cpm/components/projects/panels/reports/Panel'
  )

const Settings = () =>
  import(/* webpackChunkName: "cpm" */ '@/modules/cpm/components/settings/Settings')

const PlannedSettings = () =>
  import(/* webpackChunkName: "cpm" */ '@/modules/cpm/components/settings_planned/Settings')

const CapitalList = () =>
  import(/* webpackChunkName: "cpm" */ '@/modules/cpm/components/capital/List')

const CapitalPlanProfile = () =>
  import(/* webpackChunkName: "cpm" */ '@/modules/cpm/components/capital/CapitalPlanProfile')

const ForecastingCashFlow = () =>
  import(/* webpackChunkName: "cpm" */ '@/modules/cpm/components/projects/forecasting_cash_flow/ForecastingDashboard')

const ProjectMilestoneDashboard = () =>
  import(/* webpackChunkName: "cpm" */ '@/modules/cpm/components/projects/milestone_dashboard/Dashboard')

export default [
  {
    path: `${endpoint}`,
    component: Blank,
    children: [
      {
        path: 'dashboard',
        name: `${name}.dashboard.show`,
        component: Dashboard
      },
      {
        path: 'forecasting/cashflow',
        name: `${name}.forecasting.cashflow`,
        component: ForecastingCashFlow,
      },
      {
        path: 'forecasting',
        name: `${name}.forecasting.index`,
        component: ProjectList,
        props: {
          type: 'forecasted'
        }
      },
      {
        path: 'forecasting/:id',
        name: `${name}.forecasting.show`,
        component: ProjectProfile,
        props: {
          type: 'forecasted'
        }
      },
      {
        path: 'projects',
        name: `${name}.projects.index`,
        component: ProjectList
      },

      {
        path: 'projects/milestones/dashboard',
        name: `${name}.projects.milestones`,
        component: ProjectMilestoneDashboard
      },

      {
        path: 'projects/:id',
        name: `${name}.projects.show`,
        component: ProjectProfile
      },
      {
        path: 'projects/:id/fullscreen/:panel',
        name: `${name}.projects.fullscreen`,
        component: ProjectProfileFullscreenComponent
      },
      {
        path: 'reports',
        name: `${name}.reports`,
        component: Reports
      },
      {
        path: 'settings',
        name: `${name}.settings`,
        component: Settings
      },
      {
        path: 'planned_settings',
        name: `${name}.planned.settings`,
        component: PlannedSettings
      },
      {
        path: 'capital-plan',
        name: `${name}.capitalPlan.index`,
        component: CapitalList
      },
      {
        path: 'capital-plan/:id',
        name: `${name}.capitalPlan.show`,
        component: CapitalPlanProfile
      }
    ]
  }
]

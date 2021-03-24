<template>
  <v-row ref="fullscreen">
    <component
      :is="$route.params.panel"
    />
  </v-row>
</template>

<script>
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
import Rfps from './panels/Rfp/Rfps'
import Reconciliation from './panels/Reconciliation'

export default {
  name: 'ProjectProfileFullscreenComponent',
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
    Schedule,
    FinancialsBudgets,
    ProjectAssignment,
    ComingSoon,
    Milestones,
    Rfps,
    Estimations,
    SpendingForecast,
    Reconciliation
  }
}
</script>

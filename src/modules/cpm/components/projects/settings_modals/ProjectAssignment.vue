<template>
  <v-dialog
    v-model="show"
    max-width="800px"
    persistent
    scrollable
  >
    <v-card>
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">
          Project Team Settings
        </span>
        <v-spacer />
        <portal-target :name="`assignment-${tab}`" />
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-tabs
        v-model="tab"
        centered
        color="#006699"
        dark
        fixed-tabs
      >
        <v-tab>Project Manager</v-tab>
        <v-tab>Budget Approver</v-tab>
        <v-tab>Roles</v-tab>
      </v-tabs>

      <v-card-text
        class="pa-0 vertical-scroll"
        :style="{'height': getViewPortHeight}"
      >
        <v-container
          class="pa-0 rounded-lg"
          fluid
        >
          <div v-if="tab === 0">
            <project-manager :included="true" />
          </div>
          <div v-if="tab === 1">
            <budget-approver :included="true" />
          </div>
          <div v-if="tab === 2">
            <roles :included="true" />
          </div>
        </v-container>
      </v-card-text>


      <v-divider />
      <m6-loading :loading="showLoading" />
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="gray"
          text
          @click="$emit('close')"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script >
import ProjectManager from '../../settings/components/settings/ProjectManager'
import BudgetApprover from '../../settings/components/settings/BudgetApprover'
import Roles from '../../settings/components/settings/Roles'
export default {
  components: {
    'project-manager': ProjectManager,
    'budget-approver': BudgetApprover,
    'roles': Roles
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tab: 0,
      showLoading: false,
      viewPortHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) * 0.6
    }
  },
  computed: {
    getViewPortHeight() {
      return `${this.viewPortHeight}px`
    }
  }
}
</script>

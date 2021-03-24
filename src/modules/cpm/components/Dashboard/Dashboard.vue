<template>
  <m6-show
    aside-title="CPM Dashboard"
    :loading="loading"
  >
    <template
      v-if="!loading"
      v-slot:aside
    >
      <c-p-m-d-budget :companies-cpm-projects="companiesCpmProjects" />
    </template>

    <div
      v-if="!loading"
      class="pa-3"
    >
      <c-p-m-d-project-cost-summary :companies-cpm-projects="companiesCpmProjects" />

      <c-p-m-d-spending :companies-cpm-projects="companiesCpmProjects" />
    </div>
  </m6-show>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import CPMDBudget from './_partials/CPMDBudget'
import CPMDProjectCostSummary from './_partials/CPMDProjectCostSummary'
import CPMDSpending from './_partials/CPMDSpending'

export default {
  components: {
    CPMDBudget,
    CPMDProjectCostSummary,
    CPMDSpending
  },

  computed: {
    ...mapGetters('companies/cpmProjects', ['companiesCpmProjects']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    loading() {
      return typeof this.companiesCpmProjects === 'string'
    }
  },

  created() {
    this.bindCompaniesCpmProjects({
      companyId: this.currentCompany.id
    })
  },

  methods: mapActions('companies/cpmProjects', ['bindCompaniesCpmProjects'])
}
</script>

<template />

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters, mapActions } = createNamespacedHelpers('capitalPlan')
export default {
  computed: {
    ...mapState({
      capitalPlan: state => state.capitalPlan
    }),
    ...mapGetters({
      projectsCount: 'projectsCount',
      projects: 'projects'
    })
  },
  methods: {
    ...mapActions([
      'bindCapitalPlanRef',
      'setCapitalId'
    ])
  }
}
</script>

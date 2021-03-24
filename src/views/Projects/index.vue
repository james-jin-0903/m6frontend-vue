<template>
  <v-container
    class="dont-show-scroll pt-0 rounded-lg vertical-scroll"
    fluid
  >
      <v-col
        class="pa-0"
        cols="12"
      >
        <list-projects v-if="!loading" />
      </v-col>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import ListProjects from './ListProjects'
import {
  newFirebaseInit,
  doFirebaseAuth
} from '@/utils/Firebase'

import defaultSettings from '@/modules/cpm/config/defaultSettings'

export default {
  name: 'Index',
  components: {
    ListProjects
  },
  data() {
    return {
      loading: true
    }
  },
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    ...mapState('UserSettingsControl', {
      secondColumnComponent: 'secondColumnComponent',
      thirdColumnComponent: 'thirdColumnComponent'
    })
  },
  async created() {
    // Init Firebase
    await newFirebaseInit()
    await doFirebaseAuth()
    await defaultSettings(this.currentCompany.id)
    this.loading = false
  },
  mounted() {
    this.setShowSidePanels(false)
  },
  beforeDestroy() {
    this.setShowSidePanels(true)
  },
  methods: {
    ...mapMutations('PageControl', {
      setShowSidePanels: 'setShowSidePanels'
    })
  }
}
</script>

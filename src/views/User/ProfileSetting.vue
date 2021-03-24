<template>
  <v-container
    class="rounded-lg"
    fluid
  >  
    <v-img
      height="40vh"
      src="https://picsum.photos/id/11/500/300"
      width="100%" />
    <v-row class="px-10">
      <v-col
        cols="5"
        style="margin-top: -140px"
      >
        <profile-main-section />
      </v-col>
      <v-col cols="7">
        <profile-portfolio-section />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import ProfileMainSection from '@/components/user/profile/ProfileMainSection'
import ProfilePortfolioSection from '@/components/user/profile/ProfilePortfolioSection'


export default {
  name: 'UserSettings',
  components: {
    ProfileMainSection,
    ProfilePortfolioSection
  },
  computed: {
  },
  mounted() {
    console.log(this.$route.params.profileID)
    this.getCurrentUserByProfileID(this.$route.params.profileID)
    this.setShowSidePanels(false)
  },
  beforeDestroy() {
    this.setShowSidePanels(true)
  },
  methods: {
    ...mapActions('Companies', {
      getCurrentUserByProfileID: 'getCurrentUserByProfileID'
    }),
    ...mapMutations('PageControl', {
      setShowSidePanels: 'setShowSidePanels'
    })
  }

}
</script>

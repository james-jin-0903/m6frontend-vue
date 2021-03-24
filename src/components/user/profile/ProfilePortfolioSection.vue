<template>
  <v-card
    color="rgba(0, 0, 0, 0)"
    elevation="0"
  >
    <v-tabs
      background-color="transparent"
    >
      <v-tab>All Projects (98)</v-tab>
      <v-tab>Mobile App (20)</v-tab>
      <v-tab>Websites (11)</v-tab>
      <v-tab>Wireframe (47)</v-tab>
      
      <v-tab-item
        v-for="n in 4"
        :key="n"
      >
        <v-container fluid>
          <v-row>
            <v-col
              v-for="i in 6"
              :key="i"
              cols="12"
              md="4"
            >
              <v-img
                :src="`https://picsum.photos/500/300?image=${i * n * 5 + 10}`"
                :lazy-src="`https://picsum.photos/10/6?image=${i * n * 5 + 10}`"
                aspect-ratio="1"
              ></v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import ProfileNavBar from '@/components/user/profile/ProfileNavBar'

export default {
  name: 'ProfileMainSection',
  components: {
    ProfileNavBar,
  },
  data: () => ({
    dateOptions: { year: 'numeric', month: 'long', day: 'numeric' },
    timeOptions: { hour: '2-digit', minute: '2-digit' },
    showUserData: false
  }),
  computed: {
    ...mapGetters('Companies', {
      userData: 'getCurrentUser'
    })
  }
}
</script>

<style>
.theme--light.v-tabs-items {
  background-color: transparent !important;
}
</style>

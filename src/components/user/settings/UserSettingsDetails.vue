<template>
  <v-card
    class="bg-badge"
    :dark="darkMode"
    max-height="100%"
  >
    <v-card-text class="px-6 text-center">
      <div class="absolute align-center d-flex left-0 ml-8 mt-8 top-0 w-full">
        <div>
          <v-img
            alt="company logo image"
            class="mr-4"
            max-width="100"
            :src="currentCompanyData.data.result.logo"
          />
        </div>
      </div>
      <div class="d-flex justify-end">
        <v-btn
          icon
          @click="showUserData = true"
        >
          <v-icon color="white">
            mdi-lead-pencil
          </v-icon>
        </v-btn>
      </div>

      <div class="flex-center flex-column">
        <v-avatar
          v-if="$h.dg(userData, 'avatar')"
          height="150"
          width="150"
        >
          <v-img
            alt="user profile image"
            class="mb-2"
            :src="$h.dg(userData, 'avatar')"
          />
        </v-avatar>
        <v-icon
          v-else
          size="10rem"
        >
          mdi-account-circle
        </v-icon>
        <v-spacer />
        <span class="black--text text-h6">
          {{ $h.dg(userData, 'firstName', '') }} {{ $h.dg(userData, 'lastName', '') }}
        </span>
        <v-spacer />

        <v-chip
          v-if="userData.status"
          class="mb-1 px-8 rounded"
          :color=" statusColors[userData.status] "
        >
          <b class="capitalize white--text">{{ userData.status.toLowerCase() === 'active' ? 'Approved' : userData.status.toLowerCase() }}</b>
        </v-chip>
        <br>
        <span class="mb-1 text-subtitle-1">Employee ID: {{ userData.id }}</span><br>
        <p class="blue--text font-weight-bold mb-0 text--darken-4 text-h5">
          {{ currentCompanyData.data.result.name }}
        </p>
      </div>
      <div class="align-center d-flex justify-space-around ml-2 mt-4">
        <qr-code
          class="my-4"
          :size="140"
          :text="userData.firstName + ' ' + userData.lastName + ' ' + userData.id"
        />
        <div class="flex-column flex-start light-blue lighten-5 pa-3 rounded-xl w-auto">
          <div class="flex-row flex-start">
            <v-icon>mdi-clock-time-four-outline</v-icon>
            <div class="flex-column flex-start">
              <span>Last Time Visited:</span>
              <v-spacer />
              <span>
                {{
                  $h.dg(userData, 'lastLogin', '') ?
                    new Date(userData.lastLogin).toLocaleDateString("en-US", dateOptions)
                    : null
                }}
              </span>
            </div>
          </div>

          <div class="flex-row flex-start">
            <v-icon>mdi-account-group</v-icon>
            <div class="flex-column flex-start">
              <span class="pb-2">User Department</span>
              <div>
                <v-chip
                  v-for="(dep, index) in $h.dg(userData, 'departments', [])"
                  :key="index"
                  :color="dep.color"
                >
                  <span class="white--text">{{ dep.name }}</span>
                </v-chip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>

    <user-profile-update
      :show="showUserData"
      :v-show="showUserData"
      @close="showUserData = false"
    />
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import UserProfileUpdate from '@/components/user/settings/UserProfileUpdate'

export default {
  name: 'UserSettingsDetails',
  components: {
    UserProfileUpdate
  },
  data: () => ({
    dateOptions: { year: 'numeric', month: 'long', day: 'numeric' },
    timeOptions: { hour: '2-digit', minute: '2-digit' },
    showUserData: false,
    currentCompanyData: null
  }),
  async created() {
    this.currentCompanyData = await this.$store.dispatch('Companies/getCompanyByID', this.userData.currentCompany)
  },
  computed: {
    ...mapState('UserSettingsControl', {
      userData: 'userToShow'
    }),
    ...mapState('Auth', {
      statusColors: 'statusColors'
    }),
    ...mapState('PageControl', {
      darkMode: 'darkModeGlobal'
    })
  }
}
</script>

<style lang="scss" scoped >
.round-img, .placeholder-img {
    width: 8.5rem;
    height: 8.5rem;
    margin-bottom: -1rem;
}
.round-img {
    object-fit: cover;
    border-radius: 50%;
}
.bg-badge {
    background-image: url(https://i.ibb.co/WtK3YqT/bg-badge.png);
    background-position: initial;
    background-repeat: no-repeat;
    background-size: contain;
}
</style>

<template>
  <v-card
    color="rgba(0, 0, 0, 0)"
    elevation="0"
    height="100%"
    >
    <v-card-text class="text-center">

      <div class="flex-center flex-column">
        <v-avatar
          v-if="$h.dg(userData, 'avatar')"
          height="210"
          width="210"
        >
          <v-img
            alt="user profile image"
            class="mb-2"
            :src="$h.dg(userData, 'avatar')"
          />
        </v-avatar>
        <v-icon
          v-else
          size="210"
        >
          mdi-account-circle
        </v-icon>
        <v-chip
          v-if="$h.dg(userData, 'joinStatus', '')"
          :color=" statusColors[$h.dg(userData, 'joinStatus', '')] "
        >
          <b class="white--text">{{ $h.dg(userData, 'joinStatus', '').toLowerCase() }}</b>
        </v-chip>
        <v-spacer />
        <span class="d-block blue--text text--darken-2 text-h6 mt-5">
          {{ $h.dg(userData, 'firstName', '') }} {{ $h.dg(userData, 'lastName', '') }}
        </span>
        <v-spacer />
        <span class="text-subtitle-1 grey--text">{{ userData.email }}</span>
      </div>
      <div class="flex-column flex-start pa-2">
        <div class="d-flex flex-row flex-start pa-1 mt-5 mb-2 justify-space-around">
          <div class="d-flex flex-column flex-start">
            <span class="grey--text text--darken-2 font-weight-bold subtitle-1">321
            </span>
            <span class="grey--text">Followers</span>
          </div>
          <div class="d-flex flex-column flex-start">
            <span class="grey--text text--darken-2 font-weight-bold subtitle-1">123
            </span>
            <span class="grey--text">Following</span>
          </div>
        </div>

        <v-divider></v-divider>

        <div class="flex-row flex-start pa-1 mt-5">
          <div class="flex-column flex-start ml-2">
            <p class="font-weight-bold subtitle-1">
              Hello!!! My name is Nilesh, As UX designer, I create products by leveraging my skills (UX/UI Design, User Research, Wire framing, Usability testing, prototyping, Heuristic Evaluation)
            </p>
          </div>
        </div>

        <div class="flex-row flex-start pa-1">
          <v-icon>mdi-facebook</v-icon>
          <v-icon>mdi-linkedin</v-icon>
          <v-icon>mdi-instagram</v-icon>
          <v-icon>mdi-dribbble</v-icon>
          <div class="flex-column flex-start ml-2">
            <span class="pb-2">User Departments:</span>
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
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProfileMainSection',
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
</style>

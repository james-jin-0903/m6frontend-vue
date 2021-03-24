/* eslint-disable vue/no-unused-vars */
<template>
  <div class="d-flex fixed justify-center nav-bar px-4 top-0 w-full">
    <mobile-btn-drop-down
      class="mobilebtn-dropdown"
      :class="{
        'd-none': $vuetify.breakpoint.smAndUp,
      }"
      :overlay="overlay"
      :style="'margin-top: -10px;'"
    />
    <v-overlay
      class="record-overlay"
      opacity="0.7"
      :value="chatOverlay"
    >
      <v-row
        class="central-content flex flex-nowrap justify-space-between mx-auto relative top-6 transparent0 w-full"
        no-gutters
      >
        <div class="relative w-full">
          <v-btn
            absolute
            class="blue--text ml-auto pa-6 white"
            color="white"
            depressed
            icon
            right
            rounded
            :style="'margin-top: -54px;'"
            @click="chatOverlay = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <m6-chat
            class="ml-auto"
            :light-mode="true"
            @click.native="chatOverlay = false"
          />
        </div>
      </v-row>
    </v-overlay>
    <div class="align-center d-flex justify-space-between nav-content w-full">
      <div class="align-center d-flex w-side">
        <img
          alt="M6"
          height="36px"
          src="@/assets/m6-home-logo.png"
        >
        <v-btn
          class="ml-3"
          @click="goProfileView"
        >
          profile
        </v-btn>
      </div>
      <v-tabs
        v-if="$vuetify.breakpoint.mdAndUp"
        active-class="blue-darken"
        background-color="transparent"
        class="align-center d-flex justify-center mx-auto w-fit"
        color="white"
        height="60"
        :hide-slider="true"
        :value="3"
      >
        <v-tab
          v-for="(link, i) in quickAccessLinks"
          :key="'link' + i"
          class="mb-0 px-13"
          :to="link.url"
        >
          <apps-btn-drop-down
            v-if="link.text === 'apps'"
            :icon="link.icon"
          />
          <v-icon
            v-else
            color="white"
            size="30"
          >
            mdi-{{ link.icon }}
          </v-icon>
        </v-tab>
      </v-tabs>
      <div class="align-center d-flex justify-end w-side">
        <toggle-messenger-btn />
        <add-action-btn />
        <user-options />
        <div class="d-flex flex-column flex-end">
          <span
            class="font-weight-bold line-height-8 white--text"
            v-html="userFullName"
          />
          <span
            class="white--text"
            v-html="companyName"
          />
        </div>

        <!--        <company-home />-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UserOptions from '@/components/Home/TopNav/UserOptions'
import AddActionBtn from '@/components/Home/TopNav/AddActionBtn'
import AppsBtnDropDown from '@/components/Home/TopNav/AppsBtnDropDown'
import MobileBtnDropDown from '@/components/Home/TopNav/MobileBtnDropDown'
import ToggleMessengerBtn from '@/components/Home/TopNav/ToggleMessengerBtn'
import M6Chat from '@/components/Home/M6Chat'
export default {
  name: 'TopNav',
  components: {
    UserOptions,
    AddActionBtn,
    AppsBtnDropDown,
    MobileBtnDropDown,
    M6Chat,
    ToggleMessengerBtn
  },
  data: () => ({
    user: {
      name: 'John Doe',
      imgSrc: 'https://cdn.vuetifyjs.com/images/john.jpg'
    },
    dialog: false,
    modal: '',
    company: {
      name: 'Sharp Healthcare'
    },
    quickAccessLinks: [
      { url: '/', icon: 'home' },
      { url: '/companies', icon: 'office-building' },
      { url: '/records', icon: 'view-comfy', text: 'apps' },
      { url: '/store', icon: 'storefront' },
      { url: '/user/settings', icon: 'cog' }
    ],
    chatOverlay: false,
    overlay: null
  }),
  computed: {
    ...mapState('Auth', {
      currentUser: 'user'
    }),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    showLinksMessage: function () {
      return this.showLinks ? 'Less' : 'More'
    },
    heightShowLinksDiv: function () {
      return 7 * 35 + 'px'
    },
    userFullName() {
      return `${this.$h.dg(this.currentUser, 'firstName', '')} ${this.$h.dg(this.currentUser, 'lastName', '')}`.trunc(23)
    },
    companyName() {
      return `${this.$h.dg(this.currentCompany, 'result.name', '')}`.trunc(23)
    }
  },
  methods: {
    goProfileView() {
      this.$router.push('/profile/140')
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-bar {
  z-index: 100;
  background-color: #303fe1;
}
.nav-content {
  height: 60px;
  max-width: 1872px;
}

.nav-bar {
  & > .mobilebtn-dropdown {
    top: calc(100vh - 100px) !important;
    position: fixed;
    right: 0.5rem;
    margin-top: -10px;
  }
}
.blue-darken {
  background-color: #0247fe;
}
.line-height-8{
  line-height: 8px;
}
.flex-end {
 align-self: flex-end;
}
</style>

<style>
@media (max-width: 690px) {
  .v-overlay__content {
    top: 60px;
  }
}
</style>

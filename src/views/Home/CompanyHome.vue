<template>
  <app-template>
    <img
      v-if="currentCompany.logo"
      slot="actionbtn"
      :alt="currentCompany.name"
      class="ml-6 pointer rounded"
      height="45"
      :src="currentCompany.logo"
      width="62"
    >
    <div
      slot="header"
      class="align-center d-flex justify-space-between max-w-lg mx-auto pb-4 pt-6 w-full"
    >
      <div class="align-center d-flex">
        <img
          v-if="currentCompany.logo"
          :alt="currentCompany.name"
          class="pointer rounded"
          height="150"
          :src="currentCompany.logo"
          width="180"
        >
        <div class="ml-8">
          <p class="font-weight-regular mb-1 text-h5">
            {{ currentCompany.name }}
          </p>
          <p>{{ currentCompany.legalCompanyName }}</p>
        </div>
      </div>
      <div>
        <v-btn
          class="blue font-weight-black left-0 ml-3 mt-1 px-8 py-6 white--text"
          light
          text
        >
          Connect
        </v-btn>
      </div>
    </div>
    <div
      slot="tabs"
      class="align-center d-flex"
    >
      <v-tabs
        active-class="font-weight-black blue--text active-tab-company"
        :hide-slider="true"
      >
        <v-tab class="blue--text capitalize">
          Home
        </v-tab>
        <v-tab class="blue--text capitalize">
          People
        </v-tab>
        <v-tab class="blue--text capitalize">
          Topics
        </v-tab>
        <v-tab class="blue--text capitalize">
          Store
        </v-tab>
      </v-tabs>
    </div>
    <div
      slot="btns"
      class="align-center d-flex"
    >
      <v-btn
        class="capitalize font-weight-black grey grey--text left-0 lighten-2 ml-3 pa-3 text--darken-3"
        light
        text
      >
        Follow
      </v-btn>
      <v-btn
        class="capitalize font-weight-black grey grey--text left-0 lighten-2 ml-3 pa-3 text--darken-3"
        light
        text
      >
        Message
      </v-btn>
      <v-btn
        class="capitalize font-weight-black grey grey--text left-0 lighten-2 ml-3 pa-1 text--darken-3"
        elevation="0"
        light
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </div>
    <div
      slot="content"
      class="w-full"
    >
      <panel-full>
        <v-card
          slot="content"
          class="rounded-lg"
        >
          <div class="green lighten-1 px-4 py-2 white--text">
            Cost Summary
          </div>
          <v-container
            class="rounded-lg"
            fluid
          >
            <v-data-table />
          </v-container>
        </v-card>
      </panel-full>
      <panel-two-columns>
        <div
          slot="leftPanel"
          class="mb-3 panel px-4 py-3 white"
        >
          <h3 class="font-weight-bold grey--text spacing-tight text--darken-3">
            Information
          </h3>
          <div class="overflow-hidden">
            <div class="align-center d-flex my-3">
              <v-icon
                class="grey--text text--darken-3"
                size="22"
              >
                mdi-clipboard-file-outline
              </v-icon>
              <p class="black--text font-weight-ligshten mb-0 ml-3 text-body-2 w-4/5">
                {{ currentCompany.legalCompanyName }}
              </p>
            </div>
            <div class="align-center d-flex my-3">
              <v-icon
                class="grey--text text--darken-3"
                size="22"
              >
                mdi-email-outline
              </v-icon>
              <p class="black--text font-weight-ligshten mb-0 ml-3 text-body-2 w-4/5">
                {{ currentCompany.email }}
              </p>
            </div>
            <div class="align-center d-flex my-3">
              <v-icon
                class="grey--text text--darken-3"
                size="22"
              >
                mdi-clipboard-file-outline
              </v-icon>
              <p class="black--text font-weight-ligshten mb-0 ml-3 text-body-2 w-4/5">
                {{ currentCompany.name }}
              </p>
            </div>
            <div class="align-center d-flex my-3">
              <v-icon
                class="grey--text text--darken-3"
                size="22"
              >
                mdi-phone
              </v-icon>
              <p class="black--text font-weight-ligshten mb-0 ml-3 text-body-2 w-4/5">
                {{ currentCompany.phone }}
              </p>
            </div>
            <div class="align-center d-flex my-3">
              <v-icon
                class="grey--text text--darken-3"
                size="22"
              >
                mdi-earth
              </v-icon>
              <p class="black--text font-weight-ligshten mb-0 ml-3 text-body-2 w-4/5">
                {{ currentCompany.website }}
              </p>
            </div>
            <div class="align-center d-flex my-3">
              <v-icon
                class="grey--text text--darken-3"
                size="24"
              >
                mdi-heart
              </v-icon>
              <p class="black--text font-weight-ligshten mb-0 ml-3 text-body-2 w-4/5">
                {{ currentCompany.legalCompanyName }}
              </p>
            </div>
          </div>
        </div>
        <div slot="rightPanel">
          <project-social-media class="main-content px-0" />
        </div>
      </panel-two-columns>
    </div>
  </app-template>
</template>

<script>
import AppTemplate from '@/views/Home/AppTemplate'
import ProjectSocialMedia from './ProjectSocialMedia'
import PanelFull from '@/components/AppBuilder/Content/PanelFull'
import PanelTwoColumns from '@/components/AppBuilder/Content/PanelTwoColumns'
import { mapState } from 'vuex'

export default {

  components: {
    AppTemplate,
    ProjectSocialMedia,
    PanelFull,
    PanelTwoColumns
  },

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  }

}
</script>

<style lang="scs" scoped>

</style>

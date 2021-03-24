<template>
  <v-container
    class="dont-show-scroll pt-0 rounded-lg vertical-scroll"
    fluid
  >
    <v-row class="ma-0 pt-0 text-center">
      <v-col cols="12">
        <app-template :open-dialog="true">
          <!-- ACTION BTN DIV -->
          <div
            slot="actionbtn"
            class="card-custom-shadow pointer rounded white"
          />
          <!-- APP TEMPLATE CONTENT -->
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
                <h3
                  class="font-weight-bold grey--text spacing-tight text--darken-3"
                >
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
                    <p
                      class="black--text font-weight-ligshten mb-0 ml-3 text-body-2 w-4/5"
                    >
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
                    <p
                      class="black--text font-weight-ligshten mb-0 ml-3 text-body-2 w-4/5"
                    >
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
                    <p
                      class="black--text font-weight-ligshten mb-0 ml-3 text-body-2 w-4/5"
                    >
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
                    <p
                      class="black--text font-weight-ligshten mb-0 ml-3 text-body-2 w-4/5"
                    >
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
                    <p
                      class="black--text font-weight-ligshten mb-0 ml-3 text-body-2 w-4/5"
                    >
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
                    <p
                      class="black--text font-weight-ligshten mb-0 ml-3 text-body-2 w-4/5"
                    >
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import AppTemplate from '@/views/Home/AppTemplate'

export default {
  components: {
    AppTemplate
  },
  methods: {
    ...mapMutations('PageControl', {
      setShowSidePanels: 'setShowSidePanels'
    })
  },
  computed: {
    ...mapState('UserSettingsControl', {
      secondColumnComponent: 'secondColumnComponent',
      thirdColumnComponent: 'thirdColumnComponent'
    }),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  mounted() {
    console.log(this.$route.params.id)
    this.setShowSidePanels(false)
  },
  beforeDestroy() {
    this.setShowSidePanels(true)
  }
}
</script>

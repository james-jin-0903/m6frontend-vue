<template>
  <div>
    <v-card
      class="transparent"
      flat
    >
      <v-card-text class="pa-0 transparent">
        <v-form ref="form">
          <v-container class="pa-0 rounded-lg">
            <h1
              class="font-weight-bold mb-4 text-h6"
              :class="[!darkMode ? 'black--text' : 'white--text']"
            >
              Edit Your Company
            </h1>
            <v-divider class="grey my-2 w-full" />
            <v-tabs-items
              v-model="secondColumnComponent.tab"
              class="pt-3 transparent"
              :dark="darkMode"
              hide-on-leave="true"
            >
              <v-tab-item>
                <v-row>
                  <v-col class="col-md-4 col-xs-12 pt-0">
                    <v-text-field
                      v-model="company.result.legalName"
                      label="Legal Company Name"
                      :rules="rules.genericRules"
                    />
                  </v-col>
                  <v-col class="col-md-4 col-xs-12 pt-0">
                    <v-text-field
                      v-model="company.result.name"
                      label="Company Name"
                      :rules="rules.genericRules"
                    />
                  </v-col>
                  <v-col class="col-md-4 col-xs-12 pt-0">
                    <v-text-field
                      v-model="company.result.email"
                      label="Public Company Email"
                      :rules="rules.emailRules"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="col-md-4 col-xs-12 pt-0">
                    <vue-tel-input-vuetify
                      v-model="company.result.phone"
                      label="Public Company Phone"
                      :rules="rules.genericRules"
                    />
                  </v-col>
                  <v-col class="col-md-4 col-xs-12 pt-0">
                    <v-text-field
                      v-model="company.result.website"
                      label="Company Website"
                    />
                  </v-col>
                  <v-col class="col-md-4 col-xs-12 pt-0">
                    <v-autocomplete
                      v-model="company.result.OSHPD"
                      :items="OSHPDOlist"
                      label="Prefered OSHPD Class"
                    />
                  </v-col>
                </v-row>
                <!--                <v-row>-->
                <!--                  <v-col class="col-md-12 col-xs-12 pt-0">-->
                <!--                    <v-autocomplete-->
                <!--                      v-model="company.companyInsuranceStatus"-->
                <!--                      chips-->
                <!--                      item-text="label"-->
                <!--                      item-value="val"-->
                <!--                      :items="companyInsuranceStatus"-->
                <!--                      label="Company Insurance Status"-->
                <!--                      multiple-->
                <!--                    />-->
                <!--                  </v-col>-->
                <!--                </v-row>-->
              </v-tab-item>
              <v-tab-item>
                <v-row>
                  <v-col class="col-md-6 col-xs-12 pt-0">
                    <vuetify-money
                      v-model="project.from"
                      :background-color="darkMode ? 'black' : 'white'"
                      label="Project Size From"
                      :options="options"
                    />
                  </v-col>
                  <v-col class="col-md-6 col-xs-12 pt-0">
                    <vuetify-money
                      v-model="project.to"
                      :background-color="darkMode ? 'black' : 'white'"
                      label="Project Size To"
                      :options="options"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="col-md-6 col-xs-12 pt-0">
                    <vuetify-money
                      v-model="project.capFrom"
                      :background-color="darkMode ? 'black' : 'white'"
                      label="Project Capability From"
                      :options="options"
                    />
                  </v-col>
                  <v-col class="col-md-6 col-xs-12 pt-0">
                    <vuetify-money
                      v-model="project.capTo"
                      :background-color="darkMode ? 'black' : 'white'"
                      label="Project Capability To"
                      :options="options"
                    />
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <div class="d-flex justify-end">
                  <v-tooltip left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        color="primary darken-2"
                        dark
                        icon
                        v-on="on"
                        @click="socialMediaAdd"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Add A New Link</span>
                  </v-tooltip>
                </div>

                <social-media-c-u
                  :items="socialMediaLinks"
                  @change=" e => socialMediaLinks = e"
                />
              </v-tab-item>
              <v-tab-item>
                <company-address-table
                  :items="locations"
                  @deletingAddress="e => locations = e"
                />
              </v-tab-item>
              <v-tab-item>
                <company-codes v-if="secondColumnComponent.tab === 4" />
              </v-tab-item>
              <v-tab-item>
                <v-row>
                  <v-col class="col pa-0 pr-3 text-right">
                    <m6-upload
                      btn-button="purple"
                      @loading="loading = !loading"
                      @response="reponseProfileImg"
                    >
                      <v-icon>mdi-cloud-upload</v-icon>
                    </m6-upload>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="col pa-0 text-center">
                    <img
                      v-if="$h.dg(company, 'result.logo')"
                      alt="user profile image"
                      class="round-img"
                      :src="$h.dg(company, 'result.logo')"
                    >

                    <v-icon
                      v-else
                      size="5rem"
                    >
                      mdi-bank
                    </v-icon>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
            <v-divider class="grey my-2 w-full" />
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions
        v-if="secondColumnComponent.tab !== 4 "
        class="px-0"
      >
        <v-spacer />
        <v-btn
          class="blue capitalize darken-3 px-6 white--text"
          @click="updating"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>

    <m6-loading :loading="loading" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import SocialMediaCU from './CompanyShowSubComponents/SocialMediaCU'
import CompanyAddressTable from './CompanyShowSubComponents/CompanyAddressTable'
import CompanyCodes from '@/components/Settings/CompanyCodes'

export default {
  name: 'CompanyShow',
  components: {
    SocialMediaCU,
    CompanyAddressTable,
    CompanyCodes
  },
  data: () => ({
    defaultSocialMediaLink: { icon: '', socialMedia: '', url: '' },
    value: '',
    options: {
      locale: 'en-US',
      decimal: '.',
      thousands: ',',
      prefix: '$',
      suffix: '',
      length: 12,
      precision: 2
    },
    project: {},
    locations: [],
    socialMediaLinks: [],
    company: {
      result: {}
    },
    loading: false,
    OSHPDOlist: Array.from({ length: 20 }, (v, k) => k + 1),
    rules: {
      genericRules: [
        v => !!v || 'This field is required'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      websiteRules: [
        v => !!v || 'Website is required',
        // eslint-disable-next-line no-useless-escape
        v => /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(v) || 'Website must be valid'
      ]
    }
  }),
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany',
      companyInsuranceStatus: 'companyInsuranceStatus'
    }),
    ...mapState('UserSettingsControl', {
      secondColumnComponent: 'secondColumnComponent'
    }),
    ...mapState('PageControl', {
      darkMode: 'darkModeGlobal'
    })
  },
  watch: {
    secondColumnComponent: {
      handler: async function (newVal) {
        switch (newVal.tab) {
          case 1:
            if (Object.keys(this.project).length <= 0) {
              this.loading = true
              const info = await this.getProject(this.currentCompany.result.id)
              this.project = Object.assign(...[info ? info : {}])
              this.loading = false
            }
            break
          case 2:

            this.loading = true
            this.socialMediaLinks = await this.getSocial(this.currentCompany.result.id)
            this.loading = false

            break
          case 3:

            this.loading = true
            this.locations = await this.getLocations(this.currentCompany.result.id)
            this.loading = false

            break
        }
      },
      immediate: true
    }
  },
  async created() {
    this.company = { ...this.currentCompany }
  },
  methods: {
    ...mapActions('Companies', {
      updateCompany: 'updateCompany',
      getProject: 'getDataProject',
      updateProject: 'updateDataProject',
      getSocial: 'getDataSocial',
      updateSocial: 'updateDataSocial',
      updateLocation: 'updateDataLocation',
      getLocations: 'getDataLocations'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    validate() {
      return this.$refs.form.validate()
    },
    async reponseProfileImg(res) {
      if (res.ok) {
        this.company.result.logo = res.data.link

        try {
          this.loading = true
          await this.updateCompany(this.company.result)
          this.loading = false
          this.notifSuccess('Company Updated!')
        } catch (e) {
          this.loading = false
          this.notifDanger('There was an error while saving the file')
        }
      } else {
        this.notifDanger('There was an error while saving the file')
      }
    },
    async updating() {
      if (!this.validate()) {
        this.notifDanger('Please fill in all of the fields')
        return
      }

      try {
        this.loading = true
        switch (this.secondColumnComponent.tab) {
          case 0:
            await this.updateCompany(this.company.result)
            break
          case 1:
            await this.updateProject({
              companyId: this.currentCompany.result.id,
              data: this.project
            })
            break
          case 2:
            await this.updateSocial({
              companyId: this.currentCompany.result.id,
              data: this.socialMediaLinks
            })
            this.socialMediaLinks = await this.getSocial(this.currentCompany.result.id)
            break
          case 3:
            await this.updateLocation({
              companyId: this.currentCompany.result.id,
              data: this.locations
            })
            break
        }
        this.loading = false
        this.notifSuccess('The company was saved')
      } catch (e) {
        this.loading = false
        this.notifDanger('There was an error while saving the user')
      }
    },
    socialMediaAdd() {
      this.socialMediaLinks.push({
        ...this.defaultSocialMediaLink
      })
    }
  }
}
</script>

<style lang="scss">
.round-img {
  object-fit: cover;
  border-radius: 50%;
  width: 10rem;
  height: 10rem;
  margin-bottom: -0.5rem;
}
</style>

<template>
  <div class="text-center">
    <v-dialog
      v-model="show"
      persistent
      :width=" $vuetify.breakpoint.smAndDown ? '350px' : '450px' "
    >
      <v-card>
        <v-card-title>
          Edit User Information
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-container class="rounded-lg">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  sm="12"
                  class="d-flex justify-center align-center"
                >
                  <div class="d-flex justify-center">
                    <v-hover v-if="$h.dg(user, 'avatar')">
                      <template v-slot:default="{ hover }">
                        <v-avatar
                          height="140"
                          max-height="200"
                          max-width="200"
                          width="140"
                        >
                          <v-img
                            alt="user profile image"
                            :src="$h.dg(user, 'avatar')"
                          >
                            <v-fade-transition>
                              <v-overlay
                                v-if="hover"
                                absolute
                                class="custom-overlay-profile-image"
                                color="#036358"
                              >
                                <m6-upload
                                  btn-button="purple"
                                  @loading="loading = !loading"
                                  @response="reponseProfileImg"
                                >
                                  <v-icon>mdi-cloud-upload</v-icon>
                                </m6-upload>
                              </v-overlay>
                            </v-fade-transition>
                          </v-img>
                        </v-avatar>
                      </template>
                    </v-hover>

                    <m6-upload
                      v-else
                      btn-button="purple"
                      @loading="loading = !loading"
                      @response="reponseProfileImg"
                    >
                      <v-icon>mdi-cloud-upload</v-icon>
                    </m6-upload>
                  </div>
                </v-col>
                <v-col
                  class="col-md-6 col-xs-12"
                >
                  <v-row>
                    <v-text-field
                      v-model="user.firstName"
                      label="First Name"
                      :rules="formRules"
                    />
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="user.lastName"
                      label="Last Name"
                      :rules="formRules"
                    />
                  </v-row>
                  <v-row>
                    <v-select
                      v-model="user.department"
                      item-text="label"
                      item-value="value"
                      :items="departments"
                      label="Select Department"
                    />
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  class="col-md-6 col-xs-12"
                >
                  <v-select
                    v-model="user.role"
                    item-text="label"
                    item-value="value"
                    :items="roles"
                    label="Role"
                  />
                </v-col>
                <v-col
                  class="col-md-6 col-xs-12"
                >
                  <v-select
                    v-model="user.application"
                    item-text="label"
                    item-value="value"
                    :items="applications"
                    label="Application"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            text
            @click="$emit('close')"
          >
            close
          </v-btn>
          <v-btn
            class="white--text"
            color="green"
            @click="updateUser"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <m6-loading :loading="loading" />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
// eslint-disable-next-line vue/require-name-property
export default {
  name: 'UserProfileUpdate',
  props: {
    show: {
      default: false,
      type: Boolean
    },
    isCurrentUser: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    formRules: [v => !!v || 'Name is required'],
    loading: false,
    user: {},
    roles: [
      { label: 'Company Administrator', value: 'companyAdministrator' },
      { label: 'App Administrator', value: 'appAdministrator' },
      { label: 'Staff', value: 'staff' }
    ],
    applications: [],
    departments: []
  }),
  computed: {
    ...mapState('Auth', {
      currentUser: 'user'
    }),
    ...mapState('UserSettingsControl', {
      userSettingsToShow: 'userToShow'
    })
  },
  watch: {
    show: {
      handler: function () {
        if (this.isCurrentUser) {
          this.user = { ...this.currentUser }
        } else {
          this.user = { ...this.userSettingsToShow.user }
        }
      },
      immediate: true
    }
  },
  async mounted() {
    try {
      const apps = await this.getAppList()
      apps.map(row => {
        this.applications.push({
          label: row['title'],
          value: row['id']
        })
      })
      const departments = await this.initVocabulary()
      departments.map(row => {
        this.departments.push({
          label: row['title'],
          value: row['id']
        })
      })
    } catch (e) {
      this.notifDanger('There was an error while fetching values.')
    }
  },
  methods: {
    ...mapActions('AppBuilder', {
      getAppList: 'getAppList'
    }),
    ...mapActions('Taxonomy', {
      initVocabulary: 'setTaxonomyVocabularies'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    ...mapActions('Auth', {
      updateUserData: 'updateUserData'
    }),
    ...mapActions('GSFeed', {
      updUser: 'updateUser'
    }),
    async reponseProfileImg(res) {
      if (res.ok) {
        this.user.avatar = res.data.link
        try {
          this.loading = true
          await this.updateUserData(this.user)
          this.loading = false
          this.notifSuccess('Updated!')
        } catch (e) {
          this.notifDanger('There was an error while saving the file')
        }
      } else {
        this.notifDanger('There was an error while saving the file')
      }
    },
    validate() {
      return this.$refs.form.validate()
    },
    async updateUser() {
      if (!this.validate()) {
        this.notifDanger('Please fill in all of the fields')
        return
      }

      try {
        this.loading = true
        await this.updateUserData(this.user)
        await this.updUser({
          id: this.user.id,
          name: `${this.user.firstName} ${this.user.lastName}`,
          image: this.user.avatar
        })
        this.loading = false
        this.notifSuccess('The user was saved')
        this.$emit('close')
      } catch (e) {
        this.loading = false
        this.notifDanger('There was an error while saving the user')
      }
    }
  }
}
</script>

<style lang="scss">
@media (max-width:690px){
  .custom-overlay-profile-image {
    .v-overlay__content{
      top:0 !important;
    }
  }
}
</style>

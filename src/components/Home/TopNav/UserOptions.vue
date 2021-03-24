<template>
  <div class="align-center d-flex text-center">
    <v-menu
      v-if="currentUser && currentCompany"
      :close-on-content-click="false"
      :nudge-width="350"
      offset-x
      offset-y
      open-on-hover
    >
      <template v-slot:activator="{ on }">
        <img
          v-show="Boolean($h.dg(currentUser, 'avatar', '').length)"
          :alt="currentUser.firstName"
          class="ml-5 mr-3 rounded-circle"
          height="40"
          :src="$h.dg(currentUser, 'avatar', '')"
          width="40"
          v-on="on"
        >
        <v-icon
          v-show="!Boolean($h.dg(currentUser, 'avatar', '').length)"
          :alt="currentUser.firstName"
          x-large
          v-on="on"
        >
          mdi-account-circle
        </v-icon>
      </template>

      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img
              v-if="$h.dg(currentCompany, 'result.logo', false)"
              :alt="`${currentCompany.result.name} logo`"
              :src="currentCompany.result.logo"
            />
            <v-icon v-else>
              mdi-domain
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ $h.dg(currentUser, 'firstName', '') }} {{ $h.dg(currentUser, 'lastName', '') }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ $h.dg(currentCompany, 'result', '') && $h.dg(currentCompany, 'result.type', '') === 'personal' ? 'Personal Account' : $h.dg(currentCompany, 'result.name', '') }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
              color="green darken-2"
              icon
              @click="showUserData = true"
            >
              <v-icon>mdi-lead-pencil</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider />

        <v-list subheader>
          <v-subheader>My Companies</v-subheader>

          <v-list-item
            v-for="company in companiesAccount"
            :key="company.id"
            @click="changeCompanies(company)"
          >
            <v-list-item-avatar>
              <v-img
                v-if="$h.dg(company, 'Company.logo', false)"
                :alt="`${company.Company.name} logo`"
                :src="currentUser.currentCompany === company.Company.id ? $h.dg(currentCompany, 'result.logo', '') : company.Company.logo"
              />
              <v-icon v-else>
                mdi-domain
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="company.Company.name" />
              <template>
                <v-list-item-subtitle v-text="currentUser.currentCompany === company.Company.id ? 'Active' : ''" />
              </template>
            </v-list-item-content>

            <v-list-item-icon>
              <v-icon :color="currentUser.currentCompany === company.Company.id ? 'green accent-4' : 'grey'">
                mdi-checkbox-marked-circle
              </v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list subheader>
          <v-subheader>Personal Account</v-subheader>

          <v-list-item
            v-for="company in personalAccount"
            :key="company.id"
            @click="changeCompanies(company)"
          >
            <v-list-item-avatar>
              <v-img
                v-if="$h.dg(company, 'Company.logo', false) && $h.dg(currentCompany, 'result.logo', false)"
                :alt="`${company.Company.name} logo`"
                :src="currentUser.currentCompany === company.Company.id ? currentCompany.result.logo : company.Company.logo"
              />
              <v-icon v-else>
                mdi-domain
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="company.Company.name" />
              <template>
                <v-list-item-subtitle v-text="currentUser.currentCompany === company.Company.id ? 'Active' : ''" />
              </template>
            </v-list-item-content>

            <v-list-item-icon>
              <v-icon :color="currentUser.currentCompany === company.Company.id ? 'green accent-4' : 'grey'">
                mdi-checkbox-marked-circle
              </v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list subheader>
          <v-subheader class="pt-2">
            Appearance
            <div
              class="left-0 ml-auto top-60 z-20"
              style="margin-right: -5px;"
            >
              <div
                :class="{ 'theme-dark': !darkModeGlobal }"
              >
                <input
                  id="theme-toggle"
                  v-model="darkModeGlobal"
                  type="checkbox"
                  @click="updateDarkModeGlobal"
                >
                <label for="theme-toggle"><span /></label>
              </div>
            </div>
          </v-subheader>
        </v-list>
        <v-divider />
        <v-list-item class="pa-2">
          <v-list-item-content />
          <v-list-item-action>
            <v-btn
              color="red"
              dark
              @click="logout"
            >
              Log Out
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-menu>

    <user-companies-options
      v-if="showCompanies"
      :show="showCompanies"
      @OpenJoinCompanies="openJoinCompanies"
      @close="showCompanies = false"
    />

    <join-companies
      v-if="showJoinCompanies"
      :show="showJoinCompanies"
      @close="showJoinCompanies = false"
    />

    <user-profile-update
      is-current-user
      :show="showUserData"
      :v-show="showUserData"
      @close="showUserData = false"
    />
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'
import UserCompaniesOptions from '@/components/Home/TopNav/UserCompaniesOptions'
import JoinCompanies from '@/components/Home/TopNav/JoinCompanies'
import UserProfileUpdate from '@/components/user/settings/UserProfileUpdate'

// eslint-disable-next-line vue/require-name-property
export default {
  components: {
    UserCompaniesOptions,
    JoinCompanies,
    UserProfileUpdate
  },
  data: () => ({
    showCompanies: false,
    showJoinCompanies: false,
    showUserData: false
  }),
  computed: {
    ...mapState('PageControl', {
      darkModeGlobal: 'darkModeGlobal'
    }),
    ...mapGetters('Companies', {
      currentCompany: 'getCurrentCompany'
    }),
    ...mapGetters('Auth', {
      userCompanies: 'getCurrentUserCompanies',
      currentUser: 'getUser',
      userSwitchCompanies: 'getSwitchCompanies'
    }),
    companiesAccount() {
      if (this.userSwitchCompanies) {
        return this.userSwitchCompanies.filter(i => i.Company.type !== 'personal')
      }
      return []
    },
    personalAccount() {
      if (this.userSwitchCompanies) {
        return this.userSwitchCompanies.filter(i => i.Company.type === 'personal')
      }
      return []
    }
  },
  created() {
    if (localStorage.getItem('darkModeGlobal') === 'true') {
      this.$vuetify.theme.dark = true
      this.setDarkModeGlobal(true)
    } else {
      this.$vuetify.theme.dark = false
      this.setDarkModeGlobal(false)
    }
  },
  methods: {
    ...mapMutations('Auth', {
      logoutUser: 'logoutUser'
    }),
    ...mapActions('Companies', {
      switchCompanies: 'switchCompanies',
      getCompanies: 'getUserCompanies'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    ...mapActions('GSChat', ['removeClient']),
    openJoinCompanies() {
      this.showJoinCompanies = true

      this.$nextTick(() => {
        this.showCompanies = false
      })
    },
    async changeCompanies(nextCompany) {
      try {
        this.loading = true
        await this.switchCompanies({ nextCompany })
        this.$emit('close')
        this.notifSuccess('You have switched companies')
        this.$router.go()
      } catch (e) {
        this.notifDanger('There was an error while switching companies')
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.logoutUser()
      this.removeClient()
      this.$router.push({ name: 'auth.SignIn' })
    },
    ...mapMutations('PageControl', {
      setDarkModeGlobal: 'setDarkModeGlobal'
    }),
    updateDarkModeGlobal() {
      localStorage.setItem('darkModeGlobal', JSON.stringify(!this.darkModeGlobal))
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      this.setDarkModeGlobal(!this.darkModeGlobal)
    }
  }
}
</script>

<style lang="scss">

:root {
	--toggle-size: 1rem;
    --switch-w: 4em;
    --switch-h: 2em;
	--switch-handle-scale: .6;
    --switch-off-handle-x: -.125em;
    --switch-on-handle-x: calc(100% - .125em);
	--switch-transition-duration: .3s;
}

#theme-toggle {
	display: none;

	& + label {
		font-size: var(--toggle-size);
		display: flex;
		height: var(--switch-h);
		width: var(--switch-w);
		border-radius: calc(var(--switch-h) / 2);
		background-size: auto 8em;
    	background-position: bottom;
		background-image: linear-gradient(180deg, #021037 0%, #20206A 19%, #4184B1 66%, #62E7F7 100%);
        transition: var(--switch-transition-duration);
		border: .125em solid hsl(207, 30%, 95%);
		overflow: hidden;

		span {
			background: #fffad8;
			border-radius: 50%;
			height: var(--switch-h);
			width: var(--switch-h);
			transform: translateX(var(--switch-off-handle-x)) scale(var(--switch-handle-scale));
			transition: var(--switch-transition-duration);
            cursor: pointer;
            box-shadow: 0 0 .25em .0625em #fbee8d, 0 0 2em 0 #FFEB3B, inset -.25em -.25em 0 0 #fbee8e, inset -.3125em -.3125em 0 .625em #fff5b2;
            margin-top: var(--switch-off-handle-x);
		}
	}

	&:checked {
		font-size: var(--switch-font-size);

		& + label {
			background-position: top;
            border-color: hsl(207, 30%, 50%);

			span {
				background: transparent;
                transform: translateX(var(--switch-on-handle-x)) scale(var(--switch-handle-scale));
                box-shadow: inset -.1875em -.1875em 0 0 #fbe7ef, inset -.5625em -.5625em 0 0 #fffff7;
			}
		}
	}
}

</style>

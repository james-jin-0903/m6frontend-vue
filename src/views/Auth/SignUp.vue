<template>
  <auth-layout>
    <template #nav-btn>
      <router-link
        class="float-right text-dec-none"
        :to="{ name: 'auth.SignIn' }"
      >
        <v-btn
          class="custom-blue-text"
          text
        >
          Sign In
        </v-btn>
      </router-link>
      <v-btn
        v-if="toConfirm === confirmEmail"
        class="custom-blue-text"
        text
        @click="change"
      >
        {{ !toConfirm ? 'Confirm' : $t('SignUp.signup') }}
      </v-btn>
    </template>
    <template #header>
      <div
        v-if="checkChildrensOmaha"
        class="d-md-none logo-image text-center"
      >
        <img
          alt="Company Logo"
          src="@/assets/Childrens_Hospital.jpeg"
          width="180"
        >
      </div>
      <v-col class="d-flex justify-center">
        <h1 class="custom-blue-text text-xs-6">
          {{ $t('SignUp.signup') }}
        </h1>
      </v-col>
      <v-col class="d-flex justify-center">
        <span class="custom-blue-text">
          {{ $t('SignUp.subtitle') }}
        </span>
      </v-col>
    </template>
    <template #body>
      <v-form ref="form">
        <v-container
          class="rounded-lg"
          :class=" $vuetify.breakpoint.sm ? null : 'pa-0'"
        >
          <div v-if="confirmEmail">
            <v-text-field
              v-if="toConfirm"
              v-model="user.email"
              class="mx-4"
              dark
              :label="$t('SignUp.email')"
            />
            <v-text-field
              v-model="codeConfirm"
              class="mx-4"
              dark
              :label="$t('SignUp.getConfirmationCode')"
            />
            <div class="d-flex justify-center">
              <v-btn
                :color="customBlue"
                @click="confirmSignUp"
              >
                <span class="black--text">Confirm</span>
              </v-btn>
            </div>
          </div>
          <v-row
            v-else
            justify="center"
          >
            <v-col
              class="pb-0 xs"
              cols="12"
              md="5"
            >
              <v-text-field
                v-model="user.firstName"
                dark
                :label="$t('SignUp.firstName')"
                :rules="[rules.required]"
              />
            </v-col>

            <v-col
              class="pb-0 xs"
              cols="12"
              md="5"
            >
              <v-text-field
                v-model="user.lastName"
                dark
                :label="$t('SignUp.lastName')"
                :rules="[rules.required]"
              />
            </v-col>

            <v-col
              class="pt-0 xs"
              cols="12"
              md="10"
            >
              <v-text-field
                v-model="user.email"
                dark
                :label="$t('SignUp.email')"
                :rules="rules.email"
              />


              <v-combobox
                v-if="showCompanyComboBox"
                v-model="user.company"
                dark
                item-text="name"
                item-value="id"
                :items="companiesList"
                :label="$t('SignUp.companyName')"
                return-object
                :rules="[rules.required]"
              />

              <v-text-field
                v-model="user.password"
                :append-icon="showPass ? 'mdi-eye-outline' : 'mdi-eye-off'"
                autocomplete="new-password"
                counter
                dark
                :hint="$t('SignIn.minCharacters', { num: '8' })"
                :label="$tc('SignIn.password', 1)"
                :rules="[rules.required, rules.min]"
                :type="showPass ? 'text' : 'password'"
                @click:append="onPasswordClick"
              />

              <v-text-field
                v-model="user.passwordConfirm"
                :append-icon="showPass ? 'mdi-eye-outline' : 'mdi-eye-off'"
                autocomplete="new-password"
                counter
                dark
                :hint="$t('SignIn.minCharacters', { num: '8' })"
                :label="$tc('SignUp.passwordConfirm', 1)"
                :rules="[rules.required, rules.min]"
                :type="showPass ? 'text' : 'password'"
                @click:append="onPasswordClick"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>

      <m6-loading :loading="loading" />
    </template>

    <template #action-btn>
      <div
        v-if="!confirmEmail"
        class="flex-center"
      >
        <v-btn
          block
          :color="customBlue"
          @click="signUp"
        >
          <span class="black--text">{{ $t('SignUp.signup') }}</span>
        </v-btn>
      </div>
    </template>
  </auth-layout>
</template>

<script>
import AuthLayout from '@/components/Auth/AuthLayout'
import { mapActions, mapState, mapMutations } from 'vuex'

// eslint-disable-next-line vue/require-name-property
export default {
  components: {
    AuthLayout
  },

  data: () => ({
    codeConfirm: '',
    loading: false,
    customBlue: '#a4ceea',
    confirmEmail: false,
    toConfirm: false,
    confirmationCode: '',
    user: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: ''
    },
    reg: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
    showPass: false,
    rules: {
      required: value => !!value || 'Required.',
      counter: value => value.length <= 20 || 'Max 20 characters',
      min: v => v.length >= 8 || 'Min 8 characters',
      email: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ]
    },
    showCompanyComboBox: false
  }),
  computed: {
    ...mapState('Companies', {
      companiesList: 'list'
    }),
    checkChildrensOmaha() {
      return window.location.host === 'childrensomaha.m6connect.com'
    }
  },

  watch: {
    companiesList(val) {
      const selectedCompany = val.find(v => v.id === process.env.VUE_APP_CURRENT_COMPANY_ID)

      if (selectedCompany) {
        this.user.company = { ...selectedCompany }
      } else {
        this.showCompanyComboBox = true
      }
    }
  },
  mounted() {
    this.getDataFromQuery()
    this.listCompanies()
  },
  methods: {
    ...mapActions('Companies', {
      listCompanies: 'getList'
    }),
    ...mapActions('Auth', {
      signUpUser: 'signUp',
      userConfirmCode: 'confirmCode',
      resetConfirmCode: 'resetConfirmCode'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    change() {
      this.toConfirm = !this.toConfirm
      this.confirmEmail = !this.confirmEmail
    },
    onPasswordClick() {
      this.showPass = !this.showPass
    },
    validate() {
      if (!this.$refs.form.validate()) {
        this.notifDanger(this.$t('general.fillAllFields'))
        return false
      }

      if (this.user.password !== this.user.passwordConfirm) {
        this.notifDanger(this.$t('SignUp.error.passwordsDontMath'))
        return false
      }

      if (!this.reg.test(this.user.password)) {
        this.notifDanger(this.$t('SignUp.error.RegexCheck'))
        return false
      }

      return true
    },
    async signUp() {
      if (!this.validate()) {
        return
      }

      try {
        this.loading = true
        this.user['createCompany'] = typeof this.user.company === 'string'
        await this.signUpUser(this.user)
        this.notifSuccess(this.$t('SignUp.success.created'))
        this.confirmEmail = true
        this.loading = false
      } catch (e) {
        let errorMsg = this.$t('SignUp.error.signUpErr')
        if (e.code === 'UsernameExistsException') errorMsg = e.message

        this.notifDanger(errorMsg)
        this.loading = false

        if (e.code === 'UsernameExistsException') {
          this.$router.push({
            name: 'auth.signedin'
          })
        }
      }
    },
    async confirmSignUp() {
      try {
        this.loading = true

        await this.userConfirmCode({
          code: this.codeConfirm,
          email: this.user.email
        })

        this.notifSuccess(this.$t('SignUp.signUpConfirmed'))
        this.loading = false
        this.$router.push({
          name: 'auth.SignIn',
          query: { email: this.user.email }
        })
      } catch (error) {
        this.notifDanger(this.$t('SignUp.error.codeConfirmError'))
        this.loading = false
      }
    },
    async getDataFromQuery() {
      const email = this.$h.dg(this.$route, 'query.email', '')

      if (email.length) {
        this.confirmEmail = true

        try {
          this.loading = true
          this.user.email = email
          await this.resetConfirmCode(email)
          this.loading = false

          this.notifSuccess(this.$t('SignUp.success.ConfirmCodeResent'))
        } catch (err) {
          this.notifDanger(this.$t('SignUp.error.ConfirmCodeResentError'))
          this.loading = false
        }
      }
    }

  }

}
</script>

<style lang="scss" scoped >
.bottom-logo {
    width: 25%;
    height: auto;
}
.custom-blue-text {
  color: #a4ceea !important;
}
input[type=password] {
  letter-spacing: 0.30em;
}
.text-dec-none {
  text-decoration: none;
}
.float-right {
    float: right;
}

.flex-center {
  display: flex;
  display: -webkit-flex;
  display: -ms-flexbox;
  justify-content: center;
  .v-btn--block {
    display: block;
    flex: 0;
    min-width: 70% !important;
  }
}
</style>

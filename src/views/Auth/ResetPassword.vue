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
    </template>
    <template #header>
      <div class="d-flex justify-center">
        <h2 class="custom-blue-text text-xs-6">
          {{ $t('ResetPassword.title') }}
        </h2>
      </div>
      <div class="d-flex justify-center">
        <span class="custom-blue-text">
          {{ $t('ResetPassword.subtitle') }}
        </span>
      </div>
    </template>
    <template #body>
      <v-form ref="form">
        <v-container class="rounded-lg">
          <v-row justify="center">
            <v-col
              class="pt-0 xs"
              cols="12"
              md="10"
            >
              <v-text-field
                v-model="user.email"
                dark
                :label="$t('ResetPassword.email')"
                :rules="rules.email"
              />

              <v-text-field
                v-model="user.codeConfirm"
                dark
                :label="$t('ResetPassword.confirmCodeHere')"
                :rules="[rules.required]"
              />

              <v-text-field
                v-model="user.password"
                :append-icon="showPass ? 'mdi-eye-outline' : 'mdi-eye-off'"
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
      <div class="flex-center">
        <v-btn
          block
          :color="customBlue"
          @click="reset"
        >
          <span class="black--text">{{ $t('ResetPassword.confirmBtn') }}</span>
        </v-btn>
      </div>
    </template>
  </auth-layout>
</template>

<script>

import AuthLayout from '@/components/Auth/AuthLayout'
import { mapActions, mapMutations } from 'vuex'

// eslint-disable-next-line vue/require-name-property
export default {
  components: {
    AuthLayout
  },
  data: () => ({
    loading: false,
    customBlue: '#a4ceea',
    confirmCode: true,
    user: {
      codeConfirm: '',
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
    }
  }),
  mounted() {
    this.getQueryParams()
  },
  methods: {
    ...mapActions('Auth', {
      confirmPasswordReset: 'confirmPasswordReset'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    onPasswordClick() {
      this.showPass = !this.showPass
    },
    validate() {
      if (!this.$refs.form.validate()) {
        this.notifDanger(this.$t('general.fillAllFields'))
        return false
      }

      if (this.password !== this.passwordConfirm) {
        this.notifDanger(this.$t('SignUp.error.passwordsDontMath'))
        return false
      }

      if (!this.reg.test(this.password)) {
        this.notifDanger(this.$t('SignUp.error.RegexCheck'))
        return false
      }

      return true
    },
    async reset() {
      try {
        this.loading = true
        const { email, codeConfirm: code, password } = this.user
        await this.confirmPasswordReset({
          username: email,
          passwordResetCode: code,
          newPassword: password
        })

        this.notifSuccess(this.$t('ResetPassword.success.passChanged'))
        this.loading = false
        this.$router.push({
          name: 'auth.SignIn',
          query: { email: this.user.email }
        })
      } catch (err) {
        this.loading = false
        this.notifDanger(this.$t('ResetPassword.error.passError'))
      }
    },
    getQueryParams() {
      this.user.email = this.$h.dg(this.$route, 'query.email', '')
      if (!this.user.email.length) {
        this.$router.push({ name: 'auth.ForgotPassword' })
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
  color: #a4ceea;
}
input[type=password] {
  letter-spacing: 0.30em;
}
</style>

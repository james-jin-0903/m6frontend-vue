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
        <h1 class="custom-blue-text text-xs-6">
          {{ $t('ForgotPassword.title') }}
        </h1>
      </div>
      <div class="d-flex justify-center">
        <span class="custom-blue-text">
          {{ $t('ForgotPassword.subtitle') }}
        </span>
      </div>
    </template>
    <template #body>
      <div>
        <v-container class="rounded-lg">
          <v-row justify="center">
            <v-col
              class="pt-0 xs"
              cols="12"
              md="8"
            >
              <v-text-field
                v-model="email"
                dark
                :label="$t('ForgotPassword.email')"
                :rules="rules.email"
              />
            </v-col>
          </v-row>
        </v-container>
      </div>

      <m6-loading :loading="loading" />
    </template>

    <template #action-btn>
      <div class="flex-center">
        <v-btn
          block
          color="#a4ceea"
          @click="forgotPass"
        >
          <span class="black--text">{{ $t('ForgotPassword.button') }}</span>
        </v-btn>
      </div>
    </template>
  </auth-layout>
</template>

<script>
import AuthLayout from '@/components/Auth/AuthLayout'
import { mapActions, mapMutations } from 'vuex'

export default {
  components: {
    AuthLayout
  },
  data: () => ({
    loading: false,
    email: '',
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
  methods: {
    ...mapActions('Auth', {
      startPasswordReset: 'startPasswordReset'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    onPasswordClick() {
      this.showPass = !this.showPass
    },
    forgotPass() {
      this.loading = true

      this.startPasswordReset(this.email)
        .then(() => {
          this.loading = false

          this.notifSuccess(this.$t('ForgotPassword.success.checkEmail'))
          this.$router.push({
            name: 'auth.ResetPassword',
            query: { email: this.email }
          })
        })
        .catch(() => {
          this.notifDanger(this.$t('ForgotPassword.error.resetPass'))
          this.loading = false
        })
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

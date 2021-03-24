<template>
  <div class="text-center">
    <v-dialog
      v-model="show"
      persistent
      width="60vw"
    >
      <v-card>
        <v-card-title class="blue darken-2 headline white--text">
          Want to join a new company?
          <v-spacer />
          <v-btn
            color="white"
            icon
            @click="$emit('close')"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-autocomplete
              v-model="newCompanyToJoin"
              item-text="name"
              item-value="id"
              :items="filteredCompanies"
              :label="$t('SignUp.companyName')"
              required
              return-object
              :rules="[rules.required]"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            class="white--text"
            color="green darken-2"
            @click="joinCompany"
          >
            Join!
          </v-btn>
        </v-card-actions>
      </v-card>
      <m6-loading :loading="loading" />
    </v-dialog>
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
  mapGetters,
  mapMutations
} from 'vuex'
// eslint-disable-next-line vue/require-name-property
export default {
  props: {
    show: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    loading: false,
    newCompanyToJoin: {},
    rules: {
      required: value => !!value || 'Required'
    }
  }),
  computed: {
    ...mapState('Companies', {
      companiesList: 'list'
    }),
    ...mapGetters('Auth', {
      userCompanies: 'getCurrentUserCompanies'
    }),
    filteredCompanies() {
      const usersJoinedCompanies = this.userCompanies.map(c => c.id)
      return this.companiesList.filter(c => !usersJoinedCompanies.includes(c.id))
    }
  },
  async mounted() {
    if (!this.companiesList.length) {
      try {
        this.loading = true
        await this.listCompanies()
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    }
  },
  methods: {
    ...mapActions('Companies', {
      listCompanies: 'getList',
      createUserCompany: 'createUserCompany'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    validate() {
      this.$refs.form.validate()
    },
    async joinCompany() {
      if (!this.newCompanyToJoin.id) {
        this.notifDanger('Please pick a company')
        return
      }

      try {
        this.loading = true
        await this.createUserCompany({
          companyID: this.newCompanyToJoin.id
        })
        this.notifSuccess('Your request has been sent')
        this.loading = false
        this.$emit('close')
      } catch (e) {
        this.notifDanger('There was an error while sending the request')
        this.loading = false
      }
    }
  }
}
</script>

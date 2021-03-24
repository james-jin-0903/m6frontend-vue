<template>
  <div class="text-center">
    <v-dialog
      v-model="show"
      persistent
      width="50vw"
    >
      <v-card>
        <v-card-title class="blue darken-2 headline white--text">
          My Company Accounts
          <v-spacer />
          <v-btn
            color="white"
            icon
            @click="$emit('OpenJoinCompanies')"
          >
            <v-icon>mdi-bank-plus</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-list three-line>
            <template v-for="(item, index) in companies">
              <v-divider
                v-if="index !== 0"
                :key="index"
              />

              <v-list-item
                :key="`item-${index}`"
              >
                <v-list-item-avatar>
                  <img
                    v-if="$h.dg(item, 'Company.logo', '')"
                    :alt="item.Company.name"
                    class="mr-1 rounded-circle"
                    :src="$h.dg(item, 'Company.logo', '')"
                  >
                  <v-icon
                    v-else
                    x-large
                  >
                    mdi-bank
                  </v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.Company.name }}
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-icon
                    v-if=" $h.dg(item, 'Company.id') === usr.currentCompany && item.Company.status === 'active' "
                    color="green darken-2"
                  >
                    mdi-check-circle
                  </v-icon>

                  <v-btn
                    v-else-if="$h.dg(item, 'Company.id') !== usr.currentCompany && item.Company.status === 'active'"
                    color="blue darken-2"
                    icon
                    @click="changeCompanies(item)"
                  >
                    <v-icon>mdi-hand-pointing-left</v-icon>
                  </v-btn>

                  <v-chip
                    v-else
                    :color="statusColors[item.Company.status]"
                  >
                    <span class="white--text">{{ item.Company.status }}</span>
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            class="white--text"
            color="red "
            @click="$emit('close')"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>

      <m6-loading :loading="loading" />
    </v-dialog>
  </div>
</template>

<script>
import {
  mapGetters,
  mapState,
  mapActions,
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
    companies: []
  }),
  computed: {
    ...mapGetters('Auth', {
      userCompanies: 'getCurrentUserCompanies',
      usr: 'getUser'
    }),
    ...mapState('Auth', {
      statusColors: 'statusColors'
    })
  },
  mounted() {
    this.getCompanies(this.usr.id).then(res => {
      this.companies = res
    })
  },
  methods: {
    ...mapActions('Companies', {
      switchCompanies: 'switchCompanies',
      getCompanies: 'getUserCompanies'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    async changeCompanies(nextCompany) {
      const currentCompany = this.userCompanies.find(u => u.active && u.joinStatus === 'ACTIVE')
      try {
        this.loading = true
        await this.switchCompanies({ currentCompany, nextCompany })
        this.$emit('close')
        this.notifSuccess('You have switched companies')
        this.loading = false
      } catch (e) {
        this.notifDanger('There was an error while switching companies')
        this.loading = false
      }
    }
  }
}
</script>

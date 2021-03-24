<template>
  <v-card
    class="transparent"
    flat
  >
    <v-card-title class="d-flex flex-column pa-0">
      <h1
        class="font-weight-bold mb-2 text-h6 text-left w-full"
        :class="[!darkMode ? 'black--text' : 'white--text']"
      >
        User Management
      </h1>
      <v-divider class="grey my-2 w-full" />
    </v-card-title>
    <v-card-text class="pa-0">
      <!-- USER ROLES -->
      <v-data-table
        :dark="darkMode"
        :headers="headersRoles"
        :items="users"
        :items-per-page="10"
      >
        <template
          v-slot:item="{ item }"
        >
          <tr>
            <td class="text-left">
              <v-avatar
                height="40"
                width="40"
              >
                <img
                  v-if="$h.dg(item, 'avatar', '')"
                  :src="$h.dg(item, 'avatar', '')"
                >
                <v-icon
                  v-else
                  x-large
                >
                  mdi-account-circle
                </v-icon>
              </v-avatar>
              {{ item.firstName }} {{ item.lastName }}
            </td>
            <td class="text-left">
              {{ item.id }}
            </td>
            <td>
              <template v-for="role in item.Roles">
                <v-chip
                  :key="role.id"
                  class="ma-2"
                  small
                >
                  {{ role.name }}
                </v-chip>
              </template>
            </td>
            <td class="text-center">
              <v-btn
                color="blue"
                dark
                icon
                small
                @click="editUser(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
            <td class="text-left">
              <v-chip
                v-if="$h.dg(item, 'status', '')"
                :color=" statusColors[$h.dg(item, 'status', '')] "
              >
                <template v-if="$h.dg(item, 'status', '').toLowerCase() === 'accept' || $h.dg(item, 'status', '').toLowerCase() === 'active'">
                  <b class="capitalize white--text">Approved</b>
                </template>
                <b
                  v-else
                  class="capitalize white--text"
                >{{ $h.dg(item, 'status', '').toLowerCase() }}</b>
              </v-chip>
            </td>
            <td class="text-left">
              {{ item.email }}
            </td>
            <td class="text-left">
              <v-select
                v-model="item.status"
                item-text="label"
                item-value="val"
                :items="selectItems"
                label="User Status"
                single-line
                @input="selectInput(item)"
              />
            </td>
          </tr>
        </template>
      </v-data-table>
      <default-m6-modal
        v-if="showEditUserRoles"
        @close="close"
      >
        <template slot="title">
          Edit {{ userToEdit.firstName }} {{ userToEdit.lastName }} Roles
        </template>
        <template slot="content">
          <v-text-field
            v-model="search"
            label="Search"
          />
          <p>Please select the roles for the user</p>

          <v-tabs v-model="tab">
            <v-tab>
              Global Roles
            </v-tab>
            <v-tab>
              Instance Roles
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <template v-for="role in filteredRoles">
                <v-checkbox
                  :key="role.id"
                  v-model="currentRoles"
                  hide-details
                  :label="role.name"
                  :value="role.id"
                />
              </template>
            </v-tab-item>
            <v-tab-item>
              <template v-for="role in filteredInstanceRoles">
                <v-checkbox
                  :key="role.id"
                  v-model="currentInstanceRoles"
                  hide-details
                  :label="role.name"
                  :value="role.id"
                />
              </template>
            </v-tab-item>
          </v-tabs-items>
        </template>

        <template slot="actions">
          <v-spacer />
          <v-btn
            color="red"
            outlined
            text
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            color="green"
            outlined
            text
            @click="save"
          >
            Save
          </v-btn>
        </template>
      </default-m6-modal>

      <m6-loading
        :loading="loading"
      />
    </v-card-text>
    <v-divider class="grey my-2 w-full" />
    <m6-loading :loading="loading" />
  </v-card>
</template>

<script>
import {
  mapMutations,
  mapGetters,
  mapState,
  mapActions
} from 'vuex'
import DefaultM6Modal from '@/components/user/settings/modals/DefaultM6Modal'

export default {
  name: 'UserMangementTable',
  components: {
    DefaultM6Modal
  },
  data: () => ({
    loading: false,
    usersToJoin: [],
    showPendingOnly: false,
    tab: 0,
    showEditUserRoles: false,
    userToEdit: {},
    currentRoles: [],
    currentInstanceRoles: [],
    loading: false,
    search: '',
    headersRoles: [
      {
        text: 'Avatar',
        value: 'firstName',
        align: 'left',
        sortable: false
      },
      {
        text: 'ID',
        align: 'left',
        sortable: false
      },
      {
        text: 'Roles',
        align: 'left',
        sortable: false
      },
      {
        text: 'Role Actions',
        align: 'center',
        sortable: false
      },
      {
        text: 'Status',
        align: 'left',
        sortable: false
      },
      {
        text: 'Email',
        align: 'left',
        sortable: false
      },
      {
        text: 'Actions',
        align: 'center',
        sortable: false
      }
    ]
  }),
  computed: {
    ...mapGetters('Companies', {
      users: 'getCurrentCompanyUsers'
    }),
    ...mapState('Auth', {
      statusColors: 'statusColors'
    }),
    ...mapState('UserSettingsControl', {
      secondColumnComponent: 'secondColumnComponent'
    }),
    ...mapState('PageControl', {
      darkMode: 'darkModeGlobal'
    }),
    selectItems() {
      return Object.keys(this.statusColors).map(s => ({
        val: s,
        label: s.toLowerCase()
      }))
    },
    usersFiltered() {
      return this.showPendingOnly ?
        this.usersToJoin :
        this.users
    },
    // user roles
    ...mapGetters('Roles', {
      roles: 'getRoles'
    }),
    ...mapGetters('AppRoles', {
      instanceRoles: 'getRoles'
    }),
    ...mapGetters('Companies', {
      users: 'getCurrentCompanyUsers',
      currentCompany: 'getCurrentCompany'
    }),
    ...mapState('PageControl', {
      darkMode: 'darkModeGlobal'
    }),
    filteredRoles() {
      return this.search ? this.roles.filter(i => i.name.toLowerCase().search(this.search.toLowerCase()) !== -1) : this.roles
    },
    filteredInstanceRoles() {
      return this.search ? this.instanceRoles.filter(i => i.name.toLowerCase().search(this.search.toLowerCase()) !== -1) : this.instanceRoles
    }
  },
  async created() {
    await this.$store.dispatch('Roles/fetchRoles')
    await this.$store.dispatch('AppRoles/fetchRoles')
  },
  async mounted() {
    this.usersToJoin = await this.requestUsers()
    this.usersFiltered.forEach(user => {
      user.status = user.status === 'active' ? 'accept' : user.status
    })
  },
  methods: {
    ...mapMutations('UserSettingsControl', {
      setUserToShow: 'setUserToShow',
      setThirdColumnComponent: 'setThirdColumnComponent'
    }),
    ...mapActions('Companies', {
      updateUserCompany: 'updateUserCompany',
      requestUsers: 'getRequestUsers'
    }),
    clickedUser(user) {
      this.setUserToShow(user.User ? user.User : user)
      this.setThirdColumnComponent({ name: 'user-settings-details' })
    },
    async selectInput(item) {
      try {
        this.loading = true
        await this.updateUserCompany(item)
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    sortUsers(items, index, isDescending) {
      index = JSON.parse(JSON.stringify(index))
      isDescending = JSON.parse(JSON.stringify(isDescending))

      if (index.length === 0 || isDescending.length === 0) {
        return items
      }

      index = index[0]
      isDescending = isDescending[0]

      items.sort((a, b) => {
        if (index === 'status') {
          if (isDescending) {
            return a.joinStatus < b.joinStatus ? 1 : -1
          } else {
            return a.joinStatus > b.joinStatus ? 1 : -1
          }
        } else if (index === 'fullName') {
          if (isDescending) {
            return a.user.firstName + a.user.lastName < b.user.firstName + b.user.lastName ? 1 : -1
          } else {
            return a.user.firstName + a.user.lastName > b.user.firstName + b.user.lastName ? 1 : -1
          }
        } else if (index === 'email') {
          if (isDescending) {
            return a.user.email < b.user.email ? 1 : -1
          } else {
            return a.user.email > b.user.email ? 1 : -1
          }
        }
      })
      return items
    },
    async save() {
      try {
        this.loading = true
        const msg = await this.$store.dispatch('Roles/saveRoles', {
          userId: this.userToEdit.id,
          roles: this.currentRoles,
          companyId: this.currentCompany.result.id
        })

        await this.$store.dispatch('AppRoles/saveInstanceRoles', {
          userId: this.userToEdit.id,
          roles: this.currentInstanceRoles
        })

        await this.$store.dispatch('Companies/getCompanyByID', this.currentCompany.result.id)
        this.$snotify.success(msg, 'Success')
        this.close()
      } catch (e) {
        this.$snotify.error('Something went wrong', 'Error R-1')
      } finally {
        this.loading = false
      }
    },
    editUser(user) {
      this.showEditUserRoles = true
      this.userToEdit = user
      this.setRoles()
    },
    async setRoles() {
      this.currentRoles = this.$h.dg(this.userToEdit, 'Roles', []).map(item => item.id)

      // TODO check this
      const instanceRoles = await this.getInstanceRoles(this.userToEdit.id)
      this.currentInstanceRoles = instanceRoles.map(item => item.role_id)
    },
    close() {
      this.showEditUserRoles = false
      this.userToEdit = {}
      this.currentRoles = []
      this.currentInstanceRoles = []
    },
    async getInstanceRoles(id) {
      const roles = await this.$store.dispatch('Roles/fetchInstanceRoles', {
        userId: id
      })

      return roles || []
    }
  }
}
</script>

<style lang="scss">
    .round-img {
        border-radius: 50%;
        width: 3rem;
    }
    .horizontal-center {
        display: flex;
        display: -webkit-flex;
        display: -ms-flexbox;
        flex-direction: row;
        align-items: center;
    }
    .v-data-table th {
        padding: 14px;
        span {
          white-space: nowrap;
        }
    }
</style>

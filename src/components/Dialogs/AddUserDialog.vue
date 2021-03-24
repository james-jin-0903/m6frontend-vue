<template>
  <v-card
    class="rounded-false"
    elevation="0"
    :flat="flatCard"
  >
    <v-card-subtitle
      v-if="showCardHeader"
      class="accent-4 blue pa-5 rounded-false"
    >
      <h2 class="accent-4 blue text-heading-6 white--text">
        Invite Colleagues, Customers and Vendors
      </h2>
    </v-card-subtitle>
    <v-card-text
      v-if="showUserAutoSelectField || typeof currentUsers === 'string'"
      class="pt-5"
    >
      <template v-if="showUserAutoSelectField">
        <div
          v-if="element === 'company'"
          class="messages-container white"
          :class="biggerHeightMessagesContainer ? 'long-height' : ''"
        >
          <v-autocomplete
            v-model="selectedUsers"
            chips
            class="mt-4"
            color="lighten-2"
            filled
            item-text="firstName"
            :items="companies"
            label="Select"
            multiple
            return-object
          >
            <template v-slot:selection="data">
              <v-chip
                close
                @click:close="removeSelectedUser(data.item)"
              >
                <v-avatar left>
                  <v-img
                    v-if="data.item.avatar"
                    :src="data.item.avatar"
                  />
                  <v-icon v-else>
                    mdi-account
                  </v-icon>
                </v-avatar>
                {{ data.item.firstName }} {{ data.item.lastName }}
              </v-chip>
            </template>
            <template v-slot:item="data">
              <template v-if="typeof data.item !== 'object'">
                <v-list-item-content v-text="data.item" />
              </template>
              <template v-else>
                <v-list-item-avatar>
                  <v-img
                    v-if="data.item.avatar"
                    :src="data.item.avatar"
                  />
                  <v-icon v-else>
                    mdi-account
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    v-html="
                      data.item.firstName + ' ' + data.item.lastName
                    "
                  />
                  <v-list-item-subtitle v-html="data.item.email" />
                </v-list-item-content>
              </template>
            </template>
          </v-autocomplete>
          <h2
            v-if="companies.length === 0"
            class="font-weight-black mt-2 text-center"
          >
            No users found
          </h2>
        </div>
        <div v-else>
          <h2
            class="font-weight-black text-center"
          >
            No users found
          </h2>
        </div>
      </template>
    </v-card-text>
    <v-card-actions
      v-if="showActionButtons"
      class="d-flex justify-center"
    >
      <v-btn
        class="mt-2"
        color="#424242"
        height="34"
        outlined
        width="93.84"
        @click="res(false)"
      >
        Cancel
      </v-btn>
      <v-btn
        class="mt-2"
        color="#1976d2"
        height="34"
        outlined
        width="93.84"
        @click="res(true)"
      >
        {{ typeof currentUsers === 'string' ? 'Create' : 'Save' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'AddUserDialog',
  props: {
    currentUsers: {
      type: [String, Object],
      default: () => {}
    },
    showCardHeader: {
      type: Boolean,
      default: true
    },
    biggerHeightMessagesContainer: {
      type: Boolean,
      default: true
    },
    flatCard: {
      type: Boolean,
      default: false
    },
    showUserAutoSelectField: {
      type: Boolean,
      default: true
    },
    showActionButtons: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    hoverUser: false,
    roomName: '',
    companies: [],
    resList: [],
    selectedUsers: [],
    element: 'company',
    cUser: []
  }),
  computed: {
    ...mapGetters('Companies', { companyUsers: 'getCurrentCompanyUsers' }),
    ...mapGetters('Auth', { currentUser: 'getUser' })
  },
  mounted() {
    if (typeof this.currentUsers === 'string') {
      this.cUser = this.companyUsers.filter(
        e => e.id === this.currentUsers
      )[0]
      if (this.cUser) {
        this.resList.push(this.cUser)
      }
    } else {
      this.companyUsers.forEach(item => {
        if (
          Object.keys(this.currentUsers).filter(e => parseInt(e) === parseInt(item.id))
            .length === 0
        ) {
          item['selected'] = false
        } else {
          this.resList.push(item)
        }
      })
    }
    this.companies = this.companyUsers
    this.selectedUsers = this.resList
  },
  methods: {
    ...mapMutations('SnackBarNotif', { notifDanger: 'notifDanger' }),
    res(a) {
      if (a) {
        if (typeof this.currentUsers === 'string') {
          this.notifDanger('Channel Name is required.')
          return
        }
        const res = this.resList.slice()
        this.selectedUsers.forEach(item => {
          res.push(item['id'])
        })
        this.$emit('updateGroupChat', {
          users: this.selectedUsers
        })
      } else {
        this.$emit('updateGroupChat', {
          users: []
        })
      }
      this.roomName = ''
    },
    removeSelectedUser(item) {
      this.$emit('removeMember', {
        user: item
      })
      const index = this.selectedUsers.indexOf(item)
      if (index >= 0) this.selectedUsers.splice(index, 1)
    }
  }
}
</script>

<style>
.v-sheet.v-card {
  border-radius: 0 !important;
}
.messages-container {
  overflow-y: auto;
  overflow-x: hidden;
}
.messages-container.long-height {
  height: 207px;
}
</style>

<template>
  <div
    class="departments dont-show-scroll h-sidepanel max-w-side pr-2 pt-0 py-5 vertical-scroll"
  >
    <sponsored-ads />
    <v-row class="mx-0">
      <v-col class="pb-0 transparent">
        <v-row class="align-baseline">
          <v-col class="py-0">
            <h4 class="font-weight-bold grey--text ml-2 text--darken-2 text-body-1">
              Contacts
            </h4>
          </v-col>
          <v-col
            class="py-0 text-right"
            cols="2"
          >
            <v-btn
              color="grey darken-4"
              icon
              @click="searchBar = !searchBar"
            >
              <v-icon color="grey darken-1">
                mdi-magnify
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="align-center justify-center">
          <v-col
            class="pr-0 pt-0"
            cols="11"
          >
            <v-text-field
              v-if="searchBar"
              v-model="searchInput"
              class="messenger-search px-0"
              dense
              flat
              height="40"
              hide-details
              outlined
              rounded
              single-line
              solo
            >
              <template v-slot:label>
                <div class="search-text">
                  Search connections, groups, and people
                </div>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="mx-0 pl-2 pr-1 py-2 w-full">
      <template v-for="(department, index) in departments">
        <company-chats
          v-if="department.type !== 'connections'"
          :key="'department-' + index"
          class="department-chat w-full"
          :department="department"
          :last-department="index !== departments.length - 1"
          :light-mode="lightMode"
        />
        <connections
          v-else-if="department.channels.length"
          :key="'department-' + index"
          class="department-connections w-full"
          :department="department"
          :is-group="department.isGroup"
          :last-department="index !== departments.length - 1"
          :light-mode="lightMode"
        />
      </template>
    </v-row>
  </div>
</template>

<script>
import CompanyChats from '@/views/Messenger/components/CompanyChats'
import SponsoredAds from '@/components/Home/SponsoredAds'
import Connections from './Connections'
import { mapState, mapGetters } from 'vuex'
export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'M6Chat',
  components: {
    CompanyChats,
    Connections,
    SponsoredAds
  },
  props: {
    lightMode: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    watchers: [],
    tab: null,
    searchBar: false,
    searchInput: ''
  }),
  computed: {
    ...mapGetters('GSChat', ['gsToken', 'chats', 'connections', 'newChannel']),
    ...mapState('Auth', {
      currentUser: 'user'
    }),
    ...mapGetters('Auth', { user: 'getUser' }),
    ...mapGetters('Companies', { companyUsers: 'getCurrentCompanyUsers' }),
    listUsers() {
      const listUsers = this.companyUsers.filter(user => user.id !== this.user.id)
      if (this.searchInput === '') {
        return listUsers
      } else {
        const searchTextLowerCase = this.searchInput.toLowerCase().trim()
        return listUsers.filter(user => user.firstName.toLowerCase().indexOf(searchTextLowerCase) !== -1 || user.lastName.toLowerCase().indexOf(searchTextLowerCase) !== -1)
      }
    },
    myGroups() {
      const groupsChannel = this.connections.filter(itm => itm.id.split('-')[1] === 'group')
      if (this.searchInput === '') {
        return groupsChannel
      } else {
        const searchTextLowerCase = this.searchInput.toLowerCase().trim()
        const filteredGroupsChannels = []
        groupsChannel.map(channel => {
          if (channel.data.name.toLowerCase().indexOf(searchTextLowerCase) !== -1) {
            filteredGroupsChannels.push(channel)
          } else {
            for (const [key, value] of Object.entries(channel.state.members)) {
              if (value.user.id.toString() === this.currentUser.id) {
                continue
              }
              if (value.user.name.toLowerCase().indexOf(searchTextLowerCase) !== -1) {
                filteredGroupsChannels.push(channel)
                break
              }
            }
          }
        })
        return filteredGroupsChannels
      }
    },
    myChannels() {
      const channels = this.connections.filter(itm => itm.id.split('-')[1] !== 'group')
        .sort((current, next) => {
          if (current.data.last_message_at && next.data.last_message_at) {
            return current.data.last_message_at.localeCompare(next.data.last_message_at)
          } else if (current.data.last_message_at === undefined) {
            return -1
          } else if (next.data.last_message_at === undefined) {
            return 1
          }
          return 0
        })
        .reverse()
      if (this.searchInput === '') {
        return channels
      } else {
        const searchTextLowerCase = this.searchInput.toLowerCase().trim()
        const filteredChannels = []
        channels.map(channel => {
          for (const [key, value] of Object.entries(channel.state.members)) {
            if (value.user.id.toString() === this.currentUser.id) {
              continue
            }
            if (value.user.name.toLowerCase().indexOf(searchTextLowerCase) !== -1) {
              filteredChannels.push(channel)
              break
            }
          }
        })
        return filteredChannels
      }
    },
    departments() {
      return [
        {
          name: 'My Connections',
          channels: this.myChannels,
          isGroup: false,
          type: 'connections'
        },
        {
          name: 'My Groups',
          channels: this.myGroups,
          isGroup: true,
          type: 'connections'
        },
        {
          name: `${this.companyName()} Colleagues`,
          users: this.listUsers
        },
        {
          name: 'People in other Companies',
          users: this.listUsers
        }
      ]
    }
  },
  methods: {
    companyName() {
      return Object.keys(this.user).length > 0
        ? this.user.companies.filter(
          com => com.id === this.user.currentCompany
        )[0]['name']
        : ''
    },
    expandMessenger() {
      this.$router.push({ name: 'messenger' })
    }
  }
}
</script>

<style lang="scss" scoped>
.messenger-search {
  width: 100%;
  padding: 8px 20px;
  background: unset;
  border-radius: 19px;
  outline: none;
  color: white;
}
.search-text {
  font-size: 14px;
}
.tab-item {
  .title {
    display: none;
  }
}
.tab-item:hover {
  background: unset;
  border: none;
  .title {
    display: block;
    margin: 0;
  }
}

.v-tab {
  text-transform: none !important;
  font-family: 'Roboto', sans-serif;
  font-size: 10px;
  color: gray;
  line-height: 10px;
  &:hover {
    span {
      color: #303fe2;
    }
    border-bottom: 2px solid #303fe2;
    padding-bottom: 0px !important;
  }
  padding-bottom: 2px !important;
}
.v-tab--active {
  span {
    color: #303fe2;
  }
  border-bottom: 2px solid #303fe2;
}
</style>

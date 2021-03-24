<template>
  <v-container
    class="container fill-height overflow-hidden white"
    fluid
  >
    <v-row class="fill-height overflow-hidden">
      <v-col
        class="fixed-left-panel pb-0"
        :cols="$vuetify.breakpoint.mdAndUp ? $vuetify.breakpoint.md ? 4 : 3 : 12"
      >
        <v-row>
          <v-col class="pb-0 pt-0">
            <v-row>
              <v-col>
                <h4 class="font-weight-bold grey--text ml-2 text--darken-2 text-body-1">
                  Messenger
                </h4>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-0">
                <v-text-field
                  v-model="searchInput"
                  background-color="#F0F2F5"
                  class="pr-0"
                  dense
                  filled
                  flat
                  height="40"
                  hide-details
                  prepend-inner-icon="mdi-magnify "
                  rounded
                  single-line
                  @input="onChangeSearchInput"
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
        <v-row>
          <v-tabs
            v-model="tab"
            background-color=""
            centered
            class="messenger-tabs"
            hide-slider
            slider-size="2"
          >
            <v-tab
              class="mx-1 px-1 tab-item"
              href="#tab-1"
            >
              <span>All</span>
            </v-tab>
            <v-tab
              class="mx-1 px-1 tab-item"
              href="#tab-2"
            >
              <span>Connections</span>
            </v-tab>
            <v-tab
              class="mx-1 px-1 tab-item"
              href="#tab-3"
            >
              <span>Groups</span>
            </v-tab>
            <v-tab
              class="mx-1 px-1 tab-item"
              href="#tab-4"
            >
              <span>Contacts</span>
            </v-tab>
            <v-tab
              class="mx-1 px-1 tab-item"
              href="#tab-5"
            >
              <span>Invitations</span>
            </v-tab>
          </v-tabs>
          <v-tabs-items
            v-model="tab"
            class="left-chats-tabs my-2 w-full"
            :class="{'pb-10': $vuetify.breakpoint.smAndDown}"
          >
            <v-tab-item
              class="px-4"
              value="tab-1"
            >
              <v-row class="mx-0 pl-2 pr-1 py-2 w-full">
                <template v-for="(department, index) in departments">
                  <company-chats
                    v-if="department.type !== 'connections'"
                    :key="'department-' + index"
                    class="department-chat w-full"
                    :department="department"
                    :last-department="index !== departments.length - 1"
                  />
                  <connections
                    v-else-if="department.channels.length"
                    :key="'department-' + index"
                    class="department-connections w-full"
                    :department="department"
                    :is-group="department.isGroup"
                    :last-department="index !== departments.length - 1"
                  />
                </template>
              </v-row>
            </v-tab-item>
            <v-tab-item
              class="px-4"
              value="tab-2"
            >
              <v-row class="mx-0 pl-2 pr-1 py-2 w-full">
                <connections
                  v-if="departments[0].channels.length"
                  class="department-connections w-full"
                  :department="departments[0]"
                  :is-group="departments[0].isGroup"
                />
              </v-row>
            </v-tab-item>
            <v-tab-item
              class="px-4"
              value="tab-3"
            >
              <v-row class="mx-0 pl-2 pr-1 py-2 w-full">
                <connections
                  v-if="departments[1].channels.length"
                  class="department-connections w-full"
                  :department="departments[1]"
                  :is-group="departments[0].isGroup"
                />
              </v-row>
            </v-tab-item>
            <v-tab-item
              class="px-4"
              value="tab-4"
            >
              <v-row class="mx-0 pl-2 pr-1 py-2 w-full">
                <company-chats
                  class="department-chat w-full"
                  :department="departments[2]"
                />
                <company-chats
                  class="department-chat w-full"
                  :department="departments[3]"
                />
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-row>
      </v-col>
      <v-col
        v-if="
          !currentMessengerChat || !Object.keys(currentMessengerChat).length
        "
        class="align-center fixed-message-container flex-column justify-center pb-0 white"
        :class="{'d-none': $vuetify.breakpoint.smAndDown, 'd-flex': !$vuetify.breakpoint.smAndDown}"
        cols="9"
      >
        <div class="align-center d-flex justify-center">
          <v-img
            v-if="Boolean($h.dg(currentUser, 'avatar', '').length)"
            :alt="currentUser.firstName"
            class="mr-3 rounded-circle"
            cover
            height="150px"
            :src="$h.dg(currentUser, 'avatar', '')"
            width="150px"
          />
          <v-icon
            v-else
            :alt="currentUser.firstName"
            x-large
          >
            mdi-account-circle
          </v-icon>
          <h1 class="mr-2">
            Welcome! <br>
            <strong>{{ $h.dg(currentUser, 'firstName', '') }}
              {{ $h.dg(currentUser, 'lastName', '') }}</strong>
          </h1>
        </div>
        <div
          class="align-center d-flex flex-column justify-center mt-4"
          :style="'display:none !important;'"
        >
          <v-btn
            class="mb-4"
            color="primary"
            depressed
            rounded
          >
            Start a conversation
          </v-btn>
          <p>
            Use search to find a contact or a group and start a conversation.
          </p>
        </div>
      </v-col>
      <v-col
        v-else
        class="mt-4 pa-0 white"
        :class="{'fixed-message-container': $vuetify.breakpoint.mdAndUp}"
        :cols="$vuetify.breakpoint.mdAndUp ? $vuetify.breakpoint.md ? 8 : 9 : 12"
      >
        <chatbox
          :key="currentMessengerChat && currentMessengerChat.id"
          :channel="currentMessengerChat"
          is-for-messenger
          @initiateVideoCall="initVideoCall"
        />
      </v-col>
    </v-row>
    <video-call-management :outgoingChannelId="outgoingChannelId" :callReceiverId="callReceiverId" @closedVideoCallDialog="closedVideoCallDialog" ref="videoCallManagement"></video-call-management>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Chatbox from '@/components/Home/M6Chat/Chatbox.vue'
import CompanyChats from './components/CompanyChats'
import Connections from '@/components/Home/M6Chat/Connections'
import VideoCallManagement from '@/components/Home/M6Chat/VideoCallManagement'
export default {
  name: 'Messenger',
  components: {
    Chatbox,
    CompanyChats,
    Connections,
    VideoCallManagement
  },
  data: () => ({
    tab: null,
    searchInput: '',
    editConfigurationDialog: false,
    filteredConnections: {},
    filteredGroups: {},
    filteredDepartment: {},
    showPannel: true,
    outgoingChannelId: null,
    callReceiverId: null
  }),
  computed: {
    ...mapGetters('GSChat', [
      'connections',
      'currentMessengerChat',
      'users'
    ]),
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
    myChats() {
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
    departments() {
      return [
        {
          name: 'My Connections',
          channels: this.myChats,
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
    async setMessengerChat(chat) {
      await this.$store.dispatch('GSChat/resetActiveMessengerChat')
      await this.$store.dispatch('GSChat/setActiveMessengerChat', chat)
      await chat.markRead()
    },
    onChangeSearchInput() {
      const searchTextLowerCase = this.searchInput.toLowerCase().trim()
      if (searchTextLowerCase === '') {
        this.filteredConnections = { ...this.myChats }
        this.filteredGroups = { ...this.myGroups }
        this.filteredDepartment = { ...this.department }
      } else {
        this.filteredConnections.channels = this.myChats.channels.filter(channel =>
          channel.membersInChannel.user && channel.membersInChannel.user.name.toLowerCase().indexOf(searchTextLowerCase) !== -1
        )

        const filteredGroupsChannels = []
        this.myGroups.channels.map(channel => {
          if (channel.data.name.toLowerCase().indexOf(searchTextLowerCase) !== -1) {
            filteredGroupsChannels.push(channel)
          } else {
            // eslint-disable-next-line no-unused-vars
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
        this.filteredGroups.channels = filteredGroupsChannels

        this.filteredDepartment.users = this.department.users.filter(user => user.firstName.toLowerCase().indexOf(searchTextLowerCase) !== -1 || user.lastName.toLowerCase().indexOf(searchTextLowerCase) !== -1)
      }
    },
    initVideoCall(event){
      const _this = this;

      this.outgoingChannelId = event.channelID
      this.callReceiverId = event.otherSingleUser

      setTimeout(function(){
        _this.$refs.videoCallManagement.initiateOutgoingVideoCall();
        _this.$refs.videoCallManagement.callingDialogOpen();
      }, 1000)
    },
    closedVideoCallDialog(){
      this.outgoingChannelId = null
      this.callReceiverId = null
    }
  },

  async beforeRouteLeave(to, from, next) {
    const chat = this.currentMessengerChat
    if (chat && Object.keys(chat).length) {
      await this.$store.dispatch('GSChat/resetActiveMessengerChat')
      await chat.markRead()
    }
    next()
  }
}
</script>

<style lang="scss" scoped>
.container {
  overflow: hidden;
  .active {
    color: blue;
    border: none;
  }
  .left-chats-tabs {
    height: 75vh;
    overflow-y: auto;
    max-height: 100%;
  }
  .search-text {
    font-size: 13px;
  }
}
.fixed-left-panel {
  position: fixed;
  top: 0px;
  padding-top: 60px;
  height: 100%;
}
.fixed-message-container {
  margin-left: auto;
}
.v-tab {
  text-transform: none !important;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: gray;
  line-height: 10px;
  min-width: fit-content !important;

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

<style>
.messenger-tabs .v-slide-group__content.v-tabs-bar__content{
  justify-content: space-evenly !important;
}
</style>

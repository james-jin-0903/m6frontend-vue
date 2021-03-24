<template>
  <div class="mb-5 relative">
    <div class="actions-container">
      <v-dialog
        v-if="!isGroup"
        v-model="editConfigurationDialog"
        width="500"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            color="grey darken-4"
            icon
            v-on="on"
          >
            <v-icon :class=" !lightMode ? 'grey--text text--darken-2' : 'white--text' ">
              mdi-account-multiple-plus-outline
            </v-icon>
          </v-btn>
        </template>
        <edit-configuration-dialog
          :key="editConfigurationDialog"
          :channel="newChannel"
          @close-dialog="closeDialog"
        />
      </v-dialog>
      <!-- <v-btn
        color="grey darken-4"
        icon
        @click="searchBar = !searchBar"
      >
        <v-icon :class=" !lightMode ? 'grey--text text--darken-2' : 'white--text' ">
          mdi-magnify
        </v-icon>
      </v-btn> -->
    </div>
    <div>
      <h4
        class="pointer"
        :class=" !lightMode ? 'grey--text text--darken-2 mb-3 ml-1' : 'white--text mb-3 ml-1' "
        @click="showPannel = !showPannel"
      >
        <v-icon>
          mdi-chevron-{{ showPannel ? 'up' : 'down' }}
        </v-icon>
        {{ department.name }}
      </h4>
      <div v-if="showPannel">
        <!-- <input
          v-show="searchBar"
          ref="searchInput"
          v-model="searchInput"
          class="search-input"
          placeholder="Start Typing to Search"
          type="text"
        > -->
        <v-btn
          v-for="(channel, ind) in filteredChannels"
          :key="'channel-' + channel.id"
          class="capitalize d-flex justify-start my-0 pointer px-2 py-6 w-full"
          color="transparent"
          dense
          elevation="0"
          @click="startChat(channel)"
        >
          <v-avatar
            v-if="channel.id.substr(14, 5) === 'group'"
            class="mr-3"
            :color="channel.data.image ? 'transparent' : 'blue'"
            dark
            size="36"
          >
            <v-img
              v-if="channel.data.image"
              :src="channel.data.image"
            />
            <template v-else>
              <span class="text-uppercase white--text"> <v-icon>mdi-account-group-outline</v-icon></span>
            </template>
          </v-avatar>
          <v-badge
            v-else
            bottom
            class="mr-3"
            :color="channel.membersInChannel.user.online ? 'green accent-3' : 'red accent-3'"
            dot
            offset-x="10"
            offset-y="10"
          >
            <v-avatar
              :color="channel.membersInChannel.user.image ? 'transparent' : 'blue'"
              dark
              size="36"
            >
              <v-img
                v-if="channel.membersInChannel.user.image"
                :src="channel.membersInChannel.user.image"
              />
              <template v-else>
                <span class="text-uppercase white--text">{{ channel.membersInChannel.user.name.charAt(0) }}</span>
              </template>
            </v-avatar>
          </v-badge>
          <div v-if="channel.id.substr(14, 5) === 'group'">
            <div class="align-start d-flex flex-column">
              <v-badge
                :content="unreadCount[ind]['unread']"
                offset-x="-5"
                offset-y="15"
                :value="unreadCount[ind]['unread'] > 0 ? unreadCount[ind]['unread'] : 0"
              >
                <div class="d-flex flex-row">
                  <p :class="(!lightMode ? 'grey--text text--darken-2' : 'white--text') + ' mb-0 text-left'">
                    {{ channel.data.name }}
                  </p>
                </div>
              </v-badge>
              <p
                :class="(!lightMode ? 'grey--text text--darken-1' : 'white--text') + ' mb-0 text-left p-size'"
              >
                {{ channel.last_message ? channel.last_message : "" }}
              </p>
              <span :class="'text-caption ' + departmentColor(user.type)">{{ user.departmentName }}</span>
            </div>
          </div>
          <div v-else>
            <div class="align-start d-flex flex-column">
              <v-badge
                :content="unreadCount[ind]['unread']"
                offset-x="-5"
                offset-y="15"
                :value="unreadCount[ind]['unread'] > 0 ? unreadCount[ind]['unread'] : 0"
              >
                <div class="d-flex flex-row">
                  <p :class="(!lightMode ? 'grey--text text--darken-2 mb-0' : 'white--text mb-0') + ' text-left'">
                    {{ channel.membersInChannel.user.name }}
                  </p>
                </div>
              </v-badge>
              <p
                class="subtitle"
                :class="(!lightMode ? 'grey--text text--darken-1' : 'text--darken-2') + ' mb-0 text-left p-size'"
              >
                {{ channel.last_message ? channel.last_message : "" }}
              </p>
              <span :class="'text-caption ' + departmentColor(user.type)">{{ user.departmentName }}</span>
            </div>
          </div>
        </v-btn>
        <div
          v-if="department.channels.length > 6"
          class="align-center d-flex grey--text justify-center my-2 pointer text-caption"
          @click="changeView"
        >
          <span class="mx-3">{{ showAll ? 'Show Less' : 'Show All' }}</span>
          <v-icon>
            mdi-chevron-{{ showAll ? 'up': 'down' }}
          </v-icon>
        </div>
        <div v-if="department.channels.length === 0">
          No results found
        </div>
      </div>
    </div>
    <div v-if="lastDepartment">
      <v-divider class="blue-grey lighten-4 mt-4" />
      <v-divider class="blue-grey lighten-4" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import EditConfigurationDialog from '@/components/Dialogs/EditConfiguration'

export default {
  name: 'Connections',
  components: {
    EditConfigurationDialog
  },
  props: {
    isGroup: {
      type: Boolean,
      default: false
    },
    department: {
      type: Object,
      default: () => {}
    },
    lightMode: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    showPannel: true,
    editConfigurationDialog: false,
    searchBar: false,
    lastDepartment: false,
    hover: false,
    showAll: false,
    searchInput: '',
    unreadCount: []
    // users: []
  }),
  computed: {
    ...mapState(['layout', 'chats']),
    ...mapGetters('Auth', { user: 'getUser' }),
    ...mapGetters('GSChat', { client: 'client', newChannel: 'newChannel' }),
    ...mapGetters('GSFeed', { feed: 'getFeed' }),
    users() {
      if (this.showAll) {
        return this.department.channels
      } else {
        if (this.department.channels.length && this.department.channels.length > 6) {
          return this.department.channels.slice(0, 6)
        } else {
          return this.department.channels
        }
      }
    },
    filteredChannels() {
      const result = []
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.unreadCount = []
      this.users.forEach(channel => {
        if (Object.keys(channel.state.members).length === 2) {
          Object.keys(channel.state.members).forEach(member => {
            if (member !== this.user.id) {
              const user = channel.state.members[member]
              if (user.user.name.toLowerCase().trim().indexOf(this.searchInput.toLowerCase().trim()) !== -1) {
                // If there are more than one user, we need to add an array of users and modify the template
                channel.membersInChannel = user
                channel.off(this.handleMessengerEvents)
                channel.on(this.handleMessengerEvents)
                result.push(channel)
                this.unreadCount.push({
                  isOpen: false,
                  cid: channel['cid'],
                  unread: channel['state']['read'][this.user.id]['unread_messages']
                })
              }
            }
          })
        } else {
          result.push(channel)
          this.unreadCount.push({
            isOpen: false,
            cid: channel['cid'],
            unread: channel['state']['read'][this.user.id]['unread_messages']
          })
        }
      })
      return result
    }
  },
  async mounted() {
    // this.users = this.department.channels.slice(0, 10)
    this.client.on('notification.message_new', r => {
      this.pushUnreadCount(r.channel)
    })
    this.client.on('channel.visible', r => {
      this.unreadCount.forEach((item, ind) => {
        if (item.cid === r.cid) {
          this.unreadCount[ind]['isOpen'] = !this.unreadCount[ind]['isOpen']
          this.unreadCount[ind]['unread'] = 0
        }
      })
    })
    this.client.on('channel.deleted', r => {
      this.department.channels.splice(this.department.channels.indexOf(
        this.department.channels.filter(e => e.id === r.channel_id)[0]
      ), 1)
      this.$store.dispatch('GSChat/deleteChat', r.channel_id)
    })
    this.client.on('member.removed', r => {
      if (this.user.id === r.user.id) {
        this.department.channels.splice(this.department.channels.indexOf(
          this.department.channels.filter(e => e.id === r.channel_id)[0]
        ), 1)
        this.$store.dispatch('GSChat/removeChat', r.channel_id)
      }
    })
    this.client.on('notification.removed_from_channel', r => {
      this.department.channels.splice(this.department.channels.indexOf(
        this.department.channels.filter(e => e.id === r.channel_id)[0]
      ), 1)
      this.$store.dispatch('GSChat/removeChat', r.channel_id)
    })
    this.client.on('channel.hidden', r => {
      if (this.user.id === r.user.id) {
        this.$store.dispatch('GSChat/removeChat', r.channel_id)
      }
    })
    this.client.on('notification.added_to_channel', () => {
      this.$store.dispatch('GSChat/retrieveChats', this.user.id)
    })

    Promise.all(
      this.filteredChannels.map(async channel => {
        const channelState = await channel.watch()

        if (channelState.messages.length === 0) {
          channel['last_message'] = ''
        } else {
          let lastIndex = channelState.messages.length - 1

          if (channelState.messages[lastIndex].images) {
            const images = channelState.messages[lastIndex].images
            lastIndex = images.length - 1
            if (images[lastIndex]) {
              const splitedUrl = images[lastIndex].split('/')
              channel['last_message'] = splitedUrl[splitedUrl.length - 1]
            } else {
              channel['last_message'] = ''
            }
          } else {
            channel['last_message'] = channelState.messages[lastIndex].text
          }
        }

        channel['last_message'] = channel['last_message'].substring(0, 30)
      })
    ).catch(() => {})
  },
  beforeDestroy() {
    this.filteredChannels.forEach(channel => {
      console.log('killing events')
      channel.off(this.handleMessengerEvents)
    })
  },
  methods: {
    ...mapActions('GSChat', ['resetNewChannel']),
    pushUnreadCount(channel) {
      this.unreadCount.forEach((item, ind) => {
        if (item.cid === channel.cid && item.isOpen === false) {
          this.unreadCount[ind]['unread'] += 1
        }
      })
    },
    async startChat(channel) {
      await this.$store.dispatch('GSChat/pushChat', channel)
      const read = this.unreadCount.find(a => a.cid === channel.cid)
      read.unread = 0
      await channel.markRead()
    },
    showSearchInputFunction() {
      this.showSearchInput = !this.showSearchInput
      this.$nextTick(() => this.$refs.searchInput.focus())
    },
    departmentColor(type) {
      return type === 'internal' ? 'grey--text text--darken-1' : 'blue--text text--darken-1'
    },
    closeDialog() {
      this.editConfigurationDialog = false
      this.resetNewChannel()
    },
    changeView() {
      // this.users = this.showAll ? this.department.channels.slice(0, 10) : this.department.channels
      this.showAll = !this.showAll
    },
    async handleMessengerEvents(event) {
      if (event.type === 'notification.message_new') {
        const channel = this.unreadCount.find(channel => channel.cid === event.cid)

        if (channel) {
          if (isNaN(channel.unread)) {
            channel.unread = 1
          } else {
            channel.unread++
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.actions-container {
    position: absolute;
    right: 0;
    z-index: 1;
    margin-top: -5px;
}
.p-size {
  font-size: 0.75rem;
  padding-top: 5.5px;
}
.mdi-chevron-right::before {
    background: #ddd;
    border-radius: 100%;
    margin: 6px 6px 6px 10px;
}
.v-expansion-panel-content__wrap {
    padding: 0;
}
.tooltip-content {
  background-color: #1976d2;
  color: white;
  border-radius: 8px;
  padding: 10px;
}
</style>

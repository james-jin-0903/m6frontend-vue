<template>
  <div class="my-2">
    <v-row class="align-baseline">
      <v-col>
        <h4
          v-if="nameToDisplay"
          class="grey--text mb-3 ml-1 pointer text--darken-2"
          @click="showPannel =!showPannel"
        >
          <v-icon>
            mdi-chevron-{{ showPannel ? 'up' : 'down' }}
          </v-icon>
          {{ nameToDisplay }}
        </h4>
      </v-col>
      <v-col
        v-if="isGroup"
        class="text-right"
      >
        <v-btn
          icon
          large
        >
          <v-dialog
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
                <img
                  alt="New group"
                  src="@/assets/svgs/new-group.svg"
                  width="30"
                >
              </v-btn>
            </template>
            <edit-configuration-dialog
              :key="editConfigurationDialog"
              :channel="newChannel"
              @close-dialog="closeDialog"
            />
          </v-dialog>
        </v-btn>
      </v-col>
    </v-row>
    <template v-if="showPannel">
      <v-btn
        v-for="(chat, ind) in recentChats"
        :key="`chat-${chat.id}`"
        class="capitalize d-flex justify-start my-0 pointer px-2 py-6 w-full"
        color="transparent"
        dense
        elevation="0"
        @click="$emit('set-messenger-chat', chat)"
      >
        <v-avatar
          v-if="chat.id.substr(14, 5) === 'group'"
          class="mr-3"
          :color="chat.data.image ? 'transparent' : 'blue'"
          dark
          size="36"
        >
          <v-img
            v-if="chat.data.image"
            :src="chat.data.image"
          />
          <template v-else>
            <span class="text-uppercase white--text">
              <v-icon>mdi-account-group-outline</v-icon>
            </span>
          </template>
        </v-avatar>
        <v-badge
          v-else-if="chat.membersInChannel && chat.membersInChannel.user"
          bottom
          class="mr-3"
          :color="chat.membersInChannel.user.online ? 'green accent-3' : 'red accent-3'"
          dot
          offset-x="10"
          offset-y="10"
        >
          <v-avatar
            :color="chat.membersInChannel.user.image ? 'transparent' : 'blue'"
            dark
            size="36"
          >
            <v-img
              v-if="chat.membersInChannel.user.image"
              :src="chat.membersInChannel.user.image"
            />
            <template v-else>
              <span class="text-uppercase white--text">{{ chat.membersInChannel.user.name.charAt(0) }}</span>
            </template>
          </v-avatar>
        </v-badge>
        <div v-if="chat.id.substr(14, 5) === 'group'">
          <div class="align-start d-flex flex-column">
            <v-badge
              :content="unreadCount[ind]['unread']"
              offset-x="-5"
              offset-y="15"
              :value="unreadCount[ind]['unread'] > 0 ? unreadCount[ind]['unread'] : 0"
            >
              <div class="d-flex flex-row">
                <p :class="(!lightMode ? 'grey--text text--darken-2' : 'white--text') + ' mb-0 text-left'">
                  {{ chat.data.name }}
                </p>
              </div>
            </v-badge>
            <p
              class="default-text-transform subtitle"
              :class="(!lightMode ? 'grey--text text--darken-1' : 'white--text') + ' mb-0 text-left'"
            >
              {{ chat.last_message ?chat.last_message : "" }}
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
                  {{ chat.membersInChannel.user.name }}
                </p>
              </div>
            </v-badge>
            <p
              class="default-text-transform subtitle"
              :class="(!lightMode ? 'grey--text text--darken-1' : 'text--darken-2') + ' mb-0 text-left'"
            >
              {{ chat.last_message ? chat.last_message : "" }}
            </p>
            <span
              class="text-caption"
              :class="departmentColor(user.type)"
            >{{ user.departmentName }}</span>
          </div>
        </div>
      </v-btn>
      <div
        v-if="chats.length > 6"
        class="align-center d-flex grey--text my-2 pointer text-caption"
        @click="showAllRecords"
      >
        <v-divider class="blue-grey lighten-5" />
        <span class="mx-3">{{ showAll ? 'Show Less' : 'Show All' }}</span>
        <v-icon>
          mdi-chevron-{{ showAll ? 'up': 'down' }}
        </v-icon>
        <v-divider class="blue-grey lighten-5" />
      </div>
      <div
        v-if="chats.length === 0"
        class="grey--text text--darken-2"
      >
        No results found
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EditConfigurationDialog from '@/components/Dialogs/EditConfiguration'
export default {
  name: 'MessengerChats',
  components: {
    EditConfigurationDialog
  },
  props: {
    nameToDisplay: {
      type: String,
      default: 'Chats'
    },
    chats: {
      type: Array,
      default: () => []
    },
    isGroup: {
      type: Boolean,
      default: false
    },
    lightMode: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    showPannel: true,
    showAll: false,
    editConfigurationDialog: false,
    unreadCount: []
  }),
  computed: {
    ...mapGetters('Auth', { user: 'getUser' }),
    ...mapGetters('GSChat', ['newChannel']),
    recentChats() {
      this.unreadCount = []

      this.chats.forEach(chat => {
        this.unreadCount.push({
          isOpen: false,
          cid: chat['cid'],
          unread: chat['state']['read'][this.user.id]['unread_messages']
        })
      })
      if (this.chats.length && this.chats.length > 6) {
        return this.chats.slice(0, 6)
      } else {
        return this.chats
      }
    }
  },
  methods: {
    ...mapActions('GSChat', ['resetNewChannel']),
    departmentColor(type) {
      return type === 'internal' ? 'grey--text text--darken-1' : 'blue--text text--darken-1'
    },
    showAllRecords() {
      this.recentChats = this.showAll ? this.chats.slice(0, 6) : this.chats
      this.showAll = !this.showAll
    },
    closeDialog() {
      this.editConfigurationDialog = false
      this.resetNewChannel()
    }
  }
}
</script>

<style>

</style>

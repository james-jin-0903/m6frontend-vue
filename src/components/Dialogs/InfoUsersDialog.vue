<template>
  <v-card
    class="rounded-lg"
    :flat="flatCard"
  >
    <v-card-text>
      <div class="flex">
        <span>Members</span>
        <v-menu
          :close-on-content-click="false"
          :max-width="400"
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="mx-2"
              color="green"
              dark
              fab
              small
              v-on="on"
            >
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>

          <add-user-dialog
            :bigger-height-messages-container="false"
            :current-users="currentUsers"
            :flat-card="true"
            :show-action-buttons="true"
            :show-card-header="false"
            :show-user-auto-select-field="true"
            @closeModal="addMembers"
            @currentUsersChanged="channel.state.members = $event"
          />
        </v-menu>
      </div>
      <v-list class="transparent">
        <div
          v-for="(userID, index) in Object.keys(currentUsers)"
          :key="index + '-user-info'"
        >
          <v-list-item>
            <v-list-item-icon size="20">
              <v-avatar
                color="blue"
                dark
                size="36"
              >
                <v-img
                  v-if="currentUsers[userID]['user']['image']"
                  :src="currentUsers[userID]['user']['image']"
                />
                <template v-else>
                  <span class="text-uppercase white--text">{{ currentUsers[userID]['user']['name'].charAt(0) }}</span>
                </template>
              </v-avatar>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ currentUsers[userID]['user']['name'] }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="currentUsers[userID]['user']['online']">
                <p class="font-weight-medium green--text ma-0 pa-0 text--accent-4 text-caption">
                  online
                </p>
              </v-list-item-subtitle>
              <v-list-item-subtitle v-else>
                {{ new Date(currentUsers[userID]['user']['last_active']).toString().substr(0,15) }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon>
              <v-btn
                v-if="role === 'owner' && currentUsers[userID]['role'] !== 'owner'"
                icon
                @click="remove(currentUsers[userID])"
              >
                <v-icon color="red darken-1">
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-list-item-icon>
          </v-list-item>
        </div>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AddUserDialog from '@/components/Dialogs/AddUserDialog'
export default {
  name: 'InfoUsersDialog',
  components: {
    AddUserDialog
  },
  props: {
    currentUsers: {
      type: Object,
      default: () => {}
    },
    channel: {
      type: Object,
      default: () => {}
    },
    flatCard: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    role: 'member'
  }),
  methods: {
    async addMembers(event) {
      for (const user of event.users) {
        await this.channel.addMembers([user.user.id])
      }
    },
    async remove(user) {
      await this.channel.removeMembers([user.user.id])
    }
  },
  computed: {
    ...mapGetters('Auth', { user: 'getUser' }),
    ...mapGetters('GSChat', { client: 'client' })
  },
  watch: {
    currentUsers: {
      handler: function (newVal, oldVal) {
        this.$emit('currentUsersChanged', newVal)
      },
      deep: true
    }

  },
  mounted() {
    this.role = this.currentUsers[this.user.id]['role']
  }
}
</script>

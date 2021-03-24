<template>
  <v-card>
    <v-card-text class="pa-0">
      <settings-channel-dialog
        :channel="channel"
        :cuser="user.id"
        :edit-mode="editMode"
        :loading="loading"
        @createGroupChat="createGroupChat"
      />
      <add-user-dialog
        :current-users="channel.state ? channel.state.members : user.id"
        :show-card-header="false"
        @removeMember="remove"
        @updateGroupChat="addMembers"
      />
      <v-divider />
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import AddUserDialog from '@/components/Dialogs/AddUserDialog'
import SettingsChannelDialog from '@/components/Dialogs/SettingsChannelDialog'
export default {
  name: 'EditConfiguration',
  components: {
    AddUserDialog,
    SettingsChannelDialog
  },
  props: {
    channel: {
      type: Object,
      default: () => {}
    },
    editMode: {
      type: Boolean
    }
  },
  data() {
    return {
      tabs: 1,
      loading: false
    }
  },
  computed: {
    ...mapGetters('Auth', { user: 'getUser' })
  },
  methods: {
    ...mapActions('GSChat', ['makeGroupChat', 'resetNewChannel']),
    ...mapMutations('SnackBarNotif', { notifDanger: 'notifDanger' }),
    height() {
      const viewportSize =
        Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        ) * 0.6
      return `${viewportSize}px`
    },
    deleteMessages() {},
    async addMembers(event) {
      if (!event.users.length) {
        this.$emit('close-dialog')
        return
      }

      this.loading = true
      for (const user of event.users) {
        if (user.id !== this.user.id) {
          try {
            await this.channel.addMembers([user.id.toString()])
          } catch (error) {
            this.notifDanger(user.firstName + ' User is not existed.')
          }
        }
      }
      this.$emit('close-dialog')
    },
    async remove(event) {
      this.loading = true
      if (event.user.id !== this.id) {
        await this.channel.removeMembers([event.user.id.toString()])
      }
    },
    async createGroupChat(event) {
      // We make the new conversation
      await this.makeGroupChat({
        name: event.name,
        image: event.image,
        members: event.users
      })
    }
  }
}
</script>

<template>
  <v-card
    class="elevation-0 rounded-lg"
    :loading="loading"
  >
    <template v-slot:progress>
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      />
    </template>
    <div class="chat_group__header">
      <template v-if="!editMode">
        New Chat Group
      </template>
    </div>
    <div class="avatar__container">
      <v-avatar
        class="avatar__content grey lighten-2 text-center"
        size="60"
        @mouseenter="isProfilePicHover = true"
        @mouseleave="isProfilePicHover = false"
      >
        <v-overlay
          absolute
          opacity="0.7"
          :value="isProfilePicHover"
        >
          <v-icon
            class="cursor-pointer"
            color="white"
            size="50"
            @click="uploadImage"
          >
            mdi-pencil
          </v-icon>
        </v-overlay>
        <m6-upload
          ref="m6Upload"
          class="d-none"
          @loading="loading = !loading"
          @response="reponseProfileImg"
        />
        <img
          v-if="channelImage !== ''"
          :alt="channelImage"
          :src="channelImage"
        >
        <v-icon
          v-else
          size="30"
        >
          mdi-account-group-outline
        </v-icon>
      </v-avatar>
    </div>
    <v-card-text class="py-0">
      <v-form ref="form">
        <v-text-field
          v-model="channelName"
          class="centered-input mt-0 text-body-1"
          counter
          maxlength="30"
          placeholder="Chat Group Name"
          required
          @blur="updateChannel(true)"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'SettingsChannelDialog',
  props: {
    channel: {
      type: Object,
      default: () => {}
    },
    cuser: {
      type: String,
      default: ''
    },
    editMode: {
      type: Boolean
    }
  },
  data: () => ({
    itemToDelete: '',
    isProfilePicHover: false,
    boolDeleteDiaLog: false,
    channelName: '',
    channelImage: '',
    loading: false
  }),
  mounted() {
    if (this.editMode && this.channel.data) {
      this.channelName = this.channel.data.name
      this.channelImage = this.channel.data.image
    }
  },
  methods: {
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    deleteMessages() {
      this.itemToDelete = `'${this.channel.data.name}' group chat messages.`
      this.boolDeleteDiaLog = true
    },
    deleteGroup() {
      this.channel
        .delete()
        .then(() => {
          this.updateChannel(false)
        })
        .catch(() => {
          this.notifDanger('There was an error since deleting.')
        })
      this.boolDeleteDiaLog = false
    },
    async updateChannel(res) {
      if (this.channelName === '') {
        this.notifDanger('Channel Name is required.')
        return
      }
      if (!this.channel.state) {
        if (res) {
          this.$emit('createGroupChat', {
            name: this.channelName,
            image: this.channelImage,
            users: [this.cuser]
          })
        }
        return
      }
      if (res) {
        await this.channel.update({
          name: this.channelName,
          image: this.channelImage
        })
      }
    },
    async reponseProfileImg(res) {
      if (res.ok) {
        this.channelImage = res.data.link
        await this.updateChannel(true)
        this.notifSuccess('Image uploaded successfully')
      } else {
        this.notifDanger('There was an error while saving the file')
      }
    },
    uploadImage() {
      if (this.$refs.m6Upload) {
        this.$refs.m6Upload.pickFile()
      }
    }
  }
}
</script>

<style>
header.v-toolbar,
.v-toolbar__content {
  border-radius: 0 !important;
}
</style>

<style scoped>
.centered-input >>> input {
  text-align: center;
}
.chat_group__header {
  height: 65px;
  background-color: #2a62ff;
  color: white;
  font-size: 24px;
  font-weight: 600;
  padding: 15px;
}
.avatar__container {
  display: flex;
  justify-content: center;
  margin-bottom: -36px;
}
.avatar__content {
  position: relative;
  bottom: -50%;
  transform: translateY(-50%);
  margin: 0 auto;
}
.cursor-pointer {
  cursor: pointer;
}
</style>

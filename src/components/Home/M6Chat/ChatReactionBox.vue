<template>
  <div>
    <v-btn
      class="btn-chat-shadow grey--text mb-3 mr-2"
      fab
      height="16"
      width="16"
      x-small
      @click="toggleReactionEmoji"
    >
      <v-icon size="16">
        mdi-emoticon-happy-outline
      </v-icon>
    </v-btn>
    <v-emoji-picker
      v-if="showReactionDialog"
      v-show="true"
      v-click-outside="onClickOutSide"
      class="card-custom-shadow grey lighten-5 reaction-select-container"
      :custom-emojis="reactionEmojis"
      :show-category="false"
      :show-search="false"
      @select="onReactEmoji"
    />
  </div>
</template>

<script>
import { VEmojiPicker } from 'v-emoji-picker'
export default {
  name: 'ChatReactionBox',
  components: {
    VEmojiPicker
  },
  data: () => ({
    showReactionDialog: false,
    reactionEmojis: [
      {
        data: '👍',
        category: 'Peoples',
        aliases: ['thumbsup']
      },
      {
        data: '👎',
        category: 'Peoples',
        aliases: ['thumbsdown']
      },
      {
        data: '😀',
        category: 'Peoples',
        aliases: ['grinning']
      },
      {
        data: '😢',
        category: 'Peoples',
        aliases: ['cry']
      },
      {
        data: '❤️',
        category: 'Peoples',
        aliases: ['heart']
      }
    ]
  }),
  methods: {
    onClickOutSide() {
      this.showReactionDialog = false
    },
    toggleReactionEmoji() {
      this.showReactionDialog = !this.showReactionDialog
    },
    onReactEmoji(emoji) {
      this.showReactionDialog = false
      this.$emit('react-with-emoji', emoji)
    }
  }
}
</script>

<style>
.reaction-select-container {
  position: absolute;
  left: 0;
  top: 0;
  height: 54px;
  margin-top: 20px;
  z-index: 1;
  width: 300px !important;
}
</style>

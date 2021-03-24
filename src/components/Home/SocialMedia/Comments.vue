<template>
  <div>
    <v-row no-gutters>
      <v-avatar
        class="mb-4 mr-3"
        :size="size"
      >
        <v-img
          aspect-ratio="1.7"
          :src="comment.user.data.image"
        />
      </v-avatar>
      <v-col>
        <div
          v-if="!updateCommentShow"
          class="d-flex"
        >
          <v-card
            class="grey lighten-5 py-3 relative rounded-xl w-fit"
            flat
          >
            <v-card-subtitle class="comment-user-text mb-1 py-0">
              {{
                comment.user.data.name
              }}
            </v-card-subtitle>
            <v-card-text
              v-line-clamp="4"
              class="comment-text hyphen py-0"
            >
              {{ comment.data.text }}
            </v-card-text>
          </v-card>
          <v-menu
            bottom
            left
          >
            <template v-slot:activator="{ on }">
              <v-btn
                class="align-center d-flex justify-center ma-1 mt-5"
                icon
                style="height: 16px; width: 25px; border-radius: 8px"
                v-on="on"
              >
                <v-icon size="15">
                  mdi-dots-horizontal
                </v-icon>
              </v-btn>
            </template>

            <v-list class="d-flex grey lighten-3 py-0 top-0">
              <v-list-item
                class="px-2"
                @click="showUpdateInputs"
              >
                <v-list-item-title class="px-0 text-caption">
                  Edit
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                class="px-2"
                @click="deleteCommentDiaLog = true"
              >
                <v-list-item-title class="px-0 text-caption">
                  Delete
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <template v-else>
          <v-textarea
            v-model="updatedComment"
            auto-grow
            filled
            label="Edit Comment"
            no-resize
            rounded
            rows="1"
            type="text"
            @click:append="toogleDialogEmoji"
            @keyup.enter="updateComment"
          />
          <!-- @click:append="toogleDialogEmoji" -->
          <!-- Emoji Picker -->
          <div class="relative">
            <v-emoji-picker
              v-show="showDialog"
              class="absolute card-custom-shadow emoji-component grey lighten-5 post right-0 z-10"
              label-search="Search"
              lang="en"
              @select="onSelectEmoji"
            />
          </div>
          <p
            class="comment-btn cursor-hover pointer text-caption underline"
            @click="cancelUpdate"
          >
            Cancel
          </p>
        </template>
        <template v-if="!updateCommentShow">
          <div class="px-3 py-3">
            <v-row>
              <span
                :class="
                  likeClass + 'cursor-hover underline comment-btn pointer'
                "
                @click="likeReaction"
              >Like</span>
              <div class="px-1">
                ·
              </div>
              <span
                v-if="reply"
                class="comment-btn cursor-hover pointer underline"
                @click="showReplyMessage = !showReplyMessage"
              >Reply</span>
              <div
                v-if="reply"
                class="px-1"
              >
                ·
              </div>
              <span class="cursor-hover timestamp underline">
                {{ new Date(comment.created_at).toString().substr(16,5) }} - {{ new Date(comment.created_at).toString().substr(0,10) }}</span>
              <v-spacer />
            </v-row>
          </div>
        </template>
      </v-col>
      <v-dialog
        v-model="deleteCommentDiaLog"
        max-width="290"
        persistent
      >
        <v-card>
          <v-card-title class="headline">
            Are you sure?
          </v-card-title>
          <v-card-text>
            Do you want to remove '{{ comment.data.text }}'?
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green darken-1"
              text
              @click="deleteCommentDiaLog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="deleteComment"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <div
      v-if="reply && showReplyMessage"
      class="mb-3 ml-16 mr-3"
    >
      <div v-if="comment.latest_children.comment">
        <component
          :is="'PostComments'"
          v-for="(
            childComment, index2
          ) of comment.latest_children.comment.slice().reverse()"
          :key="index2"
          :comment="childComment"
          :reply="false"
          :size="36"
        />
      </div>

      <div class="d-flex">
        <v-badge
          bottom
          color="green accent-3"
          dot
          offset-x="10"
          offset-y="10"
        >
          <v-avatar size="37">
            <img
              :alt="userData.name"
              :src="userData.image"
            >
          </v-avatar>
        </v-badge>
        <v-textarea
          v-model="reply_data"
          auto-grow
          class="ml-3"
          dense
          filled
          hide-details
          no-resize
          placeholder="Write a reply..."
          rounded
          rows="1"
          @keyup.enter="pushChildComment"
        />
      </div>
    </div>
    <div
      v-else
      class="comment-btn cursor-hover mb-1 ml-16 mr-3 pointer text-caption underline"
      @click="showReplyMessage = !showReplyMessage"
    >
      <template v-if="reply">
        {{ replyLinkMessage }}
      </template>
    </div>
  </div>
</template>

<script>
import VEmojiPicker from 'v-emoji-picker'
import PostComments from './Comments'
import { mapGetters } from 'vuex'

export default {
  name: 'PostComments',
  components: {
    VEmojiPicker,
    PostComments
  },
  props: {
    feedActivity: Boolean,
    reply: Boolean,
    userData: Object,
    comment: Object,
    size: Number
  },
  data: () => ({
    likeState: false,
    toggle_exclusive: 2,
    showReplyMessage: false,
    updateCommentShow: false,
    deleteCommentDiaLog: false,
    updatedComment: '',
    showDialog: false,
    childComments: [],
    reply_data: ''
  }),
  computed: {
    ...mapGetters('GSFeed', {
      client: 'getClient'
    }),
    likeClass() {
      return this.likeState ? 'blue--text ' : ''
    },
    likeQuantity() {
      const quantity = this.likeState
        ? this.comment.reactions.likes + 1
        : this.comment.reactions.likes
      return quantity
    },
    likeIcon() {
      return this.likeState ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'
    },
    replyLinkMessage() {
      return this.comment.children_counts.comment !== 0 &&
        this.comment.children_counts.comment !== undefined
        ? this.comment.children_counts.comment + ' replies'
        : ''
    }
  },
  async mounted() {
    this.updatedComment = this.comment.data.text
    await this.$store.dispatch('GSFeed/retrieveFeed')

    if (this.comment.latest_children.like !== undefined) {
      const filteredLikesByCurrentUser = this.comment.latest_children.like.filter(
        element => this.client.userId === element.user_id)
      if (filteredLikesByCurrentUser.lenght !== 0) {
        this.likeState = true
      }
    }
  },
  methods: {
    async retrieveChildReactions() {
      const res = await this.$store.dispatch(
        'GSFeed/retrieveChildReactions',
        this.comment.id
      )

      this.childComments = res.results
      this.updateCommentShow = false
    },
    async updateComment(event) {
      if (event.shiftKey) return
      if (event.keyCode == 13) {
        event.preventDefault()
        this.updatedComment = this.updatedComment.trim()
        await this.$store.dispatch('GSFeed/updateReaction', {
          id: this.comment.id,
          text: this.updatedComment
        })
        await this.$store.dispatch('GSFeed/retrieveFeed')
        await this.$store.dispatch(
          'GSFeed/setPreviewPost',
          this.comment.activity_id
        )

        this.updateCommentShow = false
      }
    },
    cancelUpdate() {
      this.updatedComment = this.comment.data.text
      this.updateCommentShow = false
    },
    toogleDialogEmoji() {
      this.showDialog = !this.showDialog
    },
    onSelectEmoji(emoji) {
      this.updatedComment += emoji.data
      this.toogleDialogEmoji()
    },
    async deleteComment() {
      await this.$store.dispatch('GSFeed/removeReaction', this.comment.id)
      await this.$store.dispatch('GSFeed/retrieveFeed')
      await this.$store.dispatch(
        'GSFeed/setPreviewPost',
        this.comment.activity_id
      )

      this.deleteCommentDiaLog = false
    },
    async pushChildComment(event) {
      if (event.shiftKey) return
      const replyData = this.reply_data
      this.reply_data = ''

      if (replyData.trim() == '') return true
      await this.$store.dispatch('GSFeed/addChildReactionComment', {
        comment: this.comment,
        text: replyData
      })
      if (this.feedActivity) {
        await this.$store.dispatch('GSFeed/setActionPost')
      } else {
        await this.$store.dispatch('GSFeed/retrieveFeed')
        await this.$store.dispatch(
          'GSFeed/setPreviewPost',
          this.comment.activity_id
        )
      }

      this.showReplyMessage = true
    },
    likeReaction() {
      let addLike = false
      if (this.comment.latest_children.like !== undefined) {
        const filteredLikesByCurrentUser = this.comment.latest_children.like.filter(
          element => this.client.userId === element.user_id)
        if (filteredLikesByCurrentUser.lenght !== 0) {
          filteredLikesByCurrentUser.forEach(async item => {
            await this.$store.dispatch('GSFeed/removeReaction', item.id)
            await this.$store.dispatch('GSFeed/retrieveFeed')
            await this.$store.dispatch(
              'GSFeed/setPreviewPost',
              this.comment.activity_id
            )

            this.likeState = false
          })
        } else {
          addLike = true
        }
      } else {
        addLike = true
      }

      if (addLike) {
        this.$store
          .dispatch('GSFeed/addChildReaction', this.comment)
          .then(async () => {
            await this.$store.dispatch('GSFeed/retrieveFeed')
            await this.$store.dispatch(
              'GSFeed/setPreviewPost',
              this.comment.activity_id
            )
            this.likeState = true
          })
      }
    },
    showUpdateInputs() {
      this.updatedComment = this.comment.data.text
      this.updateCommentShow = true
    },

    getHyphenText(text) {
      try {
        let newText = text
        const longWords = text.match(/\S{10,}/g)
        longWords.map(word => {
          const splitWords = word.match(/.{0,10}/g).map(item => {
            const position = 1 + Math.round(Math.random() * 9)
            return (
              item.substring(0, position) +
              '&shy;' +
              item.substring(position, item.length)
            )
          })
          const newWord = splitWords.join('').replace(/(&shy;)*$/i, '')
          newText = newText.replace(word, newWord)
        })
        return newText
      } catch (e) {
        return text
      }
    }
  }
}
</script>

<style scoped>
.likes-comment {
  bottom: -13px;
}
</style>

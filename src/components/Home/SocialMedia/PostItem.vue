<template>
  <v-container class="px-0 py-0 relative rounded-lg">
    <div class="card-custom-shadow mb-4 rounded-lg white">
      <div
        v-if="data['postTagTitle']"
        :class="tagColor + ' card-content__tag absolute white--text d-flex justify-center align-center text-body-1 font-weight-regular'"
      >
        {{ data['postTagTitle'] }}
      </div>
      <v-card-title
        class="pb-6 pt-6 px-5 rounded-t-lg"
        :style="`background-color:${cardColor.background}; color:${cardColor.text};`"
      >
        <v-row
          align="center"
          no-gutters
        >
          <div class="align-center d-flex">
            <v-avatar
              class="mr-2"
              :color="authorPostItem.data.image ? 'transparent' : 'blue'"
              dark
              size="36"
            >
              <v-img
                v-if="authorPostItem.data.image"
                :src="authorPostItem.data.image"
              />
              <template v-else>
                <span class="text-uppercase white--text">{{ authorPostItem.data.name.charAt(0) }}</span>
              </template>
            </v-avatar>
            <div class="d-flex flex-column">
              <div
                class="cursor-hover font-weight-bold line-height-1 size-15 underline"
                :style="`margin-bottom: 2px; color:${cardColor.text};`"
              >
                {{ authorPostItem.data.name }}
              </div>
              <div class="d-flex grey--text line-height-1 text-caption">
                <!--                <div class="grey&#45;&#45;text text&#45;&#45;darken-1">-->
                <!--                  {{ data.occupation || '' }}-->
                <!--                </div>-->
                <!--                <div class="grey&#45;&#45;text mx-1 text&#45;&#45;darken-1">-->
                <!--                  ·-->
                <!--                </div>-->
                <div
                  class="text--darken-1"
                  :style="`color:${cardColor.text};`"
                >
                  {{ new Date(data.time).toLocaleString('en-US') }}
                </div>
              </div>
            </div>
          </div>
          <v-spacer />
          <v-menu
            bottom
            left
          >
            <template #activator="{ on, attrs }">
              <v-btn
                v-show="isAuthor()"
                v-bind="attrs"
                :disabled="isPreview"
                icon
                v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list class="grey lighten-4">
              <v-list-item @click="openPostEdit">
                <v-list-item-title>Edit Post</v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteDiaLog = true">
                <v-list-item-title>Delete Post</v-list-item-title>
              </v-list-item>
              <v-list-item @click="showTaskBuilder = true">
                <v-list-item-title>Add Task</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
        <v-btn
          v-if="data.props"
          class="ml-2"
          color="red"
          icon
          @click="closeAction"
        >
          <v-icon size="22">
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>

      <div>
        <div class="pt-4 px-5">
          <template v-if="!updatePostShow">
            <p
              class="ma-0 pa-0"
              v-html="urlify(data.message)['text']"
            />
            <slot name="record" />

            <template v-if="recordFields">
              <form-show-generator
                :action-record="actionRecord"
                :fields="recordFields"
                :record-i-d="recordID"
              />
            </template>

            <slot name="assignments" />
          </template>
          <div
            v-else
            class="d-flex"
          >
            <v-textarea
              v-model="updateMessage"
              class="mb-0"
              label="Edit Post Message"
              name="input-7-4"
              outlined
              @keyup.enter="editMessage('inputMessage-' + index)"
              @keyup.esc="cancelMessage"
            />
            <div
              v-if="!data['props']"
              class="d-flex flex-column"
            >
              <v-btn
                class="ml-2"
                color="grey"
                icon
                @click="toogleDialogEmoji"
              >
                <v-icon size="22">
                  mdi-emoticon-happy-outline
                </v-icon>
              </v-btn>
              <v-btn
                class="ml-2"
                color="red"
                icon
                @click="cancelUpdate"
              >
                <v-icon size="22">
                  mdi-close
                </v-icon>
              </v-btn>
              <v-btn
                class="ml-2"
                color="green accent-3"
                :disabled="data.message === updateMessage"
                icon
                @click="updatePost(data)"
              >
                <v-icon size="22">
                  mdi-check
                </v-icon>
              </v-btn>
            </div>
            <!-- Emoji Picker -->
            <div
              class="relative"
            >
              <v-emoji-picker
                v-show="showDialog"
                class="absolute card-custom-shadow emoji-component grey lighten-5 post right-0 z-10"
                label-search="Search"
                lang="en"
                @select="onSelectEmoji"
              />
            </div>
          </div>
          <v-row v-if="updatePostShow && data['props']">
            <v-col
              class="py-0"
              cols="4"
            >
              <v-select
                v-model="recordType"
                item-text="label"
                item-value="value"
                :items="recordsType"
                label="Record Type"
                @change="changeRecord($event)"
              />
            </v-col>
            <v-col
              class="py-0"
              cols="8"
            >
              <v-select
                v-model="updateInfo.record_id"
                :class="{ disabled: recordType === null }"
                item-value="id"
                :items="options.records"
                label="Record"
              >
                <template
                  slot="selection"
                  slot-scope="data"
                >
                  <!-- HTML that describe how select should render selected items -->
                  {{ data.item.app_type }} - {{ data.item.title }}
                </template>
                <template
                  slot="item"
                  slot-scope="data"
                >
                  <!-- HTML that describe how select should render items when the select is open -->
                  {{ data.item.app_type }} - {{ data.item.title }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="updateInfo.assignment_list"
                chips
                deletable-chips
                hide-details
                hide-no-data
                hide-selected
                item-text="user.firstName"
                item-value="user.id"
                :items="companyUsers"
                label="People"
                multiple
                single-line
              >
                <template
                  slot="item"
                  slot-scope="data"
                >
                  <v-avatar
                    class="mr-3"
                    size="25"
                  >
                    <v-img :src="data.item.user.profilePic" />
                  </v-avatar>
                  <span> {{ data.item.user.firstName }} {{ data.item.user.lastName }} </span>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row v-if="updatePostShow && data['props']">
            <v-spacer />
            <v-btn
              class="grey--text white"
              elevation="0"
              width="120px"
              @click="cancelUpdate"
            >
              Cancel
            </v-btn>
            <v-spacer />
            <v-btn
              color="green darken-1"
              elevation="0"
              outlined
              width="120px"
              @click="updateActivity(data)"
            >
              Save
            </v-btn>
            <v-spacer />
          </v-row>
        </div>
      </div>
      <div>
        <v-row
          v-if="data['files'] && data['files'].length > 0"
          class="my-2"
        >
          <v-col
            v-for="(file, index) of data['files']"
            :key="index+'-file'"
            class="mx-5 my-0 py-0"
            cols="12"
          >
            <v-icon
              @click="redirect(file)"
            >
              mdi-file-document-outline
            </v-icon>
            <p
              class="font-weight-bold mx-2 my-0 pointer py-0 text-left text-subtitle-1"
              @click="redirect(file)"
            >
              {{ file.substring(file.lastIndexOf('/')+1).replace(/%20/g, ' ').replace('%28', '(').replace('%29', ')') }}
            </p>
          </v-col>
        </v-row>
        <div
          v-if="images.length !== 0 && typeof images[0] === 'string'"
          class="px-0 py-4"
        >
          <v-btn
            v-if="allImages && images.length>4"
            class="float-button"
            color="primary"
            outlined
            @click="showAll"
          >
            Show less
          </v-btn>
          <v-row
            v-if="images.length !== 0"
            no-gutters
          >
            <v-col
              v-for="(image, index) of pictureItems"
              :key="index"
              :cols="widthCols()"
            >
              <v-img
                v-if="getMediaType(image) === 'image'"
                aspect-ratio="1.7"
                class="ma-0 pointer"
                :src="image"
                @click="previewImage(image)"
              />
              <div class="mx-1 my-1 pointer video-list__container">
                <video
                  v-if="getMediaType(image) === 'video'"
                  controls
                >
                  <source
                    :src="image"
                    type="video/mp4"
                  >
                </video>
              </div>
            </v-col>
          </v-row>
          <v-btn
            v-if="!allImages && images.length>4"
            block
            class="mt-2"
            color="primary"
            outlined
            @click="showAll"
          >
            Show All
          </v-btn>
          <div
            v-line-clamp="5"
            class="black&#45;&#45;text size-14 text-style"
            :class="images.length !== 0 ? 'mt-3' : ''"
          >
            {{ data.contain }}
          </div>
        </div>
        <record-url
          v-if="data['record_url'] && data['record_url']['id']"
          :record-info="data['record_url']"
        />
        <external-url
          v-if="urlify(data.message)['urls'].length > 0 && urlify(data.message)['youtubeUrls'].length === 0"
          :urls="urlify(data.message)['urls']"
        />
        <youtube-video
          v-if="urlify(data.message)['youtubeUrls'].length > 0"
          :urls="urlify(data.message)['youtubeUrls']"
        />
        <div
          v-for="(row,index) in videoFileList"
          :key="index"
          class="video-list__container"
        >
          <video controls>
            <source
              :src="row"
              type="video/mp4"
            >
          </video>
        </div>
      </div>

      <v-card-actions class="px-5">
        <v-row
          align="center"
          class="px-2"
          no-gutters
        >
          <v-spacer />
          <div
            v-if="!isPreview"
            class="cursor-hover grey--text my-0 size-15 text--darken-1 underline"
            @click="showCommentsPost"
          >
            Comments
            <span>{{ data.reaction_counts.comment || 0 }}</span>
          </div>
        </v-row>
      </v-card-actions>
      <div class="d-flex justify-center w-full">
        <p
          v-if="data.tasks"
          class="pointer"
          @click="showTasks = !showTasks"
        >
          Tasks {{ data.tasks.length }}
        </p>
      </div>
      <v-divider class="mx-4" />
      <v-card-actions class="px-5 py-0">
        <v-row
          align="center"
          class="px-2"
          no-gutters
        >
          <v-col cols="4">
            <v-btn
              :class="`capitalize ${ likeState ? 'blue--text' : 'grey--text' } h-full my-1 py-5 text--darken-1 text-body-1 w-full`"
              :disabled="isPreview"
              small
              text
              @click="likeActivity(data)"
            >
              <v-icon
                class="mr-2"
                size="18"
              >
                {{ likeIcon }}
              </v-icon> Like
              <v-spacer v-if="data.reaction_counts.like > 0" />
              <span
                v-if="data.reaction_counts.like > 0"
                :class="`capitalize ${ likeState ? 'blue--text' : 'grey--text' } h-full my-1 py-5 text--darken-1 text-body-1`"
              >
                {{ getNumber(data.reaction_counts.like) }}
              </span>
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn
              class="capitalize grey--text h-full my-1 py-5 text--darken-1 text-body-1 w-full"
              :disabled="isPreview"
              small
              text
              @click="showCommentsPost"
            >
              <v-icon
                class="mr-2"
                size="18"
              >
                mdi-message-outline
              </v-icon> Comment
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  class="capitalize grey--text h-full my-1 py-5 text--darken-1 text-body-1 w-full"
                  :disabled="isPreview"
                  small
                  text
                  v-on="on"
                >
                  <v-icon
                    class="mr-2"
                    size="18"
                  >
                    mdi-share
                  </v-icon> Share
                </v-btn>
              </template>
              <v-list>
                <v-list-item class="mb-1">
                  <a
                    class="share-network-facebook social-button"
                    href="#"
                    style="background-color: #00AFF0"
                  >
                    <span
                      class="mr-2 social-icon"
                    >
                      M6
                    </span>
                    <span>Connect</span>
                  </a>
                </v-list-item>
                <v-list-item
                  v-for="(social, i) in socialSharingItems"
                  :key="i"
                  :class="{'mb-1': i !== socialSharingItems.length - 1}"
                >
                  <ShareNetwork
                    class="mr-2 social-button"
                    :media="data.images ? data.images[0] : ''"
                    :network="social.network"
                    :style="{backgroundColor: social.color}"
                    :title="data.message"
                    url="http://m6works.m6connect.com/"
                  >
                    <v-icon
                      class="mr-2 social-icon"
                      color="white"
                      size="18"
                    >
                      {{ social.icon }}
                    </v-icon>
                    <span>{{ social.name }}</span>
                  </ShareNetwork>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-actions>
      <v-divider
        v-if="showComments"
        class="mx-4"
      />

      <v-col
        v-if="showComments"
        class="d-flex px-5"
        cols="12"
      >
        <v-badge
          bottom
          class="mr-3"
          color="green accent-3"
          dot
          offset-x="10"
          offset-y="10"
        >
          <v-avatar size="48">
            <img
              :alt="client.currentUser.data.name"
              :src="client.currentUser.data.image"
            >
          </v-avatar>
        </v-badge>
        <v-textarea
          ref="currentUserComment"
          v-model="commentData"
          auto-grow
          class="black--text"
          dense
          filled
          hide-details
          no-resize
          placeholder="Write a comment..."
          rounded
          rows="1"
          @keyup.enter="pushComment($event, data)"
        />
      </v-col>
      <v-col
        v-if="showComments"
        class="d-flex px-5"
        cols="12"
      >
        <v-btn
          class="capitalize grey--text h-full my-1 py-5 text--darken-1 text-body-1 w-full"
          small
          text
          @click="viewPreviousComments"
        >
          <v-icon
            class="mr-2"
            size="18"
          >
            mdi-message-outline
          </v-icon> View Previous Comments
        </v-btn>
      </v-col>
      <div
        v-if="showComments && comments"
        class="pb-1 px-5"
      >
        <post-comments
          v-for="(comment, index) of comments.slice().reverse()"
          :key="index"
          :comment="comment"
          :feed-activity="data.props ? true : false"
          :reply="true"
          :size="48"
          :user-data="client.currentUser.data"
        />
      </div>
      <v-skeleton-loader
        v-if="showComments && showSkeleton"
        class="my-1 post-item px-1"
        type="list-item-avatar-two-line"
      />
    </div>
    <action-card-builder
      v-if="showTaskBuilder"
      has-default="task"
      :post="data"
      :post-id="data.id"
      type="task"
      @close="showTaskBuilder=false"
    />
    <tasks-list
      v-if="showTasks"
      :tasks="data.tasks ? data.tasks : []"
    />
    <v-dialog
      v-model="deleteDiaLog"
      max-width="350"
      persistent
    >
      <delete-dialog
        :element="`post: '${data.message}'`"
        @closeDeleteModal="$event ? deletePost(data) : deleteDiaLog = false"
      />
    </v-dialog>
  </v-container>
</template>

<script>
/* eslint-disable camelcase */
import PostComments from './Comments'
import { mapGetters, mapActions } from 'vuex'
import VEmojiPicker from 'v-emoji-picker'
import DeleteDialog from '@/components/Dialogs/DeleteDialog'
import FormShowGenerator from '@/components/AppBuilder/Form/FormShowGenerator.vue'
import ExternalUrl from '@/components/Home/SocialMedia/ExternalUrl.vue'
import RecordUrl from '@/components/Home/SocialMedia/RecordUrl.vue'
import YoutubeVideo from '@/components/Home/SocialMedia/YoutubeVideo'
import TasksList from '@/views/Home/ActionCenter/TasksList'
import ActionCardBuilder from '@/views/Home/ActionCenter/ActionCardBuilder'

export default {
  name: 'PostItem',
  components: {
    RecordUrl,
    TasksList,
    ExternalUrl,
    DeleteDialog,
    PostComments,
    VEmojiPicker,
    ActionCardBuilder,
    FormShowGenerator,
    YoutubeVideo
  },
  props: {
    data: {
      type: [String, Object],
      default: () => {}
    },
    recordID: {
      type: Number,
      default: 0
    },
    actionRecord: {
      type: Boolean,
      default: false
    },
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    showTaskBuilder: false,
    cardColor: {
      background: '#000',
      text: '#fff'
    },
    showTasks: false,
    recordsType: [
      { label: 'ITApps', value: 'itapps' }
    ],
    infoPanel: {},
    recordFields: [],
    recordType: null,
    options: {
      records: []
    },
    updateInfo: {
      record_id: null,
      assignment_list: [],
      preview_list: []
    },
    images: [],

    showBtnsPost: false,
    showComments: false,
    pageNumber: 1,
    pictureItems: [],
    likeState: false,
    profileImaga: '',
    allImages: false,
    commentData: '',
    rotate: '',
    user: {},
    deleteDiaLog: false,
    updatePostShow: false,
    updateMessage: '',
    // Emoji Dialog
    showDialog: false,
    showSkeleton: false,
    progressLike: false,
    // Social Sharing
    socialSharingItems: [
      {
        network: 'facebook',
        name: 'Facebook',
        icon: 'mdi-facebook',
        color: '#1877f2'
      },
      {
        network: 'twitter',
        name: 'Twitter',
        icon: 'mdi-twitter',
        color: '#1da1f2'
      },
      {
        network: 'linkedin',
        name: 'LinkedIn',
        icon: 'mdi-linkedin',
        color: '#007bb5'
      }
    ]
  }),
  computed: {
    ...mapGetters('Companies', { companyUsers: 'getCurrentCompanyUsers' }),
    ...mapGetters('Auth', { currentUser: 'getUser' }),
    ...mapGetters('GSFeed', {
      timeline: 'getTimeline',
      feed: 'getFeed',
      client: 'getClient',
      comments: 'getComments'
    }),
    tagColor() {
      return this.data['postType'] === 'request' ? 'red' : 'teal accent-3'
    },
    likeIcon() {
      return this.likeState ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'
    },
    authorPostItem() {
      let authorPostData = this.data.actor
      if (typeof authorPostData === 'string') authorPostData = JSON.parse(authorPostData)
      return authorPostData
    },
    videoFileList() {
      try {
        if (!this.data.files) return []
        return this.data.files.filter(row => row.split('/').slice(-2)[0].toUpperCase() === 'VIDEO')
      } catch (error) {
        return []
      }
    }
  },
  mounted() {
    this.cardColor = this.data.cardColor ? this.data.cardColor : {
      background: '#fff',
      text: '#000'
    }
    this.images = this.data.images
    // fix for Action Item
    if (this.images === undefined) {
      this.images = []
    }
    this.pictureItems = this.images.slice(0, 4)
    this.user = this.currentUser
    if (this.data.own_reactions.like !== undefined) {
      this.likeState = true
    }
    if (typeof this.data.actor === 'string') {
      this.data.actor = JSON.parse(this.data.actor)
    }
    this.updateMessage = this.data.message
    if (this.data.props && this.data.props.fields) {
      this.data.props.fields.forEach(field => {
        if (field.app_field) this.recordFields.push(field.app_field)
      })
    }
  },
  methods: {
    ...mapActions('GeneralListModule', ['push_data_to_active']),
    ...mapActions(['set_image_preview_overlay']),
    ...mapActions('WorkOrderModule', {
      records: 'getRecords',
      putAct: 'putAction',
      deleteAct: 'deleteAction'
    }),
    ...mapActions('AppAttachments', { getPostsUrl: 'get_post_file_url' }),
    ...mapActions('GSFeed', [
      'retrieveActivityReactions',
      'getCommentsByPage'
    ]),

    getNumber(value) {
      if (value) {
        return Math.abs(Number(value)) >= 1.0e+9
          ? (Math.abs(Number(value)) / 1.0e+9).toFixed(2) + 'B'
          // Six Zeroes for Millions
          : Math.abs(Number(value)) >= 1.0e+6
            ? (Math.abs(Number(value)) / 1.0e+6).toFixed(2) + 'M'
          // Three Zeroes for Thousands
            : Math.abs(Number(value)) >= 1.0e+3
              ? (Math.abs(Number(value)) / 1.0e+3).toFixed(2) + 'K'
              : Math.abs(Number(value))
      } else {
        return ''
      }
    },

    isAuthor() {
      return typeof this.data.actor === 'string' ? JSON.parse(this.data.actor)['id'] === this.user.id
        : this.data.actor.id === this.user.id
    },
    changeRecord(event) {
      switch (event) {
        case 'itapps':
          this.records(event).then(res => {
            this.options['records'] = res['data']
          })
          break
      }
    },
    redirect(file) {
      window.open(file, '_blank')
    },
    updateActivity(activity) {
      this.updateInfo['description'] = this.updateMessage
      this.activity = activity
      this.putAct({
        id: activity['props']['id'],
        query: this.updateInfo
      }).then(() => {
        this.updateInfo['preview_list'] = this.updateInfo['assignment_list']
        this.updatePost(activity).then(() => {
          this.$store.dispatch('WorkOrderModule/setWorkOrder')
        })
        this.cancelUpdate()
      })
    },
    urlify(text) {
      const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g

      const textUrls = []

      const res = text.replace(urlRegex, function (url) {
        try {
          const path = new URL(url)
          textUrls.push(url)
          return '<a href="' + url + '" target="_blank" class="pointer text-subtitle-1 font-weight-bold blue--text" >' + path.origin + '</a>'
        } catch (e) {
          textUrls.push(`http://${url}`)
          return '<a href="http://' + url + '" target="_blank" class="pointer text-subtitle-1 font-weight-bold blue--text" >' + url + '</a>'
        }
      })

      const youtubeUrls = textUrls.filter(row => this.youtubeCheck(row))
      return { text: res, urls: textUrls, youtubeUrls: youtubeUrls }
    },
    widthCols() {
      return this.images.length === 1 ? 12 : 6
    },
    contLikes() {
      return this.$h.dg(this.data, 'reaction_counts.like', '0')
    },
    showAll() {
      this.pictureItems = this.allImages
        ? this.images.slice(0, 4)
        : this.images
      this.allImages = !this.allImages
    },
    viewPreviousComments() {
      this.getCommentsByPage(this.pageNumber)
      this.pageNumber++
    },
    async showCommentsPost() {
      await this.retrieveActivityReactions(this.data.id)
      this.rotate = this.showComments ? '' : 'full-rotate'
      this.showComments = !this.showComments
      if (!this.$refs.currentUserComment) {
        this.$nextTick(() => this.$refs.currentUserComment.focus())
      }
    },
    async likeActivity(activity) {
      if (this.progressLike) return true
      this.progressLike = true
      const payload = {
        id: activity.id,
        type: 'like',
        whoNotify: activity.actor.id
      }

      if (this.data.own_reactions.like) {
        const activ = this.data.own_reactions.like.find(i => i.user_id === this.user.id)
        if (activ) {
          await this.$store.dispatch('GSFeed/removeReaction', activ.id)
          this.likeState = false
        } else {
          await this.$store.dispatch('GSFeed/addReaction', payload)
          this.likeState = true
        }
      } else {
        await this.$store.dispatch('GSFeed/addReaction', payload)
        this.likeState = true
      }
      if (activity.props) {
        await this.$store.dispatch('GSFeed/setActionPost')
        await this.$store.dispatch('WorkOrderModule/setWorkOrder')
      } else {
        await this.$store.dispatch('GSFeed/retrieveFeed')
      }

      this.progressLike = false
    },
    async pushComment(event, activity) {
      if (event.shiftKey) {
        return
      }
      this.showSkeleton = true
      const payload = {
        id: activity.id,
        type: 'comment',
        options: {
          text: this.commentData
        }
      }

      this.$store.dispatch('GSFeed/addReaction', payload).then(async () => {
        if (activity.props) {
          await this.$store.dispatch('GSFeed/setActionPost')
          await this.$store.dispatch('WorkOrderModule/setWorkOrder')
        } else {
          await this.$store.dispatch('GSFeed/retrieveFeed')
        }
        this.showSkeleton = false
      })

      if (!this.data.comments) {
        this.data.comments = []
      }
      this.commentData = ''
    },
    async deletePost(activity) {
      try {
        await this.$store.dispatch('GSFeed/removeActivity', activity.id)
        if (activity.props) {
          await this.deleteAct(activity.props.id)

          await this.$store.dispatch('GSFeed/setEmptyActionPost')
          await this.$store.dispatch('WorkOrderModule/setWorkOrder')
        }
        this.deleteDiaLog = false
        await this.$store.dispatch('GSFeed/retrieveFeed')
      } catch (e) {
        this.$snotify.error(e, 'Error')
      } finally {
        this.deleteDiaLog = false
      }
    },
    closeAction() {
      this.$store.dispatch('GSFeed/setEmptyActionPost')
    },
    async updatePost(activity) {
      if (typeof activity['actor'] === 'string') {
        activity['actor'] = JSON.parse(activity['actor'])
      }

      activity['actor']['data']['name'] = `${this.user.firstName} ${this.user.lastName}`
      activity['actor']['data']['image'] = this.user.profilePic
      activity.message = this.updateMessage

      this.$store.dispatch('GSFeed/updateActivity', activity)
      this.updatePostShow = false
      this.updateMessage = this.data.message
    },
    openPostEdit() {
      this.updatePostShow = true
      this.updateMessage = this.data.message
      if (this.data.props) {
        if (this.data.props.record) {
          this.records(this.data.props.record.app_type).then(res => {
            this.options['records'] = res['data']

            this.recordType = this.data['props']['record']['app_type']
            this.updateInfo['record_id'] = this.data['props']['record']['id']
          })
        }
        if (this.data['props']['wo_assignments'].length > 0) {
          this.data['props']['wo_assignments'].forEach(user => {
            this.updateInfo['assignment_list'].push(user.id)
          })
          this.updateInfo['preview_list'] = this.updateInfo['assignment_list']
        }
      }
    },
    cancelUpdate() {
      this.updatePostShow = false
      this.updateMessage = this.data.message
      this.updateInfo.assignment_list = []
    },
    async previewImage(selected) {
      await this.$store.dispatch('GSFeed/setPreviewPost', this.data['id'])
      this.set_image_preview_overlay([this.data.images, selected])
    },
    lineColor(approval) {
      return approval ? 'green accent-3 ' : 'grey '
    },
    toogleDialogEmoji() {
      this.showDialog = !this.showDialog
    },
    onSelectEmoji(emoji) {
      this.updateMessage += emoji.data
      this.toogleDialogEmoji()
    },
    pendingApprovals(approvals) {
      let pendingApprovals = 0
      approvals.forEach(element => {
        if (!element.approval) pendingApprovals++
      })

      return pendingApprovals
    },
    youtubeCheck(url) {
      const youtubeUrlRegex = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/
      return youtubeUrlRegex.test(url)
    },

    getMediaType(media) {
      if (typeof media === 'string') {
        return media.split('/').slice(-2)[0].toLowerCase()
      }
      return false
    }
  }
}
</script>

<style>
v-icon, p {
  display: inline-block;
}
.repeating-gradient {
  background-color: rgba(38, 38, 38, 0.7);
}
/* .v-text-field.v-input--dense:not(.v-text-field--outlined) input {
  padding: 0 !important;
} */
.v-badge--icon .v-badge__badge {
  height: 15px !important;
  min-width: 15px !important;
  display: flex;
  justify-content: center;
  padding: 0;
}
.profile-component .v-subheader, .profile-component .v-card {
  box-shadow: none !important;
  border-radius: 0 !important;
}
.v-text-field__details {
  display: none;
}
.emoji-component.post {
  bottom: -240px;
}
.post-item .v-skeleton-loader__avatar {
  width: 49px !important;
  height: 49px !important;
}
.video-list__container video {
  width: 100%;
}

/* Social sharing */
.social-button {
  padding: 0 8px 0 0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  text-decoration: none;
  line-height: 1.1;
}
.social-button span {
  color: #fff !important
}
.social-button .social-icon {
  background-color: rgba(0, 0, 0, 0.2) !important;
  padding: 7px;
}
</style>

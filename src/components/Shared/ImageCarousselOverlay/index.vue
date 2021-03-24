<template>
  <transition name="fade">
    <v-overlay
      opacity="0.6"
      :value="overlay"
    >
      <v-card
        class="h-80 w-80"
        @keydown.esc="closeOverlay"
        @keydown.left="images.indexOf(navigate++)"
        @keydown.right="images.indexOf(navigate--)"
      >
        <v-row
          align="center"
          class="fill-height"
          justify="center"
          no-gutters
        >
          <v-col
            class="h-80 relative"
            cols="8"
          >
            <v-avatar
              class="absolute mt-2 pointer"
              color="grey lighten-2"
              size="50"
              style="height: 50px; width: 50px; left: 15px; z-index: 100;"
              @click="closeOverlay"
            >
              <v-icon
                color="black"
                size="30"
              >
                mdi-close
              </v-icon>
            </v-avatar>
            <carousel
              class="w-full"
              :navigate-to="navigate"
              :navigation-enabled="true"
              :pagination-active-color="'#fff'"
              :pagination-color="'#333'"
              :pagination-enabled="true"
              :per-page="1"
            >
              <slide
                v-for="(item, index) in images"
                :key="index + '-image'"
              >
                <div
                  class="theme--dark v-image v-responsive"
                  style="height: 80vh;"
                >
                  <div
                    class="align-center d-flex justify-center v-image__image v-image__image--cover"
                  >
                    <img
                      alt=""
                      class="max-w-full"
                      :src="item"
                    >
                  </div>
                </div>
              </slide>
            </carousel>
          </v-col>
          <v-col
            class="h-80 overflow-scroll white"
            cols="4"
          >
            <v-card
              v-if="Object.keys(post).length > 0"
              class="card-custom-shadow white"
              style="height: 20vh;"
            >
              <v-card-title class="pb-0 pt-6 px-5">
                <v-row
                  align="center"
                  no-gutters
                >
                  <div class="align-center d-flex">
                    <v-avatar
                      class="mr-2"
                      :color="post.actor.data.image ? 'transparent' : 'blue'"
                      size="36"
                    >
                      <v-img
                        v-if="post.actor.data.image"
                        :src="post.actor.data.image"
                      />
                      <template v-else>
                        <span class="text-uppercase white--text">{{
                          post.actor.data.name.charAt(0)
                        }}</span>
                      </template>
                    </v-avatar>
                    <div class="d-flex flex-column">
                      <div
                        class="cursor-hover font-weight-bold line-height-1 size-15 underline"
                        style="margin-bottom: 2px;"
                      >
                        {{ post.actor.data.name }}
                      </div>
                    </div>
                  </div>
                </v-row>
              </v-card-title>
              <div>
                <div class="px-5 py-4">
                  <template>
                    {{ post.message }}
                    <slot name="record" />
                    <slot name="assignments" />
                  </template>
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
                    class="cursor-hover grey--text my-0 size-15 text--darken-1 underline"
                  >
                    Comments
                    <span>{{ post.reaction_counts.comment || 0 }}</span>
                  </div>
                </v-row>
              </v-card-actions>
            </v-card>
            <div
              v-if="Object.keys(post).length > 0"
              class="h-60 pt-4"
            >
              <v-col
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
                <v-text-field
                  ref="currentUserComment"
                  v-model="commentData"
                  class="black--text"
                  dense
                  height="40"
                  hide-details
                  placeholder="Write a comment..."
                  rounded
                  solo
                  @keyup.enter="pushComment(post)"
                />
              </v-col>
              <v-col
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
                v-if="post.latest_reactions.comment"
                class="pb-1 px-5"
              >
                <post-comments
                  v-for="(comment,
                          index) of comments"
                  :key="index"
                  :comment="comment"
                  :feed-activity="post.props ? true : false"
                  :reply="true"
                  :size="48"
                  :user-data="client.currentUser.data"
                />
              </div>
              <v-skeleton-loader
                v-if="showSkeleton"
                class="my-1 post-item px-1"
                type="list-item-avatar-two-line"
              />
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-overlay>
  </transition>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel'
import { mapGetters, mapActions } from 'vuex'
import PostComments from '@/components/Home/SocialMedia/Comments'
import CarouselImage from '@/components/Shared/ImageCarousselOverlay/CarouselImage'

export default {
  components: {
    Carousel,
    Slide,
    PostComments,
    CarouselImage
  },
  props: {
    value: {
      default: false
    },
    images: {
      required: true
    },
    selected: {
      required: true
    }
  },
  data() {
    return {
      overlay: false,
      likeState: false,
      progressLike: false,
      showSkeleton: false,
      commentData: '',
      navigate: 0,
      pageNumber: 1
    }
  },
  watch: {
    value(val) {
      this.overlay = val
    },
    post(val) {
      this.post.actor = JSON.parse(this.post.actor)
      this.retrieveActivityReactions(this.post.id)
    },
    selected(val) {
      this.navigate = [this.images.indexOf(val), false]
    }
  },
  computed: {
    ...mapGetters('GSFeed', {
      post: 'getPreviewPost'
    }),
    ...mapGetters('GSFeed', {
      client: 'getClient',
      comments: 'getComments'
    }),
    likeIcon() {
      return this.likeState ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'
    }
  },
  methods: {
    ...mapActions('GSFeed', ['retrieveActivityReactions', 'getCommentsByPage']),
    closeOverlay() {
      this.overlay = false
      this.$emit('restartImageArray')
    },
    showCommentsPost() {
      this.rotate = 'full-rotate'
      if (!this.$refs.currentUserComment) {
        this.$nextTick(() => this.$refs.currentUserComment.focus())
      }
    },
    contLikes() {
      return this.$h.dg(this.post, 'reaction_counts.like', '0')
    },
    viewPreviousComments() {
      this.getCommentsByPage(this.pageNumber)
      this.pageNumber++
    },
    async pushComment(activity) {
      this.showSkeleton = true
      const payload = {
        id: activity.id,
        type: 'comment',
        options: {
          text: this.commentData
        }
      }

      this.commentData = ''

      this.$store.dispatch('GSFeed/addReaction', payload).then(async response => {
        if (activity.props) {
          await this.$store.dispatch('GSFeed/setActionPost')
          await this.$store.dispatch('WorkOrderModule/setWorkOrder')
        } else {
          await this.$store.dispatch('GSFeed/setPreviewPost', this.post['id'])
        }
        this.showSkeleton = false
      })
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.VueCarousel-dot {
  outline: none !important;
}
.VueCarousel-slide {
  max-width: 100%;
}
.VueCarousel-slide .v-image__image {
  background-size: auto !important;
}
.VueCarousel-slide .v-responsive__content {
  max-width: 100%;
}
.VueCarousel-navigation-prev {
  left: 58px !important;
  padding-right: 13px !important;
}
.VueCarousel-navigation-next {
  right: 58px !important;
  padding-left: 13px !important;
}
.VueCarousel-navigation-prev,
.VueCarousel-navigation-next {
  border-radius: 100%;
  background: rgb(255 255 255 / 30%) !important;
  color: white !important;
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  outline: none !important;
}

.h-80 {
  height: 80vh;
}

.h-60 {
  height: 60vh;
}

.w-80 {
  width: 80vw;
}

.overflow-scroll {
  overflow-y: auto;
}
</style>

<template>
  <v-container
    class="px-0 py-0 rounded-lg w-full"
    :class="recordView ? '' : 'mb-8'"
  >
    <tasks-list
      v-if="actionPost.length > 0"
      :tasks="actionPost"
    />
    <post-item
      v-for="(item, index) of timeline.filter((e, i) => i < currentIndex)"
      :key="index"
      :data="item"
    />
    <infinite-loading
      :identifier="timeline"
      infinite-scroll-disabled="busy"
      @infinite="infiniteHandler"
    >
      <div slot="spinner" />
      <div slot="no-more" />
      <div slot="no-results" />
    </infinite-loading>
  </v-container>
</template>

<script>
import PostItem from './PostItem'
import TasksList from '@/views/Home/ActionCenter/TasksList.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PostsList',
  components: {
    PostItem,
    TasksList
  },
  props: {
    external: {
      type: Boolean,
      default: false
    },
    recordView: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    busy: false,
    currentIndex: 0
  }),
  computed: {
    ...mapGetters('SocialNetworkModule', ['get_filter_data']),
    ...mapGetters('GSFeed', {
      actionPost: 'getActionPost',
      feedNotification: 'getFeedNotification',
      timeline: 'getTimeline',
      feed: 'getFeed'
    }),
    ...mapGetters('Auth', { user: 'getUser' })
  },
  watch: {
    actionPost() {
      window.scrollTo(0, 0)
    }
  },
  async mounted() {
    if (!this.external) {
      this.set_user_data()
      this.set_posts_data()
      await this.$store.dispatch('GSFeed/cleanFeed')
      await this.$store.dispatch('GSFeed/retrieveFeed')

      this.feed.subscribe(async data => {
        if (data.new) {
          await this.$store.dispatch('GSFeed/retrieveFeed')
        }
      })
    }

    this.feedNotification.get().then(() => {})
    this.feedNotification.subscribe(data => {
      if (data.new.length > 0) {
        const newReaction = data.new[0]['object']
        const objectIndex = this.timeline.indexOf(this.timeline.filter(e => e.id === newReaction['id'])[0])

        if (this.timeline[objectIndex].reaction_counts.like === 0) {
          this.timeline[objectIndex]['own_reactions']['like'] = []
        }
        this.timeline[objectIndex]['own_reactions']['like'].push(newReaction)
        this.timeline[objectIndex].reaction_counts.like++
      }
      if (data.deleted.length > 0) {
        // Empty
      }
    })
  },
  methods: {
    ...mapActions('SocialNetworkModule', ['set_posts_data']),
    ...mapActions(['set_user_data']),
    ...mapActions('GeneralListModule', {
      recordData: 'push_data_to_active'
    }),
    ...mapActions('InfoModule', {
      changeDrawer: 'change_preview_navigation_drawer'
    }),
    infiniteHandler($state) {
      this.busy = true
      setTimeout(() => {
        if (this.currentIndex < this.timeline.length) {
          this.currentIndex++
          $state.loaded()
        } else {
          $state.complete()
        }
        this.busy = false
      }, 100)
    },
    successCallback: () => true,
    failCallback: () => false,
    setRecord(record) {
      record['app_prefix'] = record.app.prefix
      record['app_type'] = record.app['app_type']
      this.recordData(record)
      this.changeDrawer(true)
    }
  }
}
</script>

<style>
</style>

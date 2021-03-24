<template>
  <v-row align="center" class="h-sidepanel mt-10">
    <v-col cols="3">
      <v-calendar
        ref="week"
        v-model="calendarValue"
        class="dont-show-scroll w-full"
        :events="calendarEvents"
        interval-height="10px"
        is-expanded
        type="day"
      />
    </v-col>
    <v-col cols="9">
      <action-feed-calendar :is-modal="false" />
    </v-col>
  </v-row>
</template>

<script>
import ActionFeedCalendar from '@/views/Home/ActionCenter/ActionFeedCalendar'
import { mapGetters } from 'vuex'

export default {
  name: 'Calendar',
  components: {
    ActionFeedCalendar
  },
  data: () => ({
    searchInput: '',
    calendarValue: '',
    calendarColors: [
      'blue',
      'indigo',
      'deep-purple',
      'cyan',
      'green',
      'orange',
      'grey darken-1'
    ]
  }),
  computed: {
    ...mapGetters('WorkOrderModule', {
      actFeed: 'getActionFeed'
    }),
    calendarEvents() {
      const feeds = this.actFeed.filter(notification => {
        if (typeof notification.post.actor.data === 'object') {
          return notification.post.actor.data.name.toUpperCase().trim().indexOf(this.searchInput.toUpperCase().trim()) !== -1
          || notification.description.toUpperCase().trim().indexOf(this.searchInput.toUpperCase().trim()) !== -1
        }

        return notification.description.toUpperCase().trim().indexOf(this.searchInput.toUpperCase().trim()) !== -1
      })

      const events = []
      feeds.map(row => {
        events.push({
          id: row.id,
          action: row,
          post: row.post,
          name: row.title,
          start: row.start_date,
          end: row.due_date,
          color: this.genEventColor(),
          timed: false
        })
      })
      return events
    }
  },
  methods: {
    genEventColor() {
      return this.calendarColors[this.rnd(0, this.calendarColors.length - 1)]
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    }
  }
}
</script>

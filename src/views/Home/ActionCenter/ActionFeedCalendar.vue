<template>
  <v-card
    class="rounded-lg"
    :min-height="isModal ? '550px' : ''"
  >
    <v-card-title>
      <v-toolbar
        flat
      >
        <v-btn
          class="mr-4"
          color="grey darken-2"
          outlined
          @click="setToday"
        >
          Today
        </v-btn>
        <v-btn
          color="grey darken-2"
          fab
          small
          text
          @click="prev"
        >
          <v-icon small>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-btn
          color="grey darken-2"
          fab
          small
          text
          @click="next"
        >
          <v-icon small>
            mdi-chevron-right
          </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-spacer />
        <v-menu
          bottom
          right
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              color="grey darken-2"
              outlined
              v-on="on"
            >
              <span>{{ calendarTypeToLabel[calendarType] }}</span>
              <v-icon right>
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="calendarType = 'day'">
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item>
            <v-list-item @click="calendarType = 'week'">
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item>
            <v-list-item @click="calendarType = 'month'">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
            <v-list-item @click="calendarType = '4day'">
              <v-list-item-title>4 days</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <v-row
        align="center"
        class="dont-show-scroll h-500 w-full"
        no-gutters
      >
        <v-calendar
          ref="calendar"
          v-model="calendarValue"
          class="w-full"
          color="blue-m6connect"
          :event-color="getEventColor"
          :event-overlap-threshold="30"
          :events="calendarEvents"
          interval-height="10px"
          is-expanded
          :type="calendarType"
          @click:event="changeEvet"
        />
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        v-if="isModal"
        color="blue darken-1"
        text
        @click="$emit('cancel')"
      >
        Close
      </v-btn>
      <add-action-btn v-else />
    </v-card-actions>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <display-action-event
        :day-events="event"
        :event-index="eventIndex"
        :events="calendarEvents"
        @close="dialog=false"
        @update-psition="eventIndex=$event"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import DisplayActionEvent from '../DisplayActionEvent'
import AddActionBtn from '@/components/Home/TopNav/AddActionBtn.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'ActionFeedCalendar',
  components: {
    DisplayActionEvent,
    AddActionBtn
  },
  props: {
    searchInput: {
      default: '',
      type: String
    },
    isModal: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    calendarColors: [
      'blue',
      'indigo',
      'deep-purple',
      'cyan',
      'green',
      'orange',
      'grey darken-1'
    ],
    calendarType: 'month',
    calendarTypes: ['month', 'week', 'day', '4day'],
    calendarTypeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days'
    },
    calendarValue: '',
    dialog: false,
    event: {},
    eventIndex: 0,
    modal: false
  }),
  computed: {
    ...mapGetters('WorkOrderModule', {
      actFeed: 'getActionFeed',
      filterTag: 'getFilter'
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
    getEventColor(event) {
      return event.color
    },
    genEventColor() {
      return this.calendarColors[this.rnd(0, this.calendarColors.length - 1)]
    },
    changeEvet(event) {
      const events = this.calendarEvents.filter(
        d => d.start === event['day']['date'] ||
        d.end.split(' ')[0] === event['day']['date']
      )
      this.event = {
        events: events,
        day: {
          value: event['day']['date'],
          weekday: event['day']['weekday']
        },
        monthData: this.$refs.calendar._data,
        week: event['day']['week'].map(r => r.date)
      }

      this.eventIndex = events.indexOf(event['event'])
      this.dialog = true
    },
    setToday() {
      this.calendarValue = ''
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    }
  }
}
</script>

<style lang="scss">
.blue-m6connect {
  background-color: #303FE1 !important;
  color: #fff !important;
}
.h-500 {
  min-height: 450px;
}
</style>

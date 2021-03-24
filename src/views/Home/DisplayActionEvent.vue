<!-- eslint-disable vue/v-on-function-call -->
<template>
  <v-card>
    <div v-if="dayEvents['events'].length > 0">
      <v-card-title :class="currentEvent['color']">
        <p class="ma-0 pa-0 white--text">
          {{ currentEvent['name'] }}
        </p>
        <v-spacer />
        <add-feed
          :action="currentEvent.action"
          :is-add="false"
        >
          <v-btn
            slot="btn"
            icon
            @click="modal = 'app-builder'"
          >
            <v-icon
              class="white--text"
            >
              mdi-pencil
            </v-icon>
          </v-btn>
        </add-feed>
      </v-card-title>
      <v-card-text class="mt-3">
        <v-row
          align="center"
          no-gutters
        >
          <v-col cols="1">
            <v-btn
              :disabled="ind === 0 ? true : false"
              icon
              @click="changeDailyEvent(ind-1)"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="10">
            <post-item
              :data="currentEvent['post']"
            />
          </v-col>
          <v-col cols="1">
            <v-btn
              :disabled="ind === dayEvents.events.length - 1 ? true : false"
              icon
              @click="changeDailyEvent(ind+1)"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </div>
    <div v-else>
      <v-card-title :class="currentEvent['color']">
        <p class="ma-0 pa-0 white--text">
          {{ currentEvent['name'] }}
        </p>
      </v-card-title>
      <v-card-text class="mt-3">
        <p>Don't exist Events yet :DD</p>
      </v-card-text>
    </div>
    <v-card-actions>
      <v-row
        align="center"
        no-gutters
      >
        <v-col cols="1">
          <v-btn
            color="grey darken-2"
            fab
            small
            text
            @click="$refs.modalCalendar.prev()"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
        </v-col>
        <v-col
          cols="10"
        >
          <v-calendar
            ref="modalCalendar"
            v-model="calendarValue"
            class="calendar-display"
            color="blue-m6connect"
            :event-color="getEventColor"
            :event-overlap-threshold="30"
            :events="events"
            type="week"
            :weekdays="[1, 2, 3, 4, 5]"
            @click:event="changeEvet"
          />
        </v-col>
        <v-col cols="1">
          <v-btn
            color="grey darken-2"
            fab
            small
            text
            @click="$refs.modalCalendar.next()"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
        </v-col>
        <v-col
          class="my-4 text-end"
          cols="12"
          @click="$emit('close')"
        >
          <v-btn
            :color="`${currentEvent['color']} darken-1 `"
            outlined
          >
            Close
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import AddFeed from './ActionCenter/AddFeed'
import PostItem from '@/components/Home/SocialMedia/PostItem.vue'

export default {
  name: 'DisplayActionEvent',
  components: {
    AddFeed,
    PostItem
  },
  props: {
    dayEvents: {
      type: Object,
      default: () => {}
    },
    events: {
      type: Array,
      default: () => []
    },
    eventIndex: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    calendarValue: '',
    currentEvent: {},
    ind: 0
  }),
  watch: {
    dayEvents(newVal) {
      this.ind = this.eventIndex
      this.currentEvent = newVal['events'][this.ind]
      this.calendarValue = this.currentEvent.start
    }
  },
  created() {
    this.ind = this.eventIndex
    this.currentEvent = this.dayEvents['events'][this.ind]
    this.calendarValue = this.currentEvent.start
  },
  methods: {
    print(day) {
      this.ind = 0
      this.dayEvents['events'] = this.events.filter(d => d.start === day)
      this.currentEvent = this.dayEvents['events'][this.ind]
    },
    getEventColor(event) {
      return event.color
    },
    changeDailyEvent(position) {
      this.ind = position
      this.currentEvent = this.dayEvents['events'][this.ind]
    },
    changeEvet(event) {
      this.dayEvents['events'] = this.events.filter(d => d.start === event.day.date)
      if (this.dayEvents['events'].length === 0) {
        this.dayEvents['events'].push(event.event)
      }

      this.ind = this.dayEvents['events'].indexOf(event.event)
      this.currentEvent = this.dayEvents['events'][this.ind]
      this.calendarValue = this.currentEvent.start
    }
  }
}
</script>

<style lang="scss">
.m6-color {
  background-color: #0247FE;
}
.calendar-display{
  .v-calendar-daily__body, .v-calendar-daily__intervals-head {
    display: none;
  }
}
</style>

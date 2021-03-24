<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <div
    v-if="!loading"
    class="actionfeed dont-show-scroll h-sidepanel max-w-side pl-4 pr-4 transparent vertical-scroll w-full"
  >
    <div class="card-custom-shadow d-flex flex-wrap h-auto mb-3 mt-4 pa-0 px-2 relative rounded-lg white">
      <div class="align-center d-flex justify-space-between mt-2 pl-3 pr-1 w-full">
        <h4 :class=" !lightMode ? 'grey--text text--darken-2 ml-1 text-body-1 font-weight-bold' : 'white--text ml-1 text-body-1 font-weight-bold' ">
          Action Center
        </h4>
      </div>
      <v-text-field
        ref="searchInput"
        v-model="searchInput"
        class="mb-8 mt-2 search-input"
        dense
        flat
        height="40"
        hide-details
        label="Search tasks"
        rounded
        single-line
        solo
      />
    </div>
    <div class="align-stretch d-flex my-4">
      <action-date
        class="mr-1"
        :day="this.$refs.calendar ? this.$refs.calendar.days[0]['day'] : 0"
        :events="todayEvents()"
        :title="calType === 'month' ? 'Month' : 'Today'"
        @click="calType = calType === 'month' ? 'day' : 'month'"
      />

      <action-date
        class="ml-1"
        :day="this.$refs.calendar ? this.$refs.calendar.days[0]['day'] : 0"
        :events="dueEvents()"
        title="This Weeks"
      />
    </div>

    <v-card
      v-for="(val, key) in newTasks"
      :key="key"
      class="mb-5"
      elevation="2"
    >
      <action-meeting
        :title="val"
      />
    </v-card>

    <v-calendar
      ref="calendar"
      class="card-large-shadow h-auto mb-4 pa-4 rounded-xl"
      :class="calType === 'day' ? 'custom-calendar' : ''"
      color="blue-m6connect"
      :event-color="getEventColor"
      :events="calendarEvents"
      :type="calType"
      @click:date="createActivity"
      @click:event="changeEvet"
    />
    <action-feed-item
      v-for="(notification, index) in filteredNotifications.filter((e, i) => i < currentIndex)"
      :key="'notification-'+index"
      :notification="notification"
    />
    <infinite-loading
      :identifier="filteredNotifications"
      infinite-scroll-disabled="busy"
      @infinite="infiniteHandler"
    >
      <div slot="spinner" />
      <div slot="no-more" />
      <div slot="no-results" />
    </infinite-loading>

    <div v-if="filteredNotifications.length === 0">
      No results found
    </div>
  </div>
  <v-container
    v-else
    class="dont-show-scroll h-full px-4 rounded-lg text-center transparent vertical-scroll"
  >
    <v-progress-circular
      color="primary"
      indeterminate
    />
  </v-container>
</template>

<script>
import ActionFeedItem from './ActionCenter/ActionFeedItem'
import { mapActions, mapGetters } from 'vuex'
import ActionDate from './ActionCenter/ActionDate'
import ActionMeeting from './ActionCenter/ActionCardBuilder'

export default {
  name: 'ActionFeed',
  components: {
    ActionFeedItem,
    ActionDate,
    ActionMeeting
  },
  props: {
    lightMode: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    newTask: '',
    newTasks: [],
    calendarColors: [
      'blue',
      'indigo',
      'deep-purple',
      'cyan',
      'green',
      'orange',
      'grey darken-1'
    ],
    calType: 'month',
    active: false,
    busy: false,
    startDate: '',
    menu: false,
    showTooltip: false,
    currentIndex: 0,
    loading: true,
    user: {},
    showSearchInput: false,
    searchInput: '',
    label: '',
    event: {},
    eventIndex: 0,
    showActionBtns: false,
    // action feed data
    notifications: [],
    status: [],
    actionFeedCalendarModal: false
  }),
  computed: {
    ...mapGetters('Auth', { cUser: 'getUser' }),
    ...mapGetters('WorkOrderModule', {
      actFeed: 'getActionFeed',
      filterTag: 'getFilter',
      SortTag: 'getSort'
    }),
    areas() {
      return [
        {
          text: 'Everyone',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'everyone', value: 'Everyone' })
            this.workOrder()
          }
        },
        {
          text: 'My company',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'company', value: 'My company' })
            this.workOrder()
          }
        },
        {
          text: 'Records',
          type: 'title',
          function: () => {}
        },
        {
          text: 'All Apps',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'all_apps', value: 'All Apps' })
            this.workOrder()
          }
        },
        {
          text: 'ITApps',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'itapps', value: 'ITApps' })
            this.workOrder()
          }
        },
        {
          text: 'Teams',
          type: 'title',
          function: () => {}
        },
        {
          text: 'All my teams',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'all_teams', value: 'All my teams' })
            this.workOrder()
          }
        },
        {
          text: 'IT Team XY',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'it_team_xy', value: 'IT Team XY' })
            this.workOrder()
          }
        },
        {
          text: 'CPM Team Z',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'cpm_team_z', value: 'CPM Team Z' })
            this.workOrder()
          }
        },
        {
          text: 'Departments',
          type: 'title',
          function: () => {}
        },
        {
          text: 'All my departments',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({
              key: 'all_departments',
              value: 'All my departments'
            })
            this.workOrder()
          }
        },
        {
          text: 'Finances',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'finances', value: 'Finances' })
            this.workOrder()
          }
        },
        {
          text: 'Operations',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'operations', value: 'Operations' })
            this.workOrder()
          }
        }
      ]
    },
    sorts() {
      return [
        {
          text: 'Today',
          function: () => {
            this.setSortTag({ key: 'created_at', value: 'Today' })
          }
        },
        {
          text: 'All',
          function: () => {
            this.setSortTag({ key: 'all', value: 'All' })
          }
        },
        {
          text: 'Current Week',
          function: () => {
            this.setSortTag({ key: 'current_week', value: 'Current Week' })
          }
        },
        {
          text: 'From',
          function: () => {
            this.setSortTag({ key: 'start_date', value: 'From' })
          }
        },
        {
          text: 'To',
          function: () => {
            this.setSortTag({ key: 'due_date', value: 'To' })
          }
        }
      ]
    },
    filteredNotifications() {
      return this.actFeed.filter(notification => {
        if (typeof notification.post.actor.data === 'object') {
          return notification.post.actor.data.name.toUpperCase().trim().indexOf(this.searchInput.toUpperCase().trim()) !== -1
          || notification.description.toUpperCase().trim().indexOf(this.searchInput.toUpperCase().trim()) !== -1
        }

        return notification.description.toUpperCase().trim().indexOf(this.searchInput.toUpperCase().trim()) !== -1
      })
    },
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
          color: this.genEventColor(row),
          timed: false
        })
      })
      return events
    }
  },
  watch: {
    cUser: function (val) {
      this.user = val
      this.loading = true
      this.workOrder().then(() => {
        this.loading = false
      })
    },
    actFeed: function () {
      this.currentIndex = 0
    }
  },
  mounted() {
    this.setFilterTag({ key: 'everyone', value: 'Everyone' })
    this.setSortTag({ key: 'created_at', value: 'Today' })
    this.user = this.cUser
    this.select('/wo_status').then(res => {
      this.status = res.data
    })
    this.workOrder().then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions('WorkOrderModule', {
      workOrder: 'setWorkOrder',
      setFilterTag: 'setWorkFilter',
      setSortTag: 'setWorkSort'
    }),
    createActivity(event) {
      this.$store.dispatch('GSFeed/createActivity', {
        date: event.date
      })
    },
    ...mapActions('GSFeed', {
      setActPost: 'setActionPost'
    }),
    print() {},
    todayEvents() {
      if (this.$refs.calendar) {
        const todayDate = new Date(this.$refs.calendar.days[0].date).getTime()

        return this.$refs.calendar.events.filter(element => {
          const start = new Date(element.start).getTime()
          const end = new Date(element.end.substr(0, 10)).getTime()
          return (todayDate >= start && todayDate <= end)
        })
      }
      return []
    },
    dueEvents() {
      if (this.$refs.calendar) {
        return this.actFeed.filter(element =>
          new Date(element.due_date.substr(0, 10)).getTime() === new Date(this.$refs.calendar.days[0].date).getTime()
        )
      }
      return []
    },
    ...mapActions('ITAppsModule', {
      select: 'get_selects'
    }),
    setActive(label) {
      this.active = true
      this.label = label
    },
    infiniteHandler($state) {
      this.busy = true
      setTimeout(() => {
        if (this.currentIndex < this.filteredNotifications.length) {
          this.currentIndex++
          $state.loaded()
        } else {
          $state.complete()
        }
        this.busy = false
      }, 100)
    },
    addNewTask() {
      this.newTasks.unshift(this.newTask)
      this.newTask = ''
    },
    changeEvet(event) {
      this.$store.dispatch('GSFeed/setEmptyActionPost')
      this.setActPost(event.event.action)
    },
    actionFeedCalendar() {
      this.actionFeedCalendarModal = true
    },
    genEventColor(event) {
      if (event.colors) {
        let color = event.colors.replace(/'/g, '"')
        color = JSON.parse(color)
        return color.background
      } else {
        return '#262626'
      }
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    getEventColor(event) {
      return event.color
    }
  }
}
</script>

<style lang="scss">
  .card-content__tag {
    z-index: 0;
    top: 0px;
    right: 0;
    padding: 0 16px;
    height: 34px;
    border-radius: 0px 4px;
  }
  .feed-btns {
    bottom: 0;
    left: 0;
  }
  .action-btns {
    bottom: 0;
    right: 0;
  }
  .message-box {
    border-left: 2px solid grey;
  }
  // .v-calendar-daily__scroll-area {
  //   max-height: 400px;
  // }
  .v-event.white--text * {
    color: #fff !important;
  }
  .v-event{
    opacity: 0.6;
  }
  .custom-calendar{
    height:350px !important;
  }
  .v-tooltip__content {
    pointer-events: initial;
  }
  .add-input .v-input__slot{
    box-shadow: 0px 3px 6px #00000028 !important;
    border-radius: 8px !important;
  }
  .add-input .v-label{
        background: -webkit-linear-gradient( 45deg , rgba(77,223,161,1) 0%, rgba(13,167,237,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

</style>

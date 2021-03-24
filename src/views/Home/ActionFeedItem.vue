<template>
  <div
    v-if="notification['post']['actor']['data']"
    class="actionfeed-content__card card-custom-shadow mb-4 pb-12 pointer pt-4 px-3 relative rounded white"
    @click="setPost"
    @mouseleave="showActionBtns = false"
    @mouseover="showActionBtns = true"
  >
    <div
      v-if="notification.application"
      :class="notification.colorTag +' card-content__tag absolute white--text d-flex justify-center align-center text-body-1 font-weight-regular'"
    >
      {{ notification.application.prefix }}
    </div>
    <div
      v-else
      :class="notification.colorTag +' card-content__tag absolute white--text d-flex justify-center align-center text-body-1 font-weight-regular'"
    >
      {{ notification.status }}
    </div>
    <div class="d-flex">
      <v-avatar size="36">
        <v-img :src="notification.post.actor.data.image" />
      </v-avatar>
      <div class="ml-2">
        <p
          class="font-weight-bold"
          style="margin-bottom: -5px;"
        >
          {{ notification.post.actor.data.name }}
        </p>
        <v-spacer />
        <span class="grey--text leading-tight text--darken-1 text-caption">{{ diffNow(notification.post.actor.created_at) }}</span>
      </div>
    </div>
    <p
      v-if="notification.record"
      class="grey--text mb-3 ml-2 mt-2 text--darken-4 text-body-2"
    >
      {{ notification.post.message }}
    </p>
    <p
      v-else
      class="align-center black--text d-flex mb-0 message-box ml-1 pl-3 text-caption"
    >
      {{ notification.post.message }}
    </p>
    <p
      v-if="notification.record"
      :class="notification.colorTag + '--text ' + 'text-body-2 ml-1 mb-0 d-flex align-center'"
    >
      <v-icon :class="notification.colorTag + '--text ' + 'mr-1'">
        mdi-file-document-outline
      </v-icon>
      {{ notification.record.title }}
    </p>
    <div
      v-if="users.length > 0"
      class="align-center d-flex ml-2 mt-4"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{on, attr}">
          <v-badge
            v-for="(follower, index) in users"
            :key="index + 'follower'"
            :bordered="!(follower.status === 'Complete' || follower.status === 'Declined')"
            :color="follower.status === 'Complete' ? 'green accent-3' : follower.status === 'Declined' ? 'red' :'white black--text'"
            :dark="!(follower.status === 'Complete' || follower.status === 'Declined')"
            :icon="follower.status === 'Complete' ? 'mdi-check' : follower.status === 'Declined' ? 'mdi-close-circle' : 'mdi-help'"
            offset-x="12"
            offset-y="12"
            style="margin-left:-5px"
            top
          >
            <v-avatar size="28">
              <v-img
                v-if="follower.profilePic !== ''"
                :src="follower.profilePic"
              />
              <v-icon
                v-else
                color="light-blue lighten-3"
              >
                mdi-account
              </v-icon>
            </v-avatar>
          </v-badge>
        </template>
        <span />
      </v-tooltip>
      <p
        v-if="pendingApprovals(users) > 0"
        class="grey--text mb-0 ml-2 text--darken-1 text-caption"
      >
        {{ pendingApprovals(users) }} pending
      </p>
    </div>
    <div class="absolute align-center d-flex feed-btns pa-3 text-caption">
      <p class="mb-0 mr-2">
        <v-icon size="17">
          mdi-thumb-up-outline
        </v-icon> {{ cont('like') }}
      </p>
      <p class="mb-0 mr-2">
        <v-icon size="17">
          mdi-message-outline
        </v-icon> {{ cont('comment') }}
      </p>
    </div>
    <div
      v-if="showActionBtns"
      class="absolute action-btns align-center d-flex pa-3 text-caption"
    >
      <v-btn
        color="grey"
        icon
        @click="updateStatus(false)"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-btn
        color="green accent-3"
        icon
        @click="updateStatus(true )"
      >
        <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
      </v-btn>
    </div>
  </div>
  <v-container v-else>
    <v-progress-circular
      color="primary"
      indeterminate
      style="margin-left: 45%;"
    />
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ActionFeedItem',
  props: {
    notification: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    showActionBtns: false,
    colors: [
      'green',
      'blue',
      'red',
      'purple',
      'orange',
      'pink',
      'brown',
      'light-blue',
      'cyan',
      'teal',
      'amber'
    ],
    users: []
  }),
  computed: {
  },
  watch: {
    notification: function (val) {
      if (!this.notification['post']['actor']['data']) {
        this.notification['post']['actor'] = JSON.parse(this.notification['post']['actor'])
      }
      this.notification['colorTag'] = this.getColorTag()

      if (val.wo_assignments && val.wo_assignments.length > 0) {
        const localUsers = []
        val.wo_assignments.forEach(assign => {
          localUsers.push(assign.assignee)
        })

        this.getUsers(localUsers).then(res => {
          this.users = res.data
        })
      }
    }
  },
  created() {
    if (!this.notification['post']['actor']['data']) {
      this.notification['post']['actor'] = JSON.parse(this.notification['post']['actor'])
    }
    this.notification['colorTag'] = this.getColorTag()
  },
  mounted() {
    if (!this.notification['post']['actor']['data']) {
      this.notification['post']['actor'] = JSON.parse(this.notification['post']['actor'])
    }

    if (this.notification.wo_assignments && this.notification.wo_assignments.length > 0) {
      const localUsers = []
      this.notification.wo_assignments.forEach(assign => {
        this.users.push({
          status: assign.status,
          actionId: assign.id
        })
        localUsers.push(assign.assignee)
      })

      this.getUsers(localUsers).then(res => {
        res.data.forEach((user, ind) => {
          const info = [user, this.users[ind]]
          this.users[ind] = Object.assign(...info)
        })
      })
    }
  },
  methods: {
    ...mapActions('WorkOrderModule', {
      workOrder: 'setWorkOrder',
      getUsers: 'getUsersList'
    }),
    ...mapActions('InfoModule', {
      changeDrawer: 'change_preview_navigation_drawer'
    }),
    ...mapActions('GSFeed', {
      setActPost: 'setActionPost'
    }),
    ...mapActions('GeneralListModule', { recordData: 'push_data_to_active' }),
    updateStatus(e) {
      this.$store.dispatch('WorkOrderModule/updateActionItem', {
        items: this.notification['wo_assignments'],
        value: e ? 'Complete' : 'Declined'
      }).then(() => {
        this.workOrder()
      })
    },
    setPost() {
      const { record, colorTag, id } = this.notification
      const props = {
        id: id,
        record: record,
        colorTag: colorTag,
        wo_assignments: this.users
      }

      if (this.notification.type && this.notification.type.fields) {
        props.fields = this.notification.type.fields
      }

      this.setActPost({
        room: 'work_order',
        id: this.notification.post_id,
        props
      })
    },
    diffNow(date) {
      const dateNow = new Date()
      const dateNotification = new Date(date)
      let diff = (dateNow.getTime() - dateNotification.getTime()) / 1000
      const seconds = Math.abs(Math.floor(diff % 60))
      diff = (diff - seconds) / 60
      const minutes = Math.abs(Math.floor(diff % 60))
      diff = (diff - minutes) / 60
      const hours = Math.abs(Math.floor(diff % 24))
      diff = (diff - hours) / 24
      const days = Math.abs(Math.floor(diff % 30))
      return days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds'
    },
    pendingApprovals(approvals) {
      let pendingApprovals = 0
      approvals.forEach(element => {
        if (element.status === 'Pending') pendingApprovals++
      })

      return pendingApprovals
    },
    cont(item) {
      return this.$h.dg(this.notification.post, `reaction_counts.${item}`, '0')
    },
    getColorTag() {
      return this.colors[Math.floor(Math.random() * 10)]
    }
  }
}
</script>

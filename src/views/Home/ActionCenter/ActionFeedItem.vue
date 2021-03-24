<template>
  <div
    v-if="notification['post']['actor']['data']"
    class="actionfeed-content__card card-custom-shadow mb-4 pb-6 pointer relative rounded-lg white"
    @click="setPost"
    @mouseleave="showActionBtns = false"
    @mouseover="showActionBtns = true"
  >
    <div
      class="badge rounded-tl-lg"
      :style="`background-color:${getColors(notification).background};`"
    >
      <img
        color="green"
        src="@/assets/actioncenterIcons/Tasks.svg"
      >
      <p
        v-if="notification.record"
        class="align-center d-flex mb-0 ml-1 text-body-2"
        :style="`color:${getColors(notification).text};`"
      >
        <v-icon :class="notification.colorTag + '--text ' + 'mr-1'">
          mdi-file-document-outline
        </v-icon>
        {{ notification.record.title }}
      </p>
      <p
        v-else
        :style="`color:${getColors(notification).text};`"
      >
        {{ notification.post.actor.data.name }}
      </p>
    </div>
    <div class="badge-right rounded-r-lg" />
    <div>
      <div class="inline-flex w-2__5">
        <div class="pl-3 size-12">
          <p class="block mb-0">
            Primary
          </p>
          <v-img
            v-if="notification.post.actor.data.image"
            src="notification.post.actor.data.image"
          />
          <v-icon v-else>
            mdi-account
          </v-icon>
          <br>
          <p class="block mb-0">
            Resources
          </p>
          <v-img
            v-if="notification.post.actor.data.image"
            src="notification.post.actor.data.image"
          />
          <v-icon v-else>
            mdi-account
          </v-icon>
          <v-img
            v-if="notification.post.actor.data.image"
            src="notification.post.actor.data.image"
          />
          <v-icon v-else>
            mdi-account
          </v-icon>
        </div>
      </div>
      <div class="inline-flex w-3__5">
        <div class="size-12 w-right">
          <div class="collapse w-full">
            <p
              v-if="notification.record"
              class="grey--text mb-3 ml-2 mt-2 text--darken-4 text-body-2"
            >
              {{ notification.description }}
            </p>
            <p
              v-else
              class="black--text d-flex mb-0 text-caption"
            >
              {{ notification.description }}
            </p>
          </div>
          <v-row
            v-for="(item, index) in dates"
            :key="index"
            class="ma-0 pa-0"
            no-gutters
          >
            <v-col>
              <p class="bold-emphasis mb-0">
                {{ item.name }}:
                <span class="normal">{{ item.value }}</span>
              </p>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
    <v-dialog
      v-model="showConfirmDialog"
      max-width="350"
      persistent
    >
      <confirm-dialog
        :cancel-label="`Cancel`"
        :message="confirmMessage"
        :ok-label="`OK`"
        @closeDeleteModal="$event ? updateStatus(confirmStatus) : showConfirmDialog = false"
      />
    </v-dialog>
  </div>
  <v-container
    v-else
    class="rounded-lg"
  >
    <v-progress-circular
      color="primary"
      indeterminate
      style="margin-left: 45%;"
    />
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import ConfirmDialog from '@/components/Dialogs/ConfirmDialog'
export default {
  name: 'ActionFeedItem',
  components: {
    ConfirmDialog
  },
  props: {
    notification: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    showActionBtns: false,
    showConfirmDialog: false,
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
    users: [],
    timerBallColor: [
      '#C62828',
      '#EF6C00',
      '#F9A825',
      '#2E7D32',
      '#1565C0',
      '#6A1B9A'
    ],
    modal: '',
    confirmMessage: '',
    confirmStatus: false,
    dates: [
      {
        name: 'Due by',
        value: 'February 17, 2021 10:30 pm cst'
      },
      {
        name: 'Location',
        value: 'Skype'
      }
    ]
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
        if (res.data.length) {
          res.data.forEach((user, ind) => {
            const info = [user, this.users[ind]]
            this.users[ind] = Object.assign(...info)
          })
        }
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
    getColors(value) {
      if (value.colors) {
        let color = value.colors.replace(/'/g, '"')
        color = JSON.parse(color)
        return color
      } else {
        return {
          background: '#F0F2F5',
          text: '#000'
        }
      }
    },
    updateStatus(e) {
      this.$store.dispatch('WorkOrderModule/updateActionItem', {
        items: this.notification['wo_assignments'],
        value: e ? 'Complete' : 'Declined'
      }).then(() => {
        this.workOrder()
        this.showConfirmDialog = false
      }).catch(() => {
        this.showConfirmDialog = false
      })
    },
    declineAction() {
      this.showConfirmDialog = true
      this.confirmMessage = 'Do you want to decline this action?'
      this.confirmStatus = false
    },
    completeAction() {
      this.showConfirmDialog = true
      this.confirmMessage = 'Do you want to complete this action?'
      this.confirmStatus = true
    },
    setPost() {
      this.$store.dispatch('GSFeed/setEmptyActionPost')
      this.setActPost(this.notification)
    },
    diffNow(date) {
      const dateNow = new Date()
      const dateNotification = new Date(date)
      dateNotification.setDate(dateNotification.getDate() + 1)
      dateNotification.setHours(24, 0, 0, 0)
      let dueMessage = ''
      let firstDate = dateNow
      let secondDate = dateNotification
      if (dateNow > dateNotification) {
        dueMessage = ' due'
        firstDate = dateNotification
        secondDate = dateNow
      }
      let diff = (secondDate.getTime() - firstDate.getTime()) / 1000
      const seconds = Math.abs(Math.floor(diff % 60))
      diff = (diff - seconds) / 60
      const minutes = Math.abs(Math.floor(diff % 60))
      diff = (diff - minutes) / 60
      const hours = Math.abs(Math.floor(diff % 24))
      diff = (diff - hours) / 24
      const days = Math.abs(Math.floor(diff % 30))
      return days + ' days, ' + hours + ' hours, ' + minutes + ' min' + dueMessage
    },
    dueDateColor(date) {
      const dateNow = new Date()
      const dueDate = new Date(date)
      const diff = (dueDate.getTime() - dateNow.getTime()) / (1000 * 24 * 3600)
      const index = diff > 5 ? 5 : (diff < 0 ? 0 : Math.ceil(diff))
      return this.timerBallColor[index]
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

<style scoped>
  .badge{
    height: 40px;
    margin-right: 10px;
  }
  .badge img{
    top: 6px;
    left: 6px;
    width: 25px;
    position: absolute;
  }
  .badge p{
    color: white;
    padding: 0.5rem;
    margin-left: 3rem;
  }
  .badge-right{
    width: 10px;
    float: right;
    height: 100%;
    position: absolute;
    background: rgb(255, 99, 99);
    right: 0px;
    top: 0;
  }
  .collapse{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .text-badge{
    width: 17rem;
  }
  .v-input {
        font-size: 11px;
        height: 30px;

    }
    .v-text-field{
      width: 140px;
    }
    .row-name{
        color: black;
        font-weight: 500;
    }
  .w-right{
    width: 95%;
  }
</style>

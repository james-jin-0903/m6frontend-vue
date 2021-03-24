<template>
  <v-container class="mx-0 px-0">
    <v-card
      v-for="(task, index) in apiTasks"
      :key="'t-ind-'+index"
      class="mb-4"
    >
      <div class="pt-2 red" />
      <v-btn
        absolute
        class="delete-task"
        dark
        icon
        right
        :style="`${isOver? 'display:block' : 'display:none'}`"
        @click="deleteTask(index)"
      >
        <v-icon>
          mdi-delete
        </v-icon>
      </v-btn>
      <v-card-title
        class="group-in-border-style ma-0 py-0 w-full"
        :style="`background-color:${getColors(task).background};`"
      >
        <v-img
          class="badge-img-align mr-5"
          max-width="30"
          src="@/assets/actioncenterIcons/Tasks.svg"
        />
        <span
          class="display:inline;"
          :style="`color:${getColors(task).text};`"
        >
          {{ task.title }}
        </span>
        <v-spacer />
        <div
          class="ma-0 scroll-container text-right"
          :style="`width: 200px; height: 45px; overflow-y: hidden !important; margin-right: 25px; ${users[index] && users[index].users.length ? ' top: -4px;' : 'top:5px'}`"
        >
          <div
            v-if="users[index] && users[index].users.length"
            class="badge-scroll horizontal-scroll ma-0 messages-container text-right"
          >
            <v-avatar
              v-for="(item, inAssign) in users[index].users"
              :key="inAssign"
              class="avatar d-inline-block mx-0 px-0 title-position"
              size="40"
            >
              <v-img
                v-if="item.avatar !== ''"
                class="avatar-position d-inline-block mx-0 rounded-xl"
                max-height="30"
                max-width="30"
                :src="item.avatar"
              />
              <v-icon
                v-else
                class="icon-profile profile-icon-position"
                color="#f1f1f1"
                size="30"
              >
                mdi-account
              </v-icon>
            </v-avatar>
          </div>
          <span
            v-else
            class="blue--text pointer text-subtitle-1"
          >
            Select colleagues
          </span>
        </div>
        <v-btn
          class="edit-btn"
          icon
          @click="updating=!updating"
          @mouseleave="changeHover(false)"
          @mouseover="changeHover(true)"
        >
          <v-icon v-if="!updating">
            mdi-pencil
          </v-icon>
          <v-icon v-else>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="mt-5">
        <v-row>
          <v-col cols="6">
            <p class="font-weight-bold ma-0 text-body-1">
              Description
            </p>
            <v-spacer />
            <p
              v-if="!updating"
              class="ma-0 text-body-1"
            >
              {{ task.description }}
            </p>
            <v-textarea
              v-else
              v-model="task.description"
              class="ma-0 pa-0"
              rows="5"
            />
          </v-col>
          <v-col cols="6">
            <p
              v-if="!updating"
              class="font-weight-bold ma-0 text-body-1"
            >
              Date: <span class="font-weight-regular">{{ getDate(task.due_date, 'date') }}</span>
            </p>
            <date-picker
              v-else
              v-model="date"
              label="Date"
              :value="task.due_date"
              @input="changeDate($event, task)"
            />
            <!--
            <v-text-field
              v-model="task.date"
              label="Date"
            />-->
            <v-spacer />
            <p
              v-if="!updating"
              class="font-weight-bold ma-0 text-body-1"
            >
              Time: <span class="font-weight-regular">{{ getDate(task.due_date, 'time') }}</span>
            </p>
            <v-menu
              v-else
              ref="time_piker"
              v-model="timePicker"
              :close-on-content-click="false"
              max-width="290px"
              min-width="290px"
              :nudge-right="40"
              offset-y
              :return-value.sync="time"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="time"
                  v-bind="attrs"
                  label="Time"
                  readonly
                  type="text"
                  v-on="on"
                />
              </template>
              <v-time-picker
                v-if="timePicker"
                v-model="time"
                class="time-picker"
                full-width

                @click:minute="$refs.time_piker[index].save(time)"
                @update:period="updatePeriod"
              />
            </v-menu>
            <v-spacer />
            <p
              v-if="!updating"
              class="font-weight-bold ma-0 text-body-1"
            >
              Location: <span class="font-weight-regular">{{ task.location ? task.location : "Don't especcificated" }}</span>
            </p>
            <v-text-field
              v-else
              v-model="task.location"
              label="Location"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="updating"
          block
          :color="getColors(task).background"
          @click="print(task)"
        >
          <span
            :style="`color:${getColors(task).text};`"
          >
            Update
          </span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import DatePicker from '@/components/AppBuilder/Form/Components/DatePicker'
export default {
  name: 'TasksList',
  components: {
    DatePicker
  },
  props: {
    tasks: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    apiTasks: [],
    colors: {},
    users: [],
    updating: false,
    date: null,
    time: null,
    timePicker: false,
    dataTask: [],
    isOver: false
  }),
  watch: {
    tasks(value) {
      this.getTasks(value).then(res => {
        this.users = []
        res.map(async item => {
          const assignee = item.wo_assignments.map(assignee => assignee.assignee)
          const resUsers = await this.getUsers(assignee)

          this.users.push({ users: resUsers.data.users })
        })

        this.apiTasks = res.map(task => ({
          ...task,
          date: this.getDate(task.due_date, 'date'),
          time: this.getDate(task.due_date, 'time')
        }))
      })
    }
  },
  mounted() {
    // this.task.date = this.getDate(this.task.due_date, 'date')
    this.getTasks(this.tasks).then(res => {
      this.users = []
      res.map(async item => {
        const assignee = item.wo_assignments.map(assignee => assignee.assignee)
        const resUsers = await this.getUsers(assignee)

        this.users.push({ users: resUsers.data.users })
      })
      this.apiTasks = res.map(task => ({
        ...task,
        date: this.getDate(task.due_date, 'date'),
        time: this.getDate(task.due_date, 'time')
      }))
    })
  },
  methods: {
    ...mapActions('WorkActivity', {
      getTasks: 'getTasksByIds'
    }),
    ...mapActions('WorkOrderModule', {
      getUsers: 'getUsersList'
    }),
    print(event) {
      event.due_date = `${this.date} ${this.time}`
    },
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
    deleteTask(index) {
      this.apiTasks.splice(index, 1)
    },
    updatePeriod(period) {
      this.time = `${this.time} ${period}`
    },
    getDate(date, type) {
      const res = new Date(date)

      if (type === 'time') {
        let hours = res.getHours()
        const AmOrPm = hours >= 12 ? 'pm' : 'am'
        hours = (hours % 12) || 12
        const minutes = res.getMinutes()
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${AmOrPm}`
      } else {
        return res.toString().substring(0, 16)
      }
    },
    changeHover(val) {
      this.isOver = val
    }
  }
}
</script>

<style>
.showPencil{
  display: none;
}
.input-position{
  margin-top: 0 !important;
}
.badge-img-align{
    top: 0px;
}
.avatar-position{
  top: 10px;
}
.profile-icon-position{
  top: 4px;
}
.badge-scroll{

}
.badge-scroll::-webkit-scrollbar{
     scrollbar-color: transparent !important;
      height: 5px !important;
}
.badge-scroll::-webkit-scrollbar-track{
    background: transparent !important;
    border: none !important;
    border-radius: 0px !important;
}
.badge-scroll::-webkit-scrollbar-thumb:horizontal{
  background: rgb(250, 250, 250) !important;
  border-radius: 0px !important;
  border: none !important;

}
.scroll-container{
  overflow: overlay !important;
  white-space: nowrap !important;
  position: relative;
  top: -10px;
}
.delete-task{
     top: -10px !important;
    right: -10px !important;
    background: #252525bd !important;
    width: 25px !important;
    height: 25px !important;
    transition: 1s;
  }
  .delete-task .mdi-close::before{
  font-weight: 900 !important;
  color: white !important;
  font-size: 20px !important;
}
.time-picker .v-time-picker-title{
  color:white !important;
}

</style>

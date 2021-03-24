<template>
  <v-card
    class="rounded-lg"
    scrollable
  >
    <v-card-title
      class="pa-0"
      primary-title
    >
      <v-container
        class="rounded-lg"
        fluid
        grid-list-md
      >
        <v-row
          align="center"
        >
          <v-spacer />
          <v-col
            class="text-center title"
            cols="12"
            md="9"
          >
            <h3>{{ taskNumber }} {{ task.title }}</h3>
          </v-col>
          <v-spacer />
          <v-btn
            icon
            small
            @click="deleteTaskConfirm"
          >
            <v-icon color="red">
              mdi-delete
            </v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text class="vertical-scroll">
      <v-container
        class="pa-0 rounded-lg"
        grid-list-md
      >
        <v-row>
          <v-col
            cols="12"
            md="12"
          >
            <slot name="body">
              <v-row>
                <v-col
                  cols="12"
                  md="1"
                >
                  <v-icon>mdi-text-box-outline</v-icon>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <h4 class="margin-top-20 title">
                    {{ $tc('general.detail', 2) }}
                  </h4>
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                >
                  <a
                    class="action-link"
                    href="#"
                    @click.prevent="expandAll"
                  >{{ $t('general.showAll') }}</a>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <a
                    class="action-link"
                    href="#"
                    @click.prevent="showGeneralDetails = !showGeneralDetails"
                  >{{ $t('general.show') }} / {{ $tc('general.hideDetail', 2) }}</a>
                </v-col>
              </v-row>
              <transition name="router-anim">
                <div
                  v-if="showGeneralDetails"
                  class="generalDetails"
                >
                  <div class="row">
                    <div class="col-sm-11 col-sm-offset-1">
                      <v-text-field
                        v-model="task.title"
                        color="blue"
                        :label="$tc('general.title', 1)"
                        @focus="noFirstTime"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-11 col-sm-offset-1">
                      <v-textarea
                        v-model="task.description"
                        color="blue"
                        :label="$t('general.description')"
                        rows="2"
                        @focus="noFirstTime"
                      />
                    </div>
                  </div>

                  <!--v-if="appLabel.firebaseCollection === 'cpm_projects'"-->
                  <div
                    class="mt-2 row"
                  >
                    <div class="col-sm-3 col-sm-offset-1">
                      <v-text-field
                        v-model="task.budgetPercentage"
                        class="input-right"
                        :label="$t('cpm.budgetPercentage')"
                        suffix="%"
                      />
                    </div>
                    <div class="col-sm-7 col-sm-offset-1">
                      <v-text-field
                        v-model="calculateBudget"
                        disabled
                        :hint="$t('cpm.calculatedBudgetHint')"
                        :label="$t('cpm.calculatedBudget')"
                        persistent-hint
                      />
                    </div>
                  </div>

                  <v-row>
                    <v-col
                      cols="12"
                      md="5"
                    >
                      <v-menu
                        bottom
                        offset-y
                        open-on-hover
                      >
                        <template v-slot:activator="{ on }">
                          <span style="color: #AAA">{{ $t('general.status') }}:</span>
                          <span
                            style="cursor:pointer;"
                            v-on="on"
                          >{{ task.status }}</span>
                        </template>
                        <v-list>
                          <v-list-tile>
                            <v-list-tile-title
                              style="cursor:pointer;"
                              @click.prevent="task.status = 'In Progress'"
                            >
                              {{ $t('cpm.inProgress') }}
                            </v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-title
                              style="cursor:pointer;"
                              @click.prevent="task.status = 'Scheduled'"
                            >
                              {{ $t('cpm.scheduled') }}
                            </v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-title
                              style="cursor:pointer;"
                              @click.prevent="task.status = 'Complete'"
                            >
                              {{ $t('general.complete') }}
                            </v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col md="12">
                      <budget-category-select
                        :category="
                          $h.dg(task, 'budgetCategories', [])
                        "
                        multiple
                        @newCategory="setBudgetCategory"
                      />
                    </v-col>
                  </v-row>
                </div>
              </transition>
              <!--SCHEDULE-->

              <v-divider class="mb-4 mt-4 xs12" />
              <v-row>
                <v-col
                  cols="12"
                  md="1"
                >
                  <v-icon>mdi-calendar</v-icon>
                </v-col>
                <v-col
                  cols="12"
                  md="11"
                >
                  <v-row>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <h4 class="title">
                        {{ $t('general.calendar') }}
                      </h4>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-checkbox
                        v-model="task.in_schedule"
                        color="blue"
                        :label="$t('cpm.inSchedule')"
                        style="margin-top: 0; padding-top: 0"
                      />
                    </v-col>
                    <v-col
                      class="text-right"
                      cols="12"
                      md="4"
                    >
                      <a
                        class="action-link"
                        href="#"
                        @click.prevent="showCalendarDetails = !showCalendarDetails"
                      >
                        {{ $t('general.show') }}/{{ $tc('general.hideDetail', 2) }}
                      </a>
                    </v-col>
                  </v-row>
                  <transition name="router-anim">
                    <div v-show="showCalendarDetails">
                      <v-row>
                        <v-col
                          cols="12"
                          md="4"
                        >
                          <v-menu
                            ref="menuStartDate"
                            v-model="startDatePicker"
                            :close-on-content-click="false"
                            full-width
                            lazy
                            max-width="290px"
                            min-width="290px"
                            :nudge-right="120"
                            offset-y
                            transition="scale-transition"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="startDateUsa"
                                :error-messages="startDateError"
                                :hint="$t('cpm.dateFormat')"
                                :label="$t('general.startDate')"
                                persistent-hint
                                prepend-inner-icon="event"
                                v-on="on"
                              />
                            </template>

                            <v-date-picker
                              v-model="startDateForPicker"
                              no-title
                              @input="startDatePicker = false"
                            />
                          </v-menu>
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                        >
                          <v-menu
                            ref="menuDueDate"
                            v-model="dueDatePicker"
                            :close-on-content-click="false"
                            full-width
                            lazy
                            max-width="290px"
                            min-width="290px"
                            :nudge-right="130"
                            offset-y
                            transition="scale-transition"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="dueDateUsa"
                                :error-messages="dueDateError"
                                :hint="$t('cpm.dateFormat')"
                                :label="$t('general.endDate')"
                                persistent-hint
                                prepend-inner-icon="event"
                                v-on="on"
                              />
                            </template>

                            <v-date-picker
                              v-model="dueDateForPicker"
                              no-title
                              @input="dueDatePicker = false"
                            />
                          </v-menu>
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                        >
                          <v-text-field
                            v-model="task.duration"
                            color="blue"
                            :hint="$t('cpm.calenderDateMsg')"
                            :label="$t('general.duration')"
                            persistent-hint
                            :suffix="$tc('cpm.task.day', 2)"
                            @input="inputDuration"
                          />
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col
                          cols="12"
                          md="12"
                        >
                          <label>{{ $t('cpm.task.parentTask') }}:</label>
                          <v-select
                            clearable
                            item-text="title"
                            :items="tasks"
                            return-object
                            :value="task.parentTask"
                          />
                        </v-col>
                      </v-row>
                    </div>
                  </transition>
                </v-col>
              </v-row>

              <!--SUB TASKS-->

              <v-divider class="mb-4 mt-4 xs12" />
              <v-row>
                <v-col
                  cols="12"
                  md="1"
                >
                  <v-icon>mdi-check-circle</v-icon>
                </v-col>
                <v-col
                  cols="12"
                  md="11"
                >
                  <v-row>
                    <v-col
                      cols="12"
                      md="3"
                    >
                      <h4 class="title">
                        {{ $t('cpm.task.toDoList') }}
                      </h4>
                    </v-col>
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <v-progress-linear v-model="subtaskProgress" />
                    </v-col>
                    <v-col
                      cols="12"
                      md="1"
                      style="position:relative"
                    >
                      <span class="percentage">{{ subtaskProgress }}%</span>
                    </v-col>
                    <v-col
                      class="text-right"
                      cols="12"
                      md="4"
                    >
                      <a
                        class="action-link"
                        href="#"
                        @click.prevent="showToDoDetails = !showToDoDetails"
                      >{{ $t('general.show') }}/{{ $tc('general.hideDetail', 2) }}</a>
                    </v-col>
                  </v-row>

                  <v-row
                    v-show="showToDoDetails"
                  >
                    <v-col
                      v-for="subtask in subtasks"
                      :key="subtask.id"
                      cols="12"
                    >
                      <v-row
                        align="center"
                      >
                        <v-col
                          cols="12"
                          md="1"
                        >
                          <v-checkbox
                            v-model="subtask.completed"
                            class="mt-0"
                            color="blue"
                            hide-details
                            @change="changeSubTask(subtask)"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="10"
                        >
                          <v-text-field
                            v-model="subtask.title"
                            color="blue"
                            :label="$t('cpm.task.subtask')"
                            @input="inputSubTask(subtask)"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="1"
                        >
                          <v-icon @click.prevent="deleteSubTask(subtask)">
                            mdi-delete
                          </v-icon>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12">
                      <a
                        class="action-link"
                        href="#"
                        @click.prevent="addSubTask"
                      >+ {{ $t('cpm.task.addNewTodoListItem') }}</a>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <!-- COMMENTS -->

              <v-divider class="mb-4 mt-4 xs12" />
              <v-row>
                <v-col
                  cols="12"
                  md="1"
                >
                  <v-icon>mdi-comment</v-icon>
                </v-col>
                <v-col
                  cols="12"
                  md="11"
                >
                  <v-row>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <h4 class="title">
                        {{ $tc('general.comment', 2) }}
                      </h4>
                    </v-col>
                    <v-col
                      class="text-right"
                      cols="12"
                      md="6"
                    >
                      <a
                        class="action-link"
                        href="#"
                        @click.prevent="showCommentDetails = !showCommentDetails"
                      >Show/Hide Details</a>
                    </v-col>
                    <transition name="router-anim">
                      <v-col
                        v-show="showCommentDetails"
                        cols="12"
                      >
                        <v-row>
                          <v-col
                            v-if="!showNewCommentForm"
                            cols="12"
                          >
                            <a
                              class="action-link"
                              href="#"
                              @click.prevent="showNewCommentForm = true"
                            >
                              + {{ $tc('general.addNewComment', 1) }}
                            </a>
                          </v-col>
                          <transition name="router-anim">
                            <v-col
                              v-if="showNewCommentForm"
                              cols="12"
                            >
                              <v-textarea
                                v-model="newComment"
                                color="blue"
                                :label="$t('cpm.provideComment')"
                                rows="3"
                              />
                              <v-btn @click.prevent="showNewCommentForm = false">
                                {{ $t('general.cancel') }}
                              </v-btn>
                              <v-btn
                                color="primary"
                                @click.prevent="saveComment"
                              >
                                {{ $tc('cpm.saveComment', 1) }}
                              </v-btn>
                            </v-col>
                          </transition>
                        </v-row>
                        <v-row
                          v-for="comment in comments"
                          :key="comment.id"
                        >
                          <v-col
                            cols="12"
                            md="1"
                          >
                            <i class="fa fa-user-circle task-icon" />
                          </v-col>
                          <v-col
                            cols="12"
                            md="11"
                          >
                            <p class="comment">
                              {{ comment.comment }}
                            </p>
                            <p class="author">
                              <strong>{{ comment.user ? comment.user.name : '' }}</strong> on {{ comment.createdAt.toDate().toLocaleString('en-US') }}
                            </p>
                          </v-col>
                        </v-row>
                      </v-col>
                    </transition>
                  </v-row>
                </v-col>
              </v-row>

              <!-- ACTIVITY -->

              <v-divider class="mb-4 mt-4 xs12" />
              <v-row>
                <v-col
                  cols="12"
                  md="1"
                >
                  <v-icon>mdi-note-plus</v-icon>
                </v-col>
                <v-col
                  cols="12"
                  md="5"
                >
                  <h4 class="title">
                    {{ $tc('general.activity', 2) }}
                  </h4>
                </v-col>
                <v-col
                  class="text-right"
                  cols="12"
                  md="6"
                >
                  <a
                    class="action-link"
                    href="#"
                    @click.prevent="showActivityDetails = !showActivityDetails"
                  >{{ $t('general.show') }}/{{ $tc('general.hideDetail', 2) }}</a>
                </v-col>
              </v-row>
              <transition name="router-anim">
                <v-col
                  v-if="showActivityDetails"
                  cols="12"
                >
                  <v-row
                    v-for="item in activity"
                    :key="item.id"
                  >
                    <v-col
                      cols="12"
                      md="1"
                    >
                      <i class="fa fa-user-circle task-icon" />
                    </v-col>
                    <v-col
                      class="11"
                      cols="12"
                      md
                    >
                      <p class="activity-details">
                        <strong>{{ item.user ? item.user.name : '' }}</strong> {{ item.details }}
                        <br>
                        <span class="timestamp">{{ item.createdAt.toDate().toLocaleString('en-US') }}</span>
                      </p>
                    </v-col>
                  </v-row>
                </v-col>
              </transition>
            </slot>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        text
        @click="returnTasks"
      >
        {{ $t('general.cancel') }}
      </v-btn>
      <v-btn
        color="primary"
        text
        @click="updateTask"
      >
        {{ $t('general.update') }}
      </v-btn>
    </v-card-actions>

    <transition name="modal">
      <modal-critical
        v-if="showCriticalModal"
        :id="id"
        @modalCriticalClose="showCriticalModal = false"
      />
    </transition>

    <M6ConfirmDelete
      :message="$t('cpm.task.deleteConfirm')"
      :show="showConfirmDelete"
      @cancel="showConfirmDelete = false"
      @confirm="deleteTask"
    />
  </v-card>
</template>

<script>
import 'dhtmlx-gantt'
import axios from 'axios'
import firebase from 'firebase/app'
import { db } from '@/utils/Firebase'
import {
  mapState,
  mapActions,
  mapGetters,
  mapMutations
} from 'vuex'
import ModalCritical from './ModalCritical'
import BudgetCategorySelect from '@/modules/cpm/components/projects/_partials/BudgetCategorySelect'
export default {
  name: 'Task',
  components: {
    BudgetCategorySelect,
    ModalCritical
  },
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    projectId: {
      type: [String, Number],
      default: ''
    },
    gantt: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'project'
    }
  },
  data() {
    return {
      actionConfirm: '',
      showConfirmDelete: false,
      menuStartDate: false,
      startDatePicker: false,
      startDateUsa: '',
      startDateForPicker: '',
      menuDueDate: false,
      dueDatePicker: false,
      dueDateUsa: '',
      dueDateForPicker: '',
      first_time: true,
      can_send_email: false,
      messengerTitle: '',
      message: 'Ticket has been updated successfully',
      taskRef: {},
      showCalendarDetails: true,
      showCommentDetails: false,
      showActivityDetails: false,
      showToDoDetails: false,
      showNewCommentForm: false,
      showGeneralDetails: false,
      showCriticalModal: false,
      user: {},
      ranks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      task: {},
      task_status: {},
      tasks: [],
      settings: {},
      subtasks: [],
      activity: [],
      comments: [],
      products: [],
      projectTypes: [],
      newComment: '',
      me: 0,
      userRef: {},
      taskTypes: [
        {
          name: this.$t('rfp.bidding'),
          value: 'bidding',
          color: 'rgb(255,255,204);'
        },
        {
          name: this.$tc('general.design', 1),
          value: 'design',
          color: 'rgb(221,217,196);'
        },
        {
          name: this.$t('cpm.permitting'),
          value: 'permitting',
          color: 'rgb(253,233,217);'
        },
        {
          name: this.$tc('general.construction', 1),
          value: 'construction',
          color: 'rgb(146,208,80);'
        },
        {
          name: `${this.$t('cpm.license')}/${this.$t('cpm.moveIn')}`,
          value: 'license',
          color: 'rgb(75,172,198);'
        },
        {
          name: this.$t('cpm.closeOut'),
          value: 'closeout',
          color: 'rgb(247,150,70);'
        },
        {
          name: this.$t('cpm.board'),
          value: 'board',
          color: 'rgb(112,48,160);'
        }
      ],
      calculateBudget: '',
      calculateBudgetValue: 0,
      project: {}
    }
  },
  // Returns array or object
  firestore() {
    this.taskRef = db.collection(this.appLabel.firebaseCollection).doc(this.$route.params.id).collection('tasks').doc(this.id)
    return {
      project: db.collection('cpm_projects').doc(this.$route.params.id),
      task: this.taskRef,
      comments: this.taskRef.collection('comments').orderBy('createdAt'),
      subtasks: this.taskRef.collection('subtasks').orderBy('createdAt'),
      activity: this.taskRef.collection('activity').orderBy('createdAt', 'desc'),
      settings: db.collection('settings').doc(this.appLabel.firebaseCollection),
      task_status: db.collection('settings').doc(this.currentCompany.id).collection(`${this.settingCollectionName}`).doc('task_status')
    }
  },
  computed: {
    ...mapGetters({
      bussy: 'tickets/bussy',
      axiosSettings: 'axiosSettings',
      appLabel: 'appLabel'
    }),
    ...mapGetters('cpm/planned/forecasts', [
      'budgetFiscalYear',
      'budgets'
    ]),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    company_id() {
      return this.currentCompany.id
    },
    subtaskProgress() {
      const count = this.subtasks.length
      if (count === 0) {
        return 0
      }
      let completed = 0
      this.subtasks.forEach(st => {
        if (st.completed) {
          completed++
        }
      })
      return Math.floor((completed / count) * 100).toFixed(2)
    },
    taskNumber() {
      if (!this.$h.dg(this.task, 'number')) return ''
      let Xmas = new Date()
      if (this.$h.dg(this.task, 'createdAt.seconds')) {
        Xmas = new Date(this.task.createdAt.seconds * 1000)
      }
      const year = Xmas.getYear() + 1900 // returns 95

      let idString = '00000' + this.task.number
      idString = idString.substr(idString.length - 5)
      return `TAS-${idString}-${year}`
    },
    settingCollectionName() {
      if (this.type === 'forecasted') {
        return 'planned_settings'
      } else {
        return 'settings'
      }
    },
    startDateError() {
      if (!this.$moment(this.startDateUsa, 'MM/DD/YYYY', true).isValid() && this.startDateUsa) {
        return this.$t('cpm.invalidDate')
      } else return []
    },
    dueDateError() {
      if (!this.$moment(this.dueDateUsa, 'MM/DD/YYYY', true).isValid() && this.dueDateUsa) {
        return this.$t('cpm.invalidDate')
      } else if ((this.$moment(this.dueDateUsa) <= this.$moment(this.startDateUsa)) && this.dueDateUsa) {
        return this.$t('cpm.invalidDueDate')
      } else return []
    }
  },
  watch: {
    budgetFiscalYear: {
      immediate: true,
      handler(newVal, oldVal) {
        this.task.budgetFiscalYear = newVal
      }
    },
    showCalendarDetails: function () {
      this.noFirstTime()
    },
    'task.budgetPercentage': function () {
      this.getCalculatedBudget()
    },
    'task.start_date'(value) {
      if (!value) {
        return
      }
      let date = this.$moment.utc(value).format('YYYY-MM-DD')
      if (!this.$moment(date, 'YYYY-MM-DD', true).isValid() && date !== '') {
        date = this.$moment(new Date()).format('YYYY-MM-DD')
      }
      this.startDateForPicker = date
    },
    startDateForPicker(value, oldVal) {
      if (value !== oldVal && Boolean(oldVal)) {
        this.generateDuration(value, this.task.due_date)
      }

      this.startDateUsa = this.$moment(value).format('MM/DD/YYYY')
    },
    startDateUsa(value) {
      if (!this.$moment(value, 'MM/DD/YYYY', true).isValid()) {
        return
      }
    },
    'task.due_date'(value, oldVal) {
      if (!value) {
        return
      }
      let date = this.$moment(value).format('YYYY-MM-DD')
      if (!this.$moment(date, 'YYYY-MM-DD', true).isValid() && date !== '') {
        date = ''
      }

      this.dueDateForPicker = this.$moment(date).format('YYYY-MM-DD')
    },
    dueDateForPicker(value, oldVal) {
      if (value !== oldVal && Boolean(oldVal)) {
        this.generateDuration(this.task.start_date, value)
      }

      this.dueDateUsa = this.$moment(value).format('MM/DD/YYYY')
    },
    dueDateUsa(value) {
      if (!this.$moment(value, 'MM/DD/YYYY', true).isValid()) {
        return
      }
      this.inputDueDate()
    }
  },
  async mounted() {
    this.getCalculatedBudget()
    db.collection('users').where('uid', '==', window.Drupal.settings.m6_platform_header.uid).limit(1).get().then(result => {
      if (!result.empty) {
        this.userRef = result.docs[0].ref
      }
    })

    this.me = parseInt(window.Drupal.settings.m6_platform_header.uid)

    document.documentElement.classList.add('has-modal-open')

    let pId = ''
    if (this.$route.name === 'all-tasks') {
      pId = this.projectId
    } else {
      pId = this.$route.params.id
    }
    db.collection(this.appLabel.firebaseCollection).doc(pId).collection('tasks').get().then(res => {
      res.forEach(doc => {
        if (doc.id !== this.id) {
          const taskData = doc.data()
          taskData.id = doc.id
          this.tasks.push(taskData)
        }
      })
    })
    // }

    const item = document.querySelectorAll('.navbar-left-content a')
    item.forEach(link => {
      if (link.getAttribute('href').indexOf('#') === -1) {
        link.addEventListener('click', this.leaving)
      }
    })

    let taksMounted = {}
    taksMounted = await db.collection(this.appLabel.firebaseCollection).doc(this.$route.params.id).collection('tasks').doc(this.id).get()
    if (taksMounted.data().firstTime) {
      this.taskRef.update({ firstTime: false })
    }

    this.taskRef.get().then(row => {
      const data = row.data()
      this.messengerTitle = data.title
    })
  },
  destroyed() {
    this.task = {}
  },
  methods: {
    ...mapActions('tickets', {
      fetchConstructionData: 'fetchConstructionData'
    }),
    ...mapActions('cpm/planned/forecasts', [
      'setForecastTasksData'
    ]),
    ...mapActions('cpm/planned/forecasts', [
      'getCurrentFiscalYear'
    ]),
    ...mapActions('cpm/planned/gantt', {
      getProjectMilestonesTasksAndLinks: 'getProjectMilestonesTasksAndLinks'
    }),
    ...mapMutations('cpm/planned/gantt', [
      'setForceRefresh'
    ]),
    generateDuration(startDate, endDate) {
      const a = this.$moment(this.startDateForPicker, 'YYYY-MM-DD')
      const b = this.$moment(this.dueDateForPicker, 'YYYY-MM-DD')
      this.task.duration = b.diff(a, 'days')
    },
    updateTask() {
      let data = { ...this.task }
      data.gantt = this.$h.dg(this.task, 'gantt.value')
      data = {
        ...data,
        ...this.changeType(),
        ...this.parentAssign(data.parentTask)
      }

      data.budget = parseFloat(this.calculateBudgetValue)
      data.budgetPercentage = this.task.budgetPercentage

      const startDateUsa = this.startDateUsa
      if (startDateUsa) {
        data.start_date = new Date(startDateUsa).toISOString()
      }

      const result = new Date(startDateUsa)
      result.setDate(result.getDate() + parseInt(data.duration))
      data.due_date = new Date(result).toISOString()

      this.userAssign(this.task.assignee)
      this.taskRef.update(data)
        .then(() => {
          this.$snotify.success(this.$t('cpm.task.updated'))
          this.sendNotificationNewTicket()
          this.returnTasks()
          const title = this.$h.dg(data, 'title', '')
          if (title.toLowerCase() === 'construction') {
            this.fetchConstructionData({
              projectId: this.$route.params.id
            })
          }
        })
        .catch(() => {
          this.$snotify.error(this.$t('cpm.task.errorUpdating'))
        })
        .finally(() => {
          const projectId = this.$route.params.id
          this.setForecastTasksData({
            projectId
          })
          this.getProjectMilestonesTasksAndLinks({
            projectId
          }).then(() => {
            this.setForceRefresh()
          })
        })
    },
    getCalculatedBudget() {
      let budget = 0

      if (this.$h.dg(this.budgetFiscalYear, 'value') && this.$h.dg(this.task, 'budgetPercentage') && this.budgets[this.budgetFiscalYear.value]) {
        const budgetPercentage = parseFloat(this.task.budgetPercentage) / 100
        const base = this.budgets[this.budgetFiscalYear.value]
        budget = base * budgetPercentage
      }
      this.calculateBudget = parseFloat(budget).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
      this.calculateBudgetValue = parseFloat(budget)
    },
    changeType() {
      let color = ''
      let type = {}

      if (this.task.type && this.task.type.color) {
        color = this.task.type.color
        type = this.task.type
      }

      return {
        color: color,
        type: type
      }
    },
    isoToDate(date) {
      date = date.replace(/\D/g, ' ')
      const dtcomps = date.split(' ')
      dtcomps[1]--
      return new
      Date(Date.UTC(dtcomps[0], dtcomps[1], dtcomps[2]))
    },
    expandAll() {
      this.showCalendarDetails = true
      this.showCommentDetails = true
      this.showActivityDetails = true
      this.showToDoDetails = true
      this.showGeneralDetails = true
    },
    noFirstTime() {
      this.can_send_email = true
      this.first_time = false
    },
    updateProduct(product) {
      this.task.product = product
      this.taskRef.update({ product })
      this.sendNotificationNewTicket()
    },
    updateProjectType(type) {
      this.task.projectType = type
      this.taskRef.update({ projectType: this.task.projectType })
      this.sendNotificationNewTicket()
    },
    updateRank(rank) {
      this.task.rank = rank
      this.taskRef.update({ rank: this.task.rank })
    },
    setPriority(id, priority) {
      this.task.priority = priority
      this.taskRef.update({ priority })
      this.sendNotificationNewTicket()
    },
    setCritical() {
      this.showCriticalModal = true
      this.sendNotificationNewTicket()
    },
    deleteTaskConfirm() {
      this.showConfirmDelete = true
    },
    deleteTask() {
      this.taskRef.delete()
      this.$store.dispatch('tickets/closeModal')
      this.task = {}
      this.showConfirmDelete = false
      this.setForecastTasksData({
        projectId: this.$route.params.id
      })
      this.$emit('closeTask')
    },
    returnTasks() {
      this.$emit('closeTask')
    },
    leaving(e) {
      if (!this.task.title && this.task.id && !this.task.description) {
        const answer = window.confirm(this.$t('cpm.task.deleteConfirm'))
        if (answer) {
          const company_id = this.task.company.id
          const nextTicketNumber = this.task.company.nextTicketNumber - 1
          db.collection('companies').doc(company_id).update({
            nextTicketNumber: nextTicketNumber
          })
          this.taskRef.delete()
          this.task = {}
        } else {
          e.preventDefault()
        }
      }
    },
    leave() {
      if (!this.task.title) {
        const company_id = this.task.company.id
        const nextTicketNumber = this.task.company.nextTicketNumber - 1
        db.collection('companies').doc(company_id).update({
          nextTicketNumber: nextTicketNumber
        })
      }
    },
    sendNotificationNewTicket() {
      if (this.task.firstTime && this.$route.name === 'tickets') {
        if (this.task.title && this.task.description && this.task.product && this.task.projectType && this.task.status && this.task.priority) {
          this.task.firstTime = false
          axios.post('/cadence/ticket/send_notification_new_ticket', {
            task: this.task
          })
            .then(() => {
              this.taskRef.update({ firstTime: false })
              this.$snotify.success(this.$t('cpm.task.newTicketCreated'), this.$t('alerts.success'))
            })
            .catch(error => {
              this.$snotify.error(error, this.$t('alerts.error'))
            })
        }
      }
    },
    userAssign(data) {
      if (!data) return

      if (this.appLabel.firebaseCollection === 'm6projects') {
        this.taskRef.update({ assignee: data })
      } else {
        const assignedUsers = []
        let changed = 0
        if (data.constructor !== Array) return
        data.forEach(user => {
          if (user.id) {
            assignedUsers.push(db.collection('users').doc(user.id))
            changed++
          }
        })
        if (changed === data.length) {
          this.taskRef.update({ assignee: assignedUsers })
        }
        return false
      }
    },

    parentAssign(parentTask) {
      if (!this.$h.dg(parentTask, 'id') && !this.$h.dg(parentTask, 'title')) return
      // parentTask prop is for select on this component
      // parent prop is for gantt chart
      return {
        parentTask: { id: parentTask.id, title: parentTask.title },
        parent: parentTask.id
      }
    },

    deleteParentTask() {
      if (this.task.parentTask) {
        this.taskRef.update({
          parentTask: firebase.firestore.FieldValue.delete(),
          parent: firebase.firestore.FieldValue.delete()
        })
      }
    },

    inputDueDate() {
      if (!this.first_time) {
        this.dueDateSave(this)
      }
    },
    dueDateSave: _.debounce(vm => {
      gantt.config.work_time = true
      const startDate = new Date(vm.startDateUsa)
      const endDate = new Date(vm.dueDateUsa)
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
      const taskDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      vm.task.due_date = vm.dueDateUsa
      vm.task.duration = taskDuration
      vm.durationSave()
    }, 400),

    inputDuration() {
      this.durationSave(this)
    },
    durationSave: _.debounce(vm => {
      gantt.config.work_time = true
      const endDate = new Date(vm.startDateUsa)
      endDate.setDate(endDate.getDate() + parseInt(vm.task.duration))
      vm.task.due_date = endDate.toISOString()
    }, 400),

    inputSubTask(subtask) {
      this.subTaskSave(this, subtask)
    },
    subTaskSave: _.debounce((vm, subtask) => {
      vm.taskRef.collection('subtasks').doc(subtask.id).update({
        title: subtask.title
      })
    }, 400),

    changeSubTask(subtask) {
      this.noFirstTime()
      this.taskRef.collection('subtasks').doc(subtask.id).update({
        completed: subtask.completed
      })
      const complete = subtask.completed ? 'Done' : 'Pending'
      this.addActivity(`${this.$t('cpm.task.markedTask')} "${subtask.title}" as ${complete}`)
    },

    addSubTask() {
      this.noFirstTime()
      this.taskRef.collection('subtasks').add({
        completed: false,
        title: '',
        createdAt: new Date()
      })
    },
    deleteSubTask(subtask) {
      this.noFirstTime()
      this.taskRef.collection('subtasks').doc(subtask.id).delete()
      this.addActivity(`${this.$t('cpm.task.deletedSubtask')} "${subtask.title}"`)
    },

    updateStatus(newStatus) {
      this.noFirstTime()
      this.taskRef.update({ status: newStatus })
      this.addActivity(`${this.$t('cpm.task.updateTaskTo')} "${newStatus}"`)
      this.sendNotificationNewTicket()

      if (newStatus === 'Complete') {
        this.taskRef.update({ archive: true })
      } else {
        this.taskRef.update({ archive: false })
      }
      if (newStatus === 'Complete' || newStatus === 'Review' || newStatus === 'Prod Review' || newStatus === 'Prod Release') {
        this.sendNotificationStatus(this.task.author.uid, this.task.title, newStatus, this.task.id)
      }
    },
    sendNotificationStatus(uid, title, status, id) {
      axios.post('/cadence/ticket/send_notification_status', {
        uid: uid,
        title: title,
        status: status,
        id: id
      })
        .then(() => {
          this.$snotify.success(this.$t('cpm.task.notificationSent'), this.$t('alert.success'))
        })
        .catch(error => {
          this.$snotify.error(error, this.$t('alert.error'))
        })
    },
    saveComment() {
      this.noFirstTime()
      this.taskRef.collection('comments').add({
        user: this.userRef,
        comment: this.newComment,
        createdAt: new Date()
      })
      const count = this.comments.length + 1
      this.taskRef.update({ commentCount: count })
      this.addActivity(`${this.$t('cpm.task.addComment')} "${this.newComment}"`)
      this.newComment = ''
      this.showNewCommentForm = false
      this.$snotify.success(this.$t('cpm.task.commentAdded'), this.$t('alert.success'))
    },

    addActivity(data) {
      this.noFirstTime()
      this.taskRef.collection('activity').add({
        user: this.userRef,
        details: data,
        createdAt: new Date()
      })
    },

    setBudgetCategory(categories) {
      if (this.$h.dg(this.task, 'budgetCategories')) {
        this.task.budgetCategories = []
      }

      const formattedCategories = categories.map(category => ({
        id: this.$h.dg(category, 'id'),
        name: this.$h.dg(category, 'name', 'Undefined'),
        contingency: this.$h.dg(category, 'contingency', false),
        ref: this.getBudgetCategoryRef(category.id),
        code: this.$h.dg(category, 'code', 'Undefined')
      }))

      this.task.budgetCategories = formattedCategories
    },
    getBudgetCategoryRef(id) {
      if (!id) return ''

      return db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('budgets')
        .collection('budget_categories')
        .doc(id)
    }
  }
}
</script>

<style lang="scss">
  #app .v-select.select-multiple .selected-tag {
    padding: 4px 8px;
  }
  .left-panel-close {
    position: fixed;
    top: 57px;
    right: 20px;
    font-size: 30px;
    cursor: pointer;
    z-index: 100;
  }
  .section-separator {
    margin-top: 40px;
    margin-bottom: 40px;
  }
  .task-icon {
    color: #AAA;
    font-size: 20px;
  }
  .section-title {
    color: #202020;
    font-weight: 600;
  }
  .percentage {
    font-size: 16px;
    color: #AAA;
    position: absolute;
    top: 10px;
    left: 5px;
  }
  .icon-action {
    font-size: 20px;
    margin-top: 20px;
    color: #AAA;
    cursor: pointer;

    &:hover {
      color: #0f75bc;
    }
  }
  .action-link {
    color: #AAA !important;

    &:hover {
      color: #0f75bc;
    }
  }

  .comment {
    margin: 0;
  }

  .author {
    color: #AAA;
  }
  .timestamp {
    color: #AAA;
  }
  #app {
    .special {
      .col-sm-1 {
        width: 3.5%;
      }
      .col-sm-11 {
        width: 95%;
      }
    }
    .task-label-indicator {
      height: 8px;
      border-radius: 8px;

      &.low {
        background: #61ff69;
      }
      &.normal {
        background: #265a7f;
      }
      &.high {
        background: #ffe061;
      }
      &.critical {
        background: #ff6961;
      }
    }
  }

  .task-activity {
    border: 1px solid #404040 !important;
    border-bottom: 1px solid !important;
    border-radius: 100px !important;
    background-color: transparent ;
  }

  .input-right {
    input {
      text-align: right;
    }
  }
</style>

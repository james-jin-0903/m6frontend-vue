<template>
  <div>
    <v-card>
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">
          Milestone Information
        </span>
      </v-card-title>
      <v-divider class="grey lighten-3" />
      <v-card-text class="vertical-scroll">
        <v-form ref="form">
          <v-container
            class="pa-0 rounded-lg"
            fluid
            grid-list-md
          >
            <v-row>
              <v-col
                cols="12"
                md="12"
              >
                <v-container
                  class="rounded-lg"
                  fluid
                  grid-list-md
                >
                  <v-row>
                    <v-col md="12">
                      <v-select
                        v-model="title"
                        clearable
                        color="blue"
                        :items="settingsNames"
                        :label="`${appLabel.singular} Milestone`"
                        :rules="[rules.required]"
                      />
                    </v-col>
                    <v-col md="12">
                      <v-text-field
                        v-if="customName && settings.names.length"
                        v-model="milestone.title"
                        label="Custom Milestone Name"
                      />
                    </v-col>
                    <v-col md="12">
                      <v-select
                        v-model="milestone.status"
                        :items="settings.status"
                        label="Milestone Status"
                      />
                    </v-col>
                    <v-col md="6">
                      <v-menu
                        ref="menuOriginal"
                        v-model="originalDatePicker"
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
                            v-model="originalDateUsa"
                            :disabled="userCanEditDates"
                            :error-messages="originalDateError"
                            hint="MM/DD/YYYY format"
                            label="Original Forecasted Date"
                            persistent-hint
                            prepend-inner-icon="event"
                            v-on="on"
                          />
                        </template>

                        <v-date-picker
                          v-model="originalDateForPicker"
                          no-title
                          @input="originalDatePicker = false"
                        />
                      </v-menu>
                    </v-col>
                    <v-col md="6">
                      <v-menu
                        v-if="!validDates.length"
                        ref="menuProjected"
                        v-model="projectedDatePicker"
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
                            v-model="projectedDateUsa"
                            :error-messages="projectedDateError"
                            hint="MM/DD/YYYY format"
                            label="New Forecasted Date"
                            persistent-hint
                            prepend-inner-icon="event"
                            v-on="on"
                          />
                        </template>

                        <v-date-picker
                          v-model="projectedDateForPicker"
                          no-title
                          @input="projectedDatePicker = false"
                        />
                      </v-menu>
                      <v-select
                        v-else
                        v-model="projectedDateUsa"
                        :items="validDates"
                        label="New Forecasted Date"
                        @change="getFutureMilestones"
                        @focus="firstTime = false;"
                      />
                    </v-col>

                    <v-col md="6">
                      <v-checkbox
                        v-model="milestone.in_report"
                        color="blue"
                        label="In Report"
                      />
                    </v-col>
                    <v-col md="6">
                      <v-menu
                        ref="menuActual"
                        v-model="actualDatePicker"
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
                            v-model="actualDateUsa"
                            :error-messages="actualDateError"
                            hint="MM/DD/YYYY format"
                            label="Actual Completion Date"
                            persistent-hint
                            prepend-inner-icon="event"
                            v-on="on"
                          />
                        </template>

                        <v-date-picker
                          v-model="actualDateForPicker"
                          no-title
                          @input="actualDatePicker = false"
                        />
                      </v-menu>
                    </v-col>

                    <v-col
                      v-if="showComments"
                      md="12"
                    >
                      <v-textarea
                        v-model="comment"
                        label="Milestone Updates Comments"
                        :rules="[rules.required]"
                      />
                    </v-col>
                    <v-col
                      v-if="comments.length"
                      md="12"
                    >
                      <table class="commentsTable">
                        <tr>
                          <th width="20%">
                            Date
                          </th>
                          <th width="30%">
                            User
                          </th>
                          <th>Comment</th>
                        </tr>

                        <tr
                          v-for="(comment, index) in comments"
                          :key="index"
                        >
                          <td>
                            {{ $moment(comment.date).format('MM/DD/YYYY') }}
                          </td>
                          <td>{{ comment.user }} {{ comment.lastName }}</td>
                          <td>{{ comment.comment }}</td>
                        </tr>
                      </table>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue"
          outline
          @click.prevent="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-3"
          dark
          :loading="submitLoading"
          @click.prevent="save"
        >
          {{ submitLoading ? 'Saving...' : 'Save' }}
        </v-btn>
      </v-card-actions>

      <v-dialog
        v-model="showModal"
        persistent
        scrollable
        :width="1200"
      >
        <v-card>
          <v-card-title class="headline px-6 py-4 white">
            <span class="grey--text text--darken-1">
              {{ $t('cpm.projects.milestones.modalEditForecastedDateTitle') }}
            </span>
          </v-card-title>
          <v-divider class="grey lighten-3" />

          <v-card-actions>
            <v-btn
              text
              @click="showModal = false"
            >
              {{ $t('general.no') }}
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="
                updateFutureMilestone = true
                showModal = false
              "
            >
              {{ $t('general.yes') }}
            </v-btn>
            <v-spacer />
            <div
              v-if="showLinkedScheduleTasks"
              class="linkedScheduleTasks"
            >
              <v-checkbox
                v-model="linkedScheduleTasks"
                color="blue"
                label="Do you want to push out linked schedule tasks end date?"
              />
            </div>
          </v-card-actions>

          <v-card-text class="vertical-scroll">
            <v-container
              class="rounded-lg"
              fluid
              grid-list-md
            >
              <v-row>
                <v-col>
                  <table class="milestoneTable">
                    <thead>
                      <tr>
                        <th width="12.5%">
                          Milestone
                        </th>
                        <th width="12.5%">
                          Original Forecasted Date
                        </th>
                        <th width="12.5%">
                          New Forecasted Date
                        </th>
                        <th width="12.5%">
                          New Forecasted Date Updated
                        </th>
                        <th width="12.5%">
                          Linked Schedule Task
                        </th>
                        <th width="12.5%">
                          Linked Schedule Task - End Date
                        </th>
                        <th width="12.5%">
                          New Task End Date
                        </th>
                        <th width="12.5%">
                          Last Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(mile, index) in futureMilestones"
                        :key="index"
                      >
                        <td>{{ mile.title }}</td>
                        <td class="text-center">
                          {{ $moment(mile.original).format('MM/DD/YYYY') }}
                        </td>
                        <td class="text-center">
                          {{
                            mile.projected
                              ? $moment(mile.projected).format('MM/DD/YYYY')
                              : ''
                          }}
                        </td>
                        <td>
                          <v-menu
                            v-model="mile.menu"
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
                                v-model="mile.forecastedUpdated"
                                prepend-inner-icon="event"
                                readonly
                                v-on="on"
                              />
                            </template>

                            <v-date-picker
                              v-model="mile.picker"
                              no-title
                              @input="updateLine(mile)"
                            />
                          </v-menu>
                        </td>

                        <td class="text-center">
                          {{ getTasksLinked(mile) }}
                        </td>
                        <td :class="['text-center', mile.showLinkedScheduleTasks ? 'yellow' : '']">
                          {{ getTasksLinkedDate(mile) }}
                        </td>
                        <td>
                          <v-menu
                            v-if="mile.showNewEndDate"
                            v-model="mile.menuTask"
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
                                v-model="mile.newEndDate"
                                prepend-inner-icon="event"
                                readonly
                                v-on="on"
                              />
                            </template>

                            <v-date-picker
                              v-model="mile.newEndDatePicker"
                              no-title
                              @input="updateNewDateLine(mile)"
                            />
                          </v-menu>
                        </td>
                        <td>{{ getlastUpdated(mile) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Milestone',
  props: {
    milestoneId: { default: '', type: [String, Number] },
    projectId: { default: '', type: [String, Number] },
    type: { default: 'project', type: [String] },
    userCanEditDates: { default: true, type: Boolean },
    milestonesAvailables: { required: true, type: Array }
  },
  data() {
    return {
      menuOriginal: false,
      menuProjected: false,
      menuActual: false,
      actualDatePicker: false,
      projectedDatePicker: false,
      originalDatePicker: false,
      actualDateForPicker: '',
      originalDateForPicker: '',
      projectedDateForPicker: '',
      actualDateUsa: '',
      originalDateUsa: '',
      projectedDateUsa: '',
      projectRef: {},
      customName: false,
      submitLoading: false,
      settings: { status: [], names: [] },
      milestone: {
        actual: '',
        original: '',
        projected: ''
      },
      rules: {
        required: value => !!value || 'Required.'
      },
      comments: [],
      comment: '',
      approved: false,
      firstTime: true,
      showComments: false,
      showModal: false,
      futureMilestones: [],
      updateFutureMilestone: false,
      validDates: [],
      settingMilestones: [],
      tasks: [],
      showLinkedScheduleTasks: false,
      linkedScheduleTasks: false
    }
  },
  computed: {
    ...mapGetters(['appLabel']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    settingsNames() {
      if (this.milestonesAvailables.length) {
        return this.settings.names.filter(name => !/^start date$/gim.test(name))
      }

      return ['Start Date']
    },
    title: {
      set(newVal) {
        if (newVal !== 'Other') {
          this.milestone.title = newVal
          this.customName = false
        } else {
          this.milestone.title = ''
          this.customName = true
        }
      },
      get() {
        const notOther = this.settings.names.includes(this.milestone.title)
        // TODO: Fix ESLint Change it to a watcher instead of a computed
        if (notOther) {
          this.customName = false // eslint-disable-line
          return this.milestone.title
        } else {
          this.customName = true // eslint-disable-line
          return 'Other'
        }
      }
    },
    settingCollectionName() {
      if (this.$route.name.includes('forecasting')) {
        return 'planned_settings'
      } else {
        return 'settings'
      }
    },
    actualDateError() {
      if (
        !this.$moment(this.actualDateUsa, 'MM/DD/YYYY', true).isValid() &&
        this.actualDateUsa !== ''
      ) {
        return 'Invalid Date MM/DD/YYYY'
      } else return []
    },
    projectedDateError() {
      if (
        !this.$moment(this.projectedDateUsa, 'MM/DD/YYYY', true).isValid() &&
        this.projectedDateUsa !== ''
      ) {
        return 'Invalid Date MM/DD/YYYY'
      } else return []
    },
    originalDateError() {
      if (!this.$moment(this.originalDateUsa, 'MM/DD/YYYY', true).isValid()) {
        return 'Invalid Date MM/DD/YYYY'
      } else return []
    }
  },
  watch: {
    projectedDatePicker(isOpen) {
      if (isOpen) {
        this.firstTime = false
        this.checkIsEmpty()
      }
    },
    projectedDateUsa(newValue, oldValue) {
      if (!this.firstTime) {
        if (newValue !== oldValue) {
          if (this.approved) {
            this.showComments = true
          }
        }
      }
    },
    'milestone.original'(value) {
      if (!value) return
      this.originalDateForPicker = this.$moment(value).format('YYYY-MM-DD')
    },
    originalDateForPicker(value) {
      this.originalDateUsa = this.$moment(value).format('MM/DD/YYYY')
    },
    'milestone.projected'(value) {
      if (!value) return
      this.projectedDateForPicker = this.$moment(value).format('YYYY-MM-DD')
    },
    projectedDateForPicker(value) {
      this.projectedDateUsa = this.$moment(value).format('MM/DD/YYYY')
      if (!this.firstTime) {
        this.getFutureMilestones()
      } else {
        this.firstTime = false
      }
    },
    'milestone.actual'(value) {
      if (!value) return
      this.actualDateForPicker = this.$moment(value).format('YYYY-MM-DD')
    },
    actualDateForPicker(value) {
      this.actualDateUsa = this.$moment(value).format('MM/DD/YYYY')
    }
  },
  firestore() {
    this.projectRef = db
      .collection(this.appLabel.firebaseCollection)
      .doc(this.projectId)
    return {
      milestone: this.projectRef.collection('milestones').doc(this.milestoneId),
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('milestones'),
      project: this.projectRef
    }
  },
  mounted() {
    if (!this.$route.name.includes('forecasting')) {
      this.approved = true
    }

    this.projectRef
      .collection('milestones')
      .doc(this.milestoneId)
      .collection('comments')
      .orderBy('date')
      .get()
      .then(comments => {
        comments.docs.forEach(doc => {
          this.comments.push(doc.data())
        })


        if (this.milestone && this.settings) {
          const find = this.settings.milestones.find(f => f.name === this.milestone.title)
          if (find && find.validDates) {
            this.validDates = find.validDates.map(row => this.$moment(row).format('MM/DD/YYYY'))
          } else {
            this.validDates = []
          }
        }
      })
    this.getSettingsMilestones()
  },
  methods: {
    getTasksLinkedDate(item) {
      const find = this.settingMilestones.find(m => m.name === item.title)
      if (find && find.links) {
        return find.links.map(l => {
          const findTask = this.tasks.find(t => l.label === t.title)

          if (findTask && find.linkedToTaskEndDate) {
            this.showLinkedScheduleTasks = true
            item.showNewEndDate = true
            item.task_id = findTask.id
            const forecasted = this.$moment(item.picker)
            const newEndDate = this.$moment(findTask.due_date).add(item.days, 'days')

            item.newEndDate = newEndDate.format('MM/DD/YYYY')
            item.newEndDatePicker = newEndDate.toISOString()
            if (forecasted > this.$moment(findTask.due_date)) {
              item.showLinkedScheduleTasks = true
            }
            return this.$moment(findTask.due_date).format('MM/DD/YYYY')
          } else {
            return '---'
          }
        }).join(',')
      } else {
        return '---'
      }
    },
    getTaskByProject() {
      this.projectRef
        .collection('tasks')
        .get()
        .then(tasks => {
          this.tasks = tasks.docs.map(t => ({
            ...t.data(),
            id: t.id
          }))
        })
    },
    getTasksLinked(item) {
      const find = this.settingMilestones.find(m => m.name === item.title)
      if (find && find.links) {
        return find.links.map(l => l.label).join(',')
      } else {
        return '---'
      }
    },
    getSettingsMilestones() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.milestonesCollection)
        .get()
        .then(settings => {
          if (!settings.exists) {
            db.collection('settings')
              .doc(this.currentCompany.id)
              .collection('settings')
              .doc(this.appLabel.milestonesCollection)
              .set({
                names: [],
                milestones: []
              })
          } else {
            const data = settings.data()
            this.settingMilestones = data.milestones ? data.milestones : []
          }
        })
    },
    getlastUpdated(item) {
      if (item.userUpdate) {
        return item.userUpdate.name + ' ' + item.userUpdate.lastName + ' | ' + this.$moment(item.lastUpdated).format('MM/DD/YYYY')
      }
    },
    updateLine(item) {
      item.forecastedUpdated = this.$moment(item.picker).format('MM/DD/YYYY')
    },
    updateNewDateLine(item) {
      item.newEndDate = this.$moment(item.newEndDatePicker).format('MM/DD/YYYY')
    },
    newForecastedUpdated(mile) {
      if (!mile.original) return ''

      const start = this.$moment(this.originalDateForPicker)
      const end = this.$moment(this.projectedDateForPicker)
      const days = this.$moment.duration(start.diff(end)).asDays() * -1

      const projected = this.$moment(mile.original).add(days, 'days')
      mile.forecastedUpdated = this.$moment(projected).format('MM/DD/YYYY')
      mile.picker = projected.toISOString()
    },
    checkIsEmpty() {
      if (this.originalDateForPicker && !this.projectedDateForPicker) {
        this.firstTime = true
        this.projectedDateForPicker = this.originalDateForPicker
      }
    },
    cancel() {
      this.$emit('close')
    },
    save() {
      const formIsValid = this.$refs.form.validate()
      if (formIsValid) {
        const validDate = Boolean(
          !this.actualDateError.length &&
            !this.projectedDateError.length &&
            !this.originalDateError.length
        )

        if (!validDate) {
          this.$snotify.warning('Please, enter a valid date')
          return
        }

        this.milestone.original = this.$moment(
          this.originalDateUsa
        ).toISOString()
        this.milestone.projected = this.$moment(
          this.projectedDateUsa
        ).toISOString()
        this.milestone.actual = this.$moment(this.actualDateUsa).toISOString()
        this.milestone.userUpdate =
          window.Drupal.settings.m6_platform_header.user
        this.milestone.lastUpdated = new Date().toISOString()

        this.submitLoading = true

        this.milestone.gantt = this.$h.dg(
          this.project,
          'selectedGantt.value',
          'default'
        )

        this.projectRef
          .collection('milestones')
          .doc(this.milestone.id)
          .set(this.milestone)

        if (this.showComments) {
          this.projectRef
            .collection('milestones')
            .doc(this.milestone.id)
            .collection('comments')
            .add({
              user: window.Drupal.settings.m6_platform_header.user.name,
              lastName: window.Drupal.settings.m6_platform_header.user.lastName,
              email: window.Drupal.settings.m6_platform_header.user.email,
              date: new Date().toISOString(),
              comment: this.comment
            })
          this.projectRef.collection('milestoneReviews').add({
            date: new Date().toISOString(),
            user: window.Drupal.settings.m6_platform_header.user,
            action: 'Update Milestone ' + this.milestone.title,
            comment: this.comment
          })
        }

        this.projectRef.update({
          lastMilestoneUpdateUser: window.Drupal.settings.m6_platform_header.user,
          lastMilestoneUpdateDate: new Date().toISOString()
        })

        if (this.updateFutureMilestone) {
          this.futureMilestones.forEach(m => {
            const newDate = this.$moment(m.picker).toISOString()
            m.ref.update({
              projected: newDate,
              userUpdate: window.Drupal.settings.m6_platform_header.user,
              lastUpdated: new Date().toISOString()
            })

            if (this.linkedScheduleTasks && m.task_id) {
              this.projectRef
                .collection('tasks')
                .doc(m.task_id)
                .update({
                  due_date: this.$moment(m.newEndDatePicker).toISOString()
                })
            }
          })
        }

        this.$snotify.success('The Milestone has been updated', 'Success')
        this.$emit('close')
      } else {
        this.$snotify.error('Please fill all required fields', 'Error')
      }
    },
    getFutureMilestones() {
      const gantt = this.$h.dg(this.project, 'selectedGantt.value', {})

      if (this.milestone.original && gantt) {
        this.futureMilestones = []
        this.projectRef
          .collection('milestones')
          .where('gantt', '==', gantt)
          .where('original', '>', this.milestone.original)
          .get()
          .then(milestones => {
            if (!milestones.empty) {
              this.showModal = true
              const start = this.$moment(this.originalDateForPicker)
              const end = this.$moment(this.projectedDateForPicker)
              const days = this.$moment.duration(start.diff(end)).asDays() * -1
              milestones.docs.forEach(milestone => {
                const data = milestone.data()
                data.ref = milestone.ref
                data.menu = false
                data.forecastedUpdated = ''
                data.picker = ''
                data.newEndDate = ''
                data.newEndDatePicker = ''
                data.showNewEndDate = false
                data.showLinkedScheduleTasks = false
                data.days = days

                const projected = this.$moment(data.original).add(days, 'days')
                data.forecastedUpdated = this.$moment(projected).format(
                  'MM/DD/YYYY'
                )
                data.picker = projected.toISOString()
                this.futureMilestones.push(data)
              })

              this.getTaskByProject()
            }
          })
      }
    }
  }
}
</script>

<style lang="scss">
#milestones .card-container {
  min-height: 331px;
}
.milestoneTable {
  width: 100%;

  th {
    background: #0277BD;
    padding: 5px;
    color: white;
  }
  td {
    padding: 5px;

    .v-text-field {
      padding-top: 0;
    }
    &.yellow {
      background: #FF0;
      color: red;
      font-weight: 700;
    }

  }
  tbody {
    tr:nth-child(even) {
      background-color: #efefef;
    }
  }
  .text-center {
    text-align: center;
  }

}

.vdatetime input {
  cursor: pointer;
}

.inline {
  display: inline-block;
}
.v-dialog--scrollable > div {
  overflow-y: scroll;
}
.commentsTable {
  width: 100%;

  th {
    background: #bababa;
  }
  tr:nth-child(odd) {
    background-color: #efefef;
  }
  td {
    font-size: 12px;
  }
}
.linkedScheduleTasks {
  > .v-input {
    margin: 0;
    justify-content: flex-end;
  }
}

</style>

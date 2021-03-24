<template>
  <div>
    <v-dialog
      v-model="dialogMilestone"
      max-width="600px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            Milestone
          </span>
        </v-card-title>
        <v-card-text class="vertical-scroll">
          <v-container
            class="pa-0 rounded-lg"
            fluid
            grid-list-md
          >
            <v-row>
              <v-col md="12">
                <v-autocomplete
                  v-model="milestone.name"
                  clearable
                  color="blue"
                  :items="milestones.names"
                  label="Name"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col md="8">
                <v-text-field
                  v-model="milestone.days"
                  label="Days"
                />
              </v-col>
              <v-col md="4">
                <v-switch
                  v-model="milestone.after"
                  :label="getLabelMilestone()"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <v-checkbox
                  v-model="milestone.inReport"
                  label="In schedule"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-col md="2">
            <v-btn
              color="blue"
              outlined
              @click="cancelMilestone"
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col md="2">
            <v-btn
              color="blue"
              dark
              @click="saveMilestone"
            >
              Save
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title class="relative">
        <v-btn
          absolute
          color="blue"
          dark
          fab
          right
          small
          @click="showForm = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="vertical-scroll">
        <div class="form-group">
          <label>Schedule Type</label>
          <v-list
            class="mainList"
            dense
          >
            <v-list-item class="myListHeader">
              <v-list-item-content>Name</v-list-item-content>
              <v-list-item-action>Action</v-list-item-action>
            </v-list-item>
            <draggable
              v-model="settings.gantts"
              @end="drag = false"
              @start="drag = true"
              @update="saveOrder"
            >
              <v-list-item
                v-for="(item, key) in settings.gantts"
                :key="key"
                class="myList"
              >
                <v-list-item-avatar>
                  <v-icon
                    color="blue"
                    small
                  >
                    mdi-drag-variant
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>{{ item.name }}</v-list-item-content>
                <v-list-item-action
                  style="flex-direction:row; justify-content: flex-end;"
                >
                  <v-btn
                    class="xs-btn"
                    icon
                    small
                    @click.prevent="edit(key, item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    class="xs-btn"
                    icon
                    small
                    @click.prevent="deleteGantt(key, item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </draggable>
          </v-list>
        </div>
      </v-card-text>
    </v-card>

    <v-card
      v-if="showForm"
      class="mt-2"
    >
      <v-card-text class="vertical-scroll">
        <v-form ref="form">
          <v-container
            class="pa-0 rounded-lg"
            fluid
            grid-list-md
          >
            <v-row>
              <v-col
                v-if="currentType.name"
                class="indigo--text"
                md="12"
              >
                <h6>Editing:</h6>
              </v-col>
              <v-col md="12">
                <v-text-field
                  v-model="name"
                  color="blue"
                  :label="`Schedule type`"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col md="12">
                <v-checkbox
                  v-model="hasCalculatedDates"
                  label="This Schedule Type has milestones"
                />
              </v-col>
            </v-row>

            <v-row
              v-show="hasCalculatedDates"
            >
              <v-col md="12">
                <v-autocomplete
                  v-model="milestoneName"
                  clearable
                  color="blue"
                  :items="milestones.names"
                  label="Initial Milestone Name"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col md="12">
                <v-textarea
                  v-model="description"
                  color="blue"
                  label="Description"
                />
              </v-col>
            </v-row>

            <v-row
              v-show="hasCalculatedDates"
            >
              <v-col
                class="pt-4"
                md="5"
              >
                Project Start Date is
              </v-col>
              <v-col md="3">
                <v-text-field
                  v-model="projectStartDateDays"
                  color="blue"
                  label=""
                  single-line
                />
              </v-col>
              <v-col
                class="pt-4"
                md="4"
              >
                days before this date.
              </v-col>
            </v-row>

            <v-row
              v-show="hasCalculatedDates"
            >
              <v-spacer />
              <v-col md="2">
                <v-btn
                  color="blue"
                  dark
                  icon
                  @click="addMilestone"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row
              v-show="hasCalculatedDates"
            >
              <v-col md="12">
                <v-data-table
                  :headers="headersMilestones"
                  hide-default-footer
                  :items="milestoneItems"
                >
                  <template
                    slot="items"
                    slot-scope="props"
                  >
                    <td>{{ props.item.name }}</td>
                    <td>{{ getTableDayLabel(props.item) }}</td>
                    <td>{{ props.item.inReport ? 'Yes' : 'No' }}</td>
                    <td>
                      <v-btn
                        color="blue"
                        dark
                        icon
                        small
                        @click="editMilestone(props.item, props.index)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        color="blue"
                        dark
                        icon
                        small
                        @click="deleteMilestone(props.index)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </td>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>

            <v-row>
              <v-spacer />
              <v-col md="4">
                <v-btn
                  color="blue"
                  outlined
                  @click="cancel"
                >
                  Cancel
                </v-btn>
              </v-col>
              <v-col md="4">
                <v-btn
                  color="blue"
                  dark
                  @click="save"
                >
                  {{ submitLoading ? 'Saving...' : 'Save' }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState, mapGetters } from 'vuex'
import draggable from 'vuedraggable'

const milestoneDefault = {
  name: '',
  after: true,
  days: '',
  inReport: false
}
export default {
  name: 'GanttAdmin',
  components: {
    draggable
  },
  data() {
    return {
      milestones: [],
      name: '',
      currentType: {},
      duplicate: {},
      settings: {},
      submitLoading: false,
      showForm: false,
      rules: {
        required: value => !!value || 'Required.'
      },
      headers: [
        {
          text: 'Name',
          value: 'name',
          sortable: false
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false
        }
      ],
      hasCalculatedDates: false,
      headersMilestones: [
        { text: 'Milestone', value: 'name', sortable: false },
        { text: 'Days', value: 'days', sortable: false },
        { text: 'In Schedule', value: 'inReport', sortable: false },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      milestoneName: '',
      milestoneItems: [],
      milestone: { ...milestoneDefault },
      dialogMilestone: false,
      description: '',
      projectStartDateDays: 0
    }
  },
  computed: {
    ...mapGetters(['appLabel']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  mounted() {
    db.collection('settings')
      .doc(this.currentCompany.id)
      .collection('settings')
      .doc(this.appLabel.settingsCollection)
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc(this.appLabel.settingsCollection)
            .set({
              gantts: [
                {
                  name: 'Default',
                  value: 'default'
                }
              ]
            })
        }
      })
  },
  methods: {
    editMilestone(item, index) {
      this.milestone = { ...item }
      this.milestone.index = index.toString()
      this.dialogMilestone = true
    },
    deleteMilestone(index) {
      this.milestoneItems.splice(index, 1)
    },
    getTableDayLabel(item) {
      if (item.days) {
        let auxString = ' days before'

        if (item.after) {
          auxString = ' days after'
        }
        return item.days + auxString
      }
      return ''
    },
    saveMilestone() {
      if (this.milestone.index) {
        const index = parseInt(this.milestone.index)
        this.milestoneItems[index].name = this.milestone.name
        this.milestoneItems[index].days = this.milestone.days
        this.milestoneItems[index].inReport = this.milestone.inReport
        this.milestoneItems[index].after = this.milestone.after
      } else {
        const aux = {
          name: this.milestone.name,
          days: this.milestone.days,
          inReport: this.milestone.inReport,
          after: this.milestone.after
        }
        this.milestoneItems.push(aux)
      }

      this.cancelMilestone()
    },
    cancelMilestone() {
      this.milestone = { ...milestoneDefault }
      this.dialogMilestone = false
    },
    getLabelMilestone() {
      if (this.milestone.after) {
        return 'Days After Initial Date'
      }
      return 'Days Before Initial Date'
    },
    addMilestone() {
      this.dialogMilestone = true
    },
    save() {
      if (this.name === '') {
        this.$snotify.error('Gantt name is required', 'Error')
        return
      }

      if (!this.currentType.name) {
        const data = {
          name: this.name,
          value: this.name.replace(/ /g, '_').toLowerCase(),
          hasCalculatedDates: this.hasCalculatedDates,
          milestoneItems: this.milestoneItems,
          projectStartDateDays: this.projectStartDateDays,
          milestoneName: this.milestoneName,
          description: this.description
        }
        if (this.$h.dg(this.settings, 'gantts')) {
          this.settings.gantts.push(data)
        } else {
          this.settings.gantts = []
          this.settings.gantts[0] = data
        }
      } else {
        this.duplicate = { ...this.currentType }
        this.currentType.name = this.name
        this.currentType.value = this.name.replace(/ /g, '_').toLowerCase()
        this.currentType.hasCalculatedDates = this.hasCalculatedDates
        this.currentType.milestoneItems = this.milestoneItems
        this.currentType.projectStartDateDays = this.projectStartDateDays
        this.currentType.milestoneName = this.milestoneName
        this.currentType.description = this.description
        this.updateData()
      }
      this.saveOrder()
      this.$snotify.success('The gantt name has been saved', 'Success')
      this.cancel()
    },
    updateTaskGantts(tasks) {
      if (tasks && tasks.length > 0) {
        tasks = tasks.map(task => {
          if (task.cat_1 && task.cat_1.length > 0) {
            task.cat_1 = this.updateTaskGantts(task.cat_1)
          }

          if (task.cat_2 && task.cat_2.length > 0) {
            task.cat_2 = this.updateTaskGantts(task.cat_2)
          }

          if (task.gantts && task.gantts.length > 0) {
            task.gantts = task.gantts.map(gantt => {
              if (gantt.gantt.name === this.duplicate.name && gantt.gantt.value === this.duplicate.value && gantt.gantt.milestoneName === this.duplicate.milestoneName) {
                gantt.gantt = { ...this.currentType }
              }
              return gantt
            })
          }
          return task
        })
        return tasks
      } else {
        return []
      }
    },
    saveOrder() {
      const promise = new Promise((resolve, reject) => {
        try {
          const gantts = this.settings.gantts || []
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc(this.appLabel.settingsCollection)
            .update({
              gantts: gantts
            })
            .then(() => {
              resolve(true)
            })
        } catch (error) {
          reject(error)
        }
      })
      return promise
    },
    updateData() {
      const promise = new Promise((resolve, reject) => {
        try {
          const tasks = this.updateTaskGantts(this.defaultSchedule.tasks)
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc(this.appLabel.scheduleCollection)
            .update({
              tasks: tasks
            })
            .then(() => {
              resolve(true)
            })
        } catch (error) {
          reject(error)
        }
      })
      return promise
    },
    deleteGantt(id, gantt) {
      const confirmation = confirm(
        `Do you want to delete this gantt: ${gantt.name}`
      )
      if (confirmation) {
        this.submitDelete(id, gantt)
      }
    },
    submitDelete(id) {
      this.settings.gantts.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          gantts: this.settings.gantts
        })
        .then(() => {
          this.$snotify.success('The Gantt name has been deleted', 'Success')
          this.cancel()
        })
    },
    edit(id, obj) {
      this.name = obj.name
      this.currentType = obj

      this.hasCalculatedDates = obj.hasCalculatedDates
      this.milestoneName = obj.milestoneName
      this.description = obj.description || ''
      this.projectStartDateDays = obj.projectStartDateDays
      this.milestoneItems = obj.milestoneItems
      this.showForm = true
    },
    cancel() {
      this.name = ''
      this.currentType = {}
      this.duplicate = {}
      this.hasCalculatedDates = false
      this.showForm = false
      this.milestoneName = ''
      this.description = ''
      this.projectStartDateDays = 0
      this.milestoneItems = []
      this.milestone = { ...milestoneDefault }
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.settingsCollection),

      milestones: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.milestonesCollection),

      defaultSchedule: db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.scheduleCollection)
    }
  }
}
</script>

<style lang="scss" scope>
.mainList {
  border: 1px solid #ccc;
  .v-list__tile__action {
    width: 20%;

    button {
      z-index: 1;
      margin: 0px !important;
    }
  }
  .myListHeader {
    .v-list__tile__action {
      padding-right: 10px;

    }
  }
  .myList {
    border-bottom: 1px solid #ccc;

    &:first-child {
      border-top: 1px solid #ccc;
    }
    &:nth-child(odd) {
      background: #f9f9f9;
    }
    &:last-child {
      border-bottom: none;
    }
  }
  .v-list__tile__content {
    font-size: 13px;
  }
}
</style>

<template>
  <component-template>
    <template slot="button">
      <v-btn
        color="blue"
        fab
        light
        small
        @click="showForm = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-container class="pt-0 rounded-lg">
      <label>Schedule Type</label>
      <v-data-table
        :headers="headers"
        :items="settings.gantts"
      >
        <template v-slot:items="props">
          <td>{{ props.item.name }}</td>
          <td class="text-right">
            <v-btn
              icon
              small
              text
              @click.prevent="edit(props.index, props.item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              small
              text
              @click.prevent="deleteGantt(props.index, props.item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-container>

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
        <v-divider class="grey lighten-3" />
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
              outline
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
                <v-textarea
                  v-model="description"
                  color="blue"
                  label="Description"
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
                  color="blue"
                  :items="milestones.names"
                  label="Initial Milestone Name"
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
                        icon
                        light
                        small
                        text
                        @click="editMilestone(props.item, props.index)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        color="blue"
                        icon
                        light
                        small
                        text
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
                  outline
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
  </component-template>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import ComponentTemplate from '../ComponentTemplate'
import { mapState, mapGetters } from 'vuex'

const milestoneDefault = {
  name: '',
  after: true,
  days: '',
  inReport: false
}
export default {
  components: {
    ComponentTemplate
  },
  data() {
    return {
      milestones: {},
      name: '',
      currentType: {},
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
      .collection('planned_settings')
      .doc(this.appLabel.settingsCollection)
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('planned_settings')
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
        return 'Days After Date'
      }
      return 'Days Before Date'
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
          this.settings.gantts.push(data)
        }
      } else {
        this.currentType.name = this.name
        this.currentType.description = this.description
        this.currentType.value = this.name.replace(/ /g, '_').toLowerCase()
        this.currentType.hasCalculatedDates = this.hasCalculatedDates
        this.currentType.milestoneItems = this.milestoneItems
        ;
        (this.currentType.projectStartDateDays = this.projectStartDateDays),
        (this.currentType.milestoneName = this.milestoneName)
      }

      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          gantts: this.settings.gantts
        })
      this.$snotify.success('The gantt name has been saved', 'Success')
      this.cancel()
    },
    deleteGantt(id, gantt) {
      const confirmation = confirm(
        `Do you want to delete this gantt: ${gantt.name}`
      )
      if (confirmation) {
        this.submitDelete(id, gantt)
      }
    },
    submitDelete(id, gantt) {
      this.settings.gantts.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
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
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection),
      milestones: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.milestonesCollection)
    }
  }
}
</script>

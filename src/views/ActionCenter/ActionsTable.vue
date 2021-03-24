<template>
  <v-container
    class="rounded-lg"
    fluid
  >
    <v-row class="text-center">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="activities"
          :items-per-page="10"
          :loading="loading"
        >
          <template v-slot:item.description="{ item }">
            <span>{{ item.description.substr(0, 25) }}</span>
          </template>

          <template v-slot:item.author="{ item }">
            <span> - </span>
          </template>

          <template v-slot:item.assignees="{ item }">
            <v-avatar
              v-for="(assignee, index) in item.assignees"
              :key="'assignee'+ index"
              size="28"
              style="margin-left:-5px"
            >
              <v-img
                v-if="assignee.profilePic !== ''"
                :src="assignee.profilePic"
              />
              <v-icon
                v-else
                color="light-blue lighten-3"
              >
                mdi-account
              </v-icon>
            </v-avatar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon
              class="mr-2"
              small
              @click="showEditActivityDialog(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="showConfirmDeleteDialog(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-col>

      <v-dialog
        v-model="dialogEdit"
        max-width="450px"
      >
        <v-card>
          <v-card-title>Edit activity</v-card-title>
          <v-card-text>
            <v-container class="rounded-lg">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="editingActivity.title"
                    label="Title"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="editingActivity.description"
                    label="Summary"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="editingActivity.status"
                    label="Status"
                  />
                </v-col>

                <v-col cols="12">
                  <v-menu
                    v-model="startDatePicker"
                    :close-on-content-click="false"
                    min-width="290px"
                    :nudge-right="40"
                    offset-y
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editingActivity.start_date"
                        v-bind="attrs"
                        label="Start date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="editingActivity.start_date"
                      @input="startDatePicker = false"
                    />
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <v-menu
                    v-model="dueDatePicker"
                    :close-on-content-click="false"
                    min-width="290px"
                    :nudge-right="40"
                    offset-y
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editingActivity.due_date"
                        v-bind="attrs"
                        label="Due date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="editingActivity.due_date"
                      @input="dueDatePicker = false"
                    />
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <v-menu
                    v-model="endDatePicker"
                    :close-on-content-click="false"
                    min-width="290px"
                    :nudge-right="40"
                    offset-y
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editingActivity.end_date"
                        v-bind="attrs"
                        label="End date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="editingActivity.end_date"
                      @input="endDatePicker = false"
                    />
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="editingActivity.assignment_list"
                    chips
                    color="green"
                    deletable-chips
                    hide-details
                    hide-no-data
                    hide-selected
                    item-text="user.firstName"
                    item-value="user.id"
                    :items="companyUsers"
                    label="People"
                    multiple
                    single-line
                  >
                    <template
                      slot="item"
                      slot-scope="data"
                    >
                      <span> {{ data.item.user.firstName }} {{ data.item.user.lastName }} </span>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              text
              @click="dialogEdit = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="saveActivity"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialogDelete"
        max-width="600px"
      >
        <v-card>
          <v-card-title class="headline">
            Are you sure you want to delete this activity?
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              text
              @click="dialogDelete = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="red darken-1"
              text
              @click="deleteActivity"
            >
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import {
  mapMutations,
  mapActions,
  mapState,
  mapGetters
} from 'vuex'
import { pick } from 'lodash'

export default {

  name: 'ActionsTable',

  data: () => ({
    headers: [
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' },
      { text: 'Author', value: 'author' },
      { text: 'Assignees', value: 'assignees' },
      { text: 'Status', value: 'status' },
      { text: 'Activity Type', value: 'type' },
      { text: 'Requested Date', value: 'requested_date' },
      { text: 'Start Date', value: 'start_date' },
      { text: 'Due Date', value: 'due_date' },
      { text: 'End Date', value: 'end_date' },
      { text: 'Actions', value: 'actions' }
    ],
    editingActivity: {},
    deletingActivity: {},
    dialogEdit: false,
    dialogDelete: false,
    loading: false,
    startDatePicker: false,
    dueDatePicker: false,
    endDatePicker: false
  }),

  computed: {
    ...mapState('WorkActivity', {
      activities: state => state.list
    }),
    ...mapGetters('Companies', {
      companyUsers: 'getCurrentCompanyUsers'
    })
  },

  methods: {
    ...mapMutations('PageControl', {
      setShowSidePanels: 'setShowSidePanels'
    }),

    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),

    ...mapActions('WorkActivity', {
      getActivityList: 'getList',
      saveActivityItem: 'updateWork',
      deleteActivityItem: 'deleteWork'
    }),

    showEditActivityDialog(activity) {
      this.editingActivity = {
        ...activity,
        assignment_list: activity.assignees.map(u => u.id),
        preview_list: activity.assignees.map(u => u.id)
      }
      this.dialogEdit = true
    },

    showConfirmDeleteDialog(activity) {
      this.deletingActivity = activity
      this.dialogDelete = true
    },

    async saveActivity() {
      try {
        this.loading = true
        const activity = pick(
          this.editingActivity,
          'title', 'description', 'status', 'start_date', 'due_date', 'end_date',
          'assignment_list', 'preview_list'
        )

        await this.saveActivityItem({ id: this.editingActivity.id, activity })
        this.loading = false
        this.dialogEdit = false
      } catch (e) {
        this.loading = false
        this.dialogEdit = false
        this.notifDanger('There was an error while updating activity')
      }
    },

    async deleteActivity() {
      try {
        this.loading = true
        await this.deleteActivityItem(this.deletingActivity.id)
        this.loading = false
        this.dialogDelete = false
      } catch (e) {
        this.loading = false
        this.dialogDelete = false
        this.notifDanger('There was an error while deleting activity')
      }
    }
  },

  async mounted() {
    this.setShowSidePanels(false)

    try {
      this.loading = true
      await this.getActivityList()
      this.loading = false
    } catch (e) {
      this.loading = false
      this.notifDanger('There was an error while loading the Activities')
    }
  },

  beforeDestroy() {
    this.setShowSidePanels(true)
  }
}
</script>

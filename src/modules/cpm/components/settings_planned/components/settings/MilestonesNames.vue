<template>
  <div>
    <v-card>
      <v-card-title class="relative">
        <portal
          v-if="included"
          to="milestones"
        >
          <v-btn
            absolute
            color="white"
            fab
            light
            right
            small
            @click="showForm = true"
          >
            <v-icon color="blue">
              mdi-plus
            </v-icon>
          </v-btn>
        </portal>
        <v-btn
          v-else
          absolute
          color="blue"
          fab
          light
          right
          small
          @click="showForm = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="vertical-scroll">
        <div class="form-group">
          <label>Current Name</label>
          <v-list
            class="mainList"
            dense
          >
            <v-list-tile class="myListHeader">
              <v-list-tile-content>Name</v-list-tile-content>
              <v-list-tile-action>Action</v-list-tile-action>
            </v-list-tile>
            <draggable
              v-model="settings.names"
              @end="drag = false"
              @start="drag = true"
              @update="saveOrder"
            >
              <v-list-tile
                v-for="(item, key) in settings.names"
                :key="key"
                class="myList"
              >
                <v-list-tile-avatar>
                  <v-icon
                    color="blue"
                    small
                  >
                    mdi-drag-variant
                  </v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>{{ item }}</v-list-tile-content>
                <v-list-tile-action
                  style="flex-direction:row; justify-content: flex-end;"
                >
                  <v-btn
                    class="xs-btn"
                    icon
                    small
                    text
                    @click.prevent="editElement(key, item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    class="xs-btn"
                    icon
                    small
                    text
                    @click.prevent="deleteElement(key, item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </draggable>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
    <v-dialog
      v-if="showForm"
      v-model="showForm"
      max-width="800px"
      persistent
      scrollable
    >
      <v-card class="mt-2 rounded-lg">
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            Milestone Names
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <v-form ref="form">
            <v-row>
              <v-col sm="6">
                <v-text-field
                  v-model="element"
                  color="blue"
                  label="Milestones Name"
                />
                <input
                  v-model="currentElement"
                  type="hidden"
                >

                <chrome-picker v-model="color" />
              </v-col>
              <v-col sm="6">
                <v-list dense>
                  <v-subheader>
                    Valid Dates
                    <v-btn
                      absolute
                      color="white"
                      dark
                      fab
                      right
                      small
                      @click="showValidForm = true"
                    >
                      <v-icon color="blue">
                        mdi-plus
                      </v-icon>
                    </v-btn>
                  </v-subheader>
                  <div class="myBox">
                    <v-list-tile
                      v-for="(item, index) in validDates"
                      :key="index"
                      @click=""
                    >
                      <v-list-tile-content>
                        <v-list-tile-title>{{ $moment(item).format('MM/DD/YYYY') }}</v-list-tile-title>
                      </v-list-tile-content>

                      <v-list-tile-action>
                        <v-icon @click="editValidDate(item, index)">
                          mdi-pencil
                        </v-icon>
                      </v-list-tile-action>
                      <v-list-tile-action>
                        <v-icon @click.prevent="deleteValidDate(key, item)">
                          mdi-delete
                        </v-icon>
                      </v-list-tile-action>
                    </v-list-tile>
                  </div>
                </v-list>

                <link-milestones-to-tasks
                  :options="links"
                  @updateLinks="updateLinks"
                />
                <v-checkbox
                  v-model="linkedToTaskEndDate"
                  label="Linked to task end date?"
                />
              </v-col>
            </v-row>

            <v-btn
              color="blue"
              outline
              @click="cancel"
            >
              Cancel
            </v-btn>
            <v-btn
              color="blue"
              dark
              type="submit"
              @click="save"
            >
              {{ submitLoading ? 'Saving...' : 'Save' }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showValidForm"
      max-width="400px"
    >
      <v-card>
        <v-card-title
          class="title"
          primary-title
        >
          Valid Date
        </v-card-title>
        <v-card-text class="vertical-scroll">
          <v-menu
            v-model="validDatePicker"
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
                v-model="validDateUsa"
                :error-messages="validDateError"
                hint="MM/DD/YYYY format"
                label="Date"
                persistent-hint
                prepend-inner-icon="event"
                v-on="on"
              />
            </template>

            <v-date-picker
              v-model="validDateForPicker"
              no-title
              @input="validDatePicker = false"
            />
          </v-menu>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue"
            outline
            @click.prevent="showValidForm = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-3"
            dark
            @click.prevent="saveValidDate"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { Chrome } from 'vue-color'
import { mapState, mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import LinkMilestonesToTasks from './LinkMilestonesToTasks'
export default {
  components: {
    'chrome-picker': Chrome,
    draggable,
    LinkMilestonesToTasks
  },
  props: {
    included: {
      default: Boolean,
      type: false
    }
  },
  data() {
    return {
      element: '',
      currentElement: '',
      displayOnDashboard: false,
      linkedToTaskEndDate: false,
      color: {},
      milestones: [],
      settings: {},
      links: [],
      submitLoading: false,
      showForm: false,
      pagination: {
        rowsPerPage: -1
      },
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Action',
          value: 'action'
        }
      ],
      rules: {
        required: value => !!value || 'Required.'
      },
      showValidForm: false,
      validDatePicker: false,
      validDateUsa: '',
      validDateForPicker: '',
      validDates: [],
      currentIndex: -1
    }
  },
  computed: {
    ...mapGetters(['appLabel']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    validDateError() {
      if (
        !this.$moment(this.validDateUsa, 'MM/DD/YYYY', true).isValid() &&
        this.validDateUsa !== ''
      ) {
        return 'Invalid Date MM/DD/YYYY'
      } else return []
    }
  },
  watch: {
    validDateForPicker(value) {
      this.validDateUsa = this.$moment(value).format('MM/DD/YYYY')
    }
  },
  mounted() {
    db.collection('settings')
      .doc(this.currentCompany.id)
      .collection('planned_settings')
      .doc(this.appLabel.milestonesCollection)
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('planned_settings')
            .doc(this.appLabel.milestonesCollection)
            .set({
              names: [],
              milestones: []
            })
        } else {
          const data = settings.data()
          this.milestones = data.milestones ? data.milestones : []
        }
      })
  },
  methods: {
    updateLinks(payload) {
      this.links = payload
    },
    deleteValidDate(index, item) {
      this.validDates.splice(index, 1)
    },
    editValidDate(date, index) {
      this.currentIndex = index
      this.validDateForPicker = date
      this.showValidForm = true
    },
    saveValidDate() {
      if (!this.validDateUsa) {
        this.$snotify.error('A date is required', 'Error')
        return ''
      }
      if (this.currentIndex != -1) {
        this.validDates[this.currentIndex] = this.$moment(this.validDateUsa).toISOString()
      } else {
        this.validDates.push(this.$moment(this.validDateUsa).toISOString())
      }

      this.showValidForm = false
      this.validDateUsa = ''
      this.validDatePicker = ''
    },
    saveOrder() {
      const promise = new Promise((resolve, reject) => {
        try {
          const names = this.settings.names || []
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('planned_settings')
            .doc(this.appLabel.milestonesCollection)
            .update({
              names: names
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
    save() {
      if (this.element == '') {
        this.$snotify.error('Milestones name is required', 'Error')
        return
      }
      if (this.currentElement === '') {
        if (!this.settings.names) {
          this.settings.names = []
        }
        this.settings.names.push(this.element)
      } else {
        this.$set(this.settings.names, this.currentElement, this.element)
      }
      const find = this.milestones.find(row => row.name == this.element)
      if (find) {
        find.displayOnDashboard = this.displayOnDashboard
        find.linkedToTaskEndDate = this.linkedToTaskEndDate
        find.color = this.color || {}
        find.validDates = this.validDates
        find.links = this.links
      } else {
        this.milestones.push({
          name: this.element,
          displayOnDashboard: this.displayOnDashboard,
          linkedToTaskEndDate: this.linkedToTaskEndDate,
          color: this.color || {},
          validDates: this.validDates,
          links: this.links
        })
      }

      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.milestonesCollection)
        .update({
          names: this.settings.names,
          milestones: this.milestones
        })
      this.$snotify.success('The Milestones Name has been saved', 'Success')
      this.cancel()
    },
    deleteElement(id, name) {
      const confirmation = confirm(
        `Do you want to delete this Milestones Name: ${name}`
      )
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.names.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.milestonesCollection)
        .update({
          names: this.settings.names,
          milestones: []
        })
      this.$snotify.success('The Milestones Name has been deleted', 'Success')
    },
    editElement(id, name) {
      this.displayOnDashboard = false
      this.linkedToTaskEndDate = false
      this.element = name
      this.currentElement = id
      const find = this.milestones.find(row => row.name == name)
      if (find) {
        this.displayOnDashboard = find.displayOnDashboard
        this.linkedToTaskEndDate = find.linkedToTaskEndDate
        this.color = find.color || {}
        this.validDates = find.validDates || []
        this.links = find.links || []
      }

      this.showForm = true
    },
    cancel() {
      this.element = ''
      this.currentElement = ''
      this.showForm = false
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.milestonesCollection)
    }
  }
}
</script>

<style lang="scss">
  .myBox {
    height: 300px;
    overflow-y: scroll;
  }
  .mainList {

    .myList {

      .xs-btn {
          width: 20px;
          height: 20px;
      }

      .v-list__tile__action {
        i {
            font-size: 16px;
        }
        button {
          margin: 0;
        }
      }

    }
  }

</style>

<template>
  <component-template>
    <portal
      v-if="included"
      to="schedule"
    >
      <v-btn
        absolute
        color="white"
        dark
        fab
        right
        small
        @click="newL1"
      >
        <v-icon color="blue">
          mdi-plus
        </v-icon>
      </v-btn>
    </portal>
    <template slot="button">
      <v-btn
        v-if="!included"
        color="primary"
        dark
        fab
        small
        @click="newL1"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-container class="pt-0 rounded-lg">
      <v-row>
        <v-col
          class="list-container"
          cols="12"
        >
          <v-toolbar
            class="mb-4"
            dense
            flat
          >
            <h5>Add or Edit Tasks</h5>
          </v-toolbar>
          <v-expansion-panel class="elevation-0">
            <draggable
              v-model="settings.tasks"
              class="draggable-container"
              :options="{ group: 'tasks' }"
              @end="drag = false"
              @start="drag = true"
              @update="saveOrder"
            >
              <v-expansion-panel-content
                v-for="(item, index) in settings.tasks"
                :key="index"
                :hide-default-footer="!(item.cat_1 && item.cat_1.length > 0)"
                :style="getStyle(item)"
              >
                <v-card
                  slot="header"
                  class="pa-0"
                  flat
                  :style="getStyle(item)"
                >
                  <v-card-title class="pa-0">
                    <div style="width: 70%">
                      {{ item.name }} {{ getGanttsLabels(item) }}
                    </div>

                    <v-spacer />

                    <v-icon
                      class="ml-0 mr-2 pointer"
                      color="#757575"
                      size="20"
                      @click.stop="addL1(item)"
                    >
                      mdi-plus
                    </v-icon>

                    <v-icon
                      class="ml-0 mr-2 pointer"
                      color="#757575"
                      size="20"
                      @click.stop="edit(item)"
                    >
                      mdi-pencil
                    </v-icon>

                    <v-icon
                      class="ml-0 mr-0 pointer"
                      color="#f44336"
                      size="20"
                      @click.stop="deleteL1(index)"
                    >
                      mdi-delete
                    </v-icon>
                  </v-card-title>
                </v-card>

                <v-card
                  class="pa-0"
                  flat
                >
                  <v-card-text class="pa-0 vertical-scroll">
                    <v-expansion-panel class="elevation-0">
                      <v-expansion-panel-content
                        v-for="(itemL2, indexL2) in item.cat_1"
                        :key="indexL2"
                        hide-default-footer
                        :style="getStyle(itemL2)"
                      >
                        <v-card
                          slot="header"
                          class="pa-0 pl-4"
                          flat
                          :style="getStyle(itemL2)"
                        >
                          <v-card-title class="pa-0">
                            <div style="width: 70%">
                              {{ itemL2.name }} {{ getGanttsLabels(itemL2) }}
                            </div>
                            <v-spacer />
                            <v-btn
                              class="ma-1"
                              icon
                              small
                              @click.stop="edit(itemL2)"
                            >
                              <v-icon
                                color="grey"
                                dark
                                small
                              >
                                mdi-pencil
                              </v-icon>
                            </v-btn>
                            <v-btn
                              class="ma-1"
                              icon
                              small
                              @click.stop="deleteL2(item, indexL2)"
                            >
                              <v-icon
                                color="grey"
                                dark
                                small
                              >
                                mdi-delete
                              </v-icon>
                            </v-btn>
                          </v-card-title>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </draggable>
          </v-expansion-panel>
        </v-col>

        <v-dialog
          v-model="showForm"
          max-width="800px"
          persistent
          scrollable
        >
          <v-card class="pb-2 rounded-lg">
            <v-card-text class="vertical-scroll">
              <v-col cols="12">
                <v-container
                  class="rounded-lg"
                  fluid
                  grid-list-md
                >
                  <v-row>
                    <v-col md="12">
                      <v-toolbar
                        id="budget-cost-duration-form"
                        class="mb-4"
                        color="grey lighten-3"
                        dense
                        flat
                        multiple
                      >
                        <h5>{{ formTitle }}</h5>
                      </v-toolbar>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col md="12">
                      <v-text-field
                        v-model="name"
                        color="blue"
                        label="Task Name"
                      />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col md="4">
                      <v-btn
                        outline
                        @click="showColor = !showColor"
                      >
                        Color
                        <v-icon
                          v-if="color && color.hex"
                          v-show="color.hex"
                          :color="color.hex"
                        >
                          mdi-brightness-1
                        </v-icon>
                      </v-btn>
                    </v-col>

                    <v-col
                      v-show="showColor"
                      md="4"
                    >
                      <chrome-picker v-model="color" />
                    </v-col>
                    <v-col md="4">
                      <v-checkbox
                        v-model="displaySubTasks"
                        label="Display Sub Tasks on Forecasts"
                      />
                    </v-col>
                  </v-row>

                  <v-row
                    v-show="action !== 'new' && action !== 'add'"
                  >
                    <v-col md="12">
                      <v-container
                        class="pa-0 rounded-lg"
                        fluid
                        grid-list-md
                      >
                        <v-row>
                          <v-col
                            class="title"
                            md="4"
                            sm="12"
                          >
                            Schedule Types
                          </v-col>
                          <v-col
                            md="4"
                            sm="12"
                          >
                            <v-btn
                              color="blue"
                              dark
                              icon
                              @click="openAddGanttDialog"
                            >
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>

                        <v-row
                          v-show="ganttDialog"
                          class="modal-gantt"
                        >
                          <v-col md="12">
                            <v-container
                              class="rounded-lg"
                              fluid
                              grid-list-md
                            >
                              <v-row>
                                <v-col
                                  class="title"
                                  md="12"
                                >
                                  {{ ganttModal.title }}
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col md="12">
                                  Select a Schedule Type
                                  <v-select
                                    v-model="ganttModal.gantt"
                                    item-text="name"
                                    :items="availableGantts"
                                    label="name"
                                    return-object
                                  />
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-text-field
                                  v-model="ganttModal.duration"
                                  label="Duration"
                                />
                              </v-row>
                              <v-row>
                                <v-col md="12">
                                  Fiscal Year
                                  <v-select
                                    v-model="ganttModal.budgetFiscalYear"
                                    label="name"
                                    :options="fiscalYears"
                                  />
                                </v-col>
                              </v-row>

                              <v-row>
                                <v-col md="12">
                                  <budget-category-select
                                    :category="
                                      $h.dg(ganttModal, 'budgetCategories', [])
                                    "
                                    multiple
                                    @newCategory="setBudgetCategory"
                                  />
                                </v-col>
                              </v-row>

                              <v-row>
                                <v-text-field
                                  v-model="ganttModal.budgetPercentage"
                                  label="Budget Percentage %"
                                />
                              </v-row>
                              <v-row>
                                <v-col
                                  md="4"
                                  sm="12"
                                >
                                  <v-btn
                                    color="blue"
                                    outline
                                    @click="clearGanttDialog"
                                  >
                                    Cancel
                                  </v-btn>
                                </v-col>
                                <v-col
                                  md="5"
                                  sm="12"
                                >
                                  <v-btn
                                    color="blue"
                                    dark
                                    @click="saveGantt"
                                  >
                                    Save Gantt
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-col>
                        </v-row>

                        <v-row
                          v-show="!ganttDialog"
                        >
                          <v-col md="12">
                            <v-data-table
                              :headers="headers"
                              hide-default-footer
                              :items="ganttsInTask"
                            >
                              <template v-slot:items="props">
                                <td>{{ props.item.gantt.name }}</td>
                                <td>{{ props.item.duration }}</td>
                                <td>
                                  <v-btn
                                    color="blue"
                                    dark
                                    icon
                                    @click="editGantt(props.item, props.index)"
                                  >
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                  <v-btn
                                    color="blue"
                                    dark
                                    icon
                                    @click="deleteGantt(props.index)"
                                  >
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </td>
                              </template>
                            </v-data-table>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-col>
                  </v-row>

                  <v-row
                    v-show="!ganttDialog"
                  >
                    <v-col md="4">
                      <v-btn
                        :disabled="loading"
                        @click="cancel"
                      >
                        Cancel
                      </v-btn>
                    </v-col>
                    <v-col md="4">
                      <v-btn
                        color="blue"
                        dark
                        :loading="loading"
                        type="submit"
                        @click="save"
                      >
                        Save
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </component-template>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import ComponentTemplate from '../ComponentTemplate'
// import * as easings from 'vuetify/es5/util/easing-patterns'
import { Chrome } from 'vue-color'
import { mapState, mapGetters } from 'vuex'
import draggable from 'vuedraggable'

import BudgetCategorySelect from '@/modules/cpm/components/projects/_partials/BudgetCategorySelect'

export default {
  name: 'DefaultSchedule',
  components: {
    'chrome-picker': Chrome,
    ComponentTemplate,
    draggable,
    BudgetCategorySelect
  },
  props: {
    included: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      settings: {},
      loading: false,
      name: '',
      duration: 0,
      color: {},
      action: '',
      level: 0,
      currentItem: {},
      currentIndex: -1,
      showForm: false,
      formTitle: '',
      options: {
        duration: 300,
        offset: 0,
        easing: 'easeInOutCubic'
      },
      // easings: Object.keys(easings),
      ganttsSettings: [],
      showColor: false,
      headers: [
        { text: 'Schedule Type', value: 'name' },
        { text: 'Duration', value: 'duration' },
        { text: 'Actions', value: 'name' }
      ],
      ganttDialog: false,
      ganttsInTask: [],
      ganttModal: {
        duration: 0,
        title: 'Add Gantt',
        type: 'add',
        index: '',
        gantt: {},
        budgetFiscalYear: {},
        budgetCategories: [],
        budgetPercentage: 0
      },
      fiscalYears: [],
      displaySubTasks: false
    }
  },
  computed: {
    ...mapGetters(['appLabel']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    availableGantts() {
      if (!this.ganttsInTask.length) {
        return this.ganttsSettings
      }

      // create hash of gantt
      const auxGantts = {}
      this.ganttsInTask.map(ganttInTask => {
        auxGantts[ganttInTask.gantt.value] = ganttInTask.gantt
      })

      return this.ganttsSettings.filter(gantt => {
        if (!auxGantts[gantt.value]) {
          return true
        }
        return false
      })
    }
  },
  mounted() {
    db.collection('settings')
      .doc(this.currentCompany.id)
      .collection('planned_settings')
      .doc(this.appLabel.scheduleCollection)
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('planned_settings')
            .doc(this.appLabel.scheduleCollection)
            .set({
              tasks: []
            })
        }
      })
    this.loadSettings()
    db.collection('settings')
      .doc(this.currentCompany.id)
      .collection('planned_settings')
      .doc(this.appLabel.settingsCollection)
      .get()
      .then(snap => {
        this.ganttsSettings = snap.data().gantts
        this.fiscalYears = snap.data().fiscalYears
      })
  },
  methods: {
    getGanttsLabels(item) {
      if (item.gantts && item.gantts.length > 0) {
        let label = ''
        for (let i = 0; i < item.gantts.length; i++) {
          const element = item.gantts[i]
          label += element.gantt.name + ' '
        }
        return 'Gantts:' + label
      }
      return ''
    },
    editGantt(ganttObj, index) {
      this.ganttModal.type = 'update'
      this.setGanttDialogTitle()
      this.ganttModal.duration = parseInt(ganttObj.duration)
      this.ganttModal.gantt = ganttObj.gantt
      this.ganttModal.index = index
      this.ganttModal.budgetFiscalYear = ganttObj.budgetFiscalYear
        ? ganttObj.budgetFiscalYear
        : {}
      this.ganttModal.budgetPercentage = ganttObj.budgetPercentage
        ? ganttObj.budgetPercentage
        : 0
      this.ganttModal.budgetCategories = this.$h.dg(ganttObj, 'budgetCategories', [])

      this.ganttDialog = true
    },
    deleteGantt(index) {
      this.ganttsInTask.splice(index, 1)

      this.currentItem.gantts = this.ganttsInTask
      this.updateData('Gantt Deleted')
    },
    setGanttDialogTitle() {
      this.ganttModal.title = 'Add Gantt'
      if (this.ganttModal.type === 'update') {
        this.ganttModal.title = 'Update Gantt'
      }
    },
    clearGanttDialog() {
      this.ganttDialog = false
      this.ganttModal.duration = 0
      this.ganttModal.type = 'add'
      this.ganttModal.gantt = {}
      this.ganttModal.index = ''
      this.ganttModal.budgetFiscalYear = {}
      this.ganttModal.budgetPercentage = 0
      this.setGanttDialogTitle()
    },
    openAddGanttDialog() {
      this.clearGanttDialog()
      this.ganttDialog = true
    },
    saveGantt() {
      if (!this.ganttModal.gantt.value) {
        this.$snotify.error('Please select a gantt', 'Error')
        return
      }

      if (
        this.ganttModal.duration === '' ||
        parseInt(this.ganttModal.duration) < 0
      ) {
        this.$snotify.error('Please add a valid duration', 'Error')
        return
      }

      if (this.ganttModal.type === 'add') {
        const aux = {
          gantt: this.ganttModal.gantt,
          duration: parseInt(this.ganttModal.duration),
          budgetCategories: this.ganttModal.budgetCategories,
          budgetFiscalYear: this.ganttModal.budgetFiscalYear,
          budgetPercentage: parseFloat(this.ganttModal.budgetPercentage)
        }
        this.ganttsInTask.push(aux)

        if (!this.currentItem.gantts) {
          this.currentItem.gantts = []
        }

        this.currentItem.gantts = this.ganttsInTask

        this.$nextTick(() => {
          this.updateData('Gantt Added').then(() => {
            this.clearGanttDialog()
          })
        })
      } else {
        this.ganttsInTask[this.ganttModal.index].gantt = this.ganttModal.gantt
        this.ganttsInTask[this.ganttModal.index].duration = parseInt(
          this.ganttModal.duration
        )
        this.ganttsInTask[
          this.ganttModal.index
        ].budgetFiscalYear = this.ganttModal.budgetFiscalYear
        this.ganttsInTask[this.ganttModal.index].budgetPercentage = parseFloat(
          this.ganttModal.budgetPercentage
        )
        this.ganttsInTask[
          this.ganttModal.index
        ].budgetCategories = this.ganttModal.budgetCategories

        this.$nextTick(() => {
          this.updateData('Gantt Updated').then(() => {
            this.clearGanttDialog()
          })
        })
      }
    },
    getStyle(item) {
      let color = 'white'
      if (item.color && item.color.hex) {
        color = item.color.hex
      }
      return `background-color:${color};`
    },
    newL1() {
      this.action = 'new'
      this.level = 1
      this.showForm = true
      this.formTitle = 'Create a new Task'
      this.clearGanttDialog()
    },
    addL1(item) {
      this.action = 'add'
      this.level = 1
      this.currentItem = item
      this.showForm = true
      this.$vuetify.goTo(300, this.options)
      this.formTitle = `Adding a Sub Task for Task: ${item.name}`
      this.clearGanttDialog()
    },
    edit(item) {
      this.action = 'edit'
      this.currentItem = item
      this.color = item.color ? item.color : {}
      this.ganttsInTask = item.gantts ? item.gantts : []
      this.name = item.name
      this.duration = item.duration
      this.displaySubTasks = item.displaySubTasks ? true : false
      this.showForm = true
      this.$vuetify.goTo(300, this.options)
      this.formTitle = `Editing  ${item.name}`
    },
    deleteL1(index) {
      const confirmation = confirm('Are you sure you want to delete this task?')
      if (confirmation) {
        this.settings.tasks.splice(index, 1)

        this.$nextTick(() => {
          this.updateData('Task Deleted').then(() => {
            this.cancel()
          })
        })
      }
    },
    deleteL2(parentItem, childIndex) {
      const confirmation = confirm(
        'Are you sure you want to delete this subtask?'
      )
      if (confirmation) {
        parentItem.cat_1.splice(childIndex, 1)
        this.updateData('Task Deleted').then(() => {
          this.cancel()
        })
      }
    },
    save() {
      this.loading = true
      if (this.name === '') {
        this.$snotify.error('Task name is required', 'Error')
        this.cancel()
        return
      }

      if (this.action === 'new') {
        if (!this.settings.tasks) {
          this.settings.tasks = []
        }
        this.settings.tasks.push({
          name: this.name,
          displaySubTasks: this.displaySubTasks,
          duration: this.duration,
          color: this.color,
          cat_1: [],
          gantts: []
        })
        this.updateData('Task Updated').then(() => {
          this.cancel()
        })
      } else if (this.action === 'add') {
        if (this.level === 1) {
          if (!this.currentItem.cat_1) {
            this.currentItem.cat_1 = []
          }
          this.currentItem.cat_1.push({
            name: this.name,
            displaySubTasks: this.displaySubTasks,
            duration: this.duration,
            color: this.color,
            cat_2: [],
            gantts: []
          })
        } else if (this.level === 2) {
          if (!this.currentItem.cat_2) {
            this.currentItem.cat_2 = []
          }
          this.currentItem.cat_2.push({
            name: this.name,
            displaySubTasks: this.displaySubTasks,
            duration: this.duration,
            color: this.color,
            gantts: []
          })
        }
        this.updateData('Task Updated').then(() => {
          this.cancel()
        })
      } else if (this.action === 'edit') {
        this.currentItem.name = this.name
        this.currentItem.displaySubTasks = this.displaySubTasks
        this.currentItem.duration = this.duration
        this.currentItem.color = this.color
        this.updateData('Task Updated').then(() => {
          this.cancel()
        })
      }
    },
    updateData(msg) {
      const promise = new Promise((resolve, reject) => {
        try {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('planned_settings')
            .doc(this.appLabel.scheduleCollection)
            .update({
              tasks: this.settings.tasks
            })
            .then(() => {
              this.$snotify.success(msg, 'Success')
              resolve(true)
            })
        } catch (error) {
          reject(error)
        }
      })
      return promise
    },
    cancel() {
      this.loading = false
      this.name = ''
      this.displaySubTasks = false
      this.duration = 0
      this.action = ''
      this.level = 0
      this.currentItem = {}
      this.currentIndex = -1
      this.showForm = false
      this.color = {}
      this.clearGanttDialog()
      this.ganttsInTask = []
    },
    loadSettings() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.scheduleCollection)
        .get()
        .then(snap => {
          this.settings = snap.data()
        })
    },

    saveOrder() {
      try {
        db.collection('settings')
          .doc(this.currentCompany.id)
          .collection('planned_settings')
          .doc(this.appLabel.scheduleCollection)
          .update({
            tasks: this.settings.tasks
          })
          .then(() => {})
      } catch (error) {
        console.error(error)
      }
    },

    setBudgetCategory(categories) {
      const formattedCategories = categories.map(category => ({
        id: this.$h.dg(category, 'id'),
        name: this.$h.dg(category, 'name', 'Undefined'),
        contingency: this.$h.dg(category, 'contingency', false),
        ref: this.getBudgetCategoryRef(category.id),
        code: this.$h.dg(category, 'code', 'Undefined')
      }))
      this.ganttModal.budgetCategories = formattedCategories
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
.list-container {
  position: relative;
}
.list-overlay-cover {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.8);
}

.modal-gantt {
  border: 1px solid black;
}

.draggable-container {
  width: 100%;
}
</style>

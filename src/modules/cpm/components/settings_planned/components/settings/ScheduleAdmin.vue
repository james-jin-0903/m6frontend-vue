<template>
  <component-template>
    <template slot="button">
      <v-btn
        color="primary"
        dark
        icon
        @click="openScheduleDialog"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-container
        class="pa-0 rounded-lg"
        fluid
        grid-list-md
      >
        <v-row>
          <v-col md="12">
            <table class="schedule-dates-list">
              <thead>
                <tr style="border-bottom: thin solid grey;">
                  <th class="pa-3">
                    Date name
                  </th>
                  <th
                    v-for="(header, index) in schedules"
                    :key="index"
                    class="pa-3"
                  >
                    <template v-if="header.value === 'name'">
                      {{ header.name }}
                    </template>
                    <template v-else>
                      <div
                        v-show="
                          !showEditSchedule ||
                            (showEditSchedule && scheduleEdit.id !== header.id)
                        "
                      >
                        {{ header.name }}
                        <v-btn
                          color="blue"
                          icon
                          small
                          @click="openEditSchedule(header, index)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          color="error"
                          icon
                          small
                          @click="deleteSchedule(header, index)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                      <div
                        v-show="
                          showEditSchedule && scheduleEdit.id === header.id
                        "
                      >
                        <v-text-field
                          v-model="scheduleEdit.name"
                          label="Schedule name"
                          name="Schedule name"
                        />
                        <v-btn
                          color="error"
                          :disabled="loading"
                          :loading="loading"
                          outline
                          small
                          text
                          @click="cancelEditSchedule"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          color="blue"
                          :disabled="loading"
                          icon
                          :loading="loading"
                          small
                          @click="saveEditSchedule(header, index)"
                        >
                          <v-icon>mdi-content-save</v-icon>
                        </v-btn>
                      </div>
                    </template>
                  </th>
                  <th>
                    <v-btn
                      color="blue"
                      dark
                      :disabled="loading"
                      :loading="loading"
                      @click="addSchedule"
                    >
                      Add Schedule
                    </v-btn>
                  </th>
                </tr>
              </thead>

              <draggable
                v-model="scheduleDates"
                element="tbody"
                :options="{ group: 'scheduleDates' }"
                @end="drag = false"
                @start="drag = true"
                @update="saveOrder"
              >
                <tr
                  v-for="(date, index) in scheduleDates"
                  class="schedule-item"
                >
                  <td class="pa-3">
                    <div
                      v-show="
                        !showInlineEditing ||
                          (showInlineEditing && dateSchedule.id !== date.id)
                      "
                      :key="index"
                    >
                      {{ date.name }}
                    </div>
                    <div
                      v-show="showInlineEditing && dateSchedule.id === date.id"
                    >
                      <v-text-field v-model="dateSchedule.name" />
                    </div>
                  </td>
                  <template v-for="(schedule, index) in schedules">
                    <td
                      :key="index"
                      class="text-center"
                    >
                      <div
                        v-show="
                          !showInlineEditing ||
                            (showInlineEditing && dateSchedule.id !== date.id)
                        "
                      >
                        {{ date[schedule.slug] ? date[schedule.slug] : 0 }}
                      </div>
                      <div
                        v-show="showInlineEditing && dateSchedule.id === date.id"
                      >
                        <v-text-field
                          v-model="dateSchedule[schedule.slug]"
                        />
                      </div>
                    </td>
                  </template>
                  <td class="text-center">
                    <div v-show="!showInlineEditing">
                      <!-- No editing -->
                      <v-btn
                        color="blue"
                        dark
                        icon
                        @click="editDate(date)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        color="error"
                        dark
                        icon
                        @click="deleteDate(date)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                    <!-- Editing -->
                    <div
                      v-show="showInlineEditing && dateSchedule.id === date.id"
                    >
                      <v-btn
                        color="blue"
                        dark
                        icon
                        @click="saveEditingDate(date)"
                      >
                        <v-icon>mdi-content-save</v-icon>
                      </v-btn>
                      <v-btn
                        color="error"
                        dark
                        outline
                        text
                        @click="cancelEditingDate"
                      >
                        Cancel
                      </v-btn>
                    </div>
                  </td>
                </tr>
              </draggable>
            </table>
          </v-col>
        </v-row>

        <v-dialog
          v-model="dialog"
          max-width="500px"
          transition="dialog-transition"
        >
          <v-card>
            <v-card-text class="vertical-scroll">
              <v-container
                class="rounded-lg"
                fluid
                grid-list-md
              >
                <v-row>
                  <v-col md="12">
                    <v-text-field
                      v-model="dateSchedule.name"
                      label="Date Name"
                      name="Date Name"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-spacer />
                  <v-btn
                    color="error"
                    :disabled="loading"
                    :loading="loading"
                    outline
                    @click="closeSheduleDialog"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue"
                    dark
                    :disabled="loading"
                    :loading="loading"
                    @click="saveDate"
                  >
                    Save
                  </v-btn>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </v-card>
  </component-template>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import draggable from 'vuedraggable'
import ComponentTemplate from '../ComponentTemplate'
import { mapState } from 'vuex'

const dateScheduleOriginal = {
  type: 'add',
  name: '',
  id: ''
}

const scheduleOriginal = {
  name: 'New Schedule',
  slug: 'new-schedule',
  id: ''
}

export default {
  components: {
    ComponentTemplate,
    draggable
  },
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  data() {
    return {
      headers: [{ text: 'Date', value: 'name', sortable: false }],
      dates: [],
      settings: {},

      dialog: false,
      scheduleDates: [],
      schedules: [],
      dateSchedule: { ...dateScheduleOriginal },
      loading: false,

      scheduleEdit: { ...dateScheduleOriginal },
      showEditSchedule: false,

      showInlineEditing: false
    }
  },
  mounted() {
    Promise.all([this.getscheduleDates(), this.getSchedules()]).then(() => {})
  },
  methods: {
    slugify(string) {
      const a =
        'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
      const b =
        'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------'
      const p = new RegExp(a.split('').join('|'), 'g')

      return string
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
    },
    deleteSchedule(header, indexHeader) {
      const confirmation = confirm(
        `Do you want to delete this shedule: ${header.name}`
      )
      if (confirmation) {
        this.loading = true

        db.collection('settings')
          .doc(this.currentCompany.id)
          .collection('planned_settings')
          .doc('rfp')
          .collection('schedules')
          .doc(header.id)
          .delete()
          .then(() => {
            this.schedules.splice(indexHeader, 1)

            this.$snotify.success('The Date has been deleted', 'Success')

            this.loading = false
          })
      }
    },
    cancelEditSchedule() {
      this.scheduleEdit = { ...dateScheduleOriginal }
      this.showEditSchedule = false
    },
    promiseUpdateDateChangeHeader(item) {
      const aux = new Promise((resolve, reject) => {
        try {
          const id = item.id

          // Checking if it has a value then change the key
          if (item[this.scheduleEdit.slug]) {
            const value = item[this.scheduleEdit.slug]

            // Deleting old id
            delete item[this.scheduleEdit.slug]

            // delete item["id"];
            item[this.scheduleEdit.newSlug] = value
          }

          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('planned_settings')
            .doc('rfp')
            .collection('scheduleDates')
            .doc(id)
            .set(item)
            .then(() => {
              resolve(true)
            })
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    saveEditSchedule() {
      if (this.scheduleEdit.id === '') {
        this.$snotify.error('Please select an Schedule', 'Error')
      }

      this.loading = true

      const aux = {
        name: this.scheduleEdit.name,
        slug: this.slugify(this.scheduleEdit.name)
      }

      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('rfp')
        .collection('schedules')
        .doc(this.scheduleEdit.id)
        .update(aux)
        .then(() => {
          const element = this.schedules[this.scheduleEdit.index]
          element.name = aux.name
          element.slug = aux.slug
          this.scheduleEdit.newSlug = aux.slug

          Promise.all(
            this.scheduleDates.map(this.promiseUpdateDateChangeHeader)
          ).then(() => {
            this.$snotify.success('The Schedule has been updated', 'Success')
            this.loading = false
            this.scheduleEdit = { ...dateScheduleOriginal }
            this.dateSchedule = { ...dateScheduleOriginal }
            this.showEditSchedule = false
            this.showInlineEditing = false
          })
        })
    },
    openEditSchedule(header, indexHeader) {
      this.scheduleEdit.name = header.name
      this.scheduleEdit.slug = header.slug
      this.scheduleEdit.id = header.id
      this.scheduleEdit.index = indexHeader
      this.showEditSchedule = true
    },
    addSchedule() {
      this.loading = true
      const aux = { ...scheduleOriginal }
      const createdAt = new Date()
      aux.created_at = createdAt.getTime()

      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('rfp')
        .collection('schedules')
        .add(aux)
        .then(snap => {
          aux.id = snap.id
          aux.class = 'text-center'
          this.schedules.push(aux)
          this.$snotify.success('The Schedule has been added', 'Success')
          this.loading = false
        })
    },
    deleteDate(item) {
      this.loading = true
      const confirmation = confirm(
        `Do you want to delete this date: ${item.name}`
      )
      if (confirmation) {
        this.submitDelete(item)
      }
    },
    submitDelete(item) {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('rfp')
        .collection('scheduleDates')
        .doc(item.id)
        .delete()
        .then(() => {
          const index = this.scheduleDates.findIndex(auxDate => auxDate.id === item.id)

          if (index > -1) {
            this.scheduleDates.splice(index, 1)
            this.$snotify.success('The Date has been deleted', 'Success')
          }

          this.loading = false
        })
    },
    editDate(item) {
      this.dateSchedule.id = item.id
      this.dateSchedule.name = item.name

      // Copying variables
      this.schedules.forEach(schedule => {
        this.dateSchedule[schedule.slug] = item[schedule.slug]
          ? item[schedule.slug]
          : 0
      })

      this.type = 'update'
      this.showInlineEditing = true
      // this.dialog= true;
    },
    saveDate() {
      this.loading = true
      const createdAt = new Date()
      const aux = {
        name: this.dateSchedule.name,
        slug: this.slugify(this.dateSchedule.name),
        created_at: createdAt.getTime()
      }

      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('rfp')
        .collection('scheduleDates')
        .add(aux)
        .then(snap => {
          aux.id = snap.id
          this.scheduleDates.push(aux)
          this.closeSheduleDialog()
          this.$snotify.success('The Date has been added', 'Success')
          this.loading = false
        })
    },
    saveEditingDate(item) {
      const aux = {}

      aux.name = this.dateSchedule.name
      aux.slug = this.slugify(this.dateSchedule.name)

      // Copying variables
      this.schedules.forEach(schedule => {
        aux[schedule.slug] = this.dateSchedule[schedule.slug]
          ? this.dateSchedule[schedule.slug]
          : 0
      })

      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('rfp')
        .collection('scheduleDates')
        .doc(this.dateSchedule.id)
        .update(aux)
        .then(() => {
          item.name = this.dateSchedule.name

          // Copying variables
          this.schedules.forEach(schedule => {
            item[schedule.slug] = this.dateSchedule[schedule.slug]
              ? this.dateSchedule[schedule.slug]
              : 0
          })

          this.$snotify.success('The Date has been updated', 'Success')
          this.loading = false
          this.cancelEditingDate()
        })
    },
    cancelEditingDate() {
      this.showInlineEditing = false
      this.dateSchedule = { ...dateScheduleOriginal }
    },
    closeSheduleDialog() {
      this.dialog = false
      this.dateSchedule.name = ''
      this.dateSchedule.id = ''
      this.dateSchedule.type = 'add'
    },
    openScheduleDialog() {
      this.dialog = true
    },
    saveOrder() {
      try {
        db.collection('settings')
          .doc(this.currentCompany.id)
          .collection('planned_settings')
          .doc('rfp')
          .collection('scheduleDates')
          .set(this.scheduleDates)
          .then(() => {})
      } catch (error) {
        console.error(error)
      }
    },

    getscheduleDates() {
      const aux = new Promise((resolve, reject) => {
        try {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('planned_settings')
            .doc('rfp')
            .collection('scheduleDates')
            .orderBy('created_at', 'asc')
            .get()
            .then(snap => {
              if (!snap.empty) {
                snap.docs.forEach(doc => {
                  const aux = doc.data()
                  aux.id = doc.id
                  this.scheduleDates.push(aux)
                })
              }
              resolve(true)
            })
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    getSchedules() {
      const aux = new Promise((resolve, reject) => {
        try {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('planned_settings')
            .doc('rfp')
            .collection('schedules')
            .orderBy('created_at', 'asc')
            .get()
            .then(snap => {
              if (!snap.empty) {
                snap.docs.forEach(doc => {
                  const aux = doc.data()
                  aux.id = doc.id
                  aux.class = 'text-center'
                  this.schedules.push(aux)
                })
              }

              resolve(true)
            })
        } catch (error) {
          reject(error)
        }
      })
      return aux
    }
  }
}
</script>

<style lang="scss" scoped>
.schedule-item {
  border-bottom: thin solid grey;

  &:last-child {
    border: none;
  }

  &:hover {
    background: #eee;
  }
}
</style>

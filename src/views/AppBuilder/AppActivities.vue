<template>
  <v-data-table
    class="elevation-1"
    :headers="headers"
    :items="activities"
    sort-by="calories"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Activities</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        />
        <v-spacer />
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="mb-2"
              color="primary"
              dark
              v-on="on"
            >
              New Activity
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container class="rounded-lg">
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="editedItem.value"
                      label="Activity Name"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-select
                      v-model="editedItem.fields"
                      chips
                      item-text="label"
                      item-value="id"
                      :items="fieldList"
                      label="Field"
                      multiple
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialogDelete"
          max-width="500px"
        >
          <v-card>
            <v-card-title class="headline">
              Are you sure you want to delete this item?
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="blue darken-1"
                text
                @click="closeDelete"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="deleteItemConfirm"
              >
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        class="mr-2"
        small
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <p>There are no activities for this App</p>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AppActivities',
  data: () => ({
    // TODO: Move this server variable to main store.
    server: `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}`,
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Title',
        align: 'start',
        value: 'value'
      },
      { text: 'Fields', value: 'actionFields' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    activities: [],
    fieldList: [],
    editedIndex: -1,
    editedItem: {
      value: '',
      fields: [{
        id: null,
        label: null
      }]
    },
    defaultItem: {
      value: '',
      fields: [{
        id: null,
        label: null
      }]
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Activity' : 'Edit Activity'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    }
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      axios.get(`${this.server}/api/apps_settings/m6works/${this.$route.params.id}/activities`).then(response => {
        this.activities = response.data
      })

      axios.post(`${this.server}/api/app-builder/field/list/all`, {
        appId: parseInt(this.$route.params.id)
      }).then(response => {
        this.fieldList = response.data
      })
    },

    editItem(item) {
      this.editedIndex = this.activities.indexOf(item)
      this.editedItem = { ...item }
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.activities.indexOf(item)
      this.editedItem = { ...item }
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      // Delete from DB then splice
      axios.delete(`${this.server}/api/apps_settings/${this.editedItem.id}`).then(response => {
        if (response.status === 200) {
          this.activities.splice(this.editedIndex, 1)
        }
        this.closeDelete()
      })
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        axios.put(`${this.server}/api/apps_settings/${this.editedItem.id}`, {
          value: this.editedItem.value,
          woFields: this.editedItem.fields
        }).then(() => {
          Object.assign(this.activities[this.editedIndex], this.editedItem)
          this.close()
        })
      } else {
        axios.post(`${this.server}/api/apps_settings`, {
          field: 'wo_request_type',
          value: this.editedItem.value,
          app_type: 'dynamic_app_' + this.$route.params.id,
          app_id: parseInt(this.$route.params.id),
          woFields: this.editedItem.fields
        }).then(response => {
          this.activities.push(response.data.app_setting)
          this.close()
        })
      }
    }
  }
}

</script>

<style scoped>

</style>

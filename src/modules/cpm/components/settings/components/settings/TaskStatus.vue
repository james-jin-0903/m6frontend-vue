<template>
  <div>
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
          <label>Current Status</label>
          <v-data-table
            :headers="headers"
            :items="settings.status"
            :options.sync="pagination"
          >
            <template v-slot:item="props">
              <tr>
                <td>{{ props.item }}</td>
                <td class="text-right">
                  <v-btn
                    icon
                    small
                    @click.prevent="editElement(props.index, props.item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    @click.prevent="deleteElement(props.index, props.item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>
    <v-card
      v-if="showForm"
      class="mt-2"
    >
      <v-card-text class="vertical-scroll">
        <v-form ref="form">
          <v-text-field
            v-model="element"
            color="blue"
            label="Task Status Name"
          />
          <input
            v-model="currentElement"
            type="hidden"
          >
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
  </div>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      element: '',
      currentElement: '',
      color: '',
      settings: {},
      submitLoading: false,
      showForm: false,
      rules: {
        required: value => !!value || 'Required.'
      },
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
      ]
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
      .doc('task_status')
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('task_status')
            .set({
              status: []
            })
        }
      })
  },
  methods: {
    save() {
      if (this.element == '') {
        this.$snotify.error('Task Status name is required', 'Error')
        return
      }
      if (this.currentElement === '') {
        if (!this.settings.status) {
          this.settings.status = []
        }
        if (!this.settings.color) {
          this.settings.color = []
        }
        this.settings.status.push(this.element)
        this.settings.color.push(this.color)
      } else {
        this.$set(this.settings.status, this.currentElement, this.element)
      }
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('task_status')
        .update({
          status: this.settings.status,
          color: this.settings.color
        })
      this.cancel()
      this.$snotify.success('The Task Status has been saved', 'Success')
    },
    deleteElement(id, name) {
      const confirmation = confirm(
        `Do you want to delete this Task Status: ${name}`
      )
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.status.splice(id, 1)
      this.settings.color.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('task_status')
        .update({
          status: this.settings.status,
          color: this.settings.color
        })
      this.cancel()
      this.$snotify.success('The Task Status has been deleted', 'Success')
    },
    editElement(id, name, color) {
      this.element = name
      this.color = color
      this.currentElement = id
      this.showForm = true
    },
    cancel() {
      this.element = ''
      this.color = ''
      this.currentElement = ''
      this.showForm = false
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('task_status')
    }
  }
}
</script>

<template>
  <div>
    <v-card
      class="rounded-lg"
      elevation="0"
    >
      <v-card-title class="relative">
        <portal
          v-if="included"
          to="commitments-0"
        >
          <v-btn
            absolute
            class="mt-3"
            color="white"
            dark
            fab
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
          dark
          fab
          right
          small
          @click="showForm = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="form-group">
          <label v-if="!included">Current Types</label>
          <v-data-table
            :headers="headers"
            :items="settings.status"
            :items-per-page-options="[5,10,15,200]"
            :options.sync="pagination"
          >
            <template v-slot:item="props">
              <tr>
                <td>{{ props.item }}</td>
                <td class="text-right">
                  <v-icon
                    class="mr-2 pointer"
                    color="#757575"
                    size="20"
                    @click.prevent="editElement(props.index, props.item)"
                  >
                    mdi-pencil
                  </v-icon>

                  <v-icon
                    class="ml-0 mr-0 pointer"
                    color="#f44336"
                    size="20"
                    @click.prevent="deleteElement(props.index, props.item)"
                  >
                    mdi-delete
                  </v-icon>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>

    <v-dialog
      v-if="showForm"
      v-model="showForm"
      max-width="400px"
      persistent
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            Change Status
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="d-flex flex-wrap justify-end pb-1">
          <v-text-field
            v-model="element"
            class="mb-2 mt-3 w-full"
            color="blue"
            label="Commitments Status Name"
          />
          <input
            v-model="currentElement"
            class="mb-6 w-full"
            type="hidden"
          >
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn
            color="grey darken-1"
            text
            @click="cancel"
          >
            Cancel
          </v-btn>

          <v-btn
            class="blue lighten-2"
            color="white"
            elevation="1"
            text
            @click="save"
          >
            {{ submitLoading ? 'Saving...' : 'Save' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState } from 'vuex'

export default {
  name: 'CommitmentStatus',
  props: {
    included: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  data() {
    return {
      element: '',
      currentElement: '',
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
  mounted() {
    db.collection('settings')
      .doc(this.currentCompany.id)
      .collection('settings')
      .doc('commitments')
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('commitments')
            .set({
              status: []
            })
        }
      })
  },
  methods: {
    save() {
      if (this.element == '') {
        this.$snotify.error('Commitments Status name is required', 'Error')
        return
      }
      if (this.currentElement === '') {
        if (!this.settings.status) {
          this.settings.status = []
        }
        this.settings.status.push(this.element)
      } else {
        this.$set(this.settings.status, this.currentElement, this.element)
      }

      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('commitments')
        .update({
          status: this.settings.status
        })
      this.$snotify.success('The Commitments Status has been saved', 'Success')
      this.cancel()
    },
    deleteElement(id, name) {
      const confirmation = confirm(
        `Do you want to delete this Commitments Status: ${name}`
      )
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.status.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('commitments')
        .update({
          status: this.settings.status
        })
      this.$snotify.success(
        'The Commitments Status has been deleted',
        'Success'
      )
    },
    editElement(id, name) {
      this.element = name
      this.currentElement = id
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
        .collection('settings')
        .doc('commitments')
    }
  }
}
</script>

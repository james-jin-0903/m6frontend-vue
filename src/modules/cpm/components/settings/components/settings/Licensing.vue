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
          <label>Current {{ appLabel.singular }} Licenses</label>

          <v-data-table
            :headers="headers"
            :items="settings.licenses"
            :options.sync="pagination"
          >
            <template v-slot:item="props">
              <tr>
                <td>{{ props.item }}</td>
                <td class="text-right">
                  <v-btn
                    icon
                    small
                    @click.prevent="edit(props.index, props.item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    @click.prevent="deleteLicense(props.index, props.item)"
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
          <h6
            v-if="currentLicense"
            class="indigo--text"
          >
            Editing:
          </h6>
          <v-text-field
            v-model="license"
            color="blue"
            :label="`${appLabel.singular} License Name`"
          />
          <input
            v-model="currentLicense"
            type="hidden"
          >
          <v-btn
            color="blue"
            outlined
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
      license: '',
      currentLicense: '',
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
      .doc('projects')
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('projects')
            .set({
              licenses: []
            })
        }
      })
  },
  methods: {
    save() {
      if (this.license == '') {
        this.$snotify.error(
          `${this.appLabel.singular} license name is required`,
          'Error'
        )
        return
      }
      if (this.currentLicense === '') {
        if (!this.settings.licenses) {
          this.settings.licenses = []
        }
        this.settings.licenses.push(this.license)
      } else {
        this.$set(this.settings.licenses, this.currentLicense, this.license)
      }
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
        .update({
          licenses: this.settings.licenses
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} license has been saved`,
        'Success'
      )
      this.cancel()
    },
    deleteLicense(id, name) {
      const confirmation = confirm(
        `Do you want to delete this ${this.appLabel.singular} license: ${name}`
      )
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.licenses.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
        .update({
          licenses: this.settings.licenses
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} license has been deleted`,
        'Success'
      )
    },
    edit(id, name) {
      this.license = name
      this.currentLicense = id
      this.showForm = true
    },
    cancel() {
      this.license = ''
      this.currentLicense = ''
      this.showForm = false
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
    }
  }
}
</script>

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
          <label>Current Location</label>
          <v-data-table
            :headers="headers"
            :items="settings.companyLocations"
            :options.sync="pagination"
          >
            <template v-slot:item="props">
              <tr>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.code }}</td>
                <td class="text-right">
                  <v-btn
                    icon
                    small
                    text
                    @click.prevent="editLocation(props.index, props.item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    text
                    @click.prevent="deleteLocation(props.index, props.item)"
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
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">
          {{ currentLocationIdx === -1 ? "Creating" : "Editing" }}
        </span>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-card-text class="vertical-scroll">
        <v-form ref="form">
          <v-text-field
            v-model="locationName"
            color="blue"
            :label="`${$t('general.location').split('|')[0]} ${$t(
              'general.name'
            )}`"
          />
          <v-text-field
            v-model="locationCode"
            color="blue"
            :label="`${$t('general.location').split('|')[0]} Code`"
          />
          <input
            v-model="currentLocationIdx"
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
            @click.prevent="saveLocation"
          >
            {{ submitLoading ? "Saving..." : "Save" }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'CompanyLocations',
  data() {
    return {
      pagination: {
        rowsPerPage: -1
      },
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Code',
          value: 'code'
        },
        {
          text: 'Action',
          value: 'action'
        }
      ],
      showForm: false,
      // show: "companyLocations",
      location: {},
      locationName: '',
      locationCode: '',
      currentLocationIdx: -1,
      // companyLocations: [],
      settings: {},
      submitLoading: false,
      rules: {
        required: value => !!value || 'Required.'
      }
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
              companyLocations: []
            })
        }
      })
  },
  methods: {
    saveLocation() {
      if (this.locationName === '') {
        this.$snotify.error('Location name is required', 'Error')
        return
      }
      if (this.locationCode === '') {
        this.$snotify.error('Location code is required', 'Error')
        return
      }
      const locationData = {
        name: this.locationName,
        code: this.locationCode
      }

      const existIndex = this.$h.dg(this.settings, 'companyLocations', []).findIndex(
        item => item.code === locationData.code
      )
      if (this.currentLocationIdx === -1) {
        if (!this.settings.companyLocations) {
          this.settings.companyLocations = []
        }
        if (existIndex > -1) {
          this.$snotify.error(
            'This location code is duplicated!',
            'Error'
          )
          return
        }
        locationData.createdAt = new Date()
        this.settings.companyLocations.push(locationData)
      } else {
        if (existIndex > -1 && this.currentLocationIdx !== existIndex) {
          this.$snotify.error(
            'This location code is duplicated!',
            'Error'
          )
          return
        }
        locationData.updatedAt = new Date()
        this.$set(
          this.settings.companyLocations,
          this.currentLocationIdx,
          locationData
        )
      }

      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          companyLocations: this.settings.companyLocations
        })

      this.$snotify.success(
        `The ${this.appLabel.profile.location} has been saved`,
        'Success'
      )
      this.cancel()
    },
    deleteLocation(idx, obj) {
      const confirmation = confirm(`Do you want to delete this location: ${obj.name}`)
      if (confirmation) {
        this.submitDelete(idx)
      }
    },
    submitDelete(idx) {
      this.settings.companyLocations.splice(idx, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          companyLocations: this.settings.companyLocations
        })
      this.$snotify.success(
        `The ${this.appLabel.profile.location} has been deleted`,
        'Success'
      )
      this.cancel()
    },
    editLocation(idx, obj) {
      const selectedIndex = this.settings.companyLocations.findIndex(
        item => item.name === obj.name && item.code === obj.code
      )
      this.locationName = obj.name
      this.locationCode = obj.code
      this.currentLocationIdx = selectedIndex
      this.showForm = true
    },
    cancel() {
      this.locationName = ''
      this.locationCode = ''
      this.currentLocationIdx = -1
      this.showForm = false
    },
    checkDuplicated(obj) {
      const existIndex = this.settings.companyLocations.findIndex(
        item => item.name === obj.name && item.code === obj.code
      )
      if (existIndex > -1) return true
      else return false
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.settingsCollection)
    }
  }
}
</script>

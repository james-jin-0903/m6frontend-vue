<template>
  <v-row>
    <v-col>
      <v-autocomplete
        v-model="field.selectedRecord"
        cache-items
        class="w-full"
        item-text="title"
        item-value="id"
        :items="recordItems"
        label="Select Record"
        :loading="recordsLoading"
        outlined
        placeholder="Start typing to Search"
        return-object
        :search-input.sync="searchRecords"
      />
    </v-col>
    <v-col>
      <v-btn
        class="accent-4 green ml-2 mt-4 text--accent-2"
        dark
        icon
        @click="saveField"
      >
        <v-icon size="18">
          mdi-check
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ReferencedRecord',

  props: {
    field: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    searchRecords: null,
    recordsLoading: false,
    recordsResult: [],
    recordTitleLimit: 60
  }),

  computed: {
    recordItems() {
      return this.recordsResult.map(entry => {
        const title = entry.title.length > this.recordTitleLimit
          ? entry.title.slice(0, this.recordTitleLimit) + '...'
          : entry.title

        const returnObj = { ...entry, title }
        return returnObj
      })
    }
  },

  watch: {
    searchRecords(val) {
      if (!val) return
      this.recordsResult = []
      this.recordsLoading = true
      this.fetchRecordsDebounced(val)
    }
  },

  methods: {
    fetchRecordsDebounced(val) {
      clearTimeout(this._searchTimerId)
      this._searchTimerId = setTimeout(() => {
        const backendUrl = `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}`
        const postData = {
          search: val,
          fieldId: this.field.id
        }
        axios.post(`${backendUrl}/api/field_values/search-records`, postData).then(response => {
          this.recordsResult = response.data
        }).catch(() => {
          this.notifDanger('There was an error getting the records.')
        }).finally(() => (this.recordsLoading = false))
      }, 800)
    },

    saveField() {
      // TODO: see below
      // save the record to the DB
      // close the edit input
      // show success message
    }
  }
}
</script>

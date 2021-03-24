<template>
  <v-dialog
    v-model="show"
    persistent
    width="500"
  >
    <v-card>
      <v-card-title class="d-flex headline justify-space-between px-6 py-4 white">
        <span class="grey--text text--darken-1">
          Search in {{ where }}
        </span>
        <v-btn
          color="gray"
          icon
          @click.prevent="cancel"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-divider class="grey lighten-3" />
      <v-card-text>
        <v-form
          ref="form"
        >
          <v-text-field
            ref="searchTxt"
            v-model="searchTxt"
            class="mt-6 rounded search-tag white"
            :label="where === 'spending' ? spendingsLabel : commitmentsLabel"
            :rules="[
              v => !!v || 'Please fill this in. It is required to do the search'
            ]"
            @keydown.enter.prevent="search"
          />
        </v-form>
      </v-card-text>

      <v-divider />
      <v-card-actions class="px-6 py-4">
        <v-spacer />
        <v-btn
          v-if="previousSearch"
          class="white--text"
          color="red lighten-3"
          @click.prevent="clear"
        >
          Clear
        </v-btn>
        <v-btn
          class="blue lighten-2"
          color="white"
          elevation="1"
          text
          @click.prevent="search"
        >
          Search
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    show: { type: Boolean, default: false },
    where: { type: String, default: '' },
    previousSearch: { type: String, default: '' }
  },
  data() {
    return {
      spendingsLabel: 'Search',
      commitmentsLabel: 'Search by PO Number',
      searchTxt: '',
      showLoading: false
    }
  },
  mounted() {
    if (this.previousSearch)
    // if not empty or undefined
    {
      this.searchTxt = this.previousSearch
    }

    this.$nextTick(this.$refs.searchTxt.focus)
  },
  methods: {
    clear() {
      this.$emit('clear')
      this.searchTxt = ''
    },
    cancel() {
      this.searchTxt = ''
      this.$emit('close')
    },
    search() {
      const isValid = this.$refs.form.validate()
      if (!isValid) {
        this.$snotify.error('Please fill in the search box', 'Error')
      } else {
        this.$emit('searching', this.searchTxt)
      }
    }
  }
}
</script>

<style scoped>
.search-tag .v-label {
    background: #fff !important;
    padding: 0 !important;
    border-radius: 0 !important;
}
</style>


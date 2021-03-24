<template>
  <v-container class="rounded-lg w-full">
    <header-component
      class="card-custom-shadow h-auto max-w-tight mb-3 mx-auto rounded w-full"
      hasslot
      :info="{title: 'Search All Apps', icon: ''}"
    >
      <template v-slot:input>
        <v-text-field
          v-model="searchInput"
          class="font-weight-bold"
          dense
          flat
          height="40"
          hide-details
          label="Start Typing to Search"
          rounded
          single-line
          solo-inverted
          @change="changeEvent"
        >
          <template v-slot:append>
            <v-row class="align-center d-flex">
              <v-icon>mdi-magnify</v-icon>
            </v-row>
          </template>
        </v-text-field>
      </template>
    </header-component>
    <div v-if="!loading">
      <div
        v-for="(item, index) of apps"
        :key="index"
        :class="Object.keys(apps).length !== index + 1 ? 'mb-3' : ''"
      >
        <general-item :record-data="item" />
      </div>
      <div
        v-if="apps.length === 0"
        class="max-w-tight mx-auto py-3 w-full"
      >
        No results found
      </div>
    </div>
    <v-container
      v-else
      class="rounded-lg"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        style="margin-left: 45%;"
      />
    </v-container>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import GeneralItem from '@/components/Home/GeneralItem'
import HeaderComponent from '@/components/Home/HeaderComponent'
import NewRecordDialog from '@/components/Dialogs/NewRecordDialog'

export default {
  name: 'AppsBuilderList',
  components: {
    GeneralItem,
    NewRecordDialog,
    HeaderComponent
  },
  data: () => ({
    loading: true,
    areas2: [],
    perPage: 8,
    apps: [],
    dialog: false,
    searchInput: ''
  }),
  computed: {
    ...mapGetters('GeneralListModule', {
      list: 'get_general_list'
    }),
    ...mapGetters('ITAppsModule', {
      filter: 'getFilter'
    }),
    areas() {
      return [
        {
          text: 'All Apps',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'everyone', value: 'All Apps' })
            this.reload()
          }
        },
        {
          text: 'Applications',
          type: 'title',
          function: () => {}
        },
        {
          text: 'ITApps',
          type: 'subtitle',
          function: () => {
            this.setFilterTag({ key: 'itapps', value: 'ITApps' })
            this.reload()
          }
        }
      ]
    }
  },
  mounted() {
    this.setDynamicApps().then(() => {
      this.getApps().then(apps => {
        this.apps = apps
        this.loading = false
      })
    })
  },
  methods: {
    ...mapActions('ITAppsModule', {
      filterApps: 'get_filter_builder_apps'
    }),
    ...mapActions('DynamicAppsModule', {
      setDynamicApps: 'set_apps',
      getApps: 'get_apps'
    }),
    changeEvent(event) {
      this.apps = []
      this.loading = true
      this.filterApps({ param: event }).then(() => {
        this.apps = this.list()
        this.loading = false
      })
    },
    reload() {
      this.loading = true
      this.apps = []
      this.getApps().then(
        () => (this.apps = this.list(), this.loading = false)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.v-text-field .v-input__control {
  min-height: auto !important;
  display: flex !important;
  align-items: center !important;
}
.v-text-field .v-input__control .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  align-items: center !important;
}
</style>

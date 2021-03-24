<template>
  <v-container
    class="pt-0 w-full"
    :class="tableView.key === 'card' ? 'px-lg-10 px-md-4 px-sm-2 px-xs-0' : ''"
    fluid
  >
    <div v-if="headerLoaded">
      <record-list-header
        :app-list="appList"
        class="elevation-0 h-auto mb-3 mx-auto rounded"
        :current-app-i-d="currentAppID"
        :show-apps="showApps"
        :show-files="showFiles"
        :show-filter-btn="showFilterBtn"

        @changeEvent="changeEvent"
        @changingApps="changingApps"
        @clearFilter="clearFilter"

        @recordsToShow="recordsToShowUpgrade"
        @tableViewChange="tableViewChange"
      >
        <v-container
          v-if="showFiles || (!showApps && !showFiles)"
          class="app-slider-wrapper full-screen h-auto mb-3 mx-auto px-0 py-4 rounded-lg transparent white"
        >
          <div
            v-if="!loading && headerLoaded"
            :class="tableView.key === 'card'?'app-list__container':'app-list__container h-auto mb-3 mx-auto rounded'"
          >
            <v-container
              v-if="showFiles || (!showApps && !showFiles)"
              class="rounded-lg"
            >
              <div
                v-if="!loading && headerLoaded"
                :class="tableView.key === 'card'?'app-list__container':'app-list__container h-auto mb-3 mx-auto rounded w-full'"
              >
                <template v-if="tableView.key === 'table'">
                  <records-table
                    :items="records"
                    :table-headers="dynamic ? dynamicTableHeader : headers"
                  />
                </template>
                <template v-else-if="tableView.key === 'files' ">
                  <v-row
                    v-if="!loading"
                    class="w-full"
                  >
                    <v-col
                      v-for="(item, index) of records"
                      :key="index"
                      class="app-item__container"
                      md="12"
                      sm="12"
                    >
                      <general-item :record-data="item" />
                    </v-col>
                    <v-col
                      v-if="records.length === 0"
                      class="max-w-tight mx-auto py-3 w-full"
                      cols="12"
                    >
                      No results found
                    </v-col>
                  </v-row>
                </template>
                <template v-else-if="tableView.key === 'app_feed'">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <file-banner
                        :apps="areas2"
                        class="rounded-t"
                      />
                    </v-col>
                    <v-col cols="12">
                      <project-social-media
                        external
                        record-view
                      />
                      <tabs />
                    </v-col>
                  </v-row>
                </template>
                <template v-else-if="tableView.key === 'kanban'">
                  <rapid-kanban />
                </template>
              </div>
              <M6Loading :loading="!headerLoaded" />
            </v-container>
          </div>
        </v-container>
      </record-list-header>
    </div>
  </v-container>
</template>

<script>
import {
  mapGetters,
  mapActions,
  mapMutations,
  mapState
} from 'vuex'
import GeneralItem from '@/components/Home/GeneralItem'
import RecordListHeader from '@/components/Home/RecordListHeader'
import RecordsTable from '@/components/RecordsTable'
import RapidKanban from '@/components/RapidKanban'
import Tabs from '@/components/BuilderComponents/Tabs'
import FileBanner from '@/components/AppFeedView/FileBanner'
import ProjectSocialMedia from '@/views/Home/ProjectSocialMedia'

export default {
  name: 'GeneralList',
  components: {
    FileBanner,
    GeneralItem,
    RecordListHeader,
    ProjectSocialMedia,
    RecordsTable,
    RapidKanban,
    Tabs
  },
  data: () => ({
    loading: true,
    headerLoaded: false,
    areas2: [],
    perPage: 8,
    records: [],
    searchInput: '',
    tableView: {
      icon: 'mdi-text-box-outline',
      text: 'Files View',
      key: 'files'
    },
    dynamic: false,
    headers: [
      { text: 'Image', value: 'image' },
      { text: 'Record #', value: 'record_number' },
      { text: 'App', value: 'app_prefix' },
      { text: 'File Name', value: 'title' },
      { text: 'Description', value: 'description' },
      { text: 'Creator', value: 'author' },
      { text: 'Created On', value: 'created_at' },
      { text: 'Class', value: 'class' },
      { text: 'Category', value: 'category' },
      { text: 'State', value: 'state' },
      { text: 'Status', value: 'status' },
      { text: 'Action', value: 'action', sortable: false }
    ],
    dynamicTableHeader: [],
    showFilterBtn: false,
    currentAppID: 0,
    fullRecordList: [],
    collapseAppPanel: true,
    appList: [],
    showApps: true,
    showFiles: true
  }),
  computed: {
    ...mapGetters('GeneralListModule', {
      list: 'get_general_list'
    }),
    ...mapGetters('ITAppsModule', {
      filter: 'getFilter'
    }),
    areas() {
      return []
    },
    ...mapState('Filtering', {
      filterSettings: 'filterSettings'
    })
  },
  watch: {
    tableView(val) {
      // this.setShowSidePanels(!val)
      this.$emit('tableView', val)
    }
  },
  mounted() {
    this.setDynamicApps()
    this.setFilterTag({ key: 'everyone', value: 'All Apps' })
    this.getApps().then(() => {
      this.records = this.list()
      this.fullRecordList = this.list()
      this.loading = false
    }).then(() => {
      this.getFilterSettings()
      if (!this.filterSettings) return

      this.showFilterBtn = true
      this.currentAppID = this.filterSettings.currentAppID
      this.setFilterTag(this.filterSettings.filter)
      // this.recordsToShow(this.filterSettings.idsAndFieldsList)
    })

    this.selectApp().then(res => {
      res['data'].forEach(app => {
        this.areas2.push(
          {
            currentAppID: app['id'],
            id: app['id'],
            text: app['title'],
            prefix: app['prefix'],
            type: 'subtitle',
            iconLink: app['iconLink'],
            metadata: app['metadata'] ? JSON.parse(app['metadata']) : null,
            fields: app['fields'],
            bgColor: this.getRandomColor(),
            function: () => {
              this.setFilterTag({ key: 'dynamicApp', value: app['title'] })
              this.getRecords(Number(app.id))
            }
          }
        )
      })
      this.headerLoaded = true
      this.getAppList()
    })
  },
  beforeDestroy() {
    this.setShowSidePanels(true)
    this.$emit('tableView', false)
  },
  methods: {
    ...mapActions('ITAppsModule', {
      getApps: 'get_all_apps',
      selectApp: 'get_select_apps',
      searchApps: 'search_apps',
      filterApps: 'get_filter_apps',
      setFilterTag: 'set_filter_tag'
    }),
    ...mapGetters('GeneralListModule', {
      getFieldList: 'get_fields_list'
    }),
    ...mapActions('DynamicAppsModule', {
      getDynamicApps: 'get_all_apps_by_id',
      setDynamicApps: 'set_apps'
    }),
    ...mapMutations('PageControl', {
      setShowSidePanels: 'setShowSidePanels'
    }),
    ...mapActions('RecordsInstance', {
      getRecordsByApp: 'getRecordsByApp'
    }),
    ...mapMutations('Filtering', {
      saveFilterSettings: 'saveFilterSettings',
      getFilterSettings: 'getFilterSettings',
      saveRecordSearchModel: 'saveRecordSearchModel'
    }),
    clearFilter() {
      this.records = this.fullRecordList.filter(f => f.app_id === this.currentAppID)
    },
    recordsToShow(idsAndFieldsList) {
      if (!idsAndFieldsList) return
      const payload = {
        idsAndFieldsList,
        filter: this.filter,
        currentAppID: this.currentAppID
      }
      this.saveFilterSettings(payload)

      this.records = this.fullRecordList.filter(r => idsAndFieldsList.ids.includes(r.id))
    },
    recordsToShowUpgrade(event) {
      if (event) {
        this.showApps = event.filterList.some(item => item.label === 'Application')
        this.showFiles = event.filterList.some(item => item.label === 'Files')
      }
    },
    changeEvent(event) {
      this.getAppList(event)

      this.records = []
      this.loading = true
      this.filterApps({ param: event }).then(() => {
        this.records = this.list()
        this.dynamic = false
        this.loading = false
      })
    },
    getRecords(appId) {
      this.loading = true
      this.getDynamicApps(appId).then(() => {
        const temp = this.list()
        this.dynamicTableHeader = this.headers.slice(0, 11)

        const fields = this.getFieldList()
        temp.map((row, index) => {
          fields[index].map((field, findex) => {
            if (row.app_id === field.app_id) {
              if (!this.dynamicTableHeader.find(row => row.value === `${field.type}-${findex}`)) {
                this.dynamicTableHeader.push({
                  text: this.stringToUpercase(field.label),
                  value: field.type + '-' + findex,
                  type: field.type
                })
              }
              row[field.type + '-' + findex] = field.value
            }
          })
        })
        this.dynamicTableHeader.push(this.headers.slice(-1)[0])
        this.records = temp
        this.dynamic = true
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    reload() {
      this.loading = true
      this.records = []
      this.dynamic = false
      this.getApps().then(
        () => (this.records = this.list(), this.loading = false)
      )
    },
    remainingPerPage(page) {
      let remaining = this.perPage
      if (page + 1 === this.pages) {
        remaining =
          this.perPage - ((this.perPage * this.pages) - this.recordsLength)
      }
      return remaining
    },
    getIndex(i, index) {
      const ind = (i * this.perPage) + index - 1
      return ind
    },
    async changingApps(app) {
      try {
        this.currentAppID = app.currentAppID
        app.function()
        this.showFilterBtn = true
      } catch (e) {
        // Empty
      }
    },
    stringToUpercase(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    getRandomColor() {
      return 'rgb(' + [
        ~~(Math.random() * 255),
        ~~(Math.random() * 255),
        ~~(Math.random() * 255)
      ] + ')'
    },
    tableViewChange(val) {
      this.tableView = val
    },
    getAppList(keyword = '') {
      if (keyword !== '') {
        this.searchApps(keyword).then(res => {
          this.appList = []
          res['data'].forEach(app => {
            this.appList.push(
              {
                id: app['id'],
                text: app['title'],
                prefix: app['prefix'],
                type: 'subtitle',
                iconLink: app['iconLink'],
                metadata: app['metadata'] ? JSON.parse(app['metadata']) : null,
                bgColor: this.getRandomColor(),
                fields: app['fields'],
                function: () => {
                  this.setFilterTag({
                    key: 'dynamicApp',
                    value: app['title']
                  })
                  this.getRecords(Number(app.id))
                }
              }
            )
          })
        })
      } else {
        this.appList = this.areas.concat(this.areas2)
      }
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
v-progress-circular {
  margin-left: 45%!important;
}
.app-list__container {
  justify-content: space-between;
  display: flex;
}
.app-item__container {
  margin: 0;
  // padding: 8px;
}
</style>

<style>
::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
}
</style>

<template>
  <v-card
    class="relative"
    tile
  >
    <v-btn
      absolute
      color="primary"
      dark
      fab
      left
      small
      style="top: 25px"
      top
      @click="showActions = !showActions"
    >
      <v-icon>mdi-account-hard-hat</v-icon>
    </v-btn>
    <v-btn
      absolute
      color="primary"
      dark
      fab
      left
      small
      style="top: 75px"
      top
      @click="showHeaderColor = !showHeaderColor"
    >
      <v-icon>mdi-format-color-fill</v-icon>
    </v-btn>
    <v-dialog
      v-model="showHeaderColor"
      width="800"
    >
      <header-builder-dialog
        :app-colors="typeof app.metadata === 'string' ? JSON.parse(app.metadata) : app.metadata === null || app.metadata === null ? {} : app.metadata"
        @selectHeaderAction="selectHeaderAction"
      />
    </v-dialog>
    <v-card
      class="d-flex justify-center rounded-0 w-full"
      flat
    >
      <v-card
        class="align-center d-flex justify-space-between max-w-lg mx-auto pb-4 pt-6 relative rounded-0 w-full"
        flat
      >
        <div class="align-center d-flex">
          <div class="grey lighten-3 pa-16">
            <v-icon
              class="grey--text text--lighten-1"
              size="38"
            >
              mdi-image-filter-hdr
            </v-icon>
          </div>
          <div class="ml-8">
            <p class="add-field font-weight-regular grey lighten-3 mb-1 pt-1 px-4 rounded-xl">
              Record Title
            </p><p />
            <add-field @addNewField="addNewField" />
            <v-list>
              <v-list-item
                v-for="field in appFieldsFiltered"
                :key="field.id"
                class="my-0 py-0"
              >
                <v-list-item-content @click="editField(field)">
                  <v-list-item-title>{{ field.label }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action class="my-0 py-0">
                  <v-btn
                    icon
                    @click="showDelete(field)"
                  >
                    <v-icon color="red lighten-3">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </div>
        </div>
        <div
          class="flex-space-between"
        >
          <template v-if="app.iconLink !== ''">
            <div style="display: flex">
              <v-btn
                color="red darken-2"
                dark
                fab
                x-small
                @click="deleteIconLink"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <img
                class="app-icon-link pr-2"
                :src="app.iconLink"
              >
            </div>
          </template>
          <template v-else>
            <v-avatar
              class="pointer"
              :color="iconBackgroundColor"
              size="100"
              @click="iconBuilderModal=true"
            >
              <v-icon
                :color="iconColor"
                size="60"
              >
                {{ iconName }}
              </v-icon>
            </v-avatar>
            <v-dialog
              v-model="iconBuilderModal"
              width="800"
            >
              <icon-builder-dialog
                @selectIconAction="selectIconAction"
              />
            </v-dialog>
          </template>
          <v-form ref="formApp">
            <v-text-field
              v-model="app.title"
              class="add-field font-weight-regular grey lighten-3 mb-1 pt-1 px-4 rounded-xl"
              label="App Title"
              :rules="rules.generic"
            />
            <v-text-field
              v-model="app.prefix"
              class="add-field font-weight-regular grey lighten-3 mb-1 pt-1 px-4 rounded-xl"
              label="App Prefix"
              maxlength="5"
              minlength="1"
              :rules="rules.generic"
            />
            <m6-upload
              btn-button="purple"
              @loading="loading = !loading"
              @response="responseAppLogo"
            >
              <v-icon>mdi-cloud-upload</v-icon>
            </m6-upload>
            <v-btn
              class="white--text"
              color="red darken-2"
              @click="showDeleteDialog = true"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              class="white--text"
              color="grey darken-2"
              style="float: left;"
              @click="tableView"
            >
              Table View
            </v-btn>
            <v-btn
              class="white--text"
              color="green darken-2"
              style="float: right;"
              @click="updatingApp"
            >
              save
            </v-btn>
          </v-form>
        </div>
      </v-card>
    </v-card>

    <v-divider class="blue-grey lighten-5 max-w-lg mx-auto w-full" />
    <template v-if="showActions">
      <div class="align-center d-flex justify-space-between max-w-lg mx-auto relative w-full">
        <div class="align-center d-flex">
          <app-activities />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="align-center d-flex justify-space-between max-w-lg mx-auto relative w-full">
        <div class="align-center d-flex">
          <v-tabs
            v-if="appLoaded"
            v-model="activeTab"
            active-class="font-weight-black blue--text active-tab-company"
            @change="updateTabPanels"
          >
            <v-tab
              v-for="(tab, index) in app.tabs"
              :key="index"
              class="blue--text capitalize"
            >
              <template v-if="activeTab === index && !tab.readOnly">
                <v-btn
                  color="green darken-2"
                  dark
                  icon
                  @click="editingTab(tab)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  color="red darken-2"
                  dark
                  icon
                  @click="deleteTab"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>

              <span>{{ tab.title }}</span>

              <template v-if="activeTab === index && !tab.readOnly">
                <v-btn
                  class="white--text"
                  color="blue darken-2"
                  :disabled="index === 0"
                  icon
                  @click="moveTabs(app.tabs[index], app.tabs[index-1])"
                >
                  <v-icon>mdi-arrow-left-thick</v-icon>
                </v-btn>
                <v-btn
                  class="white--text"
                  color="blue darken-2"
                  :disabled="$h.dg(app, 'tabs', []).length - 1 === index"
                  icon
                  @click="moveTabs(app.tabs[index], app.tabs[index+1])"
                >
                  <v-icon>mdi-arrow-right-thick</v-icon>
                </v-btn>
              </template>
            </v-tab>
          </v-tabs>
          <add-tab
            v-if="appLoaded"
            :layout-type="app.layout_type"
            @addNewTab="addNewTab"
          />
          <field
            v-if="showFieldModal"
            :editing="editing"
            :field="activeField"
            :fields-bag="panel.fields"
            :show="showFieldModal"
            @close="showFieldModal = false"
            @result="pushField"
          />
        </div>
      </div>
      <div
        v-if="appLoaded"
        class="details-content grey h-fit lighten-3 pb-5 pt-2"
        style="height: 59vh; overflow-y: auto;"
      >
        <v-row class="align-start d-flex justify-space-between max-w-lg mx-auto pt-1 w-full">
          <v-col
            class="d-flex flex-column justify-center pa-0 pr-1"
            :cols=" $h.dg(app, `tabs.${activeTab}.full_width`, false) ? 12 : 5"
          >
            <!--                <div class="mb-3 panel px-4 py-3 white">-->
            <!--                  <h3 class="font-weight-bold grey&#45;&#45;text spacing-tight text&#45;&#45;darken-1">-->
            <!--                    Information-->
            <!--                  </h3>-->
            <!--                  <div class="align-start d-flex">-->
            <!--                    <v-icon class="border mr-2 pt-2 rounded">-->
            <!--                      mdi-alert-circle-->
            <!--                    </v-icon>-->
            <!--                    <div class="overflow-hidden w-full">-->
            <!--                      <v-textarea-->
            <!--                        class="grey lighten-3 pt-1 px-4"-->
            <!--                        color="grey lighten-3"-->
            <!--                      >-->
            <!--                        <template v-slot:label>-->
            <!--                          Description-->
            <!--                        </template>-->
            <!--                      </v-textarea>-->
            <!--                      <v-btn-->
            <!--                        class="blue&#45;&#45;text capitalize px-1"-->
            <!--                        color="transparent"-->
            <!--                        elevation="0"-->
            <!--                      >-->
            <!--                        Add field-->
            <!--                      </v-btn>-->
            <!--                    </div>-->
            <!--                  </div>-->
            <!--                </div>-->

            <draggable
              v-model="leftPanels"
              group="panel"
              @change="onPanelMove(0, $event)"
            >
              <panel
                v-for="panel in leftPanels"
                :key="panel.id"
                :app-i-d="app.id"
                :panel="panel"
                @copyPanel="copyPanel"
                @deletePanel="deletePanel"
                @updatePanel="updatePanel"
                @updatingTable=" e => updatingTable(panel, e)"
              />
            </draggable>
            <add-panel @addNewPanel="addNewPanel(0)" />
          </v-col>
          <template v-if="!$h.dg(app, `tabs.${activeTab}.full_width`, false)">
            <v-col
              v-if="$h.dg(app, `tabs.${activeTab}`, { title: '' }).title.toLowerCase() !== 'home'"
              class="pa-0 pl-1"
              cols="7"
            >
              <draggable
                v-model="rightPanels"
                group="panel"
                @change="onPanelMove(1, $event)"
              >
                <panel
                  v-for="panel in rightPanels"
                  :key="panel.id"
                  :app-i-d="app.id"
                  :panel="panel"
                  @copyPanel="copyPanel"
                  @deletePanel="deletePanel"
                  @updatePanel="updatePanel"
                  @updatingTable=" e => updatingTable(panel, e)"
                />
              </draggable>
              <add-panel @addNewPanel="addNewPanel(1)" />
            </v-col>

            <v-col
              v-else
              class="pa-0 pl-1"
              cols="7"
            >
              <project-social-media
                class="opacity-social-media"
                post-list-show
              />
            </v-col>
          </template>
        </v-row>
      </div>

      <v-dialog
        v-model="showDeleteModal"
        width="500"
      >
        <delete-dialog
          :element="message"
          @closeDeleteModal="confirmDelete"
        />
      </v-dialog>

      <tab-updates
        :dialog="showTabEditDialog"
        :tab-to-edit="tabToEdit"
        @closing="closingTabUpdates"
        @updateTab="updatingTab"
      />

      <m6-loading
        :loading="loading"
      />

      <m6-confirm-delete
        message="Are you sure you want to delete this App?"
        :show="showDeleteDialog"
        title="Delete Current App"
        @cancel="cancelDelete"
        @confirm="confirmingDelete"
      />

      <table-view
        :field-list-prop="fieldList"
        :show-table="showTable"
        :table-items-prop="tableItems"
        @hideTableModal="hideTableModal"
      />
    </template>
  </v-card>
</template>

<script>

import AddPanel from '@/components/AppBuilder/Buttons/AddPanel'
import AddTab from '@/components/AppBuilder/Buttons/AddTab'
import Panel from '@/components/AppBuilder/Panel'
import AddField from '@/components/AppBuilder/Buttons/AddField'
import Field from '@/components/AppBuilder/Modals/Field'
import TableView from '@/components/AppBuilder/Modals/TableView'
import DeleteDialog from '@/components/Dialogs/DeleteDialog'
import IconBuilderDialog from '@/components/Dialogs/IconBuilderDialog'
import HeaderBuilderDialog from '@/components/Dialogs/HeaderBuilderDialog'
import TabUpdates from '@/components/AppBuilder/Modals/TabUpdates'
import ProjectSocialMedia from '@/views/Home/ProjectSocialMedia.vue'
import AppActivities from '@/views/AppBuilder/AppActivities'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import axios from 'axios'
import Draggable from 'vuedraggable'
import { inRange } from 'lodash'

export default {
  name: 'CreateCompanyPanel',
  components: {
    DeleteDialog,
    AddPanel,
    AddField,
    AddTab,
    Field,
    Panel,
    TabUpdates,
    ProjectSocialMedia,
    AppActivities,
    TableView,
    IconBuilderDialog,
    HeaderBuilderDialog,
    Draggable
  },

  data: () => ({
    showDeleteDialog: false,
    server: `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}`,
    app: {},
    message: 'Tab',
    tableItems: [],
    fieldList: [],
    appLoaded: false,
    showDeleteModal: false,
    tabToDelete: null,
    fieldToDelete: null,
    activeTab: 0,
    showTabEditDialog: false,
    tabToEdit: {},
    loading: false,
    showActions: false,
    showFieldModal: false,
    editing: false,
    activeField: {},
    defaultField: {
      label: 'New Field',
      type: 'text',
      weight: 0,
      metadata: {
        options: [],
        required: false
      }
    },
    showTable: false,
    rules: {
      generic: [v => !!v || 'This field is required']
    },
    iconBuilderModal: false,
    iconName: '',
    iconBackgroundColor: '',
    iconColor: '',
    showHeaderColor: false,
    headerBackgroundColor: '',
    headerTextColor: '',
    leftPanels: [],
    rightPanels: []
  }),

  computed: {
    ...mapGetters('DynamicAppsModule', {
      getAppId: 'getAppId'
    }),

    appFieldsFiltered() {
      return this.$h.dg(this.app, 'fields', []).filter(f => !f.table_id)
    }
  },

  mounted() {
    this.$store.dispatch('AppBuilder/getApp', this.$route.params.id).then(res => {
      this.app = res
      this.updateTabPanels()
      if (res.metadata) {
        this.app.metadata = JSON.parse(res.metadata)
        this.iconName = this.app.metadata.appIcon ? this.app.metadata.appIcon.icon : 'mdi-account-circle'
        this.iconBackgroundColor = this.app.metadata.appIcon ? this.app.metadata.appIcon.background : '#AAA'
        this.iconColor = this.app.metadata.appIcon ? this.app.metadata.appIcon.iconColor : '#AAA'
        this.headerBackgroundColor = this.app.metadata.appHeader ? this.app.metadata.appHeader.headerBackgroundColor : '#fff'
        this.headerTextColor = this.app.metadata.appHeader ? this.app.metadata.appHeader.headerTextColor : '#AAA'
      } else {
        this.iconName = 'mdi-account-circle'
        this.iconBackgroundColor = '#AAA'
        this.iconColor = '#AAA'
        this.headerBackgroundColor = '#fff'
        this.headerTextColor = '#AAA'
      }

      if (Object.keys(this.app).length === 0) this.$router.push('/')
      this.appLoaded = true
    })
  },

  methods: {
    ...mapActions('AppBuilder', {
      switchOrderTabs: 'switchOrderTabs',
      updateApp: 'updateApp',
      deleteApp: 'deleteApp',
      movePanel: 'movePanel'
    }),

    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),

    ...mapActions('File', {
      deleteFileFromS3: 'deleteFileFromS3'
    }),

    updateTabPanels() {
      this.rightPanels = this.app.tabs[this.activeTab].panels.filter(item => item.column === 1)
      this.leftPanels = this.app.tabs[this.activeTab].panels.filter(item => item.column === 0)
    },

    async onPanelMove(column, evt) {
      let ctx
      if (evt.added) {
        ctx = evt.added

        // Fix state
        this.app.tabs[this.activeTab].panels
          .filter(item => item.column === column && item.weight > evt.newIndex)
          .forEach(item => item.weight++)

        ctx.element.column = column
        ctx.element.weight = evt.newIndex
      } else if (evt.removed) {
        this.app.tabs[this.activeTab].panels
          .filter(item => item.column === column && item.weight > evt.oldIndex)
          .forEach(item => item.weight--)
      } else {
        ctx = evt.moved

        // Movement direction
        const dir = Math.sign(evt.newIndex - ctx.element.weight)

        // Move items with weight between start and end to appropriate place
        this.app.tabs[this.activeTab].panels
          .filter(item => item.column === column
            && inRange(item.weight, ctx.element.weight, evt.newIndex + dir))
          .forEach(item => item.weight = item.weight - dir)

        ctx.element.weight = evt.newIndex
      }

      if (evt.moved || evt.added) {
        // Save data
        this.loading = true
        try {
          await this.movePanel({
            id: ctx.element.id,
            newWeight: ctx.newIndex,
            newColumn: column
          })

          this.notifSuccess('Movement successfully saved')
        } catch (e) {
          this.notifDanger('An error occurred while saving movement')
        } finally {
          this.loading = false
        }
      }
    },

    async deleteIconLink() {
      try {
        this.loading = true
        if (this.$h.dg(this.app, 'iconLink', '').length) {
          const splitLink = this.app.iconLink.split('com')
          const key = splitLink[1].substr(1)

          await this.deleteFileFromS3({ key })
          this.app.iconLink = ''
          await this.updateApp({ params: this.app })
        }

        this.loading = false
        this.notifSuccess('The image was deleted')
      } catch (e) {
        this.notifDanger('There was an error while deleting App Icon Image')
        this.loading = false
      }
    },

    updatingTable(panel, table) {
      const index = panel.tables.map(t => t.id).indexOf(table.id)
      if (index > -1) {
        panel.tables[index] = table
      } else {
        panel.tables.push(table)
      }

      panel.tables = [...panel.tables]
    },

    async confirmingDelete() {
      this.showDeleteDialog = false

      try {
        this.loading = true
        await this.deleteApp(this.$route.params.id)
        this.loading = false
        this.notifSuccess('The App Was Deleted')
        this.$router.push('/')
      } catch (e) {
        this.loading = false
        this.notifDanger('There was an error, App was NOT deleted')
      }
    },

    cancelDelete() {
      this.showDeleteDialog = false
    },

    updatePanel(data) {
      this.app.tabs[this.activeTab].panels = this.app.tabs[this.activeTab].panels.map(p => p.id === data.id ? data : p)
    },

    async copyPanel(panelId) {
      this.loading = true

      try {
        const newPanel = await this.$store.dispatch('AppBuilder/copyPanel', panelId)
        const copiedIdx = this.app.tabs[this.activeTab].panels.findIndex(p => p.id === panelId)
        this.app.tabs[this.activeTab].panels.splice(copiedIdx + 1, 0, newPanel)
        this.updateTabPanels()
        this.notifSuccess('Panel copied successfully')
      } catch (e) {
        this.notifDanger('There was an error when copying panel')
      } finally {
        this.loading = false
      }
    },

    async responseAppLogo(data) {
      this.loading = true
      if (data.ok) {
        this.app.iconLink = data.data.link
        await this.updateApp({ params: this.app })
        this.notifSuccess('The image was uploaded')
        this.loading = false
      } else {
        this.loading = false
        this.notifDanger('There was an error while uploading')
      }
    },

    async updatingApp() {
      this.loading = true

      if (!this.$refs.formApp.validate()) {
        this.notifDanger('Please fill in all required fields')
        this.loading = false
        return
      }

      try {
        const res = await this.updateApp({
          params: {
            ...this.app,
            metadata: {
              ...this.app.metadata,
              appIcon: {
                icon: this.iconName,
                background: this.iconBackgroundColor,
                iconColor: this.iconColor
              }
            }
          }
        })
        this.loading = false
        this.notifSuccess('Updated!')
      } catch (e) {
        this.loading = false

        let errorMsg = ''
        for (const i in e.response.data) {
          errorMsg += e.response.data[i][0].replace('params.', '') + '<br />'
        }
        this.notifDanger(errorMsg)
      }
    },

    async moveTabs(current, tabToSwitchWith) {
      const idsAndOrders = [
        { id: tabToSwitchWith.id, order: current.order },
        { id: current.id, order: tabToSwitchWith.order }
      ]

      this.loading = true

      try {
        await this.switchOrderTabs({ idsAndOrders })
        this.notifSuccess('Tabs were updated')

        // const tabs = [...this.app.tabs]

        // tabs.find( t => t.id == current.id ).order = tabToSwitchWith.order
        // tabs.find( t => t.id == tabToSwitchWith.id ).order = current.order
        // const res = [...tabs].sort(function(a, b){return b.order - a.order})
        // this.app.tabs = [...res]

        // this.activeTab = 0

        this.loading = false
      } catch (e) {
        this.notifDanger('There was an error while updating the tabs')
        this.loading = false
      }
    },

    editingTab(tab) {
      this.showTabEditDialog = true
      this.$nextTick(() => {
        this.tabToEdit = tab
      })
    },

    updatingTab(payload) {
      this.app.tabs[this.activeTab] = {
        ...this.app.tabs[this.activeTab],
        ...payload.tab
      }
    },

    closingTabUpdates() {
      this.showTabEditDialog = false
      this.$nextTick(() => {
        this.tabToDelete = {}
      })
    },
    addNewTab(tabNumOption) {
      const newTab = {
        appID: this.app.id,
        weight: 0,
        title: 'New Tab',
        fullWidth: tabNumOption
      }
      this.$store.dispatch('AppBuilder/saveTab', newTab).then(result => {
        this.app.tabs.push(result)
        this.activeTab = this.app.tabs.map(item => item.id).indexOf(result.id)
      })
    },

    addNewPanel(side) {
      const newPanel = {
        tabID: this.app.tabs[this.activeTab].id,
        weight: 0,
        column: side,
        title: 'New Panel',
        description: '',
        title_pos: 0
      }
      this.$store.dispatch('AppBuilder/savePanel', newPanel).then(result => {
        this.app.tabs[this.activeTab].panels.push(result)
      })

      this.updateTabPanels()
    },

    addNewField() {
      this.defaultField['appID'] = this.app.id

      this.activeField = { ...this.defaultField }
      this.editing = false
      this.showFieldModal = true
    },

    editField(field) {
      this.activeField = { ...field }
      this.editing = true
      this.showFieldModal = true
    },

    pushField(item) {
      if (this.editing) {
        const index = this.app.fields.map(item => item.id).indexOf(item.id)
        this.app.fields[index] = { ...item }
      } else {
        this.app.fields.push(item)
      }
      this.showFieldModal = false
      this.editing = false
    },

    showDelete(field) {
      this.message = `Field '${field.label}'`
      this.showDeleteModal = true
      this.fieldToDelete = field.id
    },

    deletePanel(id) {
      const index = this.app.tabs[this.activeTab].panels.map(item => item.id).indexOf(id)
      this.app.tabs[this.activeTab].panels.splice(index, 1)
    },

    deleteTab() {
      this.message = `Tab '${this.app.tabs[this.activeTab]['title']}'`
      this.showDeleteModal = true
      this.tabToDelete = this.app.tabs[this.activeTab].id
    },

    async confirmDelete(result) {
      if (result) {
        if (this.tabToDelete !== null) {
          await this.$store.dispatch('AppBuilder/deleteTab', this.tabToDelete)
          const index = this.app.tabs.map(item => item.id).indexOf(this.tabToDelete)
          this.app.tabs.splice(index, 1)
          this.activeTab = 0
        } else if (this.fieldToDelete !== null) {
          await this.$store.dispatch('AppBuilder/deleteField', this.fieldToDelete)
          const index = this.app.fields.map(item => item.id).indexOf(this.fieldToDelete)
          this.app.fields.splice(index, 1)
        }
      }

      this.fieldToDelete = null
      this.tabToDelete = null
      this.showDeleteModal = false
    },

    selectIconAction(selected, iconInfo) {
      this.iconBuilderModal = !this.iconBuilderModal
      if (selected) {
        this.iconName = iconInfo.icon
        this.iconBackgroundColor = iconInfo.background
        this.iconColor = iconInfo.iconColor
      }
    },

    async selectHeaderAction(selected, headerInfo) {
      this.showHeaderColor = !this.showHeaderColor
      if (selected) {
        this.headerBackgroundColor = headerInfo.headerBackgroundColor
        this.headerTextColor = headerInfo.headerTextColor
        this.loading = true

        try {
          if (this.app.metadata === null || this.app.metadata === undefined) {
            this.app.metadata = {}
          } else if (typeof this.app.metadata === 'string') {
            this.app.metadata = JSON.parse(this.app.metadata)
          }

          if (this.app.metadata.appHeader === null || this.app.metadata.appHeader === undefined) {
            this.app.metadata.appHeader = {}
          }

          this.app.metadata.appHeader = Object.assign(...[
            this.app.metadata.appHeader,
            {
              headerBackgroundColor: this.headerBackgroundColor,
              headerTextColor: this.headerTextColor
            }]
          )
          await this.updateApp({
            params: {
              ...this.app,
              metadata: {
                ...this.app.metadata
              }
            }
          })
          this.loading = false
          this.notifSuccess('Updated!')
        } catch (e) {
          this.loading = false
          this.notifDanger('There was an error while updating')
          return e
        }
      }
    },

    tableView() {
      this.loading = true
      axios.post(`${this.server}/api/app-builder/field/list/all`, {
        appId: parseInt(this.$route.params.id)
      }).then(response => {
        this.fieldList = response.data
      })
      axios.post(`${this.server}/api/app-builder/table-fields/get`, {
        appId: parseInt(this.$route.params.id)
      }).then(response => {
        this.showTable = true
        this.tableItems = response.data
      })
      this.loading = false
    },

    hideTableModal() {
      this.showTable = false
      this.tableItems = []
      this.fieldList = []
    }
  }

}
</script>

<style lang="scss">
.add-field .v-input input {
    border-bottom: 1px solid #F8F3EC;
    margin-bottom: -1px;
}
.panel {
    min-height: 350px;
}
.app-icon-link {
  height: 5rem;
  width: auto;
  border-radius: 20%;
}
.flex-space-between {
  display: flex;
  justify-content: space-between;
}
.opacity-social-media {
  opacity: 0.5;
}
</style>



<template>
  <v-card
    class="align-center d-flex justify-space-between max-w-lg mx-auto relative rounded-b w-full"
    max-width="659"
  >
    <div class="align-center d-flex">
      <v-tabs
        v-model="activeTab"
        active-class="font-weight-black blue--text active-tab-company"
        class="rounded-b"
        @change="updateTabPanels"
      >
        <draggable
          v-model="app.tabs"
          class="v-slide-group__content v-tabs-bar__content"
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

            <v-avatar
              v-if="tab.metadata && JSON.parse(tab.metadata).iconName"
              class="mr-4"
              :color="(tab.metadata && JSON.parse(tab.metadata).iconBackgroundColor)?JSON.parse(tab.metadata).iconBackgroundColor:''"
              size="25"
            >
              <v-icon
                :color="(tab.metadata && JSON.parse(tab.metadata).iconColor)?JSON.parse(tab.metadata).iconColor:''"
                size="15"
              >
                {{ (tab.metadata && JSON.parse(tab.metadata).iconName)?JSON.parse(tab.metadata).iconName:'' }}
              </v-icon>
            </v-avatar>
            <span>{{ tab.title }}</span>
          </v-tab>
        </draggable>
      </v-tabs>
      <add-tab
        v-if="appLoaded"
        :layout-type="app.layout_type"
        @addNewTab="addNewTab"
      />
    </div>

    <tab-updates
      :dialog="showTabEditDialog"
      :tab-to-edit="tabToEdit"
      @closing="closingTabUpdates"
      @updateTab="updatingTab"
    />
    <tab-delete-modal
      :dialog="showDeleteModal"
      @closeTab="showDeleteModal = false"
      @deleteTab="deleteCurrentTab"
    />
  </v-card>
</template>

<script>
import {
  mapGetters,
  mapState,
  mapMutations,
  mapActions
} from 'vuex'
import TabUpdates from '@/components/AppBuilder/Modals/TabUpdates'
import AddTab from '@/components/AppBuilder/Buttons/AddTab'
import TabDeleteModal from '@/components/BuilderComponents/Modals/TabDeleteModal'
import draggable from 'vuedraggable'

export default {
  name: 'Tabs',

  components: {
    TabUpdates,
    AddTab,
    TabDeleteModal,
    draggable
  },

  data: () => ({
    showTabEditDialog: false,
    tabToEdit: {},
    tabToDelete: null,
    showDeleteModal: false
  }),

  computed: {
    ...mapGetters('AppFeedView', {
      record: 'getRecord',
      app: 'getApp'
    }),
    appLoaded() {
      return Boolean(this.app.id)
    },

    ...mapState('Builder', {
      activeTabRef: 'activeTab'
    }),

    activeTab: {
      get() {
        return this.activeTabRef
      },
      set(activeTab) {
        this.setActiveTab(activeTab)
      }
    }
  },

  methods: {
    ...mapMutations('Builder', {
      setActiveTab: 'setActiveTab'
    }),
    ...mapMutations('AppBuilder', {
      deleteTabWithId: 'deleteTab'
    }),
    ...mapActions('AppBuilder', {
      delTab: 'deleteTab'
    }),

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

    deleteTab() {
      this.message = `Tab '${this.app.tabs[this.activeTab]['title']}'`
      this.showDeleteModal = true
      this.tabToDelete = this.app.tabs[this.activeTab].id
    },

    addNewTab({ tabNumOption, columns }) {
      const newTab = {
        appID: this.app.id,
        weight: 0,
        title: 'New Tab',
        fullWidth: tabNumOption,
        columns
      }
      this.$store.dispatch('AppBuilder/saveTab', newTab).then(result => {
        this.app.tabs.push(result)

        const activeTab = this.app.tabs.map(item => item.id).indexOf(result.id)
        this.setActiveTab(activeTab)
      })
    },

    updateTabPanels() {
      if (this.app.tabs[this.activeTab]) {
        this.rightPanels = this.app.tabs[this.activeTab].panels.filter(
          item => item.column === 1
        )
        this.leftPanels = this.app.tabs[this.activeTab].panels.filter(
          item => item.column === 0
        )
      }
    },
    async deleteCurrentTab() {
      const res = await this.delTab(parseInt(this.tabToDelete))
      if (res.status === 200) {
        this.deleteTabWithId(res.data.id)
      }
      this.showDeleteModal = false
    }
  }
}
</script>

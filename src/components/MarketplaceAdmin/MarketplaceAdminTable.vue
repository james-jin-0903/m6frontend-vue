<template>
  <div>
    <template>
      <v-data-table
        class="elevation-1"
        :headers="headers"
        :items="marketplaceItems"
      >
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>Marketplace</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            />
            <v-spacer />
            <v-btn color="primary" class="white--text" @click="showMarketplaceDialog = true" >
              New Item
            </v-btn> 
          </v-toolbar>
        </template>

        <template v-slot:item.app_id="{ item }">
          {{ appsList.find( a => a.id == item.app_id).title }}
        </template>

        
        <template v-slot:item.overview="{ item }">
          <div v-html="item.overview" />
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon
            class="mr-2"
            small
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <h4>No Items To Display</h4>
        </template>
      </v-data-table>
    </template>

    <create-update-dialog 
      :show="showMarketplaceDialog" 
      :editItem="itemToEdit"
      @updateMedia="updateMedia"
      @close="closing" 
      @modifyMarketplaceList="modifyMarketplaceList"
    />

    <m6-confirm-delete
      message="Are you sure you want to delete this marketplace item?"
      :show="showDeleteModal"
      title="Delete Marketplace Item"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex'
  import CreateUpdateDialog from '@/components/MarketplaceAdmin/MarketplaceAdmin/CreateUpdateDialog.vue'

  export default {
    data: () => ({
      showMarketplaceDialog: false,
      marketplaceItems: [],
      headers: [ 
        { text: "App Name", value: "app_id" }, 
        { text: "Status", value: "status" }, 
        { text: "Overview", value: "overview" } ,
        { text: "Actions", value: "actions", sortable: false }
      ],
      itemToEdit: {},
      itemToDelete: {},
      showDeleteModal: false
    }),

    components: {
      CreateUpdateDialog
    },

    methods: {
      ...mapActions('AppBuilder', {
        getAppList: 'getAppList'
      }),

      ...mapActions('Marketplace', {
        getMarketplaces: 'getMarketplaces',
        deleteMarketplace: 'deleteMarketplace'
      }),

      ...mapMutations('SnackBarNotif', {
        notifDanger: 'notifDanger',
        notifSuccess: 'notifSuccess'
      }),

      updateMedia(media) {
        const indexMarketplace = this.marketplaceItems.map( m => m.id).indexOf(this.itemToEdit.id)
        const mediaIndex = this.marketplaceItems[indexMarketplace].media.map( m => m.id ).indexOf(media.id)

        if(mediaIndex > -1) {
          this.marketplaceItems[indexMarketplace].media = this.marketplaceItems[indexMarketplace].media.filter( m => m.id != media.id )
        } else {
          this.marketplaceItems[indexMarketplace].media.push(media)
        }
        this.marketplaceItems = [...this.marketplaceItems]
        this.itemToEdit = { ...this.marketplaceItems[indexMarketplace] }
      },

      async confirmDelete() {
        try {
          this.loading = true
          await this.deleteMarketplace(this.itemToDelete.id)
          this.marketplaceItems = this.marketplaceItems.filter( m => m.id !== this.itemToDelete.id )
          this.loading = false
          this.notifSuccess
          this.cancelDelete()
          this.notifSuccess('The item was deleted!')
        } catch(e) {
          this.notifDanger('There was an error while deleting the marketplace item')
          this.loading = false
        }
      },

      cancelDelete() {
        this.itemToDelete = {}
        this.showDeleteModal = false
      },

      deleteItem(item) {
        this.showDeleteModal = true
        this.itemToDelete = {...item}
      },

      closing() {
        this.itemToEdit = {}
        this.showMarketplaceDialog = false
      },

      modifyMarketplaceList(item) {
        const index = this.marketplaceItems.map( m => m.id).indexOf(item.id)
        if(index > -1) {
          this.marketplaceItems[index] = item
        } else {
          this.marketplaceItems.push(item)
        }
        this.marketplaceItems = [...this.marketplaceItems]
      },

      editItem(item) {
        this.itemToEdit = {...item}
        this.$nextTick( () => {
          this.showMarketplaceDialog = true
        })
      }
    },

    computed: {
      ...mapState('AppBuilder', {
        appsList: 'appsList'
      })
    },

    async mounted() {
      try {
        await this.getAppList()
        this.marketplaceItems = await this.getMarketplaces()
      } catch(e) {
        this.notifDanger('There was an error while loading the initial data')
      }
    }

  }
</script>
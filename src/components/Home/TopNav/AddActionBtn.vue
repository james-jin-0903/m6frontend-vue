<template>
  <v-menu
    bottom
    class="mt-3"
    :close-on-content-click="false"
    content-class="elevation-0"
    elevation="0"
    offset-y
  >
    <template #activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        class="align-center btns-message d-flex justify-center white--text"
        elevation="0"
        fab
        height="20"
        width="20"
        x-small
        v-on="on"
      >
        <v-icon size="17">
          mdi-plus
        </v-icon>
      </v-btn>
    </template>
    <v-list class="mb-2 pa-0 transparent">
      <v-list-item class="ma-0 pa-0 pt-1 uploadfile-btn">
        <v-tooltip
          class="tooltip-upload-file"
          left
        >
          <template #activator="{ on, attrs}">
            <add-feed
              class="w-full"
              :title="'New Action'"
            >
              <v-btn
                slot="btn"
                block
                class="align-center d-flex justify-start ma-0 pa-0 pointer px-3 upload-icon white--text"
                color="blue lighten-2 w-full"
                @click="modal = 'app-builder'"
              >
                New Action
              </v-btn>
            </add-feed>
          </template>
          <span
            class="black--text blue lighten-2 pa-1 rounded text-caption white--text"
          >Add New Action</span>
        </v-tooltip>
      </v-list-item>
      <v-list-item class="ma-0 pa-0 pt-1 uploadfile-btn">
        <v-tooltip
          class="tooltip-upload-file"
          left
        >
          <template #activator="{ on, attrs }">
            <create-app
              class="w-full"
              :title="'New Software'"
            >
              <v-btn
                slot="btn"
                block
                class="align-center d-flex justify-start ma-0 pa-0 pointer px-3 upload-icon white--text"
                color="blue lighten-2 w-full"
              >
                New Software
              </v-btn>
            </create-app>
          </template>
          <span
            class="black--text blue lighten-2 pa-1 rounded text-caption white--text"
          >Add New Software</span>
        </v-tooltip>
      </v-list-item>
      <v-list-item class="ma-0 pa-0 pt-1 uploadfile-btn">
        <v-tooltip
          class="tooltip-upload-file"
          left
        >
          <template #activator="{ on, attrs }">
            <v-dialog
              v-model="dialog"
              max-width="500"
              scrollable
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  class="justify-start max-w-tight mx-auto"
                  color="blue lighten-2 w-full  "
                  dark
                  v-on="on"
                >
                  New File
                </v-btn>
              </template>
              <new-record-dialog
                title="New File"
                @closeModal="dialog = false"
              />
            </v-dialog>
          </template>
          <span
            class="black--text blue lighten-2 pa-1 rounded text-caption white--text"
          >Add New File</span>
        </v-tooltip>
      </v-list-item>
      <v-list-item class="ma-0 pa-0 pt-1 uploadfile-btn">
        <snap-shot-nav class="w-full" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import SnapShotNav from '@/components/Home/TopNav/SnapShotNav'
import CreateApp from '@/views/Home/AddAppDialog'
import AddFeed from '@/views/Home/ActionCenter/AddFeedDialog'
import NewRecordDialog from '@/views/Home/AddRecordDialog'

export default {
  name: 'AddActionBtn',
  components: {
    SnapShotNav,
    NewRecordDialog,
    AddFeed,
    CreateApp
  },
  data: () => ({
    dialog: false
  })
}
</script>

<style>
.v-dialog.v-dialog--active.v-dialog--scrollable{
  height:auto !important;
}
</style>

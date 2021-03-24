<template>
  <v-container
    v-if="!loading"
    class="mt-5 px-0 py-0 rounded-lg"
  >
    <template v-if="items.length === 0">
      <v-container
        class="align-center d-flex flex-column justify-center px-0 py-10 rounded-lg"
        :class="baseColor"
      >
        <p class="text-h5 white--text">
          There are no {{ itemsName }}
        </p>
        <v-divider class="mt-0 w-full white" />
        <a
          class="align-center border border-t-1 d-flex justify-center pointer py-3 text-body-2 w-full white--text"
          @click="dialog = true, dialogMode = true"
        >
          ADD NEW <v-icon class="white--text">mdi-plus</v-icon>
        </a>
        <v-divider class="mb-3 w-full white" />
      </v-container>
    </template>
    <template v-else>
      <v-card>
        <div :class="baseColor + ' card rounded-0 rounded-t-sm px-3 py-4 text-body-1 white--text capitalize'">
          {{ itemsName }}
        </div>
        <v-btn
          :class="baseColor + ' btn-circle-add-item'"
          dark
          fab
          small
          @click="dialog = true, dialogMode = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <div class="licenses-container pa-3">
          <div
            v-for="(item, index) in items"
            :key="'item-'+index"
          >
            <div class="d-flex">
              <div>
                <p class="mb-0">
                  {{ item.type.value }}
                </p>
                <p class="mb-0 text-caption">
                  Version {{ item.version }}
                </p>
                <p
                  v-if="item.appBuild && item.appBuild.value"
                  class="mb-0 text-caption"
                >
                  App Build {{ item.appBuild.value }}
                </p>
              </div>
              <div class="align-center d-flex ml-auto mr-0">
                <v-btn
                  class="mr-2 rounded-xl text-caption white--text"
                  :color="item.status == 'Active' || item.status == 1 ? 'green':'blue-grey lighten-1'"
                  small
                >
                  {{ item.status == 1 ? 'Active': item.status == 0 ? 'Inactive': item.status }}
                </v-btn>
                <v-btn
                  class="rounded-xl transparent"
                  elevation="0"
                  small
                  @click="showUpdateDialog(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </div>
            </div>
            <div v-if="index !== items.length - 1">
              <v-divider class="grey lighten-2 my-3" />
            </div>
          </div>
        </div>
      </v-card>
    </template>

    <v-dialog
      v-model="dialog"
      max-width="600px"
      persistent
    >
      <v-form
        ref="form"
        v-model="valid"
        class="white"
      >
        <v-card-title :class="baseColor + ' white--text d-flex justify-space-between'">
          <span class="capitalize headline white--text">{{ titleDialog }}</span>
          <v-dialog
            v-if="!dialogMode"
            v-model="deleteDialog"
            width="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                color="white"
                icon
                v-on="on"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <delete-dialog
              :element="'dependency'"
              @closeDeleteModal="beforeDelete"
            />
          </v-dialog>
        </v-card-title>
        <v-card-text class="form-labels px-16 py-10">
          <v-select
            v-model="itemInfo.type"
            item-text="value"
            :item-value="Object"
            :items="dependencyTypes"
            label="Type"
            :rules="selectRules"
          />
          <v-text-field
            v-model="itemInfo.version"
            label="Version"
            :rules="nameRules"
          />
          <v-select
            v-model="itemInfo.status"
            item-text="label"
            item-value="value"
            :items="statusOptions"
            label="Status"
            :rules="selectBool"
          />
          <v-select
            v-model="itemInfo.appBuild"
            item-text="value"
            :item-value="Object"
            :items="appBuildOptions"
            label="App Build"
          />
          <v-select
            v-model="itemInfo.edaPackage"
            item-text="value"
            :item-value="Object"
            :items="edaPackageBuild"
            label="EDA Package Build"
          />
          <v-select
            v-model="itemInfo.execPath"
            item-text="value"
            :item-value="Object"
            :items="updatedExecPath"
            label="Updated Exec Path"
          />
          <v-select
            v-model="itemInfo.installNotes"
            item-text="value"
            :item-value="Object"
            :items="updatedinstallNotes"
            label="Updated Install Notes"
          />
          <v-select
            v-model="itemInfo.dctStatus"
            item-text="value"
            :item-value="Object"
            :items="dctStatus"
            label="DCT Status"
          />
          <v-select
            v-model="itemInfo.appCompliant"
            item-text="value"
            :item-value="Object"
            :items="appCompliant"
            label="App Compliant"
          />
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            min-width="290px"
            :nudge-right="40"
            offset-y
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="itemInfo.remDate"
                v-bind="attrs"
                label="Remeditation Date"
                readonly
                :rules="textRules"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="itemInfo.remDate"
              @input="menu = false"
            />
          </v-menu>
          <v-textarea
            v-model="itemInfo.notes"
          >
            <template v-slot:label>
              <div>
                Notes <small>(optional)</small>
              </div>
            </template>
          </v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :color="baseColor"
            text
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            :color="baseColor"
            :disabled="!valid"
            text
            @click="clickAction"
          >
            {{ titleAction }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-dialog>
  </v-container>
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
</template>

<script>
const ItAppDependencies = require('@/store/models/itapp_dependencies')
const app_settings = require('@/store/models/apps_settings')
import DeleteDialog from '@/components/Dialogs/DeleteDialog'
import { items } from '@/mixins/items'
import { validations } from '@/mixins/form-validations'
import { mapActions } from 'vuex'

export default {
  name: 'Dependencies',
  components: {
    DeleteDialog
  },
  mixins: [items, validations],
  props: {
    info: Object
  },
  data: () => ({
    menu: false,
    deleteDialog: false,
    loading: true,
    baseColor: 'red darken-2',
    itemsName: 'dependencies',
    itemInfo: {
      type: null, // Type
      version: null, // Version
      status: null, // Status
      appBuild: null, // App Build
      edaPackage: null, // EDA Package Build
      execPath: null, // Updated Exec Path
      installNotes: null, // Updated install Notes
      dctStatus: null, // DCT Status
      appCompliant: null, // App Compliant
      remDate: null, // Remediation Date
      notes: '' // Notes
    },
    statusOptions: [
      { label: 'Active', value: 1 }, { label: 'Inactive', value: 0 }
    ],
    updatedinstallNotes: [],
    dependencyTypes: [],
    appBuildOptions: [],
    edaPackageBuild: [],
    updatedExecPath: [],
    appCompliant: [],
    dctStatus: []
  }),
  methods: {
    ...mapActions('ITAppsModule',
      [
        'get_all_selects',
        'post_dependency',
        'get_dependencies',
        'put_dependencies',
        'delete_dependency'
      ]
    ),
    post() {
      const data = ItAppDependencies.dependenciesToJson(this.itemInfo)
      data['app_id'] = this.info.id
      this.post_dependency(data).then(res => (
        this.items[this.items.length - 1]['id'] = res.data.dependency_id
      ))
    },
    put() {
      this.put_dependencies(this.itemInfo)
    },
    beforeDelete(decision) {
      decision ? this.deleteItem() : this.deleteDialog = false
    },
    delete() {
      this.delete_dependency(this.itemInfo.id)
    }
  },
  mounted() {
    this.get_dependencies(this.info.id).then(
      res => (
        this.items = ItAppDependencies.fromAPI(res.data),
        this.loading = false)
    )
    this.get_all_selects({
      params: [
        'DependencyType',
        'DependencyAppBuild',
        'DependencyEDAPackageBuild',
        'DependencyUpdatedExecPath',
        'DependencyUpdatedinstallNotes',
        'DependencyDCTStatus',
        'DependencyAppCompliant'
      ]
    }).then(response => (Object.keys(response.data).forEach(key => {
      const arraySettings = app_settings.toAppsSettings(response.data[key])
      switch (key) {
        case 'DependencyUpdatedinstallNotes':
          this.updatedinstallNotes = arraySettings
          break
        case 'DependencyUpdatedExecPath':
          this.updatedExecPath = arraySettings
          break
        case 'DependencyEDAPackageBuild':
          this.edaPackageBuild = arraySettings
          break
        case 'DependencyAppBuild':
          this.appBuildOptions = arraySettings
          break
        case 'DependencyType':
          this.dependencyTypes = arraySettings
          break
        case 'DependencyAppCompliant':
          this.appCompliant = arraySettings
          break
        case 'DependencyDCTStatus':
          this.dctStatus = arraySettings
          break
      }
    })))
  }
}
</script>

<style lang="scss">
.licenses-container {
  min-height: 180px;
  overflow-x: auto;
  overflow-y: auto;
}
.btn-circle-add-item {
  position: absolute;
  top: 35px;
  right: 15px;
}
.edit-license {
  position: absolute;
  top: 65px;
  right: 20px;
}
</style>

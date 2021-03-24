<template>
  <v-container
    v-if="Object.keys(itappDescription).length !== 0"
    class="blue darken-3 mt-5 px-4 py-5 relative rounded-lg white--text"
  >
    <v-btn
      class="edit-description pa-0 rounded-circle transparent"
      color="blue lighten-2"
      elevation="0"
      height="32"
      left
      min-width="37"
      small
      @click="showUpdateDialog(itappDescription)"
    >
      <v-icon class="ma-0 pa-0 white--text">
        mdi-pencil
      </v-icon>
    </v-btn>
    <div class="d-flex justify-space-between">
      <p class="font-weight-medium mb-1 text-caption white--text">
        Vendor
      </p>
      <p class="font-weight-bold mb-1 text-caption text-right white--text">
        {{ itappDescription['general_info']['vendor_id'] }}
      </p>
    </div>
    <v-divider class="grey mb-2" />
    <div class="d-flex justify-space-between">
      <p class="font-weight-medium mb-1 text-caption white--text">
        Status
      </p>
      <p class="font-weight-bold mb-1 text-caption text-right white--text">
        {{ itappDescription['general_info']['status']['value'] }}
      </p>
    </div>
    <v-divider class="grey mb-2" />
    <div class="d-flex justify-space-between">
      <p class="font-weight-medium mb-1 text-caption white--text">
        First Contact Group
      </p>
      <p class="font-weight-bold mb-1 text-caption text-right white--text">
        {{ itappDescription['general_info']['first_contact_group']['value'] }}
      </p>
    </div>
    <v-divider class="grey mb-2" />
    <div class="d-flex justify-space-between">
      <p class="font-weight-medium mb-1 text-caption white--text">
        Type
      </p>
      <p class="font-weight-bold mb-1 text-caption text-right white--text">
        {{ itappDescription['general_info']['type']['value'] }}
      </p>
    </div>
    <v-divider class="grey mb-2" />
    <div class="d-flex justify-space-between">
      <p class="font-weight-medium mb-1 text-caption white--text">
        Category
      </p>
      <p class="font-weight-bold mb-1 text-caption text-right white--text">
        {{ itappDescription['general_info']['category']['value'] }}
      </p>
    </div>
    <v-divider class="grey mb-2" />
    <div class="d-flex justify-space-between">
      <p class="font-weight-medium mb-1 text-caption white--text">
        SubCategory
      </p>
      <p class="font-weight-bold mb-1 text-caption text-right white--text">
        {{ itappDescription['general_info']['sub_category']['value'] }}
      </p>
    </div>
    <v-divider class="grey mb-2" />
    <div class="d-flex justify-space-between">
      <p class="font-weight-medium mb-1 text-caption white--text">
        App Management
      </p>
      <p class="font-weight-bold mb-1 text-caption text-right white--text">
        {{ itappDescription['general_info']['app_management']['value'] }}
      </p>
    </div>
    <v-divider class="grey mb-2" />
    <div class="d-flex justify-space-between">
      <p class="font-weight-medium mb-1 text-caption white--text">
        Server Hosting Model
      </p>
      <p class="font-weight-bold mb-1 text-caption text-right white--text">
        {{ itappDescription['general_info']['server_hosting_model']['value'] }}
      </p>
    </div>

    <p class="font-weight-medium mb-1 mt-6 text-body-1 text-center white--text">
      Most Commonly Known As
    </p>
    <div class="d-flex flex-wrap justify-center">
      <v-chip
        class="ma-2"
        color="primary"
      >
        <span class="white--text">{{ info['company'] }}</span>
      </v-chip>
    </div>

    <p class="font-weight-medium mb-1 mt-6 text-body-1 text-center white--text">
      Also Known As(AKA)
    </p>
    <div class="d-flex flex-wrap justify-center">
      <v-chip
        v-for="aka in itappDescription['also_known']"
        :key="'aka-' + aka.value"
        class="ma-2"
        color="primary"
      >
        <span class="white--text">{{ aka.value }}</span>
      </v-chip>
    </div>

    <p class="font-weight-medium mb-1 mt-6 text-body-1 text-center white--text">
      Formerly Known As(FKA)
    </p>
    <div class="d-flex flex-wrap justify-center">
      <v-chip
        v-for="fka in itappDescription['formerly_known']"
        :key="'fka-' + fka.value"
        class="ma-2"
        color="primary"
      >
        <span class="white--text">{{ fka.value }}</span>
      </v-chip>
    </div>

    <div class="d-flex justify-space-between mt-2">
      <p class="font-weight-medium mb-1 text-caption white--text">
        Patient
      </p>
      <p class="font-weight-bold mb-1 text-caption text-right white--text">
        {{ itappDescription['information_security']['facing'] === 1 ? 'Yes' : 'No' }}
      </p>
    </div>
    <v-divider class="grey mb-2" />
    <div class="d-flex justify-space-between">
      <p class="font-weight-medium mb-1 text-caption white--text">
        PHI
      </p>
      <p class="font-weight-bold mb-1 text-caption text-right white--text">
        {{ itappDescription['information_security']['phi'] === 1 ? 'Yes' : 'No' }}
      </p>
    </div>
    <v-divider class="grey mb-2" />
    <div class="d-flex justify-space-between">
      <p class="font-weight-medium mb-1 text-caption white--text">
        PCI
      </p>
      <p class="font-weight-bold mb-1 text-caption text-right white--text">
        {{ itappDescription['information_security']['pci'] === 1 ? 'Yes' : 'No' }}
      </p>
    </div>
    <v-divider class="grey mb-2" />
    <div class="d-flex justify-space-between">
      <p class="font-weight-medium mb-1 text-caption white--text">
        SSN
      </p>
      <p class="font-weight-bold mb-1 text-caption text-right white--text">
        {{ itappDescription['information_security']['ssn_foreign']['value'] }}
      </p>
    </div>

    <v-dialog
      v-model="dialog"
      max-width="800px"
      persistent
    >
      <v-form
        ref="form"
        v-model="valid"
        class="white"
      >
        <v-card-text class="pa-0">
          <v-toolbar
            color="blue darken-3"
            dark
            flat
          >
            <v-toolbar-title class="white--text">
              Edit Application Information
            </v-toolbar-title>
            <template v-slot:extension>
              <v-tabs
                v-model="tabs"
                centered
                slider-color="grey lighten-2"
              >
                <v-tab
                  v-for="(tab, index) in tabTitles"
                  :key="index + 1"
                  class="white--text"
                >
                  {{ tab.name }}
                </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>

          <v-tabs-items
            v-if="Object.keys(itemInfo).length !== 0"
            v-model="tabs"
            class="form-labels px-16 py-10 record-text"
          >
            <!-- GENERAL -->
            <v-tab-item>
              <v-row>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-autocomplete
                    v-model="itemInfo['general_info']['vendor_id']"
                    color="blue darken-3"
                    :filter="customFilter"
                    item-text="name"
                    :items="dataCompany"
                    label="Vendor"
                    :rules="textRules"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-text-field
                    v-model="itemInfo['title']"
                    label="Name"
                    :rules="textRules"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-text-field
                    v-model="itemInfo['general_info']['version']"
                    label="Version"
                    :rules="textRules"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-text-field
                    v-model="itemInfo.description"
                    label="Description"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-autocomplete
                    v-model="itemInfo['general_info']['status']"
                    color="blue darken-3"
                    :filter="customFilter"
                    item-text="value"
                    :item-value="Object"
                    :items="statusOptions"
                    label="Status"
                    :rules="selectRules"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-autocomplete
                    v-model="itemInfo['general_info']['first_contact_group']"
                    color="blue darken-3"
                    :filter="customFilter"
                    item-text="value"
                    :item-value="Object"
                    :items="firstContactGroupOptions"
                    label="First Contact Group"
                    :rules="selectRules"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-autocomplete
                    v-model="itemInfo['general_info']['category']"
                    color="blue darken-3"
                    :filter="customFilter"
                    item-text="value"
                    :item-value="Object"
                    :items="category"
                    label="Category"
                    :rules="selectRules"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-autocomplete
                    v-model="itemInfo['general_info']['sub_category']"
                    color="blue darken-3"
                    :filter="customFilter"
                    item-text="value"
                    :item-value="Object"
                    :items="category"
                    label="SubCategory"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-autocomplete
                    v-model="itemInfo['general_info']['type']"
                    color="blue darken-3"
                    :filter="customFilter"
                    item-text="value"
                    :item-value="Object"
                    :items="type"
                    label="Type"
                    :rules="selectRules"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-autocomplete
                    v-model="itemInfo['general_info']['app_management']"
                    color="blue darken-3"
                    :filter="customFilter"
                    item-text="value"
                    :item-value="Object"
                    :items="appManagement"
                    label="App Management"
                    :rules="selectRules"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-autocomplete
                    v-model="itemInfo['general_info']['server_hosting_model']"
                    color="blue darken-3"
                    :filter="customFilter"
                    item-text="value"
                    :item-value="Object"
                    :items="serverHostingModel"
                    label="Server Hosting Model"
                    :rules="selectRules"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
            <!--  IMAGE   -->
            <v-tab-item>
              <v-row>
                <v-col class="col pa-0 text-center">
                  <v-avatar
                    class="mr-2 text-center"
                    size="100"
                  >
                    <img
                      v-if="channelImage !== ''"
                      :alt="channelImage"
                      :src="channelImage"
                    >
                    <v-icon
                      v-else
                      size="100"
                    >
                      mdi-application
                    </v-icon>
                  </v-avatar>
                  <m6-upload
                    btn-button="purple"
                    @loading="loading = !loading"
                    @response="reponseRecordImg"
                  >
                    <v-icon size="33">
                      mdi-plus-circle
                    </v-icon>
                  </m6-upload>
                </v-col>
              </v-row>
            </v-tab-item>
            <!-- KNOWN AS -->
            <v-tab-item>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="itemInfo['also_known']"
                    chips
                    deletable-chips
                    hint="Add new AKAs hitting enter"
                    item-text="value"
                    :items="[]"
                    label="Also Known AS(AKA)"
                    multiple
                  />
                </v-col>
                <v-col cols="12">
                  <v-combobox
                    v-model="itemInfo['formerly_known']"
                    chips
                    deletable-chips
                    hint="Add new FKAs hitting enter"
                    item-text="value"
                    :items="[]"
                    label="Formerly Known AS(FKA)"
                    multiple
                  />
                </v-col>
              </v-row>
            </v-tab-item>
            <!-- SECURITY -->
            <v-tab-item>
              <v-row>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-checkbox
                    v-model="itemInfo['information_security']['facing']"
                    label="Patient/Costumer Facing"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-checkbox
                    v-model="itemInfo['information_security']['phi']"
                    label="PHI"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-checkbox
                    v-model="itemInfo['information_security']['pci']"
                    label="PCI"
                  />
                </v-col>
                <v-col
                  class="py-0"
                  cols="12"
                >
                  <v-autocomplete
                    v-model="itemInfo['information_security']['ssn_foreign']"
                    color="blue darken-3"
                    :filter="customFilter"
                    item-text="value"
                    :item-value="Object"
                    :items="ssn"
                    label="SSN"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-3"
            text
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-3"
            :disabled="!valid"
            text
            @click="updateItem"
          >
            Update
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
const appSettings = require('@/store/models/apps_settings')
import { items } from '@/mixins/items'
import { validations } from '@/mixins/form-validations'
import { mapActions } from 'vuex'

export default {
  name: 'Description',
  mixins: [items, validations],
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    itappDescription: {},
    tabs: null,
    channelImage: '',
    loading: false,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    model: 'tab-2',
    itemInfo: {},
    tabTitles: [
      { name: 'General' },
      { name: 'Image' },
      { name: 'Known As' },
      { name: 'Security' }
    ],
    statusOptions: [],
    firstContactGroupOptions: [],
    category: [],
    type: [],
    previewTags: [],
    appManagement: [],
    serverHostingModel: [],
    ssn: []
  }),
  watch: {
    dialog: function (val) {
      if (val) {
        this.previewTags = this.itemInfo.formerly_known.concat(this.itemInfo.also_known)
      }
    }
  },
  mounted() {
    this.get_description(this.info.id).then(
      response => {
        this.itappDescription = response
        response.image_info.image_url !== null
          ? this.channelImage = response.image_info.image_url
          : ''
      }
    )
    this.get_all_selects({
      params: [
        'AppInfoGeneralServerHostingModel',
        'AppInfoGeneralFirstContactGroup',
        'AppInfoGeneralAppManagement',
        'AppInfoGeneralCategory',
        'AppInfoGeneralStatus',
        'AppInfoGeneralType',
        'AppInfoSecuritySSN'
      ]
    }).then(res => (Object.keys(res.data).forEach(key => {
      const arraySettings = appSettings.toAppsSettings(res.data[key])
      switch (key) {
        case 'AppInfoGeneralFirstContactGroup':
          this.firstContactGroupOptions = arraySettings
          break
        case 'AppInfoGeneralServerHostingModel':
          this.serverHostingModel = arraySettings
          break
        case 'AppInfoGeneralAppManagement':
          this.appManagement = arraySettings
          break
        case 'AppInfoGeneralCategory':
          this.category = arraySettings
          break
        case 'AppInfoGeneralStatus':
          this.statusOptions = arraySettings
          break
        case 'AppInfoGeneralType':
          this.type = arraySettings
          break
        case 'AppInfoSecuritySSN':
          this.ssn = arraySettings
          break
      }
    })))
  },
  methods: {
    ...mapActions('ITAppsModule', [
      'get_all_selects',
      'get_description',
      'put_iDpp_description'
    ]),
    reponseRecordImg(res) {
      if (res.ok) {
        this.channelImage = res.data.link
        this.itemInfo['image_info']['image_url'] = res.data.link
      } else {
        this.notifDanger('There was an error while saving the file')
      }
    },
    put() {
      this.itemInfo['tags'] = this.previewTags
      this.itappDescription = this.itemInfo
      this.put_iDpp_description(this.itemInfo).then(
        res => (
          this.itappDescription['also_known'] = res.data['known_as']['also_know_as'],
          this.itappDescription['formerly_known'] = res.data['known_as']['formerly_known_as']
        ))
    }
  }
}
</script>

<style lang="scss">
.items-container {
  overflow-x: auto;
  overflow-y: auto;
}
.record-text{
  height: 70vh;
}
.btn-circle-add-item {
  position: absolute;
  top: 35px;
  right: 15px;
}
.edit-description {
  position: absolute;
  top: -12px;
  right: 12px;
}
</style>

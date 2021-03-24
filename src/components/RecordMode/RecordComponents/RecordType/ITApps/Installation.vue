<template>
  <v-container
    class="rounded-lg"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <v-dialog
      v-model="dialog"
      max-width="1000px"
      persistent
    >
      <v-form
        ref="form"
        v-model="valid"
        class="white"
      >
        <v-card class="pa-0 rounded-lg">
          <v-card-title class="blue darken-3 white--text">
            <span class="font-weight-light headline white--text">Update Install Support</span>
          </v-card-title>
          <v-tabs
            v-model="tabs.current"
            background-color="blue darken-3"
            color="white"
            dark
            fixed-tabs
            slider-color="blue lighten-3"
          >
            <v-tab
              v-for="(tab, index) in tabs.items"
              :key="'tab' + index"
              class="text-caption"
            >
              {{ tab.tab }}
            </v-tab>
          </v-tabs>
          <v-tabs-items
            v-model="tabs.current"
            class="form-labels px-16"
            style="height: 60vh;"
          >
            <!-- Tab for General -->
            <v-tab-item :key="0">
              <v-container class="px-5 rounded-lg">
                <v-col
                  v-for="(formElement, index) in itemLabels.general"
                  :key="'generalitem' + index"
                  class="pa-0"
                >
                  <v-select
                    v-if="formElement.type === 'select'"
                    v-model="itemInfo['general_info'][formElement.value]"
                    item-text="value"
                    item-value="id"
                    :items="options.general[formElement.value]"
                    :label="formElement.label"
                    :rules="formElement.required ? selectRules : undefined"
                  />
                  <v-text-field
                    v-if="formElement.type === 'text'"
                    v-model="itemInfo['general_info'][formElement.value]"
                    :label="formElement.label"
                    :rules="formElement.required ? textRules : undefined"
                  />
                </v-col>
              </v-container>
            </v-tab-item>
            <!-- Tab for Attachments -->
            <v-tab-item :key="1">
              <v-container class="rounded-lg">
                <v-btn
                  color="green"
                  dark
                >
                  Upload File
                </v-btn>
                <v-data-table />
              </v-container>
            </v-tab-item>
            <!-- Tab for Support Information -->
            <v-tab-item :key="2">
              <v-container class="px-5 rounded-lg">
                <v-row
                  v-for="(formElement, index) in itemLabels.support"
                  :key="'supportitem' + index"
                >
                  <!-- All of them are checkboxes and v-text -->
                  <v-col
                    class="d-flex pa-0"
                    cols="4"
                  >
                    <v-checkbox
                      v-model="itemInfo['installation_support'][formElement.value]"
                      :label="formElement.label"
                    />
                  </v-col>
                  <v-col
                    class="d-flex pa-0"
                    cols="8"
                  >
                    <v-text-field
                      v-model="itemInfo['installation_support'][formElement.value + '_note']"
                      :label="formElement.label + ' Notes'"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
            <!-- Tab for Aditional Build Info -->
            <v-tab-item :key="3">
              <v-container class="px-5 rounded-lg">
                <v-col>
                  <v-textarea
                    v-model="itemInfo.aditional_build_info.previousSoftwareVersion"
                    label="Previous Software Version"
                    rows="3"
                  />
                </v-col>
                <v-col>
                  <v-textarea
                    v-model="itemInfo.aditional_build_info.adGroupsMachine"
                    label="AD Groups Machine"
                    rows="3"
                  />
                </v-col>
                <v-col>
                  <v-textarea
                    v-model="itemInfo.aditional_build_info.adGroupsUser"
                    label="AD Groups User"
                    rows="3"
                  />
                </v-col>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="closeDialog"
            >
              Close
            </v-btn>
            <v-btn
              color="primary"
              :disabled="!valid"
              @click="updateItemDescription"
            >
              Save Changes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-subheader class="primary relative rounded-t white--text">
      Installation
      <v-btn
        absolute
        bottom
        :color="isHover ? 'orange' : 'blue'"
        dark
        fab
        right
        small
        @click="showUpdateDialog(information)"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-subheader>
    <v-expansion-panels accordion>
      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-medium">
          General
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!--Vamos a hacer el item más compacto en caso de que su value esté vacio-->
          <v-list-item
            v-for="(item, index) in itemLabels.general"
            :key="'general-' + index"
          >
            <v-list-item-content class="d-flex flex-nowrap justify-space-between mx-2">
              <v-list-item-title class="text-body-2">
                {{ item.label }}
              </v-list-item-title>
              <v-list-item-subtitle
                v-if="typeof information['general_info'][item.value] === 'number' && information['general_info'][item.value] > 10"
                class="text-right"
              >
                {{
                  options.general[item.value].filter(
                    (e) => { return e.id === information['general_info'][item.value] }
                  )[0]['value']
                }}
              </v-list-item-subtitle>
              <v-list-item-subtitle
                v-else
                class="text-right"
              >
                {{ information['general_info'][item.value] }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-medium">
          Attachments
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-medium">
          Install Support
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list-item
            v-for="(item, index) in itemLabels.support"
            :key="'support-' + index"
          >
            <v-list-item-content class="d-flex flex-nowrap justify-space-between mx-2">
              <v-list-item-title class="text-body-2">
                {{ item.label }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ information['installation_support'][item.value] ? 'Yes' : 'No' }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-medium">
          Additional Package Build Information
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list-item
            v-for="(item, index) in itemLabels.build_info"
            :key="'support-' + index"
          >
            <v-list-item-content class="d-flex flex-nowrap justify-space-between mx-2">
              <v-list-item-title class="text-body-2">
                {{ item.label }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ information[item.value] }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import { items } from '@/mixins/items'
import { validations } from '@/mixins/form-validations'
import { mapActions } from 'vuex'
const installConvert = require('@/store/models/itapp_installation')

export default {
  name: 'Installation',
  mixins: [items, validations],
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    isHover: false,
    // initial information
    information: {
      // General Information
      app_id: undefined,
      general_info: {
        odbc_connection_required: undefined,
        ldap_ad_authentication: undefined,
        windows_passed_dct: undefined,
        path_to_executable: undefined,
        odbc_contact_name: undefined,
        delivery_method: undefined,
        general_notes: undefined,
        odbc_settings: undefined,
        install_type: undefined,
        priority: undefined
      },
      // Support Information
      installation_support: {
        shortcut_modifications_note: undefined,
        firewall_exceptions_note: undefined,
        antivirus_exclusion_note: undefined,
        registry_changes_note: undefined,
        mapped_drives_note: undefined,
        install_notes_note: undefined,
        ini_changes_note: undefined,

        shortcut_modifications: false,
        antivirus_exclusion: false,
        firewall_exceptions: false,
        registry_changes: false,
        mapped_drives: false,
        install_notes: false,
        ini_changes: false
      },
      // Build Information
      aditional_build_info: {
        previous_software_version: '',
        groups_machine: '',
        groups_user: ''
      },
      // attachments
      files: []
    },
    switches: {
      firewall_exceptions: false,
      install_notes: false,
      mapped_drives: false,
      registry_changes: false
    },
    tabs: {
      current: null,
      items: [
        { tab: 'General' },
        { tab: 'Attachments' },
        { tab: 'Install Support' },
        { tab: 'Additional Package Build Information' }
      ]
    },
    options: {
      general: {
        install_type: [],
        priority: [5, 4, 3, 2, 1],
        delivery_method: [],
        odbc_connection_required: ['Yes', 'No'],
        windows_passed_dct: [],
        ldap_ad_authentication: []
      }
    },
    // Object to update the data and not touch the real data inside this.info
    itemInfo: {
      general_info: {},
      installation_support: {},
      aditional_build_info: {}
    },
    // Labels to create the form and the boxes to show the information
    itemLabels: {
      general: [
        {
          label: 'Install Type',
          required: true,
          value: 'install_type',
          type: 'select'
        },
        {
          label: 'Priority',
          required: true,
          value: 'priority',
          type: 'select'
        },
        {
          label: 'Delivery Method',
          required: false,
          value: 'delivery_method',
          type: 'select'
        },
        {
          label: '(ODBC) Connection Required',
          required: true,
          value: 'odbc_connection_required',
          type: 'select'
        },
        {
          label: '(ODBC) Contact Name',
          required: false,
          value: 'odbc_contact_name',
          type: 'text'
        },
        {
          label: 'Windows Passed DCT',
          required: false,
          value: 'windows_passed_dct',
          type: 'select'
        },
        {
          label: 'Path to Executable',
          required: true,
          value: 'path_to_executable',
          type: 'text'
        },
        {
          label: '(ODBC) Settings',
          required: true,
          value: 'odbc_settings',
          type: 'text'
        },
        {
          label: 'LDAP/AD Authentication',
          required: false,
          value: 'ldap_ad_authentication',
          type: 'select'
        },
        {
          label: 'General Notes',
          required: false,
          value: 'general_notes',
          type: 'text'
        }
      ],
      support: [
        {
          label: 'Firewall Exceptions',
          value: 'firewall_exceptions'
        },
        {
          label: 'Install Notes',
          value: 'install_notes'
        },
        {
          label: 'Mapped Drives',
          value: 'mapped_drives'
        },
        {
          label: 'Registry Changes',
          value: 'registry_changes'
        },
        {
          label: 'Antivirus Exclusion',
          value: 'antivirus_exclusion'
        },
        {
          label: 'INI Changes',
          value: 'ini_changes'
        },
        {
          label: 'Shortcut Modifications',
          value: 'shortcut_modifications'
        }
      ],
      build_info: [
        {
          label: 'Previous Software Version',
          value: 'previous_software_version'
        },
        {
          label: 'AD Groups - Machine',
          value: 'groups_machine'
        },
        {
          label: 'AD Groups - User',
          value: 'groups_user'
        }
      ],
      attachments: {
        items: [],
        headers: [
          { text: 'File name' },
          { text: 'Attachment' },
          { text: 'Revision notes' },
          { text: 'Created at' },
          { text: 'Submitter' },
          { text: 'Action' }
        ]
      }
    }
  }),
  methods: {
    ...mapActions('ITAppsModule', [
      'get_all_selects',
      'get_installation',
      'update_installation'
    ]),
    updateItemDescription() {
      if (this.valid) {
        const info = [this.information, this.itemInfo]
        this.information = Object.assign(...info)
        this.itemInfo.app_id = this.info.id

        this.update_installation(this.itemInfo).then(() => {
          this.information.general_info.odbc_connection_required = this.information.general_info.odbc_connection_required === 1 ? 'Yes' : 'No'
        })
        this.closeDialog()
      }
    }
  },
  mounted() {
    this.get_all_selects({
      params: [
        'InstallGeneralDeliveryMethod',
        'InstallGeneralType',
        'InstallGeneralWindowsPassedDCT',
        'InstallGeneralLDAP/ADAuthentication'
      ]
    }).then(res => (Object.keys(res.data).forEach(key => {
      const arraySettings = res.data[key]
      switch (key) {
        case 'InstallGeneralType':
          this.options.general.install_type = arraySettings
          break
        case 'InstallGeneralDeliveryMethod':
          this.options.general.delivery_method = arraySettings
          break
        case 'InstallGeneralWindowsPassedDCT':
          this.options.general.windows_passed_dct = arraySettings
          break
        case 'InstallGeneralLDAP/ADAuthentication':
          this.options.general.ldap_ad_authentication = arraySettings
          break
      }
    })))
    this.get_installation(this.info.id).then(res => {
      this.information = installConvert.toInstallation(res.data)
      this.information.general_info.odbc_connection_required = this.information.general_info.odbc_connection_required === 1 ? 'Yes' : 'No'
    })
  }
}
</script>

<style>
.v-expansion-panels {
    z-index: 0;
}
</style>

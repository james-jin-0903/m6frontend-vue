<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-row>
      <v-col class="col pa-0 text-center">
        <!-- <m6-upload
          btn-button="white"
          class="ctm-m6-btn"
          @loading="loading = !loading"
          @response="reponseRecordImg"
        >
          <v-avatar
            class="text-center"
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
              mdi-image-outline
            </v-icon>
          </v-avatar>
          <v-icon
            class="ctm-v-icon-circle"
            size="20"
          >
            mdi-cloud-upload
          </v-icon>
        </m6-upload> -->
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="general_ifo.vendor_id"
          label="Vendor"
          required
          :rules="stringsRules('Vendor')"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="title"
          label="Name"
          required
          :rules="stringsRules('Name')"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="general_ifo.version"
          label="Version"
          required
          :rules="stringsRules('Version')"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="description"
          label="Description"
          required
          :rules="selectRules('Description')"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-select
          v-model="general_ifo.status_settings_id"
          item-text="value"
          item-value="id"
          :items="status_settings_id"
          label="Status"
          :rules="selectRules('Status')"
          solo
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-select
          v-model="general_ifo.first_contact_group_settings_id"
          item-text="value"
          item-value="id"
          :items="first_contact_group_settings_id"
          label="First Contact Group"
          :rules="selectRules('First Contact Group')"
          solo
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-select
          v-model="general_ifo.type_settings_id"
          item-text="value"
          item-value="id"
          :items="type_settings_id"
          label="Type"
          :rules="selectRules('Type')"
          solo
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-select
          v-model="general_ifo.app_management_settings_id"
          item-text="value"
          item-value="id"
          :items="app_management_settings_id"
          label="App Management"
          solo
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-select
          v-model="general_ifo.category_settings_id"
          item-text="value"
          item-value="id"
          :items="category_settings_id"
          label="Category"
          :rules="selectRules('Category')"
          solo
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-select
          v-model="general_ifo.server_hosting_model_settings_id"
          item-text="value"
          item-value="id"
          :items="server_hosting_model_settings_id"
          label="Server Hosting Model"
          solo
        />
      </v-col>
      <v-col cols="12">
        <v-combobox
          v-model="chipsAKA"
          chips
          clearable
          label="Also Known AS(AKA)"
          multiple
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              close
              :input-value="selected"
              @click="select"
              @click:close="removeAKA(item)"
            >
              <strong>{{ item }}</strong>&nbsp;
            </v-chip>
          </template>
        </v-combobox>
        <v-combobox
          v-model="chipsFKA"
          chips
          clearable
          label="Formerly Known As(FKA)"
          multiple
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              close
              :input-value="selected"
              @click="select"
              @click:close="removeFKA(item)"
            >
              <strong>{{ item }}</strong>&nbsp;
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
      <v-col
        class="pb-0"
        cols="6"
      >
        <h2 class="text-md-body-1">
          Patient/Consumer Facing
        </h2>
      </v-col>
      <v-col
        class="pt-0"
        cols="6"
      >
        <v-radio-group
          v-model="information_security.facing"
          row
          :rules="radioRules(information_security.facing)"
        >
          <v-radio
            v-for="(n, index) in validation"
            :key="index+'-facing'"
            :label="n.label"
            :value="n.value"
          />
        </v-radio-group>
      </v-col>
      <v-col
        class="pb-0"
        cols="6"
      >
        <h2 class="text-md-body-1">
          PHI
        </h2>
      </v-col>
      <v-col
        class="pt-0"
        cols="6"
      >
        <v-radio-group
          v-model="information_security.phi"
          row
          :rules="radioRules(information_security.phi)"
        >
          <v-radio
            v-for="(n, index) in validation"
            :key="index+'-facing'"
            :label="n.label"
            :value="n.value"
          />
        </v-radio-group>
      </v-col>
      <v-col
        class="pb-0"
        cols="6"
      >
        <h2 class="text-md-body-1">
          PCI
        </h2>
      </v-col>
      <v-col
        class="pt-0"
        cols="6"
      >
        <v-radio-group
          v-model="information_security.pci"
          row
          :rules="radioRules(information_security.pci)"
        >
          <v-radio
            v-for="(n, index) in validation"
            :key="index+'-facing'"
            :label="n.label"
            :value="n.value"
          />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="information_security.ssn"
          item-text="value"
          item-value="id"
          :items="ssn"
          label="SSN"
          :rules="selectRules('SSN')"
          solo
        />
      </v-col>
    </v-row>
    <v-row class="ma-0 px-3 py-2 w-full">
      <v-spacer />
      <v-btn
        class="mr-4"
        color="secondary"
        outlined
        @click="close"
      >
        Cancel
      </v-btn>
      <v-btn
        class="mr-4"
        color="primary"
        :disabled="!valid"
        outlined
        @click="validate"
      >
        Create
      </v-btn>
    </v-row>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ItAppForm',
  data: () => ({
    valid: false,
    channelImage: '',
    loading: false,
    // General Info
    general_ifo: {
      app_id: undefined,
      vendor_id: '',
      version: '',
      status_settings_id: undefined,
      first_contact_group_settings_id: undefined,
      category_settings_id: undefined,
      sub_category_settings_id: undefined,
      type_settings_id: undefined,
      app_management_settings_id: undefined,
      server_hosting_model_settings_id: undefined
    },
    // RecordInfo
    title: '',
    description: '',
    // Tags
    chipsFKA: [],
    chipsAKA: [],
    // Information Security
    information_security: {
      app_id: null,
      facing: null,
      phi: null,
      pci: null,
      ssn: null
    },
    // Lists
    server_hosting_model_settings_id: [],
    first_contact_group_settings_id: [],
    app_management_settings_id: [],
    category_settings_id: [],
    status_settings_id: [],
    type_settings_id: [],
    ssn: [],
    validation: [{
      label: 'Yes',
      value: true
    }, {
      label: 'No',
      value: false
    }]
  }),
  methods: {
    ...mapActions('ITAppsModule', [
      'get_all_selects',
      'post_it_apps',
      'post_it_app_image',
      'post_general_ifo',
      'post_info_security',
      'post_tag'
    ]),
    reponseRecordImg(res) {
      if (res.ok) {
        this.channelImage = res.data.link
      } else {
        this.notifDanger('There was an error while saving the file')
      }
    },
    postNewITApp() {
      const fka_aka = []
      this.chipsAKA.forEach(item => {
        fka_aka.push({
          created_at: undefined,
          field: 'also_know_as',
          foreign_id: undefined,
          id: undefined,
          updated_at: undefined,
          value: item
        })
      })
      this.chipsFKA.forEach(item => {
        fka_aka.push({
          created_at: undefined,
          field: 'formerly_known_as',
          foreign_id: undefined,
          id: undefined,
          updated_at: undefined,
          value: item
        })
      })
      this.post_it_apps({
        title: this.title,
        description: this.description,
        general_ifo: this.general_ifo,
        information_security: this.information_security,
        tags: fka_aka,
        image: {
          image_url: this.channelImage === '' ? null : this.channelImage
        }
      })
    },
    selectRules(name) {
      return [
        v => !!v || name + ' is required'
      ]
    },
    radioRules(model) {
      return [
        model != null || 'At least one item should be selected'
      ]
    },
    stringsRules(name) {
      return [
        v => !!v || name + ' is required',
        v => v.length <= 255 || name + ' must be less than 255 characters'
      ]
    },
    removeFKA(item) {
      this.chipsFKA.splice(this.chipsFKA.indexOf(item), 1)
      this.chipsFKA = [...this.chipsFKA]
    },
    removeAKA(item) {
      this.chipsAKA.splice(this.chipsAKA.indexOf(item), 1)
      this.chipsAKA = [...this.chipsAKA]
    },
    post_fka_aka(app_id) {
      const fka_aka = []
      this.chipsAKA.forEach(item => {
        fka_aka.push({
          field: 'also_know_as',
          value: item,
          foreign_id: app_id
        })
      })
      this.chipsFKA.forEach(item => {
        fka_aka.push({
          field: 'formerly_known_as',
          value: item,
          foreign_id: app_id
        })
      })
      return fka_aka
    },
    close() {
      this.$emit('closeModal')
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.postNewITApp()
        this.close()
      }
    }
  },
  created() {
    this.get_all_selects({
      params: [
        'AppInfoGeneralStatus',
        'AppInfoGeneralFirstContactGroup',
        'AppInfoGeneralCategory',
        'AppInfoGeneralType',
        'AppInfoGeneralAppManagement',
        'AppInfoGeneralServerHostingModel',
        'AppInfoSecuritySSN'
      ]
    }).then(
      res => (
        this.server_hosting_model_settings_id = res.data.AppInfoGeneralServerHostingModel,
        this.first_contact_group_settings_id = res.data.AppInfoGeneralFirstContactGroup,
        this.app_management_settings_id = res.data.AppInfoGeneralAppManagement,
        this.category_settings_id = res.data.AppInfoGeneralCategory,
        this.status_settings_id = res.data.AppInfoGeneralStatus,
        this.type_settings_id = res.data.AppInfoGeneralType,
        this.ssn = res.data.AppInfoSecuritySSN
      )
    )
  }
}
</script>

<style scoped>
.ctm-v-icon-circle {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #2196f3 !important;
  color: white;
  border-radius: 50%;
  padding: 0.2rem;
  box-sizing: content-box;
}
</style>

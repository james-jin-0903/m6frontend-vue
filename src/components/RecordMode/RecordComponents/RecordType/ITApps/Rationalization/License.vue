<template>
  <v-container
    class="rounded-lg"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
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
        <v-card>
          <v-card-title class="blue d-flex darken-3 justify-space-between white--text">
            <span class="headline white--text">{{ titleDialog }}</span>
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
                :element="'rationalization license'"
                @closeDeleteModal="beforeDelete"
              />
            </v-dialog>
          </v-card-title>
          <v-card-text class="form-labels px-16">
            <v-container class="rounded-lg">
              <v-row>
                <v-select
                  v-model="itemInfo.purchase_type"
                  item-text="value"
                  item-value="id"
                  :items="options.purchase_type"
                  label="Purchase Type"
                  :rules="selectRules"
                />
              </v-row>
              <v-row>
                <v-select
                  v-model="itemInfo.license_type"
                  item-text="value"
                  item-value="id"
                  :items="options.license_type"
                  label="License Type"
                  :rules="selectRules"
                />
              </v-row>
              <v-row>
                <v-text-field
                  v-model="itemInfo.number_of_licenses"
                  label="Number of Licenses"
                  :rules="quantityRules"
                  type="number"
                />
              </v-row>
              <v-row>
                <v-input
                  :hint="'$ ' + itemInfo.cost_per_license.toString()"
                  persistent-hint
                >
                  Cost per License
                </v-input>
                <v-input
                  :hint="'$ ' + itemInfo.total_cost.toString()"
                  persistent-hint
                >
                  Total Licensing Costing
                </v-input>
              </v-row>
              <v-row>
                <v-textarea
                  v-model="itemInfo.notes"
                  label="Notes"
                />
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
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
              @click="clickAction"
            >
              {{ titleAction }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-subheader class="primary relative rounded-t white--text">
      Rationalization License
      <v-btn
        absolute
        bottom
        :color="isHover ? 'orange' : 'blue'"
        dark
        fab
        right
        small
        @click="dialog = true, dialogMode = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-subheader>
    <v-card class="pt-5 rounded-lg">
      <v-data-table
        class="elevation-0"
        :headers="table.headers"
        item-key="name"
        :items="items"
      >
        <template v-slot:[`item.purchase_type`]="{ item }">
          <p>
            {{
              options['purchase_type'].filter(
                (e) => { return e['id'] === item['purchase_type'] }
              )[0]['value']
            }}
          </p>
        </template>
        <template v-slot:[`item.license_type`]="{ item }">
          <p>
            {{
              options['license_type'].filter(
                (e) => { return e['id'] === item['license_type'] }
              )[0]['value']
            }}
          </p>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            class="mr-2"
            color="blue lighten-1"
            small
            @click="showUpdateDialog(item)"
          >
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
const licenseConvert = require('@/store/models/rationalization/itapp_rationalization_license')
import DeleteDialog from '@/components/Dialogs/DeleteDialog'
import { items } from '@/mixins/items'
import { validations } from '@/mixins/form-validations'
import { mapActions } from 'vuex'

export default {
  name: 'License',
  components: {
    DeleteDialog
  },
  mixins: [items, validations],
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    deleteDialog: false,
    dialogMode: false,
    isHover: false,
    itemsName: 'Licenses',
    itemInfo: {
      number_of_licenses: null,
      cost_per_license: 0,
      purchase_type: null,
      license_type: null,
      total_cost: 0,
      notes: ''
    },
    table: {
      headers: [
        { text: 'Purchase Type', value: 'purchase_type' },
        { text: 'License Type', value: 'license_type' },
        { text: 'Number of Licenses', value: 'number_of_licenses' },
        { text: 'Cost per License', value: 'cost_per_license' },
        { text: 'Total Licesing Cost', value: 'total_cost' },
        { text: 'Notes', value: 'notes' },
        { text: 'Actions', value: 'actions' }
      ]
    },
    options: {
      purchase_type: [],
      license_type: []
    }
  }),
  methods: {
    ...mapActions('ITAppsModule', {
      get_selects: 'get_all_selects',
      delete_lic: 'delete_ratio_lic',
      post_lic: 'post_ratio_lic',
      put_lic: 'put_ratio_list',
      get_lic: 'get_ratio_lic'
    }),
    post() {
      this.post_lic(this.itemInfo).then(res => {
        this.items[this.items.length - 1]['id'] = res.data.rationalization_licensing_id
      })
    },
    put() {
      this.put_lic(this.itemInfo)
    },
    delete() {
      this.deleteDialog = false
      this.delete_lic(this.itemInfo.id)
    },
    beforeDelete(decision) {
      decision ? this.deleteItem() : this.deleteDialog = false
    }
  },
  mounted() {
    this.itemInfo['app_id'] = this.info.id
    this.get_selects({
      params: [
        'RationalizationLicensingPurchaseType',
        'RationalizationLicensingLicenseType'
      ]
    }).then(selects => {
      this.options.purchase_type = selects['data']['RationalizationLicensingPurchaseType']
      this.options.license_type = selects['data']['RationalizationLicensingLicenseType']
    })
    this.get_lic(this.info.id).then(res => {
      this.items = licenseConvert.toRationalizationLicensing(res.data)
    })
  }
}
</script>

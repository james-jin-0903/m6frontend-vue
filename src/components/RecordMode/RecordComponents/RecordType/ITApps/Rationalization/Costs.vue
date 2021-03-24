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
                :element="'rationalization cost'"
                @closeDeleteModal="beforeDelete"
              />
            </v-dialog>
          </v-card-title>
          <v-card-text class="form-labels px-16">
            <v-container class="rounded-lg">
              <v-row>
                <v-select
                  v-model="itemInfo.cost_category"
                  item-text="value"
                  item-value="id"
                  :items="options.cost_category"
                  label="Cost Category"
                  :rules="selectRules"
                />
              </v-row>
              <v-row>
                <v-select
                  v-model="itemInfo.cost_type"
                  item-text="value"
                  item-value="id"
                  :items="options.cost_type"
                  label="Cost Type"
                  :rules="selectRules"
                />
              </v-row>
              <v-row>
                <v-select
                  v-model="itemInfo.cost_owner"
                  item-text="value"
                  item-value="id"
                  :items="options.cost_owner"
                  label="Cost Owner"
                  :rules="selectRules"
                />
              </v-row>
              <v-row>
                <v-select
                  v-model="itemInfo.period"
                  item-text="value"
                  item-value="id"
                  :items="options.period"
                  label="Period"
                  :rules="selectRules"
                />
              </v-row>
              <v-row>
                <v-input
                  :hint="'$ ' + itemInfo.cost.toString()"
                  persistent-hint
                  readonly
                >
                  FTE Costs
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
      Rationalization Costs
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
        <template v-slot:[`item.cost_category`]="{ item }">
          <p>
            {{
              options['cost_category'].filter(
                (e) => { return e['id'] === item['cost_category'] }
              )[0]['value']
            }}
          </p>
        </template>
        <template v-slot:[`item.cost_type`]="{ item }">
          <p>
            {{
              options['cost_type'].filter(
                (e) => { return e['id'] === item['cost_type'] }
              )[0]['value']
            }}
          </p>
        </template>
        <template v-slot:[`item.cost_owner`]="{ item }">
          <p>
            {{
              options['cost_owner'].filter(
                (e) => { return e['id'] === item['cost_owner'] }
              )[0]['value']
            }}
          </p>
        </template>
        <template v-slot:[`item.period`]="{ item }">
          <p>
            {{
              options['period'].filter(
                (e) => { return e['id'] === item['period'] }
              )[0]['value']
            }}
          </p>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
const app_settings = require('@/store/models/apps_settings')
const cost_convert = require('@/store/models/rationalization/itapp_rationalization_cost')

import { items } from '@/mixins/items'
import { validations } from '@/mixins/form-validations'
import { mapActions } from 'vuex'
import DeleteDialog from '@/components/Dialogs/DeleteDialog'

export default {
  name: 'Costs',
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
    itemsName: 'Costs',

    itemInfo: {
      cost_category: null,
      cost_type: null,
      cost_owner: null,
      period: null,
      cost: 0,
      notes: ''
    },
    table: {
      headers: [
        { text: 'Cost Category', value: 'cost_category' },
        { text: 'Cost Type', value: 'cost_type' },
        { text: 'Cost Owner', value: 'cost_owner' },
        { text: 'Period', value: 'period' },
        { text: 'Cost', value: 'cost' },
        { text: 'Notes', value: 'notes' },
        { text: 'Actions', value: 'actions' }
      ]
    },
    options: {
      cost_category: [],
      cost_owner: [],
      cost_type: [],
      period: []
    }
  }),
  methods: {
    ...mapActions('ITAppsModule', {
      delete_ratio: 'delete_ratio_cost',
      get_selects: 'get_all_selects',
      post_ratio: 'post_ratio_cost',
      put_ratio: 'put_ratio_cost',
      get_ratio: 'get_ratio_cost'
    }),
    post() {
      this.post_ratio(this.itemInfo).then(res => {
        this.items[this.items.length - 1]['id'] = res['data']['rationalization_costs_id']
      })
    },
    put() {
      this.put_ratio(this.itemInfo)
    },
    delete() {
      this.deleteDialog = false
      this.delete_ratio(this.itemInfo.id)
    },
    beforeDelete(decision) {
      decision ? this.deleteItem() : this.deleteDialog = false
    }
  },
  mounted() {
    this.itemInfo['app_id'] = this.info.id

    this.get_selects({
      params: [
        'RationalizationCostsCategory',
        'RationalizationCostsPeriod',
        'RationalizationCostsOwner',
        'RationalizationCostsType'
      ]
    }).then(res => (Object.keys(res.data).forEach(key => {
      const arraySettings = app_settings.toAppsSettings(res.data[key])
      switch (key) {
        case 'RationalizationCostsCategory':
          this.options.cost_category = arraySettings
          break
        case 'RationalizationCostsPeriod':
          this.options.period = arraySettings
          break
        case 'RationalizationCostsOwner':
          this.options.cost_owner = arraySettings
          break
        case 'RationalizationCostsType':
          this.options.cost_type = arraySettings
          break
      }
    })))
    this.get_ratio(this.itemInfo['app_id']).then(res => {
      this.items = cost_convert.toRationalizationCost(res.data)
    })
  }
}
</script>

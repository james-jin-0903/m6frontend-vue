<template>
  <v-container
    v-if="!loadingPage"
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
                :element="'rationalization FTE'"
                @closeDeleteModal="beforeDelete"
              />
            </v-dialog>
          </v-card-title>
          <v-card-text class="form-labels px-16">
            <v-container class="rounded-lg">
              <v-row>
                <v-select
                  v-model="itemInfo.fte_type"
                  item-text="value"
                  item-value="id"
                  :items="types"
                  label="FTE Type"
                  :rules="selectRules"
                />
              </v-row>
              <v-row>
                <v-text-field
                  v-model="itemInfo.fte_count"
                  label="FTE Count"
                  :rules="quantityRules"
                  type="number"
                />
              </v-row>
              <v-row>
                <v-input
                  :hint="'$ ' + itemInfo.fte_costs.toString()"
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
      Rationalization FTE
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
        <template v-slot:[`item.fte_type`]="{ item }">
          <p>
            {{ types.filter(
              (e) => { return e['id'] === item['fte_type'] }
            )[0]['value'] }}
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
const fteConvert = require('@/store/models/rationalization/itapp_rationalization_fte')
import DeleteDialog from '@/components/Dialogs/DeleteDialog'

import { validations } from '@/mixins/form-validations'
import { items } from '@/mixins/items'
import { mapActions } from 'vuex'

export default {
  name: 'FTE',
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
    loadingPage: true,
    types: [],
    isHover: false,
    itemsName: 'FTE',
    itemInfo: {
      fte_type: null,
      fte_count: null,
      fte_costs: 0,
      notes: ''
    },
    table: {
      headers: [
        { text: 'FTE Type', value: 'fte_type' },
        { text: 'FTE Count', value: 'fte_count' },
        { text: 'FTE Costs', value: 'fte_costs' },
        { text: 'Notes', value: 'notes' },
        { text: 'Actions', value: 'actions' }
      ]
    }
  }),
  methods: {
    ...mapActions('ITAppsModule', {
      delete_fte: 'delete_ratio_fte',
      post_fte: 'post_ratio_fte',
      put_fte: 'put_ratio_fte',
      get_fte: 'get_ratio_fte',
      selects: 'get_selects'
    }),
    post() {
      this.post_fte(this.itemInfo).then(res => {
        this.items[this.items.length - 1]['id'] = res.data.rationalization_fte_id
      })
    },
    put() {
      this.put_fte(this.itemInfo)
    },
    delete() {
      this.deleteDialog = false
      this.delete_fte(this.itemInfo.id)
    },
    beforeDelete(decision) {
      decision ? this.deleteItem() : this.deleteDialog = false
    }
  },
  mounted() {
    this.itemInfo['app_id'] = this.info.id

    this.selects('/RationalizationFTEType').then(res => {
      this.types = res.data
    })

    this.get_fte(this.info.id).then(res => {
      this.items = fteConvert.toRationalizationFte(res.data)
      this.loadingPage = false
    })
  }
}
</script>

<style>

</style>

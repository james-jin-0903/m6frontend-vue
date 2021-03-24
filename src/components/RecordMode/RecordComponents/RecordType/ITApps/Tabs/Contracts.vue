<template>
  <v-container class="mt-5 px-0 py-0 rounded-lg">
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
        <div class="contracts-container pa-3">
          <v-data-table
            class="elevation-0"
            :headers="headers"
            item-key="name"
            :items="items"
            :single-select="singleSelect"
          >
            <template
              v-slot:[`item.status`]="{ item }"
            >
              <div class="d-flex justify-space-between">
                {{ item.status == 1 ? "Active" : "Inactive" }}
              </div>
            </template>
            <template
              v-slot:[`item.term_until`]="{ item }"
            >
              <div class="d-flex justify-space-between">
                {{ termUnit[termUnit.findIndex(i => i.id === item.term_until)]['value'] }}
              </div>
            </template>
            <template
              v-slot:[`item.capped_inflator_value`]="{ item }"
            >
              <div class="d-flex justify-space-between">
                <p>{{ item.capped_inflator_value }}</p>
                <v-icon
                  class="mr-2"
                  color="blue lighten-1"
                  small
                  @click="showUpdateDialog(item)"
                >
                  mdi-pencil
                </v-icon>
              </div>
            </template>
          </v-data-table>
        </div>
      </v-card>
    </template>

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
        <v-card-title :class="baseColor + ' white--text d-flex justify-space-between'">
          <span class="capitalize headline white--text">{{ titleDialog }}</span>
          <template v-if="dialogMode">
            <v-btn
              class="text-none white--text"
              color="purple darken-3"
              @click="onButtonClick"
            >
              UPLOAD FILES
            </v-btn>
            <input
              ref="uploader"
              accept="image/*"
              class="d-none"
              multiple
              type="file"
              @change="onFileChanged"
            >
          </template>
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
              :element="itemInfo.contract_name+' contract'"
              @closeDeleteModal="beforeDelete"
            />
          </v-dialog>
        </v-card-title>
        <v-card-text class="form-labels px-16 py-10">
          <v-container class="rounded-lg">
            <v-row>
              <v-col
                class="py-0"
                cols="6"
              >
                <v-text-field
                  v-model="itemInfo.number"
                  :color="baseColor"
                  label="Contract Number"
                  :rules="nameRules"
                />
              </v-col>
              <v-col
                class="py-0"
                cols="6"
              >
                <v-text-field
                  v-model="itemInfo.contract_name"
                  :color="baseColor"
                  label="Contract Name"
                  :rules="nameRules"
                />
              </v-col>
              <v-col
                class="py-0"
                cols="6"
              >
                <v-select
                  v-model="itemInfo.status"
                  :color="baseColor"
                  item-text="label"
                  item-value="value"
                  :items="validation"
                  label="Status"
                  :rules="selectBool"
                />
              </v-col>
              <v-col
                class="py-0"
                cols="6"
              >
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
                      v-model="itemInfo.start_contract"
                      v-bind="attrs"
                      label="Contract Term Start Date"
                      readonly
                      :rules="textRules"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="itemInfo.start_contract"
                    @input="menu = false"
                  />
                </v-menu>
              </v-col>
              <v-col
                class="py-0"
                cols="6"
              >
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  min-width="290px"
                  :nudge-right="40"
                  offset-y
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="itemInfo.finish_contract"
                      v-bind="attrs"
                      label="Contract Termination Date"
                      readonly
                      :rules="textRules"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="itemInfo.finish_contract"
                    @input="menu1 = false"
                  />
                </v-menu>
              </v-col>

              <v-col
                class="py-0"
                cols="4"
              >
                <v-text-field
                  v-model="itemInfo.term_length"
                  :color="baseColor"
                  label="Term Length"
                  :rules="quantityRules"
                  type="number"
                />
              </v-col>
              <v-col
                class="py-0"
                cols="2"
              >
                <v-select
                  v-model="itemInfo.term_until"
                  :color="baseColor"
                  item-text="value"
                  item-value="id"
                  :items="termUnit"
                  label="Term Unit"
                  :rules="selectRules"
                />
              </v-col>

              <v-col
                class="py-0"
                cols="6"
              >
                <v-text-field
                  v-model="itemInfo.term_notice_period"
                  :color="baseColor"
                  label="Term Notice Period"
                  :rules="quantityRules"
                  type="number"
                />
              </v-col>
              <v-col
                class="py-0"
                cols="6"
              >
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  min-width="290px"
                  :nudge-right="40"
                  offset-y
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="itemInfo.critical_decision_date"
                      v-bind="attrs"
                      label="Critical Decision Date"
                      readonly
                      :rules="textRules"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="itemInfo.critical_decision_date"
                    @input="menu2 = false"
                  />
                </v-menu>
              </v-col>

              <v-col
                class="py-0"
                cols="6"
              >
                <v-text-field
                  v-model="itemInfo.capped_inflator"
                  :color="baseColor"
                  label="Capped Inflator"
                  :rules="nameRules"
                />
              </v-col>
              <v-col
                class="py-0"
                cols="6"
              >
                <v-text-field
                  v-model="itemInfo.capped_inflator_value"
                  :color="baseColor"
                  label="Capped Inflator Value"
                  :rules="nameRules"
                />
              </v-col>

              <v-col
                class="py-0"
                cols="12"
              >
                <p class="mb-0 mt-8 text-center text-h6">
                  Attachments
                </p>
                <v-data-table
                  class="elevation-0"
                  :headers="fileHeaders"
                  item-key="name"
                  :items="itemInfo.files"
                  :single-select="singleSelect"
                />
              </v-col>
            </v-row>
          </v-container>
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
</template>

<script>
import { items } from '@/mixins/items'
import { validations } from '@/mixins/form-validations'
import { mapActions } from 'vuex'
import DeleteDialog from '@/components/Dialogs/DeleteDialog'

export default {
  name: 'Contracts',
  components: {
    DeleteDialog
  },
  mixins: [items, validations],
  props: {
    info: Object
  },
  data: () => ({
    deleteDialog: false,
    menu: false,
    menu1: false,
    menu2: false,
    baseColor: 'purple darken-1',
    itemsName: 'contracts',
    itemInfo: {
      critical_decision_date: undefined, // Critical Decision Date
      capped_inflator_value: undefined, // Capped Inflator Value
      term_notice_period: undefined, // Term Notice Period
      capped_inflator: undefined, // Capped Inflator
      finish_contract: undefined, // Contrac Termination Date
      start_contract: undefined, // Contract Term Start Date
      contract_name: undefined, // Contract Name
      term_length: undefined, // Term Length
      term_until: undefined, // Term Unit
      status: undefined, // Status
      number: undefined, // Contract Number
      id: undefined, // Contract ID
      files: []
    },
    singleSelect: false,
    termUnit: [],
    headers: [
      { text: 'Contract Number', value: 'number' },
      { text: 'Contract Name', value: 'contract_name' },
      { text: 'Status', value: 'status' },
      { text: 'Contract Term Start Date', value: 'start_contract' },
      { text: 'Contrac Termination Date', value: 'finish_contract' },
      { text: 'Term Length', value: 'term_length' },
      { text: 'Term Unit', value: 'term_until' },
      { text: 'Term Notice Period', value: 'term_notice_period' },
      { text: 'Critical Decision Date', value: 'critical_decision_date' },
      { text: 'Capped Inflator', value: 'capped_inflator' },
      { text: 'Capped Inflator Value', value: 'capped_inflator_value' }
    ],
    validation: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ]
  }),
  methods: {
    ...mapActions('ITAppsModule',
      [
        'get_contracts',
        'get_selects',
        'post_contract',
        'put_contract',
        'delete_contract'
      ]
    ),
    post() {
      this.itemInfo['app_id'] = this.info.id
      this.post_contract(this.itemInfo).then(res => (
        this.items[this.items.length - 1].id = res.contract_id
      ))
    },
    put() {
      this.put_contract(this.itemInfo)
    },
    beforeDelete(decision) {
      decision ? this.deleteItem() : this.deleteDialog = false
    },
    delete() {
      this.delete_contract(this.itemInfo.id)
    }
  },
  mounted() {
    this.get_selects('/ContractTermUnit').then(res => (this.termUnit = res.data))
    this.get_contracts(this.info.id).then(res => (
      this.items = res.data
    ))
  }
}
</script>

<style lang="scss">
.contracts-container {
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

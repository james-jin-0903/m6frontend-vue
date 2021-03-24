<template>
  <v-dialog
    v-model="dialog"
    scrollabble
  >
    <v-card
      class="licensing-edit-modal"
      style="overflow:scroll;"
    >
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">
          Spending for PO number: {{ commitmentNumber }}
        </span>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-card-text class="vertical-scroll">
        <v-card
          v-for="(spending, spendingIndex) in spendings"
          :key="spending.id"
          class="mt-5"
          flat
        >
          <v-card-title class="pa-0">
            <v-spacer />
            <v-spacer />
            <v-text-field
              v-model="search"
              append-icon="search"
              class="search-input"
              hide-details
              label="Search"
              single-line
            />
            <v-toolbar dense>
              <v-toolbar-title class="subheading">
                Number: {{ spending.number }}
              </v-toolbar-title>
              <v-spacer />
              <v-toolbar-title class="subheading">
                <v-chip
                  color="blue darken-2"
                  dark
                >
                  Total Spending: {{ getTotalFromObjectArray(spending.line_items, 'amount') | currency }}
                </v-chip>
              </v-toolbar-title>
            </v-toolbar>
          </v-card-title>
          <v-card-text class="pa-0 vertical-scroll">
            <div class="commitments-table">
              <v-card
                class="rounded-lg"
                flat
              >
                <!--<v-card-title>-->
                <!--  <v-spacer></v-spacer>-->
                <!--  <v-spacer></v-spacer>-->
                <!--<v-text-field-->
                <!--  v-model="search"-->
                <!--  append-icon="search"-->
                <!--  label="Search"-->
                <!--  single-line-->
                <!--  hide-details-->
                <!--</v-text-field>-->
                <!--</v-card-title>-->
                <v-data-table
                  v-if="spending.line_items"
                  :headers="lineItemsSpendingsHeaders"
                  hide-default-footer
                  :items="spending.line_items"
                  :search="search"
                >
                  <template
                    slot="items"
                    slot-scope="props"
                  >
                    <td class="text-center">
                      <a
                        href="#"
                        @click.prevent="showLineItem(props.item)"
                      >{{ props.item.number }}</a>
                    </td>
                    <td class="text-center">
                      {{ props.item.vendor ? props.item.vendor.title : '' }}
                    </td>
                    <td class="text-center">
                      {{ props.item.category }}
                    </td>

                    <td class="text-center">
                      {{ props.item.dateText }}
                    </td>
                    <td class="text-center">
                      {{ props.item.line_number }}
                    </td>
                    <td class="text-center">
                      {{ props.item.line_description }}
                    </td>
                    <td class="text-center">
                      {{ props.item.amount | currency }}
                    </td>

                    <td class="justify-center layout px-0">
                      <v-icon
                        class="mr-2"
                        small
                        @click="showLineItem(props.item)"
                      >
                        mdi-magnify-scan
                      </v-icon>
                    </td>
                  </template>

                  <v-alert
                    slot="no-results"
                    color="red lighten-3"
                    icon="warning"
                    :value="true"
                  >
                    Your search for "{{ search }}" found no results.
                  </v-alert>
                </v-data-table>
              </v-card>
            </div>

            <v-form
              v-if="lineItem"
              ref="form"
            >
              <div class="col-sm-6 margin-top-15">
                <div class="card-container">
                  <h4>Line Item Information</h4>
                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="lineItem.number"
                      color="blue"
                      disabled
                      label="Invoice Number"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="lineItem.po_number"
                      color="blue"
                      disabled
                      label="PO number"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="lineItem.project_name"
                      color="blue"
                      disabled
                      label="Project name"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="lineItem.line_number"
                      color="blue"
                      disabled
                      label="Line number"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-50">
                    <label>Amount</label>
                    <money
                      v-model="lineItem.amount"
                      v-bind="money"
                      disabled
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="lineItem.category"
                      color="blue"
                      disabled
                      label="Category"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="lineItem.account"
                      color="blue"
                      disabled
                      label="Account"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="lineItem.account_category"
                      color="blue"
                      disabled
                      label="Account category"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="lineItem.aoc_code"
                      color="blue"
                      disabled
                      label="AOC code"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="lineItem.client_capital_id"
                      color="blue"
                      disabled
                      label="Client capital ID"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="lineItem.custom_numeric_1"
                      color="blue"
                      disabled
                      label="Custom numeric 1"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="lineItem.custom_text_1"
                      color="blue"
                      disabled
                      label="Custom text 1"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="lineItem.custom_text_2"
                      color="blue"
                      disabled
                      label="Custom text 2"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="lineItem.custom_text_3"
                      color="blue"
                      disabled
                      label="Custom text 3"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="lineItem.custom_text_4"
                      color="blue"
                      disabled
                      label="Custom text 4"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="lineItem.status"
                      color="blue"
                      disabled
                      label="Status"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-bottom-25">
                    <v-text-field
                      v-model="lineItem.dateText"
                      append-icon="calendar_today"
                      color="blue"
                      disabled
                      label="Date"
                      mask="date"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-bottom-25">
                    <v-text-field
                      v-model="lineItem.paidDateText"
                      append-icon="calendar_today"
                      color="blue"
                      disabled
                      label="Paid Date"
                      mask="date"
                      readonly
                    />
                  </div>

                  <div class="form-group">
                    <label>Vendor</label>
                    <v-text-field
                      v-model="lineItem.vendor.title"
                      disabled
                      label="Vendor"
                      readonly
                    />
                  </div>

                  <div class="form-group">
                    <v-textarea
                      v-model="lineItem.line_description"
                      color="blue"
                      disabled
                      label="Line description"
                      readonly
                    />
                  </div>
                </div>
              </div>

              <div class="col-sm-6 margin-top-15">
                <div class="card-container">
                  <h4>Spending Options</h4>

                  <div class="form-group margin-top-50">
                    <v-text-field
                      v-model="spending.number"
                      color="blue"
                      disabled
                      label="Category"
                      readonly
                    />
                  </div>

                  <div class="form-group">
                    <label>Commitment</label>
                    <v-text-field
                      v-model="spending.commitment.number"
                      color="blue"
                      disabled
                      label="Commitment"
                      readonly
                    />
                  </div>

                  <div class="form-group margin-top-25">
                    <v-text-field
                      v-model="spending.category"
                      color="blue"
                      disabled
                      label="Budget Category"
                      readonly
                    />

                    <div class="form-group">
                      <v-textarea
                        v-model="spending.description"
                        color="blue"
                        disabled
                        label="Description"
                        readonly
                      />
                    </div>

                    <v-expansion-panel
                      v-show="showCostCodes"
                      class="budget-cat-select elevation-0"
                    >
                      <v-expansion-panel-content
                        v-for="(item, index) in budgetSettings.costCodes"
                        :key="index"
                      >
                        <v-icon
                          v-if="item.cat_1.length"
                          slot="actions"
                        >
                          $vuetify.icons.expand
                        </v-icon>
                        <v-icon
                          v-else
                          slot="actions"
                          color="white"
                        >
                          mdi-crop-free
                        </v-icon>
                        <v-card
                          slot="header"
                          class="pa-0"
                          flat
                        >
                          <v-card-title class="headline px-6 py-4 white">
                            <span class="grey--text text--darken-1">
                              {{ item.name }}
                            </span>
                            <v-spacer />
                            <v-btn
                              class="ma-1"
                              icon
                              small
                              @click.stop="setCostCodeL1(item)"
                            >
                              <v-icon
                                color="green"
                                light
                                small
                              >
                                mdi-check-circle-outline
                              </v-icon>
                            </v-btn>
                          </v-card-title>
                        </v-card>
                        <v-card
                          class="pa-0"
                          flat
                        >
                          <v-card-text class="pa-0 vertical-scroll">
                            <v-expansion-panel
                              class="elevation-0"
                            >
                              <v-expansion-panel-content
                                v-for="(itemL2, indexL2) in item.cat_1"
                                :key="indexL2"
                              >
                                <v-icon
                                  v-if="itemL2.cat_2.length"
                                  slot="actions"
                                >
                                  $vuetify.icons.expand
                                </v-icon>
                                <v-icon
                                  v-else
                                  slot="actions"
                                  color="white"
                                >
                                  mdi-crop-free
                                </v-icon>
                                <v-card
                                  slot="header"
                                  class="pa-0 pl-4"
                                  flat
                                >
                                  <v-card-title class="headline px-6 py-4 white">
                                    <span class="grey--text text--darken-1">
                                      {{ itemL2.name }}
                                    </span>
                                    <v-spacer />
                                    <v-btn
                                      class="ma-1"
                                      icon
                                      small
                                      @click.stop="setCostCodeL2(item, itemL2)"
                                    >
                                      <v-icon
                                        color="green"
                                        light
                                        small
                                      >
                                        mdi-check-circle-outline
                                      </v-icon>
                                    </v-btn>
                                  </v-card-title>
                                </v-card>
                                <v-card
                                  class="pa-0 pl-4"
                                  flat
                                >
                                  <v-card-text class="pa-0 pl-4 vertical-scroll">
                                    <v-card
                                      v-for="(itemL3, indexL3) in itemL2.cat_2"
                                      :key="indexL3"
                                      class="pa-0 pl-4 pr-5"
                                      flat
                                    >
                                      <v-card-title class="headline px-6 py-4 white">
                                        <span class="grey--text text--darken-1">
                                          {{ itemL3.name }}
                                        </span>
                                        <v-spacer />
                                        <v-btn
                                          class="ma-1"
                                          icon
                                          small
                                          @click.stop="setCostCodeL3(item, itemL2, itemL3)"
                                        >
                                          <v-icon
                                            color="green"
                                            light
                                            small
                                          >
                                            mdi-check-circle-outline
                                          </v-icon>
                                        </v-btn>
                                      </v-card-title>
                                    </v-card>
                                  </v-card-text>
                                </v-card>
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </div>

                  <div class="form-group">
                    <v-checkbox
                      v-model="lineItem.reconciled"
                      color="blue"
                      disabled
                      label="Reconciled"
                      readonly
                    />
                  </div>

                  <div class="form-group">
                    <h5 class="mt-3">
                      Attachments
                    </h5>
                    <v-divider class="mt-0" />

                    <v-treeview
                      v-model="tree"
                      activatable
                      :active.sync="active"
                      hoverable
                      item-key="path"
                      :items="spendingFiles"
                      :open="open"
                      open-on-click
                    >
                      <template
                        slot="prepend"
                        slot-scope="{ item, open, leaf }"
                      >
                        <v-icon v-if="!item.file">
                          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                        </v-icon>
                        <v-icon v-else-if="item.file === 'image/jpeg' || item.file === 'image/png'">
                          mdi-image
                        </v-icon>
                        <v-icon v-else-if="item.file === 'application/pdf'">
                          mdi-file-pdf-box
                        </v-icon>
                        <v-icon v-else>
                          mdi-text-box-outline
                        </v-icon>
                      </template>
                      <template
                        slot="append"
                        slot-scope="{ item, open, leaf }"
                      >
                        <template>
                          <template v-if="item.file">
                            <a
                              :href="item.url"
                              style="padding-top: 6px"
                              target="_blank"
                            ><v-icon small>mdi-folder-plus</v-icon></a>
                            <v-btn
                              icon
                              small
                              @click.stop="deleteFile(item, open, leaf)"
                            >
                              <v-icon
                                color="red"
                                small
                              >
                                mdi-delete
                              </v-icon>
                            </v-btn>
                          </template>
                        </template>
                      </template>
                    </v-treeview>
                  </div>

                  <div class="form-group margin-top-25">
                    <v-img
                      v-if="imageUrl"
                      :key="imageUrl"
                      aspect-ratio="1"
                      class="grey lighten-4"
                      :lazy-src="imageUrl"
                      :src="imageUrl"
                    >
                      <v-row
                        slot="placeholder"
                        align="center"
                        class="fill-height ma-0"
                        justify="center"
                      >
                        <v-progress-circular
                          color="blue lighten-2"
                          indeterminate
                        />
                      </v-row>
                    </v-img>

                    <iframe
                      v-if="pdfUrl"
                      :src="pdfUrl"
                      style="width: 100%; height: 530px; border: none"
                    />
                  </div>
                </div>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          text
          @click.stop="dialog=false"
        >
          close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { db, storage } from '@/utils/Firebase'
import { Money } from 'v-money'

export default {
  components: { Money },

  props: ['commitmentNumber', 'commitmentId', 'value'],
  data() {
    return {
      imageUrl: null,
      spendingFiles: [],
      pdfUrl: null,
      tree: [],
      active: [],
      open: [],
      showCostCodes: false,
      budgetSettings: {},
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '$',
        precision: 2,
        masked: false
      },
      search: '',
      lineItemsSpendingsHeaders: [
        { text: 'Number', value: 'number' },
        { text: 'Vendor', value: 'vendor.title' },
        { text: 'Category', value: 'category' },
        { text: 'Date', value: 'dateText' },
        { text: 'Line Number', value: 'line_number' },
        { text: 'Line Description', value: 'line_description' },
        { text: 'Amount', value: 'amount' },
        { text: 'Actions', value: 'actions' }
      ],
      spendings: [],
      lineItem: null,
      commitment: null,
      project: {},
      projectRef: db.collection('cpm_projects').doc(this.$route.params.id)
    }
  },

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    dialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },

  firestore() {
    return {
      project: this.projectRef,
      budgetSettings: db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('budgets')
    }
  },

  watch: {
    active() {
      if (!this.active.length) return undefined
      const item = this.spendingFiles.find(c => c.path === this.active[0])
      if (item) {
        if (item.file === 'image/png' || item.file === 'image/jpeg') {
          this.imageUrl = item.url
          this.pdfUrl = null
        } else if (item.file === 'application/pdf') {
          this.pdfUrl = item.url
          this.imageUrl = null
        } else {
          this.imageUrl = null
          this.pdfUrl = null
        }
      }
    },

    commitmentNumber() {
      this.loadData()
    }
  },

  mounted() {
    this.loadData()
  },
  methods: {
    getTotalFromObjectArray(items, propToSum) {
      if (items && items.length > 0) {
        return items.reduce(function (a, b) {
          return a + b[propToSum]
        }, 0)
      } else {
        return 0
      }
    },

    showLineItem(lineItem) {
      this.lineItem = lineItem
    },

    loadData() {
      const commitmentRef = this.projectRef.collection('commitments').doc(this.commitmentId)

      this.$bind('spendings', this.projectRef.collection('spendings').where('commitment', '==', commitmentRef)).then(snapshot => {
        snapshot.forEach(c => {
          c.poBalance = c.amount - c.invoiceTotal
          this.$set(c, 'line_items', [])

          this.projectRef.collection('spendings').doc(c.id).collection('line_items').get().then(snapshot => {
            snapshot.forEach(doc => {
              const lineItem = doc.data()
              lineItem.id = doc.id
              c.line_items.push(lineItem)
            })
          })
        })
      })
    }
  }
}
</script>

<style lang="scss">
  .search-input {
      margin-bottom: 25px;
    }
</style>

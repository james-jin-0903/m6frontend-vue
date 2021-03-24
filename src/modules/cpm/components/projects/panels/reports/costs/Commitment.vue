<template>
  <div>
    <v-form ref="form">
      <div class="col-sm-6 margin-top-15">
        <div class="card-container">
          <h4>Commitment Information</h4>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="commitment.number"
              color="blue"
              label="Commitment Number"
            />
          </div>

          <div class="form-group margin-top-25">
            <v-text-field
              v-model="commitment.costCodeText"
              append-icon="keyboard_arrow_down"
              color="blue"
              label="Budget Category"
              @click="showBudgetCategorySearch = !showBudgetCategorySearch"
              @click:append="budgetCategoriesDropDown"
              @input="startSearchBudgetCategory"
            />

            <div
              v-if="showBudgetCategorySearch"
              class="budget-cat-select"
            >
              <div v-if="searchBudgetCategoriesArray.length">
                <v-list three-line>
                  <v-list-tile
                    v-for="(catItem, index) in searchBudgetCategoriesArray"
                    :key="index"
                    dense
                    @click="budgetCategorySearchSelect(catItem)"
                  >
                    <v-list-tile-content>
                      <v-list-tile-sub-title>
                        {{
                          catItem.name
                        }}
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </div>
              <div
                v-else
                class="text-center"
              >
                Search Cost Element Category
              </div>
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
                  class="pa-0 rounded-lg"
                  flat
                >
                  <v-card-title class="headline px-6 py-4 white">
                    <span class="grey--text text--darken-1">
                      {{ item.code ? item.code + " -" : "" }} {{ item.name }}
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
                  <v-divider class="grey lighten-3" />
                </v-card>
                <v-card
                  class="pa-0"
                  flat
                >
                  <v-card-text class="pa-0 vertical-scroll">
                    <v-expansion-panel class="elevation-0">
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
                              {{ itemL2.code ? itemL2.code + " -" : "" }}
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
                          <v-divider class="grey lighten-3" />
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
                                  {{ itemL3.code ? itemL3.code + " -" : "" }}
                                  {{ itemL3.name }}
                                </span>
                                <v-spacer />
                                <v-btn
                                  class="ma-1"
                                  icon
                                  small
                                  @click.stop="
                                    setCostCodeL3(item, itemL2, itemL3)
                                  "
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
                              <v-divider class="grey lighten-3" />
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
            <label>Commitment Type</label>
            <v-select
              v-model="commitment.commit"
              clearable
              :options="settings.types"
            />
          </div>

          <div class="form-group">
            <label>From Changes</label>
            <v-select
              v-model="commitment.change"
              clearable
              label="title"
              multiple
              :options="changes"
              @input="onChangeSelected"
            >
              <template
                slot="option"
                slot-scope="option"
              >
                {{ option.title }} - {{ option.amount | currency }}
                <template v-if="option.forecast">
                  -
                  <v-icon
                    color="green"
                    small
                  >
                    mdi-check
                  </v-icon>
                  In Forecast
                </template>
              </template>
              <template slot="no-options">
                type to search users..
              </template>
            </v-select>
          </div>

          <div class="form-group">
            <label>Status</label>
            <v-select
              v-model="commitment.status"
              clearable
              :options="settings.status"
            />
          </div>

          <div class="form-group margin-bottom-25">
            <v-text-field
              v-model="commitment.completionDateText"
              append-icon="calendar_today"
              color="blue"
              label="Completion Date"
              mask="date"
              @click:append="showCalendarCompletionDate"
            />
            <datetime
              ref="completionDatePopup"
              v-model="commitment.completionDate"
              format="MM/dd/yyyy"
              style="position: absolute; top: -5000px;"
              tabindex="-1"
              value-zone="local"
              :week-start="7"
              @close="setCompletionDate"
            />
          </div>

          <div class="form-group">
            <v-textarea
              v-model="commitment.notes"
              color="blue"
              label="Notes"
              rows="6"
            />
          </div>

          <div class="form-group">
            <h5 class="mt-3">
              Attachments
              <v-btn
                class="mt-0"
                icon
                small
                @click.native.stop="selectFile"
              >
                <v-icon
                  color="blue"
                  small
                >
                  mdi-plus
                </v-icon>
              </v-btn>
            </h5>
            <v-divider class="mt-0" />
            <input
              v-show="false"
              id="files"
              ref="uploadInput"
              :multiple="true"
              name="file"
              type="file"
              @change="detectFiles($event)"
            >
            <v-dialog
              v-model="dialog"
              persistent
              width="300"
            >
              <v-card
                color="blue"
                dark
              >
                <v-card-text class="pt-2">
                  Please stand by, uploading files...
                  <v-progress-linear
                    class="mb-0"
                    color="white"
                    indeterminate
                  />
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-treeview
              v-model="tree"
              activatable
              :active.sync="active"
              hoverable
              item-key="path"
              :items="commitmentFiles"
              :open="open"
              open-on-click
            >
              <template
                slot="prepend"
                slot-scope="{ item, open, leaf }"
              >
                <v-icon v-if="!item.file">
                  {{ open ? "mdi-folder-open" : "mdi-folder" }}
                </v-icon>
                <v-icon
                  v-else-if="
                    item.file === 'image/jpeg' || item.file === 'image/png'
                  "
                >
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

        <div class="form-group">
          <div
            class="action-container"
            style="margin-top: 30px; text-align: center"
          >
            <v-btn
              color="blue darken-3"
              outline
              @click.prevent="cancel"
            >
              Cancel
            </v-btn>
            <v-btn
              color="blue darken-3"
              dark
              :loading="submitLoading"
              @click.prevent="save"
            >
              {{ submitLoading ? "Saving..." : "Save" }}
            </v-btn>
          </div>
        </div>
      </div>

      <div class="col-sm-6 margin-top-15">
        <div class="card-container">
          <h4>Line item Information</h4>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.title"
              color="blue"
              label="Title"
              :rules="[rules.required]"
            />
          </div>

          <div class="form-group">
            <label>Vendor</label>
            <v-select
              v-model="lineItem.vendor"
              clearable
              label="title"
              :options="vendors"
            >
              <template
                slot="option"
                slot-scope="option"
              >
                <v-chip
                  v-if="option.preferred === '1'"
                  color="green lighten-1"
                  dark
                  small
                >
                  Preferred
                </v-chip>{{ option.title }}
              </template>
            </v-select>
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.account"
              color="blue"
              label="Commitment Account"
            />
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.line_number"
              color="blue"
              label="Line number"
            />
          </div>

          <!--
        <div class="form-group margin-top-50">
          <v-text-field color="blue" label="Created At" :value="lineItem.createdAt.seconds | formatCreateDate" :rules="[rules.required]" :disabled="true" :readonly="true">
          </v-text-field>
        </div>
        -->

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.fiscal_year"
              color="blue"
              label="Fiscal year"
            />
          </div>

          <div class="form-group margin-top-25">
            <label>Amount</label>
            <money
              v-model="lineItem.amount"
              v-bind="money"
            />
          </div>

          <div class="form-group margin-top-25">
            <label>Cost per item</label>

            <money
              v-model="lineItem.cost_per_item"
              v-bind="money"
            />
          </div>

          <div class="form-group margin-top-25">
            <label>Invoice total</label>
            <money
              v-model="lineItem.invoiceTotal"
              v-bind="money"
            />
          </div>

          <div class="form-group margin-top-25">
            <label>Quantity</label>
            <money v-model="lineItem.quantity" />
          </div>

          <div class="form-group margin-top-25">
            <label>Quantity amount</label>
            <money
              v-model="lineItem.quantity_amount"
              v-bind="money"
            />
          </div>

          <div class="form-group margin-top-25">
            <label>Tax amount</label>
            <money
              v-model="lineItem.tax_amount"
              v-bind="money"
            />
          </div>

          <div class="form-group margin-top-25">
            <label>Total open amount with tax</label>
            <money
              v-model="lineItem.total_open_amount_w_tax"
              v-bind="money"
            />
          </div>

          <div class="form-group margin-top-25">
            <label>Total PO line amount</label>
            <money
              v-model="lineItem.total_po_line_amount"
              v-bind="money"
            />
          </div>

          <div class="form-group">
            <v-textarea
              v-model="lineItem.description"
              color="blue"
              label="Description"
            />
          </div>

          <div class="form-group margin-bottom-25">
            <v-text-field
              v-model="lineItem.startDateText"
              append-icon="calendar_today"
              color="blue"
              label="Start Date"
              mask="date"
              @click:append="showCalendarStartDate"
            />
            <datetime
              ref="startDatePopup"
              v-model="startDate"
              :disabled="true"
              format="MM/dd/yyyy"
              :readonly="true"
              style="position: absolute; top: -5000px;"
              tabindex="-1"
              value-zone="local"
              :week-start="7"
              @close="setStartDate"
            />
          </div>

          <div class="form-group margin-bottom-25">
            <v-text-field
              v-model="lineItem.deliveryDateText"
              append-icon="calendar_today"
              color="blue"
              label="Delivery Date"
              mask="date"
              @click:append="showCalendarDeliveryDate"
            />
            <datetime
              ref="deliveryDatePopup"
              v-model="lineItem.deliveryDate"
              format="MM/dd/yyyy"
              style="position: absolute; top: -5000px;"
              tabindex="-1"
              value-zone="local"
              :week-start="7"
              @close="setDeliveryDate"
            />
          </div>
        </div>
      </div>
    </v-form>
  </div>
</template>

<script>
import { db, storage } from '@/utils/Firebase'
import { Money } from 'v-money'
import { mapState, mapGetters } from 'vuex'
import { DateTime } from 'luxon'

export default {
  name: 'Commitment',
  components: { Money },
  filters: {
    formatCreateDate: function (value) {
      return new Date(value * 1000)
    }
  },
  props: {
    commitmentId: {
      type: [Number, String],
      default: undefined
    },
    lineItemId: {
      type: [Number, String],
      default: undefined
    }
  },
  data() {
    return {
      costCodesAllArray: [],
      showBudgetCategorySearch: false,
      categorySelected: true,
      commitmentFiles: [],
      tree: [],
      active: [],
      open: ['Files'],
      imageUrl: null,
      pdfUrl: null,
      dialog: false,
      project: {},
      projectRef: db.collection('cpm_projects').doc(this.$route.params.id),
      submitLoading: false,
      settings: {},
      budgetSettings: {},
      commitment: {},
      lineItem: {},
      changes: [],
      rules: {
        required: value => !!value || 'Required.'
      },
      showCostCodes: false,
      rootStorageFolder: 'images/projects/commitments/',
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '$',
        precision: 2,
        masked: false
      }
    }
  },

  computed: {
    ...mapGetters(['vendors']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    startDate: {
      get: function () {
        if (this.lineItem.startDate && this.lineItem.startDate > 0) {
          return new Date(this.lineItem.startDate).toISOString()
        }
        return ''
      },
      set: function (newValue) {
        if (newValue) {
          this.lineItem.startDate = new Date(newValue).getTime()
        } else {
          this.lineItem.startDate = ''
        }
      }
    },
    searchBudgetCategoriesArray() {
      if (this.commitment.costCodeText === undefined) {
        return []
      }
      const result = []
      this.costCodesAllArray.map(cc => {
        if (
          cc.name
            .toLowerCase()
            .includes(this.commitment.costCodeText.toLowerCase())
        ) {
          result.push(cc)
        }
      })
      return result
    }
  },
  firestore() {
    return {
      project: this.projectRef,
      commitment: this.projectRef
        .collection('commitments')
        .doc(this.commitmentId + ''),
      lineItem: this.projectRef
        .collection('commitments')
        .doc(this.commitmentId + '')
        .collection('line_items')
        .doc(this.lineItemId + ''),
      changes: this.projectRef.collection('changes'),
      // vendors: db.collection('vendors'),
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('commitments'),
      budgetSettings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('budgets')
    }
  },
  watch: {
    budgetSettings() {
      this.costCodesAllArray = []
      this.budgetSettings.costCodes.forEach(cl1 => {
        const itemName = cl1.code ? `${cl1.code} - ${cl1.name}` : cl1.name
        this.costCodesAllArray.push({
          item: cl1,
          name: itemName,
          level: 1
        })
        if (cl1.cat_1.length) {
          cl1.cat_1.forEach(cl2 => {
            let itemL2Name = itemName + ' | '
            itemL2Name += cl2.code ? `${cl2.code} - ${cl2.name}` : cl2.name
            this.costCodesAllArray.push({
              item: cl1,
              itemL2: cl2,
              name: itemL2Name,
              level: 2
            })
            if (cl2.cat_2.length) {
              cl2.cat_2.forEach(cl3 => {
                let itemL3Name = itemL2Name + ' | '
                itemL3Name += cl3.code ? `${cl3.code} - ${cl3.name}` : cl3.name
                this.costCodesAllArray.push({
                  item: cl1,
                  itemL2: cl2,
                  itemL3: cl3,
                  name: itemL3Name,
                  level: 3
                })
              })
            }
          })
        }
      })
    },
    active() {
      if (!this.active.length) return undefined
      const item = this.commitmentFiles.find(c => c.path === this.active[0])
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
    project() {
      const path =
        this.project.files[1].children[9].path + '/' + this.commitmentId
      const folder = this.project.files[1].children[9].children.find(
        dir => dir.path === path
      )
      if (folder) {
        this.commitmentFiles = folder.children
      }
    }
  },

  mounted() {},

  methods: {
    setStartDate() {
      const dateObj = DateTime.fromMillis(this.lineItem.startDate)
      this.lineItem.startDateText = dateObj.toFormat('MM/dd/yyyy')
    },
    showCalendarStartDate() {
      this.$refs.startDatePopup.isOpen = true
    },
    setDeliveryDate() {
      const date = DateTime.fromISO(this.lineItem.deliveryDate)
      this.lineItem.deliveryDateText = date.toFormat('MM/dd/yyyy')
    },
    showCalendarDeliveryDate() {
      this.$refs.deliveryDatePopup.isOpen = true
    },
    setCompletionDate() {
      const date = DateTime.fromISO(this.commitment.completionDate)
      this.commitment.completionDateText = date.toFormat('MM/dd/yyyy')
    },
    showCalendarCompletionDate() {
      this.$refs.completionDatePopup.isOpen = true
    },
    startSearchBudgetCategory() {
      this.showBudgetCategorySearch = true
      this.showCostCodes = false
      this.categorySelected = false
    },
    budgetCategoriesDropDown() {
      this.showCostCodes = !this.showCostCodes
      this.showBudgetCategorySearch = false
    },
    budgetCategorySearchSelect(catItem) {
      if (catItem.level === 1) {
        this.setCostCodeL1(catItem.item)
      } else if (catItem.level === 2) {
        this.setCostCodeL2(catItem.item, catItem.itemL2)
      } else if (catItem.level === 3) {
        this.setCostCodeL3(catItem.item, catItem.itemL2, catItem.itemL3)
      }
      this.showBudgetCategorySearch = false
    },
    setCostCodeL1(item) {
      if (item.code) {
        this.commitment.costCodeText = item.code + ' - ' + item.name
      } else {
        this.commitment.costCodeText = item.name
      }
      this.commitment.budgetCategory = item.name
      this.commitment.costCode = item.name
      this.commitment.costCodeNumber = item.code

      this.showCostCodes = false
      this.categorySelected = true
    },
    setCostCodeL2(item, itemL2) {
      if (item.code) {
        this.commitment.costCodeText =
          itemL2.code + ' - ' + item.name + ' - ' + itemL2.name
      } else {
        this.commitment.costCodeText = item.name + ' - ' + itemL2.name
      }
      this.commitment.budgetCategory = item.name
      this.commitment.costCode = item.name
      this.commitment.costCodeL2 = itemL2.name
      this.commitment.costCodeNumber = itemL2.code
      this.showCostCodes = false
      this.categorySelected = true
    },
    setCostCodeL3(item, itemL2, itemL3) {
      if (item.code) {
        this.commitment.costCodeText =
          itemL3.code +
          ' - ' +
          item.name +
          ' - ' +
          itemL2.name +
          ' - ' +
          itemL3.name
      } else {
        this.commitment.costCodeText =
          item.name + ' - ' + itemL2.name + ' - ' + itemL3.name
      }
      this.commitment.budgetCategory = item.name
      this.commitment.costCode = item.name
      this.commitment.costCodeL2 = itemL2.name
      this.commitment.costCodeL3 = itemL3.name
      this.commitment.costCodeNumber = itemL3.code
      this.showCostCodes = false
      this.categorySelected = true
    },
    cancel() {
      this.$emit('close')
    },
    onChangeSelected() {
      this.lineItem.amount = 0
      this.lineItem.change.forEach(change => {
        this.lineItem.amount += parseFloat(change.amount)
      })
    },
    save() {
      if (!this.commitment.budgetCategory || !this.categorySelected) {
        this.$snotify.error('Budget Category is Required', 'Error')
        return
      }
      if (this.lineItem.startDateText) {
        const startDate = DateTime.fromFormat(
          this.lineItem.startDateText,
          'MMddyyyy'
        )
        if (!startDate.isValid) {
          this.$snotify.error('The Start Date is invalid', 'Error')
          return false
        } else {
          this.lineItem.startDate = startDate.valueOf()
        }
      } else {
        delete this.lineItem.startDate
      }
      if (this.lineItem.deliveryDateText) {
        const deliveryDate = DateTime.fromFormat(
          this.lineItem.deliveryDateText,
          'MMddyyyy'
        )
        if (!deliveryDate.isValid) {
          this.$snotify.error('The Delivery Date is invalid', 'Error')
          return false
        } else {
          this.lineItem.deliveryDate = deliveryDate.toISO()
        }
      } else {
        delete this.lineItem.deliveryDate
      }
      if (this.lineItem.completionDateText) {
        const completionDate = DateTime.fromFormat(
          this.lineItem.completionDateText,
          'MMddyyyy'
        )
        if (!completionDate.isValid) {
          this.$snotify.error('The Completion Date is invalid', 'Error')
          return false
        } else {
          this.lineItem.completionDate = completionDate.toISO()
        }
      } else {
        delete this.lineItem.completionDate
      }
      const formIsValid = this.$refs.form.validate()
      if (formIsValid) {
        this.submitLoading = true
        if (this.lineItem.change) {
          const changeArr = []
          this.lineItem.change.forEach(change => {
            const changeRef = this.projectRef
              .collection('changes')
              .doc(change.id)
            changeRef.update({ forecast: false })
            changeArr.push(changeRef)
          })
          this.lineItem.change = changeArr
        }

        const path =
          this.project.files[1].children[9].path + '/' + this.commitment.id
        const folderName = this.commitment.number + ' ' + this.lineItem.title

        const folder = this.project.files[1].children[9].children.find(
          dir => dir.path === path
        )
        if (folder && folderName !== folder.name) {
          folder.name = folderName
          db.collection('cpm_projects')
            .doc(this.$route.params.id)
            .update({
              files: this.project.files
            })
        }

        this.projectRef
          .collection('commitments')
          .doc(this.commitmentId + '')
          .update(this.commitment)
        this.projectRef
          .collection('commitments')
          .doc(this.commitmentId + '')
          .collection('line_items')
          .doc(this.lineItemId + '')
          .update(this.lineItem)

        this.$snotify.success('The Commitment has been updated', 'Success')
        this.$emit('update', this.lineItem)
      } else {
        this.$snotify.error('please fill all required fields', 'error')
      }
    },

    selectFile() {
      this.$refs.uploadInput.click()
    },

    async detectFiles(e) {
      const fileList = e.target.files || e.dataTransfer.files
      const duplicates = []
      Array.from(Array(fileList.length).keys()).map(x => {
        const file = fileList[x]
        const duplicate = this.commitmentFiles.find(
          c => c.name === file.name
        )
        if (duplicate) {
          duplicates.push(duplicate)
        }
      })

      if (duplicates.length) {
        let msg =
          'The following file(s) already exist and will be overwritten: '
        duplicates.map(d => {
          msg += `${d.name}, `
        })
        msg += 'Do you want to continue?'
        const confirmation = confirm(msg)
        if (confirmation) {
          duplicates.map(d => {
            const index = this.commitmentFiles.indexOf(d)
            this.commitmentFiles.splice(index, 1)
          })
        } else {
          return false
        }
      }

      this.dialog = true
      const path =
        this.project.files[1].children[9].path + '/' + this.commitment.id
      await Promise.all(
        Array.from(Array(fileList.length).keys()).map(x => {
          const file = fileList[x]
          return storage
            .ref(`projects/${this.project.id}${path}/${file.name}`)
            .put(file)
        })
      ).then(async uploadedFiles => {
        await Promise.all(
          uploadedFiles.map(snapshot =>
            snapshot.ref.getDownloadURL().then(downloadUrl => {
              this.commitmentFiles.push({
                name: snapshot.ref.name,
                file: snapshot.metadata.contentType,
                size: snapshot.metadata.size,
                url: downloadUrl,
                path: snapshot.ref.fullPath
              })
            })
          )
        )
      })
      db.collection('cpm_projects')
        .doc(this.$route.params.id)
        .update({
          files: this.project.files
        })
      this.dialog = false
    },
    deleteFile(item) {
      const confirmation = confirm(
        `Are you sure you want to delete this file: ${item.name}`
      )
      if (confirmation) {
        if (this.active.length && item.name === this.active[0]) {
          this.imageUrl = null
        }
        const deletePath = item.path
        const fileObj = this.commitmentFiles.find(c => c.path === item.path)
        const index = this.commitmentFiles.indexOf(fileObj)
        this.commitmentFiles.splice(index, 1)
        storage
          .ref(deletePath)
          .delete()
          .then(() => {
            db.collection('cpm_projects')
              .doc(this.$route.params.id)
              .update({
                files: this.project.files
              })
            this.$snotify.success('The file was deleted', 'Success')
          })
          .catch(error => {
            console.error(`file delete error occured: ${error}`)
          })
      }
    }
  }
}
</script>

<style lang="scss"></style>

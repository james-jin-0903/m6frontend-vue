<template>
  <v-dialog
    v-model="show"
    max-width="800px"
    persistent
  >
    <v-card class="contact-edit-modal rounded-lg">
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">
          <template
            v-if="isCreate"
          >
            Create Commitment Line Item
          </template>
          <template
            v-else
          >
            Edit Commitment Line Item
          </template>
        </span>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-card-text
        class="vertical-scroll"
        :style="viewPortStyles"
      >
        <v-container class="rounded-lg">
          <v-form ref="form">
            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Title
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-text-field
                  v-model="lineItem.title"
                  color="blue"
                  :rules="titleRules"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="shrink">
                      CPA
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-text-field
                  v-model="lineItem.cpa"
                  color="blue"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Vendor
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-text-field v-model="lineItem.vendor" />
                <!--<v-autocomplete
                  v-model="lineItem.vendor"
                  clearable
                  item-text="title"
                  :items="vendors"
                  return-object
                >
                  <template
                    slot="item"
                    slot-scope="{ item }"
                  >
                    <v-chip
                      v-if="item.preferred === '1'"
                      color="green lighten-1"
                      dark
                      small
                    >
                      Preferred
                    </v-chip>
                    {{ item.title }}
                  </template>
                </v-autocomplete>-->
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="shrink">
                      Vendor ID
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-text-field
                  v-model="lineItem.vendorId"
                  color="blue"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Commitment Account
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-text-field v-model="lineItem.account" />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="shrink">
                      PO Number
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-text-field
                  v-model="lineItem.po_number"
                  color="blue"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Line number
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-text-field
                  v-model="lineItem.line_number"
                  color="blue"
                />
              </v-col>
            </v-row>


            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="shrink">
                      Paid to Date
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-menu
                  v-model="paidToDateMenu"
                  :close-on-content-click="false"
                  min-width="290px"
                  :nudge-right="40"
                  offset-y
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="lineItem.paidToDateText"
                      append-icon="mdi-calendar"
                      color="blue"
                      label="Paid to Date"
                      mask="date"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="lineItem.paidToDate"
                    @change="setPaidToDate"
                  />
                </v-menu>
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="shrink">
                      Accrual
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <money
                  v-model="lineItem.accrual"
                  v-bind="money"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Fiscal year
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-text-field
                  v-model="lineItem.fiscal_year"
                  color="blue"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Amount
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <money
                  v-model="lineItem.amount"
                  v-bind="money"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Paid To Date
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <money
                  v-model="lineItem.paidToDateAmount"
                  v-bind="money"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="shrink">
                      PO Remaining (Open) with Accrual
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <money
                  v-model="lineItem.poRemainingWithAccrual"
                  v-bind="money"
                  :disabled="true"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="shrink">
                      Document Date
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-menu
                  v-model="documentDateMenu"
                  :close-on-content-click="false"
                  min-width="290px"
                  :nudge-right="40"
                  offset-y
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="lineItem.documentDateText"
                      append-icon="mdi-calendar"
                      color="blue"
                      label="Document Date"
                      mask="date"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="lineItem.documentDate"
                    @change="setDocumentDate"
                  />
                </v-menu>
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Cost per item
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <money
                  v-model="lineItem.cost_per_item"
                  v-bind="money"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Invoice total
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <money
                  v-model="lineItem.invoiceTotal"
                  v-bind="money"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Quantity
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <money v-model="lineItem.quantity" />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Quantity amount
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <money
                  v-model="lineItem.quantity_amount"
                  v-bind="money"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Tax amount
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <money
                  v-model="lineItem.tax_amount"
                  v-bind="money"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Total open amount with tax
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <money
                  v-model="lineItem.total_open_amount_w_tax"
                  v-bind="money"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Total PO line amount
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <money
                  v-model="lineItem.total_po_line_amount"
                  v-bind="money"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      PO Line Item description 1
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-textarea
                  v-model="lineItem.description"
                  color="blue"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="shrink">
                      PO Line Item description 2
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-textarea
                  v-model="lineItem.description2"
                  color="blue"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="shrink">
                      Company Code
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-text-field
                  v-model="lineItem.companyCode"
                  color="blue"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="shrink">
                      GL Account #
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-text-field
                  v-model="lineItem.glAccount"
                  color="blue"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="shrink">
                      WBS Element
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-text-field
                  v-model="lineItem.wbsElement"
                  color="blue"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Start Date
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-menu
                  v-model="startDateMenu"
                  :close-on-content-click="false"
                  min-width="290px"
                  :nudge-right="40"
                  offset-y
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="lineItem.startDateText"
                      color="blue"
                      label="Start Date"
                      mask="date"
                      v-on="on"
                    >
                      <template #append>
                        <v-icon>mdi-calendar-today</v-icon>
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    @change="setStartDate"
                  />
                </v-menu>
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Delivery Date
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-menu
                  v-model="deliveryDateMenu"
                  :close-on-content-click="false"
                  min-width="290px"
                  :nudge-right="40"
                  offset-y
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="lineItem.deliveryDateText"
                      append-icon="mdi-calendar-today"
                      color="blue"
                      label="Delivery Date"
                      mask="date"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="lineItem.deliveryDate"
                    @change="setDeliveryDate"
                  />
                </v-menu>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="$emit('close-only')"
        >
          Cancel
        </v-btn>

        <v-btn
          v-if="isCreate"
          text
          @click="create"
        >
          Create
        </v-btn>

        <v-btn
          v-if="!isCreate"
          text
          @click="update"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
    <m6-loading :loading="showLoading" />
  </v-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'
import { Money } from 'v-money'
import { DateTime } from 'luxon'
import { mapActions } from 'vuex'

export default {
  components: { Money },
  props: {
    show: { default: false },
    commitmentId: { default: '' },
    lineItemId: { default: '' },
    isCreate: { default: false },
    vendors: { default: () => [] }
  },
  data() {
    return {
      showLoading: false,
      startDateMenu: false,
      deliveryDateMenu: false,
      paidToDateMenu: false,
      documentDateMenu: false,
      projectRef: db.collection('cpm_projects').doc(this.$route.params.id),
      titleRules: [v => !!v || 'Title is required'],
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '$',
        precision: 2,
        masked: false
      },
      lineItem: {},
      viewPortHeight:
        Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        ) * 0.6
    }
  },
  firestore() {
    const aux = {}
    if (this.lineItemId)
    // only if lineItemId is provided
    {
      aux.lineItem = this.projectRef
        .collection('commitments')
        .doc(this.commitmentId + '')
        .collection('line_items')
        .doc(this.lineItemId + '')
    }
    return aux
  },
  computed: {
    viewPortStyles() {
      return { height: `${this.viewPortHeight}px !important` }
    },
    startDate: {
      get: function () {
        if (this.lineItem.startDate && this.lineItem.startDate > 0) {
          // return new Date(this.lineItem.startDate).toISOString()
          const date = new Date(this.lineItem.startDate)
          return `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate()}`
        }
        return ''
      },
      set: function (newValue) {
        if (newValue) {
          const [year, month, day] = newValue.split('-')
          this.lineItem.startDate = new Date(
            `${month}/${day}/${year}`
          ).getTime()
        } else {
          this.lineItem.startDate = ''
        }
      }
    },
    commitmentRef() {
      if (!this.projectRef || !this.commitmentId) return

      return this.projectRef
        .collection('commitments')
        .doc(this.commitmentId + '')
    }
  },
  methods: {
    ...mapActions('cpm/projects/commitments', {
      createLineItem: 'createLineItem',
      updateLineItem: 'updateLineItem',
      updateAccrual: 'updateAccrual'
    }),
    update() {
      if (!this.$refs.form.validate()) {
        this.$snotify.error('Please fill in all required fields', 'Error')
        return
      }
      this.showLoading = true
      this.updateLineItem({
        commitmentRef: this.commitmentRef,
        lineItem: this.lineItem,
        lineItemId: this.lineItemId
      })
        .then(() => {
          this.updateAccrual(this.$route.params.id)
          this.showLoading = false
          this.$snotify.success(
            'The line item was successfully updated',
            'Success'
          )
          this.$emit('close')
        })
        .catch(() => {
          this.showLoading = false
          this.$snotify.error(
            'There was an error updating the line item',
            'Error'
          )
          this.$emit('close')
        })
    },
    create() {
      if (!this.$refs.form.validate()) {
        this.$snotify.error('Please fill in all required fields', 'Error')
        return
      }
      this.showLoading = true
      this.createLineItem({
        projectRef: this.projectRef,
        commitmentRef: this.commitmentRef,
        lineItem: this.lineItem
      })
        .then(() => {
          this.updateAccrual(this.$route.params.id)
          this.showLoading = false
          this.$snotify.success('The line item was added', 'Success')
          this.$emit('close')
        })
        .catch(() => {
          this.showLoading = false
          this.$snotify.error(
            'There was an error creating the line item',
            'Error'
          )
          this.$emit('close')
        })
    },
    setStartDate() {
      this.startDateMenu = false
      const dateObj = DateTime.fromMillis(this.lineItem.startDate)
      this.lineItem.startDateText = dateObj.toFormat('MM/dd/yyyy')
    },
    setDeliveryDate() {
      this.deliveryDateMenu = false
      const [year, month, day] = this.lineItem.deliveryDate.split('-')
      const newFormat = `${month}/${day}/${year}`
      this.lineItem.deliveryDateText = newFormat
    },
    setPaidToDate() {
      this.paidToDateMenu = false
      const [year, month, day] = this.lineItem.paidToDate.split('-')
      const newFormat = `${month}/${day}/${year}`
      this.lineItem.paidToDateText = newFormat
    },
    setDocumentDate() {
      this.documentDateMenu = false
      const [year, month, day] = this.lineItem.documentDate.split('-')
      const newFormat = `${month}/${day}/${year}`
      this.lineItem.documentDateText = newFormat
    }
  }
}
</script>

<style lang="scss" scoped>
.v-money{
  padding: 5px;
  width: 100%;
  border-bottom: 1px solid gray
}

.v-money:focus {
  border-bottom: 1px solid var(--v-primary-base)
}
.v-avatar {
  left: 50%;
  transform: translate(-50%);
}

.connected-indicator {
  font-size: 28px !important;
  width: 28px !important;
  position: absolute;
  top: 0;
  right: 0;
  height: 28px !important;
  color: #04d81a;
}

.contact-edit-modal {
  .v-card__title {
    padding: 10px;
    background: #0277bd;
    color: #fff;

    h3 {
      font-weight: 100;
    }
  }
}

.v-select__selection {
  .v-select__selection--comma {
    background-color: rgb(166, 113, 113);
    font-size: 10px;
  }
}
</style>

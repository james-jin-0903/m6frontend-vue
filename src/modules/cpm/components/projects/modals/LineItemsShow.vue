<template>
  <v-dialog
    v-model="show"
    max-width="1000px"
    persistent
  >
    <v-card class="contact-edit-modal rounded-lg">
      <v-card-title class="headline">
        <v-row
          justify="space-between"
        >
          <v-col>
            Line Items
          </v-col>
          <v-col class="text-center">
            PO Number: {{ commitment.number }}
          </v-col>
          <v-col class="text-right">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="white"
                  dark
                  fab
                  small
                  v-on="on"
                  @click="createNewLineItem"
                >
                  <v-icon color="indigo">
                    mdi-plus
                  </v-icon>
                </v-btn>
              </template>
              <span>Create new Line Item</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text
        class="vertical-scroll"
        :style="{ height: getViewPortHeight }"
      >
        <v-container
          class="rounded-lg"
          fluid
        >
          <div class="commitments-table">
            <v-card
              class="rounded-lg"
              elevation="0"
            >
              <v-data-table
                v-if="commitment.line_items"
                :headers="headers"
                :items="commitment.line_items"
                :items-per-page-options="[5,10,15,200]"
              >
                <template
                  slot="item"
                  slot-scope="props"
                >
                  <tr>
                    <td>
                      {{ $h.dg(props.item, 'vendor.title', 'No Company') }}
                    </td>

                    <td>{{ $h.dg(props.item, 'title', '') || $h.dg(props.item, 'description2', '') || '-' }}</td>

                    <td>
                      <span class="go-right">
                        {{ props.item.amount | currency }}
                      </span>
                    </td>

                    <td>
                      <span>
                        {{
                          props.item.startDate
                            ? getFormatedDate(props.item.startDate)
                            : '--/--/--'
                        }}
                      </span>
                    </td>

                    <td class="justify-center layout pr-0 pt-2">
                      <v-col>
                        <v-icon
                          class="mr-2 pointer"
                          color="#757575"
                          size="20"
                          @click="editLineItems(props.item.id)"
                        >
                          mdi-pencil
                        </v-icon>

                        <v-icon
                          class="ml-0 mr-0 pointer"
                          color="#f44336"
                          size="20"
                          @click="deleteLineItem(props.item, props.index)"
                        >
                          mdi-delete
                        </v-icon>
                      </v-col>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card>
          </div>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          elevation="1"
          text
          @click="$emit('close')"
        >
          close
        </v-btn>
      </v-card-actions>
    </v-card>
    <m6-loading :loading="showLoading" />
    <financial-commit-line-items
      v-if="showCreateLineItemsModal"
      :commitment-id="commitment.id"
      :is-create="true"
      :show="showCreateLineItemsModal"
      :vendors="vendors"
      @close="reload"
      @close-only="showCreateLineItemsModal = false"
    />
    <financial-commit-line-items
      v-if="showEditLineItemsModal"
      :commitment-id="commitment.id"
      :is-create="false"
      :line-item-id="lineItemId"
      :show="showEditLineItemsModal"
      :vendors="vendors"
      @close="reload"
      @close-only="showEditLineItemsModal = false"
    />

    <m6-confirm-delete
      message="Are you sure you want to permanently delete this Line Item?"
      :show="showDeleteLineItemsModal"
      title="Delete Line Item"
      @cancel="cancelDeleteLineItem"
      @confirm="submitDelete"
    />
  </v-dialog>
</template>

<script>
import FinancialCommitLineItems from './FinancialCommitLineItems'
import { db } from '@/utils/Firebase'
import { mapActions } from 'vuex'
export default {
  name: 'LineItemsShow',
  components: {
    'financial-commit-line-items': FinancialCommitLineItems
  },
  props: {
    show: { type: Boolean, default: false },
    commitment: { type: Object, default: () => {} },
    vendors: { type: Array, default: () => [] }
  },
  data() {
    return {
      projectRef: db.collection('cpm_projects').doc(this.$route.params.id),
      viewPortHeight:
        Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        ) * 0.63,
      showLoading: false,
      showCreateLineItemsModal: false,
      showEditLineItemsModal: false,
      lineItemId: '',
      showDeleteLineItemsModal: false,
      lineItemToDelete: {},
      lineItemIndexToDelete: 0,
      headers: [
        { text: 'Company Name', value: 'company' },
        { text: 'Line Description', value: 'title' },
        { text: 'Total', value: 'amount' },
        { text: 'Date', value: 'startDate' },
        { text: 'Actions', value: 'name', sortable: false }
      ]
    }
  },
  computed: {
    getViewPortHeight() {
      return `${this.viewPortHeight}px`
    }
  },
  watch: {
    showCreateLineItemsModal(newVal) {
      if (newVal && !this.vendors.length) {
        this.$emit('get-vendors')
      }
    },
    showEditLineItemsModal(newVal) {
      if (newVal && !this.vendors.length) {
        this.$emit('get-vendors')
      }
    }
  },
  methods: {
    ...mapActions('cpm/projects/commitments', {
      deleteLineItemStore: 'deleteLineItem',
      updateAccrual: 'updateAccrual'
    }),
    reload() {
      this.showCreateLineItemsModal = false
      this.showEditLineItemsModal = false
      this.$emit('reload')
    },
    deleteLineItem(lineItem, index) {
      this.lineItemIndexToDelete = index
      this.lineItemToDelete = lineItem
      this.showDeleteLineItemsModal = true
    },
    submitDelete() {
      this.showLoading = true
      this.deleteLineItemStore({
        projectId: this.projectRef.id,
        commitmentId: this.commitment.id,
        lineItemId: this.lineItemToDelete.id
      })
        .then(() => {
          this.updateAccrual(this.$route.params.id)
          this.$delete(this.commitment.line_items, this.lineItemIndexToDelete)
          this.$emit('reload')
          this.$snotify.success('The Line Item has been deleted', 'Success')
          this.showLoading = false
          this.cancelDeleteLineItem()
        })
        .catch(error => {
          console.error(error)
          this.$snotify.error(
            'There was an error while deleting the Line Item',
            'Error'
          )
          this.showLoading = false
          this.cancelDeleteLineItem()
        })
    },
    cancelDeleteLineItem() {
      this.showDeleteLineItemsModal = false
      this.lineItemToDelete = {}
    },
    createNewLineItem() {
      this.showCreateLineItemsModal = true
    },
    editLineItems(lineItemId) {
      this.lineItemId = lineItemId
      this.showEditLineItemsModal = true
    },
    getLineItemTotalOpenAmountTax(lineItem) {
      return lineItem.total_open_amount_w_tax || 0
    },
    getFormatedDate(date) {
      const newDate = new Date(date)
      return `${newDate.getMonth() +
        1}/${newDate.getDate()}/${newDate.getFullYear()}`
    }
  }
}
</script>

<style lang="scss" scoped>
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
    border-bottom:1px solid #eee;
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

.go-right {
  float: right;
}
</style>

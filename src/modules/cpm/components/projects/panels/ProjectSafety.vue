<template>
  <m6-card-dialog title="Safety">
    <template v-slot:after:title>
      <template v-if="searchTxt">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-icon
              class="close-search"
              v-on="on"
              @click="searchTxt = ''"
            >
              mdi-close
            </v-icon>
          </template>
          <span>Clear Search</span>
        </v-tooltip>
      </template>

      <v-icon
        class="cursor"
        light
        @click="openModal"
      >
        mdi-plus
      </v-icon>
    </template>

    <v-row
      justify="end"
    >
      <v-chip color="transparent">
        Hours {{ parseNumber(totalHours) }}
      </v-chip>
    </v-row>

    <div class="text-center">
      <v-progress-circular
        v-show="loading"
        color="primary"
        indeterminate
        :size="32"
      />
    </div>

    <v-data-table
      :headers="headersSafety"
      :items="safetyFiltered"
      :rows-per-page-items="[3]"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td>{{ parseDate(props.item.startDate) }}</td>

        <td class="text-center">
          {{ parseDate(props.item.endDate) }}
        </td>

        <td class="text-center">
          {{ parseNumber(props.item.hours) }}
        </td>

        <td class="text-right">
          <v-icon
            class="mr-1 pointer"
            color="#757575"
            size="20"
            @click="openUpdateSpending(props.item)"
          >
            mdi-pencil
          </v-icon>

          <v-icon
            class="pointer"
            color="#f44336"
            text
            size="20"
            @click="openDeleteSpending(props.item)"
          >
            mdi-delete
          </v-icon>
        </td>
      </template>
    </v-data-table>

    <!-- Spending dialog -->
    <v-dialog
      v-model="dialogSpending"
      max-width="800px"
      persistent
      scrollable
    >
      <v-card v-show="method === 'add' || method === 'put'" class="rounded-lg">
        <v-card-title class="headline white px-6 py-4">
          <span class="grey--text text--darken-1">
            Safety
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-container
              class="pa-0 rounded-lg"
              fluid
            >
              <v-row
                align="center"
                justify="center"
              >
                <v-col cols="4">
                  <div class="font-weight-black subheading">
                    <v-row>
                      <v-col class="align-center d-flex text-nowrap">
                        Start Date
                      </v-col>
                      <v-col class="shrink">
                        <span style="color:red;">*</span>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-menu
                    ref="menu1"
                    v-model="startDatePicker"
                    :close-on-content-click="false"
                    full-width
                    lazy
                    max-width="290px"
                    min-width="290px"
                    :nudge-right="40"
                    offset-y
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dialogProperties.startDateText"
                        hint="MM/DD/YYYY format"
                        label="Start Date"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        :rules="[rules.required]"
                        v-on="on"
                      />
                    </template>

                    <v-date-picker
                      v-model="dialogProperties.startDate"
                      no-title
                      @input="startDatePicker = false"
                    />
                  </v-menu>
                </v-col>
              </v-row>

              <v-row
                align="center"
                justify="center"
              >
                <v-col cols="4">
                  <div class="font-weight-black subheading">
                    <v-row>
                      <v-col class="align-center d-flex text-nowrap">
                        Lost Time Accidents (LTA)
                      </v-col>
                    </v-row>
                  </div>
                </v-col>

                <v-col cols="7">
                  <v-text-field
                    v-model="dialogProperties.lta"
                    label="Lost Time Accidents (LTA)"
                    type="number"
                  />
                </v-col>
              </v-row>

              <v-row
                align="center"
                justify="center"
              >
                <v-col cols="4">
                  <div class="font-weight-black subheading">
                    <v-row>
                      <v-col class="align-center d-flex text-nowrap">
                        Minor
                      </v-col>
                    </v-row>
                  </div>
                </v-col>

                <v-col cols="7">
                  <v-text-field
                    v-model="dialogProperties.minor"
                    label="Minor"
                    type="number"
                  />
                </v-col>
              </v-row>

              <v-row
                align="center"
                justify="center"
              >
                <v-col cols="4">
                  <div class="font-weight-black subheading">
                    <v-row>
                      <v-col class="align-center d-flex text-nowrap">
                        Hours This Period
                      </v-col>
                      <v-col class="shrink">
                        <span style="color:red;">*</span>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>

                <v-col cols="7">
                  <v-text-field
                    v-model="dialogProperties.hours"
                    label="Hours This Period"
                    :rules="[rules.required]"
                    type="number"
                  />
                </v-col>
              </v-row>

              <v-row
                align="center"
                justify="center"
              >
                <v-col cols="4">
                  <div class="font-weight-black subheading">
                    <v-row>
                      <v-col class="align-center d-flex text-nowrap">
                        End Date
                      </v-col>
                      <v-col class="shrink">
                        <span style="color:red;">*</span>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-menu
                    ref="menu2"
                    v-model="endDatePicker"
                    :close-on-content-click="false"
                    full-width
                    lazy
                    max-width="290px"
                    min-width="290px"
                    :nudge-right="40"
                    offset-y
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dialogProperties.endDateText"
                        hint="MM/DD/YYYY format"
                        label="End Date"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        :rules="[rules.required]"
                        v-on="on"
                      />
                    </template>

                    <v-date-picker
                      v-model="dialogProperties.endDate"
                      no-title
                      @input="endDatePicker = false"
                    />
                  </v-menu>
                </v-col>
              </v-row>

              <v-row
                align="center"
                justify="center"
              >
                <v-col cols="4">
                  <div class="font-weight-black subheading">
                    <v-row>
                      <v-col class="align-center d-flex text-nowrap">
                        Status
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-select
                    v-model="dialogProperties.status"
                    clearable
                    :items="status"
                    label="Status"
                  />
                </v-col>
              </v-row>

              <v-row
                align="center"
                justify="center"
              >
                <v-col cols="4">
                  <div class="font-weight-black subheading">
                    <v-row>
                      <v-col class="align-center d-flex text-nowrap">
                        Comment
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-textarea v-model="dialogProperties.comment" />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="gray"
            :disabled="loading"
            text
            :loading="loading"
            @click="closeModal"
          >
            Close
          </v-btn>
          <v-btn
            color="primary"
            :disabled="loading"
            text
            :loading="loading"
            @click="saveSafety"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End spending dialog -->

    <!-- End line item dialog -->

    <m6-confirm-delete
      message="Are you sure you want to permanently delete this Safety ?"
      :show="method === 'delete'"
      title="Delete Safety"
      @cancel="closeModal"
      @confirm="deleteSpending"
    />

    <m6-loading :loading="showLoading" />
  </m6-card-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'

import axios from 'axios'
import { Money } from 'v-money'
import FirebaseReportComponent from './FirebaseReportComponent.vue'
import SearchingModal from '../modals/SearchingModal'
import { mapState } from 'vuex'

const defaultItemSafety = {
  startDate: '',
  lta: 0,
  minor: '',
  hours: '',
  endDate: '',
  comment: '',
  status: { id: 'reds', text: 'Red' }
}

export default {
  name: 'ProjectSafety',
  components: {
    Money,
    searching: SearchingModal
  },

  extends: FirebaseReportComponent,

  props: {
    pid: {
      type: [String, Number],
      default: undefined
    }
  },

  data() {
    const projectId = this.pid ? this.pid : this.$route.params.id

    return {
      status: [
        { value: 'reds', text: 'Red' },
        { value: 'greens', text: 'Green' },
        { value: 'yellows', text: 'Yellow' }
      ],
      updateScreen: 1,
      viewPortHeight:
        Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        ) * 0.63,
      projectId,
      startDatePicker: false,
      endDatePicker: false,
      searchTxt: '',
      showSearchingModal: false,
      projectRef: db.collection('cpm_projects').doc(projectId),
      showLineItemsModal: false,
      spendingToShow: {},
      loading: false,
      project: {},
      dialogProperties: { ...defaultItemSafety },
      method: 'add',
      dialogSpending: false,
      safety: [],
      commitments: [],
      // idstring for files when adding
      folderName: '',
      // Files
      filesToAdd: [],
      files: [],
      // Files to sgow
      spendingFiles: [],
      // Tree
      tree: [],
      active: [],
      open: [],
      rules: {
        required: value => !!value || 'Required.'
      },
      formValues: ['number', 'commitment', 'costCodeText'],
      valid: true,
      headersSafety: [
        { text: 'Period Start', value: 'startDate' },
        { text: 'Perior End', value: 'endDate' },
        { text: 'Hours', value: 'hours },
        { text: 'Actions', value: 'number', sortable: false }
      ],
      validLineItem: true,
      methodLineItem: 'add',
      dialogLineItem: false,
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '$',
        precision: 2,
        masked: false
      },
      dialogLineItemDateText: false,
      dialogLineItemPaidDateText: false,
      vendors: [],
      // auxliar dates format
      date: new Date().toISOString().substr(0, 10),
      paidDate: new Date().toISOString().substr(0, 10),
      budgetSettings: [],
      costCodesAllArray: [],
      totalHours: 0,
      itemToDelete: {},
      lineItemDeleteModal: false,
      showLoading: false
    }
  },

  firestore() {
    return {
      project: db.collection('cpm_projects').doc(this.$route.params.id),
      budgetSettings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('budgets')
    }
  },

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),

    getViewPortHeight() {
      return `${this.viewPortHeight}px`
    },

    safetyFiltered() {
      if (!this.searchTxt) {
        return this.safety
      } else {
        return this.safety.filter(safety =>
          safety.number.toLowerCase().includes(this.searchTxt)
        )
      }
    }
  },

  watch: {
    'dialogProperties.startDate': function (newVal) {
      this.dialogProperties.startDateText = this.parseDate(newVal)
    },
    'dialogProperties.endDate': function (newVal) {
      this.dialogProperties.endDateText = this.parseDate(newVal)
    }
  },

  mounted() {
    Promise.all([this.getSafety()]).then(() => {
      this.getTotalHours()
    })
  },

  methods: {
    parseNumber(number) {
      return Number(number).toLocaleString('en')
    },
    showSpendingLineItemsFromCommitment(payload) {
      const spendingSelected = this.spendings.find(spending => spending.id === payload.spending.id)

      this.showLineItems(spendingSelected)
    },

    budgetCategorySelected(item) {
      this.dialogProperties.costCodeText = item.name
      this.dialogProperties.contingency = item.item.contingency
        ? item.item.contingency
        : false
    },

    searching(searchTxt) {
      this.searchTxt = searchTxt
      this.showSearchingModal = false
    },

    changeCommitment(item) {
      if (item.costCodeText) {
        this.dialogProperties.costCodeText = item.costCodeText
      }
    },

    getTotalFromObjectArray(items, propToSum) {
      if (items && items.length > 0) {
        return items.reduce(function (a, b) {
          return a + b[propToSum]
        }, 0)
      } else {
        return 0
      }
    },

    getTotalHours() {
      this.totalHours = 0
      this.safety.forEach(row => {
        this.totalHours += parseFloat(row.hours)
      })
    },

    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },

    parseDate(date) {
      if (!date) return ''
      const [year, month, day] = date.split('T')[0].split('-')

      return `${month}/${day}/${year}`
    },

    // Lineitems spendings
    getVendors() {
      const aux = new Promise((resolve, reject) => {
        try {
          const vendors = []
          const serverParams = {
            columnFilters: {},
            sort: {
              field: 'name',
              type: 'asc'
            },
            page: 1,
            perPage: 100000
          }
          axios
            .post('/vendor_profiles/get/vendors', serverParams)
            .then(response => {
              if (undefined !== response.data.result && response.data.result) {
                response.data.result.forEach(vendor => {
                  if (!vendor.name) {
                    vendor.name = 'No vendor title'
                  }
                  vendor.title = vendor.name
                  vendors.push(vendor)
                })
              }
              this.vendors = vendors
            })
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },

    findIndexSpending() {
      return this.spendings.findIndex(spending => spending.id === this.dialogProperties.id)
    },

    cancelDelete() {
      this.itemToDelete = {}
      this.lineItemDeleteModal = false
    },

    closeDialogLineSpending() {
      this.dialogLineItem = false
      this.dialogLineItemProperties = { ...defaultLineItemSpending }
      this.resetFormLineSpending()
      this.loading = false
    },

    resetFormLineSpending() {
      this.$refs.formLineItem.reset()
      this.validLineItem = true
    },

    openLineItems() {
      this.dialogLineItemProperties = { ...defaultLineItemSpending }
      this.dialogLineItemProperties.dateText = this.formatDate(
        new Date().toISOString().substr(0, 10)
      )
      this.dialogLineItemProperties.paidDateText = this.formatDate(
        new Date().toISOString().substr(0, 10)
      )
      this.resetFormLineSpending()
      this.methodLineItem = 'add'
      this.dialogLineItem = true
    },

    openEditLineItem(item) {
      this.resetFormLineSpending()
      this.dialogLineItemProperties = item
      this.methodLineItem = 'put'
      this.dialogLineItem = true
    },

    // Spendings
    resetForm() {
      this.$refs.form.reset()
      this.valid = true
    },

    checkErrors() {
      this.valid = this.$refs.form.validate()
      console.log(this.valid)
      if (!this.valid) {
        this.$snotify.error('Please check the errors', 'Error')
      }
    },

    deleteFileNotSaved(item) {
      const confirmation = confirm(
        `Are you sure you want to delete this file: ${item.name}`
      )
      if (confirmation) {
        const index = this.filesToAdd.findIndex(c => c.name === item.name)

        if (index > -1) {
          this.filesToAdd.splice(index, 1)
        }
      }
    },

    detectFilesAdd(e) {
      const fileList = e.target.files || e.dataTransfer.files
      const duplicates = []
      Array.from(Array(fileList.length).keys()).map(x => {
        const file = fileList[x]
        const duplicate = this.filesToAdd.find(c => c.name === file.name)
        if (duplicate) {
          duplicates.push(duplicate)
        } else {
          this.filesToAdd.push({
            name: file.name,
            file: file.type,
            size: file.size,
            url: file.name,
            path: file.name,
            fileToSave: file
          })
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
            const index = this.filesToAdd.indexOf(d)
            this.filesToAdd.splice(index, 1)
          })
        } else {
          return false
        }
      }
    },

    async openModal() {
      this.dialogProperties = { ...this.defaultItemSafety }
      this.resetForm()

      this.method = 'add'
      this.dialogSpending = true
    },

    deleteItem(item, index) {
      const confirmation = confirm('Are you sure you want to delete this item?')
      if (confirmation) {
        this.project.risks.splice(index, 1)
      }
    },

    closeModal() {
      this.dialogSpending = false
      this.dialogProperties = { ...this.defaultItemSafety }
      this.method = 'add'
      this.loading = false
    },

    getParseSafety() {
      return {
        startDate: this.dialogProperties.startDate
          ? this.dialogProperties.startDate
          : '',
        lta: this.dialogProperties.lta ? this.dialogProperties.lta : 0,
        minor: this.dialogProperties.minor ? this.dialogProperties.minor : '',
        hours: this.dialogProperties.hours ? this.dialogProperties.hours : '',
        endDate: this.dialogProperties.endDate
          ? this.dialogProperties.endDate
          : '',
        status: this.dialogProperties.status
          ? this.dialogProperties.status
          : 'reds',
        comment: this.dialogProperties.comment
          ? this.dialogProperties.comment
          : false,
        createdAt: new Date(),
        date: new Date().toISOString()
      }
    },

    async newSafety() {
      // Updating project
      const auxSafety = this.getParseSafety()
      // Add spending
      await this.projectRef
        .collection('safety')
        .add(auxSafety)
        .then(async doc => {
          // adding files
          auxSafety.id = doc.id
          this.safety.push(auxSafety)
          this.getTotalHours()
          // Resetting modal
          this.closeModal()
          this.$snotify.success(
            'The Safety has been created successfully',
            'Success'
          )
        })
    },

    async updateSpending() {
      // Updating project
      const auxSafety = this.getParseSafety()

      const safetyIndex = this.safety.findIndex(safety => safety.id === this.dialogProperties.id)
      // Index not found
      if (safetyIndex < 0) {
        return
      }

      // Updating spendings
      await this.projectRef
        .collection('safety')
        .doc(this.dialogProperties.id)
        .update(auxSafety)
        .then(async () => {
          // updating values in the array
          auxSafety.id = this.dialogProperties.id
          this.$set(this.safety, safetyIndex, auxSafety)

          this.getTotalHours()
          // Resetting modal
          this.closeModal()
          this.$snotify.success(
            'The Safety has been updated successfully',
            'Success'
          )
        })
    },

    getSpendingAmount() {
      let amount = 0
      this.lineItems.forEach(lineItem => {
        amount += parseFloat(lineItem.amount)
      })
      return amount
    },

    async saveSafety() {
      this.checkErrors()

      if (!this.valid) {
        return
      }
      this.loading = true

      switch (this.method) {
        case 'add':
          await this.newSafety()
          break
        case 'put':
          await this.updateSpending()
          break
      }
    },

    getSafety() {
      const aux = new Promise((resolve, reject) => {
        try {
          this.safety = []
          this.projectRef
            .collection('safety')
            .get()
            .then(async snap => {
              if (snap.empty) {
                return
              }

              Promise.all(
                snap.docs.map(async doc => {
                  const safety = doc.data()
                  safety.id = doc.id
                  this.safety.push(safety)
                })
              )
                .then(() => {
                  resolve(true)
                })
                .catch(error => {
                  reject(error)
                })
            })
        } catch (error) {
          reject(error)
        }
      })

      return aux
    },

    openUpdateSpending(safety) {
      this.method = 'put'
      this.dialogSpending = true

      this.dialogProperties = { ...safety }
      this.dialogProperties.id = safety.id
    },

    openDeleteSpending(safety) {
      this.method = 'delete'
      this.dialogSpending = true
      this.dialogProperties = safety
      this.dialogProperties.id = safety.id
    },

    deleteSpending() {
      if (!this.dialogProperties.id) {
        return
      }

      this.loading = true
      const index = this.safety.findIndex(spending => this.dialogProperties.id === spending.id)

      if (index < -1) {
        return
      }

      this.projectRef
        .collection('safety')
        .doc(this.dialogProperties.id)
        .delete()
        .then(() => {
          this.safety.splice(index, 1)
          this.$snotify.success(
            'The safety has been deleted successfully',
            'Success'
          )
          this.closeModal()
          this.getTotalHours()
        })
    }
  }
}
</script>

<style scoped>
.money-fix {
  font-size: 12px !important;
  color: rgba(0, 0, 0, 0.54) !important;
  padding-top: 5px !important;
  padding-bottom: 6px !important;
}

input.v-money {
  margin: 0px !important;
}

.search {
  cursor: pointer;
  color: white;
}

.close-search {
  cursor: pointer;
  color: white;
}

.search-activated {
  margin-top: 0px;
}
</style>

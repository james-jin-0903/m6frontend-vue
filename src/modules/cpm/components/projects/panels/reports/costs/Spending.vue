<template>
  <div>
    <v-form ref="form">
      <div class="col-sm-6 margin-top-15">
        <div class="card-container">
          <h4>Spending Options</h4>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="spending.number"
              color="blue"
              label="Category"
              :rules="requiredText"
            />
          </div>

          <div class="form-group">
            <label>Commitment</label>
            <v-select
              v-model="spending.commitment"
              clearable
              label="number"
              :options="commitments"
            >
              <template
                slot="option"
                slot-scope="option"
              >
                {{ option.number }} - {{ option.title }} - {{ option.amount | currency }} {{ option.vendor ? `- ${option.vendor.title}` : '' }}
              </template>
            </v-select>
          </div>

          <div class="form-group margin-top-25">
            <v-text-field
              v-model="spending.costCodeText"
              color="blue"
              label="Budget Category"
              readonly
            />

            <div class="form-group">
              <v-textarea
                v-model="spending.description"
                color="blue"
                label="Description"
              />
            </div>

            <!--
          append-icon="keyboard_arrow_down"
          @click="showCostCodes = !showCostCodes"
          @click:append="showCostCodes = !showCostCodes"
          -->

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
                  <v-divider class="grey lighten-3" />
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
              label="Reconciled"
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

        <div class="form-group">
          <div
            class="action-container"
            style="margin-top: 30px; text-align: center"
          >
            <v-btn
              color="blue"
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
              {{ submitLoading ? 'Saving...' : 'Save' }}
            </v-btn>
          </div>
        </div>
      </div>

      <div class="col-sm-6 margin-top-15">
        <div class="card-container">
          <h4>Line Item Information</h4>
          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.number"
              color="blue"
              label="Invoice Number"
              :rules="requiredText"
            />
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.po_number"
              color="blue"
              label="PO number"
              :rules="requiredText"
            />
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.project_name"
              color="blue"
              label="Project name"
              :rules="requiredText"
            />
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.line_number"
              color="blue"
              label="Line number"
              :rules="requiredText"
            />
          </div>

          <div class="form-group margin-top-50">
            <label>Amount</label>
            <money
              v-model="lineItem.amount"
              v-bind="money"
            />
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.category"
              color="blue"
              label="Category"
              :rules="requiredText"
            />
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.account"
              color="blue"
              label="Account"
              :rules="requiredText"
            />
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.account_category"
              color="blue"
              label="Account category"
              :rules="requiredText"
            />
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.aoc_code"
              color="blue"
              label="AOC code"
              :rules="requiredText"
            />
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.client_capital_id"
              color="blue"
              label="Client capital ID"
              :rules="requiredText"
            />
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.custom_numeric_1"
              color="blue"
              label="Custom numeric 1"
              :rules="requiredText"
            />
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.custom_text_1"
              color="blue"
              label="Custom text 1"
              :rules="requiredText"
            />
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.custom_text_2"
              color="blue"
              label="Custom text 2"
              :rules="requiredText"
            />
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.custom_text_3"
              color="blue"
              label="Custom text 3"
              :rules="requiredText"
            />
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.custom_text_4"
              color="blue"
              label="Custom text 4"
              :rules="requiredText"
            />
          </div>

          <div class="form-group margin-top-50">
            <v-text-field
              v-model="lineItem.status"
              color="blue"
              label="Status"
              :rules="requiredText"
            />
          </div>

          <div class="form-group margin-bottom-25">
            <v-text-field
              v-model="lineItem.dateText"
              append-icon="calendar_today"
              color="blue"
              label="Date"
              mask="date"
              @click:append="showCalendarDate"
            />

            <datetime
              ref="datePopup"
              v-model="lineItemDate"
              format="MM/dd/yyyy"
              style="position: absolute; top: -5000px;"
              tabindex="-1"
              value-zone="local"
              :week-start="7"
              @close="setDate"
            />
          </div>

          <div class="form-group margin-bottom-25">
            <v-text-field
              v-model="lineItem.paidDateText"
              append-icon="calendar_today"
              color="blue"
              label="Paid Date"
              mask="date"
              @click:append="showCalendarPaidDate"
            />
            <datetime
              ref="paidDatePopup"
              v-model="paidDate"
              format="MM/dd/yyyy"
              style="position: absolute; top: -5000px;"
              tabindex="-1"
              value-zone="local"
              :week-start="7"
              @close="setPaidDate"
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

          <div class="form-group">
            <v-textarea
              v-model="lineItem.line_description"
              color="blue"
              label="Line description"
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
  name: 'Spending',
  components: { Money },
  props: {
    spendingId: {
      type: [Number, String],
      default: ''
    },
    lineItemId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      spendingFiles: [],
      tree: [],
      active: [],
      open: [],
      imageUrl: null,
      pdfUrl: null,
      dialog: false,
      project: {},
      projectRef: db.collection('cpm_projects').doc(this.$route.params.id),
      submitLoading: false,
      settings: {},
      budgetSettings: {},
      spending: {},
      lineItem: {},
      // vendors: [],
      commitments: [],
      requiredText: [
        v => !!v || 'This field is required'
      ],
      showCostCodes: false,
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
    paidDate: {
      get: function () {
        if (this.lineItem.paidDate && this.lineItem.paidDate > 0) {
          return new Date(this.lineItem.paidDate).toISOString()
        }
        return ''
      },
      set: function (newValue) {
        if (newValue) {
          this.lineItem.paidDate = new Date(newValue).getTime()
        } else {
          this.lineItem.paidDate = ''
        }
      }
    },

    lineItemDate: {
      get: function () {
        if (this.lineItem.date && this.lineItem.date > 0) {
          return new Date(this.lineItem.date).toISOString()
        }
        return ''
      },
      set: function (newValue) {
        if (newValue) {
          this.lineItem.date = new Date(newValue).getTime()
        } else {
          this.lineItem.date = ''
        }
      }
    }
  },
  firestore() {
    return {
      project: this.projectRef,
      spending: this.projectRef.collection('spendings').doc(this.spendingId),
      lineItem: this.projectRef.collection('spendings').doc(this.spendingId).collection('line_items').doc(this.lineItemId),
      commitments: this.projectRef.collection('commitments'),
      settings: db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('spendings'),
      budgetSettings: db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('budgets')
      // vendors: db.collection('vendors'),
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
    project() {
      // let path = this.project.files[1].children[6].path + '/' + this.spendingId
      // let folder = this.project.files[1].children[6].children.find(dir => dir.path === path)
      // this.spendingFiles = folder.children
    }
  },

  methods: {

    setPaidDate() {
      const dateObj = DateTime.fromMillis(this.lineItem.paidDate)
      this.lineItem.paidDateText = dateObj.toFormat('MM/dd/yyyy')
    },
    showCalendarPaidDate() {
      this.$refs.paidDatePopup.isOpen = true
    },
    setDate() {
      const date = DateTime.fromMillis(this.lineItem.date)
      this.lineItem.dateText = date.toFormat('MM/dd/yyyy')
    },
    showCalendarDate() {
      this.$refs.datePopup.isOpen = true
    },
    setCostCodeL1(item) {
      this.spending.costCodeText = item.name
      this.spending.budgetCategory = item.name
      this.spending.costCode = item.name
      this.spending.costCodeNumber = item.code
      delete this.spending.commitment
      this.showCostCodes = false
    },
    setCostCodeL2(item, itemL2) {
      this.spending.costCodeText = item.name + ' - ' + itemL2.name
      this.spending.budgetCategory = item.name
      this.spending.costCode = item.name
      this.spending.costCodeL2 = itemL2.name
      this.spending.costCodeNumber = itemL2.code
      delete this.spending.commitment
      this.showCostCodes = false
    },
    setCostCodeL3(item, itemL2, itemL3) {
      this.spending.costCodeText = item.name + ' - ' + itemL2.name + ' - ' + itemL3.name
      this.spending.budgetCategory = item.name
      this.spending.costCode = item.name
      this.spending.costCodeL2 = itemL2.name
      this.spending.costCodeL3 = itemL3.name
      this.spending.costCodeNumber = itemL3.code
      delete this.spending.commitment
      this.showCostCodes = false
    },
    commitmentSelected(item) {
      if (item && item.title) {
        delete this.spending.budgetCategory
        delete this.spending.costCode
        delete this.spending.costCodeL2
        delete this.spending.costCodeL3
        delete this.spending.costCodeNumber
        if (item.costCodeNumber) {
          this.spending.costCodeText = item.costCodeNumber + ' - ' + item.costCodeText
        } else {
          this.spending.costCodeText = item.costCodeText
        }
      }
    },
    cancel() {
      this.$emit('close')
    },
    save() {
      if (!this.spending.commitment && !this.spending.budgetCategory) {
        this.$snotify.error('Please select a Commitment or Budget Category', 'Error')
        return
      }
      if (!this.lineItem.date) {
        this.$snotify.error('Please select a Date', 'Error')
        return
      }
      if (!this.lineItem.vendor) {
        this.$snotify.error('Please select a Vendor', 'Error')
        return
      }
      if (this.lineItem.paidDateText !== '' && this.lineItem.paidDateText !== undefined) {
        const paidDate = DateTime.fromFormat(this.lineItem.paidDateText, 'MMddyyyy')
        if (!paidDate.isValid) {
          this.$snotify.error('The Paid Date is invalid', 'Error')
          return false
        } else {
          this.lineItem.paidDate = paidDate.valueOf()
        }
      } else {
        delete this.lineItem.paidDate
      }
      if (this.lineItem.dateText !== '' && this.lineItem.dateText !== undefined) {
        const date = DateTime.fromFormat(this.lineItem.dateText, 'MMddyyyy')
        if (!date.isValid) {
          this.$snotify.error('The Date is invalid', 'Error')
          return false
        } else {
          this.lineItem.date = date.toISO()
        }
      } else {
        delete this.lineItem.date
      }
      const formIsValid = this.$refs.form.validate()
      let updateCommitment = false
      if (formIsValid) {
        this.submitLoading = true
        if (this.spending.commitment === null) {
          delete this.spending.commitment
        }
        if (this.spending.commitment !== undefined) {
          this.spending.commitment = this.projectRef.collection('commitments').doc(this.spending.commitment.id)
          updateCommitment = true
        }

        /* let path = this.project.files[1].children[6].path + '/' + this.spending.id
          let folderName = this.spending.number

          let folder = this.project.files[1].children[6].children.find(dir => dir.path === path)
          if (folderName !== folder.name) {
            folder.name = folderName
            db.collection('cpm_projects').doc(this.$route.params.id).update({files: this.project.files})
          }*/

        this.projectRef.collection('spendings').doc(this.spendingId).set(this.spending)
        this.projectRef.collection('spendings').doc(this.spendingId).collection('line_items').doc(this.lineItemId).set(this.lineItem)
        if (updateCommitment) {
          this.$emit('updateCommitment', this.spending.commitment.id)
        }
        this.$snotify.success('The Spending has been updated', 'Success')
        this.$emit('close')
        this.$emit('updated')
      } else {
        this.$snotify.error('Please fill all required fields', 'Error')
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
        const duplicate = this.spendingFiles.find(c => c.name === file.name)
        if (duplicate) {
          duplicates.push(duplicate)
        }
      })

      if (duplicates.length) {
        let msg = 'The following file(s) already exist and will be overwritten: '
        duplicates.map(d => {
          msg += `${d.name}, `
        })
        msg += 'Do you want to continue?'
        const confirmation = confirm(msg)
        if (confirmation) {
          duplicates.map(d => {
            const index = this.spendingFiles.indexOf(d)
            this.spendingFiles.splice(index, 1)
          })
        } else {
          return false
        }
      }

      this.dialog = true
      const path = this.project.files[1].children[6].path + '/' + this.spending.id
      await Promise.all(Array.from(Array(fileList.length).keys()).map(x => {
        const file = fileList[x]
        return storage.ref(`projects/${this.project.id}${path}/${file.name}`).put(file)
      })).then(async uploadedFiles => {
        await Promise.all(uploadedFiles.map(snapshot => snapshot.ref.getDownloadURL().then(downloadUrl => {
          this.spendingFiles.push({
            name: snapshot.ref.name,
            file: snapshot.metadata.contentType,
            size: snapshot.metadata.size,
            url: downloadUrl,
            path: snapshot.ref.fullPath
          })
        })))
      })
      db.collection('cpm_projects').doc(this.$route.params.id).update({
        files: this.project.files
      })
      this.dialog = false
    },
    deleteFile(item) {
      const confirmation = confirm(`Are you sure you want to delete this file: ${item.name}`)
      if (confirmation) {
        if (this.active.length && item.name === this.active[0]) {
          this.imageUrl = null
        }
        const deletePath = item.path
        const fileObj = this.spendingFiles.find(c => c.path === item.path)
        const index = this.spendingFiles.indexOf(fileObj)
        this.spendingFiles.splice(index, 1)
        storage
          .ref(deletePath)
          .delete()
          .then(() => {
            db.collection('cpm_projects').doc(this.$route.params.id).update({
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

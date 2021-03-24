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
            Create Commitment Information
          </template>
          <template
            v-else
          >
            Edit Commitment Information
          </template>
        </span>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-card-text
        class="vertical-scroll"
        :style="{ height: getViewPortHeight }"
      >
        <v-container
          class="rounded-lg"
          fluid
        >
          <v-form ref="form">
            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="text-nowrap">
                      PO Number
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-text-field
                  v-model="commitment.number"
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
                    <v-col class="text-nowrap">
                      Budget Category
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <budget-category-select
                  :category="$h.dg(commitment, 'budget_category.ref')"
                  :errors="budgetCategoryErrors"
                  @newCategory="setBudgetCategory"
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
                    <v-col class="´text-nowrap">
                      Commitment Type
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-autocomplete
                  v-model="commitment.commit"
                  clearable
                  :items="settings.types"
                />
              </v-col>
            </v-row>
            <!-- Not needed by the moment-->
            <!--            <v-row-->
            <!--              align="center"-->
            <!--              justify="center"-->
            <!--            >-->
            <!--              <v-col cols="3">-->
            <!--                <div class="font-weight-black subheading">-->
            <!--                  <v-row>-->
            <!--                    <v-col class="text-nowrap">-->
            <!--                      From Changes-->
            <!--                    </v-col>-->
            <!--                  </v-row>-->
            <!--                </div>-->
            <!--              </v-col>-->
            <!--              <v-col cols="7">-->
            <!--                <v-select-->
            <!--                  v-model="commitment.change"-->
            <!--                  clearable-->
            <!--                  item-text="txt"-->
            <!--                  :items="processedChanges"-->
            <!--                  multiple-->
            <!--                  return-object-->
            <!--                >-->
            <!--                  <template-->
            <!--                    slot="selection"-->
            <!--                    slot-scope="{ item }"-->
            <!--                  >-->
            <!--                    <v-chip>-->
            <!--                      {{ item.title }} - {{ item.amount | currency }}-->
            <!--                      <template v-if="item.forecast">-->
            <!--                        - -->
            <!--                        <v-icon-->
            <!--                          color="green"-->
            <!--                          small-->
            <!--                        >-->
            <!--                          mdi-check-->
            <!--                        </v-icon>-->
            <!--                        In Forecast-->
            <!--                      </template>-->
            <!--                    </v-chip>-->
            <!--                  </template>-->
            <!--                </v-select>-->
            <!--              </v-col>-->
            <!--            </v-row>-->

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
                  v-model="commitment.amount"
                  readonly
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
                  v-model="commitment.paidToDate"
                  readonly
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
                      Accrual
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <money
                  v-model="commitment.accrual"
                  disabled
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
                      Status
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-select
                  v-model="commitment.status"
                  clearable
                  :items="settings.status"
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
                    <v-col class="text-nowrap">
                      Completion Date
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-menu
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  min-width="290px"
                  :nudge-right="40"
                  offset-y
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="commitment.completionDateText"
                      append-icon="mdi-calendar"
                      color="blue"
                      mask="date"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="commitment.completionDate"
                    @change="dateMenu = false"
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
                      Notes
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-textarea
                  v-model="commitment.notes"
                  color="blue"
                  rows="6"
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
                      Files
                    </v-col>
                    <v-col class="shrink">
                      <v-btn
                        class="mt-0"
                        color="blue"
                        dark
                        fab
                        small
                        @click.native.stop="selectFile"
                      >
                        <v-icon small>
                          mdi-plus
                        </v-icon>
                      </v-btn>
                      <input
                        v-show="false"
                        id="files"
                        ref="uploadInput"
                        :multiple="true"
                        name="file"
                        type="file"
                        @change="detectFiles($event)"
                      >
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
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
                    slot-scope="{ item }"
                  >
                    <v-icon v-if="!item.file">
                      {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
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
                    slot-scope="{ item }"
                  >
                    <template>
                      <template v-if="item.file">
                        <a
                          class="pt-2"
                          :href="item.url"
                          target="_blank"
                        >
                          <v-icon small>mdi-folder-plus</v-icon>
                        </a>
                        <v-btn
                          icon
                          small
                          @click.stop="settingFileToDelete(item)"
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
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions class="pa-6">
        <v-spacer />
        <v-btn
          color="grey darken-1"
          text
          @click="$emit('close-only')"
        >
          Cancel
        </v-btn>

        <v-btn
          v-if="isCreate"
          class="blue lighten-2"
          color="white"
          elevation="1"
          text
          @click="save('create')"
        >
          Create
        </v-btn>
        <v-btn
          v-else
          class="blue lighten-2"
          color="white"
          elevation="1"
          text
          @click="save('udpate')"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
    <m6-loading :loading="showLoading" />
    <v-dialog
      v-model="dialog"
      persistent
      width="300"
    >
      <v-card
        color="blue"
        dark
      >
        <v-card-text class="pt-3">
          Please stand by, uploading files...
          <v-progress-linear
            class="mb-0"
            color="white"
            indeterminate
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <m6-confirm-delete
      message="Are you sure you want to permanently delete this Commitment File?"
      :show="showDeleteFileModal"
      title="Delete Commitment File"
      @cancel="cancelDelete"
      @confirm="deleteFile"
    />
  </v-dialog>
</template>

<script>
import { db, storage } from '@/utils/Firebase'
import { mapState, mapActions } from 'vuex'
import { DateTime } from 'luxon'
import BudgetCategorySelect from '../_partials/BudgetCategorySelect'

export default {
  name: 'FinancialCommitmentsModal',
  components: {
    BudgetCategorySelect
  },
  filters: {
    formatCreateDate: function (value) {
      return new Date(value * 1000)
    }
  },
  props: {
    show: { default: false, type: Boolean },
    isCreate: { default: false, type: Boolean },
    commitmentId: { default: '', type: String },
    projectId: { type: [String, Number], required: true }
  },
  data() {
    const projectRef = db.collection('cpm_projects').doc(this.projectId)
    return {
      commitmentToAdd: null,
      formWasValidated: false,
      budgetCategoryRules: [v => !!v || 'Budget Category is required'],
      dateMenu: false,
      showDeleteFileModal: false,
      showLoading: false,
      viewPortHeight:
        Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        ) * 0.6,
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
      projectRef,
      submitLoading: false,
      itemFilesAssigned: false,
      settings: {},
      budgetSettings: {},
      commitment: {
        budget_category: {
          ref: ''
        },
        completionDateText: ''
      },
      lineItem: {},
      changes: [],
      rules: {
        required: value => !!value || 'Required.'
      },
      showCostCodes: false,
      rootStorageFolder: 'images/projects/commitments/'
    }
  },
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    processedChanges() {
      return this.changes.map(c => ({
        ...c,
        txt: `${c.title} - ${this.$options.filters.currency(c.amount)}`
      }))
    },
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
    },
    getViewPortHeight() {
      return `${this.viewPortHeight}px`
    },
    budgetCategoryErrors() {
      if (this.formWasValidated && !this.$h.dg(this.commitment, 'budget_category.ref')) {
        return 'Budget Category is required'
      } else return []
    }
  },
  firestore() {
    const aux = {
      project: this.projectRef,
      changes: this.projectRef.collection('changes'),
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

    if (this.commitmentId) {
      aux.commitment = this.projectRef
        .collection('commitments')
        .doc(this.commitmentId + '')
    }

    return aux
  },
  watch: {
    'commitment.costCodeText': function (newVal) {
      if (newVal && typeof newVal === 'object') {
        this.budgetCategorySearchSelect(newVal)
      }
    },
    'commitment.completionDate': function (newVal) {
      if (newVal) {
        const [year, month, day] = newVal.split('-')

        const formatedDate = `${month}/${day}/${year}`
        this.commitment.completionDateText = formatedDate
      }
    },
    budgetSettings() {
      this.costCodesAllArray = []
      this.budgetSettings.costCodes.forEach(cl1 => {
        const itemName = cl1.code ? `${cl1.code} - ${cl1.name}` : cl1.name
        this.costCodesAllArray.push({
          item: cl1,
          name: itemName,
          level: 1
        })
        if (this.$h.dg(cl1, 'cat_1') && cl1.cat_1.length) {
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
    project(newVal) {
      if (this.isCreate) {
        const commitmentNumber = newVal.nextCommitmentNumber
        let idString = '00000' + commitmentNumber
        idString = idString.substr(idString.length - 5)
        const year = new Date().getFullYear()
        this.commitment.number = `COM-${idString}-${year}`
        this.commitment.amount = 0
        this.commitment.invoiceTotal = 0
        this.commitment.title = ''
      }
    }
  },
  beforeUpdate() {
    if (!this.itemFilesAssigned && !this.isCreate && this.project.files) {
      const path = this.project.files[1].children[9].path + '/' + this.commitmentId
      const find = this.project.files[1].children[9].children.find(e => e.path === path)
      if (find) {
        if (find.files) {
          this.commitmentFiles = find.files
        } else {
          this.$set(find, 'files', this.commitmentFiles)
        }
        this.itemFilesAssigned = true
      }
    }
  },
  methods: {
    ...mapActions('cpm/projects/commitments', {
      createCommitment: 'create',
      updateCommitment: 'update'
    }),
    settingFileToDelete(item) {
      this.whichFileToDelete = item
      this.showDeleteFileModal = true
    },
    cancelDelete() {
      this.showDeleteFileModal = false
      this.whichFileToDelete = {}
    },
    selectFile() {
      this.$refs.uploadInput.click()
    },
    async detectFiles(e) {
      const fileList = e.target.files || e.dataTransfer.files
      const duplicates = []
      Array.from(Array(fileList.length).keys()).map(x => {
        const file = fileList[x]
        const duplicate = this.commitmentFiles.find(c => c.name === file.name)
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
          uploadedFiles.map(snapshot => snapshot.ref.getDownloadURL().then(downloadUrl => {
            this.commitmentFiles.push({
              name: snapshot.ref.name,
              file: snapshot.metadata.contentType,
              size: snapshot.metadata.size,
              url: downloadUrl,
              path: snapshot.ref.fullPath
            })
          }))
        )
      })
      db.collection('cpm_projects')
        .doc(this.projectId)
        .update({
          files: this.project.files
        })
      this.dialog = false
    },
    deleteFile() {
      const item = this.whichFileToDelete
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
            .doc(this.projectId)
            .update({
              files: this.project.files
            })
          this.whichFileToDelete = {}
          this.showDeleteFileModal = false
          this.$snotify.success('The file was deleted', 'Success')
        })
        .catch(error => {
          console.error(`file delete error occured: ${error}`)
        })
    },
    filteringCodes(item, queryText) {
      return item.name.toLowerCase().includes(queryText)
    },
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
    startSearchBudgetCategory() {
      this.showBudgetCategorySearch = true
      this.showCostCodes = false
    },
    budgetCategoriesDropDown() {
      this.showCostCodes = !this.showCostCodes
    },
    budgetCategorySearchSelect(catItem) {
      this.commitment.costCodeText = catItem.name
      if (catItem.level === 1) {
        this.setCostCodeL1(catItem.item)
      } else if (catItem.level === 2) {
        this.setCostCodeL2(catItem.item, catItem.itemL2)
      } else if (catItem.level === 3) {
        this.setCostCodeL3(catItem.item, catItem.itemL2, catItem.itemL3)
      } else {
        this.setCostCodeL1(catItem.item)
      }
    },
    setCostCodeL1(item) {
      this.commitment.budgetCategory = item.name
      this.commitment.costCode = item.name
      this.commitment.costCodeNumber = item.code
    },
    setCostCodeL2(item, itemL2) {
      this.commitment.budgetCategory = item.name
      this.commitment.costCode = item.name
      this.commitment.costCodeL2 = itemL2.name
      this.commitment.costCodeNumber = itemL2.code
    },
    setCostCodeL3(item, itemL2, itemL3) {
      this.commitment.budgetCategory = item.name
      this.commitment.costCode = item.name
      this.commitment.costCodeL2 = itemL2.name
      this.commitment.costCodeL3 = itemL3.name
      this.commitment.costCodeNumber = itemL3.code
    },
    onChangeSelected() {
      this.lineItem.amount = 0
      this.lineItem.change.forEach(change => {
        this.lineItem.amount += parseFloat(change.amount)
      })
    },

    validateForm() {
      this.formWasValidated = true
      if (!this.$h.dg(this.commitment, 'budget_category.ref')) {
        this.$snotify.warning('Budget Category is Required')
        return false
      }

      if (!this.$refs.form.validate()) {
        this.$snotify.error('Please fill in all required fields', 'Error')
        return false
      }

      return true
    },

    save(action) {
      const formIsValid = this.validateForm()
      if (!formIsValid) {
        return
      }

      if (this.$h.dg(this.commitment, 'budget_category.ref.id')) {
        this.commitment.budget_category.ref = this.getBudgetCategoryRef(this.commitment.budget_category.ref.id)
      } else {
        delete this.commitment.budget_category
      }

      if (action === 'create') {
        this.create()
      } else if (action === 'udpate') {
        this.update()
      }
    },

    create() {
      // split create and update functions? also need to do what is usually done during creates here
      const commitmentNumber = this.$h.dg(this.project, 'nextCommitmentNumber', 1)
      let idString = '00000' + commitmentNumber
      idString = idString.substr(idString.length - 5)
      const year = new Date().getFullYear()
      this.projectRef.update({
        nextCommitmentNumber: parseInt(commitmentNumber) + 1
      })
      this.commitment.createdAt = new Date()
      this.commitment.startDate = new Date().toISOString()
      this.showLoading = true
      const commitment = this.removeNullAndUndefined(this.commitment)

      commitment.amount = 0
      commitment.spendingAmount = 0
      commitment.openAmount = 0

      this.createCommitment({
        projectId: this.projectId,
        commitment
      })
        .then(async doc => {
          const commitmentDoc = await doc.get()

          this.commitmentToAdd = {
            id: commitmentDoc.id,
            ...commitmentDoc.data()
          }
          if (!this.project.files) {
            this.project.files = []
          }

          if (!this.project.files[1]) {
            this.project.files[1] = { children: [] }
          }

          if (!this.project.files[1].children[9]) {
            this.project.files[1].children[9] = { children: [], path: '' }
          }

          this.project.files[1].children[9].children.push({
            name: `COM-${idString}-${year}`,
            path: this.project.files[1].children[9].path + '/' + doc.id,
            children: [],
            files: this.commitmentFiles
          })

          this.projectRef
            .update({ files: this.project.files })
          this.$snotify.success('The Commitment has been created!', 'Success')
        })
        .catch(error => {
          console.error(error)
          this.$snotify.error(
            'There was an error while creating the Commitment',
            'Error'
          )
        })
        .finally(() => {
          this.showLoading = false
          this.$emit('close', this.commitmentToAdd)
        })
    },

    update() {
      const formIsValid = this.$refs.form.validate()
      if (formIsValid) {
        this.submitLoading = true
        this.showLoading = true

        const commitment = this.removeNullAndUndefined(this.commitment)
        commitment.id = this.commitmentId

        this.updateCommitment({
          projectId: this.projectId,
          commitment
        })
          .then(() => {
            this.$snotify.success('The Commitment has been updated', 'Success')
          })
          .catch(error => {
            console.error(error)
            this.$snotify.error(
              'There was an error while updating the Commitment',
              'Error'
            )
          })
          .finally(() => {
            this.showLoading = false
            this.$emit('close')
          })
      } else {
        this.$snotify.error('please fill all required fields', 'error')
      }
    },
    removeNullAndUndefined(commitment) {
      const res = {}

      Object.keys(commitment).forEach(key => {
        if (commitment[key]) {
          res[key] = commitment[key]
        }
      })

      return res
    },
    setCodes(category) {
      if (!category) return
      this.commitment.costCodeNumber = category.code || 0
    },
    setBudgetCategory(category) {
      this.commitment.budget_category.ref = category
      this.setCodes(category)
    },
    getBudgetCategoryRef(budgetCategoryId) {
      if (!budgetCategoryId) return

      return db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('budgets')
        .collection('budget_categories')
        .doc(budgetCategoryId)
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
</style>

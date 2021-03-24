<template>
  <v-dialog
    v-model="dialog"
    max-width="1200px"
    persistent
  >
    <v-card
      class="licensing-edit-modal"
    >
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">
          {{ $t('cpm.projects.budgetPanel.editBudget.budget') }}:
          {{ $h.dg(budget, 'title', '') }}
        </span>
        <v-btn
          absolute
          color="blue darken-2"
          dark
          fab
          right
          small
          @click="createNewBudget"
        >
          <v-icon light>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-card-text
        class="vertical-scroll"
        :style="viewportHeight"
      >
        <v-row class="d-flex">
          <v-col
            cols="3"
          >
            <v-row class="budget-title">
              <v-col cols="6">
                <h4>
                  {{ $t('cpm.projects.budgetPanel.editBudget.budgetSummary') }}
                </h4>
              </v-col>

              <v-col
                class="align-end text-right"
                cols="6"
              >
                <v-icon
                  class="justify-end pt-2"
                  size="20"
                  @click.stop="editMode=!editMode"
                >
                  {{ editMode ? 'mdi-undo' : 'mdi-pencil' }}
                </v-icon>
              </v-col>
            </v-row>

            <v-row v-if="editMode">
              <v-col cols="6" />

              <v-col
                class="align-end text-right"
                cols="6"
              >
                <v-switch
                  v-model="budget.active"
                  class="justify-end pt-2"
                  label="Active"
                />
              </v-col>
            </v-row>
            <v-form ref="form">
              <div
                v-if="!editMode"
                class="form-group mb-4"
              >
                <label>{{ $t('cpm.projects.budgetPanel.editBudget.totalBudget') }}</label><br>
                <span>{{ $h.dg(budget, 'total', '0.00') | currency }}</span>
              </div>
              <div
                v-if="project.status === 'Forecasted'"
                class="form-group mb-4"
              >
                <label>{{ $t('cpm.projects.budgetPanel.editBudget.planBudget') }}</label><br>
                <span v-if="!editMode">{{ $h.dg(budget, 'plan', $t('cpm.projects.budgetPanel.editBudget.noDefined')) }}</span>
                <money
                  v-if="editMode"
                  v-model="budget.plan"
                  v-bind="money"
                />
              </div>

              <div class="form-group mb-4">
                <label>{{ $t('cpm.projects.budgetPanel.editBudget.budgetStatus') }}</label><br>
                <span v-if="!editMode">{{ $h.dg(budget, 'status', $t('cpm.projects.budgetPanel.editBudget.noDefined')) }}</span>
                <v-select
                  v-if="editMode"
                  v-model="budget.status"
                  clearable
                  :items="settings.status"
                />
              </div>

              <div
                class="form-group mb-4"
              >
                <label>{{ $t('cpm.projects.budgetPanel.editBudget.type') }}</label><br>
                <span v-if="!editMode">{{ $h.dg(budget, 'type', $t('cpm.projects.budgetPanel.editBudget.noDefined')) }}</span>
                <v-select
                  v-if="editMode"
                  v-model="budget.type"
                  clearable
                  :items="settings.types"
                />
              </div>

              <div class="form-group mb-4">
                <label>{{ $t('cpm.projects.budgetPanel.editBudget.budgetApprover') }}</label><br>
                <span v-if="!editMode">{{ $h.dg(budget, 'approver.label', $t('cpm.projects.budgetPanel.editBudget.noDefined')) }}</span>
                <v-select
                  v-if="editMode"
                  v-model="budget.approver"
                  clearable
                  color="blue"
                  item-text="label"
                  :items="users.budgetApprover"
                  return-object
                >
                  <template v-slot:item="{ item }">
                    {{ item.label }}
                  </template>
                </v-select>
              </div>

              <div class="form-group mb-4">
                <label>{{ $t('cpm.projects.budgetPanel.editBudget.forecastedFiscalYear') }}</label><br>
                <span v-if="!editMode">{{ $h.dg(budget, 'fyType.name', $t('cpm.projects.budgetPanel.editBudget.noDefined')) }}</span>
                <v-select
                  v-if="editMode"
                  v-model="budget.fyType"
                  clearable
                  color="blue"
                  item-text="name"
                  :items="fyTypes"
                  return-object
                >
                  <template v-slot:item="{ item }">
                    {{ item.name }}
                  </template>
                </v-select>
              </div>

              <div class="form-group mb-4">
                <label>{{ $t('cpm.projects.budgetPanel.editBudget.budgetName') }}</label><br>
                <span v-if="!editMode">{{ $h.dg(budget, 'title', $t('cpm.projects.budgetPanel.editBudget.noDefined')) }}</span>
                <v-text-field
                  v-if="editMode"
                  v-model="budget.title"
                  color="blue"
                />
              </div>

              <div class="form-group mb-4">
                <label>{{ $t('cpm.projects.budgetPanel.editBudget.notes') }}</label><br>
                <span v-if="!editMode">{{ $h.dg(budget, 'notes', $t('cpm.projects.budgetPanel.editBudget.noDefined')) }}</span>
                <v-textarea
                  v-if="editMode"
                  v-model="budget.notes"
                  color="blue"
                />
              </div>
            </v-form>
          </v-col>

          <v-col
            cols="9"
          >
            <div class="form-group margin-top-25">
              <line-items
                ref="lineItemsRef"
                :budget="budget"
                :type="type"
                @showDeleteLineItemModal="showDeleteLineItemModal = $event"
                @updateBudgetInformation="updateBudgetInformation"
                @updateLineItems="lineItems = $event"
              />
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
                v-model="loadingDialog"
                persistent
                width="300"
              >
                <v-card
                  color="blue"
                  dark
                >
                  <v-card-text class="pt-2">
                    {{ $t('general.uploadingFilesMessage') }}
                    <v-progress-linear
                      class="mb-0"
                      color="white"
                      indeterminate
                    />
                  </v-card-text>
                </v-card>
              </v-dialog>
              <v-divider /><br><br><br>
              <v-card class="mb-4 rounded-lg">
                <v-card-title class="headline px-6 py-4 white">
                  <span class="grey--text text--darken-1">
                    {{ $t('cpm.projects.budgetPanel.editBudget.attachments') }}
                  </span>
                  <v-spacer />
                  <v-btn
                    color="blue darken-2"
                    dark
                    fab
                    small
                    @click="selectFile"
                  >
                    <v-icon light>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </v-card-title>
                <v-divider class="grey lighten-3" />

                <v-card-text class="vertical-scroll">
                  <v-treeview
                    v-model="tree"
                    activatable
                    :active.sync="active"
                    hoverable
                    item-key="path"
                    :items="budgetFiles"
                    :open="open"
                    open-on-click
                  >
                    <template
                      slot="prepend"
                      slot-scope="{ item, open }"
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
                      slot-scope="{ item, open, leaf }"
                    >
                      <template>
                        <template v-if="item.file">
                          <a
                            class="ml-2 mr-0 pointer"
                            :href="item.url"
                            target="_blank"
                          >
                            <v-icon small>mdi-folder-plus</v-icon>
                          </a>
                          <v-icon
                            class="ml-2 mr-0 pointer"
                            color="#f44336"
                            size="20"
                            @click.stop="deleteFile(item, open, leaf)"
                          >
                            mdi-delete
                          </v-icon>
                        </template>
                      </template>
                    </template>
                  </v-treeview>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn
          text
          @click.native.stop="selectFile"
        >
          {{ $t('cpm.projects.budgetPanel.editBudget.attachments') }}
          <v-icon
            class="ml-2 mr-0 pointer"
            color="#757575"
            size="20"
          >
            mdi-plus
          </v-icon>
        </v-btn>
        <v-spacer />
        <v-btn
          text
          @click.stop="dialog = false"
        >
          {{ $t('general.close') }}
        </v-btn>

        <v-btn
          v-if="editMode"
          color="success"
          @click="saveBudget"
        >
          {{ $t('general.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <!--DELETE MODAL-->
    <m6-confirm-delete
      :message="$t('general.sureDeleteResource', { resource: $t('cpm.projects.budgetPanel.editBudget.budget') })"
      :show="showDeleteLineItemModal"
      :title="$t('cpm.projects.budgetPanel.editBudget.titleDelete')"
      @cancel="cancelDelete"
      @confirm="deleteConfirmed"
    />
    <!--DELETE MODAL-->
  </v-dialog>
</template>

<script>
import { db, storage } from '@/utils/Firebase'
import { mapState, mapActions } from 'vuex'
import LineItemsModal from './LineItems'

export default {
  name: 'EditBudget',
  components: {
    'line-items': LineItemsModal
  },
  props: {
    budget: {
      type: Object,
      default: null
    },
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'project'
    }
  },

  data() {
    return {
      projectRef: db.collection('cpm_projects').doc(this.$route.params.id),
      budgetFiles: [],
      tree: [],
      fyTypes: [],
      project: {},
      settings: {},
      budgetLineItems: [],
      showDeleteLineItemModal: false,
      users: {
        budgetApprover: []
      },
      headers: [
        {
          text: this.$t('cpm.projects.budgetPanel.editBudget.budgetCategory'),
          value: 'budget_name'
        },
        {
          text: this.$t('cpm.projects.budgetPanel.editBudget.type'),
          value: 'type'
        },
        {
          text: this.$t('cpm.projects.budgetPanel.editBudget.amount'),
          value: 'amount'
        },
        { text: this.$t('general.actions'), value: 'actions' }
      ],
      lineItems: [],
      costCodesSortArray: [],
      costCodesAllArray: [],
      budgetCategoriesSelect: [],
      showNewItem: false,
      showEditItem: false,
      editMode: false,
      active: [],
      open: [],
      loadingDialog: false
    }
  },

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    viewportHeight() {
      let height =
        Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        ) * 0.6
      height = height - 5
      return { 'height': `${height}px !important` }
    },
    dialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    settingCollectionName() {
      if (this.type === 'forecasted') {
        return 'planned_settings'
      } else {
        return 'settings'
      }
    }
  },
  watch: {
    settings() {
      this.costCodesSortArray = []
      this.costCodesAllArray = []
      if (this.$h.dg(this.settings, 'costCodes')) {
        this.settings.costCodes.forEach(cl1 => {
          this.costCodesSortArray.push(cl1.name)
          const itemName = cl1.code ? `${cl1.code} - ${cl1.name}` : cl1.name
          this.costCodesAllArray.push({
            item: cl1,
            name: itemName,
            level: 1
          })
          this.budgetCategoriesSelect.push(cl1.name)
          if (this.$h.dg(cl1, 'cat_1')) {
            cl1.cat_1.forEach(cl2 => {
              this.costCodesSortArray.push(cl1.name + ' - ' + cl2.name)
              let itemL2Name = itemName + ' | '
              itemL2Name += cl2.code ? `${cl2.code} - ${cl2.name}` : cl2.name
              this.costCodesAllArray.push({
                item: cl1,
                itemL2: cl2,
                name: itemL2Name,
                level: 2
              })
              if (this.$h.dg(cl2, 'cat_2')) {
                cl2.cat_2.forEach(cl3 => {
                  this.costCodesSortArray.push(
                    cl1.name + ' - ' + cl2.name + ' - ' + cl3.name
                  )
                  let itemL3Name = itemL2Name + ' | '
                  itemL3Name += cl3.code
                    ? `${cl3.code} - ${cl3.name}`
                    : cl3.name
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
      }
    },

    active() {
      if (!this.active.length) return undefined
      const item = this.budgetFiles.find(c => c.path === this.active[0])
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
      const path = this.project.files[1].children[3].path + '/' + this.budgetId
      const folder = this.project.files[1].children[3].children.find(
        dir => dir.path === path
      )
      if (undefined === folder) {
        this.project.files[1].children[3].children.push({
          name: this.budget.title || this.$t('cpm.projects.budgetPanel.newBudget'),
          path: this.project.files[1].children[3].path + '/' + this.budgetId,
          children: []
        })
        db.collection('cpm_projects')
          .doc(this.$route.params.id)
          .update({ files: this.project.files })
      } else {
        this.budgetFiles = folder.children
      }
    }
  },
  async mounted() {
    await this.getFiscalYears()

    db.collection('cpm_projects')
      .doc(this.$route.params.id)
      .collection('budgets')
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          const temp = []
          snapshot.forEach(doc => {
            const data = doc.data()
            let found = null
            if (this.fyTypes) {
              found = this.fyTypes.find(i => i.fyType === data['fyType'])
            }
            if (found) {
              temp.unshift(data['fyType'])
            }
          })
        }
      })
  },
  methods: {
    ...mapActions('cpm/planned/forecasts', [
      'setForecastTasksData'
    ]),
    cancelDelete() {
      this.$refs.lineItemsRef.cancelDelete()
    },

    deleteConfirmed() {
      this.$refs.lineItemsRef.deleteConfirmed()
    },
    createNewBudget() {
      this.dialog = false
      this.$emit('createNewBudget')
    },
    updateBudgetInformation() {
      return new Promise(async (resolve, reject) => {
        try {
          await this.axios.post(
            `${process.env.VUE_APP_FIREBASE_APIURL}/api/projects/${this.$route.params.id}/update-budgets`
          )
          await this.lineItemEdited()
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    showEditMode() {
      this.editMode = true
    },
    saveBudget() {
      // Setting budgets to false
      this.projectRef
        .collection('budgets')
        .get()
        .then(snap => {
          snap.forEach(doc => {
            doc.ref.update({ active: false })
          })
        })
        .then(() => {
          const path =
            this.project.files[1].children[3].path + '/' + this.budget.id
          const folderName = this.budget.title

          const folder = this.project.files[1].children[3].children.find(
            dir => dir.path === path
          )

          if (folder) {
            if (folderName !== folder.name) {
              folder.name = folderName
              db.collection('cpm_projects')
                .doc(this.$route.params.id)
                .update({ files: this.project.files })
            }
          }

          this.projectRef
            .collection('budgets')
            .doc(this.budget.id)
            .set(this.budget)
            .then(() => {
              if (this.type === 'forecasted') {
                this.setForecastTasksData({
                  projectId: this.$route.params.id
                })
              }

              this.$snotify.success(this.$t('cpm.projects.budgetPanel.editBudget.success'), this.$t('alerts.success'))
              this.dialog = false
            })
        }).finally(() => {
          this.lineItemEdited()
        })
    },

    getFiscalYears() {
      const aux = new Promise((resolve, reject) => {
        try {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection(`${this.settingCollectionName}`)
            .doc('projects')
            .get()
            .then(snap => {
              if (snap.exists) {
                const settings = snap.data()
                this.fyTypes = settings.fiscalYears
              }

              resolve(true)
            })
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },

    deleteLineItem(item) {
      const confirmation = confirm(
        this.$t('general.sureDeleteResource', { resource: item.costCodeText })
      )

      if (confirmation) {
        this.projectRef
          .collection('budgets')
          .doc(this.budget.id)
          .collection('lineItems')
          .doc(item.id)
          .delete()
          .then(() => {
            this.calculateBudgetTotal()
          })
        this.$snotify.success(this.$t('cpm.projects.budgetPanel.editBudget.lineItemDeleted'), this.$t('alerts.success'))
      }
    },

    cancelLineItem() {
      this.showNewItem = false
    },

    cancelEditLineItem() {
      this.showEditItem = false
    },

    editLineItem(lineItem) {
      this.lineItemToEdit = lineItem
      this.showEditItem = true
    },

    lineItemCreated() {
      this.calculateBudgetTotal()
    },

    lineItemEdited() {
      this.calculateBudgetTotal()
    },

    calculateBudgetTotal() {
      let budgetSubTotal = parseFloat(0.0)
      this.lineItems.forEach(item => {
        if (item.type === 'Amount' && !item.belowSubtotal) {
          budgetSubTotal += parseFloat(item.amount)
        }
      })

      let budgetTotal = parseFloat(budgetSubTotal)
      this.lineItems.forEach(item => {
        if (item.type === 'Percentage') {
          if (
            item.percentageType === undefined ||
            item.percentageType === 'Subtotal'
          ) {
            budgetTotal += parseFloat(
              Math.floor(budgetSubTotal * (item.amount / 100))
            )
          } else if (item.percentageType === 'Category') {
            budgetTotal += this.calculateBudgetPercentage(
              item.percentageBudgetCategories,
              item.amount
            )
          }
        } else if (item.belowSubtotal) {
          budgetTotal += parseFloat(item.amount)
        }
      })
      db.collection('cpm_projects')
        .doc(this.$route.params.id)
        .collection('budgets')
        .doc(this.budget.id)
        .update({
          subTotal: budgetSubTotal.toFixed(2),
          total: budgetTotal.toFixed(2)
        })
        .then(() => {
          this.sortLineItems()
          this.budget.subTotal = budgetSubTotal.toFixed(2)
          this.budget.total = budgetTotal.toFixed(2)
        })
    },

    calculateBudgetPercentage(categories, amount) {
      let resultAmount = 0
      this.lineItems.forEach(li => {
        if (
          categories.includes(li.budgetCategory) &&
          li.type === 'Amount' &&
          !li.belowSubtotal
        ) {
          resultAmount += li.amount
        }
      })
      return parseFloat(Math.floor(resultAmount * (amount / 100)))
    },

    sortLineItems() {
      this.budgetLineItems = []
      const tempLineItems = []
      this.lineItems.forEach(li => {
        this.costCodesSortArray.find((s, i) => {
          if (s === li.costCodeText) {
            li.sortIndex = i
          }
        })
        tempLineItems.push(li)
      })
      tempLineItems.sort((a, b) => a.sortIndex - b.sortIndex)
      this.budgetLineItems = tempLineItems
    },

    async detectFiles(e) {
      const fileList = e.target.files || e.dataTransfer.files
      const duplicates = []
      Array.from(Array(fileList.length).keys()).map(x => {
        const file = fileList[x]
        const duplicate = this.budgetFiles.find(c => c.name === file.name)
        if (duplicate) {
          duplicates.push(duplicate)
        }
      })

      if (duplicates.length) {
        let msg = this.$t('general.fileOverwritten')
        duplicates.map(d => {
          msg += `${d.name}, `
        })
        msg += this.$t('general.youWantContinue')
        const confirmation = confirm(msg)
        if (confirmation) {
          duplicates.map(d => {
            const index = this.budgetFiles.indexOf(d)
            this.budgetFiles.splice(index, 1)
          })
        } else {
          return false
        }
      }

      this.loadingDialog = true
      const path = this.project.files[1].children[3].path + '/' + this.budget.id
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
            this.budgetFiles.push({
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
        .doc(this.$route.params.id)
        .update({
          files: this.project.files
        })
      this.loadingDialog = false
    },

    selectFile() {
      this.$refs.uploadInput.click()
    },

    deleteFile(item) {
      const confirmation = confirm(
        this.$t('general.fileToDelete', { file: item.name })
      )
      if (confirmation) {
        if (this.active.length && item.name === this.active[0]) {
          this.imageUrl = null
        }
        const deletePath = item.path
        const fileObj = this.budgetFiles.find(c => c.path === item.path)
        const index = this.budgetFiles.indexOf(fileObj)
        this.budgetFiles.splice(index, 1)
        storage
          .ref(deletePath)
          .delete()
          .then(() => {
            db.collection('cpm_projects')
              .doc(this.$route.params.id)
              .update({
                files: this.project.files
              })
            this.$snotify.success(this.$t('general.fileDelete'), this.$t('alerts.success'))
          })
          .catch(() => {})
      }
    }
  },
  firestore() {
    return {
      project: db.collection('cpm_projects').doc(this.$route.params.id),
      users: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('users'),
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('budgets')
    }
  }
}
</script>

<style lang="scss" scoped>
.input-margin-right {
  margin-right: 	0.9375rem;

  &:last-child {
    margin-right: 0;
  }
}

.edit-cost-form {
  margin-top: 	1.5625rem;
}

.budget-title {
  align-items: center;
}

.padding-top-10 {
  padding-top: 	0.625rem;
}

.text-right {
  text-align: right;
}

.totals-container {
  margin-top: 0.3125rem;
  text-align: right;
}
</style>

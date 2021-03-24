<template>
  <ValidationObserver
    ref="obs"
    v-slot="{ invalid }"
  >
    <v-dialog
      v-model="show"
      max-width="75rem"
      persistent
      scrollable
    >
      <v-card class="contact-edit-modal rounded-lg">
        <v-card-title class="card-title display-1">
          <v-row>
            <v-col cols="12">
              <v-icon
                class="icon-close"
                large
                light
                @click="cancel"
              >
                mdi-close
              </v-icon>
            </v-col>
          </v-row>
          <v-row
            v-if="isCreate"
            align="center"
          >
            <v-col
              class="text-center"
              cols="12"
            >
              {{ $t('cpm.projects.createChangeOrder') }}
            </v-col>
          </v-row>

          <v-row
            v-else
            align="center"
          >
            <v-col
              class="text-center"
              cols="12"
            >
              {{ $t('cpm.projects.editChangeOrder') }}
            </v-col>
          </v-row>
        </v-card-title>

        <v-tabs
          v-model="tab"
          centered
          color="#0277BD"
          dark
          slider-color="blue darken-4"
        >
          <v-tab :class="errors.changeInformationTab ? 'red' : ''">
            {{ $t('cpm.projects.changeOrdersInfo') }}
          </v-tab>
        </v-tabs>

        <v-card-text class="card-text vertical-scroll">
          <v-container
            class="rounded-lg"
            fluid
            grid-list-lg
          >
            <v-form ref="form">
              <div v-show="tab === 0">
                <v-row
                  align="center"
                >
                  <v-col cols="12">
                    <div class="elevation-2 white">
                      <v-text-field
                        v-model="change.number"
                        color="primary"
                        hide-details
                        :label="$t('cpm.projects.changeOrderNumber')"
                        outline
                        readonly
                      />
                    </div>
                  </v-col>

                  <v-col
                    class="pr-3"
                    cols="6"
                  >
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Project Number:"
                      rules="required"
                    >
                      <div class="elevation-2 white">
                        <v-text-field
                          v-model="project.number"
                          color="primary"
                          disabled
                          :error-messages="errors"
                          hide-details
                          :label="$t('general.projectNumber')"
                          outline
                          readonly
                          @update:error="errorTitle"
                        />
                      </div>
                    </ValidationProvider>
                  </v-col>

                  <v-col
                    class="pr-3"
                    cols="6"
                  >
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Prject Name:"
                      rules="required"
                    >
                      <div class="elevation-2 white">
                        <v-text-field
                          v-model="project.title"
                          color="primary"
                          disabled
                          :error-messages="errors"
                          hide-details
                          :label="$t('general.projectName')"
                          outline
                          readonly
                          @update:error="errorTitle"
                        />
                      </div>
                    </ValidationProvider>
                  </v-col>

                  <v-col
                    class="pr-3"
                    cols="6"
                  >
                    <v-menu
                      v-model="dateMenu"
                      :close-on-content-click="false"
                      full-width
                      lazy
                      min-width="18.125rem"
                      :nudge-right="40"
                      offset-y
                      transition="scale-transition"
                    >
                      <template v-slot:activator="{ on }">
                        <div class="elevation-2 white">
                          <v-text-field
                            v-model="change.dateText"
                            append-icon="calendar_today"
                            color="blue"
                            hide-details
                            :label="$t('general.date')"
                            mask="date"
                            outline
                            v-on="on"
                          />
                        </div>
                      </template>

                      <v-date-picker
                        v-model="date"
                        @change="setDate"
                      />
                    </v-menu>
                  </v-col>

                  <v-col
                    class="pr-3"
                    cols="6"
                  >
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Firm:"
                      rules="required"
                    >
                      <div class="elevation-2 white">
                        <v-text-field
                          v-model="change.firm"
                          color="primary"
                          :error-messages="errors"
                          hide-details
                          label="Firm"
                          outline
                          @update:error="errorTitle"
                        />
                      </div>
                    </ValidationProvider>
                  </v-col>

                  <v-col
                    class="pr-3"
                    cols="6"
                  >
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Bulletin:"
                      rules="required"
                    >
                      <div class="elevation-2 white">
                        <v-text-field
                          v-model="change.bulletin"
                          color="primary"
                          :error-messages="errors"
                          hide-details
                          label="Bulletin"
                          outline
                          @update:error="errorTitle"
                        />
                      </div>
                    </ValidationProvider>
                  </v-col>

                  <v-col
                    class="pr-3"
                    cols="6"
                  >
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Prepared by:"
                      rules="required"
                    >
                      <div class="elevation-2 white">
                        <v-text-field
                          v-model="change.preparedBy"
                          color="primary"
                          :error-messages="errors"
                          hide-details
                          label="Prepared by"
                          outline
                          @update:error="errorTitle"
                        />
                      </div>
                    </ValidationProvider>
                  </v-col>

                  <v-col
                    class="pr-3"
                    cols="6"
                  >
                    <v-menu
                      v-model="preparedDateMenu"
                      :close-on-content-click="false"
                      full-width
                      lazy
                      min-width="18.125rem"
                      :nudge-right="40"
                      offset-y
                      transition="scale-transition"
                    >
                      <template v-slot:activator="{ on }">
                        <div class="elevation-2 white">
                          <v-text-field
                            v-model="change.preparedDateText"
                            append-icon="calendar_today"
                            color="blue"
                            hide-details
                            label="Prepared date"
                            mask="date"
                            outline
                            v-on="on"
                          />
                        </div>
                      </template>

                      <v-date-picker
                        v-model="preparedDate"
                        @change="setPreparedDate"
                      />
                    </v-menu>
                  </v-col>

                  <v-col
                    class="pr-3"
                    cols="6"
                  >
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Approved by:"
                      rules="required"
                    >
                      <div class="elevation-2 white">
                        <v-text-field
                          v-model="change.approvedBy"
                          color="primary"
                          :error-messages="errors"
                          hide-details
                          label="Approved by"
                          outline
                          @update:error="errorTitle"
                        />
                      </div>
                    </ValidationProvider>
                  </v-col>

                  <v-col
                    class="pr-3"
                    cols="6"
                  >
                    <v-menu
                      v-model="approvedDateMenu"
                      :close-on-content-click="false"
                      full-width
                      lazy
                      min-width="18.125rem"
                      :nudge-right="40"
                      offset-y
                      transition="scale-transition"
                    >
                      <template v-slot:activator="{ on }">
                        <div class="elevation-2 white">
                          <v-text-field
                            v-model="change.approvedDateText"
                            append-icon="calendar_today"
                            color="blue"
                            hide-details
                            label="Approved date"
                            mask="date"
                            outline
                            v-on="on"
                          />
                        </div>
                      </template>

                      <v-date-picker
                        v-model="approvedDate"
                        @change="setApprovedDate"
                      />
                    </v-menu>
                  </v-col>
                </v-row>
              </div>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn
            block
            class="elevation-2"
            color="primary"
            :disabled="invalid"
            text
            @click="save"
          >
            <span v-if="isCreate">{{ $t('general.create') }}</span>

            <span v-else>{{ $t('general.update') }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>

      <m6-loading :loading="showLoading" />
      <!--<msg :show="showMsg" :title="msgTitle" :text="msgText" :color=" 'blue' " @close="showMsg = false"  ></msg>-->
    </v-dialog>
  </ValidationObserver>
</template>

<script>
import { db } from '@/utils/Firebase'
import { mapState, mapActions, mapGetters } from 'vuex'
import { DateTime } from 'luxon'

export default {
  name: 'ChangeOrdersCreateModal',
  props: {
    show: {
      default: false,
      type: Boolean
    },
    changeId: {
      default: '',
      type: [Number, String]
    },
    isCreate: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      approvedDateMenu: false,
      preparedDateMenu: false,
      authorizers: [],
      approvalTypes: [],
      projectId: '',
      tab: 0,
      showLoading: false,
      costCodesAllArray: [],
      showBudgetCategorySearch: false,
      categorySelected: true,
      changeFiles: [],
      tree: [],
      active: [],
      open: [],
      imageUrl: null,
      pdfUrl: null,
      dialog: false,
      project: {},
      projectRef: db.collection('cpm_projects').doc(this.$route.params.id),
      submitLoading: false,
      change: {
        budget_category: {
          ref: ''
        }
      },
      commitments: [],
      rules: {
        required: value => !!value || 'Required.'
      },
      showCostCodes: false,
      dateMenu: false,
      errors: {
        changeOptionsTab: false,
        changeInformationTab: false
      },
      costCodeText: '',
      formWasValidated: false
    }
  },
  computed: {
    ...mapGetters('companies/cpmProjects/roles', [
      'roles',
      'roleNames'
    ]),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    preparedUsers() {
      let users = []
      if (this.$h.dg(this.change, 'preparedTitle', []).length) {
        users = this.getUsersByRoles(this.change.preparedTitle)
      }

      return users
    },
    approvedUsers() {
      let users = []
      if (this.$h.dg(this.change, 'approvedTitle', []).length) {
        users = this.getUsersByRoles(this.change.approvedTitle)
      }

      return users
    },
    date: {
      get: function () {
        if (this.change && this.change.date) {
          const date = new Date(this.change.date)
          return `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate() + 1}`
        } else {
          return ''
        }
      },
      set: function (newValue) {
        if (newValue) {
          const [year, month, day] = newValue.split('-')
          this.change.date = new Date(
            `${month}/${day}/${year}`
          ).getTime()
        } else {
          this.change.date = ''
        }
      }
    },
    preparedDate: {
      get: function () {
        if (this.$h.dg(this.change, 'preparedDate')) {
          const date = new Date(this.change.preparedDate)
          return `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate() + 1}`
        }

        return ''
      },
      set: function (newValue) {
        if (newValue) {
          const [year, month, day] = newValue.split('-')
          this.change.preparedDate = new Date(
            `${month}/${day}/${year}`
          ).getTime()
        } else {
          this.change.preparedDate = ''
        }
      }
    },
    approvedDate: {
      get: function () {
        if (this.$h.dg(this.change, 'approvedDate')) {
          const date = new Date(this.change.approvedDate)
          return `${date.getFullYear()}-${date.getMonth() +
            1}-${date.getDate() + 1}`
        } else {
          return ''
        }
      },
      set: function (newValue) {
        if (newValue) {
          const [year, month, day] = newValue.split('-')
          this.change.approvedDate = new Date(
            `${month}/${day}/${year}`
          ).getTime()
        } else {
          this.change.approvedDate = ''
        }
      }
    },
    searchBudgetCategoriesArray() {
      if (!this.change.costCodeText) {
        return []
      }
      const result = []
      this.costCodesAllArray.map(cc => {
        if (
          cc.name.toLowerCase().includes(this.change.costCodeText.toLowerCase())
        ) {
          result.push(cc)
        }
      })
      return result
    },
    budgetCategoryErrors() {
      if (
        this.formWasValidated &&
        !this.$h.dg(this.change, 'budget_category.ref')
      ) {
        return this.$t('cpm.projects.budgetCategoryRequired')
      } else return []
    }
  },
  watch: {
    active() {
      if (!this.active.length) return undefined
      const item = this.changeFiles.find(c => c.path === this.active[0])
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
      if (!this.isCreate && this.changeId) {
        const path = this.$h.dg(
          this.project,
          `files.1.children.4.path/${this.changeId}`
        )
        const folder = this.$h
          .dg(this.project, 'files.1.children.4.children', [])
          .find(dir => dir.path === path)
        this.changeFiles = (folder || {}).children
        this.costCodeText = this.change.costCodeText
      } else {
        const changeNumber = this.project.nextChangeOrderNumber || 1

        let idString = '00000' + changeNumber
        idString = idString.substr(idString.length - 5)
        const year = new Date().getFullYear()

        this.change.number = `CHNGOR-${idString}-${year}`
        this.change.amount = 0
      }
    }
  },
  created() {
    this.fetchInitData()
  },
  mounted() {
    if (this.changeId) {
      this.fetchChange()
    }
  },
  methods: {
    ...mapActions('companies/cpmProjects/bulletins', [
      'fetchApprovalTypes',
      'fetchAuthorizers'
    ]),
    ...mapActions('companies/cpmProjects/roles', [
      'fetchRoles'
    ]),
    fetchInitData() {
      const companyId = this.currentCompany.id

      this.fetchApprovalTypes()
        .then(approvalTypes => this.approvalTypes = approvalTypes)
        .catch(error => console.error(error))

      this.fetchRoles({ companyId })
        .catch(error => console.error(error))
    },
    errorTitle(error) {
      this.errors.changeInformationTab = error
    },
    errorBudget(error) {
      this.errors.changeOptionsTab = error
    },
    filteringCodes(item, queryText) {
      let searchText = item.code ? item.code + ' - ' : ''
      searchText += item.name
      return searchText.toLocaleLowerCase().includes(queryText)
    },
    helperSearchForForecast(stringToSearch = '') {
      if (stringToSearch === '') {
        this.change.costCodeText = stringToSearch
      }

      let result = []
      result = this.costCodesAllArray.filter(cc =>
        cc.name.toLowerCase().includes(stringToSearch.toLowerCase())
      )

      this.$nextTick(() => {
        this.$nextTick(() => {
          if (result.length > 0) {
            this.$refs.costCodeText.$emit('input', result[0].name)
            this.budgetCategorySearchSelect(result[0])
          } else {
            this.change.costCodeText = stringToSearch
          }
        })
      })
    },
    getProjectRef() {
      return db.collection('cpm_projects').doc(this.$route.params.id)
    },
    showCalendarDate() {
      this.$refs.datePopup.isOpen = true
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
        this.change.costCodeText = item.code + ' - ' + item.name
        this.change.costCodeNumber = item.code
      } else {
        this.change.costCodeText = item.name
      }
      this.change.budgetCategory = item.name
      this.change.costCode = item.name
    },
    setCostCodeL2(item, itemL2) {
      if (item.code) {
        this.change.costCodeText =
          itemL2.code + ' - ' + item.name + ' - ' + itemL2.name
      } else {
        this.change.costCodeText = item.name + ' - ' + itemL2.name
      }
      this.change.budgetCategory = item.name
      this.change.costCode = item.name
      this.change.costCodeL2 = itemL2.name
      this.showCostCodes = false
      this.categorySelected = true
    },
    setCostCodeL3(item, itemL2, itemL3) {
      if (item.code) {
        this.change.costCodeText =
          itemL3.code +
          ' - ' +
          item.name +
          ' - ' +
          itemL2.name +
          ' - ' +
          itemL3.name
      } else {
        this.change.costCodeText =
          item.name + ' - ' + itemL2.name + ' - ' + itemL3.name
      }
      this.change.budgetCategory = item.name
      this.change.costCode = item.name
      this.change.costCodeL2 = itemL2.name
      this.change.costCodeL3 = itemL3.name
      this.showCostCodes = false
      this.categorySelected = true
    },
    cancel() {
      this.change = {}
      this.$emit('close')
    },
    async save() {
      this.formWasValidated = true
      const isValid = await this.$refs.obs.validate()

      if (!isValid) {
        return
      }

      if (this.change.dateText) {
        const startDate = DateTime.fromFormat(this.change.dateText, 'MMddyyyy')
        if (!startDate.isValid) {
          this.$snotify.error(
            this.$t('cpm.projects.dateInvalid'),
            this.$t('alerts.error')
          )
          return false
        } else {
          this.change.date = startDate.valueOf()
        }
      } else {
        delete this.change.date
      }

      if (this.change.preparedDateText) {
        const startDate = DateTime.fromFormat(this.change.preparedDateText, 'MMddyyyy')
        if (!startDate.isValid) {
          this.$snotify.error(
            this.$t('cpm.projects.dateInvalid'),
            this.$t('alerts.error')
          )
          return false
        } else {
          this.change.preparedDate = startDate.valueOf()
        }
      } else {
        delete this.change.preparedDate
      }

      if (this.change.approvedDateText) {
        const startDate = DateTime.fromFormat(this.change.approvedDateText, 'MMddyyyy')
        if (!startDate.isValid) {
          this.$snotify.error(
            this.$t('cpm.projects.dateInvalid'),
            this.$t('alerts.error')
          )
          return false
        } else {
          this.change.approvedDate = startDate.valueOf()
        }
      } else {
        delete this.change.approvedDate
      }

      if (this.$refs.form.validate()) {
        // gotta add in form verification
        this.submitLoading = true
        if (this.$h.dg(this.change, 'commitment.id')) {
          this.change.commitment = this.projectRef
            .collection('commitments')
            .doc(this.change.commitment.id)
        }

        if (this.isCreate) {
          const changeNumber = this.project.nextChangeOrderNumber

          this.projectRef.update({
            nextChangeOrderNumber: parseInt(changeNumber) + 1
          })
          this.change.createdAt = new Date()

          let idString = '00000' + changeNumber
          idString = idString.substr(idString.length - 5)
          const year = new Date().getFullYear()

          if (this.$h.dg(this.project, 'files.1.children.4.children')) {
            this.createChange()
              .then(doc => {
                this.project.files[1].children[4].children.push({
                  name:
                    `CHNGOR-${this.change.idString}-${year}` +
                    ' ' +
                    this.$t('cpm.projects.newChange'),
                  path: this.project.files[1].children[4].path + '/' + doc.id,
                  children: []
                })
                db.collection('cpm_projects')
                  .doc(this.$route.params.id)
                  .update({ files: this.project.files })
              })
              .then(() => {
                this.$snotify.success(
                  this.$t('cpm.projects.changeOrderCreated'),
                  this.$t('alerts.success')
                )
                this.$emit('close', true)
              })
          } else {
            this.createChange().then(() => {
              this.$snotify.success(
                this.$t('cpm.projects.changeOrderCreated'),
                this.$t('alerts.success')
              )
              this.$emit('close', true)
            })
          }
        } else {
          if (this.change.dateText) {
            this.change.date =
              this.change.dateText.toString().substring(4, 4) +
              '-' +
              this.change.dateText.toString().substring(0, 2) +
              '-' +
              this.change.dateText.toString().substring(2, 2)
          }

          if (this.change.preparedDateText) {
            this.change.preparedDate =
              this.change.preparedDateText.toString().substring(4, 4) +
              '-' +
              this.change.preparedDateText.toString().substring(0, 2) +
              '-' +
              this.change.preparedDateText.toString().substring(2, 2)
          }

          if (this.change.approvedDateText) {
            this.change.approvedDate =
              this.change.approvedDateText.toString().substring(4, 4) +
              '-' +
              this.change.approvedDateText.toString().substring(0, 2) +
              '-' +
              this.change.approvedDateText.toString().substring(2, 2)
          }

          this.projectRef
            .collection('change_orders')
            .doc(this.change.id)
            .update(this.change)
            .then(() => {
              this.$snotify.success(
                this.$t('cpm.projects.changeOrderUpdated'),
                this.$t('alerts.success')
              )
              this.$emit('close', true)
            })
            .catch(() => {
              this.$snotify.success(
                this.$t('cpm.projects.errorUpdatingChange'),
                this.$t('alerts.error')
              )
            })
        }
      } else {
        this.$snotify.error('cpm.projects.fillFields', this.$t('alerts.error'))
      }
    },
    createChange() {
      return new Promise((resolve, reject) => {
        this.projectRef
          .collection('change_orders')
          .add(this.change)
          .then(doc => {
            resolve(doc)
          })
          .catch(reject)
      })
    },
    setCodes(category) {
      if (!category) return
      this.change.costCode = category.code || ''
      this.change.costCodeNumber = category.code || 0
      this.change.costCodeText = category.name || ''
    },
    setBudgetCategory(category) {
      this.change.budget_category = {
        ref: category
      }
      this.setCodes(category)
    },
    fetchChange() {
      this.projectRef
        .collection('change_orders')
        .doc(this.changeId)
        .get()
        .then(doc => {
          this.change = { id: doc.id, ...doc.data() }
        })
    },
    getUsersByRoles(selectedRoles = []) {
      if (!selectedRoles.length || !this.roles.length) return []

      const users = []
      this.roles.map(role => {
        if (selectedRoles.includes(role.name)) {
          users.push(...role.users)
        }
      })

      return this.lodash.uniqBy(users, 'value')
    },
    setPreparedDate() {
      this.preparedDateMenu = false
      const dateObj = DateTime.fromMillis(this.change.preparedDate)
      this.change.preparedDateText = dateObj.toFormat('MM/dd/yyyy')
    },
    setApprovedDate() {
      this.approvedDateMenu = false
      const dateObj = DateTime.fromMillis(this.change.approvedDate)
      this.change.approvedDateText = dateObj.toFormat('MM/dd/yyyy')
    },
    setDate() {
      this.dateMenu = false
      const dateObj = DateTime.fromMillis(this.change.date)
      this.change.dateText = dateObj.toFormat('MM/dd/yyyy')
    }
  },
  firestore() {
    const aux = {
      project: this.projectRef,
      commitments: this.projectRef.collection('commitments')
    }

    return aux
  }
}
</script>

<style lang="scss" scoped>
.v-avatar {
  left: 50%;
  transform: translate(-50%);
}

.connected-indicator {
  font-size: 1.75rem !important;
  width: 1.75rem !important;
  position: absolute;
  top: 0;
  right: 0;
  height: 1.75rem !important;
  color: #04d81a;
}

.contact-edit-modal {
  .v-card__title {
    padding: 0.625rem;
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
    font-size: 10rem;
  }
}

.icon-close {
  cursor: pointer;
}

.card-title {
  display: block;
}

.card-text {
  background-color: #F6F6F6;
  height: 65vh;
}
</style>

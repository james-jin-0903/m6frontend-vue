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
              {{ $t('cpm.projects.createBulletin') }}
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
              {{ $t('cpm.projects.editBulletin') }}
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
            {{ $t('cpm.projects.bulletinInfo') }}
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
                        :label="$t('cpm.projects.bulletinNumber')"
                        outline
                      />
                    </div>
                  </v-col>

                  <v-col
                    class="pr-3"
                    cols="6"
                  >
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Title"
                      rules="required"
                    >
                      <div class="elevation-2 white">
                        <v-text-field
                          v-model="change.title"
                          color="primary"
                          :error-messages="errors"
                          hide-details
                          :label="$tc('general.title', 1)"
                          outline
                          @update:error="errorTitle"
                        />
                      </div>
                    </ValidationProvider>
                  </v-col>

                  <v-col
                    class="pl-3"
                    cols="6"
                  >
                    <div class="elevation-2 white">
                      <v-select
                        v-model="change.reason"
                        clearable
                        hide-details
                        item-text="name"
                        item-value="id"
                        :items="reasons"
                        :label="$t('cpm.projects.reasonCode')"
                        outline
                        return-object
                      />
                    </div>
                  </v-col>

                  <v-col
                    class="pr-3"
                    cols="6"
                  >
                    <div class="elevation-2 white">
                      <v-select
                        v-model="change.type"
                        clearable
                        hide-details
                        :items="settings.types || []"
                        :label="$t('cpm.projects.bulletinType')"
                        outline
                      />
                    </div>
                  </v-col>

                  <v-col
                    class="pl-3"
                    cols="6"
                  >
                    <div class="elevation-2 white">
                      <v-select
                        v-model="change.status"
                        clearable
                        hide-details
                        :items="settings.status || []"
                        :label="$t('general.status')"
                        outline
                      />
                    </div>
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
                    class="pl-3"
                    cols="6"
                  >
                    <div class="elevation-2 white">
                      <money
                        v-model="change.amount"
                        v-bind="money"
                        class="input-money"
                        hide-details
                        :label="$t('general.amount')"
                        outline
                      />
                    </div>
                  </v-col>

                  <v-col
                    class="pr-3"
                    cols="6"
                  >
                    <div class="elevation-2 white">
                      <v-autocomplete
                        v-model="change.preparedTitle"
                        clearable
                        hide-details
                        :items="roleNames"
                        :label="$t('cpm.projects.bulletinPanel.preparedTitle')"
                        multiple
                        outline
                      />
                    </div>
                  </v-col>

                  <v-col
                    class="pl-3"
                    cols="6"
                  >
                    <div class="elevation-2 white">
                      <v-autocomplete
                        v-model="change.preparedBy"
                        clearable
                        :disabled="!$h.dg(change, 'preparedTitle', []).length"
                        hide-details
                        item-text="name"
                        item-value="id"
                        :items="preparedUsers"
                        :label="$t('cpm.projects.bulletinPanel.preparedBy')"
                        outline
                        return-object
                        single-line
                      >
                        <template
                          slot="selection"
                          slot-scope="data"
                        >
                          {{
                            `${$h.dg(data, 'item.label', '')} (${$h.dg(
                              data,
                              'item.email',
                              ''
                            )})`
                          }}
                        </template>

                        <template
                          slot="item"
                          slot-scope="data"
                        >
                          {{ data.item.label }}
                        </template>
                      </v-autocomplete>
                    </div>
                  </v-col>

                  <v-col
                    class="pr-3"
                    cols="6"
                  >
                    <div class="elevation-2 white">
                      <v-autocomplete
                        v-model="change.preparedBySignature"
                        hide-details
                        item-text="name"
                        item-value="id"
                        :items="approvalTypes"
                        :label="
                          $t('cpm.projects.bulletinPanel.preparedBySignature')
                        "
                        outline
                        return-object
                      >
                        <template
                          slot="selection"
                          slot-scope="data"
                        >
                          {{ data.item.name }}
                        </template>

                        <template
                          slot="item"
                          slot-scope="data"
                        >
                          {{ data.item.name }}
                        </template>
                      </v-autocomplete>
                    </div>
                  </v-col>

                  <v-col
                    class="pl-3"
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
                            :label="
                              $t('cpm.projects.bulletinPanel.preparedDate')
                            "
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
                    <div class="elevation-2 white">
                      <v-autocomplete
                        v-model="change.approvedTitle"
                        clearable
                        hide-details
                        :items="roleNames"
                        :label="$t('cpm.projects.bulletinPanel.approvedTitle')"
                        multiple
                        outline
                      />
                    </div>
                  </v-col>

                  <v-col
                    class="pl-3"
                    cols="6"
                  >
                    <div class="elevation-2 white">
                      <v-autocomplete
                        v-model="change.approvedBy"
                        clearable
                        :disabled="!$h.dg(change, 'approvedTitle', []).length"
                        hide-details
                        item-text="name"
                        item-value="id"
                        :items="approvedUsers"
                        :label="$t('cpm.projects.bulletinPanel.approvedBy')"
                        outline
                        return-object
                      >
                        <template
                          slot="selection"
                          slot-scope="data"
                        >
                          {{
                            `${$h.dg(data, 'item.label', '')} (${$h.dg(
                              data,
                              'item.email',
                              ''
                            )})`
                          }}
                        </template>

                        <template
                          slot="item"
                          slot-scope="data"
                        >
                          {{ data.item.label }}
                        </template>
                      </v-autocomplete>
                    </div>
                  </v-col>

                  <v-col
                    class="pr-3"
                    cols="6"
                  >
                    <div class="elevation-2 white">
                      <v-autocomplete
                        v-model="change.approvedBySignature"
                        hide-details
                        item-text="name"
                        item-value="id"
                        :items="approvalTypes"
                        :label="
                          $t('cpm.projects.bulletinPanel.approvedBySignature')
                        "
                        outline
                        return-object
                      >
                        <template
                          slot="selection"
                          slot-scope="data"
                        >
                          {{ data.item.name }}
                        </template>

                        <template
                          slot="item"
                          slot-scope="data"
                        >
                          {{ data.item.name }}
                        </template>
                      </v-autocomplete>
                    </div>
                  </v-col>

                  <v-col
                    class="pl-3"
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
                            :label="
                              $t('cpm.projects.bulletinPanel.approvedDate')
                            "
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

                  <v-col cols="12">
                    <div class="elevation-2 white">
                      <v-textarea
                        v-model="change.subject"
                        auto-grow
                        color="blue"
                        hide-details
                        :label="$t('cpm.projects.bulletinPanel.subject')"
                        outline
                        :rows="2"
                      />
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <div class="elevation-2 white">
                      <v-textarea
                        v-model="change.background"
                        auto-grow
                        color="blue"
                        hide-details
                        :label="$t('cpm.projects.bulletinPanel.background')"
                        outline
                        :rows="2"
                      />
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <div class="elevation-2 white">
                      <v-select
                        v-model="change.commitment"
                        clearable
                        hide-details
                        item-value="_id"
                        :items="commitments"
                        :label="$tc('cpm.projects.commitment', 1)"
                        outline
                        return-object
                      >
                        <template
                          slot="item"
                          slot-scope="{ item }"
                        >
                          {{ item.number }} - {{ item.amount | currency }}
                          {{ item.vendor ? `- ${item.vendor.title}` : '' }}
                        </template>

                        <template
                          slot="selection"
                          slot-scope="{ item }"
                        >
                          {{ item.number }} - {{ item.amount | currency }}
                          {{ item.vendor ? `- ${item.vendor.title}` : '' }}
                        </template>
                      </v-select>
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <div class="elevation-2 white">
                      <budget-category-select
                        :category="$h.dg(change, 'budget_category.ref', '')"
                        :errors="budgetCategoryErrors"
                        hide-details
                        :label="$t('cpm.projects.budgetCategory')"
                        outline
                        @newCategory="setBudgetCategory"
                      />
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <div class="elevation-2 white">
                      <v-textarea
                        v-model="change.description"
                        color="blue"
                        hide-details
                        :label="$t('general.description')"
                        outline
                      />
                    </div>
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
import { Money } from 'v-money'
import { DateTime } from 'luxon'
import BudgetCategorySelect from '../_partials/BudgetCategorySelect'

export default {
  name: 'FinancialChange',
  components: { Money, BudgetCategorySelect },
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
      settings: {},
      budgetSettings: { costCodes: [] },
      commitmentSettings: {},
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
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '$',
        precision: 2,
        masked: false
      },
      dateMenu: false,
      errors: {
        changeOptionsTab: false,
        changeInformationTab: false
      },
      costCodeText: '',
      formWasValidated: false,
      reasons: []
    }
  },
  computed: {
    ...mapGetters('companies/cpmProjects/roles', ['roles', 'roleNames']),
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
          this.change.date = new Date(`${month}/${day}/${year}`).getTime()
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
    budgetSettingsCodes() {
      return this.budgetSettings.costCodes.map(item => {
        let text = item.code ? item.code + ' - ' : ''
        text += item.name
        return { ...item, text }
      })
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
    budgetSettings() {
      this.costCodesAllArray = []
      this.budgetSettings.costCodes.forEach(cl1 => {
        const itemName = cl1.code ? `${cl1.code} - ${cl1.name}` : cl1.name
        this.costCodesAllArray.push({
          item: cl1,
          name: itemName,
          level: 1
        })
        if (cl1.cat_1 && cl1.cat_1.length) {
          cl1.cat_1.forEach(cl2 => {
            let itemL2Name = itemName + ' | '
            itemL2Name += cl2.code ? `${cl2.code} - ${cl2.name}` : cl2.name
            this.costCodesAllArray.push({
              item: cl1,
              itemL2: cl2,
              name: itemL2Name,
              level: 2
            })
            if (cl2.cat_2 && cl2.cat_2.length) {
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
        const changeNumber = this.project.nextChangeNumber

        let idString = '00000' + changeNumber
        idString = idString.substr(idString.length - 5)
        const year = new Date().getFullYear()

        this.change.number = `CHNG-${idString}-${year}`
        this.change.title = this.$t('cpm.projects.newChange')
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
    ...mapActions('companies/cpmProjects/roles', ['fetchRoles']),
    fetchInitData() {
      const companyId = this.currentCompany.id

      this.fetchApprovalTypes()
        .then(approvalTypes => (this.approvalTypes = approvalTypes))
        .catch(error => console.error(error))

      this.fetchRoles({ companyId }).catch(error => console.error(error))
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
      this.errors.changeOptionsTab = false
      this.errors.changeInformationTab = false

      if (!isValid) {
        if (!this.change.title) {
          this.errors.changeInformationTab = true
        }
        return
      }

      if (!this.$h.dg(this.change, 'budget_category.ref')) {
        this.$snotify.warning(this.$t('cpm.projects.budgetCategoryRequired'))
        this.tab = 0
        return
      }
      if (this.$h.dg(this.change, 'budget_category.ref.id')) {
        this.change.budget_category = {
          ref: db
            .collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('budgets')
            .collection('budget_categories')
            .doc(this.change.budget_category.ref.id)
        }
      } else {
        delete this.change.budget_category
      }

      if (this.$h.dg(this.change, 'reason.id')) {
        this.change.reason = db
          .collection('settings')
          .doc(this.currentCompany.id)
          .collection(`${this.settingCollectionName}`)
          .doc('changes')
          .collection('reasons')
          .doc(this.change.reason.id)
      } else {
        delete this.change.reason
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

      if (this.$refs.form.validate()) {
        // gotta add in form verification
        this.submitLoading = true
        if (this.$h.dg(this.change, 'commitment.id')) {
          this.change.commitment = this.projectRef
            .collection('commitments')
            .doc(this.change.commitment.id)
        }

        if (this.isCreate) {
          const changeNumber = this.project.nextChangeNumber

          this.projectRef.update({
            nextChangeNumber: parseInt(changeNumber) + 1
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
                    `CHNG-${this.change.idString}-${year}` +
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
                  this.$t('cpm.projects.changeCreated'),
                  this.$t('alerts.success')
                )
                this.$emit('close', true)
              })
          } else {
            this.createChange().then(() => {
              this.$snotify.success(
                this.$t('cpm.projects.changeCreated'),
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

          if (
            this.$h.dg(this.project, 'files.1.children.4.children') &&
            this.$h.dg(this.project, 'files.1.children.4.path')
          ) {
            const path =
              this.project.files[1].children[4].path + '/' + this.change.id
            const folderName = this.change.number + ' ' + this.change.title

            const folder = this.project.files[1].children[4].children.find(
              dir => dir.path === path
            )
            if (
              this.$h.dg(folder, 'name') &&
              folderName !== folder.name &&
              !this.isCreate
            ) {
              folder.name = folderName
              db.collection('cpm_projects')
                .doc(this.$route.params.id)
                .update({ files: this.project.files })
            }
          }
          this.projectRef
            .collection('changes')
            .doc(this.change.id)
            .update(this.change)
            .then(() => {
              this.$snotify.success(
                this.$t('cpm.projects.changeUpdated'),
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
          .collection('changes')
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
        .collection('changes')
        .doc(this.changeId)
        .get()
        .then(doc => {
          this.change = { id: doc.id, ...doc.data() }

          if (this.$h.dg(this.change, 'commitment.id')) {
            this.change.commitment.get().then(snapshot => {
              this.change.commitment = { ...snapshot.data(), id: snapshot.id }
            })
          }
          if (this.$h.dg(this.change, 'budget_category.ref')) {
            this.change.budget_category.ref.get().then(snapshot => {
              this.change.budget_category.ref = { ...snapshot.data() }
            })
          }
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
      commitments: this.projectRef.collection('commitments'),
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('changes'),
      reasons: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('changes')
        .collection('reasons'),
      budgetSettings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('budgets'),
      commitmentSettings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('commitments')
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
  background-color: #f6f6f6;
  height: 65vh;
}

.input-money {
  height: 4rem;
  border: solid 3.2px grey;
}
</style>

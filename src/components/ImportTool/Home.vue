<template>
  <v-container class="dont-show-scroll rounded-lg vertical-scroll">
    <v-row class="mx-0 my-4">
      <v-col
        class="pa-0"
        cols="12"
      >
        <v-card
          class="vertical-scroll"
          max-height="800"
        >
          <v-card-title class="headline px-6 py-3 white">
            <span class="grey--text text--darken-2 text-h6">
              Upload Document
            </span>
          </v-card-title>
          <v-divider class="grey lighten-3 z-index" />
          <v-card-text class="pb-5 px-6">
            <template v-if="$route.query.dev === 'dev2'">
              <template
                v-for="field in selectFields"
              >
                {{ field.value }} <br>
              </template>
            </template>
            <div v-if="$route.query.dev === 'dev'">
              <h5>Developer Tools</h5>
              <v-btn @click="deleteZoetisProjects">
                DELETE ZOETIS PROJECTS
              </v-btn>

              <v-btn @click="useHistorical">
                Historical Spendings
              </v-btn>

              <v-btn @click="rollBack('spending')">
                Rollback Spendings
              </v-btn>

              <v-btn @click="rollBack('spendingLineItem')">
                Rollback SLI
              </v-btn>

              <v-btn @click="rollBack('commitment')">
                Rollback Commitments
              </v-btn>

              <v-btn @click="rollBack('commitmentLineItem')">
                Rollback CLI
              </v-btn>

              <v-btn @click="rollBack('project')">
                Rollback Projects
              </v-btn>
              <v-divider class="grey lighten-3 mt-5 z-index" />
            </div>

            <!-- Upload Document -->
            <v-form>
              <p class="blue--text mb-1 text--lighten-1">
                Step 1. Please upload your export file
              </p>
              <input
                accept=".xlsx"
                type="file"
                @change="onFileChange"
              >
            </v-form>

            <v-divider class="grey lighten-3 my-2 z-index" />
            <!-- File Upload Errors -->
            <template v-show="!showStep2Loader">
              <p
                v-for="(fileError, i) in fileErrors"
                :key="'fileError-' + i"
                class="mb-1 mt-4 red--text text--lighten-1"
              >
                <v-icon
                  color="red lighten-1"
                  size="16"
                >
                  mdi-close-box-outline
                </v-icon>
                {{ fileError }}
              </p>
            </template>
            <v-progress-circular
              v-show="showStep2Loader"
              color="blue"
              indeterminate
              size="20"
            />
            <!-- Select Headers -->
            <template
              v-if="
                firstRow === null &&
                  fileData &&
                  fileErrors.length === 0 &&
                  !showStep2Loader
              "
            >
              <template v-if="!getHeadersByRow && fileData.headers">
                <p class="blue--text mb-1 mt-4 text--lighten-1">
                  Step 2. Are these your column headers?
                </p>
                <table-headers
                  class="table-headers"
                  :headers="fileData.headers"
                />
                <div class="d-flex justify-end pt-4">
                  <v-btn @click="setHeaders(fileData.headers)">
                    Yes
                  </v-btn>
                  <v-btn
                    class="ml-3"
                    @click="getRows"
                  >
                    No
                  </v-btn>
                </div>
                <v-divider class="grey lighten-3 my-2 z-index" />
              </template>

              <template
                v-if="
                  getHeadersByRow && fileErrors.length === 0 && !showStep2Loader
                "
              >
                <p class="blue--text mb-1 mt-4 text--lighten-1">
                  Step 2. Are these your column headers?
                </p>
                <v-select
                  item-text="label"
                  item-value="value"
                  :items="rows"
                  label="Select a Row"
                  return-object
                  @change="setStartRow"
                />
                <table-headers
                  v-if="rowSelected.length"
                  class="table-headers"
                  :headers="rowSelected"
                />
                <div class="d-flex justify-end pt-4">
                  <v-btn @click="setHeaders(rowSelected)">
                    Yes
                  </v-btn>
                  <v-btn
                    class="ml-3"
                    @click="getRows"
                  >
                    No
                  </v-btn>
                </div>
                <v-divider class="grey lighten-3 my-2 z-index" />
              </template>

              <!-- Map Fields -->
              <template v-if="showStep3">
                <div class="d-flex justify-start">
                  <p class="blue--text mb-0 mr-4 mt-4 text--lighten-1">
                    Step 3. Select M6 Template
                  </p>
                  <v-select
                    class="mb-4 mt-2 select-preset"
                    clearable
                    dense
                    item-text="name"
                    :items="presets"
                    label="Select..."
                    return-object
                    solo
                    style="max-width: 200px;"
                    @change="setPreset"
                  />
                </div>
                <v-simple-table class="presets-table table-headers">
                  <tbody class="d-flex">
                    <template v-for="(header, hi) in importHeaders">
                      <tr
                        :key="hi"
                        class="d-flex flex-column preset-row"
                      >
                        <td class="d-none">
                          {{ hi + 1 }}
                        </td>
                        <td
                          class="align-center d-flex font-weight-bold justify-start text-caption"
                        >
                          {{
                            typeof header === "string" ||
                              typeof header === "number"
                              ? header
                              : "-"
                          }}
                        </td>
                        <td
                          class="justify-start preset-select-content"
                          style="height: auto;"
                        >
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              <v-autocomplete
                                v-model="mappedFields[hi]"
                                v-bind="attrs"
                                class="font-weight-bold justify-start mb-1 text-caption"
                                clearable
                                elevation="3"
                                item-text="name"
                                item-value="value"
                                :items="selectFields"
                                label="M6 Field Match"
                                v-on="on"
                              />
                            </template>
                            <span
                              class="grey lighten- px-3 py-1 rounded white--text"
                            >Select M6 label which most closely matches your
                              column header</span>
                          </v-tooltip>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </v-simple-table>
                <v-card-actions class="pa-0 pt-6">
                  <v-spacer />
                  <v-btn @click="savePresetDialog = true">
                    Save Selections
                  </v-btn>
                </v-card-actions>
                <v-divider class="grey lighten-3 my-2 z-index" />
                <v-row class="d-flex flex-column justify-end ma-0">
                  <div class="d-flex justify-start">
                    <p class="blue--text mb-3 text--lighten-1">
                      Step 4. Create Record
                    </p>
                  </div>
                  <v-btn
                    class="blue capitalize lighten-1 px-10 py-5 text-h6 white--text"
                    elevation="1"
                    text
                    @click="prepareToImport"
                  >
                    Create
                  </v-btn>
                </v-row>
              </template>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!--Save Template Dialog-->
    <v-dialog
      v-if="savePresetDialog"
      v-model="savePresetDialog"
      width="450px"
    >
      <v-card>
        <v-card-title class="headline px-6 py-3 white">
          <span class="grey--text text--darken-2 text-h6">
            {{ preset.id ? "Update Template" : "Add New Template" }}
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3 z-index" />
        <v-card-text class="px-6">
          <v-text-field
            v-model="preset.name"
            label="Name"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            dark
            @click="closePresetDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue"
            dark
            @click="savePreset"
          >
            {{ preset.id ? "Update" : "Save" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="percentageDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-text class="py-4">
          <h1 v-if="updatingCommitmentAmounts">Updating commitment amounts...</h1>
          <v-progress-linear
            height="25"
            stream
            :value="percentage"
          >
            <strong class="white--text">{{
              Math.ceil(percentage) === 100
                ? "Done!"
                : `${Math.ceil(percentage)}%`
            }}</strong>
          </v-progress-linear>
        </v-card-text>
        <v-card-actions class="px-6 py-0">
          <v-spacer />
          <v-btn
            v-show="Math.ceil(percentage) >= 100"
            class="mb-3"
            color="blue darken-1"
            text
            @click="percentageDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import TableHeaders from '@/components/ImportTool/TableHeaders'
import { db, doFirebaseAuth, newFirebaseInit } from '@/utils/Firebase'
import { mapState } from 'vuex'
import _ from 'lodash'
export default {
  /* eslint-disable camelcase */
  /* eslint-disable no-console */
  // eslint-disable-next-line vue/match-component-file-name
  name: 'ImportCPM',
  components: {
    TableHeaders
  },
  data() {
    return {
      updatingCommitmentAmounts: false,
      projectIds: [],
      duplicatedCommitments: [],
      importedId: '02/19/2021',
      companySettings: [],
      file: '',
      fileData: [],
      fileErrors: [],
      sheetSelected: false,
      rowSelected: [],
      firstRow: null,
      getHeadersByRow: false,
      startRow: 0,
      showStep3: false,
      importHeaders: [],
      mappedFields: [],
      presets: [],
      fields: {
        projects: [
          {
            header: 'Project'
          },
          {
            name: 'Title',
            description: ''
          },
          {
            name: 'CPA Capital With Cont',
            description: ''
          },
          {
            name: 'CPA Capital',
            description: ''
          },
          {
            name: 'YTD Actuals Expenses',
            description: ''
          },
          {
            name: 'YTD Actuals Capitals',
            description: ''
          },
          {
            name: 'ID/Number/CPA',
            description: ''
          },
          {
            name: 'Category',
            description: ''
          },
          {
            name: 'General Contractor',
            description: ''
          },
          {
            name: 'Project Manager',
            description: ''
          },
          {
            name: 'startDate',
            description: ''
          },
          {
            name: 'End Date',
            description: ''
          },
          {
            name: 'Total Plan Budget',
            description: ''
          },
          {
            name: 'Phase',
            description: ''
          },
          {
            name: 'Status',
            description: ''
          },
          {
            name: 'Forecasted',
            description: ''
          },
          {
            name: 'Range',
            description: ''
          },
          {
            name: 'Prior Spend',
            description: ''
          },
          {
            name: 'January',
            description: ''
          },
          {
            name: 'February',
            description: ''
          },
          {
            name: 'March',
            description: ''
          },
          {
            name: 'April',
            description: ''
          },
          {
            name: 'May',
            description: ''
          },
          {
            name: 'June',
            description: ''
          },
          {
            name: 'July',
            description: ''
          },
          {
            name: 'August',
            description: ''
          },
          {
            name: 'September',
            description: ''
          },
          {
            name: 'October',
            description: ''
          },
          {
            name: 'November',
            description: ''
          },
          {
            name: 'December',
            description: ''
          }

        ],
        commitments: [
          {
            header: 'Commitment'
          },
          {
            name: 'ID/Number',
            description: ''
          },
          {
            name: 'Start Date',
            description: ''
          },
          {
            name: 'Delivery Date',
            description: ''
          }
        ],
        commitmentLineItem: [
          {
            header: 'Commitment Line Item'
          },
          {
            name: 'Account',
            description: ''
          },
          {
            name: 'Accrual',
            description: ''
          },
          {
            name: 'Amount',
            description: ''
          },
          {
            name: 'Cost per Item',
            description: ''
          },
          {
            name: 'Line Number',
            description: ''
          },
          {
            name: 'PO ID/Number',
            description: ''
          },
          {
            name: 'Open Amount',
            description: ''
          },
          {
            name: 'Quantity',
            description: ''
          },
          {
            name: 'Start Date',
            description: ''
          },
          {
            name: 'Tax Amount',
            description: ''
          },
          {
            name: 'Title',
            description: ''
          },
          {
            name: 'Description',
            description: ''
          },
          {
            name: 'Description 2',
            description: ''
          },
          {
            name: 'Paid To Date Amount',
            description: ''
          },
          {
            name: 'Remaining w/ Accrual',
            description: ''
          },
          {
            name: 'System Date',
            description: ''
          }
        ],
        spendings: [
          {
            header: 'Spending'
          },
          {
            name: 'ID/Number',
            description: ''
          },
          {
            name: 'Contingency',
            description: ''
          },
          {
            name: 'Status',
            description: ''
          }
        ],
        spendingLineItem: [
          {
            header: 'Spending Line Item'
          },
          {
            name: 'Account',
            description: ''
          },
          {
            name: 'Account Category',
            description: ''
          },
          {
            name: 'Amount',
            description: ''
          },
          {
            name: 'Start Date',
            description: ''
          },
          {
            name: 'Description',
            description: ''
          },
          {
            name: 'Line Number',
            description: ''
          },
          {
            name: 'ID/Number',
            description: ''
          },
          {
            name: 'Paid Date',
            description: ''
          },
          {
            name: 'Posted Date',
            description: ''
          },
          {
            name: 'Commitment ID/Number',
            description: ''
          }
        ],
        others: [
          {
            header: 'Others'
          },
          {
            name: 'Cost Code Text',
            description: ''
          },
          {
            name: 'Cost Code Number',
            description: ''
          },
          {
            name: 'WBS Element',
            description: ''
          },
          {
            name: 'GL Account Name',
            description: ''
          },
          {
            name: 'GL Account Code',
            description: ''
          },
          {
            name: 'Budget Category Code',
            description: ''
          },
          {
            name: 'Budget Category Name',
            description: ''
          },
          {
            name: 'Vendor Name',
            description: ''
          },
          {
            name: 'Vendor Code',
            description: ''
          },
          {
            name: 'Fiscal Year',
            description: ''
          },
          {
            name: 'Period',
            description: ''
          },
          {
            name: 'UID',
            description: ''
          },
          {
            name: 'Dist Seq Nbr',
            description: ''
          },
          {
            name: 'Cost Code Number',
            description: ''
          }
        ],
        schedule: [
          {
            header: 'Schedule & Budget'
          },
          {
            name: 'Phase',
            description: ''
          },
          {
            name: 'Target Date / Phase',
            description: ''
          },
          {
            name: 'Construction Start',
            description: ''
          },
          {
            name: 'Anticipated Construction Finish',
            description: ''
          },
          {
            name: 'Complete Budget',
            description: ''
          },
          {
            name: 'Complete Schedule',
            description: ''
          },
          {
            name: 'Complete Overall',
            description: ''
          },
          {
            name: 'Budget Status',
            description: ''
          },
          {
            name: 'Total Project Budget',
            description: ''
          }
        ]
      },
      preset: {},
      savePresetDialog: false,
      types: [],
      showStep2Loader: false,
      budgetCategories: [],
      rowNumber: 0,
      percentage: 0,
      percentageDialog: false,
      glAccountNumbers: []
    }
  },
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    isSharp() {
      return +this.currentCompany.id === 54395
    },
    rows() {
      const data = []

      for (let i = this.startRow; i <= this.startRow + 20; i++) {
        data.push({
          label: i + 1,
          value: this.fileData.data[i]
        })
      }

      return data
    },
    selectFields() {
      const returnFields = []
      let lastHeader = ''
      Object.keys(this.fields).forEach(section => {
        this.fields[section].forEach(field => {
          if (field.header) {
            lastHeader = field.header
            returnFields.push({
              ...field
            })
          } else {
            returnFields.push({
              ...field,
              name: `${lastHeader} - ${field.name}`,
              value: `${section}_${field.name
                .replace(/\s/g, '_')
                .replace(/\//g, '_')
                .toLowerCase()}`
            })
          }
        })
      })
      return returnFields
    }
  },
  async created() {
    // Init Firebase
    await newFirebaseInit()
    await doFirebaseAuth()

    await this.$store
      .dispatch('ImportCPM/getPresets')
      .then(response => (this.presets = response))
    this.getBudgetCategories()
    this.getProjectSettings()
  },
  methods: {
    setStartRow(a) {
      this.rowNumber = a.label
      this.rowSelected = a.value
    },
    closePresetDialog() {
      if (!this.preset.id) {
        this.preset = {}
      }
      this.savePresetDialog = false
    },
    savePreset() {
      // Modify undefined values
      for (let i = 0; i < this.mappedFields.length; i++) {
        if (!this.mappedFields[i]) {
          this.mappedFields[i] = ''
        }
      }

      if (this.preset.id) {
        this.$store.dispatch('ImportCPM/updatePreset', {
          ...this.preset,
          mappedFields: this.mappedFields
        })
      } else {
        this.$store.dispatch('ImportCPM/addPreset', {
          ...this.preset,
          mappedFields: this.mappedFields
        })
      }
      this.savePresetDialog = false
    },
    setPreset(item) {
      if (item) {
        this.preset = item
        this.mappedFields = item.mappedFields || []
      } else {
        this.preset = {}
        this.mappedFields = []
      }
    },
    getRows() {
      this.getHeadersByRow = true
      this.showStep3 = false
    },
    onFileChange(e) {
      this.fileErrors = []
      this.showStep2Loader = true
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        this.showStep2Loader = false
        return
      }
      // TODO: move this to store
      const formData = new FormData()
      formData.append('file', files[0])
      this.axios
        .post(
          `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/cpm-import/parse`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        .then(({ data } = {}) => {
          const noEmptyHeaders = data.headers.filter(
            header => header !== null
          )
          const noEmptyFields = data.data.filter(field => field !== null)
          if (noEmptyHeaders.length === 0 && noEmptyFields.length === 0) {
            this.fileErrors = ['There are no headers in this file']
          } else {
            this.fileData = data
            this.fileErrors = []
          }
          this.showStep2Loader = false
        })
        .catch(error => {
          this.fileErrors = [error.message]
          this.showStep2Loader = false
        })
    },
    useHistorical() {
      this.axios
        .get(
          `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/cpm-import/parse/txt`
        )
        .then(({ data } = {}) => {
          const noEmptyHeaders = data.headers.filter(
            header => header !== null
          )
          const noEmptyFields = data.data.filter(field => field !== null)
          if (noEmptyHeaders.length === 0 && noEmptyFields.length === 0) {
            this.fileErrors = ['There are no headers in this file']
          } else {
            this.fileData = data
            this.fileErrors = []
          }
          this.showStep2Loader = false
        })
        .catch(error => {
          this.fileErrors = [error.message]
          this.showStep2Loader = false
        })
    },
    setHeaders(headers) {
      this.importHeaders = headers
      this.showStep3 = true
    },
    prepareToImport() {
      let projectsCheck = false
      let commitmentsToCheck = false
      let spendingsToCheck = false

      // Verify the headers

      this.mappedFields.forEach(item => {
        if (
          item.includes('projects_id_number_cpa') !== false ||
          item.includes('others_wbs_element') !== false
        ) {
          console.log('Projects', item)
          projectsCheck = true
        }

        if (
          item.includes('commitments_id_number') !== false &&
          item.includes('spendingLineItem_commitment_id_number') === false
        ) {
          console.log('COMMITMENTS')
          commitmentsToCheck = true
        }
        if (item.includes('spendings_id_number') !== false) {
          console.log('SPENDINGS')
          spendingsToCheck = true
        }
      })

      if (projectsCheck) {
        if (commitmentsToCheck) {
          this.types.push('commitments')
        }
        if (spendingsToCheck) {
          this.types.push('spendings')
        }
        this.startImport()
      } else {
        console.error(errors)
      }
    },

    async startImport() {
      this.percentage = 0
      this.percentageDialog = true

      for (let index = 0; index < this.fileData.data.length; index++) {
      //for (let index = 0; index <= 5; index++) {
        const item = this.fileData.data[index]
        if (index <= this.rowNumber) {
          // SKIP HEADERS
        } else {
          // if (index > 51882) {
          console.log('CHECKING ' + index)
          const formatedData = this.formatData(item)
          console.log(JSON.stringify(formatedData, null, 3))

          let project = ''
          // Check if project exists
          if (formatedData.projects_id_number_cpa) {
            project = await this.getProject(formatedData.projects_id_number_cpa)
          } else if (formatedData.others_wbs_element) {
            const wbsInfo = formatedData.others_wbs_element.split('-')
            const projectNumber = `${wbsInfo[0]}-${wbsInfo[1]}-${wbsInfo[2]}`
            formatedData.projects_id_number_cpa = projectNumber
            formatedData.others_budget_category_code = wbsInfo[3]
            project = await this.getProject(projectNumber)
          } else {
            continue
          }

          // Create project if not exists
          if (!!project === false) {
            console.log('Creating Project')
            project = await this.createProject(formatedData)
            await this.createProjectSpends(project.id, formatedData)
            await this.storeForRevert('project', project.id, project)
          } else if (this.$h.dg(project, '0.id')) {
            console.log('Using Existing project')
            project = project[0]

            if (!this.isSharp) {
              await this.updateProject(project, formatedData)
            }

            await this.createProjectSpends(project.id, formatedData)
          } else {
            console.log('ERROR ON PROJECT')
            throw new Error('Error on Project')
          }

          // Once the project is created, we check if we are importing commitments or spendings
          if (this.types.includes('commitments')) {
            const number =
              formatedData.commitments_id_number ||
              formatedData.commitmentLineItem_po_id_number
            if (!number) {
              console.error('MISSING PO NUMBER')
              continue
            }
            let commitment = await this.getCommitment(project.id, number)

            if (commitment.length > 1) {
              // Error we can have just one commitment with the same number
              this.$snotify.error('Commitment duplicated: ', 'Error')
              console.error('duplicated commitments')
              this.duplicatedCommitments.push(formatedData)
              continue
            }

            if (!commitment) {
              // Commitment not exists
              commitment = await this.createCommitment(
                project.id,
                formatedData
              )
              await this.storeForRevert(
                'commitment',
                commitment.id,
                commitment
              )
              console.log('Creating Commitment')
            } else {
              console.log('Using Existing Commitment')
              commitment = commitment[0]
              await this.checkIfBudgetCategoryExistsInFinancial(commitment, formatedData)
            }

            if (formatedData.commitmentLineItem_line_number) {
              // Verify if the line item already exists
              const checkLineItem = await this.getCommitmentLineItem(
                project.id,
                commitment.id,
                formatedData.commitmentLineItem_line_number
              )
              if (checkLineItem.empty) {
                console.log('Creating Line Item')
                const newCommitmentLineItem = await this.createCommitmentLineItem(
                  project.id,
                  commitment.id,
                  formatedData
                )
                await this.storeForRevert(
                  'commitmentLineItem',
                  newCommitmentLineItem.id,
                  newCommitmentLineItem
                )
              } else {
                if (this.isSharp) {
                  await this.updateCommitmentLineItem(formatedData, checkLineItem)
                }
                console.log('Line Item already exists')
              }
            } else {
              console.log('Missing Commitment Line item number')
            }
          } else
          if (this.types.includes('spendings')) {
            const number = formatedData.spendings_id_number
            if (!number) {
              console.error('MISSING SPENDING NUMBER')
              continue
            }
            let spending = await this.getSpending(project.id, number)

            if (spending.length > 1) {
              // Error we can have just one commitment with the same number
              this.$snotify.error('Spending duplicated: ', 'Error')
              break
            }

            if (!spending) {
              // Commitment not exists
              spending = await this.createSpending(project.id, formatedData)
              await this.storeForRevert('spending', spending.id, spending)
              console.log('Creating Spending')
            } else {
              console.log('Using Existing Spending')
              spending = spending[0]
              await this.checkIfBudgetCategoryExistsInFinancial(spending, formatedData)
            }

            // Verify if the line item already exists
            if (this.currentCompany.id === '809') {
              // if (!formatedData.spendingLineItem_commitment_id_number) {
              if (formatedData.dups > 0) {
                console.log('Dups > 0', formatedData.dups)
                const docs = db
                  .collection('cpm_projects')
                  .doc(project.id)
                  .collection('spendings')
                  .doc(spending.id)
                  .collection('line_items')
                  .where('fiscalYear', '==', formatedData.others_fiscal_year)
                  .where('period', '==', formatedData.others_period)
                  .where('amount', '==', formatedData.spendingLineItem_amount)
                  .where('number', '==', formatedData.spendings_id_number.toString())
                  .where('dateText', '==', formatedData.spendingLineItem_start_date)

                const query = await docs.get()
                console.log('spendings ya creados', query.docs.length)
                console.log('spendings ya creados (docs)', query.docs)
                if (query.docs.length < formatedData.dups) {
                  console.log('Creating Spending Line Item without PO NUMBER')
                  const newSpendingLineItem = await this.createSpendingLineItem(
                    project.id,
                    spending.id,
                    formatedData
                  )
                  await this.storeForRevert(
                    'spendingLineItem',
                    newSpendingLineItem.id,
                    newSpendingLineItem
                  )
                } else {
                  console.log('line items dups created, skiping')
                }
              } else {
                console.log('no dups found in the file, checking if exists')
                const docs = db
                  .collection('cpm_projects')
                  .doc(project.id)
                  .collection('spendings')
                  .doc(spending.id)
                  .collection('line_items')
                  .where('fiscalYear', '==', formatedData.others_fiscal_year)
                  .where('period', '==', formatedData.others_period)
                  .where('amount', '==', formatedData.spendingLineItem_amount)
                  .where('number', '==', formatedData.spendings_id_number.toString())
                  .where('dateText', '==', formatedData.spendingLineItem_start_date)

                const query = await docs.get()
                console.log('spendings number', formatedData.spendings_id_number)
                console.log('spendings ya creados cuando no hay dups ', query.docs.length)
                console.log('spendings ya creados cuando no hay dups (docs)', query.docs)
                if (query.docs.length > 0) {
                  console.log('Spending already Imported')
                } else {
                  console.log('Creating Spending Line Item without PO NUMBER')
                  const newSpendingLineItem = await this.createSpendingLineItem(
                    project.id,
                    spending.id,
                    formatedData
                  )
                  await this.storeForRevert(
                    'spendingLineItem',
                    newSpendingLineItem.id,
                    newSpendingLineItem
                  )
                }
              }
              // }
              // else {
              //   let commitment = await this.getCommitment(
              //     project.id,
              //     formatedData.spendingLineItem_commitment_id_number
              //   )
              //   if (commitment.length > 1) {
              //     // Error we can have just one commitment with the same number
              //     this.$snotify.error('Commitment duplicated: ', 'Error')
              //   } else {
              //     if (!commitment) {
              //       // Commitment not exists
              //       console.log('Commitment not exist, skipping')
              //     } else {
              //       console.log(
              //         'Using Existing Commitment (Spendings Process)'
              //       )
              //       commitment = commitment[0]
              //
              //       const clis = await this.getCommitmentLineItems(
              //         project.id,
              //         commitment.id
              //       )
              //       let isNewSpending = false
              //       await Promise.all(
              //         clis.map(async cli => {
              //           if (
              //             !cli.spendingRef &&
              //             cli.amount === formatedData.spendingLineItem_amount
              //           ) {
              //             // Create line item
              //             console.log('Creating Spending Line Item')
              //             isNewSpending = true
              //             formatedData.commitmentLineRef = cli.ref
              //             const newSpendingLineItem = await this.createSpendingLineItem(
              //               project.id,
              //               spending.id,
              //               formatedData
              //             )
              //             cli.ref.update({ spendingRef: newSpendingLineItem })
              //             await this.storeForRevert(
              //               'spendingLineItem',
              //               newSpendingLineItem.id,
              //               newSpendingLineItem
              //             )
              //           }
              //         })
              //       )
              //       if (!isNewSpending) {
              //         console.log('Spending already Imported')
              //       }
              //     }
              //   }
              // }
            } else if (this.isSharp) {
              const checkLineItem = await this.getSpendingLineItemForShap(
                project.id,
                spending.id,
                formatedData
              )
              if (!checkLineItem) {
                console.log('Creating Spending Line Item')
                const newSpendingLineItem = await this.createSpendingLineItem(
                  project.id,
                  spending.id,
                  formatedData
                )
                await this.storeForRevert(
                  'spendingLineItem',
                  newSpendingLineItem.id,
                  newSpendingLineItem
                )
              } else {
                console.log('Skipping Line Item, already exists')
              }
            } else {
              if (formatedData.spendingLineItem_line_number) {
                const checkLineItem = await this.getSpendingLineItem(
                  project.id,
                  spending.id,
                  formatedData
                )
                if (!checkLineItem) {
                  console.log('Creating Spending Line Item')
                  const newSpendingLineItem = await this.createSpendingLineItem(
                    project.id,
                    spending.id,
                    formatedData
                  )
                  await this.storeForRevert(
                    'spendingLineItem',
                    newSpendingLineItem.id,
                    newSpendingLineItem
                  )
                } else {
                  console.log('Skipping Line Item, already exists')
                }
              } else {
                console.log('Missing Spending Line item number')
              }
            }
          }
          // }
        }
        if (this.isSharp && this.types.includes('commitments')) {
          this.updateCommitmentAmounts()
        }
        this.percentage = (index * 100) / this.fileData.data.length
        // this.percentage = (index * 100) / 2
      }
      this.percentage = 100
    },
    formatData(item) {
      const formated = {}
      this.importHeaders.forEach((header, index) => {
        if (
          this.mappedFields[index] !== '' &&
          this.mappedFields[index] !== undefined
        ) {
          if (
            this.mappedFields[index].includes('amount') ||
            this.mappedFields[index].includes('accrual')
          ) {
            if (isNaN(parseFloat(item[index].replace(/,/g, '')))) {
              formated[this.mappedFields[index]] = 0
            } else {
              formated[this.mappedFields[index]] = parseFloat(
                item[index].replace(/,/g, '')
              )
            }
          } else {
            formated[this.mappedFields[index]] = item[index]
          }
        }
      })
      formated.dups = item['dups'] || 0
      return formated
    },
    async getProject(number) {
      const docs = await db
        .collection('cpm_projects')
        .where('number', '==', number)
        .where('company_nid', '==', this.currentCompany.id)
        .get()
      if (docs.empty) {
        return false
      }
      const project = await Promise.all(
        docs.docs.map(async item => {
          const data = await item.data()
          data.id = item.id

          if (!data.soft_delete && !data.forecasted) {
            return item
          }
        })
      )

      const compactProject = _.compact(project)

      if (!(compactProject || []).length) {
        return false
      }

      return compactProject
    },
    async getCommitment(projectID, number) {
      const snap = await db
        .collection('cpm_projects')
        .doc(projectID)
        .collection('commitments')
        .where('number', '==', number.toString())
        .get()

      if (snap.empty) {
        return false
      }

      return snap.docs
    },
    async getCommitmentLineItems(projectId, commitmentId) {
      const docs = await db
        .collection('cpm_projects')
        .doc(projectId)
        .collection('commitments')
        .doc(commitmentId)
        .collection('line_items')
        .get()
      if (docs.empty) {
        return false
      }
      return await Promise.all(
        docs.docs.map(async item => {
          const data = await item.data()
          return { ...data, id: item.id, ref: item.ref }
        })
      )
    },
    async getCommitmentLineItem(projectID, commitmentID, number) {
      let docs = await db
        .collection('cpm_projects')
        .doc(projectID)
        .collection('commitments')
        .doc(commitmentID)
        .collection('line_items')
        .where('line_number', '==', Number(number))
        .get()
      
      if (docs.empty) {
        docs = await db
          .collection('cpm_projects')
          .doc(projectID)
          .collection('commitments')
          .doc(commitmentID)
          .collection('line_items')
          .where('line_number', '==', String(number))
          .get()
      }
      return docs
    },
    async getSpending(projectID, number) {
      const docs = await db
        .collection('cpm_projects')
        .doc(projectID)
        .collection('spendings')
        .where('number', '==', number)
        .get()
      if (docs.empty) {
        return false
      }
      return await Promise.all(docs.docs.map(async item => item))
    },
    async getSpendingLineItem(projectID, spendingID, formatedData = {}) {
      try {
        const { spendingLineItem_line_number: number } = formatedData

        const docs = await db
          .collection('cpm_projects')
          .doc(projectID)
          .collection('spendings')
          .doc(spendingID)
          .collection('line_items')
          .where('line_number', '==', number.toString())
          .get()

        if (docs.empty) {
          return false
        } else {
          return true
        }
      } catch (e) {
        throw e
      }
    },
    async getSpendingLineItemForShap(projectID, spendingID, formatedData = {}) {
      try {
        const {
          others_uid: api_obj_id,
          others_dist_seq_nbr: dist_seq_nbr
        } = formatedData

        const docs = await db
          .collection('cpm_projects')
          .doc(projectID)
          .collection('spendings')
          .doc(spendingID)
          .collection('line_items')
          .where('api_obj_id', '==', api_obj_id)
          .where('dist_seq_nbr', '==', dist_seq_nbr)
          .get()

        if (docs.empty) {
          return false
        } else {
          return true
        }
      } catch (e) {
        throw e
      }
    },
    async createProject(item) {
      const locationSetting = this.$h.dg(this.companySettings, 'companyLocations', []).find(i => i.code === item.projects_location || i.name === item.projects_location)

      const project = {
        importedId: this.importedId,
        campus: item.projects_campus || '',
        category: item.projects_category || '',
        company_nid: this.currentCompany.id || '',
        contractor: item.projects_contractor || '',
        createdAt: new Date(),
        description: item.projects_description || '',
        endDate: item.projects_endDate || '',
        endDateText: item.projects_end_date_text || '',
        files: item.projects_files || '',
        manager: item.projects_manager || '',
        totalPlanBudget: item.projects_total_plan_budget || '',
        nextChangeNumber: 1,
        nextCommitmentNumber: 1,
        nextInvoiceNumber: 1,
        nextTaskNumber: 1,
        soft_delete: 0,
        number: item.projects_id_number_cpa.toString() || '',
        phase: item.projects_phase || '',
        phaseTargetDate: item.projects_phase_target_date || '',
        phaseTargetDateText: item.projects_phaseTargetDateText || '',
        projectType: item.projects_projectType || '',
        project_invoice_total: item.projects_project_invoice_total || '',
        project_total_open_po_w_tax: item.projects_total_open_po_w_tax || '',
        project_total_po_amount: item.projects_total_po_amount || '',
        projectImage: item.projects_project_image || '',
        proposedSpend: item.projects_proposed_spend || '',
        sameAsCampusAddress: item.projects_same_as_campus_address || '',
        setDefaultSchedule: item.projects_set_default_schedule || '',
        squareFootage: item.projects_square_footage || '',
        standard: item.projects_standard || '',
        startDate: item.projects_start_date || '',
        startDateText: item.projects_start_date_text || '',
        status: item.projects_status || '',
        teamMembers: item.projects_team_members || '',
        title:
          item.projects_title ||
          item.projects_id_number_cpa.toString() ||
          'New Project',
        forecasted: false,
        creator: {},
        createdBy: 'm6works_import_tool',
        spendingsByPeriod: {},
        capitalPlans: [],
        priority: '',
        range: item.projects_range || '',
        priorSpend: item.projects_prior_spend || '',
        basic: {
          cPA: item.projects_id_number_cpa.toString() || '',
          cPACaptial: item.projects_cpa_capital || '',
          cPACapitalWithCont: item.projects_cpa_capital_with_cont || '',
          category1: item.projects_category || '',
          generalContractor: item.projects_general_contractor || '',
          projectManager: item.projects_project_manager || '',
          yTDActualsCapitals: item.projects_ytd_actuals_capitals || '',
          yTDActualsExpenses: item.projects_ytd_actuals_expenses || '',
          location: locationSetting || ''
        },
        schedule: {
          phase: item.schedule_phase || '',
          targetDatePhase: item.schedule_target_date___phase || '',
          constructionStart: item.schedule_construction_start || '',
          anticipatedConstructionFinish:
            item.schedule_anticipated_construction_finish || '',
          completeBudget: item.schedule_complete_budget || '',
          completeSchedule: item.schedule_complete_schedule || '',
          complete: item.schedule_complete_overall || '',
          budgetStatus: item.schedule_budget_status || '',
          totalProjectBudget: item.schedule_total_project_budget || ''
        },
        totals: {
          budgetTotal: 0,
          commitmentTotal: 0,
          spendingTotal: 0,
          budgetContingencyTotal: 0,
          spendingContingencyTotal: 0,
          changesTotal: 0,
          totalAllocated: 0,
          openCommitmentTotal: 0,
          projectFinalCost: 0
        }
      }
      return await db.collection('cpm_projects').add(project)
    },
    async createCommitment(projectID, item) {
      let bc = {}
      if (
        item.others_budget_category_code ||
        item.others_budget_category_name
      ) {
        if (this.budgetCategories.length > 0) {
          // eslint-disable-next-line eqeqeq
          bc = this.budgetCategories.find(
            s => s.code === item.others_budget_category_code
          )

          if (!bc) {
            bc = await this.createBudgetCategory({
              code:
                item.others_budget_category_code ||
                item.others_budget_category_name,
              name:
                item.others_budget_category_name ||
                item.others_budget_category_code
            })
          }
        }
      }
      const newCommitment = {
        importedId: this.importedId,
        company_nid: this.$h.dg(this.currentCompany, 'id', ''),
        number: item.commitments_id_number.toString(),
        total_po_amount: 0,
        total_open_po_w_tax: 0,
        amount: 0,
        invoiceTotal: 0,
        vendors: [
          {
            field_vendor_id_value: '',
            nid: '',
            preferred: '',
            title: item.others_vendor_name || '',
            custom_id: item.others_vendor_code || ''
          }
        ],
        createdAt: new Date(),
        createdBy: 'm6works_import_tool',
        budgetCategory: bc.name || '', // Name
        budget_category: {
          ref: bc.ref || '' // reference
        },
        api_obj_id: item.others_uid || '' // uid
      }

      return new Promise(resolve => {
        const commitment = db
          .collection('cpm_projects')
          .doc(projectID)
          .collection('commitments')
          .add(newCommitment)
        resolve(commitment)
      })
    },
    async createCommitmentLineItem(projectID, commitmentID, item) {
      let startDate = item.commitmentLineItem_start_date
      if (startDate && startDate.length === 7) {
        startDate = '0' + startDate
      }
      const sharpVendor = {
        field_vendor_id_value: item.others_vendor_code || '',
          nid: item.others_vendor_code || '',
          preferred: '',
          title: item.others_vendor_name || '',
          custom_id: item.others_vendor_code || ''
      }
      const newCommitmentLineItem = {
        account: item.commitmentLineItem_account || '',
        accrual: item.commitmentLineItem_accrual || '',
        amount: item.commitmentLineItem_amount || '',
        api_obj_id: item.others_uid || '', // uid,
        company_nid: this.$h.dg(this.currentCompany, 'id', ''),
        cost_per_item: item.commitmentLineItem_cost_per_item || '',
        description: item.commitmentLineItem_description || '',
        description2: item.commitmentLineItem_description_2 || '',
        fiscalYear: item.others_fiscal_year || '',
        importedId: this.importedId,
        isCommitment: true,
        line_number: item.commitmentLineItem_line_number.toString() || '',
        number: item.commitmentLineItem_amount || '',
        open_po_amount: '',
        paidToDateAmount: item.commitmentLineItem_paid_to_date_amount || '',
        period: item.others_period || '',
        po_number: item.commitments_id_number.toString() || '',
        //quantity_amount: item.commitmentLineItem_quantity || 1,
        quantity: item.commitmentLineItem_quantity || '',
        remainingWAccrual: item.commitmentLineItem_remaining_w__accrual || '',
        startDate: startDate ? this.$moment(startDate, 'MMDDYYYY').format('X') * 1000 : '',
        startDateText: startDate ? this.$moment(startDate, 'MMDDYYYY').format('MM/DD/YYYY') : '',
        system_date: item.commitmentLineItem_system_date || '',
        tax_amount: item.commitmentLineItem_tax_amount || '',
        title: item.commitmentLineItem_title || item.commitmentLineItem_description || '',
        total_po_line_amount: item.commitmentLineItem_amount || '',
        vendor: this.isSharp ? sharpVendor : (item.others_vendor_name || ''),
        vendorId: item.others_vendor_code || '',
        wbsElement: item.others_wbs_element || '',
      }
      return new Promise(resolve => {
        const commitment = db
          .collection('cpm_projects')
          .doc(projectID)
          .collection('commitments')
          .doc(commitmentID)
          .collection('line_items')
          .add(newCommitmentLineItem)
        resolve(commitment)
      })
    },
    async createSpending(projectID, item) {
      let bc = {}
      if (
        item.others_budget_category_name ||
        item.others_budget_category_code
      ) {
        bc = this.budgetCategories.find(
          s =>
            s.code ===
            this.$h.dg(item, 'others_budget_category_code', '').trim()
        )
        if (!bc) {
          bc = await this.createBudgetCategory({
            code:
              item.others_budget_category_code ||
              item.others_budget_category_name,
            name:
              item.others_budget_category_name ||
              item.others_budget_category_code
          })
          this.budgetCategories.push(bc)
        }
      }
      let commitmentRef = null
      if (item.spendingLineItem_commitment_id_number) {
        const commitment = await this.getCommitment(
          projectID,
          item.spendingLineItem_commitment_id_number
        )
        if (commitment !== false) {
          commitmentRef = commitment[0].ref
        }
      }

      const gl = {}

      const newSpending = {
        importedId: this.importedId,
        amount: 0,
        budgetCategory: bc.name || '', // Name
        budget_category: {
          ref: bc.ref || '' // reference
        },
        commitment:
          commitmentRef || item.spendingLineItem_commitment_id_number || '',
        contingency: '' || false,
        costCode: '',
        costCodeNumber: '',
        costCodeText: '',
        createdAt: new Date(),
        createdBy: 'm6works_import_tool',
        dateOpenedText: item.spendingLineItem_start_date || '', // for zoetis is start date
        dateOpened: new Date(item.spendingLineItem_start_date).getTime() || '',
        postingDateText: item.spendingLineItem_posted_date || '',
        postingDate: item.spendingLineItem_posted_date || '',
        invoiceTotal: 0,
        number: item.spendings_id_number.toString(),
        paidDateText: item.spendingLineItem_paid_date || '',
        paidDate: new Date(item.spendingLineItem_paid_date).getTime() || '',
        paymentStatus: '',
        po_number: item.spendingLineItem_commitment_id_number || '',
        total_po_amount: 0,
        total_open_po_w_tax: 0,
        company_nid: this.$h.dg(this.currentCompany, 'id', ''),
        glAccount: {
          name: gl.name || '',
          code: gl.code || ''
        },
        vendors: [
          {
            field_vendor_id_value: '',
            nid: '',
            preferred: '',
            title: item.others_vendor_name || '',
            custom_id: item.others_vendor_code || ''
          }
        ],
        api_obj_id: item.others_uid || '' // uid
      }

      return new Promise(resolve => {
        const spending = db
          .collection('cpm_projects')
          .doc(projectID)
          .collection('spendings')
          .add(newSpending)
        resolve(spending)
      })
    },
    async createSpendingLineItem(projectID, spendingID, item) {
      const newSpendingLineItem = {
        isSpending: true,
        company_nid: this.$h.dg(this.currentCompany, 'id', ''),
        importedId: this.importedId,
        createdAt: new Date(),
        createdBy: 'm6works_import_tool',
        client_capital_id: item.client_capital_id || '',
        number: item.spendings_id_number.toString() || '',
        po_number: item.spendingLineItem_commitment_id_number.toString() || '',
        vendor: {
          field_vendor_id_value: item.others_vendor_code || '',
          nid: item.others_vendor_code || '',
          preferred: '',
          title: item.others_vendor_name || '',
          custom_id: item.others_vendor_code || ''
        },
        line_number:
          this.$h.dg(item, 'spendingLineItem_line_number', '').toString() || '',
        line_description: item.spendingLineItem_description || '',
        dateText: item.spendingLineItem_start_date || '',
        date: new Date(item.spendingLineItem_start_date).getTime() || '',
        paidDateText: item.spendingLineItem_paid_date || '',
        paidDate: new Date(item.spendingLineItem_paid_date).getTime() || '',
        updateDateText: '',
        updateDate: '',
        account: item.spendingLineItem_paid_date || '',
        aoc_code: item.spendingLineItem_paid_date || '',
        status: item.spendingLineItem_status || '',
        amount: item.spendingLineItem_amount || 0,
        account_category: item.others_budget_category_code || '',
        cancel_seq: '',
        suffix: '',
        po_code: '',
        dist_company: '',
        dist_acct_unit: '',
        dis_sub_acct: '',
        fiscalYear: item.others_fiscal_year || '',
        period: item.others_period || '',
        api_obj_id: item.others_uid || '', // uid,
        dist_seq_nbr: item.others_dist_seq_nbr || '',
        commitmentLineRef: item.ref || ''
      }

      // Update amount
      const spending = await db
        .collection('cpm_projects')
        .doc(projectID)
        .collection('spendings')
        .doc(spendingID)
        .get()

      const data = spending.data()
      const newAmount =
        data.amount + parseFloat(item.spendingLineItem_amount) || 0
      spending.ref.update({ amount: newAmount })

      return new Promise(resolve => {
        const spendingLineItem = db
          .collection('cpm_projects')
          .doc(projectID)
          .collection('spendings')
          .doc(spendingID)
          .collection('line_items')
          .add(newSpendingLineItem)
        resolve(spendingLineItem)
      })
    },
    async createProjectSpends(projectID, item) {
      if (!item.others_fiscal_year) {
        console.log('FISCAL YEAR MISSING, SKIPPING PROJECT SPENDS')
        return
      }
      const fiscalYears = {}
      if (item.projects_january) {
        fiscalYears.jan = {
          amount: item.projects_january
        }
      }
      if (item.projects_february) {
        fiscalYears.feb = {
          amount: item.projects_february
        }
      }
      if (item.projects_march) {
        fiscalYears.mar = {
          amount: item.projects_march
        }
      }
      if (item.projects_april) {
        fiscalYears.apr = {
          amount: item.projects_april
        }
      }
      if (item.projects_may) {
        fiscalYears.may = {
          amount: item.projects_may
        }
      }
      if (item.projects_june) {
        fiscalYears.jun = {
          amount: item.projects_june
        }
      }
      if (item.projects_july) {
        fiscalYears.jul = {
          amount: item.projects_july
        }
      }
      if (item.projects_august) {
        fiscalYears.aug = {
          amount: item.projects_august
        }
      }
      if (item.projects_september) {
        fiscalYears.sep = {
          amount: item.projects_september
        }
      }
      if (item.projects_october) {
        fiscalYears.oct = {
          amount: item.projects_october
        }
      }
      if (item.projects_november) {
        fiscalYears.nov = {
          amount: item.projects_november
        }
      }
      if (item.projects_december) {
        fiscalYears.dic = {
          amount: item.projects_december
        }
      }
      if (Object.keys(fiscalYears).length > 0) {
        return await db.collection('cpm_projects').doc(projectID).collection('fiscalYears').doc(item.others_fiscal_year).set(fiscalYears, {
          merge: true
        })
      }
    },
    async updateProject(project, item) {
      const locationSetting = this.$h.dg(this.companySettings, 'companyLocations', []).find(i => i.code === item.projects_location || i.name === item.projects_location)

      const proj = {
        ...(item.projects_campus && { campus: item.projects_campus }),
        ...(item.projects_category && { category: item.projects_category }),
        ...(this.currentCompany.id && { company_nid: this.currentCompany.id }),
        ...(item.projects_contractor && {
          contractor: item.projects_contractor
        }),
        ...(item.projects_description && {
          description: item.projects_description
        }),
        ...(item.projects_end_date && { endDate: item.projects_end_date }),
        ...(item.projects_end_date_text && {
          endDateText: item.projects_end_date_text
        }),
        ...(item.projects_files && { files: item.projects_files }),
        ...(item.projects_manager && { manager: item.projects_manager }),
        ...(item.projects_total_plan_budget && {
          totalPlanBudget: item.projects_total_plan_budget
        }),
        ...(item.projects_id_number_cpa && {
          number: item.projects_id_number_cpa + ''
        }),
        ...(item.projects_phase && { phase: item.projects_phase }),
        ...(item.projects_phase_target_date && {
          phaseTargetDate: item.projects_phase_target_date
        }),
        ...(item.projects_phase_target_date_text && {
          phaseTargetDateText: item.projects_phase_target_date_text
        }),
        ...(item.projects_projectType && {
          projectType: item.projects_projectType
        }),
        ...(item.projects_project_invoice_total && {
          project_invoice_total: item.projects_project_invoice_total
        }),
        ...(item.projects_total_open_po_w_tax && {
          project_total_open_po_w_tax: item.projects_total_open_po_w_tax
        }),
        ...(item.projects_total_po_amount && {
          project_total_po_amount: item.projects_total_po_amount
        }),
        ...(item.projects_project_image && {
          projectImage: item.projects_project_image
        }),
        ...(item.projects_proposed_spend && {
          proposedSpend: item.projects_proposed_spend
        }),
        ...(item.projects_same_as_campus_address && {
          sameAsCampusAddress: item.projects_same_as_campus_address
        }),
        ...(item.projects_set_default_schedule && {
          setDefaultSchedule: item.projects_set_default_schedule
        }),
        ...(item.projects_square_footage && {
          squareFootage: item.projects_square_footage
        }),
        ...(item.projects_standard && { standard: item.projects_standard }),
        ...(item.projects_startDate && { startDate: item.projects_startDate }),
        ...(item.projects_start_date_text && {
          startDateText: item.projects_start_date_text
        }),
        ...(item.projects_status && { status: item.projects_status }),
        ...(item.projects_team_members && {
          teamMembers: item.projects_team_members
        }),
        ...(item.projects_range && { range: item.projects_range }),
        ...(item.projects_prior_spend && {
          priorSpend: item.projects_prior_spend
        }),

        basic: {
          cPA: this.$h.dg(item, 'projects_id_number_cpa', '').toString() || project.number || '',
          cPACaptial: item.projects_cpa_capital || project.cPACaptial || '',
          cPACapitalWithCont: item.projects_cpa_capital_with_cont || project.cPACapitalWithCont || '',
          category1: item.projects_category || project.category1 || '',
          generalContractor: item.projects_general_contractor || project.generalContractor || '',
          projectManager: item.projects_project_manager || project.projectManager || '',
          yTDActualsCapitals: item.projects_ytd_actuals_capitals || project.yTDActualsCapitals || '',
          yTDActualsExpenses: item.projects_ytd_actuals_expenses || project.yTDActualsExpenses || '',
          location: locationSetting || ''
        },
        schedule: {
          phase: item.schedule_phase || project.phase || '',
          targetDatePhase: item.schedule_target_date___phase || project.targetDatePhase || '',
          constructionStart: item.schedule_construction_start || project.constructionStart || '',
          anticipatedConstructionFinish: item.schedule_anticipated_construction_finish || project.anticipatedConstructionFinish || '',
          completeBudget: item.schedule_complete_budget || project.completeBudget || '',
          completeSchedule: item.schedule_complete_schedule || project.completeSchedule || '',
          complete: item.schedule_complete_overall || project.complete || '',
          budgetStatus: item.schedule_budget_status || project.budgetStatus || '',
          totalProjectBudget: item.schedule_total_project_budget || project.totalProjectBudget || ''
        },
        title: item.projects_title || this.$h.dg(item, 'projects_id_number_cpa', '').toString() || project.title
      }
      console.log(JSON.stringify(
        proj,
        function (k, v) {
          return v === undefined ? null : v
        },
        3))

      return new Promise((resolve, reject) => {
        try {
          db.collection('cpm_projects')
            .doc(project.id).update(proj).then(
              res => {
                console.log(`Updating Project (${project.id})`)

                resolve(res)
              }
            )
        } catch (e) {
          console.error(e)
          reject(e)
        }
      })
    },
    async getBudgetCategories() {
      const response = await db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('budgets')
        .collection('budget_categories')
        .get()
      const budgetCategories = await Promise.all(
        response.docs.map(async item => {
          const data = await item.data()
          return { id: item.id, ref: item.ref, ...data }
        })
      )
      this.budgetCategories = budgetCategories.filter(
        budgetCategory => budgetCategory.code
      )
    },
    async getProjectSettings() {
      const response = await db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
        .get()

      this.companySettings = await response.data()
    },
    async getGLAccount() {
      const response = await db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('glaccount')
        .get()
      this.glAccountNumbers = await Promise.all(
        response.docs.map(async item => {
          const data = await item.data()
          return data.codes
        })
      )
    },
    async createBudgetCategory(code) {
      const budgetCategoryRef = db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('budgets')
        .collection('budget_categories')

      const newBC = await budgetCategoryRef.add(code)

      return {
        id: newBC.id,
        ref: budgetCategoryRef.doc(newBC.id),
        ...code
      }
    },
    async storeForRevert(type, id, ref) {
      const start = new Date()
      const year = start.getFullYear().toString()
      const month = ('0' + (start.getMonth() + 1)).slice(-2).toString()
      const day = ('0' + start.getDate()).slice(-2).toString()

      db.collection('m6works_imports')
        .doc(year)
        .collection(month)
        .doc(day)
        .collection(type)
        .add({
          id,
          companyID: this.currentCompany.id,
          ref
        })
    },
    async rollBack(type) {
      const start = new Date()
      const year = start.getFullYear().toString()
      const month = ('0' + (start.getMonth() + 1)).slice(-2).toString()
      const day = ('0' + start.getDate()).slice(-2).toString()

      const snap = await db
        .collection('m6works_imports')
        .doc(year)
        .collection(month)
        .doc(day)
        .collection(type)
        .get()
      snap.docs.map(async i => {
        const data = i.data()

        if (data.ref) {
          try {
            const doc = await data.ref.get()
            if (doc.exists) {
              await data.ref.delete()
              await i.ref.delete()
              console.log('deleting')
            } else {
              console.log('DOC DOESNT EXISTS')
              await i.ref.delete()
            }
          } catch (e) {
            console.error(e)
          }
        }
      })
    },
    async deleteZoetisProjects() {
      db.collection('cpm_projects').where('company_nid', '==', '809').get().then(res => {
        res.docs.map(item => {
          console.log(item.ref.delete())
        })
      })
    },
    async checkIfBudgetCategoryExistsInFinancial(financialDoc, item) {
      if (!financialDoc) return

      try {
        const financialData = {
          id: financialDoc.id,
          ref: financialDoc.ref,
          ...financialDoc.data()
        }

        if (!this.$h.dg(financialData, 'budget_category.ref.id')) {
          let bc = null
          if (
            item.others_budget_category_name ||
            item.others_budget_category_code
          ) {
            bc = this.budgetCategories.find(
              s =>
                s.code ===
                this.$h.dg(item, 'others_budget_category_code', '').trim()
            )
            if (!bc) {
              bc = await this.createBudgetCategory({
                code:
                  item.others_budget_category_code ||
                  item.others_budget_category_name,
                name:
                  item.others_budget_category_name ||
                  item.others_budget_category_code
              })
              this.budgetCategories.push(bc)
            }

            await financialDoc.ref.update({
              budget_category: {
                ref: bc.ref
              }
            })
          }
        }
      } catch (e) {
        throw new Error(e)
      }
    },
    async updateCommitmentLineItem(formatedData, checkLineItem) {
      try {
        let startDate = formatedData.commitmentLineItem_start_date

        if (startDate && startDate.length === 7) {
          startDate = '0' + startDate
        }
        await Promise.all(checkLineItem.docs.map(async doc => {
          const sharpVendor = {
            field_vendor_id_value: formatedData.others_vendor_code || '',
            nid: formatedData.others_vendor_code || '',
            preferred: '',
            title: formatedData.others_vendor_name || '',
            custom_id: formatedData.others_vendor_code || ''
          }

          await doc.ref.update({
            amount: formatedData.commitmentLineItem_amount || '',
            company_nid: this.$h.dg(this.currentCompany, 'id', ''),
            cost_per_item: formatedData.commitmentLineItem_cost_per_item || '',
            description: formatedData.commitmentLineItem_description || '',
            importedId: this.importedId,
            isCommitment: true,
            quantity: formatedData.commitmentLineItem_quantity || '',
            tax_amount: formatedData.commitmentLineItem_tax_amount || '',
            total_po_line_amount: formatedData.commitmentLineItem_amount || '',
            vendor: this.isSharp ? sharpVendor : this.$h.dg(formatedData, 'others_vendor_name', ''),
            vendorId: formatedData.others_vendor_code || '',
            startDate: startDate ? this.$moment(startDate, 'MMDDYYYY').format('X') * 1000 : '',
            startDateText: startDate ? this.$moment(startDate, 'MMDDYYYY').format('MM/DD/YYYY') : '',
            system_date: formatedData.commitmentLineItem_system_date || '',
            title: formatedData.commitmentLineItem_title || formatedData.commitmentLineItem_description || '',
          })
        }))
      } catch (e) {
        throw new Error(e)
      }
    },
    updateCommitmentAmounts() {
      this.updatingCommitmentAmounts = true
      const projectIds = _.uniq(this.projectIds)
      let promises = []

      promises.push(projectIds.map(projectId => {
        return this.axios
          .post(`${process.env.VUE_APP_FIREBASE_APIURL}/api/projects/${projectId}/update-commitments`)
      }
      ))
      
      Promise.all(promises)
        .then(() => this.updatingCommitmentAmounts = false)
        .catch(console.error)
    }
  }
}
</script>

<style scoped>
theme--light.v-text-field > .v-input__control > .v-input__slo:before {
  border: 1px solid #000;
}
.select-preset .v-select__slot {
  padding: 5px;
}
.table-headers .table,
.table-headers th,
.table-headers td {
  border: 1px solid #90a4ae !important;
  font-weight: 900;
  white-space: nowrap;
}
.table-headers .v-data-table__wrapper {
  padding-bottom: 4px;
}
.presets-table table {
  display: flex;
}
.preset-row-header {
  min-width: 105px;
}
.preset-row {
  min-width: 230px;
}
</style>

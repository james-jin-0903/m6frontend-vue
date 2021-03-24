<template>
  <v-dialog
    v-model="show"
    persistent
    width="800"
  >
    <v-card class="contract-create-modal rounded-lg">
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">Create Project</span>
      </v-card-title>
      <v-divider class="grey lighten-3" />
      <v-row
        class="elevation-0"
        style="background-color: #0277BD;"
      >
        <v-stepper
          class="elevation-0 w-full"
        >
          <v-stepper-header style="background-color: #0277BD;">
            <v-stepper-step
              :complete="step > 1"
              step="1"
            >
              <template v-slot:default>
                <span :class="firstStepperStyle">
                  Project Information
                </span>
              </template>
            </v-stepper-step>

            <v-divider />
          </v-stepper-header>
        </v-stepper>
      </v-row>
      <v-card-text
        class="vertical-scroll"
        style="height: 60vh;"
      >
        <v-container
          class="rounded-lg"
          fluid
        >
          <v-form ref="cpmCreationFrom">
            <div v-if="step === 1">
              <v-row
                align="center"
                justify="center"
              >
                <v-col cols="3">
                  <div class="font-weight-black subheading">
                    <v-row>
                      <v-col class="align-center d-flex text-nowrap">
                        Project Title
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-text-field
                    v-model="project.title"
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
                        Campus
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-select
                    v-model="project.campus"
                    clearable
                    item-text="name"
                    :items="campusOptions"
                    return-object
                    :rules="campusRules"
                  />
                </v-col>
              </v-row>

              <v-row
                v-if="users && users.projectManager"
                align="center"
                justify="center"
              >
                <v-col cols="3">
                  <div class="font-weight-black subheading">
                    <v-row>
                      <v-col class="align-center d-flex text-nowrap">
                        Project Manager
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-select
                    v-model="project.manager"
                    clearable
                    item-text="label"
                    :items="sortedProjectManager"
                    return-object
                  >
                    <template slot="no-data">
                      type to search users..
                    </template>
                  </v-select>
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
                        Capital Type
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-select
                    v-model="project.capitalType"
                    clearable
                    :items="settings.capitalType"
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
                        Budget Status
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-select
                    v-model="project.status"
                    clearable
                    :items="settings.status"
                    :rules="statusRules"
                    @input="validateBudget"
                  >
                    <template slot="no-data">
                      type to search status..
                    </template>
                  </v-select>
                </v-col>
              </v-row>

              <v-row
                v-if="
                  project.status === 'Forecasted' ||
                    project.status === 'Fully Funded'
                "
                align="center"
                justify="center"
              >
                <v-col cols="3">
                  <div class="font-weight-black subheading">
                    <v-row>
                      <v-col class="shink">
                        Fiscal Year
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-select
                    v-model="project.fiscalYear"
                    clearable
                    item-text="name"
                    :items="settings.fiscalYears"
                    return-object
                    @input="validateBudget"
                  />
                </v-col>
              </v-row>

              <v-row
                v-if="project.fiscalYear"
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
                        v-model="project.startDateText"
                        hint="MM/DD/YYYY format"
                        label="Start Date"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="project.startDate"
                      no-title
                      @change="startDatePicker = false"
                    />
                    <!-- finish the edit modal and hook it up -->
                  </v-menu>
                </v-col>
              </v-row>

              <v-row
                v-if="project.fiscalYear"
                align="center"
                justify="center"
              >
                <v-col cols="3">
                  <div class="font-weight-black subheading">
                    <v-row>
                      <v-col class="align-center d-flex text-nowrap">
                        End Date
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
                        v-model="project.endDateText"
                        hint="MM/DD/YYYY format"
                        label="End Date"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="project.endDate"
                      no-title
                      @input="endDatePicker = false"
                    />
                  </v-menu>
                </v-col>
              </v-row>

              <v-row
                v-if="project.fiscalYear"
                align="center"
                justify="center"
              >
                <v-col cols="10">
                  <h3>Budgets</h3>
                  <v-data-table
                    class="elevation-1"
                    :headers="headers"
                    hide-default-footer
                    :items="budgets"
                  >
                    <template v-slot:items="props">
                      <td>
                        <v-text-field v-model="props.item.title" />
                      </td>
                      <td>
                        <money
                          v-model="props.item.plan"
                          v-bind="money"
                          color="blue"
                        />
                      </td>
                      <td>
                        <v-btn
                          color="red"
                          small
                          text
                          @click="budgets.splice(index, 1)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </template>
                  </v-data-table>

                  <span />
                </v-col>
              </v-row>

              <v-row
                v-if="project.fiscalYear"
                align="center"
                justify="center"
              >
                <v-col cols="3">
                  <div class="font-weight-black subheading">
                    <v-row>
                      <v-col class="align-center d-flex text-nowrap">
                        Total Plan Budget
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <money
                    v-model="totalPlanBudget"
                    v-bind="money"
                    color="blue"
                  />
                </v-col>
              </v-row>
            </div>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col cols="8" />
          <v-col cols="4">
            <v-btn
              text
              @click="$emit('close')"
            >
              Cancel
            </v-btn>
            <v-btn
              color="success"
              @click="create"
            >
              create
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <m6-loading :loading="showLoading" />
  </v-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'
import axios from 'axios'
import { Money } from 'v-money'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'CPMCreate',
  components: {
    money: Money
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ganttsSettings: [],
      campusRules: [v => !!v || 'Campus is required'],
      statusRules: [v => !!v || 'Status is required'],
      step: 1,
      viewPortHeight:
        Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        ) * 0.6,
      showLoading: false,
      settings: {},
      project: {
        startDate: '',
        endDate: '',
        totalPlanBudget: 0
      },
      budgetTotal: 0,
      campusOptions: [],
      startDatePicker: false,
      endDatePicker: false,
      phaseDatePicker: false,
      vendors: [],
      standards: [],
      files: [],
      comments: [],
      users: [],
      roles: [],
      showMsg: false,
      msgText: '',
      msgTitle: '',
      budgets: [],
      serverParams: {
        columnFilters: {},
        sort: {
          field: 'name',
          type: 'asc'
        },
        page: 1,
        paginatilon: false
      },
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '$',
        precision: 2,
        masked: false
      },
      headers: [
        { text: 'Name', value: 'title' },
        { text: 'Budget Plan', value: 'budget_plan' },
        { text: 'Delete', value: 'delete' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      appLabel: 'appLabel'
    }),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    ...mapGetters('Auth', {
      user: 'getUser'
    }),
    sortedProjectManager() {
      let aux = []
        .concat(
          this.$h.dg(this, 'users.projectManager', []),
          this.$h.dg(this, 'users.projectCoordinator', [])
        )
        .flat()
      aux = this.lodash.orderBy(aux, 'label', 'asc')

      return aux
    },

    totalPlanBudget: {
      get() {
        this.project.totalPlanBudget = 0 // eslint-disable-line
        this.budgets.forEach(row => {
          this.project.totalPlanBudget += row.plan // eslint-disable-line
        })
        return this.project.totalPlanBudget
      }
    },
    getViewPortHeight() {
      return `${this.viewPortHeight}px`
    },
    firstStepperStyle() {
      if (this.step === 1) {
        return {
          title: true,
          'white--text': true
        }
      } else {
        return {
          subheading: true,
          'grey--color': true
        }
      }
    },
    secondStepperStyle() {
      if (this.step === 2) {
        return {
          title: true,
          'white--text': true
        }
      } else {
        return {
          subheading: true,
          'grey--color': true
        }
      }
    },
    roleUsers() {
      const aux = []

      if (this.roles && this.roles.roles && this.roles.roles.length > 0) {
        this.roles.roles.map(role => {
          role.users.map(user => {
            const auxObject = {
              role: role.name,
              user: user.label,
              email: user.email,
              label: user.label + ' - ' + role.name,
              color: role.color && role.color.hex ? role.color.hex : '#E0E0E0',
              value: user.value
            }
            if (role.vendorRole) {
              auxObject.vendorRole = role.vendorRole
            }
            if (role.name === 'Project Coordinator') {
              if (!this.users.projectManager) {
                this.users.projectManager = [] // eslint-disable-line
              }
              this.users.projectManager.push(auxObject) // eslint-disable-line
            }
            aux.push(auxObject)
          })
        })
      }

      return aux
    },
    settingCollectionName() {
      if (this.$route.name.includes('forecasting')) {
        return 'planned_settings'
      } else {
        return 'settings'
      }
    }
  },
  watch: {
    'project.fiscalYear'(newVal) {
      this.project.startDate = newVal.startDate
      this.project.startDateText = this.parseDate(newVal.startDate)
      this.project.endDate = newVal.endDate
      this.project.endDateText = this.parseDate(newVal.endDate)
    },

    'project.startDate'(newVal) {
      this.project.startDateText = this.parseDate(newVal)
    },

    'project.endDate'(newVal) {
      this.project.endDateText = this.parseDate(newVal)
    },

    'project.phaseTargetDate'(newVal) {
      this.project.phaseTargetDateText = this.parseDate(newVal)
    },

    async settings() {
      let projectNumber = this.$h.dg(this.settings, 'nextProjectNumber', 0)
      if (!projectNumber) {
        projectNumber = 1
        await db.collection('settings')
          .doc(this.currentCompany.id)
          .collection(`${this.settingCollectionName}`)
          .doc('projects')
          .update({ nextProjectNumber: parseInt(projectNumber) })
      }
      let idString = '00000' + projectNumber
      idString = idString.substr(idString.length - 5)
      const year = new Date().getFullYear()
      this.project.number = `PRJ-${idString}-${year}`

      this.campusOptions = []
      if (this.settings.campus && this.settings.campus.length) {
        this.settings.campus.forEach(cl1 => {
          const itemName = cl1.abbr ? `(${cl1.abbr}) ${cl1.name}` : cl1.name
          this.campusOptions.push({
            item: cl1,
            name: itemName,
            levelName: cl1.name,
            levelAbbr: cl1.abbr,
            level: 1
          })
          if (cl1.lvl_1.length) {
            cl1.lvl_1.forEach(cl2 => {
              let itemL2Name = itemName + ' > '
              itemL2Name += cl2.abbr ? `(${cl2.abbr}) ${cl2.name}` : cl2.name
              this.campusOptions.push({
                item: cl1,
                itemL2: cl2,
                name: itemL2Name,
                levelName: cl2.name,
                levelAbbr: cl2.abbr,
                level: 2
              })
              if (cl2.lvl_2.length) {
                cl2.lvl_2.forEach(cl3 => {
                  let itemL3Name = itemL2Name + ' > '
                  itemL3Name += cl3.abbr
                    ? `(${cl3.abbr}) ${cl3.name}`
                    : cl3.name
                  this.campusOptions.push({
                    item: cl1,
                    itemL2: cl2,
                    itemL3: cl3,
                    name: itemL3Name,
                    levelName: cl3.name,
                    levelAbbr: cl3.abbr,
                    level: 3
                  })
                })
              }
            })
          }
        })

        this.campusOptions.sort((a, b) => a.name.localeCompare(b.name))
      }
    }
  },
  mounted() {
    this.checkCompany('settings')
  },
  methods: {
    async continueFirestore() {
      this.users = await db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('users'),
      this.roles = await db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('roles')
    },
    getAllSettings() {
      Promise.all([
        this.getSettings(),
        // this.getVendors(),
        this.getStandards(),
        this.getGanttSettings()
      ])
    },
    checkCompany(type) {
      const self = this
      setTimeout(function () {
        if (self.currentCompany !== undefined) {
          type == 'firestore' ? self.continueFirestore() : self.getAllSettings()
          self.getAllSettings()
          return true
        } else {
          self.checkCompany()
        }
      }, 500)
    },
    getGanttSettings() {
      return new Promise(async (resolve, reject) => {
        try {
          const snap = await db
            .collection('settings')
            .doc(this.currentCompany.id)
            .collection(`${this.settingCollectionName}`)
            .doc(this.appLabel.settingsCollection)
            .get()
          this.ganttsSettings = this.$h.dg(snap.data(), 'gantts', {})
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    validateBudget() {
      this.budgets = []
      if (this.project.status === 'Forecasted' && this.project.fiscalYear) {
        let found = false
        this.project.startDate = this.project.fiscalYear.startDate
        this.settings.fiscalYears.forEach(row => {
          if (
            this.budgets.length < 5 &&
            (found || row.value === this.project.fiscalYear.value)
          ) {
            this.budgets.push({
              title: row.name,
              fyType: row,
              plan: 0,
              active: true,
              createdAt: new Date()
            })
            found = true
          }
        })
      }
    },
    getSettings() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          const snap = await db
            .collection('settings')
            .doc(this.currentCompany.id.toString())
            .collection(`${this.settingCollectionName}`)
            .doc('projects')
            .get()
          this.settings = snap.data() || {}
          this.settings.phases = this.lodash.sortBy(this.settings.phases)
          this.project.standard = this.settings.defaultStandard

          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },

    parseDate(date) {
      if (!date) return ''
      const newDate = new Date(date)
      newDate.setDate(newDate.getDate() + 1)
      return `${newDate.getMonth() +
        1}/${newDate.getDate()}/${newDate.getFullYear()}`
    },

    // getVendors() {
    //   const aux = new Promise(async (resolve, reject) => {
    //     try {
    //       const response = await axios.post(
    //         `/vendor_profiles_o/all/${this.serverParams.page - 1}`,
    //         this.serverParams
    //       )
    //       if (response.data.result) {
    //         if (response.data.result) {
    //           this.vendors = response.data.result
    //         }
    //       }

    //       resolve(true)
    //     } catch (error) {
    //       reject(error)
    //     }
    //   })
    //   return aux
    // },
    getStandards() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          const rows = await db
            .collection('standards')
            .where('active', '==', true)
            .get()

          for (const index in rows.docs) {
            const data = rows.docs[index].data()
            const row = {
              id: rows.docs[index].id,
              number: data.number,
              name: data.title,
              type: data.type,
              files: data.files,
              campus: data.campus,
              notes: data.notes,
              exhibit: data.exhibit,
              createdAt: '',
              updatedAt: '',
              version: data.version
            }
            this.standards.push(row)
          }

          return true
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },

    getStyleRoleUser(option) {
      return {
        'background-color': option.color,
        'font-size': '10px'
      }
    },
    getCreator() {
      const user = {}
      user.label = this.user.firstName + ' ' + this.user.lastName
      user.value = this.user.id
      return user
    },
    async create() {
      if (this.project.startDate) {
        this.project.startDate = new Date(this.project.startDate).toISOString()
      }

      if (this.project.endDate) {
        this.project.endDate = new Date(this.project.endDate).toISOString()
      }

      if (this.$refs.cpmCreationFrom.validate()) {
        // formIsValid
        this.showLoading = true

        /*
            DELETE THIS AFTER FIXING PROJECTS
          */
        if (!this.project.files) {
          this.project.files = [
            {
              name: 'Project Information',
              path: '/project_information',
              children: [
                {
                  name: 'Bidding',
                  path: '/project_information/bidding',
                  children: []
                },
                {
                  name: 'Closeout',
                  path: '/project_information/closeout',
                  children: []
                },
                {
                  name: 'Correspondence',
                  path: '/project_information/correspondence',
                  children: []
                },
                {
                  name: 'Directory',
                  path: '/project_information/directory',
                  children: []
                },
                {
                  name: 'Feasibility Study or Expenditure Request',
                  path: '/project_information/feasibility',
                  children: []
                },
                {
                  name: 'Meetings',
                  path: '/project_information/meetings',
                  children: []
                },
                {
                  name: 'Schedules',
                  path: '/project_information/schedules',
                  children: []
                },
                {
                  name: 'Start up and Kick off',
                  path: '/project_information/start_kick',
                  children: []
                },
                {
                  name: 'Vendor Info and Badge',
                  path: '/project_information/vendor_info',
                  children: []
                }
              ]
            },
            {
              name: 'Project Finance',
              path: '/project_finance',
              children: [
                {
                  name: 'Budget Worksheet',
                  path: '/project_finance/budget_worksheet',
                  children: []
                },
                {
                  name: 'Bulletins',
                  path: '/project_finance/bulletins',
                  children: []
                },
                {
                  name: 'Buyouts',
                  path: '/project_finance/buyouts',
                  children: []
                },
                {
                  name: 'CER and CIP',
                  path: '/project_finance/cer_cip',
                  children: []
                },
                {
                  name: 'Change Orders',
                  path: '/project_finance/change_orders',
                  children: []
                },
                {
                  name: 'Contracts',
                  path: '/project_finance/contracts',
                  children: []
                },
                {
                  name: 'Invoices',
                  path: '/project_finance/invoices',
                  children: []
                },
                {
                  name: 'Liens',
                  path: '/project_finance/liens',
                  children: []
                },
                {
                  name: 'LOI',
                  path: '/project_finance/loi',
                  children: []
                },
                {
                  name: 'PO',
                  path: '/project_finance/po',
                  children: []
                },
                {
                  name: 'Prelim Notices',
                  path: '/project_finance/prelim_notices',
                  children: []
                },
                {
                  name: 'Proposals',
                  path: '/project_finance/proposals',
                  children: []
                }
              ]
            },
            {
              name: 'Drawings and Specifications',
              path: '/drawings_specs',
              children: [
                {
                  name: 'CAD',
                  path: '/drawing_specs/cad',
                  children: []
                },
                {
                  name: 'Permit Set',
                  path: '/drawing_specs/permit_set',
                  children: []
                },
                {
                  name: 'Record Set',
                  path: '/drawing_specs/record_set',
                  children: []
                },
                {
                  name: 'Schematic',
                  path: '/drawing_specs/schematic',
                  children: []
                },
                {
                  name: 'Working Set',
                  path: '/drawing_specs/working_set',
                  children: []
                }
              ]
            },
            {
              name: 'Agency',
              path: '/agency',
              children: [
                {
                  name: 'Applications',
                  path: '/agency/applications',
                  children: []
                },
                {
                  name: 'CDPH',
                  path: '/agency/cdph',
                  children: []
                },
                {
                  name: 'City',
                  path: '/agency/city',
                  children: []
                },
                {
                  name: 'MOU',
                  path: '/agency/mou',
                  children: []
                },
                {
                  name: 'OSHPD',
                  path: '/agency/oshpd',
                  children: []
                }
              ]
            },
            {
              name: 'Construction Administration',
              path: '/construction_admin',
              children: [
                {
                  name: 'ACD',
                  path: '/construction_admin/acd',
                  children: []
                },
                {
                  name: 'Commissioning',
                  path: '/construction_admin/commissioning',
                  children: []
                },
                {
                  name: 'IOR Files',
                  path: '/construction_admin/ior_files',
                  children: []
                },
                {
                  name: 'MOP',
                  path: '/construction_admin/mop',
                  children: []
                },
                {
                  name: 'ICRA, ILSM and PCRA',
                  path: '/construction_admin/pcra_icra',
                  children: []
                },
                {
                  name: 'Photos',
                  path: '/construction_admin/photos',
                  children: []
                },
                {
                  name: 'RFI',
                  path: '/construction_admin/rfi',
                  children: []
                },
                {
                  name: 'Submittal',
                  path: '/construction_admin/submittal',
                  children: []
                }
              ]
            }
          ]
        }

        const project = {
          campus: this.project.campus || '',
          category: this.project.category || '',
          company_nid: this.currentCompany.id || '',
          contractor: this.project.contractor || '',
          createdAt: new Date(),
          description: this.project.description || '',
          endDate: this.project.endDate || '',
          endDateText: this.project.endDateText || '',
          files: this.project.files || '',
          manager: this.project.manager || '',
          totalPlanBudget: this.project.totalPlanBudget || '',
          nextChangeNumber: 1,
          nextCommitmentNumber: 1,
          nextInvoiceNumber: 1,
          nextTaskNumber: 1,
          soft_delete: 0,
          number: this.project.number || '',
          phase: this.project.phase || '',
          phaseTargetDate: this.project.phaseTargetDate || '',
          phaseTargetDateText: this.project.phaseTargetDateText || '',
          projectType: this.project.projectType || '',
          project_invoice_total: this.project.project_invoice_total || '',
          project_total_open_po_w_tax:
            this.project.project_total_open_po_w_tax || '',
          project_total_po_amount: this.project.project_total_po_amount || '',
          projectImage: this.project.projectImage || '',
          proposedSpend: this.project.proposedSpend || '',
          sameAsCampusAddress: this.project.sameAsCampusAddress || '',
          setDefaultSchedule: this.project.setDefaultSchedule || '',
          squareFootage: this.project.squareFootage || '',
          standard: this.project.standard || '',
          startDate: this.project.startDate || '',
          startDateText: this.project.startDateText || '',
          status: this.project.status || '',
          teamMembers: this.project.teamMembers || '',
          title: this.project.title || '',
          forecasted: this.$route.name.includes('forecasting'),
          creator: this.getCreator(),
          spendingsByPeriod: {},
          capitalPlans: [],
          priority: '',
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
          },
          searchTerms: this.getSearchTerms()
        }

        if (project.forecasted && this.ganttsSettings) {
          const forecasted = this.ganttsSettings.find(
            row => row.value === 'forecasted'
          )
          if (forecasted) {
            project.selectedGantt = forecasted
          }
        }
        await db.collection('cpm_projects')
          .add(project)
          .then(doc => {
            this.project.id = doc.id
            this.updateNextProjectNumber()
            if (project.forecasted) {
              const reference = db
                .collection('cpm_projects')
                .doc(this.project.id)
                .collection('budgets')

              this.budgets.map(item => {
                const prepareBudget = {
                  title: item.title,
                  fyType: item.fyType,
                  plan: item.plan,
                  active: true,
                  createdAt: new Date()
                }
                reference.add(prepareBudget)
              })
            }
            this.showLoading = false
            this.$snotify.success('The Project has been created', 'Success')

            if (project.forecasted) {
              this.$router.push({
                name: 'cpm.forecasting.show',
                params: { id: doc.id }
              })
            } else {
              this.$router.push({
                name: 'cpm.projects.show',
                params: { id: doc.id }
              })
            }
            this.$router.replace('/cpm/' + doc.id)
          })
          .catch(error => {
            console.error(error)
            this.$emit('close')
            this.$snotify.error('There was an error while saving', 'Error')
            return
          })
      } else {
        this.$snotify.error('please fill all required fields', 'Error')
      }
    },
    async updateNextProjectNumber() {
      let currentNumber = this.$h.dg(this.settings, 'nextProjectNumber', 0)
      const nextProjectNumber = ++currentNumber
      await db.collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('projects')
        .update({ nextProjectNumber })
        .catch(console.error)
    }
  },
  getSearchTerms() {
    const searchTerms = (this.project.title || '').toLowerCase().split(' ')
    searchTerms.push(this.project.number)

    return searchTerms
  },
  async firestore() {
    this.checkCompany('firestore')
    return true
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

.contract-create-modal {
  .title {
    padding: 0;
    margin: 0;
  }
  .v-card__title {
    padding: 10px;
    background: #0277bd;
    color: #fff;

    h3 {
      font-weight: 100;
    }
  }
}
</style>

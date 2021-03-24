<template>
  <v-dialog
    v-model="dialog"
    max-width="1000px"
    persistent
    scrollable
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">
          Capital Plan
        </span>
      </v-card-title>
      <v-divider class="grey lighten-3" />
      <v-card-text class="vertical-scroll">
        <v-container
          class="pa-0 rounded-lg"
          fluid
          grid-list-md
        >
          <v-row>
            <v-col
              md="6"
              sm="12"
            >
              <v-text-field
                v-model="capitalPlan.name"
                label="Capital Plan Name"
              />
            </v-col>
            <v-col
              md="6"
              sm="12"
            >
              <v-select
                v-model="capitalPlan.fiscalYear"
                :hint="getHintFiscalYear()"
                item-text="name"
                :items="settingsProject.fiscalYears"
                label="Fiscal Year"
                persistent-hint
                return-object
              />
            </v-col>
          </v-row>
          <v-row>
            <v-spacer />
            <v-col md="3">
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search project"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              md="6"
              sm="12"
            >
              <v-container
                class="pa-0 rounded-lg"
                fluid
                grid-list-md
              >
                <v-row>
                  <v-col md="12">
                    Projects Added
                  </v-col>
                  <v-col md="12">
                    <v-data-table
                      :headers="headers"
                      :items="capitalPlan.projects"
                      :search="search"
                    >
                      <template
                        slot="items"
                        slot-scope="props"
                      >
                        <td>{{ props.item.title }}</td>
                        <td>
                          <v-btn
                            color="primary"
                            icon
                            @click="removeCapital(props.item)"
                          >
                            <v-icon>mdi-arrow-right-thick</v-icon>
                          </v-btn>
                        </td>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>

            <v-col
              md="6"
              sm="12"
            >
              <v-container
                class="pa-0 rounded-lg"
                fluid
                grid-list-md
              >
                <v-row>
                  <v-col md="12">
                    Projects
                  </v-col>
                  <v-col md="12">
                    <v-data-table
                      :headers="headers"
                      :items="filteredProjects"
                      :search="search"
                    >
                      <template
                        slot="items"
                        slot-scope="props"
                      >
                        <td>{{ props.item.title }}</td>
                        <td>
                          <v-btn
                            color="primary"
                            icon
                            @click="addCapitalPlan(props.item)"
                          >
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </td>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :loading="loading"
          text
          @click="closeCapital"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          @click="saveCapital"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'
import moment from 'moment'
import { getPeriods } from '../panels/Helpers/Helpers'
import CashFlow from '../panels/Helpers/CashFlow'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      allProjects: [],
      headers: [
        { text: 'Title', value: 'title' },
        { text: 'Actions', value: 'actions' }
      ],
      userId: Drupal.settings.m6_platform.uid,
      search: '',
      dialog: true,
      capitalPlan: {
        name: '',
        projects: [],
        startDate: '',
        endDate: '',
        fiscalYear: {}
      },
      loading: false,
      startDatePlanModal: false,
      endDatePlanModal: false,
      projectAccess: {},
      projectRoles: {},
      user: {},
      settingsProject: {
        fiscalYears: []
      },
      settingsUsers: {}
    }
  },
  firestore() {
    return {
      projectAccess: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('users'),

      projectRoles: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('roles'),

      user: db.collection('m6user').doc(this.userId),

      settingsProject: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects'),

      settingsUsers: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('users')
    }
  },
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    filteredProjects() {
      if (this.capitalPlan.projects && this.capitalPlan.projects.length <= 0) {
        return this.allProjects
      } else {
        return this.allProjects.filter(project => {
          const index = this.capitalPlan.projects.findIndex(auxProject => project.id == auxProject.id)

          if (index > -1) {
            return false
          }
          return true
        })
      }
    }
  },
  async mounted() {
    await this.getProjects()
  },
  methods: {
    getHintFiscalYear() {
      if (this.capitalPlan.fiscalYear && this.capitalPlan.fiscalYear.startDate && this.capitalPlan.fiscalYear.endDate) {
        return 'Start Date:' + this.capitalPlan.fiscalYear.startDate + ' End Date:' + this.capitalPlan.fiscalYear.endDate
      }
      return ''
    },
    closeCapital() {
      this.$emit('close')
    },
    addCapitalRefToTheProjects(capitalPlanId) {
      const aux = new Promise(async (resolve, reject) => {
        try {
          await Promise.all(this.capitalPlan.projects.map(async project => {
            const capitalPlans = project.capitalPlans ? project.capitalPlans : []

            capitalPlans.push(db.collection('cpm_capital_plan').doc(capitalPlanId))
            await db.collection('cpm_projects').doc(project.id).update({
              capitalPlans: capitalPlans
            })
          }))
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    getProjectRefs() {
      if (this.capitalPlan.projects.length <= 0) {
        return []
      }
      const refs = []

      this.capitalPlan.projects.forEach(element => {
        refs.push(db.collection('cpm_projects').doc(element.id))
      })

      return refs
    },
    addCapitalPlan(item) {
      this.capitalPlan.projects.push(item)
    },
    saveCapital() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          if (this.capitalPlan.name == '') {
            this.$snotify.error(
              'Please add a Capital Name',
              'Error'
            )
            resolve(true)
            return
          }
          if (!this.capitalPlan.fiscalYear.value || this.capitalPlan.fiscalYear.value == '') {
            this.$snotify.error(
              'Please select a fiscal year',
              'Error'
            )
            resolve(true)
            return
          }

          this.loading = true


          // Initializing data projects in the forecasts capital plan
          const forecasts = {}
          const currentMonth = moment().format('YYYY-MM')
          const cashFlow = new CashFlow(forecasts, this.capitalPlan.projects, getPeriods(this.capitalPlan.fiscalYear), [], currentMonth)
          cashFlow.reset()


          const capitalPlan = {
            name: this.capitalPlan.name,
            fiscalYear: this.capitalPlan.fiscalYear,
            projects: this.getProjectRefs(),
            forecasts: forecasts
          }

          const snap = await db.collection('cpm_capital_plan').add(capitalPlan)
          const capitalPlanId = snap.id

          await this.addCapitalRefToTheProjects(capitalPlanId)

          this.loading = false
          this.closeCapital()
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    removeCapital(item) {
      const projectIndex = this.capitalPlan.projects.findIndex(project => project.id == item.id)

      this.capitalPlan.projects.splice(projectIndex, 1)
    },
    getProjects() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          const snap = await db.collection('cpm_projects').get()

          if (snap.empty) {
            resolve(true)
          }

          snap.docs.forEach(doc => {
            const project = doc.data()
            project.id = doc.id

            // checking for allowing projects
            if (
              this.canView(project) &&
              (!project.soft_delete || project.soft_delete != 1)
            ) {
              this.allProjects.push(project)
            }
          })
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    getCapitalPlan() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          const snap = await db
            .collection('capital_plan')
            .doc(this.capitalPlanId)
            .get()
          if (!snap.exists) {
            reject(new Error('Capital plan not found'))
          }

          const capitalPlan = snap.data()

          const projects = []
          // the projects are ref
          await Promise.all(
            capitalPlan.projects.map(ref => {
              const snapProject = ref.get()
              if (snapProject.exists) {
                const project = snapProject.data()
                project.id = snapProject.id
                projects.push(project)
              }
            })
          )

          this.capitalPlan = capitalPlan
          this.capitalPlan.projects = projects

          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },

    canView(project) {
      if (project.creator && project.creator.value == this.userId) {
        return true
      }

      if (this.findProjectAccess(this.userId)) {
        return true
      }
      if (this.findProjectRolMember(this.userId, project)) {
        return true
      }

      return false
    },
    findProjectAccess(userId) {
      if (
        this.projectAccess &&
        this.projectAccess.projectManager &&
        this.projectRoles &&
        this.projectRoles.roles
      ) {
        const projectManager = this.projectAccess.projectManager.find(manager => manager.value === userId)

        if (projectManager) {
          return true
        }

        const projectRoles = this.projectRoles.roles.find(role => role.name == 'Project Coordinator')
        let projectCoordinator = undefined
        if (projectRoles && projectRoles.users) {
          projectCoordinator = projectRoles.users.find(coordinator => coordinator.value === userId)
        }

        return projectCoordinator != undefined
      } else {
        // it is vendor - figure this one out later
        if (Drupal.settings.m6_platform_header.isVendorMember) {
          return true
        } else {
          return false // should be false, but simulating vendor
        }
      }
    },
    findProjectRolMember(userId, project) {
      if (project.manager && project.manager.value) {
        const isManager = project.manager.value == userId
        if (isManager) {
          return true
        }
      }
      if (project.teamMembers && project.teamMembers.length > 0) {
        const isTeamMember = project.teamMembers.find(member => {
          if (typeof member === 'string') {
            return member == userId
          } else {
            return member.value == userId
          }
        })

        if (isTeamMember) {
          return true
        }
      }

      return false
    }
  }
}
</script>

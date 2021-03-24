<template>
  <m6-card-dialog title="Projects">
    <v-card-text class="vertical-scroll">
      <v-container
        class="pa-0 rounded-lg"
        fluid
        grid-list-md
      >
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
        color="primary"
        :loading="loading"
        @click="saveCapital"
      >
        Save
      </v-btn>
    </v-card-actions>
  </m6-card-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'
import CashFlow from './Helpers/CashFlow'
import { getPeriods } from './Helpers/Helpers'
import moment from 'moment'
import Eventbus from '../../../../Eventbus'
import { mapState } from 'vuex'

export default {
  name: 'ProjectsSection',
  data() {
    const capitalPlanId = this.$route.params.id
    return {
      capitalPlanId: capitalPlanId,
      allProjects: [],
      headers: [
        { text: 'Title', value: 'title' },
        { text: 'Actions', value: 'actions' }
      ],
      search: '',
      dialog: true,
      capitalPlan: {
        name: '',
        projects: []
      },
      loading: false,
      projectAccess: {},
      projectRoles: {},
      user: {},
      settingsProject: {},
      settingsUsers: {},
      userId: Drupal.settings.m6_platform.uid,

      deletedProjects: []
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
    await Promise.all([this.getProjects(), this.getCapitalPlan()])
  },
  methods: {
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

      if (this.deletedProjects.length > 0) {
        const index = this.deletedProjects.findIndex(project => project.id == item['_id'])

        if (index > -1) {
          // deleting from to deleted projects
          this.deletedProjects.splice(index, 1)
        }
      }
    },
    addCapitalRefToTheProjects() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          await Promise.all(
            this.capitalPlan.projects.map(async project => {
              const snap = await db
                .collection('cpm_projects')
                .doc(project.id)
                .get()

              if (snap.exists) {
                const auxProject = snap.data()
                const capitalPlans = auxProject.capitalPlans
                  ? auxProject.capitalPlans
                  : []

                const find = capitalPlans.findIndex(capitalPlan => capitalPlan.id == this.capitalPlanId)

                if (find == -1) {
                  capitalPlans.push(
                    db.collection('cpm_capital_plan').doc(this.capitalPlanId)
                  )
                  await db
                    .collection('cpm_projects')
                    .doc(project.id)
                    .update({
                      capitalPlans: capitalPlans
                    })
                }
              }
            })
          )
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    deleteCapitalRefFromTheProjects() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          await Promise.all(
            this.deletedProjects.map(async project => {
              const snap = await db
                .collection('cpm_projects')
                .doc(project.id)
                .get()

              if (snap.exists) {
                const auxProject = snap.data()
                const capitalPlans = auxProject.capitalPlans

                const find = capitalPlans.findIndex(capitalPlan => capitalPlan.id == this.capitalPlanId)

                if (find > -1) {
                  capitalPlans.splice(find, 1)
                  await db
                    .collection('cpm_projects')
                    .doc(project.id)
                    .update({
                      capitalPlans: capitalPlans
                    })
                }
              }
            })
          )
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    updateCapitalProjects() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          const snap = await db
            .collection('cpm_capital_plan')
            .doc(this.capitalPlanId)
            .get()
          const capitalPlan = snap.data()

          const forecasts = capitalPlan.forecasts
          const newForecasts = {}
          const initializeProjects = []
          // saving keys of the projects that are already set
          this.capitalPlan.projects.forEach(element => {
            if (forecasts[element.id]) {
              newForecasts[element.id] = forecasts[element.id]
            } else {
              // add to projects to initialize data
              initializeProjects.push(element)
            }
          })

          const currentMonth = moment().format('YYYY-MM')
          // Initializing data projects that are not in the capital plan
          const cashFlow = new CashFlow(
            newForecasts,
            initializeProjects,
            getPeriods(capitalPlan.fiscalYear),
            [],
            currentMonth
          )
          cashFlow.reset()

          // Updating capital projects
          await db
            .collection('cpm_capital_plan')
            .doc(this.capitalPlanId)
            .update({
              projects: this.getProjectRefs(),
              forecasts: newForecasts
            })

          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    saveCapital() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          this.loading = true

          await Promise.all([
            this.addCapitalRefToTheProjects(),
            this.deleteCapitalRefFromTheProjects(),
            this.updateCapitalProjects()
          ])

          this.$snotify.success(
            'The Capital Plan Project\'s has been updated',
            'Success'
          )
          this.loading = false

          this.$emit('refresh-projects')
          Eventbus.$emit('show-projects-capital-plan', false)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    removeCapital(item) {
      const projectIndex = this.capitalPlan.projects.findIndex(project => project.id == item.id)

      // Adding to deleted projects
      this.deletedProjects.push(item)

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
            .collection('cpm_capital_plan')
            .doc(this.capitalPlanId)
            .get()
          if (!snap.exists) {
            reject(new Error('Capital plan not found'))
          }

          const capitalPlan = snap.data()

          const projects = []
          // the projects are ref
          await Promise.all(
            capitalPlan.projects.map(async ref => {
              const snapProject = await ref.get()
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

<template>
  <v-container
    class="rounded-lg"
    fluid
  >
    <m6-list
      class="fluid grid-list-xl it-apps-index"
      label="Search"
      :loading="loading"
      :on-input-search="updateSearch"
      :search="search"
      :without-results="capitalPlansComputed && !capitalPlansComputed.length"
    >
      <template v-slot:before:search>
        <v-col class="shrink">
          <v-btn
            color="#0277BD"
            dark
            fab
            small
            @click="showCreateModal = true"
          >
            <v-icon light>
              mdi-plus
            </v-icon>
          </v-btn>
        </v-col>
      </template>


      <template v-slot:after:search:btn>
        <v-col class="shrink">
          <v-select
            v-model="view"
            :items="views"
            label="View"
            return-object
          >
            <template
              slot="selection"
              slot-scope="{ item }"
            >
              <v-icon>{{ item.icon }}</v-icon>
              {{ item.label }}
            </template>
            <template
              slot="item"
              slot-scope="{ item }"
            >
              <v-icon>{{ item.icon }}</v-icon>
              {{ item.label }}
            </template>
          </v-select>
        </v-col>
      </template>

      <!--GRID VIEW-->
      <v-row
        v-if="view.val == 'grid_view'"
      >
        <v-col
          v-for="(proj, indexR) in capitalsPlanPaginated"
          :key="indexR"
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <v-card
            class="cpmCard pointer"
            @mouseleave="showDeleteIconApplication = null"
            @mouseover="showDeleteIconApplication = indexR"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="showDeleteIconApplication === indexR"
                  absolute
                  class="deleteBtn"
                  color="red"
                  dark
                  fab
                  small
                  v-on="on"
                  @click="deleteCapitalPlan(proj)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Delete Project</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <a
                  href="#"
                  target="_blank"
                  @click.prevent="goToCapital(proj, true)"
                >
                  <v-btn
                    v-if="showDeleteIconApplication === indexR"
                    absolute
                    class="newTabBtn"
                    color="purple"
                    fab
                    small
                    v-on="on"
                  >
                    <v-icon>mdi-folder-plus</v-icon>
                  </v-btn>
                </a>
              </template>
              <span>Open in new tab</span>
            </v-tooltip>

            <v-col
              class="text-center"
              cols="12"
              @click="goToCapital(proj, false)"
            >
              <v-row class="justify-center pt-3">
                <v-badge>
                  <v-avatar
                    color="grey lighten-4"
                    size="100"
                  >
                    <img
                      v-if="proj.projectImage"
                      :src="proj.projectImage"
                    >
                    <v-icon
                      v-else
                      size="100"
                    >
                      mdi-image
                    </v-icon>
                  </v-avatar>
                </v-badge>
              </v-row>
            </v-col>

            <v-card-text
              class="vertical-scroll"
              @click="goToCapital(proj, false)"
            >
              <div class="mb-2 text-center">
                <p
                  class="font-weight-bold headline"
                  v-text="proj.name"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row
        v-if="
          view.val == 'view_list' || (view.val == 'favorites_view' && favorites)
        "
      >
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="capitalPlansComputed"
            :pagination.sync="pagination"
            :search="search"
          >
            <template
              slot="items"
              slot-scope="props"
            >
              <td class="pa-1 text-center">
                <v-avatar :color="props.item.projectImage ? '' : 'indigo'">
                  <img
                    v-if="props.item.projectImage"
                    :src="props.item.projectImage"
                  >
                  <v-icon
                    v-else
                    dark
                  >
                    mdi-wallpaper
                  </v-icon>
                </v-avatar>
              </td>
              <td>
                <a
                  href="#"
                  @click.prevent="goToCapital(props.item, false)"
                >
                  <span class="blue--text text--lighten-1">{{ props.item.name }}</span>
                </a>
              </td>
              <td class="text-center">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      class="pointer"
                      small
                      v-on="on"
                      @click="goToCapital(props.item, false)"
                    >
                      mdi-pencil
                    </v-icon>
                  </template>
                  <span>Edit</span>
                </v-tooltip>

                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      v-if="props.item.canDelete != false"
                      class="pointer"
                      small
                      v-on="on"
                      @click="deleteCapitalPlan(props.item)"
                    >
                      delete
                    </v-icon>
                  </template>
                  <span>Delete</span>
                </v-tooltip>
              </td>
            </template>
            <v-alert
              slot="no-results"
              color="red lighten-3"
              icon="warning"
              :value="true"
            >
              Your search for "{{ search }}" found no results.
            </v-alert>
          </v-data-table>
        </v-col>
      </v-row>
    </m6-list>

    <!--PAGINATION-->
    <v-row
      v-if="view.val == 'grid_view'"
      justify="center"
    >
      <v-col
        class="text-center"
        cols="8"
      >
        <v-pagination
          v-model="page"
          :length="paginationLength"
          total-visible="10"
        />
        <p>
          Displaying:
          <strong>
            {{ startPage + 1 }} -
            {{ endPage > listLenght ? listLenght : endPage }}
          </strong>
          of
          <strong>{{ listLenght }}</strong>
        </p>
      </v-col>
    </v-row>

    <capital-dialog
      v-if="showCreateModal"
      @close="closeCapitalDialog"
    />


    <m6-loading
      :loading="loading"
      :show-time="true"
    />
    <m6-confirm-delete
      message="Are you sure you want to permanently remove this Capital Plan?"
      :show="showDeleteModal"
      title="Delete Capital Plan"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />
  </v-container>
</template>

<script>
import { db } from '@/utils/Firebase'
import { format } from 'date-fns'
import CapitalPlan from './modals/CapitalPlanAdd'
import ListFiltering from '../projects/modals/ListFiltering'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'List',
  components: {
    'capital-dialog': CapitalPlan,
    'list-filtering': ListFiltering
  },
  props: {
    type: {
      type: String,
      default: 'all'
    }
  },
  data: () => ({
    milestoneOptions: {
      RFP: 'RFP Date',
      'Board Approval': 'Board Approval',
      'Kick-Off': 'Project Kick-Off'
    },
    mileStones: {},
    budgets: {},
    images: {},
    defaultImage: '/sites/all/themes/m6connect/images/default_userpdf.png',
    user: {},
    favorites: [],
    loading: false,
    firstTime: true,
    showDeleteIconApplication: null,
    resources: [],
    userId: Drupal.settings.m6_platform.uid,
    projectAccess: [],
    favoritesData: {},
    projectRoles: [],
    searchOption: 'All',
    campusOption: 'All',
    pmOption: 'All',
    search: '',
    view: { label: 'Grid', val: 'grid_view', icon: 'mdi-view-module' },
    views: [
      { label: 'Grid', val: 'grid_view', icon: 'mdi-view-module' },
      { label: 'Table', val: 'view_list', icon: 'mdi-view-list' },
      { label: 'Favorites', val: 'favorites_view', icon: 'mdi-heart' }
    ],
    headers: [
      { text: '', value: 'picture' },
      { text: 'Capital Plan Name', value: 'name' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    pagination: { sortBy: 'number', descending: false, rowsPerPage: 10 },
    page: 1,
    settingsProject: {},
    settingsUsers: {},
    showCreateModal: false,
    capitalPlanDelete: {},
    showDeleteModal: false,
    axiosSettings: {
      baseUrl: Drupal.settings.m6_platform.f_base.functions.api_url,
      config: {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      }
    },
    capitalPlans: []
  }),
  computed: {
    ...mapGetters({
      projects: 'cpmProjects'
    }),

    gettingBudget() {
      return id => {
        const budgetsFiltered = this.budgets[id].filter((b, index) => index < 5)
        if (budgetsFiltered.length < 5) {
          const missing = 5 - budgetsFiltered.length
          for (let x = 0; x < missing; x++) {
            budgetsFiltered.push({})
          }
        }

        return budgetsFiltered
      }
    },
    capitalsPlanPaginated() {
      return this.capitalPlansComputed.filter(
        (item, index) => index >= this.startPage && index < this.endPage
      )
    },
    capitalPlansComputed() {
      let capitalPlanAux = []
      capitalPlanAux = this.capitalPlans.filter(capitalPlan => {
        if (this.search == '') {
          return true
        } else {
          const name = capitalPlan.name.toLowerCase()
          const search = this.search.toLowerCase()
          return name.includes(search)
        }
      })
      return capitalPlanAux
    },

    paginationLength() {
      return Math.ceil(this.listLenght / 8)
    },

    listLenght() {
      return this.capitalPlansComputed.length
    },

    startPage() {
      if (this.page == 1) {
        return 0
      }
      return this.page * 8 - 8
    },

    endPage() {
      return this.startPage + 8
    },

    searchOptions() {
      const aux =
        this.settingsProject && this.settingsProject.status
          ? this.settingsProject.status
          : []
      aux.unshift('All')
      return aux
    }
  },
  watch: {
    view(newVal) {
      const { pmOption, campusOption, searchOption } = this
      db.collection('m6user')
        .doc(Drupal.settings.m6_platform.uid)
        .collection('search')
        .doc('projects')
        .set({
          pmOption: pmOption || 'All',
          campusOption: campusOption || 'All',
          searchOption: searchOption || 'All',
          view: newVal
        })
    },

    user(newVal) {
      if (newVal.favProjects) this.favorites = [...newVal.favProjects]
    }

  },
  methods: {
    updateSearch(e) {
      this.search = e
    },
    closeCapitalDialog() {
      this.showCreateModal = false
    },
    getCapitalsPlan() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          const response = await db.collection('cpm_capital_plan').get()
          if (response.empty) {
            resolve(true)
          }

          response.docs.forEach(doc => {
            const capital = doc.data()
            capital.id = doc.id

            this.capitalPlans.push(capital)
          })

          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    onFiltered(filter) {
      if (filter.campusOption) this.campusOption = filter.campusOption

      if (filter.pmOption) this.pmOption = filter.pmOption

      if (filter.view) this.view = filter.view

      if (filter.searchOption) this.searchOption = filter.searchOption
    },
    deleteCapitalPlan(capitalPlan) {
      this.capitalPlanDelete = capitalPlan
      this.showDeleteModal = true
    },

    cancelDelete() {
      this.capitalPlanDelete = {}
      this.showDeleteModal = false
    },
    deleteCapitalRefFromTheProjects(projectsToDelete = []) {
      const aux = new Promise(async (resolve, reject) => {
        try {
          if (projectsToDelete.length <= 0) {
            resolve(true)
          }

          await Promise.all(projectsToDelete.map(async project => {
            const snap = await db.collection('cpm_projects').doc(project.id).get()

            if (snap.exists) {
              const auxProject = snap.data()
              const capitalPlans = auxProject.capitalPlans

              const find = capitalPlans.findIndex(capitalPlan => capitalPlan.id == this.capitalPlanDelete.id)

              if (find > -1) {
                capitalPlans.splice(find, 1)
                await db.collection('cpm_projects').doc(project.id).update({
                  capitalPlans: capitalPlans
                })
              }
            }
          }))
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    deleteCapital() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          await db.collection('cpm_capital_plan')
            .doc(this.capitalPlanDelete.id)
            .delete()

          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    async confirmDelete() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          const snap = await db.collection('cpm_capital_plan').doc(this.capitalPlanDelete.id).get()
          const capitalPlan = snap.data()
          await Promise.all([
            this.deleteCapitalRefFromTheProjects(capitalPlan.projects),
            this.deleteCapital()
          ])

          this.$snotify.success(
            `The Capital Plan: ${this.capitalPlanDelete.name} has been deleted`,
            'Success'
          )
          this.capitalPlans = this.capitalPlans.filter(
            proj => this.capitalPlanDelete.id != proj.id
          )
          this.cancelDelete()
          resolve(true)
        } catch (error) {
          this.$snotify.error(
            `There was an error while deleting ${this.capitalPlanDelete.title}`,
            'Error'
          )
          this.cancelDelete()
          reject(error)
        }
      })
      return aux
    },

    getFavorites() {
      db.collection('m6user')
        .doc(Drupal.settings.m6_platform.uid)
        .get()
        .then(querySnapshot => {
          const m6user = querySnapshot.data()
          this.favorites = m6user.favProjects ? m6user.favProjects : [] // if favcontracts doesnt exist then an empty array is returned
        })
    },

    goToCapital(proj, newTab) {
      let path = ''

      path = `/m6apps#/cpm/capital-plan/${proj.id}`
      if (!newTab) {
        window.location.href = path
      } else {
        window.open(path, '_blank')
      }
      return
    },
    getIds(projects = []) {
      const idsToGet = []

      for (let i = 0; i < projects.length; i++) {
        const element = projects[i]
        if (element.manager && !isNaN(parseInt(element.manager.value))) {
          idsToGet.push(parseInt(element.manager.value))
        }
      }

      return idsToGet
    }
  },

  firestore() {
    return {

      capitalPlans: db.collection('cpm_capital_plan')
    }
  }
}
</script>

<style lang="scss" scoped>
/*
    pagination and status dropdown. and done. favorites hasnt been conected yet as far as i know.
  */
.deleteBtn {
  top: 10px;
  right: 10px;
}

.newTabBtn {
  top: 10px;
  left: 10px;
}

.newTabBtn i {
  color: #fff !important;
}
.contracts-index .v-card {
  height: 100%;
}

.contracts-index .v-card .v-card__actions {
  bottom: 0;
  position: absolute;
  width: 100%;
}

.card-contract {
  min-height: 415px;
}

.m6_btn-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
  display: block;
}
.cpmCard {
  padding-bottom: 32px;
  height: 100%;

  .v-card__actions {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 52px;
    display: block;
  }
}

.title {
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
  margin-top: 40px;
  margin-bottom: 10px;
}

.m6-gray-text {
  color: #9e9e9e !important;
  caret-color: #9e9e9e !important;
}
</style>

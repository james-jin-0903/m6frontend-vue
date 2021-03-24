<template>
  <v-container
    class="rounded-lg"
    fluid
  >
    <m6-list
      class="fluid grid-list-xl it-apps-index"
      label="Search"
      :loading="loading"
      :on-input-search="debouncedSaveSearch"
      :search="search"
      :without-results="allProjects && !allProjects.length"
    >
      <template v-slot:before:search>
        <v-col class="shrink">
          <v-btn
            color="#0277BD"
            fab
            light
            small
            @click="showCreateModal = true"
          >
            <v-icon light>
              mdi-plus
            </v-icon>
          </v-btn>
        </v-col>
      </template>

      <template v-slot:after:search>
        <v-col
          class="align-center shrink"
        >
          <list-filtering
            :default-filters-values="{}"
            :items="{ campusOptions, pmOptions, searchOptions }"
            @filtered="onFiltered"
          />
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
          v-for="(proj, indexR) in projectsPaginated"
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
                  @click="deleteProject(proj)"
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
                  @click.prevent="goToProject(proj, true)"
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
              @click="goToProject(proj, false)"
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
              @click="goToProject(proj, false)"
            >
              <div class="mb-2 text-center">
                <p
                  class="font-weight-bold headline"
                  v-text="proj.title"
                />

                <div class="m6-gray-text">
                  <span v-if="proj.campus">{{ getCampus(proj.campus) }}</span>
                  <span v-else>&nbsp;</span>
                </div>

                <div
                  class="m6-gray-text"
                  style="height: 40px;"
                >
                  <span v-if="getManagerLabel(proj)">
                    <v-chip color="grey lighten-4">
                      <v-avatar>
                        <img :src="getAvatar(proj.manager)">
                      </v-avatar>
                      {{ getManagerLabel(proj) }}
                    </v-chip>
                  </span>
                  <span
                    v-else
                    style="height: 48px; width: 48px;"
                  >&nbsp;</span>
                </div>
              </div>
            </v-card-text>
            <v-card-actions class="overflow-hidden text-center">
              <v-row>
                <v-col
                  class="pa-0"
                  cols="6"
                >
                  <small>Project Status</small>
                  <v-card
                    :color="getColor('listStatus')"
                    text
                    tile
                  >
                    <v-card-text class="py-2 subheading vertical-scroll white--text">
                      <span class="white--text">{{ proj.status }}</span>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col
                  class="pa-0"
                  cols="6"
                >
                  <small>Start Date</small>
                  <v-card
                    :color="getColor('listStartDate')"
                    text
                    tile
                  >
                    <v-card-text class="py-2 subheading vertical-scroll white--text">
                      <span
                        v-if="proj.startDate"
                        class="white--text"
                      >
                        {{ parseDate(proj.startDate) }}
                      </span>
                      <span v-else>&nbsp;</span>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-actions>
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
            :headers="isPlanned ? headersCpmPlanned : headers"
            :items="allProjects"
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
                  @click.prevent="goToProject(props.item, false)"
                >
                  <span class="blue--text text--lighten-1">{{ props.item.number }}</span>
                </a>
              </td>
              <td>{{ props.item.campus ? props.item.campus.name : '' }}</td>
              <td>
                <a
                  href="#"
                  @click.prevent="goToProject(props.item, false)"
                >
                  {{ props.item.title }}
                </a>
              </td>
              <td v-if="!isPlanned">
                {{ trimDescription(props.item.description) }}
              </td>
              <template v-else>
                <td
                  v-for="(fy, index) in gettingBudget(props.item.id)"
                  :key="index"
                >
                  {{ (isNaN(fy.plan) ? 0 : fy.plan) | currency }}
                </td>
                <td>{{ getBudgetTotal(props.item.id) | currency }}</td>
                <td>{{ getDates(props.item.id, 'RFP') }}</td>
                <td>{{ getDates(props.item.id, 'Board Approval') }}</td>
                <td>{{ getDates(props.item.id, 'Kick-Off') }}</td>
                <td>{{ getDuration(props.item.id) }} year(s)</td>
              </template>
              <td>{{ getManagerLabel(props.item) }}</td>
              <td>{{ props.item.projectType }}</td>

              <template v-if="!isPlanned">
                <td class="text-right">
                  {{
                    parseFloat(
                      props.item.budget ? props.item.budget : 0
                    ).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })
                  }}
                </td>
                <td class="text-right">
                  {{
                    parseFloat(
                      props.item.projectFinalCost
                        ? props.item.projectFinalCost
                        : 0
                    ).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })
                  }}
                </td>
                <td>{{ props.item.status }}</td>
              </template>
              <td class="justify-center layout">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      class="mr-2 pointer"
                      small
                      v-on="on"
                      @click="goToProject(props.item, false)"
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
                      @click="deleteProject(props.item)"
                    >
                      mdi-delete
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
          <strong>
            {{ listLenght }}
          </strong>
        </p>
      </v-col>
    </v-row>

    <cpm-create
      :show="showCreateModal"
      @close="showCreateModal = false"
    />
    <m6-loading
      :loading="loading"
      :show-time="true"
    />
    <m6-confirm-delete
      message="Are you sure you want to permanently remove this CPM project?"
      :show="showDeleteModal"
      title="Delete CPM Project"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />
  </v-container>
</template>

<script>
import { db } from '@/utils/Firebase'
import { format } from 'date-fns'
import CPMCreate from './modals/CPMCreate'
import ListFiltering from './modals/ListFiltering'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'List',
  components: {
    'cpm-create': CPMCreate,
    'list-filtering': ListFiltering
  },
  props: {
    type: {
      type: String,
      default: 'all'
    }
  },
  data: () => ({
    defaultColors: { listStatus: '#FF0000', listStartDate: '#008000' },
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
      { text: 'Project Number', value: 'number' },
      { text: 'Campus', value: 'campus.name' },
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' },
      { text: 'Project Manager', value: 'managerLabel' },
      { text: 'Project Type', value: 'projectType' },
      { text: 'Budget', value: 'budget' },
      {
        text: 'Projected Final Cost',
        value: 'projectFinalCost'
      },
      { text: 'Status', value: 'status' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    headersCpmPlanned: [
      { text: '', value: 'picture' },
      { text: 'Project Number', value: 'number' },
      { text: 'Campus', value: 'campus' },
      { text: 'Title', value: 'title' },
      { text: 'FY1', value: 'FY1' },
      { text: 'FY2', value: 'FY2' },
      { text: 'FY3', value: 'FY3' },
      { text: 'FY4', value: 'FY4' },
      { text: 'FY5', value: 'FY5' },
      {
        text: 'Total Budget',
        value: 'budget'
      }, // computed/function
      { text: 'RFP Date', value: 'RFP Date' },
      { text: 'Board Approval' },
      { text: 'Project Kick-Off' },
      { text: 'Project Duration' }, // computed/function
      { text: 'Project Manager', value: 'managerLabel' },
      { text: 'Project Type', value: 'projectType' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    pagination: { sortBy: 'number', descending: false, rowsPerPage: 10 },
    page: 1,
    settingsProject: {},
    settingsUsers: {},
    showCreateModal: false,
    projectToDelete: {},
    showDeleteModal: false,
    axiosSettings: {
      baseUrl: Drupal.settings.m6_platform.f_base.functions.api_url,
      config: {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      }
    }
  }),
  computed: {
    ...mapGetters({
      projects: 'cpmProjects'
    }),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    getColor() {
      return key => this.settingsProject.projectColors
        ? this.settingsProject.projectColors.find(p => p.key == key).color
        : this.defaultColors[key]
    },

    getDates() {
      return (id, which) => {
        const temp = this.mileStones[id].find(
          m => m.title == this.milestoneOptions[which]
        )

        if (!temp) {
          return ''
        }

        const date = temp.original
        return new Date(date).toLocaleDateString().split(',')[0]
      }
    },

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

    getBudgetTotal() {
      return id => {
        const budgetsFiltered = this.budgets[id].filter((b, index) => index < 5)
        if (budgetsFiltered.length < 5) {
          const missing = 5 - budgetsFiltered.length
          for (let x = 0; x < missing; x++) {
            budgetsFiltered.push({})
          }
        }

        const budgetPlans = budgetsFiltered.filter(b => parseFloat(b.plan))
        let sum = 0
        for (let x = 0; x < budgetPlans.length; x++) {
          if (budgetPlans[x].plan && !isNaN(budgetPlans[x].plan)) {
            sum += budgetPlans[x].plan
          }
        }
        return sum
      }
    },

    getDuration() {
      return id => {
        const budgetsFiltered = this.budgets[id].filter((b, index) => index < 5)
        if (budgetsFiltered.length < 5) {
          const missing = 5 - budgetsFiltered.length
          for (let x = 0; x < missing; x++) {
            budgetsFiltered.push({})
          }
        }
        const budgetPlans = budgetsFiltered.filter(b => parseFloat(b.plan))
        let years = 0

        for (let x = 0; x < budgetPlans.length; x++) {
          if (budgetPlans[x].plan && !isNaN(budgetPlans[x].plan)) years++
        }

        return years
      }
    },

    isPlanned() {
      return this.$route.name == 'cpm.forecasting.index'
    },

    projectsPaginated() {
      return this.allProjects.filter(
        (item, index) => index >= this.startPage && index < this.endPage
      )
    },

    environment() {
      return this.getEnvironment()
    },

    allProjects() {
      let projects = []
      const currentProjects = this.projects.slice()

      projects = currentProjects.filter(project => {
        if (project.manager) {
          project.managerLabel = project.manager.label
        }
        return (
          this.canView(project) &&
          (!project.soft_delete || project.soft_delete != 1) &&
          this.searchingFields(project)
        )
      })

      if (this.searchOption != 'All') {
        projects = projects.filter(project => project.status == this.searchOption)
      }

      if (this.campusOption != 'All') {
        projects = projects.filter(project => this.getCampus(project.campus).includes(this.campusOption.name))
      }

      if (this.pmOption != 'All') {
        projects = projects.filter(project => project.managerLabel == this.pmOption.label)
      }

      if (this.favorites.length != 0 && this.view.val == 'favorites_view') {
        return projects.filter(project => this.favorites.includes(project.id))
      } else if (
        this.favorites.length == 0 &&
        this.view.val == 'favorites_view'
      ) {
        return []
      } else {
        return projects
      }
    },

    paginationLength() {
      return Math.ceil(this.listLenght / 8)
    },

    listLenght() {
      return this.allProjects.length
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
    },

    campusOptions() {
      let aux = []
      if (this.settingsProject.campus && this.settingsProject.campus.length) {
        this.settingsProject.campus.forEach(cl1 => {
          const itemName = cl1.abbr ? `(${cl1.abbr}) ${cl1.name}` : cl1.name
          aux.push({
            item: cl1,
            name: itemName,
            levelName: cl1.name,
            levelAbbr: cl1.abbr,
            level: 1
          })
          if (cl1.lvl_1 && cl1.lvl_1.length) {
            cl1.lvl_1.forEach(cl2 => {
              let itemL2Name = itemName + ' > '
              itemL2Name += cl2.abbr ? `(${cl2.abbr}) ${cl2.name}` : cl2.name
              aux.push({
                item: cl1,
                itemL2: cl2,
                name: itemL2Name,
                levelName: cl2.name,
                levelAbbr: cl2.abbr,
                level: 2
              })
              if (cl2.lvl_2 && cl2.lvl_2.length) {
                cl2.lvl_2.forEach(cl3 => {
                  let itemL3Name = itemL2Name + ' > '
                  itemL3Name += cl3.abbr
                    ? `(${cl3.abbr}) ${cl3.name}`
                    : cl3.name
                  aux.push({
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
      }
      aux = this.alphabetical(aux, 'asc', 'name')
      aux.unshift('All')
      return aux
    },

    pmOptions() {
      let aux =
        this.settingsUsers && this.settingsUsers.projectManager
          ? this.settingsUsers.projectManager
          : []
      aux = this.alphabetical(aux, 'asc', 'label')
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
    },

    projects(newVal) {
      const ids = this.getIds(newVal)
      this.getImages(ids)
      if (this.isPlanned) {
        this.getBudgets(newVal)
        this.getMileStones(newVal)
      }
    }
  },
  mounted() {
    if (this.projects.length == 0) {
      let check = false
      if (this.type == 'forecasted') {
        check = true
      }

      this.loading = true
      this.bindCPMProjects(check)
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.$snotify.error(
            'There was an error while getting the projects',
            'Error'
          )
          this.loading = false
        })
    }
    this.getUser()
  },
  beforeDestroy() {
    this.clearCPMProjects()
  },
  methods: {
    parseDate(date) {
      if (!date) return ''
      const [year, month, day] = date.split('T')[0].split('-')

      return `${month}/${day}/${year}`
    },
    ...mapActions({
      bindCPMProjects: 'bindCPMProjects',
      clearCPMProjects: 'clearCPMProjects'
    }),
    getMileStones(projects) {
      const ids = projects.map(p => p.id)
      const mileStones = {}

      for (let x = 0; x < ids.length; x++) {
        db.collection('cpm_projects')
          .doc(ids[x])
          .collection('milestones')
          .orderBy('title')
          .get()
          .then(snapshot => {
            mileStones[ids[x]] = []
            for (let i = 0; i < snapshot.docs.length; i++) {
              mileStones[ids[x]].push(snapshot.docs[i].data())
            }
          })
      }

      this.mileStones = mileStones
    },
    getBudgets(projects) {
      const ids = projects.map(p => p.id)
      const budgets = {}
      for (let x = 0; x < ids.length; x++) {
        db.collection('cpm_projects')
          .doc(ids[x])
          .collection('budgets')
          .orderBy('title')
          .get()
          .then(snapshot => {
            budgets[ids[x]] = []
            for (let i = 0; i < snapshot.docs.length; i++) {
              budgets[ids[x]].push(snapshot.docs[i].data())
            }
          })
      }

      this.budgets = budgets
    },
    getUrl() {
      const url = location.host
      return url
    },
    getEnvironment() {
      let environment = ''

      const url = this.getUrl()

      switch (url) {
        case 'sharp.m6connect.com':
        case 'thr.m6connect.com':
        case 'apps.m6connect.com':
        case 'm6connect.com':
          environment = 'production'
          break

        default:
          environment = 'test'
          break
      }

      return environment
    },
    onFiltered(filter) {
      if (filter.campusOption) this.campusOption = filter.campusOption

      if (filter.pmOption) this.pmOption = filter.pmOption

      if (filter.view) this.view = filter.view

      if (filter.searchOption) this.searchOption = filter.searchOption
    },

    redirectToProfile(project) {
      this.$router.push({
        name: 'cpm.projects.show',
        params: { id: project.id }
      })
    },

    deleteProject(project) {
      this.projectToDelete = project
      this.showDeleteModal = true
    },

    cancelDelete() {
      this.projectToDelete = {}
      this.showDeleteModal = false
    },

    confirmDelete() {
      db.collection('cpm_projects')
        .doc(this.projectToDelete.id)
        .update({ soft_delete: 1 })
        .then(() => {
          this.$snotify.success(
            `The Project: ${this.projectToDelete.title} has been deleted`,
            'Success'
          )
          this.projects = this.projects.filter(
            proj => this.projectToDelete.id != proj.id
          )
          this.cancelDelete()
        })
        .catch(() => {
          this.$snotify.error(
            `There was an error while deleting ${this.projectToDelete.title}`,
            'Error'
          )
          this.cancelDelete()
        })
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

    goToProject(proj, newTab) {
      let path = ''
      if (this.$route.fullPath.search('/cpm/projects') != -1) {
        path = window.location.origin + `/m6apps#/cpm/projects/${proj.id}`
      } else if (this.$route.fullPath.search('/cpm/forecasting') != -1) {
        path = window.location.origin + `/m6apps#/cpm/forecasting/${proj.id}`
      } else {
        path = `/m6apps#/cpm/projects/${proj.id}`
      }
      // const path = window.location.origin + `/m6apps#/cpm/projects/${proj.id}`
      if (!newTab) {
        window.location.href = path
      } else {
        window.open(path, '_blank')
      }
      return
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
    },

    getUser() {
      const aux = new Promise((resolve, reject) => {
        db.collection('m6user')
          .doc(this.userId)
          .get()
          .then(document => {
            const user = document.data()
            if (
              user &&
              user.optionsFilter &&
              user.optionsFilter.searchProjectList != undefined &&
              user.optionsFilter.searchProjectList
            ) {
              this.search = user.optionsFilter.searchProjectList
              resolve(true)
            } else {
              resolve(true)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
      return aux
    },

    loadFilters() {
      db.collection('m6user')
        .doc(Drupal.settings.m6_platform.uid)
        .collection('search')
        .doc('projects')
        .get()
        .then(snapshot => {
          const data = snapshot.data()
          if (data) {
            // if not undefined

            this.campusOption = data.campusOption || 'All'
            this.pmOption = data.pmOption || 'All'
            this.view =
              data.view && data.view.label
                ? data.view
                : { label: 'Grid', val: 'grid_view', icon: 'mdi-view-module' }
            this.searchOption = data.searchOption || 'All'
          }
        })
        .catch(() => {})
    },

    debouncedSaveSearch: _.debounce(function (e) {
      this.updateFilterUserOptions(e)
    }, 500),

    updateFilterUserOptions(val) {
      db.collection('m6user')
        .doc(this.userId)
        .update({
          optionsFilter: {
            searchProjectList: val
          }
        })
        .then(() => {
          this.search = val
        })
    },

    searchingFields(project) {
      if (this.search) {
        const searchText =
          project.campus +
          ' ' +
          project.number +
          ' ' +
          project.title +
          ' ' +
          project.projectType +
          ' ' +
          project.status +
          ' ' +
          project.fyapproved +
          ' ' +
          this.getManagerLabel(project)
        return searchText.toLowerCase().includes(this.search.toLowerCase())
      } else {
        return true // if search is empty/undefined etc return true, as this is considered an empty search
      }
    },

    getManagerLabel(item) {
      if (item.manager) {
        return item.manager.label
      }
      if (!item.teamMembers || item.teamMembers.length <= 0) {
        return ''
      }
      let auxString = ''
      item.teamMembers.map((member, index) => {
        if (member.role == 'Project Coordinator') {
          auxString += member.user
          if (index != item.teamMembers.length - 1) {
            auxString += ','
          }
        }
      })

      return auxString
    },

    trimDescription(str) {
      if (str !== undefined && str.length && str.length > 20) {
        return str.substring(0, 20) + '...'
      } else {
        return str
      }
    },

    getCampus(campus) {
      if (campus) {
        // if not undefined or array not empty
        if (campus[0]) {
          return campus[0].name || ''
        } else {
          return campus.name || ''
        }
      } else {
        return ''
      }
    },
    alphabetical(val, order = '', prop = '') {
      if (Array.isArray(val) && val.length > 0) {
        let value = [...val]
        switch (order) {
          case 'Ascending':
          case 'asc':
            value = value.sort((a, b) => {
              if (prop != '') {
                return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0
              } else return a > b ? 1 : a < b ? -1 : 0
            })
            break
          case 'Descending':
          case 'desc':
            value = value.sort((a, b) => {
              if (prop != '') {
                return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0
              } else return a > b ? 1 : a < b ? -1 : 0
            })
            break
          default:
            value = [...value]
            break
        }
        return value
      } else {
        return val
      }
    },
    getAvatar(teamMember) {
      let image = this.defaultImage
      if (teamMember && this.images[teamMember.value]) {
        image = this.images[teamMember.value].user_image
      }

      return image
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
    },
    getImages(usersId = []) {
      if (usersId.length <= 0) {
        return
      }

      const payload = {
        usersId: usersId
      }
      this.axios
        .post('/m6-platform/api/user_profile_images', payload)
        .then(response => {
          const results = response.data
          const data = {}
          usersId.forEach(userId => {
            if (results[userId]) {
              data[userId] = { user_image: results[userId] }
            } else {
              data[userId] = {
                user_image: this.defaultImage
              }
            }
          })

          this.images = { ...data }
        })
    }

    /* deleteProject(id, name) {
        //@click="deleteProject(proj.id,  proj.title)"
        let confirmation = confirm(`Do you want to delete this CPM: ${name}`)
        if (confirmation) {
          this.submitDelete(id, name)
        }
      },

      submitDelete(id, name) {

        db.collection("cpm_projects").doc(id).update({soft_delete:1})// herehere
        .then(() => {
          this.$snotify.success(`The CPM ${name} has been delete`, 'Success')
          let project = this.projects.filter( proj => proj.id == id )
          project.soft_delete = 1
          this.search = ""
          this.projects = [...this.projects]
        })
        .catch(err => {
          this.$snotify.error('Error while deleting', 'Error')
        })
      },

      getFavorites() {
        db.collection('m6user').doc(Drupal.settings.m6_platform.uid).get().then((querySnapshot) => {
          const m6user = querySnapshot.data();
          console.log('m6user.favProjects')
          console.log(m6user.favProjects)
          this.favorites = m6user.favProjects ? m6user.favProjects : [] // if favcontracts doesnt exist then an empty array is returned
        });
      },

      */
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

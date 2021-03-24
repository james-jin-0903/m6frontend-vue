<template>
  <v-dialog
    fullscreen
    hide-overlay
    scrollable
    transition="dialog-bottom-transition"
    :value="true"
  >
    <v-card>
      <v-toolbar
        color="primary"
        dark
      >
        <v-btn
          dark
          icon
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Forecasting Projects</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pa-1 vertical-scroll">
        <m6-list
          class="fluid"
          label="Search"
          :on-input-search="debounceSearch"
          :search="search"
          :without-results="false"
        >
          <template v-slot:before:search>
            <v-btn @click="getProjectsTasks">
              Show Gantts
            </v-btn>
          </template>
          <template v-slot:after:search>
            <list-filtering
              :default-filters-values="{}"
              :items="{ campusOptions, pmOptions }"
              @filtered="onFiltered"
            />
          </template>
        </m6-list>
        <m6-data-table
          v-model="selected"
          :headers="headers"
          item-key="id"
          :items="resources"
          :pagination.sync="pagination"
          :rows-per-page-items="rowsPerPageItems"
          select-all
          :total-items="pagination.totalItems"
          @update:pagination="debounceSearch(search)"
        >
          <template
            slot="items"
            slot-scope="{ item, selected }"
          >
            <td>
              <v-checkbox
                v-model="selected"
                @change="addProject(selected, item)"
              />
            </td>
            <td class="pa-1 text-center">
              <v-avatar :color="item.projectImage ? '' : 'indigo'">
                <img
                  v-if="item.projectImage"
                  :src="item.projectImage"
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
                @click.prevent="goToProject(item, false)"
              >
                <span class="customColor0D47A1">{{ item.number }}</span>
              </a>
            </td>

            <td>
              <v-menu
                nudge-top="70"
                offset-y
                open-on-hover
              >
                <template v-slot:activator="{ on }">
                  <div
                    class="maxWidth9rem text-truncate"
                    v-on="on"
                  >
                    {{ item.title }}
                  </div>
                </template>

                <v-card
                  class="rounded-lg"
                  color="rgb(255, 255, 255, 0.9)"
                >
                  <v-card-text class="vertical-scroll">
                    {{ item.title }}
                  </v-card-text>
                </v-card>
              </v-menu>
            </td>
            <td>{{ getManagerLabel(item) }}</td>
            <td>{{ getCampus(item.campus) }}</td>
          </template>
        </m6-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { db } from '@/utils/Firebase'
import mixins from '@/modules/cpm/_mixins/index'
import ListFiltering from '../modals/ListFiltering'

export default {
  name: 'ForecastingProjects',

  components: {
    ListFiltering
  },

  mixins: [mixins],

  data() {
    return {
      campusOption: 'All',
      pagination: {
        sortBy: 'title',
        descending: false,
        rowsPerPage: 8,
        totalItems: 0,
        page: 1
      },
      pmOption: 'All',
      search: '',
      selected: [],
      settingsProject: {},
      settingsUsers: {}
    }
  },

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    userId() {
      return window.Drupal.settings.m6_platform.uid
    },

    rowsPerPageItems() {
      if (this.isGridView) {
        return [8, 16, 24, { text: 'All', value: 10000 }]
      }

      return [5, 10, 25, { text: 'All', value: 10000 }]
    },

    indexParameters() {
      const parameters = {
        companyId: this.currentCompany.id,
        userId: this.userId,
        filter: { forecasted: true },
        page: this.pagination.page,
        search: this.search || '',
        sort: this.pagination.descending ? 'DESC' : 'ASC',
        sortBy: this.pagination.sortBy,
        limit: this.pagination.rowsPerPage
      }

      if (this.campusOption && this.campusOption !== 'All') {
        parameters.filter['campus'] = this.$h.dg(
          this,
          'campusOption.name',
          this.campusOption
        )
      }

      if (this.pmOption && this.pmOption !== 'All') {
        parameters.filter['manager'] = this.$h.dg(
          this,
          'pmOption.value',
          this.pmOption
        )
      }

      return parameters
    },

    campusOptions() {
      let aux = []
      if (this.$h.dg(this.settingsProject, 'campus', []).length) {
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
      aux = this.lodash.orderBy(aux, 'name', 'asc')
      aux.unshift('All')
      return aux
    },

    pmOptions() {
      let aux = []
        .concat(
          this.$h.dg(this, 'settingsUsers.projectManager', []),
          this.$h.dg(this, 'settingsUsers.projectCoordinator', [])
        )
        .flat()
      aux = this.lodash.orderBy(aux, 'label', 'asc')
      aux.unshift('All')

      return aux
    },

    headers() {
      const headers = [
        {
          text: '',
          value: 'picture',
          unexportable: true,
          sortable: false
        },
        {
          text: this.$t('general.projectNumber'),
          value: 'number'
        },
        {
          text: this.$tc('general.title', 1),
          value: 'title'
        },
        { text: this.$t('general.projectManager'), value: 'managerLabel' },
        {
          text: this.$t('general.campus'),
          value: 'campus'
        }
      ]

      return headers
    },

    fiscalYears() {
      return this.$h.dg(this.settingsProject, 'fiscalYears', [])
    }
  },

  methods: {
    ...mapActions('cpm/planned/cashflow', {
      indexResource: 'index',
      getProjectsTasksAndLinks: 'getProjectsTasksAndLinks'
    }),
    getProjectsTasks() {
      const projectIds = this.selected.map(project => project.id)
      // const projectIds = ['6Udd3vx1ukZ4eSSVP4sX', 'U8CBELs2tZQ4PR8kJ8uh']
      this.getProjectsTasksAndLinks({ projectIds })
        .then(() => {
          this.closeDialog()
        })
    },
    assignResourcesData({ data, meta: { lastPage, total } } = {}) {
      if (lastPage && this.pagination.page > lastPage) {
        this.pagination.page = 1
        return this.fetchResources()
      }

      this.resourcesRaw = data
      this.pagination.totalItems = total
    },
    onFiltered(filter) {
      if (filter.campusOption) this.campusOption = filter.campusOption

      if (filter.pmOption) this.pmOption = filter.pmOption

      this.fetchResources()
        .catch(console.error)
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
    getManagerLabel(item) {
      if (item.manager) {
        return item.manager.label
      }
      if (!item.teamMembers || item.teamMembers.length <= 0) {
        return ''
      }
      let auxString = ''
      item.teamMembers.map((member, index) => {
        if (member.role === 'Project Coordinator') {
          auxString += member.user
          if (index !== item.teamMembers.length - 1) {
            auxString += ','
          }
        }
      })
      return auxString
    },
    closeDialog() {
      this.$emit('close')
    },
    addProject(isSelected, project) {
      if (isSelected) {
        this.selected.push(project)
      } else {
        const index = this.lodash.findIndex(
          this.selected,
          { id: project.id }
        )

        if (index !== -1) {
          this.selected.splice(index, 1)
        }
      }
    }
  },

  firestore() {
    return {
      user: db.collection('m6user').doc(window.Drupal.settings.m6_platform.uid),

      settingsProject: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('projects'),

      settingsUsers: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('users')
    }
  }
}
</script>

<template>
  <v-container
    class="rounded-lg"
    fluid
  >
    <m6-list
      class="fluid grid-list-xl it-apps-index"
      label="Search"
      :loading="loading"
      :on-input-search="debounceSearch"
      :search="search"
      :without-results="false"
    >
      <template v-slot:before:search>
        <v-col class="shrink">
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="
                  isPlanned &&
                    (view.val === 'view_list' || view.val === 'favorites_view')
                "
                color="#0277BD"
                dark
                fab
                small
                v-on="on"
                @click="showAllMileStones = !showAllMileStones"
              >
                <v-icon>mdi-calendar</v-icon>
              </v-btn>
            </template>

            <span v-if="showAllMileStones">{{ $t('general.hide') }}</span>
            <span v-else>{{ $t('general.show') }}</span>
            {{ $t('cpm.allMilestones') }}
          </v-tooltip>

          <v-btn
            v-if="resources && resources.length"
            id="step1"
            color="#0277BD"
            dark
            fab
            small
            @click="downloadCSV"
          >
            <v-icon light>
              mdi-cloud
            </v-icon>
          </v-btn>

          <v-btn
            id="step2"
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

      <template v-slot:after:search>
        <v-col
          id="step4"
          class="align-center shrink"
        >
          <list-filtering
            :default-filters-values="{}"
            :items="{ campusOptions, pmOptions, searchOptions }"
            @filtered="onFiltered"
          />
        </v-col>

        <v-col
          id="step5"
          class="shrink"
        >
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
      <v-data-iterator
        v-if="isGridView"
        class="fullWidth"
        content-tag="v-layout"
        disable-initial-sort
        :items="resources"
        :pagination.sync="pagination"
        row
        :rows-per-page-items="rowsPerPageItems"
        :total-items="pagination.totalItems"
        wrap
        @update:pagination="initialized ? debounceSearch(search) : null"
      >
        <template v-slot:no-data>
          <m6-no-results />
        </template>

        <template v-slot:item="{ index, item }">
          <v-col
            cols="12"
            lg="3"
            md="4"
            sm="6"
          >
            <v-card
              id="step6"
              v-intro-if="index === 0"
              class="cpmCard pointer"
              @mouseleave="showDeleteIconApplication = null"
              @mouseover="showDeleteIconApplication = index"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-if="showDeleteIconApplication === index"
                    absolute
                    class="deleteBtn"
                    color="red"
                    fab
                    light
                    small
                    v-on="on"
                    @click="deleteProject(item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>

                <span>{{ $t('cpm.deleteProject') }}</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-if="showDeleteIconApplication === index"
                    absolute
                    class="newTabBtn"
                    color="purple"
                    fab
                    small
                    v-on="on"
                    @click="goToProject(item, true)"
                  >
                    <v-icon>mdi-folder-plus</v-icon>
                  </v-btn>
                </template>

                <span>{{ $t('cpm.openNewTab') }}</span>
              </v-tooltip>

              <v-col
                class="text-center"
                cols="12"
                @click="goToProject(item, false)"
              >
                <v-row class="justify-center pt-3">
                  <v-badge>
                    <v-avatar
                      color="grey lighten-4"
                      size="100"
                    >
                      <img
                        v-if="item.projectImage"
                        :src="item.projectImage"
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
                @click="goToProject(item, false)"
              >
                <div class="mb-2 text-center">
                  <v-menu
                    offset-y
                    open-on-hover
                    top
                  >
                    <template v-slot:activator="{ on }">
                      <p
                        class="font-weight-bold headline text-truncate"
                        v-on="on"
                      >
                        {{ item.title || 'N/A' }}
                      </p>
                    </template>

                    <div class="pa-2 white">
                      {{ item.title || 'N/A' }}
                    </div>
                  </v-menu>

                  <div class="m6-gray-text">
                    <span v-if="item.number">
                      <strong>{{ item.number || 'N/A' }}</strong>
                    </span>
                  </div>

                  <div class="m6-gray-text">
                    <span v-if="item.campus">
                      {{ getCampus(item.campus) }}
                    </span>
                    <span v-else>&nbsp;</span>
                  </div>

                  <div
                    class="customHeight2p5rem m6-gray-text"
                  >
                    <span v-if="getManagerLabel(item)">
                      <v-chip color="grey lighten-4">
                        <v-avatar>
                          <img :src="getAvatar(item.manager)">
                        </v-avatar>
                        {{ getManagerLabel(item) }}
                      </v-chip>
                    </span>

                    <span
                      v-else
                      class="size3rem"
                    >
                      &nbsp;
                    </span>
                  </div>
                </div>
              </v-card-text>

              <v-card-actions class="overflow-hidden text-center">
                <v-row>
                  <v-col
                    class="pa-0"
                    cols="6"
                  >
                    <small>{{ $t('cpm.budgetStatus') }}</small>

                    <v-card
                      class="card-footer"
                      :color="getColor('listStatus')"
                      text
                      tile
                    >
                      <span class="py-2 subheading white--text">
                        {{ item.status || 'N/A' }}
                      </span>
                    </v-card>
                  </v-col>

                  <v-col
                    class="pa-0"
                    cols="6"
                  >
                    <small>{{ $t('general.startDate') }}</small>

                    <v-card
                      class="card-footer pt-1"
                      :color="getColor('listStartDate')"
                      text
                      tile
                    >
                      <span class="py-2 subheading white--text">
                        {{ getDate(item.startDate) }}
                      </span>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </template>
      </v-data-iterator>

      <v-row
        v-else
        :key="view.val"
      >
        <v-col cols="12">
          <m6-data-table
            :headers="headers"
            :items="resources"
            :pagination.sync="pagination"
            :rows-per-page-items="rowsPerPageItems"
            :total-items="pagination.totalItems"
            @update:column:width="
              ({ index, width }) => (headersWidth[index] = width)
            "
            @update:pagination="debounceSearch(search)"
          >
            <template
              slot="items"
              slot-scope="{ item }"
            >
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

              <template v-if="!isPlanned">
                <td>{{ item.status }}</td>

                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <span v-on="on">{{
                        $h.dg(item, 'lastStatusComment.comment', '') | trunc
                      }}</span>
                    </template>
                    <span>{{
                      $h.dg(item, 'lastStatusComment.comment', '')
                    }}</span>
                  </v-tooltip>
                </td>
              </template>

              <td>{{ getCampus(item.campus) }}</td>

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

              <template v-if="isPlanned">
                <!-- FISCAL YEARS -->
                <td
                  v-for="(fy, index) in fiscalYears"
                  :key="index"
                >
                  {{ $h.dg(item, 'budgetsByFiscalYear[fy.value]', 0) | currency }}
                </td>

                <td>{{ getBudgetTotal(item) | currency }}</td>
                <td>{{ getDates(item.id, 'RFP') }}</td>
                <td>{{ getDates(item.id, 'Board Approval') }}</td>

                <template v-if="showAllMileStones">
                  <td>{{ getDates(item.id, 'startDate') }}</td>
                  <td>{{ getDates(item.id, 'RFQ') }}</td>
                  <td>{{ getDates(item.id, 'meeting') }}</td>
                  <td>{{ getDates(item.id, 'RFP Due') }}</td>
                  <td>{{ getDates(item.id, 'interviews') }}</td>
                  <td>{{ getDates(item.id, 'draft') }}</td>
                  <td>{{ getDates(item.id, 'contract') }}</td>
                  <td>{{ getDates(item.id, 'final') }}</td>
                  <td>{{ getDates(item.id, 'live') }}</td>
                </template>

                <td>
                  {{
                    $tc('general.months', getDuration(item), {
                      count: getDuration(item)
                    })
                  }}
                </td>
              </template>

              <template v-if="!isPlanned">
                <td
                  class="maxWidth9rem text-truncate"
                >
                  {{ item.description }}
                </td>

                <td>{{ getManagerLabel(item) }}</td>

                <td class="text-lg-right text-md-right text-right">
                  {{ $h.dg(item, 'budget', 0) | currency }}
                </td>
              </template>

              <template v-if="!isPlanned">
                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <span v-on="on">{{
                        $h.dg(item, 'lastBudgetComment.comment', '') | trunc
                      }}</span>
                    </template>
                    <span>{{
                      $h.dg(item, 'lastBudgetComment.comment', '')
                    }}</span>
                  </v-tooltip>
                </td>

                <td class="text-lg-right text-md-right text-right">
                  {{ $h.dg(item, 'totals.spendingTotal', 0) | currency }}
                </td>

                <td class="text-lg-right text-md-right text-right">
                  {{ $h.dg(item, 'projectFinalCost', 0) | currency }}
                </td>

                <td>{{ item.startDate | monthDayYear }}</td>

                <td>
                  {{ item.constructionStartDate | monthDayYear }}
                </td>

                <td>
                  {{ item.constructionEndDate | monthDayYear }}
                </td>
              </template>

              <td class="justify-center layout">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      class="mr-2 pointer"
                      small
                      v-on="on"
                      @click="goToProject(item, false)"
                    >
                      mdi-pencil
                    </v-icon>
                  </template>
                  <span>{{ $t('general.edit') }}</span>
                </v-tooltip>

                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      v-if="item.canDelete"
                      class="pointer"
                      small
                      v-on="on"
                      @click="deleteProject(item)"
                    >
                      mdi-delete
                    </v-icon>
                  </template>
                  <span>{{ $t('general.delete') }}</span>
                </v-tooltip>
              </td>
            </template>
          </m6-data-table>
        </v-col>
      </v-row>
    </m6-list>

    <cpm-create
      :show="showCreateModal"
      @close="showCreateModal = false"
    />

    <m6-confirm-delete
      :message="deleteProjectMessage"
      :show="showDeleteModal"
      :title="$t('cpm.projects.deleteCPMProject')"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />

    <portal to="tourButton">
      <v-btn
        id="step7"
        v-intro-tooltip-class="'title'"
        color="primary"
        data-step="7"
        small
        @click="startTour"
      >
        <v-icon small>
          mdi-near-me
        </v-icon>
        {{ $t('tourProjectList.start') }}
      </v-btn>
    </portal>

    <M6Loading
      :loading="showLoading"
    />

    <m6-info
      v-if="showAssociatedRfpsModal"
      :title="rfpModalTitle"
      @close="showAssociatedRfpsModal = false"
    >
      <span v-html="rfpModalMessage" />
      <ul class="mb-4 mt-2">
        <li
          v-for="(rfp) in associatedRfps"
          :key="rfp.id"
        >
          <span>{{ rfp.name }}</span>
        </li>
      </ul>

      <span
        class="blue--text pointer"
        @click="goToProposal"
      >Click here</span> to go to the Proposals List
    </m6-info>
  </v-container>
</template>

<script>
import { format } from 'date-fns'
import { mapState, mapActions } from 'vuex'
import Excel from 'exceljs'
import { saveAs } from 'file-saver'

import { db } from '@/utils/Firebase'

import CPMCreate from './modals/CPMCreate'
import ListFiltering from './modals/ListFiltering'

import M6Info from './_partials/M6Info'

import mixins from '@/modules/cpm/_mixins/index'
// TODO: need to transfer all the api requests to firebase over to graphql...

export default {
  name: 'ListELK',
  components: {
    'cpm-create': CPMCreate,
    'list-filtering': ListFiltering,
    M6Info
  },
  mixins: [mixins],

  props: {
    type: {
      type: String,
      default: 'all'
    }
  },

  data: vm => ({
    deleteProjectMessage: '',
    rfpModalTitle: '',
    showAssociatedRfpsModal: false,
    associatedRfps: [],
    showLoading: false,
    firstProjectId: '',
    hasSeenTheTour: false,
    showProjectTourConfirm: false,
    headersWidth: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    numFmt: '"$"#,##0.00;[Red]-"$"#,##0.00',
    showAllMileStones: false,
    defaultColors: { listStatus: '#FF0000', listStartDate: '#008000' },
    autoInit: false,
    initialized: false,
    images: {},
    defaultImage: '/sites/all/themes/m6connect/images/default_userpdf.png',
    user: {},
    favorites: [],
    firstTime: true,
    showDeleteIconApplication: null,
    userId: window.Drupal.settings.m6_platform.uid,
    searchOption: 'All',
    campusOption: 'All',
    pmOption: 'All',
    view: {
      label: vm.$t('general.grid'),
      val: 'grid_view',
      icon: 'mdi-view-module'
    },
    views: [
      {
        label: vm.$t('general.grid'),
        val: 'grid_view',
        icon: 'mdi-view-module'
      },
      {
        label: vm.$t('general.table'),
        val: 'view_list',
        icon: 'mdi-view-list'
      },
      {
        label: vm.$tc('general.favorite', 2),
        val: 'favorites_view',
        icon: 'mdi-heart'
      }
    ],
    pagination: {
      sortBy: 'title',
      descending: false,
      rowsPerPage: 8,
      totalItems: 0,
      page: 1
    },
    settingsProject: {},
    settingsUsers: {},
    showCreateModal: false,
    resourceToDelete: {},
    showDeleteModal: false,
    projects: [],
    budgets: {},
    mileStones: {},
    // TODO: make this dynamic, probably a panel in cpm/settings
    // that way the user can pick which ones get shown etc
    // so that it's no longer hard coded here
    // this would require a bunch of refactoring btw..
    milestoneOptions: {
      RFP: 'RFP Release Date',
      'Board Approval': 'Board Approval',
      startDate: 'Start Date',
      RFQ: 'RFQ Release',
      meeting: 'One On One Meeting',
      'RFP Due': 'RFP Due',
      interviews: 'Interviews',
      draft: 'Draft Board Memo',
      contract: 'Contract Signing/Notice to Proceed',
      final: 'Final Completion',
      live: 'Go Live'
    },
    lastSearch: {}
  }),

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    isGridView() {
      return this.view.val === 'grid_view'
    },

    rowsPerPageItems() {
      if (this.isGridView) {
        return [8, 16, 24, { text: 'All', value: 10000 }]
      }

      return [5, 10, 25, { text: 'All', value: 10000 }]
    },

    headers() {
      let headers = [
        {
          text: '',
          value: 'picture',
          unexportable: true,
          sortable: false,
          fixed: true,
          width: this.headersWidth[0]
        },
        {
          text: this.$t('general.projectNumber'),
          value: 'number',
          fixed: true,
          width: this.headersWidth[1]
        }
      ]

      if (!this.isPlanned) {
        headers = headers.concat([
          { text: this.$t('general.status'), value: 'status' },
          { text: 'Status Comments', sorteable: false }
        ])
      }

      headers = headers.concat([
        {
          text: this.$t('general.campus'),
          value: 'campus'
          // fixed: true,
          // width: this.headersWidth[this.isPlanned ? 2 : 4]
        },
        {
          text: this.$tc('general.title', 1),
          value: 'title'
          // fixed: true,
          // width: this.headersWidth[this.isPlanned ? 3 : 5]
        }
      ])

      if (!this.isPlanned) {
        headers = headers.concat([
          {
            text: this.$t('general.description'),
            value: 'description',
            sortable: false
          },
          { text: this.$t('general.projectManager'), value: 'managerLabel' }
        ])
      }

      if (this.isPlanned) {
        headers = headers.concat(
          this.fiscalYears.map(year => ({
            text: year.name,
            value: `budgetsByFiscalYear.${year.name.toLowerCase()}`
          }))
        )
      }

      headers.push({
        text: this.$t('cpm.totalBudget'),
        value: 'budget',
        sortable: false
      })

      if (this.isPlanned) {
        headers = headers.concat([
          {
            text: this.$t('cpm.rfpReleaseDate'),
            value: 'RFP Date',
            sortable: false
          },
          {
            text: 'Board Approval/Kick-Off',
            value: 'kick-off',
            sortable: false
          }
        ])

        if (!this.showAllMileStones) {
          headers.push({
            text: this.$t('cpm.projectDuration'),
            value: 'duration',
            sortable: false
          })
        } else {
          headers = headers.concat([
            {
              text: this.$t('general.startDate'),
              value: 'startDate',
              sortable: false
            },
            {
              text: this.$t('cpm.rfqRelease'),
              value: 'RFQ Release',
              sortable: false
            },
            {
              text: this.$t('cpm.oneOnOne'),
              value: 'oneOnOne',
              sortable: false
            },
            { text: this.$t('cpm.rfpDue'), value: 'RFP Due', sortable: false },
            {
              text: this.$tc('general.interview', 2),
              value: 'interviews',
              sortable: false
            },
            {
              text: this.$t('cpm.draftBoardMemo'),
              value: 'memo',
              sortable: false
            },
            {
              text: this.$t('cpm.contractNotice'),
              value: 'signing/notice',
              sortable: false
            },
            {
              text: this.$t('cpm.finalCompletion'),
              value: 'finalCompletion',
              sortable: false
            },
            { text: this.$t('cpm.goLive'), value: 'goLive', sortable: false },
            {
              text: this.$t('cpm.projectDuration'),
              value: 'duration',
              sortable: false
            } // computed/function
          ])
        }
      }

      if (!this.isPlanned) {
        headers = headers.concat([
          {
            text: this.$t('cpm.budgetComments'),
            sortable: false
          },
          { text: this.$t('cpm.projects.spending'), sortable: false },

          {
            text: this.$t('cpm.projects.projectedFinalCost'),
            value: 'projectFinalCost'
          },
          { text: this.$t('cpm.projectStart'), sortable: false },
          { text: 'Construction Star', sortable: false },
          { text: 'Construction End', sortable: false }
        ])
      }

      headers.push({
        text: this.$t('general.actions'),
        value: 'name',
        sortable: false,
        unexportable: true
      })

      return headers
    },

    getDuration() {
      return item => {
        const budgetsByFiscalYear = this.gettingBudget(item) || []

        let years = 0
        for (let x = 0; x < budgetsByFiscalYear.length; x++) {
          if (budgetsByFiscalYear[x].plan > 0) years++
        }

        return years * 12 // to get months
      }
    },
    getDates() {
      return (id, which, mStones = {}) => {
        let temp = ''
        const listMilestones =
          Object.keys(mStones).length > 0 ? mStones : this.mileStones

        if (listMilestones[id]) {
          temp = listMilestones[id].find(
            m => m.title === this.milestoneOptions[which]
          )
        }

        if (!temp) return ''

        const date = temp.original
        return new Date(date).toLocaleDateString().split(',')[0]
      }
    },
    gettingBudget() {
      return item => {
        const budgetsToShow = this.fiscalYears.map(fy => ({ fy, plan: 0 }))

        const budgetsByFiscalYear = !item.budgetsByFiscalYear
          ? {}
          : item.budgetsByFiscalYear

        Object.keys(budgetsByFiscalYear).forEach(key => {
          const budget = budgetsToShow.find(b => b.fy === key.toUpperCase())
          if (budget) budget.plan = budgetsByFiscalYear[key]
        })

        return budgetsToShow
      }
    },
    getBudgetTotal() {
      return item => {
        let sum = 0

        const budgetsByFiscalYear = this.gettingBudget(item)

        for (let x = 0; x < budgetsByFiscalYear.length; x++) {
          sum += budgetsByFiscalYear[x].plan
        }

        return sum
      }
    },
    isPlanned() {
      return this.$route.name === 'cpm.forecasting.index'
    },
    indexParameters() {
      const parameters = {
        companyId: this.currentCompany.id,
        userId: this.$h.dg(window, 'Drupal.settings.m6_platform.uid'),
        filter: { forecasted: this.type === 'forecasted' },
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

      if (this.$h.dg(this, 'searchOption', []).length) {
        parameters.filter['status'] = {
          operator: 'in',
          value: this.searchOption
        }
      }

      if (this.view.val === 'favorites_view') {
        parameters.filter['id'] = { operator: 'in', value: this.favorites }
      }

      return parameters
    },

    getColor() {
      return key =>
        this.settingsProject.projectColors
          ? this.settingsProject.projectColors.find(p => p.key === key).color
          : this.defaultColors[key]
    },

    onSearchHooks() {
      return [this.updateFilterUserOptions]
    },

    searchOptions() {
      return this.$h.dg(this, 'settingsProject.status', []).sort()
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
    settingCollectionName() {
      if (this.$route.name.includes('forecasting')) {
        return 'planned_settings'
      } else {
        return 'settings'
      }
    },

    fiscalYears() {
      return this.$h.dg(this.settingsProject, 'fiscalYears', [])
    }
  },

  watch: {
    isGridView(v) {
      this.pagination.rowsPerPage = v ? 8 : 5
    },

    'pagination.page': async function () {
      if (this.isPlanned) {
        await this.getMileStones(this.resources)
      }
    },
    'pagination.rowsPerPage': async function (value) {
      if (this.isGridView) {
        db.collection('m6user')
          .doc(window.Drupal.settings.m6_platform.uid)
          .collection('pagination')
          .doc(this.isPlanned ? 'planned' : 'projects')
          .set({
            rowsPerPage: this.pagination.rowsPerPage
          })
      }
    },
    view(newVal) {
      const { pmOption, campusOption, searchOption } = this
      db.collection('m6user')
        .doc(window.Drupal.settings.m6_platform.uid)
        .collection('search')
        .doc(this.isPlanned ? 'planned' : 'projects')
        .set({
          pmOption: pmOption || 'All',
          campusOption: campusOption || 'All',
          searchOption: searchOption || ['All'],
          view: newVal
        })
    },

    user(newVal) {
      if (newVal.favProjects) this.favorites = [...newVal.favProjects]
    },

    async resources(newVal) {
      const ids = this.getIds(newVal)
      this.getImages(ids)
      if (this.isPlanned) {
        await this.getMileStones(newVal)
      }

      this.firstProjectId = this.$h.dg(newVal, '0.id')
      if (!this.hasSeenTheTour) {
        setTimeout(() => {
          this.startTour()
        }, 1500)
      }
    }
  },

  mounted() {
    const uid = window.Drupal.settings.m6_platform.uid
    this.fetchM6User(uid)
      .then(response => {
        this.hasSeenTheTour = this.$h.dg(response, 'tours.cpmProjects')
        if (!this.hasSeenTheTour) {
          const tours = {
            cpmProjects: true
          }
          db.collection('m6user')
            .doc(uid)
            .update({
              tours
            })
        }
      })
      .catch(error => {
        console.error(error)
      })
    db.collection('m6user')
      .doc(window.Drupal.settings.m6_platform.uid)
      .collection('pagination')
      .doc(this.isPlanned ? 'planned' : 'projects')
      .get().then(doc => {
        if (doc.exists) {
          const data = doc.data()
          if (data.rowsPerPage) {
            this.pagination.rowsPerPage = data.rowsPerPage
          }
        }
      })
  },

  methods: {
    ...mapActions('companies/cpmProjects', {
      indexResource: 'index',
      destroyResource: 'destroy'
    }),
    ...mapActions('companies/cpmProjects/general', {
      fetchM6User: 'fetchM6User'
    }),
    startTour() {
      this.$intro().exit()
      if (!this.firstProjectId) return
      let currentStepId = ''
      const steps = [
        {
          element: '#step1',
          intro: this.$t('tourProjectList.download')
        },
        {
          element: '#step2',
          intro: this.$t('tourProjectList.create')
        },
        {
          element: '#step3',
          intro: this.$t('tourProjectList.search')
        },
        {
          element: '#step4',
          intro: this.$t('tourProjectList.filter')
        },
        {
          element: '#step5',
          intro: this.$t('tourProjectList.views')
        },
        {
          element: '#step6',
          intro: this.$t('tourProjectList.open')
        },
        {
          element: '#step7',
          intro: this.$t('tourProjectList.end'),
          position: 'left'
        }
      ]
      if (!this.hasSeenTheTour) {
        steps.unshift({
          element: '#stepTourInitial',
          intro: this.$t('tourProjectList.initialMessage')
        })
        this.hasSeenTheTour = true
      }
      const introJS = this.$intro()
      introJS.addSteps(steps)
      introJS.setOptions({ tooltipClass: 'subheading' })
      introJS
        .start()
        .onchange(e => {
          const newStepId = this.$h.dg(e, 'id', 'step1')
          if (newStepId === 'step7' && currentStepId === 'step6') {
            this.$intro().exit()
            this.$router.push({
              name: 'cpm.projects.show',
              params: { id: this.firstProjectId, autoStartTour: true }
            })
          } else {
            currentStepId = this.$h.dg(e, 'id', 'step1')
          }
        })
        .onbeforeexit(() => {
          // returning false means don't exit the intro
          if (currentStepId !== 'step7') {
            currentStepId = 'step1'
            introJS.goToStep(steps.length)
            return false
          }
        })
    },
    getMileStones(projects, gettingCsv = false) {
      return new Promise(async (resolve, reject) => {
        try {
          const milestones = gettingCsv ? {} : this.mileStones
          const ids = projects.map(p => p.id)

          for (let x = 0; x < ids.length; x++) {
            await db
              .collection('cpm_projects')
              .doc(ids[x])
              .collection('milestones')
              .orderBy('title')
              .get()
              .then(snapshot => {
                milestones[ids[x]] = []
                for (let i = 0; i < snapshot.docs.length; i++) {
                  milestones[ids[x]].push(snapshot.docs[i].data())
                }
              })
          }
          resolve(milestones)
        } catch (e) {
          reject(e)
        }
      })
    },

    getBudgets(projects, gettingCsv = false) {
      return new Promise(async (resolve, reject) => {
        try {
          const ids = projects.map(p => p.id)
          const budgetsFiltered = gettingCsv ? [] : this.budgets
          for (let x = 0; x < ids.length; x++) {
            await db
              .collection('cpm_projects')
              .doc(ids[x])
              .collection('budgets')
              .orderBy('title')
              .get()
              .then(snapshot => {
                budgetsFiltered[ids[x]] = []
                for (let i = 0; i < snapshot.docs.length; i++) {
                  budgetsFiltered[ids[x]].push(snapshot.docs[i].data())
                }
              })
          }

          resolve(budgetsFiltered)
        } catch (e) {
          reject(e)
        }
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

      if (filter.view) this.view = filter.view

      if (filter.searchOption) this.searchOption = filter.searchOption

      if (!this.initialized) {
        this.setVarsFromUrlQuery(this.$route.query)
          .then(this.getUser)
          .then(this.fetchResources)
          .then(() => (this.initialized = true))
      } else {
        this.fetchResources()
      }
    },

    async deleteProject(project) {
      this.showLoading = true
      this.deleteProjectMessage = this.$t('general.sureDeleteResource', {
        resource: project.title
      })

      const rfpDocs = await db.collection('proposals').where('projectId', '==', project.id).get()

      if (!rfpDocs.empty) {
        this.rfpModalTitle = this.$t('cpm.projects.rfpModalTitle', {
          title: project.title,
          number: project.number
        })
        this.rfpModalMessage = this.$t('cpm.projects.rfpModalMessage', {
          title: project.title,
          number: project.number
        })
        this.deleteProjectMessage = '<strong>You have RFPs associated with this project.</strong> Are you sure you want to delete this project?'
        this.associatedRfps = rfpDocs.docs.map(rfp => ({
          id: rfp.id,
          ...rfp.data()
        }))
        this.showAssociatedRfpsModal = true
      } else {
        this.resourceToDelete = project
        this.showDeleteModal = true
      }

      this.showLoading = false
    },

    cancelDelete() {
      this.resourceToDelete = {}
      this.showDeleteModal = false
    },

    confirmDelete() {
      this.destroyResource({ id: this.resourceToDelete.id })
        .then(() => {
          this.loading = true

          setTimeout(() => {
            this.fetchResources()
            this.$snotify.success(
              `${this.$t('general.theProject')}: ${
                this.resourceToDelete.title
              } ${this.$t('general.hasBeenDeleted')}`,
              this.$t('alerts.success')
            )
          }, 3000)
        })
        .catch(() =>
          this.snotifyError(
            `${this.$t('general.thereErrorDeleting')} ${
              this.resourceToDelete.title
            }`
          )
        )
        .then(this.cancelDelete)
    },

    getDate(startDate) {
      if (!startDate) {
        return 'N/A'
      }

      return format(new Date(startDate), 'MM/d/YYYY')
    },

    goToProject(proj, newTab) {
      let path = ''

      if (this.$route.fullPath.search('/cpm/projects') !== -1) {
        path = window.location.origin + `/m6apps#/cpm/projects/${proj.id}`
      } else if (this.$route.fullPath.search('/cpm/forecasting') !== -1) {
        path = window.location.origin + `/m6apps#/cpm/forecasting/${proj.id}`
      } else {
        path = `/m6apps#/cpm/projects/${proj.id}`
      }

      if (!newTab) {
        window.location.href = path
      } else {
        window.open(path, '_blank')
      }
    },

    async downloadCSV() {
      this.loading = true

      // TODO: move to api
      // export to csv
      this.indexResource({ ...this.indexParameters, limit: 10000 })
        .then(async data => {
          const headersToExport = this.headers.filter(
            ({ unexportable }) => !unexportable
          )

          const headers = headersToExport.map(({ text }) => text)

          const rows = data.data.map(async item => {
            const obj = {}
            headersToExport.map(header => {
              obj[header.text] = item[header.value] || ''
            })

            if (this.isPlanned) {
              // const budgets = await this.getBudgets([item], true)
              const milestones = await this.getMileStones([item], true)

              this.gettingBudget(item).forEach(fy => {
                obj[fy.fy] = isNaN(fy.plan) ? 0 : fy.plan
              })

              obj['Total Budget'] = this.getBudgetTotal(item)

              obj['RFP Release Date'] = this.getDates(
                item.id,
                'RFP',
                milestones
              )
              obj['Board Approval/Kick-Off'] = this.getDates(
                item.id,
                'Board Approval',
                milestones
              )

              if (this.showAllMileStones) {
                obj['Start Date'] = this.getDates(
                  item.id,
                  'startDate',
                  milestones
                )
                obj['RFQ Release'] = this.getDates(item.id, 'RFQ', milestones)
                obj['One On One Meeting'] = this.getDates(
                  item.id,
                  'meeting',
                  milestones
                )
                obj['RFP Due'] = this.getDates(item.id, 'RFP Due', milestones)
                obj['Interviews'] = this.getDates(
                  item.id,
                  'interviews',
                  milestones
                )
                obj['Draft Board Memo'] = this.getDates(
                  item.id,
                  'draft',
                  milestones
                )
                obj['Contract Signing/Notice to Proceed'] = this.getDates(
                  item.id,
                  'contract',
                  milestones
                )
                obj['Final Completion'] = this.getDates(
                  item.id,
                  'final',
                  milestones
                )
                obj['Go Live'] = this.getDates(item.id, 'live', milestones)
              }

              obj['Project Duration'] = this.getDuration(item) + ' Months'
            }

            obj['Project Manager'] = this.getManagerLabel(item)
            obj['Campus'] = this.getCampus(item.campus)

            return obj
          })

          Promise.all(rows)
            .then(values =>
              this.exportCSVFile(headers, values, 'export', headersToExport)
            )
            .catch(() =>
              this.snotifyError(this.$t('general.thereErrorExporting'))
            )
            .then(() => (this.loading = false))
        })
        .catch(() => (this.loading = false))
    },

    exportCSVFile(header, items, fileName, headersToExport) {
      const newHeader = headersToExport.map(h => ({
        header: h.text,
        key: h.value,
        width: h.width || 16,
        style: { font: { name: 'Arial', size: 12 } }
      }))

      const workbook = new Excel.Workbook()
      const sheet = workbook.addWorksheet('sheet')
      sheet.columns = newHeader

      const firstRow = sheet.getRow(1)
      firstRow.height = 40
      firstRow.eachCell({ includeEmpty: false }, cell => {
        cell.font = { bold: true, name: 'Arial', size: 12 }
        cell.alignment = { horizontal: 'center', wrapText: true }
        cell.border = { bottom: { style: 'thin' } }
      })

      if (this.isPlanned) {
        for (let x = 4; x < 10; x++) {
          sheet.getColumn(x).numFmt = this.numFmt
        }
      }

      items.forEach(item => {
        const arr = this._.values(item)
        sheet.addRow(arr)
      })

      workbook.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob([data], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        saveAs(blob, `${fileName}.xlsx`)
      })
    },

    getUser() {
      return new Promise((resolve, reject) => {
        db.collection('m6user')
          .doc(this.userId)
          .get()
          .then(document => {
            const user = document.data()
            this.lastSearch = user.optionsFilter ? user.optionsFilter : {}
            this.search = this.$h.dg(
              user,
              this.isPlanned ? 'optionsFilter.searchPlannedList' : 'optionsFilter.searchProjectList',
              this.search
            )

            resolve()
          })
          .catch(reject)
      })
    },

    updateFilterUserOptions() {
      if (this.isPlanned) {
        this.lastSearch.searchPlannedList = this.search
      } else {
        this.lastSearch.searchProjectList = this.search
      }

      db.collection('m6user')
        .doc(this.userId)
        .update({
          optionsFilter: this.lastSearch
        })
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
      if (!usersId.length) {
        return
      }

      this.axios
        .post('/m6-platform/api/user_profile_images', {
          usersId
        })
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
    },
    goToProposal() {
      window.open(`${window.location.origin}/m6-rfp/#/`, '_blank')
    }
  },

  firestore() {
    return {
      user: db.collection('m6user').doc(this.userId),

      settingsProject: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('projects'),

      settingsUsers: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('users')
    }
  }
}
</script>

<style lang="scss" scoped>
/*
  pagination and status dropdown. and done. favorites hasn't been connected yet as far as i know.
*/
.deleteBtn {
  top: 0.625rem;
  right: 0.625rem;
}

.newTabBtn {
  top: 0.625rem;
  left: 0.625rem;
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
  min-height: 25.938rem;
}

.m6_btn-label {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.54);
  display: block;
}
.cpmCard {
  padding-bottom: 2rem;
  height: 100%;

  .v-card__actions {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 3.25rem;
    display: block;
  }
}

.title {
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
  margin-top: 2.5rem;
  margin-bottom: 0.625rem;
}

.m6-gray-text {
  color: #9e9e9e !important;
  caret-color: #9e9e9e !important;
}

.card-footer {
  padding-top: 3px !important;
  height: 100%;
}

.fullWidth {
  width: 100%
}

.customHeight2p5rem {
  height: 2.5rem;
}

.size3rem {
  height: 3rem;
  width: 3rem;
}

.customColor0D47A1 {
  color: #0D47A1;
}

.maxWidth9rem {
  max-width: 9.375rem
}
</style>

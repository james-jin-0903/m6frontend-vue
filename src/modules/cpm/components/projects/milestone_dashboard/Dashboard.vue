<template>
  <v-container
    class="fill-height ma-0 pa-0 rounded-lg"
    fluid
    grid-list-md
  >
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" class="rounded-lg">
          <v-card-text class="vertical-scroll">
            <v-row>
              <v-col cols="12">
                <div class="tableWrap">
                  <v-card>
                    <v-card-title>
                      <v-menu
                        ref="menu"
                        :close-on-content-click="false"
                        left
                        offset-y
                        :value="showing"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn
                            :color="filtering ? 'amber' : 'primary'"
                            light
                            v-on="on"
                          >
                            {{ $t('milestoneDashboard.filters') }} {{ counter ? '( ' + counter + ' )' : '' }}

                            <v-icon
                              light
                              right
                            >
                              mdi-filter-menu
                            </v-icon>
                          </v-btn>
                        </template>

                        <v-row
                          class="pa-3 white"
                          column
                        >
                          <v-col>
                            <v-select
                              v-model="campusFilter"
                              item-text="name"
                              item-value="value"
                              :items="alphabetical(campus, 'asc', 'name')"
                              label="Campus"
                              multiple
                              return-object
                            >
                              <template
                                slot="option"
                                slot-scope="option"
                              >
                                {{ option.name }}
                              </template>

                              <template slot="no-options">
                                {{ $t('milestoneDashboard.searchCampus') }}...
                              </template>
                            </v-select>
                          </v-col>

                          <v-col>
                            <v-select
                              v-model="managerFilter"
                              item-text="label"
                              item-value="value"
                              :items="alphabetical(users.projectManager, 'asc', 'label')"
                              label="Project Manager"
                              multiple
                              return-object
                            >
                              <template
                                slot="option"
                                slot-scope="option"
                              >
                                {{
                                  option.label
                                }}
                              </template>
                              <template slot="no-options">
                                {{ $t('ReportsGeneral.typeSearchUsers') }}
                              </template>
                            </v-select>
                          </v-col>

                          <v-col>
                            <v-select
                              v-model="projectStatus"
                              :items="alphabetical(settings.status, 'asc')"
                              label="Project Status"
                              multiple
                              return-object
                            />
                          </v-col>

                          <v-col>
                            <v-select
                              v-model="milestoneStatus"
                              :items="alphabetical(milestoneStatusOptions, 'asc')"
                              label="Milestone Status"
                              multiple
                              return-object
                            />
                          </v-col>
                        </v-row>
                      </v-menu>

                      <v-btn
                        color="blue"
                        dark
                        :loading="loading"
                        @click="filterAll"
                      >
                        {{ $t('milestoneDashboard.generate') }}
                      </v-btn>
                      <v-btn
                        color="green"
                        dark
                        :disabled="!canExport"
                        :loading="loadingExport"
                        @click="exportReport"
                      >
                        {{ $t('milestoneDashboard.exportReport') }}
                      </v-btn>
                      <v-spacer />
                      <v-text-field
                        v-model="search"
                        append-icon="search"
                        hide-details
                        :label="$t('milestoneDashboard.search')"
                        single-line
                      />
                    </v-card-title>
                    <div class="milestoneDashboardTable">
                      <v-data-table
                        class="fixed-header"
                        :headers="headers"
                        :items="options.projects"
                        :pagination.sync="pagination"
                        :search="search"
                        style="max-height: calc(75vh - 10px);backface-visibility: hidden;"
                      >
                        <template v-slot:headers="props">
                          <tr class="first">
                            <th
                              v-for="(h, i) in props.headers"
                              :key="'headerprops-' + i"
                              rowspan="2"
                              :style="{'background-color': '#EFEFEF', 'max-width': h.width || '300px', 'white-space': 'break-spaces'}"
                            >
                              {{ h.text }}
                            </th>
                            <th
                              v-for="(milestone, index) in milestones"
                              :key="index"
                              colspan="3"
                              :style="{ 'background-color': milestone.color ? milestone.color.hex : '#EFEFEF'}"
                              width="200"
                            >
                              {{ milestone.name ? milestone.name : milestone }}
                            </th>
                          </tr>
                          <tr class="second">
                            <th
                              v-for="(n, index) in (milestones.length*3)"
                              :key="'milestoneth-' + index"
                              :style="{ 'background-color': getColor(n) }"
                              width="100"
                            >
                              {{ (n%3 == 1) ? 'Original' : n%3 == 2 ? 'New' : 'Actual' }}
                            </th>
                          </tr>
                        </template>
                        <template v-slot:items="props">
                          <td>{{ props.item.campusTitle }}</td>
                          <td>
                            <v-menu offset-y>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  small
                                  text
                                  v-on="on"
                                >
                                  {{ props.item.number }}
                                </v-btn>
                              </template>
                              <v-list>
                                <v-list-tile>
                                  <v-list-tile-title @click="goToProject(props.item.id)">
                                    {{ $t('milestoneDashboard.goToProject') }}
                                  </v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile>
                                  <v-list-tile-title @click="monthlyReview(props.item)">
                                    {{ $t('milestoneDashboard.monthlyReview') }}
                                  </v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile>
                                  <v-list-tile-title @click="history(props.item)">
                                    {{ $t('milestoneDashboard.history') }}
                                  </v-list-tile-title>
                                </v-list-tile>
                              </v-list>
                            </v-menu>
                          </td>
                          <td>{{ props.item.title }}</td>
                          <td>{{ props.item.managerName }}</td>
                          <td>{{ props.item.status }}</td>
                          <td>{{ props.item.total.toLocaleString('en-US', { style: 'currency', currency: 'USD'}) }}</td>
                          <td>{{ props.item.lastUpdateText }}</td>
                          <td><div :class="['boxStatus', props.item.milestoneStatus]" /></td>
                          <td>{{ getCompleteBudget(props.item) }}</td>
                          <td>{{ getCompleteSchedule(props.item) }}</td>
                          <td
                            v-for="(mile, index) in props.item.milestones"
                            :key="index"
                            class="text-center"
                            :style="{ 'color': mile.color }"
                          >
                            <!-- -->
                            <v-menu
                              v-if="mile.type === 'new' && mile.original"
                              offset-y
                            >
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  :color="mile.color"
                                  small
                                  text
                                  v-on="on"
                                >
                                  {{ mile.date || '---' }}
                                </v-btn>
                              </template>
                              <v-list>
                                <v-list-tile>
                                  <v-list-tile-title @click="getComments(props.item, mile)">
                                    {{ $t('milestoneDashboard.showComments') }}
                                  </v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile>
                                  <v-list-tile-title @click="selectProject(props.item, mile)">
                                    {{ $t('milestoneDashboard.changeNewForecastedDate') }}
                                  </v-list-tile-title>
                                </v-list-tile>
                              </v-list>
                            </v-menu>
                            <v-menu
                              v-if="mile.type === 'actual'"
                              offset-y
                            >
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  small
                                  text
                                  v-on="on"
                                >
                                  {{ mile.date || '---' }}
                                </v-btn>
                              </template>
                              <v-list>
                                <v-list-tile>
                                  <v-list-tile-title @click="selectActualProject(props.item, mile)">
                                    Change Actual Completion Date
                                  </v-list-tile-title>
                                </v-list-tile>
                              </v-list>
                            </v-menu>
                            <span v-if="mile.type === 'original'">{{ mile.date || '---' }}</span>
                          </td>
                        </template>
                      </v-data-table>
                    </div>
                  </v-card>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="showComments"
      width="500"
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">{{ $t('milestoneDashboard.comments') }}</span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <v-list
            v-if="comments.length"
            class="commentList"
            two-line
          >
            <template v-for="(comment, index) in comments">
              <v-list-tile :key="index">
                <v-list-tile-content>
                  <v-list-tile-title>{{ comment.user }} {{ comment.lastName }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ $moment(comment.date).format('MM/DD/YYYY') }}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>{{ comment.comment }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider />
            </template>
          </v-list>
          <span
            v-else
            class="noComments"
          >{{ $t('milestoneDashboard.noComments') }}</span>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showForm"
      max-width="400px"
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            {{ $t('milestoneDashboard.milestoneInformation') }}
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <h3>{{ $t('milestoneDashboard.name') }}: {{ milestoneName }}</h3>
          <v-menu
            v-if="!validDates.length"
            v-model="projectedDatePicker"
            :close-on-content-click="false"
            full-width
            lazy
            max-width="290px"
            min-width="290px"
            :nudge-right="120"
            offset-y
            transition="scale-transition"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="projectedDateUsa"
                :error-messages="projectedDateError"
                hint="MM/DD/YYYY format"
                label="New Forecasted Date"
                persistent-hint
                prepend-inner-icon="event"
                v-on="on"
              />
            </template>

            <v-date-picker
              v-model="projectedDateForPicker"
              no-title
              @input="projectedDatePicker = false"
            />
          </v-menu>
          <v-select
            v-else
            v-model="projectedDateUsa"
            :items="validDates"
            label="New Forecasted Date"
            @change="updateCustomMilestone"
            @focus="firstTime = false;"
          />
          <v-textarea
            v-if="showProjectComments"
            v-model="comment"
            label="Milestone Updates Comments"
            :rules="[rules.required]"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue"
            outline
            @click.prevent="showForm = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-3"
            dark
            @click.prevent="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showFormActual"
      max-width="400px"
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            Milestone Information
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <h3>Name: {{ milestoneName }}</h3>
          <v-menu
            v-model="actualDatePicker"
            :close-on-content-click="false"
            full-width
            lazy
            max-width="290px"
            min-width="290px"
            :nudge-right="120"
            offset-y
            transition="scale-transition"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="actualDateUsa"
                :error-messages="actualDateError"
                hint="MM/DD/YYYY format"
                label="Actual Completion Date"
                persistent-hint
                prepend-inner-icon="event"
                v-on="on"
              />
            </template>

            <v-date-picker
              v-model="actualDateForPicker"
              no-title
              @input="actualDatePicker = false"
            />
          </v-menu>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue"
            outline
            @click.prevent="showFormActual = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-3"
            dark
            @click.prevent="saveActual"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showModal"
      persistent
      scrollable
      :width="800"
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">{{ $t('cpm.projects.milestones.modalEditForecastedDateTitle') }}</span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <v-container
            class="rounded-lg"
            fluid
            grid-list-md
          >
            <v-row>
              <v-col>
                <table class="milestoneTable">
                  <tr>
                    <th>{{ $t('milestoneDashboard.milestone') }}</th>
                    <th>{{ $t('milestoneDashboard.original') }}</th>
                    <th>{{ $t('milestoneDashboard.new') }}</th>
                    <th>{{ $t('milestoneDashboard.newUpdated') }}</th>
                    <th>{{ $t('milestoneDashboard.lastUpdated') }}</th>
                  </tr>
                  <tr
                    v-for="(mile, index) in futureMilestones"
                    :key="index"
                  >
                    <td>{{ mile.title }}</td>
                    <td class="text-center">
                      {{ $moment(mile.original).format('MM/DD/YYYY') }}
                    </td>
                    <td class="text-center">
                      {{
                        mile.projected
                          ? $moment(mile.projected).format('MM/DD/YYYY')
                          : ''
                      }}
                    </td>
                    <td>
                      <v-menu
                        v-model="mile.menu"
                        :close-on-content-click="false"
                        full-width
                        lazy
                        max-width="290px"
                        min-width="290px"
                        :nudge-right="120"
                        offset-y
                        transition="scale-transition"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="mile.forecastedUpdated"
                            prepend-inner-icon="event"
                            readonly
                            v-on="on"
                          />
                        </template>

                        <v-date-picker
                          v-model="mile.picker"
                          no-title
                          @input="updateLine(mile)"
                        />
                      </v-menu>
                    </td>
                  </tr>
                </table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="showModal = false"
          >
            {{ $t('general.no') }}
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="
              updateFutureMilestone = true
              showModal = false
            "
          >
            {{ $t('general.yes') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showMilestoneReviews"
      max-width="600px"
      scrollable
    >
      <template>
        <v-data-table
          :headers="milestoneHeaders"
          :items="milestoneReviews"
        >
          <template v-slot:items="props">
            <td>{{ $moment(props.item.date).format('MM/DD/YYYY') }}</td>
            <td>{{ props.item.action }}</td>
            <td>{{ props.item.user.name }} {{ props.item.user.lastName }}</td>
            <td>{{ props.item.comment }}</td>
          </template>
        </v-data-table>
      </template>
    </v-dialog>

    <v-dialog
      v-model="showReview"
      max-width="600px"
      per
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            Monthly Review
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text
          v-if="project.monthlyReview"
          class="vertical-scroll"
        >
          <v-textarea
            v-model="comment"
            label="Comments"
          />
        </v-card-text>
        <v-card-text
          v-else
          class="vertical-scroll"
        >
          <p>You already did it</p>
        </v-card-text>
        <v-card-actions v-if="project.monthlyReview">
          <v-spacer />
          <v-btn
            color="blue"
            outline
            @click.prevent="showReview = false;"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-3"
            dark
            @click.prevent="saveMonthlyReviews"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { db } from '@/utils/Firebase'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'MilestoneDashboard,'
  data() {
    return {
      headers: [
        { text: this.$t('milestoneDashboard.campus'), value: 'campus' },
        { text: this.$t('milestoneDashboard.number'), value: 'number' },
        { text: this.$t('milestoneDashboard.title'), value: 'title' },
        { text: this.$t('milestoneDashboard.manager'), value: 'managerName' },
        { text: this.$t('milestoneDashboard.status'), value: 'status' },
        { text: this.$t('milestoneDashboard.budget'), value: 'total' },
        {
          text: this.$t('milestoneDashboard.lastUpdated'),
          value: 'lastUpdateText'
        },
        {
          text: this.$t('milestoneDashboard.milestoneStatus'),
          value: 'MilestoneStatus'
        },
        {
          text: this.$t('milestoneDashboard.completeBudget'),
          value: 'completeBudget',
          width: '80px'
        },
        {
          text: this.$t('milestoneDashboard.completeSchedule'),
          value: 'completeSchedule',
          width: '80px'
        }
      ],
      milestoneHeaders: [
        {
          text: this.$t('milestoneDashboard.date'),
          value: 'date',
          sortable: false
        },
        {
          text: this.$t('milestoneDashboard.action'),
          value: 'action',
          sortable: false
        },
        {
          text: this.$t('milestoneDashboard.user'),
          value: 'user',
          sortable: false
        },
        {
          text: this.$t('milestoneDashboard.comments'),
          value: 'comment',
          sortable: false
        }
      ],
      managerFilter: [],
      campusFilter: [],
      projectStatus: [],
      milestoneStatus: [],
      users: [],
      company_id: this.currentCompany.id.toString(),
      settings: {},
      loading: false,
      loadingExport: false,
      canExport: false,
      projects: [],
      options: {
        projects: []
      },
      milestones: [
        'RFP Release Date',
        'RFP Due Date',
        'Board Approval',
        'Contruction Start',
        'Go Live',
        'Closeout'
      ],
      milestoneStatusOptions: ['Green', 'Yellow', 'Red'],
      showComments: false,
      comments: [],
      showForm: false,
      projectedDatePicker: false,
      projectedDateForPicker: '',
      projectedDateUsa: '',
      showFormActual: false,
      actualDatePicker: false,
      actualDateForPicker: '',
      actualDateUsa: '',
      firstTime: true,
      project: {},
      showProjectComments: false,
      comment: '',
      rules: {
        required: value => !!value || 'Required.'
      },
      updateFutureMilestone: false,
      milestoneName: '',
      futureMilestones: [],
      milestone: {},
      showModal: false,
      pagination: { rowsPerPage: 25 },
      showMilestoneReviews: false,
      milestoneReviews: [],
      showReview: '',
      search: '',
      showing: false,
      validDates: []
    }
  },
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  methods: {
    orderProjects() {
      this.options.projects.sort(function (a, b) {
        if (a.campusName.toLowerCase() < b.campusName.toLowerCase()) {
          return -1
        } else if (a.campusName.toLowerCase() > b.campusName.toLowerCase()) {
          return 1
        } else {
          if (a.managerName.toLowerCase() < b.managerName.toLowerCase()) {
            return -1
          } else if (a.managerName.toLowerCase() > b.managerName.toLowerCase()) {
            return 1
          } else {
            if (a.status.toLowerCase() < b.status.toLowerCase()) {
              return -1
            } else if (a.status.toLowerCase() > b.status.toLowerCase()) {
              return 1
            } else {
              return 0
            }
          }
        }
      })
    },
    updateCustomMilestone() {
      this.projectedDateForPicker = this.$moment(this.projectedDateUsa, 'MM/DD/YYYY').format('YYYY-MM-DD')
      this.getFutureMilestones()
    },
    getCompleteBudget(project) {
      if (project.totals) {
        const totals = project.totals
        if (totals.budgetTotal) {
          project.completeBudget = (totals.spendingTotal / totals.budgetTotal * 100).toFixed(0)
          return project.completeBudget
        }
      }
      return project.completeBudget
    },
    getCompleteSchedule(project) {
      if (project.startDate && project.endDate) {
        const start = this.$moment(project.endDate)
        const end = this.$moment(project.startDate)
        const days = this.$moment.duration(start.diff(end)).asDays()

        const currentDate = this.$moment(new Date())
        const currentDays = this.$moment.duration(currentDate.diff(end)).asDays()
        if (currentDays >= days) {
          return 100
        }
        project.completeSchedule = (currentDays / days * 100).toFixed(0)
        return project.completeSchedule
      }
      return project.completeSchedule
    },
    saveFilterSettings() {
      db.collection('m6user')
        .doc(window.Drupal.settings.m6_platform.uid)
        .collection('search')
        .doc('milestoneDashboard')
        .set({
          managerFilter: this.managerFilter || [],
          campusFilter: this.campusFilter || [],
          projectStatus: this.projectStatus || [],
          milestoneStatus: this.milestoneStatus || [],
          search: this.search || ''
        })
    },
    loadFilters() {
      db.collection('m6user')
        .doc(window.Drupal.settings.m6_platform.uid)
        .collection('search')
        .doc('milestoneDashboard')
        .get()
        .then(snapshot => {
          if (snapshot.exists) {
            const data = snapshot.data()
            this.managerFilter = data.managerFilter || []
            this.campusFilter = data.campusFilter || []
            this.projectStatus = data.projectStatus || []
            this.milestoneStatus = data.milestoneStatus || []
            this.search = data.search || ''

            this.showing = true
          }
        })
    },
    goToProject(id) {
      window.open('/m6apps#/cpm/projects/' + id, '_blank')
    },
    saveMonthlyReviews() {
      db.collection('cpm_projects').doc(this.project.id).collection('milestoneReviews').add({
        date: new Date().toISOString(),
        user: window.Drupal.settings.m6_platform_header.user,
        action: 'Monthly Review',
        comment: this.comment
      })
      db.collection('cpm_projects').doc(this.project.id).update({
        lastMilestoneUpdateUser: window.Drupal.settings.m6_platform_header.user,
        lastMilestoneUpdateDate: new Date().toISOString()
      })
      this.showReview = false
    },
    getMilestonesReviews(project) {
      this.milestoneReviews = []
      db.collection('cpm_projects')
        .doc(project.id)
        .collection('milestoneReviews')
        .orderBy('date', 'desc').get().then(milestones => {
          const date = new Date().toISOString().substring(0, 7)
          milestones.docs.forEach(doc => {
            const data = doc.data()
            this.milestoneReviews.push(data)
            if (data.user.email === window.Drupal.settings.m6_platform_header.user.email &&
            data.date.search(date) !== -1 &&
            data.action === 'Monthly Review') {
              project.monthlyReview = false
            }
          })
        })
    },
    monthlyReview(project) {
      this.getMilestonesReviews(project)
      this.project = project
      this.comment = ''
      this.showReview = true
    },
    history(project) {
      this.getMilestonesReviews(project)
      this.showMilestoneReviews = true
    },
    saveActual() {
      db.collection('cpm_projects')
        .doc(this.project.id)
        .collection('milestones')
        .doc(this.milestone.ref)
        .update({
          actual: this.$moment(this.actualDateUsa).toISOString()
        })
      const find = this.projects.find(p => p.id === this.project.id)
      const mile = find.milestones.find(m => m.type === 'actual' && m.ref === this.milestone.ref)
      mile.date = this.actualDateUsa

      this.$snotify.success('The Milestone has been updated', 'Success')
      this.showFormActual = false
    },
    save() {
      if (this.showProjectComments && !this.comment) {
        return false
      }
      db.collection('cpm_projects')
        .doc(this.project.id)
        .collection('milestones')
        .doc(this.milestone.ref)
        .update({
          projected: this.$moment(this.projectedDateUsa).toISOString()
        })
      db.collection('cpm_projects')
        .doc(this.project.id)
        .collection('milestones')
        .doc(this.milestone.ref)
        .collection('comments')
        .add({
          user: window.Drupal.settings.m6_platform_header.user.name,
          lastName: window.Drupal.settings.m6_platform_header.user.lastName,
          email: window.Drupal.settings.m6_platform_header.user.email,
          date: new Date().toISOString(),
          comment: this.comment
        })
      db.collection('cpm_projects')
        .doc(this.project.id)
        .collection('milestoneReviews').add({
          date: new Date().toISOString(),
          user: window.Drupal.settings.m6_platform_header.user,
          action: 'Update Milestone ' + this.milestone.title,
          comment: this.comment
        })
      const find = this.projects.find(p => p.id === this.project.id)
      const mile = find.milestones.find(m => m.type === 'new' && m.ref === this.milestone.ref)
      mile.date = this.projectedDateUsa
      if (this.updateFutureMilestone) {
        this.futureMilestones.forEach(m => {
          const newDate = this.$moment(m.picker).toISOString()
          m.ref.update({
            projected: newDate,
            userUpdate: window.Drupal.settings.m6_platform_header.user,
            lastUpdated: new Date().toISOString()
          })
          const mile = find.milestones.find(mi => mi.ref === m.id)
          if (mile) mile.date = this.$moment(newDate).format('MM/DD/YYYY')
        })
      }
      db.collection('cpm_projects').doc(this.project.id).update({
        lastMilestoneUpdateUser: window.Drupal.settings.m6_platform_header.user,
        lastMilestoneUpdateDate: new Date().toISOString()
      })
      this.$snotify.success('The Milestone has been updated', 'Success')
      this.showForm = false
    },
    updateLine(item) {
      item.forecastedUpdated = this.$moment(item.picker).format('MM/DD/YYYY')
    },
    getFutureMilestones() {
      const gantt = this.$h.dg(this.project, 'selectedGantt.value', {})
      if (this.milestone.original && gantt) {
        this.futureMilestones = []
        db.collection('cpm_projects')
          .doc(this.project.id)
          .collection('milestones')
          .where('gantt', '==', gantt)
          .where('original', '>', this.milestone.original)
          .get()
          .then(milestones => {
            if (!milestones.empty) {
              this.showModal = true
              const start = this.$moment(this.milestone.original)
              const end = this.$moment(this.projectedDateForPicker)
              const days = this.$moment.duration(start.diff(end)).asDays() * -1
              milestones.docs.forEach(milestone => {
                const data = milestone.data()
                data.id = milestone.id
                data.ref = milestone.ref
                data.menu = false
                data.forecastedUpdated = ''
                data.picker = ''

                const projected = this.$moment(data.original).add(days, 'days')
                data.forecastedUpdated = this.$moment(projected).format(
                  'MM/DD/YYYY'
                )
                data.picker = projected.toISOString()
                this.futureMilestones.push(data)
              })
            }
          })
      }
    },
    selectProject(project, mile) {
      this.validDates = []
      if (mile.name && mile.name.validDates) {
        this.validDates = mile.name.validDates.map(row => this.$moment(row).format('MM/DD/YYYY'))
      }
      this.firstTime = true
      if (mile.date) {
        this.projectedDateUsa = mile.date
        this.projectedDateForPicker = this.$moment(mile.protected).format('YYYY-MM-DD')
      } else {
        this.projectedDateForPicker = this.$moment(mile.original).format('YYYY-MM-DD')
      }

      this.project = project
      this.milestoneName = mile.name.name
      this.milestone = mile
      this.showProjectComments = false
      this.showForm = true
    },
    selectActualProject(project, mile) {
      this.firstTime = true

      if (mile.date) {
        this.actualDateUsa = mile.date
        this.actualDateForPicker = this.$moment(mile.actualDate).format('YYYY-MM-DD')
      } else {
        this.actualDateForPicker = this.$moment(mile.original).format('YYYY-MM-DD')
      }

      this.project = project
      this.milestoneName = mile.name.name
      this.milestone = mile
      this.showFormActual = true
    },
    checkMilestoneStatus(status) {
      if (!this.milestoneStatus.length) {
        return true
      }
      const find = this.milestoneStatus.find(m => m.toLowerCase() === status.toLowerCase())
      if (find) {
        return true
      }
      return false
    },
    getComments(project, mile) {
      this.comments = []
      if (mile.type === 'new' && mile.date) {
        if (!mile.comments.length && mile.ref) {
          db.collection('cpm_projects')
            .doc(project.id)
            .collection('milestones')
            .doc(mile.ref)
            .collection('comments')
            .orderBy('date').get().then(comments => {
              comments.docs.forEach(doc => {
                mile.comments.push(doc.data())
              })
            })
        }
        this.comments = mile.comments || []
      }
      this.showComments = true
    },
    getColor(number) {
      return '#EFEFEF'
    },
    managerName(item) {
      const find = this.users.projectManager.find(row => row.value == item.manager)
      if (find) {
        return find.label
      }
      return ''
    },
    filterAll() {
      this.canExport = false
      this.options.projects = this.projects.filter(p => {
        let project = true
        if (this.managerFilter.length) {
          project = false
          if (p.manager) {
            const find = this.managerFilter.find(r => r.email === p.manager.email)
            if (find) {
              project = true
            }
          }
        }

        if (project && this.campusFilter.length) {
          project = false
          if (p.campusName) {
            const find = this.campusFilter.find(row => row.name === p.campusName)
            if (find) {
              project = true
            }
          }
        }

        if (project && this.projectStatus.length) {
          project = false
          if (p.status) {
            const find = this.projectStatus.find(row => row === p.status)
            if (find) {
              project = true
            }
          } else {
            const find = this.projectStatus.find(row => row === 'N/A')
            if (find) {
              project = true
            }
          }
        }

        if (project) {
          return true
        }
      })

      for (const n in this.options.projects) {
        this.getDataProject(this.options.projects[n])
      }

      this.orderProjects()

      this.canExport = true
      this.saveFilterSettings()
    },

    async getDataProject(p) {
      const milestones = await db.collection('cpm_projects').doc(p.id)
        .collection('milestones')
        .get()

      this.milestones.forEach(row => {
        const find = milestones.docs.find(m => m.data().title === row.name)
        const data = find ? find.data() : false

        const dateOriginal = data && data.original ? this.$moment(data.original).format('MM/DD/YYYY') : ''
        const dateProjected = data && data.projected ? this.$moment(data.projected).format('MM/DD/YYYY') : ''
        const dateActual = data && data.actual ? this.$moment(data.actual).format('MM/DD/YYYY') : ''

        const start = this.$moment(data.original)
        const end = this.$moment(data.projected)
        const days = this.$moment.duration(start.diff(end)).asDays() * -1

        const color = (data.original && data.projected) ? (days <= 30 ? 'green' : days <= 90 ? 'yellow' : 'red') : ''

        const original = p.milestones.find(f => f.name === row && f.type === 'original')
        original.date = dateOriginal

        const projected = p.milestones.find(f => f.name === row && f.type === 'new')
        projected.date = dateProjected
        projected.original = data.original
        projected.protected = data.projected
        projected.color = color
        projected.ref = find ? find.id : false

        const actual = p.milestones.find(f => f.name === row && f.type === 'actual')
        actual.date = dateActual
        actual.actualDate = data.actual
        actual.ref = find ? find.id : false

        if (color && color === 'yellow' && p.milestoneStatus !== 'red') {
          p.milestoneStatus = color
        } else if (color && color === 'red') {
          p.milestoneStatus = color
        }
      })

      p.milestoneDocs = []
      milestones.docs.forEach(row => {
        p.milestoneDocs.push(row.data())
      })
    },
    selectAllManagers() {
      this.managerFilter = this.users.projectManager
    },
    selectAllCampus() {
      this.campusFilter = this.campus
    },
    selectAllProjectStatus() {
      this.projectStatus = this.settings.status
    },
    selectAllMilestoneStatus() {
      this.milestoneStatus = this.milestoneStatusOptions
    },
    exportReport() {
      const projects = this.options.projects.filter(row => {
        if (!this.milestoneStatus.length) {
          return true
        }
        const find = this.milestoneStatus.find(m => m.toLowerCase() === row.milestoneStatus.toLowerCase())
        if (find) {
          return true
        }
      })
      const data = {
        projects: projects,
        milestones: this.milestones
      }

      this.axios({
        data: data,
        url: '/cpm/projects/milestones',
        method: 'POST',
        responseType: 'blob'
      })
        .then(response => {
          if (response.headers.error) {
            this.$snotify.error(response.headers.error, 'Error')
          } else {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', response.headers['file-name'])
            document.body.appendChild(link)
            link.click()
          }
          this.loading = false
          this.dialog = false
        })
        .catch(error => {
          console.log('Error', error.message)
        })
    },
    getProjects() {
      db.collection('cpm_projects')
        .where('company_nid', '==', this.company_id)
        .orderBy('title')
        .get()
        .then(snapshot => {
          snapshot.forEach(async doc => {
            const auxProject = doc.data()
            if (
              !auxProject.forecasted &&
              !auxProject.soft_delete &&
              (!auxProject.status ||
              (auxProject.status.toLowerCase().search('archive') === -1))
            ) {
              auxProject.id = doc.id
              delete auxProject.capitalPlans
              delete auxProject.forecastedProject
              delete auxProject.files
              delete auxProject.budgetsByFiscalYear
              delete auxProject.spendingsByPeriod

              const aux = { id: doc.id }
              aux.startDate = auxProject.startDate
              aux.endDate = auxProject.endDate
              aux.selectedGantt = auxProject.selectedGantt

              aux.title = auxProject.title.trim() ? auxProject.title.trim() : 'N/A'
              aux.number = auxProject.number || 'N/A'
              aux.manager = auxProject.manager
              aux.managerName = auxProject.manager && auxProject.manager.label ? auxProject.manager.label : ''

              aux.status = auxProject.status || ''
              aux.totals = auxProject.totals
              aux.total = auxProject.totals ? auxProject.totals.budgetTotal : '0'
              aux.campus = auxProject.campus
              aux.campusName = auxProject.campus && auxProject.campus.name ? auxProject.campus.name : ''
              aux.campusTitle = auxProject.campus ? auxProject.campus.levelName : ''
              aux.monthlyReview = true
              aux.lastMilestoneUpdateUser = auxProject.lastMilestoneUpdateUser
              aux.lastMilestoneUpdateDate = auxProject.lastMilestoneUpdateDate
              aux.lastUpdateText = ''
              aux.completeBudget = 0
              aux.completeSchedule = 0

              if (auxProject.lastMilestoneUpdateUser) {
                aux.lastUpdateText = auxProject.lastMilestoneUpdateUser.name + ' ' + auxProject.lastMilestoneUpdateUser.lastName
                aux.lastUpdateText += '|' + this.$moment(auxProject.lastMilestoneUpdateDate).format('MM/DD/YYYY')
              }

              aux.milestones = []
              aux.milestoneStatus = 'green'

              this.milestones.forEach(row => {
                aux.milestones.push({
                  name: row,
                  type: 'original',
                  date: '',
                  color: ''
                })
                aux.milestones.push({
                  name: row,
                  type: 'new',
                  date: '',
                  color: '',
                  ref: false,
                  comments: []
                })
                aux.milestones.push({
                  name: row,
                  type: 'actual',
                  date: '',
                  color: ''
                })
              })

              this.projects.push(aux)
            }
          })
        })
        .catch(err => {
          console.log('err-----')
          console.log(err)
        })
    },
    getMilestones() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.milestonesCollection)
        .get()
        .then(settings => {
          if (settings.exists) {
            const data = settings.data()
            this.milestones = []
            data.names.forEach(row => {
              const find = data.milestones.find(m => m.name === row)
              if (find && find.displayOnDashboard) {
                this.milestones.push(find)
              }
            })
          }
        })
    },
    alphabetical(val, order = '', prop = '') {
      if (Array.isArray(val) && val.length > 0) {
        let value = [...val]
        switch (order) {
          case 'Ascending':
          case 'asc':
            value = value.sort((a, b) => {
              if (prop !== '') {
                return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0
              } else return a > b ? 1 : a < b ? -1 : 0
            })
            break
          case 'Descending':
          case 'desc':
            value = value.sort((a, b) => {
              if (prop !== '') {
                return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0
              } else return a > b ? 1 : a < b ? -1 : 0
            })
            break
          default:
            value = value
            break
        }
        return value
      } else {
        return val
      }
    }
  },
  firestore() {
    return {
      users: db
        .collection('settings')
        .doc(this.company_id)
        .collection('settings')
        .doc('users'),
      settings: db
        .collection('settings')
        .doc(this.company_id)
        .collection('settings')
        .doc('projects'),
      roles: db
        .collection('settings')
        .doc(this.company_id)
        .collection('settings')
        .doc('roles')
    }
  },
  computed: {
    ...mapGetters(['appLabel']),
    projectedDateError() {
      if (
        !this.$moment(this.projectedDateUsa, 'MM/DD/YYYY', true).isValid() &&
        this.projectedDateUsa !== ''
      ) {
        return 'Invalid Date MM/DD/YYYY'
      } else return []
    },
    actualDateError() {
      if (
        !this.$moment(this.actualDateUsa, 'MM/DD/YYYY', true).isValid() &&
        this.actualDateUsa !== ''
      ) {
        return 'Invalid Date MM/DD/YYYY'
      } else return []
    },
    campus() {
      const campusOptions = []
      let unique = ''

      if (!this.settings.campus) {
        return []
      }

      this.settings.campus.forEach(cl1 => {
        const itemName = cl1.abbr ? `(${cl1.abbr}) ${cl1.name}` : cl1.name
        unique = itemName + ' ' + new Date().valueOf()
        campusOptions.push({
          parentName: unique,
          name: itemName,
          levelName: cl1.name,
          levelAbbr: cl1.abbr,
          level: 1
        })

        if (cl1.lvl_1.length) {
          cl1.lvl_1.forEach(cl2 => {
            let itemL2Name = itemName + ' > '
            itemL2Name += cl2.abbr ? `(${cl2.abbr}) ${cl2.name}` : cl2.name
            campusOptions.push({
              parentName: unique,
              name: itemL2Name,
              levelName: cl2.name,
              levelAbbr: cl2.abbr,
              level: 2
            })

            if (cl2.lvl_2.length) {
              cl2.lvl_2.forEach(cl3 => {
                let itemL3Name = itemL2Name + ' > '
                itemL3Name += cl3.abbr ? `(${cl3.abbr}) ${cl3.name}` : cl3.name
                campusOptions.push({
                  parentName: unique,
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

      return campusOptions
    },
    counter() {
      let counter = 0
      if (this.managerFilter.length) counter++
      if (this.campusFilter.length) counter++
      if (this.projectStatus.length) counter++
      if (this.milestoneStatus.length) counter++
      if (this.search.length) counter++
      return counter
    },
    filtering() {
      return (
        this.managerFilter.length ||
        this.campusFilter.length ||
        this.projectStatus.length ||
        this.milestoneStatus.length ||
        this.search.length
      )
    }
  },
  watch: {
    search() {
      this.saveFilterSettings()
    },
    projectedDatePicker(isOpen) {
      if (isOpen) {
        this.firstTime = false
      }
    },
    projectedDateUsa(newValue, oldValue) {
      if (!this.firstTime) {
        this.showProjectComments = true
      }
    },
    projectedDateForPicker(value) {
      this.projectedDateUsa = this.$moment(value).format('MM/DD/YYYY')
      if (!this.firstTime) {
        this.getFutureMilestones()
      }
    },
    actualDatePicker(isOpen) {
      if (isOpen) {
        this.firstTime = false
      }
    },
    actualDateForPicker(value) {
      this.actualDateUsa = this.$moment(value).format('MM/DD/YYYY')
    }
  },
  mounted() {
    this.getMilestones()
    this.loadFilters()
    setTimeout(() => {
      this.getProjects()
    }, 1000)
  }
}
</script>

<style lang="scss">
  .milestoneDashboardTable {
    width: 100%;

    th {
      background: #EFEFEF;
      padding: 10px 0;
      min-width: 100px;
    }


    a {
      color: #1976d2 !important;
    }

    tbody {
      tr:nth-child(even) {
        background: #EFEFEF;
      }
    }

    td {
      font-size: 12px;

      &.text-center {
        text-align: center;
      }

      .v-btn {
        font-size: 12px;
      }
    }
    .yellow {
      color: #FF0;
    }
    .red {
      color: #F00;
    }
    .green {
      color: #0F0;
    }

    .boxStatus {
      width: 30px;
      height: 10px;
      border-radius: 5px;
      background-color: #0F0;
      margin: 0 auto;
    }
  }
  .commentList {
    max-height: 300px;
    overflow-y: scroll;
  }

  .noComments {
    padding: 10px;
  }
  .fixed-header {
    display: flex;
    flex-direction: column;
    height: 100%;

    th {
      position: sticky;
      top: 0;
      z-index: 5;
    }
    thead tr.second th, thead tr.second td {
      position: sticky;
      top: 56px;
    }
  }

  .fixed-header
  .fixed-header th:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  .fixed-header tr.v-datatable__progress th {
    height: 1px;
  }
  .fixed-header .v-table__overflow {
    flex-grow: 1;
    flex-shrink: 1;
    overflow-x: auto;
    overflow-y: auto;
  }
  .fixed-header .v-datatable.v-table {
    flex-grow: 0;
    flex-shrink: 1;
  }
  .fixed-header .v-datatable.v-table .v-datatable__actions {
    flex-wrap: nowrap;
  }
  .fixed-header
    .v-datatable.v-table
    .v-datatable__actions
    .v-datatable__actions__pagination {
    white-space: nowrap;
  }

</style>

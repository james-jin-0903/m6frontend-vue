<template>
  <m6-card-dialog title="Milestone Tracker">
    <template v-slot:after:title>
      <v-tooltip
        v-if="$route.name === 'cpm.projects.show'"
        left
      >
        <template v-slot:activator="{ on }">
          <a
            class="pointer pr-1"
            :href="'/m6apps#/cpm/projects/' + $route.params.id + '/fullscreen/milestones'"
            target="_blank"
            v-on="on"
          >
            <v-icon
              light
              text
            >
              mdi-launch
            </v-icon>
          </a>
        </template>
        <span>{{ $t('general.openNewTab') }}</span>
      </v-tooltip>

      <v-icon
        v-if="!projectClosed"
        class="cursor"
        light
        @click="newMilestone"
      >
        mdi-plus
      </v-icon>

      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-icon
            v-if="isAdmin"
            class="cursor"
            color="white"
            v-on="on"
            @click="showSettings = true"
          >
            mdi-cog
          </v-icon>
        </template>
        <span>Settings</span>
      </v-tooltip>
    </template>

    <v-dialog
      v-model="showForm"
      max-width="620px"
      scrollable
    >
      <milestone
        v-if="showForm"
        :milestone-id="milestoneId"
        :milestones-availables="milestonesAvailables"
        :project-id="projectId"
        :type="type"
        :user-can-edit-dates="userCanEditDates"
        @close="closeShowForm"
      />
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
        <v-card-text class="vertical-scroll">
          <v-textarea
            v-model="comment"
            label="Comment'"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue"
            outline
            @click.prevent="showReview = false; monthlyReview = false;"
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

    <v-dialog
      v-model="showMilestoneReviews"
      max-width="600px"
      scrollable
    >
      <template>
        <v-data-table
          class="elevation-1"
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

    <v-card-text class="card-text-milestones pa-0 vertical-scroll">
      <v-container
        class="pa-0 rounded-lg"
        fluid
        grid-list-md
      >
        <v-row>
          <v-col md="12">
            <v-data-table
              class="elevation-0"
              :headers="headers"
              :items="milestonesAvailables"
              :pagination.sync="pagination"
              :rows-per-page-items="rowsPerPageItems"
            >
              <template
                slot="items"
                slot-scope="props"
              >
                <td
                  class="text-left"
                  style="top: 50%;"
                >
                  <span>{{ props.item.title }}</span>
                </td>
                <td class="text-left">
                  {{ props.item.status }}
                </td>
                <td class="text-center">
                  {{ props.item.in_report ? 'Yes' : 'No' }}
                </td>
                <td class="text-center">
                  {{ props.item.original | monthDayYear }}
                </td>
                <td class="text-center">
                  <template v-if="props.item.projected !== null">
                    {{ props.item.projected | monthDayYear }}
                  </template>
                </td>
                <td class="text-center">
                  <template v-if="props.item.actual !== null">
                    {{ props.item.actual | monthDayYear }}
                  </template>
                </td>
                <td class="text-center">
                  <v-row justify="end">
                    <v-col class="shrink">
                      <v-icon
                        class="ml-0 mr-1 pointer"
                        color="#757575"
                        size="20"
                        text
                        @click.prevent="setMilestone(props.item)"
                      >
                        mdi-pencil
                      </v-icon>
                    </v-col>
                    <v-col class="shrink">
                      <v-icon
                        color="#f44336"
                        size="20"
                        text
                        @click.prevent="deleteMilestone(props.item)"
                      >
                        mdi-delete
                      </v-icon>
                    </v-col>
                  </v-row>
                </td>
              </template>
            </v-data-table>
            <v-card class="elevation-0 ma-0 pa-0 rounded-lg">
              <v-card-text class="ma-0 pa-0 vertical-scroll">
                <v-row class="justify ma-0 pa-0">
                  <v-spacer />
                  <v-btn
                    v-if="pagination.rowsPerPage !== -1"
                    class="button-showall"
                    color="primary"
                    fab
                    light
                    small
                    @click="pagination.rowsPerPage = -1"
                  >
                    <v-icon>
                      mdi-arrow-down-box
                    </v-icon>
                  </v-btn>
                  <v-btn
                    v-if="pagination.rowsPerPage === -1"
                    class="button-showall"
                    color="primary"
                    dark
                    fab
                    small
                    @click="pagination.rowsPerPage = 3"
                  >
                    <v-icon>
                      mdi-arrow-up-box
                    </v-icon>
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>

            <v-checkbox
              v-model="monthlyReview"
              class="monthlyReview"
              :disabled="monthlyReview"
              label="Monthly review"
              @change="checkShowReview"
            />

            <v-btn
              class="milestoneHistory"
              round
              small
              @click="showMilestoneReviews = true"
            >
              History
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <!--DELETE MODAL-->
    <m6-confirm-delete
      message="Are you sure to delete this milestone?"
      :show="milestoneDeleteModal"
      title="Delete Milestone"
      @cancel="cancelDelete"
      @confirm="submitDelete"
    />
    <!--DELETE MODAL-->
    <settings-modal
      v-if="showSettings && type !== 'forecasted'"
      :show="showSettings"
      @close="showSettings = false"
    />
    <planned-settings-modal
      v-if="showSettings && type === 'forecasted'"
      :included="true"
      :show="showSettings"
      @close="showSettings = false"
    />
  </m6-card-dialog>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

import { db } from '@/utils/Firebase'
import EventBus from '@/Eventbus'

import Milestone from './Milestone'
import {
  skipIterationForItems
} from '@/modules/cpm/components/helpers/HelpersFunction'
import settingsModal from '../../settings_modals/Milestones.vue'
import plannedSettingsModal from '../../settings_modals/planned/Milestones.vue'

export default {
  name: 'Milestones',
  components: {
    Milestone,
    'settings-modal': settingsModal,
    'planned-settings-modal': plannedSettingsModal
  },

  props: {
    pid: {
      type: [String, Number],
      default: undefined
    },

    dateRule: {
      type: Object,
      default: () => ({
        month: null,
        year: ''
      })
    },
    type: {
      type: String,
      default: 'project'
    }
  },

  data() {
    const projectId = this.pid ? this.pid : this.$route.params.id

    return {
      comment: '',
      showSettings: false,
      isAdmin: true,
      milestoneToDelete: {},
      milestoneHeaders: [
        { text: 'Date', value: 'date', sortable: false },
        { text: 'Action', value: 'action', sortable: false },
        { text: 'User', value: 'user', sortable: false },
        { text: 'Comment', value: 'comment', sortable: false }
      ],
      milestoneDeleteModal: false,
      showMilestoneReviews: false,
      showReview: false,
      projectId: projectId,
      projectRef: {},
      milestones: [],
      milestoneReviews: [],
      milestoneId: '',
      monthlyReview: false,
      showForm: false,
      headers: [
        { text: 'Milestone', value: 'title' },
        { text: 'Status', value: 'status' },
        { text: 'In Report', value: 'in_report' },
        {
          text: 'Original Forecasted Date',
          value: 'original'
        },
        { text: 'New Forecasted Date', value: 'projected' },
        { text: 'Actual Completion Date', value: 'actual' },
        { text: 'Actions', sortable: false }
      ],
      rowsPerPageItems: [3, 10, 20, 30, 40, { text: 'All', value: -1 }],
      pagination: {
        rowsPerPage: 3,
        sortBy: 'original'
      }
    }
  },

  computed: {
    ...mapState({
      selectedGantt: state => state.tickets.selectedGantt
    }),
    ...mapGetters(['appLabel']),
    ...mapGetters('cpm/projects', [
      'project'
    ]),
    ...mapGetters('cpm/settings/roles', [
      'userIsManager'
    ]),

    projectClosed() {
      const ma = new Set(this.milestonesAvailables.map(({ title }) => title.toLowerCase()))

      return ma.has('go live') || ma.has('end date')
    },

    milestonesAvailables() {
      if (!this.$h.dg(this.selectedGantt, 'value') || this.$h.dg(this.selectedGantt, 'value') === 'default') {
        return this.milestones
      }

      const milestones = this.milestones.filter(milestone => milestone.gantt === this.selectedGantt.value)

      if (this.dateRule.month === null || this.dateRule.year === '') {
        return milestones
      }

      const auxMilestones = []

      milestones.map(milestone => {
        const auxDate = new Date(milestone.original)

        const skip = skipIterationForItems(auxDate, this.dateRule)

        if (skip) return

        auxMilestones.push(milestone)
      })

      return auxMilestones
    },

    userCanEditDates() {
      if (this.$h.dg(this.project, 'lockMilestoneDates') && !this.userIsManager) {
        return true
      } else {
        return false
      }
    }
  },

  created() {
    this.checkUserRole({ role: 'manager' })
  },

  firestore() {
    if (this.$route.name === 'cpm.reports') {
      this.projectRef = db
        .collection(this.appLabel.firebaseCollection)
        .doc(this.pid)
    } else {
      this.projectRef = db
        .collection(this.appLabel.firebaseCollection)
        .doc(this.$route.params.id)
    }

    return {
      milestones: this.projectRef.collection('milestones').orderBy('title')
    }
  },

  beforeMount() {
    this.projectId = this.pid ? this.pid : this.$route.params.id
  },

  mounted() {
    this.getMilestoneReviews()
  },
  methods: {
    ...mapActions('cpm/settings/roles', [
      'checkUserRole'
    ]),
    checkShowReview() {
      if (this.monthlyReview) {
        this.showReview = true
      }
    },
    closeShowForm() {
      this.showForm = false
      this.getMilestoneReviews()
    },
    getMilestoneReviews() {
      this.milestoneReviews = []
      db.collection('cpm_projects').doc(this.project.id).collection('milestoneReviews').orderBy('date', 'desc').get().then(milestones => {
        const date = new Date().toISOString().substring(0, 7)
        milestones.docs.forEach(doc => {
          const data = doc.data()
          this.milestoneReviews.push(data)
          if (data.user.email === window.Drupal.settings.m6_platform_header.user.email &&
            data.date.search(date) !== -1 &&
            data.action === 'Monthly Review') {
            this.monthlyReview = true
          }
        })
      })
    },
    saveMonthlyReviews() {
      this.projectRef.collection('milestoneReviews').add({
        date: new Date().toISOString(),
        user: window.Drupal.settings.m6_platform_header.user,
        action: 'Monthly Review',
        comment: this.comment
      })
      this.projectRef.update({
        lastMilestoneUpdateUser: window.Drupal.settings.m6_platform_header.user,
        lastMilestoneUpdateDate: new Date().toISOString()
      })
      this.monthlyReview = true
      this.comment = ''
      this.showReview = false
      this.getMilestoneReviews()
    },
    newMilestone() {
      this.projectRef
        .collection('milestones')
        .add({
          title: 'New Milestone',
          in_report: false,
          original: new Date().toISOString(),
          projected: '',
          actual: ''
        })
        .then(doc => {
          this.milestoneId = doc.id
          this.showForm = true
        })
    },

    setMilestone(milestone) {
      this.milestoneId = milestone.id
      this.showForm = true
    },

    deleteMilestone(milestone) {
      this.milestoneToDelete = milestone
      this.milestoneDeleteModal = true
    },

    cancelDelete() {
      this.milestoneDeleteModal = false
      this.milestoneToDelete = {}
    },

    submitDelete() {
      this.projectRef
        .collection('milestones')
        .doc(this.milestoneToDelete.id)
        .delete()
        .then(() => {
          this.$snotify.success('The milestone has been deleted', 'success')
          this.cancelDelete()
          EventBus.$emit('cpm_project_schedule_changed')
        })
        .catch(() => {
          this.$snotify.error('The milestone was NOT been deleted', 'Error')
          this.cancelDelete()
        })
    },

    formatLinkData(data) {
      let returnText = ''

      data.forEach(d => {
        returnText += d.title + ', '
      })

      return returnText.slice(0, -2)
    }
  }
}
</script>

<style lang="scss" scoped>
.cpm-panel .card-text-milestones {
  min-height: 300px;
}

.cpm-panel .button-showall {
  margin-top: -17px;
  margin-right: 35px;
}
.monthlyReview {
  position: absolute;
  bottom: 0;
}
.milestoneHistory {
  position: absolute;
  bottom: 16px;
  left: 170px;
}
</style>

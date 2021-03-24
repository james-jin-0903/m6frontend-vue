<template>
  <v-navigation-drawer
    class="navigation-drawer"
    permanent
    width=""
  >
    <v-progress-circular
      v-if="loading"
      class="progress-circular"
      color="black"
      indeterminate
      size="50"
    />

    <div
      v-cloak
      v-if="project.id.length"
      v-show="!loading"
    >
      <!-- Avatar -->
      <v-hover>
        <v-row
          slot-scope="{ hover }"
        >
          <v-btn
            ref="step1"
            class="edit-button"
            color="white"
            dark
            fab
            small
            @click="openProjectDetails(0)"
          >
            <v-icon color="black">
              mdi-pencil
            </v-icon>
          </v-btn>

          <v-img
            :aspect-ratio="16 / 9"
            :class="['sidebar-image', 'img_' + project.data.priority]"
            max-width="100%"
            :src="
              project.data.projectImage ||
                'https://cdn.vuetifyjs.com/images/parallax/material.jpg'
            "
          >
            <v-row
              align="end"
              class="fill-height ma-0"
            >
              <v-col
                class="lightbox pl-2 pt-2 white--text"
                cols="12"
              >
                <v-menu
                  offset-y
                  open-on-hover
                  top
                >
                  <template v-slot:activator="{ on }">
                    <p
                      class="subheading text-truncate"
                      v-on="on"
                    >
                      {{ project.data.title || 'N/A' }}
                    </p>
                  </template>

                  <div class="pa-2 white">
                    {{ project.data.title || 'N/A' }}
                  </div>
                </v-menu>

                <v-row class="ma-0">
                  <v-col cols="6">
                    <p class="body-2 ma-0 text-truncate">
                      {{ getManagerLabel(project) || 'N/A' }}
                    </p>
                    <span class="caption">{{
                      $t('general.projectManager')
                    }}</span>
                  </v-col>

                  <v-col cols="6">
                    <p class="body-2 ma-0 text-truncate">
                      {{ project.data.number || 'N/A' }}
                    </p>
                    <span class="caption">{{
                      $t('general.projectNumber')
                    }}</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-img>
        </v-row>
      </v-hover>
      <!-- End avatar -->

      <slot name="after:description" />

      <v-divider class="ma-1 mb-3" />

      <!-- Fields -->
      <v-hover>
        <v-row
          slot-scope="{ hover }"
          class="pl-2"
          :class="['box-sidebar', 'img_' + project.data.priority]"
        >
          <v-col cols="4">
            <p class="body-2 ma-0 text-truncate">
              {{ project.data.status || 'N/A' }}
            </p>

            <span class="caption">{{ $t('cpm.budgetStatus') }}</span>
          </v-col>

          <v-col cols="8">
            <p class="body-2 ma-0 text-truncate">
              {{ getCampus(project) }}
            </p>

            <span class="caption">{{ $t('general.campus') }}</span>
          </v-col>

          <v-col cols="4">
            <p class="body-2 ma-0 text-truncate">
              {{ project.data.completion || '0' }} %
            </p>

            <span class="caption">{{ $t('general.completed') }}</span>
          </v-col>

          <v-col cols="8">
            <p class="body-2 ma-0 text-truncate">
              {{ getAddress(project) }}
            </p>

            <span class="caption">{{ $t('general.address') }}</span>
          </v-col>

          <v-col
            v-show="showProjectType"
            cols="4"
          >
            <p class="body-2 ma-0 text-truncate">
              {{ project.data.projectType || 'N/A' }}
            </p>

            <span class="caption">{{ $t('cpm.projects.projectType') }}</span>
          </v-col>

          <v-col cols="4">
            <p class="body-2 ma-0 text-truncate">
              {{ project.data.category || 'N/A' }}
            </p>

            <span class="caption">{{ $tc('general.category', 1) }}</span>
          </v-col>

          <v-col cols="4">
            <p class="body-2 ma-0 text-truncate">
              {{ $h.dg(project, 'data.license', 'N/A').toString() }}
            </p>

            <span class="caption">{{ $t('general.regulatory') }}</span>
          </v-col>

          <v-col cols="4">
            <p class="body-2 ma-0 text-truncate">
              {{ project.data.phase || 'N/A' }}
            </p>

            <span class="caption">{{ $t('cpm.projects.phase') }}</span>
          </v-col>

          <v-col cols="4">
            <p class="body-2 ma-0 text-truncate">
              {{ project.data.squareFootage || 'N/A' }}
            </p>

            <span class="caption">{{ $t('cpm.projects.squareFootage') }}</span>
          </v-col>

          <v-col cols="4">
            <p class="body-2 ma-0 text-truncate">
              {{ project.data.fyApproved || 'N/A' }}
            </p>

            <span class="caption">{{ $t('cpm.projects.fyApproved') }}</span>
          </v-col>

          <v-col
            v-show="showProjectCreator"
            cols="4"
          >
            <template>
              <p class="body-2 ma-0 text-truncate">
                {{ getCreator(project.data) || 'N/A' }}
              </p>

              <p class="caption grey--text">
                {{ $t('cpm.projects.projectCreator') }}
              </p>
            </template>
          </v-col>

          <v-col cols="4">
            <p class="body-2 ma-0 text-truncate">
              {{ $h.dg(project, 'data.contractor.title', 'N/A') }}
            </p>
            <p class="caption grey--text">
              {{ $t('cpm.projects.generalContractor') }}
            </p>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="4">
                <template>
                  <p class="body-2 ma-0 text-truncate">
                    {{ parseDate(project.data.startDate) || 'N/A' }}
                  </p>

                  <p class="caption grey--text">
                    {{ $t('cpm.projectStartDate') }}
                  </p>
                </template>
              </v-col>

              <v-col cols="3">
                <p class="body-2 ma-0 text-truncate">
                  {{ parseDate(project.data.endDate) || 'N/A' }}
                </p>

                <p class="caption grey--text">
                  {{ $t('cpm.projectEndDate') }}
                </p>
              </v-col>

              <v-col cols="5">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      color="primary"
                      light
                      v-on="on"
                      @click="goToSchedule"
                    >
                      mdi-help
                    </v-icon>
                  </template>
                  <span>{{ $t('cpm.projects.autocalculatedSchedule') }}</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="5">
                <template>
                  <p class="body-2 ma-0 text-truncate">
                    {{
                      parseDate($h.dg(constructionData, 'start_date')) || 'N/A'
                    }}
                  </p>

                  <p class="caption grey--text">
                    {{ $t('cpm.constructionStartDate') }}
                  </p>
                </template>
              </v-col>

              <v-col cols="6">
                <p class="body-2 ma-0 text-truncate">
                  {{ parseDate($h.dg(constructionData, 'due_date')) || 'N/A' }}
                </p>

                <p class="caption grey--text">
                  {{ $t('cpm.constructionEndDate') }}
                </p>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="4">
            <p class="body-2 ma-0 text-truncate">
              {{ parseDate(project.data.phaseTargetDate) || 'N/A' }}
            </p>

            <p class="caption grey--text">
              {{ $t('cpm.projects.phaseTargetDate') }}
            </p>
          </v-col>

          <v-col cols="8">
            <p class="body-2 ma-0 text-truncate">
              {{ proposedSpend | currency }}
            </p>

            <p class="caption grey--text">
              {{ $t('cpm.projects.currentFYProposedSpend') }}
            </p>
          </v-col>

          <v-col cols="4">
            <p class="body-2 ma-0 text-truncate">
              {{ getCompleteBudget() }}
            </p>

            <p class="caption grey--text">
              % Complete Budget
            </p>
          </v-col>

          <v-col cols="8">
            <p class="body-2 ma-0 text-truncate">
              {{ getCompleteSchedule() }}
            </p>

            <p class="caption grey--text">
              % Complete Schedule
            </p>
          </v-col>

          <v-col cols="12">
            <p
              class="body-2 ma-0"
              :class="{
                'text-truncate': !showAllDescription
              }"
            >
              {{ project.data.description || 'N/A' }}
            </p>

            <span
              v-if="$h.dg(project, 'data.description', '').length > 30"
              class="caption font-weight-medium"
              @click="showAllDescription = !showAllDescription"
            >
              {{
                showAllDescription
                  ? $t('cpm.projects.showLess')
                  : $t('cpm.projects.showMore')
              }}
            </span>

            <p class="caption grey--text">
              {{ $t('general.description') }}
            </p>
          </v-col>
        </v-row>
      </v-hover>

      <!-- End fields -->
    </div>

    <cpm-edit
      ref="cpmEdit"
      :show="showEditModal"
      :type="type"
      @close="reloadData"
    />
  </v-navigation-drawer>
</template>

<script>
import { db } from '@/utils/Firebase'
import CPMEdit from './modals/CPMEdit'
import { mapState, mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'Sidebar',
  components: {
    'cpm-edit': CPMEdit
  },
  props: {
    type: {
      type: String,
      default: 'project' // project,forecasted
    }
  },
  data() {
    return {
      showAllDescription: false,
      project: { id: '', data: {} },
      loading: false,
      showEditModal: false,
      showTitlePencil: false,
      showDescriptionPencil: false,
      showGeneralInformationPencil: false,
      showEditAvatar: false,
      roles: {},
      users: {},
      hideFields: {
        projectDetails: {
          projectCreator: { label: 'Project Creator', hide: true },
          projectType: { label: 'Project Type', hide: true }
        }
      },
      fiscalYears: []
    }
  },

  firestore() {
    return {
      roles: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('roles'),
      hideFields: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('fields')
    }
  },
  computed: {
    ...mapGetters('tickets', {
      constructionData: 'constructionData'
    }),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    ...mapState({
      selectedGantt: state => state.tickets.selectedGantt
    }),
    ...mapGetters(['appLabel']),
    showProjectType() {
      return !this.$h.dg(
        this.hideFields,
        'projectDetails.projectType.hide',
        false
      )
    },
    showProjectCreator() {
      return !this.$h.dg(
        this.hideFields,
        'projectDetails.projectCreator.hide',
        false
      )
    },
    proposedSpend() {
      const find = this.fiscalYears.find(f => f.actualFY === true)
      if (find) {
        return find.amount
      }
    },
    settingCollectionName() {
      if (this.type === 'forecasted') {
        return 'planned_settings'
      } else {
        return 'settings'
      }
    }
  },

  watch: {
    selectedGantt() {
      this.fetchConstructionData({
        projectId: this.$route.params.id
      })

      this.onCpmProjectScheduleChanged()
    }
  },

  created() {
    const projectId = this.$route.params.id

    this.fetchGantt({ projectId }).finally(() => {
      this.fetchConstructionData({
        projectId
      })
    })
  },

  mounted() {
    this.initData()
    this.onCpmProjectScheduleChanged()
    this.getFiscalYears()
  },

  methods: {
    getCompleteBudget() {
      if (this.project.data.totals) {
        const totals = this.project.data.totals
        if (totals.budgetTotal) {
          return (totals.spendingTotal / totals.budgetTotal * 100).toFixed(0)
        }
      }
      return '0'
    },
    getCompleteSchedule() {
      const project = this.project.data
      if (project.startDate && project.endDate) {
        const start = this.$moment(project.endDate)
        const end = this.$moment(project.startDate)
        const days = this.$moment.duration(start.diff(end)).asDays()

        const currentDate = this.$moment(new Date())
        const currentDays = this.$moment.duration(currentDate.diff(end)).asDays()

        return (currentDays / days * 100).toFixed(0)
      }
      return '0'
    },
    async onCpmProjectScheduleChanged() {
      const type = this.$h.dg(this.selectedGantt, 'value', 'default')

      if (type) {
        const milestones = (
          await db
            .collection(this.appLabel.firebaseCollection)
            .doc(this.$route.params.id)
            .collection('tasks')
            .where('gantt', '==', type)
            .get()
        ).docs.map(doc => doc.data() || {})

        const ordered = this.lodash.orderBy(milestones, 'start_date')

        const startDate = this.$h.dg(ordered.shift(), 'start_date')
        const startDateText = this.parseDate(startDate)
        const endDate = this.$h.dg(this.lodash.last(ordered), 'start_date')
        const endDateText = this.parseDate(endDate)

        this.project.data.endDate = endDate
        this.project.data.endDateText = endDateText

        this.project.data.startDate = startDate
        this.project.data.startDateText = startDateText

        await db.collection('cpm_projects')
          .doc(this.$route.params.id)
          .update({
            endDate,
            endDateText,
            startDate,
            startDateText
          })
      }
    },
    ...mapActions('tickets', {
      fetchConstructionData: 'fetchConstructionData',
      fetchGantt: 'fetchGantt'
    }),
    getCreator(item) {
      if (item.creator && item.creator.label) {
        return item.creator.label
      }

      return 'N/A'
    },
    parseDate(date) {
      if (!date) return ''
      const [year, month, day] = date.split('T')[0].split('-')

      return `${month}/${day}/${year}`
    },

    getAddress(project) {
      return (
        this.$h.dg(project, 'data.address.item.address') ||
        this.$h.dg(project, 'data.address.name') ||
        this.$h.dg(project, 'data.address', 'N/A')
      )
    },

    openProjectDetails(tab) {
      this.showEditModal = true
      this.$refs.cpmEdit.setTab(tab)
    },

    initData() {
      this.loading = true

      db.collection('cpm_projects')
        .doc(this.$route.params.id)
        .get()
        .then(snapshot => {
          this.project = { id: snapshot.id, data: snapshot.data() }
          this.loading = false
        })
        .catch(() => {
          this.$snotify.error('')
        })
    },

    getManagerLabel(data) {
      const item = data.data

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

    substringTextTo(string, reduceTo) {
      return string.substring(0, reduceTo)
    },

    getCampus(project) {
      return (
        this.$h.dg(project, 'data.campus.name') ||
        this.$h.dg(project, 'data.campus.0.name', 'N/A')
      )
    },

    reloadData() {
      this.initData()
      this.showEditModal = false
    },
    goToSchedule() {
      this.$emit('changeTab', 'schedule')
    },
    getFiscalYears() {
      const now = this.$moment()
      let actual = false
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
        .get()
        .then(fy => {
          const data = fy.data()
          let count = 1
          const fiscalYears = data.fiscalYears.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          this.fiscalYears = fiscalYears.map(fiscalY => {
            fiscalY.actualFY = false
            fiscalY.show = false
            fiscalY.amount = 0
            if (actual && count <= 2) {
              fiscalY.show = true
              count++
            }
            if (this.$moment(fiscalY.startDate) <= now && this.$moment(fiscalY.endDate) >= now) {
              fiscalY.actualFY = true
              fiscalY.show = true
              actual = true
            }

            if (this.project.data.proposedFY) {
              const find = this.project.data.proposedFY.find(f => f.value === fiscalY.value)
              if (find) {
                fiscalY.amount = find.amount
              }
            }
            return fiscalY
          })
        })
    }
  }

}
</script>

<style lang="scss" scoped>
.navigation-drawer {
  padding-left: 0.625rem;
}
.progress-circular {
  left: 43%;
}
.edit-button {
  cursor: pointer;
  position: absolute;
  right: 0px;
  z-index: 9999999999;
}
.sidebar-image {
  .lightbox {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .v-responsive__content {
    max-width: 100%;
  }

  &.img_yellow {
    .lightbox {
      background-color: rgba(255, 235, 59, 0.5);
    }
  }

  &.img_red {
    .lightbox {
      background-color: rgba(244, 67, 54, 0.5);
    }
  }

  &.img_green {
    .lightbox {
      background-color: rgba(76, 175, 80, 0.5);
    }
  }
}

.box-sidebar {
  padding-top: 0.938rem;
  padding-bottom: 0.938rem;

  .green--text {
    border: 1px solid #fff;
  }

  .priority {
    height: 1.25rem;
    width: 1.25rem;
    border-radius: 50%;
    border: 2px solid #fff !important;
    margin-left: 5px;
  }

  .flex {
    margin-bottom: 0.938rem;

    .text-truncate {
      line-height: 1 !important;
    }
  }

  .caption {
    color: #aaa;
  }
}
</style>

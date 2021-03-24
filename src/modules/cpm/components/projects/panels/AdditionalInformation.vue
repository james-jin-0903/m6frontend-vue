<template>
  <v-hover>
    <v-row
      class="pl-2"
      slot-scope="{ hover }"
    >
      <v-col cols="6">
        <div class="grey--text mb-1 subheading">
          Additional Information
        </div>
      </v-col>
      <v-col
        class="text-right"
        cols="6"
      >
        <v-icon
          v-show="hover"
          small
          @click="openProjectDetails(2)"
        >
          mdi-pencil
        </v-icon>
      </v-col>
      <v-col cols="4">
        <template v-if="!fields.projectCreator.hide">
          <p class="body-2 ma-0 text-truncate">
            {{ getCreator(project) || 'N/A' }}
          </p>
          <p class="caption grey--text">
            Project Creator
          </p>
        </template>
      </v-col>
      <v-col cols="8">
        <p class="body-2 ma-0 text-truncate">
          {{ project.contractor ? project.contractor.name : 'N/A' }}
        </p>
        <p class="caption grey--text">
          General Contractor
        </p>
      </v-col>

      <v-col cols="4">
        <template>
          <p class="body-2 ma-0 text-truncate">
            {{ parseDate(project.startDate) || 'N/A' }}
          </p>
          <p class="caption grey--text">
            Start Date
          </p>
        </template>
      </v-col>
      <v-col cols="8">
        <p class="body-2 ma-0 text-truncate">
          {{ parseDate(project.endDate) || 'N/A' }}
        </p>
        <p class="caption grey--text">
          End Date
        </p>
      </v-col>

      <v-col cols="4">
        <p class="body-2 ma-0 text-truncate">
          {{ parseDate(project.phaseTargetDate) || 'N/A' }}
        </p>
        <p class="caption grey--text">
          Phase Target Date
        </p>
      </v-col>
      <v-col cols="8">
        <p class="body-2 ma-0 text-truncate">
          {{ proposedSpend | currency }}
        </p>
        <p class="caption grey--text">
          Current FY Proposed Spend
        </p>
      </v-col>

      <v-col cols="12">
        <p class="body-2 ma-0 text-truncate">
          {{ project.description || 'N/A' }}
        </p>
        <p class="caption grey--text">
          Description
        </p>
      </v-col>

      <cpm-edit
        ref="cpmEdit"
        :show="showEditModal"
        @close="reloadData"
      />
    </v-row>
  </v-hover>
</template>

<script>
import { mapState } from 'vuex'
import { db } from '@/utils/Firebase'

import CPMEdit from '../modals/CPMEdit'

export default {
  name: 'AdditionalInformation',

  components: {
    'cpm-edit': CPMEdit
  },

  data: () => ({
    project: {},
    showEditModal: false,
    fields: {
      projectCreator: { label: 'Project Creator', hide: true }
    }
  }),

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    proposedSpend() {
      return !this.project.proposedSpend || isNaN(this.project.proposedSpend)
        ? 0
        : this.project.proposedSpend
    }
  },

  created() {
    this.initData()
  },

  methods: {
    initData() {
      db.collection('cpm_projects')
        .doc(this.$route.params.id)
        .get()
        .then(snapshot => {
          this.project = { id: snapshot.id, ...snapshot.data() }
        })
        .catch(() => {
          this.$snotify.error('')
        })

      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('fields')
        .get()
        .then(settings => {
          if (settings.exists) {
            const data = settings.data()

            if (data.projectDetails) {
              for (const index in data.projectDetails) {
                if (this.fields[index]) {
                  this.fields[index].hide = data.projectDetails[index].hide
                }
              }
            }
          }
        })
    },

    getCreator(item) {
      if (item.creator && item.creator.label) {
        return item.creator.label
      }

      return ''
    },

    parseDate(date) {
      if (!date) {
        return ''
      }
      const auxDate = new Date(date)
      return auxDate.toLocaleDateString('en-US')
    },

    openProjectDetails(tab) {
      this.showEditModal = true
      this.$refs.cpmEdit.setTab(tab)
    },

    reloadData() {
      this.initData()
      this.showEditModal = false
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-row {
  font-family: 'Roboto', sans-serif;
  line-height: 1.5;
}
</style>

<template>
  <m6-card-dialog :title="$tc('general.schedule', 1)">
    <template v-slot:after:title>
      <v-tooltip
        v-if="$route.name === 'cpm.projects.show'"
        bottom
      >
        <template v-slot:activator="{ on }">
          <a
            class="pointer pr-1"
            :href="'/m6apps#/cpm/projects/' + $route.params.id + '/fullscreen/schedule'"
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
        <span class="grey lighten-3 pa-1 rounded">{{ $t('general.openNewTab') }}</span>
      </v-tooltip>

      <v-icon
        class="pointer"
        light
        @click="openModal"
      >
        mdi-plus
      </v-icon>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon
            class="grey--text mx-1 pointer text--darken-1"
            v-on="on"
            @click="$refs.ganttSchedule.printFromVue('print')"
          >
            mdi-printer
          </v-icon>
        </template>
        <span class="grey lighten-3 pa-1 rounded">{{ $t('general.print') }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon
            class="grey--text mx-1 pointer text--darken-1"
            v-on="on"
            @click="$refs.ganttSchedule.printFromVue('share')"
          >
            mdi-share
          </v-icon>
        </template>
        <span class="grey lighten-3 pa-1 rounded">{{ $t('general.share') }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon
            v-if="isAdmin"
            class="grey--text ml-1 pointer text--darken-1"
            v-on="on"
            @click="showSettings = true"
          >
            mdi-cog
          </v-icon>
        </template>
        <span class="grey lighten-3 pa-1 rounded">{{ $t('general.settings') }}</span>
      </v-tooltip>
    </template>

    <v-container
      id="gantt"
      class="pa-0 rounded-lg"
      fluid
      grid-list-md
      style="overflow:hidden;"
    >
      <v-row
        class="mb-4"
      >
        <v-col md="12">
          <gantt
            :key="ganttKey"
            ref="ganttSchedule"
            :type="type"
            @showShareModal="shareModal($event)"
          />
        </v-col>
      </v-row>
    </v-container>

    <share-modal
      :show="showShare"
      :url="urlFromGantt"
      @close="showShare = false"
    />

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

    <v-dialog
      v-if="showTicket"
      v-model="showTicket"
      persistent
      scrollable
      width="600px"
    >
      <task
        :id="newTicketId"
        :gantt="selectedGantt.value"
        :type="type"
        @closeTask="closeTask"
      />
    </v-dialog>
  </m6-card-dialog>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

import Gantt from './Gantt'
import Task from './Task'
import settingsModal from '../../settings_modals/Schedule.vue'
import PlannedSettingsModal from '../../settings_modals/planned/Schedule.vue'
import ShareModal from './ShareModal'

export default {
  name: 'SchedulePanel',
  components: {
    Gantt,
    Task,
    'settings-modal': settingsModal,
    'planned-settings-modal': PlannedSettingsModal,
    'share-modal': ShareModal
  },

  props: {
    pid: {
      type: [String, Number],
      default: undefined
    },
    type: {
      type: String,
      default: 'project'
    }
  },

  data() {
    const projectId = this.pid ? this.pid : this.$route.params.id
    return {
      isAdmin: true,
      showSettings: false,
      projectId: projectId,
      showTicket: false,
      newTicketId: '',
      urlFromGantt: '',
      showShare: false
    }
  },

  computed: {
    ...mapState({
      selectedGantt: state => state.tickets.selectedGantt
    }),

    ...mapGetters({
      appLabel: 'appLabel',
      axiosSettings: 'axiosSettings',
      columns: 'gantt/columns',
      config: 'gantt/config',
      ganttKey: 'gantt/componentKey'
    })
  },

  mounted() {
    this.getCurrentFiscalYear({
      projectId: this.$route.params.id
    })
    this.getBudgetsByFiscalYear({
      projectId: this.$route.params.id
    })
    this.getAllFiscalYears()
  },

  methods: {
    ...mapActions('cpm/planned/forecasts', [
      'getCurrentFiscalYear',
      'getBudgetsByFiscalYear',
      'getAllFiscalYears'
    ]),
    async openModal() {
      const response = await this.$store.dispatch('tickets/addNew')
      this.newTicketId = response.taskId

      this.showTicket = true
    },

    closeTask() {
      this.showTicket = false
      this.newTicketId = ''
      this.$refs.ganttSchedule.closeTask()
    },
    shareModal(url) {
      this.urlFromGantt = url
      this.showShare = true
    }
  }
}
</script>

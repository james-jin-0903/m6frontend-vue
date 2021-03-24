<template>
  <div>
    <v-card>
      <v-card-text class="vertical-scroll">
        <div class="form-group">
          <h2>{{ $t('cpmSettings.hidePanels.title') }}</h2>

          <v-data-table
            class="elevation-0"
            :headers="headers"
            :items="panelData.panels"
            :pagination.sync="pagination"
            :rows-per-page-items="rowsPerPage"
          >
            <template v-slot:items="props">
              <td>{{ props.item.panelName }}</td>
              <td>{{ props.item.tabName }}</td>
              <td>
                <v-checkbox v-model="props.item.hide" />
              </td>
            </template>
          </v-data-table>

          <v-btn
            color="blue"
            dark
            type="submit"
            @click="save"
          >
            {{
              submitLoading ? `${$t('general.saving')}...` : $t('general.save')
            }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState } from 'vuex'

export default {
  name: 'HideCpmPanels',
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  data() {
    return {
      headers: [
        {
          text: this.$t('cpmSettings.hidePanels.tableHeaders.panelName'),
          value: 'panelName'
        },
        {
          text: this.$t('cpmSettings.hidePanels.tableHeaders.tabName'),
          value: 'tabName'
        },
        {
          text: this.$t('cpmSettings.hidePanels.tableHeaders.hide'),
          value: 'hide',
          sortable: false
        }
      ],
      rowsPerPage: [
        3,
        5,
        10,
        { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }
      ],
      pagination: {
        rowsPerPage: -1
      },
      element: '',
      currentElement: '',
      panelData: {},
      submitLoading: false
    }
  },
  mounted() {
    db.collection('settings')
      .doc(this.currentCompany.id)
      .collection('settings')
      .doc('cpmPanels')
      .get()
      .then(settings => {
        if (!settings.exists) {
          const panels = this.panelsModel()
          this.panelData = { panels }

          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('cpmPanels')
            .set({ panels })
        } else {
          this.panelData = settings.data()
        }
      })
  },
  methods: {
    panelsModel() {
      return [
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.financial'),
          panelName: this.$t('cpmSettings.hidePanels.panels.costSummary'),
          key: 'finCostSum',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.financial'),
          panelName: this.$t('cpmSettings.hidePanels.panels.commitments'),
          key: 'finCommit',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.financial'),
          panelName: this.$t('cpmSettings.hidePanels.panels.spending'),
          key: 'finSpend',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.financial'),
          panelName: this.$t('cpmSettings.hidePanels.panels.changes'),
          key: 'finChanges',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.financial'),
          panelName: this.$t('cpmSettings.hidePanels.panels.rfp'),
          key: 'finRFP',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.financial'),
          panelName: this.$t('cpmSettings.hidePanels.panels.budget'),
          key: 'finBudget',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.financial'),
          panelName: this.$t('cpmSettings.hidePanels.panels.estimates'),
          key: 'finEstim',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.schedule'),
          panelName: this.$t('cpmSettings.hidePanels.panels.mileTracker'),
          key: 'mileTracker',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.schedule'),
          panelName: this.$t('cpmSettings.hidePanels.panels.schedule'),
          key: 'mileSchedule',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.files'),
          panelName: this.$t('cpmSettings.hidePanels.panels.projFiles'),
          key: 'filesProject',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.updates'),
          panelName: this.$t('cpmSettings.hidePanels.panels.budgetCom'),
          key: 'updatesBudget',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.updates'),
          panelName: this.$t('cpmSettings.hidePanels.panels.statusCom'),
          key: 'updatesStatus',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.other'),
          panelName: this.$t('cpmSettings.hidePanels.panels.projTeam'),
          key: 'otherProj',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.other'),
          panelName: this.$t('cpmSettings.hidePanels.panels.safety'),
          key: 'otherSafety',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.financial'),
          panelName: this.$t('cpmSettings.hidePanels.panels.bulletins'),
          key: 'finBulletins',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.financial'),
          panelName: this.$t('cpmSettings.hidePanels.panels.changeOrders'),
          key: 'finChangeOrders',
          hide: false
        },
        {
          tabName: this.$t('cpmSettings.hidePanels.tabs.financial'),
          panelName: this.$t('cpmSettings.hidePanels.panels.buyOut'),
          key: 'finBuyOut',
          hide: false
        }
      ]
    },
    save() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('cpmPanels')
        .update({ panels: this.panelData.panels })
        .then(() => {
          this.$snotify.success(
            this.$t('cpmSettings.hidePanels.alerts.saved'),
            this.$t('alerts.success')
          )
        })
        .catch(() => {
          this.$snotify.error(
            this.$t('cpmSettings.hidePanels.alerts.error'),
            this.$t('alerts.error')
          )
        })
    }
  }
}
</script>

<style type="text/css" scoped>
.v-input--selection-controls {
  padding-top: 2rem;
}
</style>

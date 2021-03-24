<template>
  <m6-card-dialog title="RFP">
    <template v-slot:after:title>
      <v-tooltip
        v-if="$route.name === 'cpm.projects.show'"
        left
      >
        <template v-slot:activator="{ on }">
          <a
            class="pointer pr-1"
            :href="'/m6apps#/cpm/projects/' + $route.params.id + '/fullscreen/rfps'"
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
    </template>

    <v-dialog
      v-model="dialog"
      fullscreen
      scrollable
    >
      <proposal-dialog
        v-if="dialog"
        :rfp="rfpSelected"
        :rfp-id="rfpId"
        @closeDialog="closeDialog"
      />
    </v-dialog>

    <v-dialog
      v-model="dialogAddRfp"
      width="500"
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            Add RFP
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <v-container
            class="pa-0 rounded-lg"
            fluid
            grid-list-md
          >
            <v-row>
              <v-col md="12">
                <v-text-field
                  v-model="rfp.name"
                  hint="Provide a name that will display to Contractors"
                  label="RFP Name"
                  name="name"
                />
              </v-col>
              <v-col md="12">
                <div>
                  <label>Maximum Allowable Contract</label>
                  <money
                    v-model="rfp.cost"
                    v-bind="money"
                  />
                </div>
              </v-col>

              <v-col md="12">
                <div class="mt-4">
                  <label>Project Manager</label>
                  <v-select
                    v-model="rfp.manager"
                    clearable
                    item-text="label"
                    :items="managers"
                    return-object
                  />
                </div>
              </v-col>
              <v-col md="12">
                <div
                  class="mt-4"
                >
                  <label>RFP Preview</label>
                  <v-select
                    v-model="selectedTemplate"
                    clearable
                    item-text="name"
                    :items="templatesAvailables"
                    return-object
                  />
                </div>
              </v-col>
              <v-col md="12">
                <v-dialog
                  ref="dialogDate"
                  v-model="modalDate"
                  full-width
                  lazy
                  persistent
                  :return-value.sync="rfp.sharpBoard"
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="rfp.sharpBoard"
                      label="Sharp HealthCare Board"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="rfp.sharpBoard"
                    scrollable
                  >
                    <v-spacer />
                    <v-btn
                      color="primary"
                      text
                      @click="modalDate = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="$refs.dialogDate.save(rfp.sharpBoard)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="dialogAddRfp = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue"
            dark
            text
            @click="addRFP"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-text class="pa-0 vertical-scroll">
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
              :items="proposalsAvailables"
              :pagination.sync="pagination"
              :rows-per-page-items="rowsPerPageItems"
            >
              <template
                slot="items"
                slot-scope="props"
              >
                <td>
                  <a :href="`/m6-rfp#/proposal/${props.item.id}`">
                    {{ props.item.name }}
                  </a>
                </td>

                <td>
                  {{ props.item.rfpType }}
                </td>

                <td class="text-right">
                  <v-icon
                    class="ml-0 mr-0 pointer"
                    color="#757575"
                    size="20"
                    @click.prevent="show(props.item)"
                  >
                    mdi-eye-off-outline
                  </v-icon>
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
                    dark
                    fab
                    small
                    @click="pagination.rowsPerPage = -1"
                  >
                    <v-icon>
                      mdi-arrow-down-bold-box
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
                      mdi-arrow-up
                    </v-icon>
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </m6-card-dialog>
</template>

<script>
import ProposalDialog from './ProposalDialog'
import { db } from '@/utils/Firebase'
import { Money } from 'v-money'
import { mapState } from 'vuex'

export default {
  name: 'Rfps',
  components: {
    ProposalDialog,
    Money
  },
  data() {
    return {
      headers: [
        { text: 'RFP Name', value: 'name' },
        { text: 'RFP Type', value: 'rfpType' },
        { text: 'Actions', value: 'number', sortable: false }
      ],
      proposals: [],
      dialog: false,
      rfpSelected: null,
      rfpId: null,
      messenger: {
        modal: false,
        title: '',
        id: ''
      },
      dialogAddRfp: false,
      selectedTemplate: {},
      rfpTemplates: [],
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '$',
        precision: 2,
        masked: false
      },

      rfp: {
        name: '',
        cost: '',
        manager: null,
        dueDate: null,
        rfiDueDate: null
      },
      modalDate: false,
      managers: [],
      project: {},
      rfpSettings: {},
      rowsPerPageItems: [3, 10, 20, 30, 40, { text: 'All', value: -1 }],
      pagination: {
        rowsPerPage: 3
      }
    }
  },
  firestore() {
    return {
      rfpSettings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('rfp'),
      project: db.collection('cpm_projects').doc(this.$route.params.id),
      proposals: db
        .collection('proposals')
        .where('company_nid', '==', this.currentCompany.id)
        .orderBy('name'),
      rfpTemplates: db.collection('rfp_templates').where('company_nid', '==', this.currentCompany.id).orderBy('name')
    }
  },
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    proposalsAvailables() {
      return this.proposals.filter(proposal => proposal.projectId === this.$route.params.id)
    },
    templatesAvailables() {
      let aux = []
      if (this.rfpTemplates.length > 0) {
        aux = this.rfpTemplates.filter(template => template.active === true)
      }

      return aux
    }
  },
  async mounted() {
    const snapshot = await db
      .collection('settings')
      .doc(this.currentCompany.id)
      .collection('settings')
      .doc('users')
      .get()
    if (!snapshot.exists) {
      return
    }

    const aux = snapshot.data()
    this.managers = aux.projectManager
  },
  methods: {
    initializeDueDate(value) {
      if (value === '') {
        return ''
      }

      const date = new Date(value)
      date.setHours(15)
      date.setMinutes(0)
      date.setSeconds(0)
      return date.toISOString()
    },
    initializeRFIDate(value) {
      if (value === '') {
        return ''
      }

      const date = new Date(value)
      date.setHours(17)
      date.setMinutes(0)
      date.setSeconds(0)
      return date.toISOString()
    },
    getScoringAndInterviewing() {
      const aux = {
        scoring: [],
        interviewing: []
      }

      const settings = this.rfpSettings

      if (settings && settings.scoring && settings.scoring.length > 0) {
        aux.scoring = settings.scoring
      }

      if (
        settings &&
        settings.interviewing &&
        settings.interviewing.length > 0
      ) {
        aux.interviewing = settings.interviewing
      }
      return aux
    },

    addRFP() {
      const aux = new Promise(async (resolve, reject) => {
        try {
          const snapProject = await db
            .collection('cpm_projects')
            .doc(this.$route.params.id)
            .get()
          const project = snapProject.data()
          project.id = snapProject.id

          const aux = this.getScoringAndInterviewing()
          this.rfp.scoring = aux.scoring
          this.rfp.interviewing = aux.interviewing

          this.rfp.projectRef = db
            .collection('cpm_projects')
            .doc(this.$route.params.id)
          this.rfp.projectId = this.$route.params.id
          this.rfp.project = project
          this.rfp.company_nid = this.currentCompany.id
          this.rfp.invitations = []
          this.rfp.bidPackages = []
          this.rfp.risks = []
          this.rfp.lessonsLearned = []
          this.rfp.allowances = []
          this.rfp.alternates = []
          this.rfp.reviewPanel = []
          this.rfp.interviewPanel = []
          this.rfp.questionsPanel = []
          this.rfp.meetingsPanel = []
          this.rfp.rfpTemplatePreview = {
            body: '',
            components: [],
            tableOfContents: []
          }
          this.rfp.template = db.collection('rfp_templates').doc(this.selectedTemplate.id)
          const doc = await db.collection('proposals').add(this.rfp)
          this.rfp.project.files[0].children[0].children.push({
            name: this.rfp.name,
            path: this.rfp.project.files[0].children[0].path + '/' + doc.id,
            children: []
          })

          // adding default bid
          await db
            .collection('cpm_projects')
            .doc(this.$route.params.id)
            .collection('bid_packages')
            .add({
              name: 'default',
              description: 'default description'
            })
          await db
            .collection('cpm_projects')
            .doc(this.$route.params.id)
            .update({ files: this.rfp.project.files })

          this.dialogAddRfp = false

          window.location = `/m6-rfp#/proposal/${doc.id}`
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    showMessenger(rfp) {
      this.rfpId = rfp.id
      this.messenger.id = rfp.id
      this.messenger.title = rfp.name
      this.messenger.modal = true
    },
    show(rfp) {
      this.rfpSelected = rfp
      this.rfpId = rfp.id
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    }
  }
}
</script>

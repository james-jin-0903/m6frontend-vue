<template>
  <v-card
    v-if="rfp"
    style="overflow-y:auto"
  >
    <v-toolbar
      dark
      style="background-color:#1565c0;"
    >
      <v-btn
        dark
        icon
        @click="$emit('closeDialog')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>{{ rfp.name }}</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <!-- <flip-countdown
          v-if="deadline"
          class="pa-0"
          :deadline="deadline"
          :key="deadline"
          style="width: 100%; transform: scale(.6); margin-top: -7px;"
        ></flip-countdown>

        <flip-countdown
          v-if="deadlineRFI"
          class="pa-0"
          :deadline="deadlineRFI"
          :key="deadlineRFI"
          style="width: 100%; transform: scale(.6); margin-top: -7px;"
        ></flip-countdown> -->
      </v-toolbar-items>
    </v-toolbar>
    <v-img
      v-if="rfp.cover"
      height="200px"
      :src="rfp.cover.url"
    >
      <v-card
        dark
        flat
        style="background: transparent"
      >
        <v-card-text class="vertical-scroll">
          <v-chip
            color="blue"
            text-color="white"
          >
            <v-avatar class="blue darken-3">
              PR
            </v-avatar>
            {{ rfp.project.title }}
          </v-chip>
          <br>
          <v-chip
            color="blue"
            text-color="white"
          >
            <v-avatar class="blue darken-3">
              <v-icon>mdi-account-circle</v-icon>
            </v-avatar>
            {{ rfp.manager ? rfp.manager.label : '' }}
          </v-chip>
          <v-chip
            v-if="deadline"
            absolute
            bottom
            class="deadline-chip"
            color="blue"
            right
            text-color="white"
          >
            <v-avatar class="blue darken-2">
              <v-icon small>
                mdi-calendar
              </v-icon>
            </v-avatar>
            {{ deadline }}
          </v-chip>
        </v-card-text>
      </v-card>
    </v-img>
    <v-card
      v-else
      dark
      flat
      style="background: transparent"
    >
      <v-card-text class="vertical-scroll">
        <v-chip
          color="blue"
          text-color="white"
        >
          <v-avatar class="blue darken-3">
            PR
          </v-avatar>
          {{ rfp.project.title }}
        </v-chip>
        <br>
        <v-chip
          color="blue"
          text-color="white"
        >
          <v-avatar class="blue darken-3">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
          {{ rfp.manager ? rfp.manager.label : '' }}
        </v-chip>
        <v-chip
          absolute
          bottom
          class="deadline-chip"
          color="blue"
          right
          text-color="white"
        >
          <v-avatar class="blue darken-2">
            <v-icon small>
              mdi-calendar
            </v-icon>
          </v-avatar>
          {{ deadline }}
        </v-chip>
      </v-card-text>
    </v-card>

    <v-row
      class="mx-5"
    >
      <v-col cols="6">
        <v-card
          class="rounded-lg"
          flat
        >
          <v-card-text
            class="vertical-scroll"
            v-html="rfpBody"
          />
        </v-card>
        <v-divider />
        <v-card
          class="mt-4"
          flat
        >
          <v-card-title class="headline px-6 py-4 white">
            <span class="grey--text text--darken-1">
              Documents
            </span>
          </v-card-title>
          <v-divider class="grey lighten-3" />
          <v-card-text class="vertical-scroll">
            <v-treeview
              v-model="tree"
              activatable
              hoverable
              item-key="path"
              :items="projectFiles.children"
              open-on-click
            >
              <template
                slot="prepend"
                slot-scope="{ item, open, leaf }"
              >
                <v-icon
                  v-if="!item.file"
                  color="blue"
                >
                  {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                </v-icon>
                <v-icon v-else-if="item.file === 'image/jpeg' || item.file === 'image/png'">
                  mdi-image
                </v-icon>
                <v-icon v-else-if="item.file === 'application/pdf'">
                  mdi-file-pdf-box
                </v-icon>
                <v-icon v-else>
                  mdi-text-box-outline
                </v-icon>
              </template>
              <template
                slot="append"
                slot-scope="{ item }"
              >
                <a
                  v-if="item.file"
                  :href="item.url"
                  target="_blank"
                >
                  <v-icon small>mdi-folder-plus</v-icon>
                </a>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card
          class="rounded-lg"
          flat
        >
          <!--<v-card-title class="title ml-4">-->
          <!--Bid Packages <v-spacer></v-spacer>-->
          <!--<v-btn @click="expandAllPackages" text>Expand All</v-btn>-->
          <!--<v-btn @click="packagesPanel = []" text>Collapse All</v-btn>-->
          <!--</v-card-title>-->
          <v-card-text class="vertical-scroll">
            <v-expansion-panel
              v-model="packagesPanel"
              popout
            >
              <v-expansion-panel-content
                v-for="(item,i) in bidPackages"
                :key="i"
                class="elevation-0"
              >
                <div
                  slot="header"
                  class="pb-0"
                >
                  Invitation Feedback
                </div>
                <v-card class="pt-0 rounded-lg">
                  <v-card-text class="pt-0 vertical-scroll">
                    <feedback-table
                      :package-id="item.id"
                      :rfp-id="rfpId"
                    />
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <div class="">
              <h4>Table of Contents</h4>
              <ul class="table-of-contents">
                <li
                  v-for="(item, idx) in tableOfContents"
                  :key="idx"
                >
                  <h5>
                    <span
                      class="nav-item"
                      @click="scrollToElement(item.id)"
                    >
                      {{ item.title }}
                    </span>
                  </h5>
                  <template v-if="item.subSections.length">
                    <ul>
                      <li
                        v-for="(subSection, idx2) in item.subSections"
                        :key="idx2"
                      >
                        <h6>
                          <span
                            class="nav-item"
                            @click="scrollToElement(subSection.id)"
                          >{{ subSection.body }}</span>
                        </h6>
                      </li>
                    </ul>
                  </template>
                </li>
              </ul>
            </div>
            <hr>
            <!-- <div class="timeline" style="margin-top: 45px">
              <h4 class="text-center">Proposal Timeline</h4>
              <TimelineView :proposal="rfp" style="transform: scale(.6) translateY(-32%);"></TimelineView>
            </div> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div
      v-show="false"
      id="allowanceBody"
      v-html="allowanceBody"
    />
    <div
      v-show="false"
      id="alternateBody"
      v-html="alternateBody"
    />
  </v-card>
</template>

<script>
import { db } from '@/utils/Firebase'

// import FlipCountdown from 'vue2-flip-countdown'
import { DateTime } from 'luxon'
import { mountComponents } from './helpers/ProposalHelper.js'
import TimelineView from './PreviewComponents/TimelineView'
import ProposalGeneratePreview from './helpers/ProposalGeneratePreview'
import ProposalPreview from './helpers/ProposalPreview'
import FeedbackTable from './FeedbackTable'
import { mapState } from 'vuex'

export default {
  name: 'InvitationDialog',
  components: {
    // FlipCountdown,
    TimelineView,
    FeedbackTable
  },
  props: ['rfp', 'rfpId', 'download'],
  data() {
    return {
      deadline: null,
      deadlineRFI: null,
      projectFiles: [],
      packagesPanel: [],
      bidPackages: [],
      tree: [],
      tableOfContents: [],
      rfpBody: '',
      allowanceBody: '',
      alternateBody: '',
      datesInSchedule: {},
      scheduleDates: []
    }
  },
  firestore() {
    return {
      bidPackages: db.collection('proposals').doc(this.rfpId).collection('bid_packages')
    }
  },
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    proposalDates() {
      const aux = {}

      if (
        this.rfp.schedule &&
          this.rfp[this.getVModelKey('sharpBoard')] != null
      ) {
        Object.keys(this.datesInSchedule).forEach((key, index) => {
          const date = new Date(this.rfp[this.getVModelKey('sharpBoard')])
          date.setDate(date.getDate() - this.datesInSchedule[key].days)

          const completeKey = this.getVModelKey(key)
          aux[completeKey] = date.toISOString()
        })
      }

      return aux
    }
  },
  mounted() {
    this.getscheduleDates().then(() => {
      this.calculateDatesForUpdating()
    })


    db.collection('cpm_projects').doc(this.rfp.projectId).get().then(doc => {
      doc.data().files[0].children[0].children.find(c => {
        const path = doc.data().files[0].children[0].path + '/' + this.rfp.id
        if (c.path === path) {
          this.projectFiles = c
        }
      })

      const project = doc.data()
      if (this.rfp.rfpTemplatePreview) {
        this.createComponents(this.rfp.rfpTemplatePreview.components, project)
      }

      this.calculateTableOfContents()
    })
    setTimeout(() => {
      this.expandAllPackages()
    }, 500)
  },
  methods: {
    getscheduleDates() {
      const aux = new Promise((resolve, reject) => {
        try {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('rfp')
            .collection('scheduleDates')
            .orderBy('created_at', 'asc')
            .get()
            .then(snap => {
              if (!snap.empty) {
                snap.docs.forEach(doc => {
                  const aux = doc.data()
                  aux.id = doc.id
                  this.scheduleDates.push(aux)
                })
              }
              resolve(true)
            })
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },
    calculateDatesForUpdating() {
      if (!this.rfp.schedule || !this.rfp.schedule.slug) {
        return
      }

      const schedules = {}

      this.scheduleDates.forEach(scheduleDate => {
        if (scheduleDate[this.rfp.schedule.slug]) {
          schedules[scheduleDate.slug] = {
            days: parseInt(scheduleDate[this.rfp.schedule.slug]),
            name: scheduleDate.name
          }
        } else {
          schedules[scheduleDate.slug] = { days: 0, name: scheduleDate.name }
        }
      })

      this.datesInSchedule = schedules
    },
    getVModelKey(key) {
      if (this.rfp.schedule && this.rfp.schedule.slug) {
        return this.rfp.schedule.slug + '-' + key
      }
      return key
    },
    scrollToElement(id) {
      document.getElementById(id).scrollIntoView({
        behavior: 'smooth'
      })
    },
    expandAllPackages() {
      this.packagesPanel = [
        ...Array(this.bidPackages.length).keys()
      ].map(() => true)
    },
    createComponents(componentsArray, project) {
      const aux = new ProposalGeneratePreview(this.rfp.template, this.rfp, this.rfp.projectId, this.proposalDates)

      aux.calculatePreview().then(payload => {
        const proposalPreview = payload.proposalPreview
        const auxBody = proposalPreview.substituteValues(payload.fullTaggedTemplate, proposalPreview.getVariables())
        this.rfpBody = auxBody.body
        this.tableOfContents = payload.tableOfContents

        const project = payload.project
        const options = payload.options

        this.getAllowances(aux, proposalPreview, project, options).then(() => {
          aux.createComponents(proposalPreview.getComponentsToMount(), payload.project).then(() => {
            const payload = {
              body: document.getElementById('bodyPreview').outerHTML
            }
            this.$emit('componentsMounted', payload)
          })
        })
      })
    },
    solveAllowance(proposalGeneratePreview, allowance, indexAllowance, options, project, templates) {
      const auxPromise = new Promise((resolve, reject) => {
        try {
          proposalGeneratePreview.getAllowanceHtml(allowance, templates, options).then(payload => {
            const componentsToMount = payload.components
            this.allowanceBody = payload.body

            this.$nextTick(() => {
              proposalGeneratePreview.mountAllowanceComponents(this.rfp.allowances, indexAllowance, componentsToMount, project).then(() => {
                resolve(true)
              })
            })
          })
        } catch (error) {
          reject(error)
        }
      })
      return auxPromise
    },
    solveAllowances(proposalGeneratePreview, project, options, templates) {
      const auxPromise = new Promise((resolve, reject) => {
        try {
          if (!this.rfp.allowances) {
            resolve(true)
          }

          this.rfp.allowances.map((allowance, indexAllowance) => {
            this.solveAllowance(proposalGeneratePreview, allowance, indexAllowance, options, project, templates).then(() => {
              if (this.rfp.allowances.length - 1 == indexAllowance) {
                resolve(true)
              }
            })
          })
        } catch (error) {
          reject(error)
        }
      })
      return auxPromise
    },
    getAllowances(proposalGeneratePreview, proposalPreview, project, options) {
      const auxPromise = new Promise((resolve, reject) => {
        try {
          // Checking if there are allowance to be mounted
          const isAllowance = proposalPreview.isAnyComponentInComponentsToMounted('Allowance')

          if (!isAllowance) {
            resolve(true)
          }

          proposalGeneratePreview.getAllowanceTemplates().then(templates => {
            this.solveAllowances(proposalGeneratePreview, project, options, templates).then(() => {
              resolve(true)
            })
          })
        } catch (error) {
          reject(error)
        }
      })

      return auxPromise
    },
    calculateTableOfContents() {
      if (this.rfp.rfpTemplatePreview && this.rfp.rfpTemplatePreview.tableOfContents && this.rfp.rfpTemplatePreview.tableOfContents.length > 0) {
        this.tableOfContents = this.rfp.rfpTemplatePreview.tableOfContents
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 .table-of-contents {
    border-left: 1px solid #aaa;
    list-style-type: none;

    .nav-item {
      color: #0a63c1;
      cursor: pointer;
    }

    ul {
      list-style-type: none;
    }
  }
</style>

<style>

#portrait table,#portrait th, #portrait td {
    border: 1px solid black;
    border-collapse: collapse;
    padding:9px !important;
    font-size: 12px;
}
#bodyPreview table,#bodyPreview th, #bodyPreview td {
    border: 1px solid black;
    border-collapse: collapse;
    padding:9px !important;
    font-size: 12px;
}
</style>


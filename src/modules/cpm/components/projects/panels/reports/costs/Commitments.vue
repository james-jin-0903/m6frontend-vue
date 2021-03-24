<template>
  <div class="mb-5">
    <transition
      mode="out-in"
      name="router-anim"
    >
      <commitment
        v-if="$route.name === 'costs' && showForm"
        :commitment-id="commitmentId"
        :line-item-id="lineItemId"
        @close="closeCommitment"
        @update="commitmentUpdated"
      />
    </transition>

    <div class="clearfix" />

    <template v-if="!showForm">
      <v-card
        class="elevation-0 mt-5"
        flat
      >
        <v-card-title class="pa-0">
          <v-toolbar
            color="transparent"
            dense
            flat
          >
            <v-spacer />
            <v-toolbar-title class="heading">
              <v-chip
                class="headling text-center"
                color="blue darken-2"
                dark
                style="height: 100px"
              >
                Total PO<br>{{ project.project_total_po_amount | currency }}
              </v-chip>
            </v-toolbar-title>
            <v-toolbar-title class="heading">
              <v-chip
                class="headling text-center"
                color="blue"
                dark
                style="height: 100px"
              >
                Total Open<br>{{ project.project_total_open_po_w_tax | currency }}
              </v-chip>
            </v-toolbar-title>
            <v-spacer />
          </v-toolbar>
        </v-card-title>
      </v-card>

      <v-card
        v-for="(commitment, commitmentIndex) in commitments"
        :key="commitment.id"
        class="mt-5"
      >
        <v-card-title class="pa-0">
          <v-toolbar dense>
            <v-toolbar-title class="subheading">
              PO Number: {{ commitment.number }}
            </v-toolbar-title>

            <v-btn
              color="blue"
              fab
              small
              text
              @click="addLineItem(commitment.id, commitment.number, commitmentIndex)"
            >
              <v-icon light>
                mdi-plus
              </v-icon>
            </v-btn>

            <v-btn
              color="blue"
              small
              text
              @click.stop="openSpending(commitment.number, commitment.id)"
            >
              Spending
            </v-btn>

            <v-spacer />
            <v-toolbar-title class="subheading">
              <v-chip
                color="blue darken-2"
                dark
              >
                Total PO: {{ !commitment.total_po_amount ? 0 : commitment.total_po_amount | currency }}
              </v-chip>
            </v-toolbar-title>
            <v-toolbar-title class="subheading">
              <v-chip
                color="blue"
                dark
              >
                Total Open: {{ !commitment.total_open_po_w_tax ? 0 : commitment.total_open_po_w_tax | currency }}
              </v-chip>
            </v-toolbar-title>

            <v-btn
              color="red"
              fab
              small
              text
              @click="deleteCommitment(commitment.id, commitment.number, commitmentIndex)"
            >
              <v-icon light>
                mdi-delete
              </v-icon>
            </v-btn>
          </v-toolbar>
        </v-card-title>
        <v-card-text class="pa-0 vertical-scroll">
          <div class="commitments-table">
            <v-card
              class="rounded-lg"
              flat
            >
              <v-data-table
                v-if="commitment.line_items"
                :headers="headers"
                hide-default-footer
                :items="commitment.line_items"
                :search="search"
              >
                <template
                  slot="items"
                  slot-scope="props"
                >
                  <td>{{ props.item.vendor ? props.item.vendor.title : '' }}</td>
                  <td>{{ props.item.title }}</td>
                  <td>{{ props.item.amount | currency }}</td>
                  <td>{{ props.item.amount - getLineItemTotalOpenAmountTax(props.item) | currency }}</td>
                  <td :class="{overdraft: (props.item.amount - props.item.total_open_amount_w_tax) < 0}">
                    {{ getLineItemTotalOpenAmountTax(props.item) | currency }}
                  </td>

                  <td v-if="props.item.startDate !== undefined && props.item.startDate !== ''">
                    {{ props.item.startDate | normalizeDate }}
                  </td>
                  <td
                    v-else
                    class="text-center"
                  />
                  <td
                    v-if="$route.name === 'costs'"
                    class="justify-center layout px-0"
                  >
                    <v-icon
                      class="mr-2"
                      small
                      @click="setCommitment(commitment.id, props.item.id, props.index, commitmentIndex)"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon
                      small
                      @click="deleteLineItem(props.item, commitment.id, commitmentIndex, props.index)"
                    >
                      mdi-delete
                    </v-icon>
                  </td>
                </template>

                <v-alert
                  slot="no-results"
                  color="red lighten-3"
                  icon="warning"
                  :value="true"
                >
                  Your search for "{{ search }}" found no results.
                </v-alert>
              </v-data-table>
            </v-card>
          </div>
        </v-card-text>
      </v-card>
    </template>

    <spending-modal
      v-if="commitmentNumberOpened"
      v-model="spendingDialog"
      :commitment-id="commitmentIdOpened"
      :commitment-number="commitmentNumberOpened"
    />
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'
import { mapGetters } from 'vuex'
import Commitment from './Commitment'
import SpendingModal from './modals/SpendingModal'
import { DateTime } from 'luxon'

import {
  skipIterationForItems
} from '@/components/cpm/helpers/HelpersFunction'

export default {
  name: 'Commitments',
  components: {
    Commitment,
    'spending-modal': SpendingModal
  },
  props: {
    pid: {
      type: [String, Number],
      required: false
    },
    dateRule: {
      type: Object,
      default: () => ({
        month: null,
        year: ''
      })
    }

  },
  data() {
    let projectRef = null
    if (this.$route.name === 'cpm.reports') {
      projectRef = db.collection('cpm_projects').doc(this.pid)
    } else {
      projectRef = db.collection('cpm_projects').doc(this.$route.params.id)
    }
    const headers = [
      { text: 'Company Name', value: 'company' },
      { text: 'Line Description', value: 'title' },
      { text: 'Total', value: 'amount' },
      { text: 'Invoice Total', value: 'invoiceTotal' },
      { text: 'PO Balance', value: 'poBalance' },
      { text: 'Date', value: 'startDate' }
    ]
    if (this.$route.name === 'costs') {
      headers.push({
        text: 'Actions',
        value: 'name',
        sortable: false
      })
    }
    return {
      commitmentNumberOpened: null,
      commitmentIdOpened: null,
      spendingDialog: false,
      projectRef,
      headers,
      search: '',
      project: {},
      commitmentTest: {},
      showForm: false,
      commitments: [],
      commitmentId: '',
      lineItemId: null,
      lineItemIndex: null,
      commitmentIndex: null,
      commitmentsTotal: 0
    }
  },

  computed: {
    ...mapGetters(['appLabel', 'axiosSettings']),
    commitmentsAvailables() {
      this.commitmentsTotal = 0
      if (!this.dateRule.month || !this.dateRule.year) {
        this.commitments.map(commitment => {
          this.commitmentsTotal += commitment.amount
        })
        return this.commitments
      }

      const auxCommitments = []

      this.commitments.map(commitment => {
        const auxDate = new Date(commitment.startDate)

        const skip = skipIterationForItems(auxDate, this.dateRule)

        if (skip) {
          return
        }

        auxCommitments.push(commitment)
        this.commitmentsTotal += commitment.amount
      })

      return auxCommitments
    }
  },
  firestore() {
    let project = null
    if (this.$route.name === 'cpm.reports') {
      project = db.collection('cpm_projects').doc(this.pid)
    } else {
      project = db.collection('cpm_projects').doc(this.$route.params.id)
    }

    return {
      project
      // commitmentTest: project.collection('commitments').orderBy('number')
    }
  },
  mounted() {
    if (this.$route.name === 'costs') {
      this.$store.dispatch('setHeaderTitle', `CPM | ${this.appLabel.plural} | Cost | Commitments`)
      this.$store.dispatch('setHeaderSubTitle', `Create New ${this.appLabel.plural}, Estimates and Manage Costs`)
      this.$root.$emit('showCommitment')
      this.$root.$on('newCommitment', () => {
        this.newCommitment()
      })
    }

    this.getCommitments()
  },
  beforeDestroy() {
    this.$root.$emit('noButtons')
    this.$root.$off('newCommitment')
  },
  methods: {
    getCommitments() {
      this.commitments = []
      // this.$bind('commitments', this.projectRef.collection('commitments').orderBy('number')).then(commitments => {
      this.projectRef.collection('commitments').orderBy('number').get().then(commitments => {
        commitments.forEach(c => {
          const commitmentObject = c.data()
          commitmentObject.id = c.id
          if (commitmentObject.amount && commitmentObject.invoiceTotal) {
            commitmentObject.poBalance = commitmentObject.amount - commitmentObject.invoiceTotal
          } else {
            commitmentObject.poBalance = 0
          }
          this.$set(commitmentObject, 'line_items', [])

          this.projectRef.collection('commitments').doc(c.id).collection('line_items').get().then(snapshot => {
            snapshot.docs.forEach(doc => {
              const lineItem = doc.data()
              lineItem.id = doc.id
              commitmentObject.line_items.push(lineItem)
            })
          })

          this.commitments.push(commitmentObject)
        })
      })
    },

    commitmentUpdated(item) {
      this.commitments[this.commitmentIndex].line_items[this.lineItemIndex] = item
      this.closeCommitment()
    },

    closeCommitment() {
      this.showForm = false
      this.commitmentId = null
      this.lineItemId = null
      this.lineItemIndex = null
      this.commitmentIndex = null
    },

    newCommitment() {
      const commitmentNumber = this.project.nextCommitmentNumber
      this.projectRef.update({
        nextCommitmentNumber: parseInt(commitmentNumber) + 1
      })
      let idString = '00000' + commitmentNumber
      idString = idString.substr(idString.length - 5)
      const year = (new Date()).getFullYear()
      this.projectRef.collection('commitments').add({
        number: `COM-${idString}-${year}`,
        title: '',
        createdAt: new Date(),
        amount: 0,
        invoiceTotal: 0,
        startDate: (new Date()).toISOString()
      }).then(doc => {
        this.project.files[1].children[9].children.push({
          name: `COM-${idString}-${year}`,
          path: this.project.files[1].children[9].path + '/' + doc.id,
          children: []
        })

        db.collection('cpm_projects').doc(this.$route.params.id).update({
          files: this.project.files
        })

        doc.get().then(doc => {
          if (doc.exists) {
            const commitmentObject = doc.data()
            commitmentObject.id = doc.id
            commitmentObject.poBalance = 0
            this.commitments.push(commitmentObject)
            this.addLineItem(doc.id, doc.data().number, this.commitments.length - 1)
          } else {
            console.error('No such document!')
          }
        }).catch(function (error) {
          console.error('Error getting document:', error)
        })
      })
    },

    setCommitment(commitmentNumber, lineItemId, lineItemIndex, cmIndex) {
      this.commitmentId = commitmentNumber
      this.lineItemId = lineItemId
      this.lineItemIndex = lineItemIndex
      this.commitmentIndex = cmIndex
      this.showForm = true
    },

    deleteCommitment(commitmentId, commitmentNumber, commitmentIndex) {
      const confirmation = confirm(`Do you want to delete this Commitment: ${commitmentNumber}`)
      if (confirmation) {
        this.projectRef.collection('commitments').doc(commitmentId).collection('line_items').get().then(snapshot => {
          snapshot.forEach(doc => {
            this.projectRef.collection('commitments').doc(commitmentId).collection('line_items').doc(doc.id).delete()
          })
          this.projectRef.collection('commitments').doc(commitmentId).delete()
          this.commitments.splice(commitmentIndex, 1)
          this.$snotify.success('The Commitment has been deleted', 'Success')
        })
      }
    },

    deleteLineItem(lineItem, commitmentId, commitmentArrayIndex, lineItemArrayIndex) {
      const confirmation = confirm(`Do you want to delete this Line Item: ${lineItem.title}`)
      if (confirmation) {
        this.submitDelete(lineItem, commitmentId, commitmentArrayIndex, lineItemArrayIndex)
      }
    },

    submitDelete(lineItem, commitmentId, commitmentArrayIndex, lineItemArrayIndex) {
      this.projectRef.collection('commitments').doc(commitmentId).collection('line_items').doc(lineItem.id).delete()
        .then(() => {
          this.commitments[commitmentArrayIndex].line_items.splice(lineItemArrayIndex, 1)
          this.$snotify.success('The Line Item has been deleted', 'Success')
        })
    },

    openSpending(commitmentNumber, commitmentId) {
      this.commitmentNumberOpened = commitmentNumber
      this.commitmentIdOpened = commitmentId
      this.spendingDialog = true
    },

    getLineItemTotalOpenAmountTax(lineItem) {
      const totalOpenAmountTax = (lineItem.total_open_amount_w_tax) ? lineItem.total_open_amount_w_tax : 0

      return totalOpenAmountTax
    },

    formatDateToText(date) {
      const dateObj = DateTime.fromISO(date)

      return dateObj.toFormat('MM/dd/yyyy')
    },

    addLineItem(commitmentId, commitmentNumber, commitmentIndex) {
      const currentDate = (new Date()).toISOString()

      const newLineItem = {
        account: 0,
        amount: 0,
        createdAt: new Date(),
        invoiceTotal: 0,
        line_number: 0,
        notes: '',
        number: commitmentNumber,
        startDate: currentDate,
        startDateText: this.formatDateToText(currentDate),
        title: ''
      }

      if (!this.commitments[commitmentIndex].line_items) {
        this.$set(this.commitments[commitmentIndex], 'line_items', [])
      }

      db.collection('cpm_projects').doc(this.$route.params.id).collection('commitments').doc(commitmentId).collection('line_items').add(newLineItem)
        .then(docRef => {
          this.commitmentId = commitmentId
          this.lineItemId = docRef.id
          this.commitments[commitmentIndex].line_items.push(newLineItem)
          this.commitmentIndex = commitmentIndex
          this.lineItemIndex = this.commitments[commitmentIndex].line_items.indexOf(newLineItem)


          this.showForm = true
        })
        .catch(function (error) {
          console.error('Error adding document: ', error)
        })
    }

  }
}
</script>

<style lang="scss">
  .commitments-table {
    table {
      margin: 0;
    }
  }
</style>

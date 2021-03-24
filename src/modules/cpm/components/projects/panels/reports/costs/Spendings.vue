<template>
  <div>
    <transition
      mode="out-in"
      name="router-anim"
    >
      <spending
        v-if="$route.name === 'costs' && showForm"
        :line-item-id="lineItemId"
        :spending-id="spendingId"
        @close="showForm = false"
        @updateCommitment="updateCommitment"
        @updated="lineItemUpdated"
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
                Total Spending: <br>{{ getTotalSpending() | currency }}
              </v-chip>
            </v-toolbar-title>
            <v-spacer />
          </v-toolbar>
        </v-card-title>
      </v-card>

      <v-card
        v-for="(spending, spendingIndex) in newSpendings"
        :key="spending.id"
        class="mt-5"
        flat
      >
        <v-card-title class="pa-0">
          <v-spacer />
          <v-spacer />
          <v-text-field
            v-model="search"
            append-icon="search"
            class="search-input"
            hide-details
            label="Search"
            single-line
          />
          <v-toolbar dense>
            <v-toolbar-title class="subheading">
              Number: {{ spending.number }}
            </v-toolbar-title>
            <v-spacer />
            <v-toolbar-title class="subheading">
              <v-chip
                color="blue darken-2"
                dark
              >
                Total Spending: {{ getTotalFromObjectArray(spending.line_items, 'amount') | currency }}
              </v-chip>
            </v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-card-text class="pa-0 vertical-scroll">
          <div class="commitments-table">
            <v-card
              class="rounded-lg"
              flat
            >
              <v-data-table
                v-if="spending.line_items"
                :headers="lineItemsSpendingsHeaders"
                hide-default-footer
                :items="spending.line_items"
                :search="search"
              >
                <template
                  slot="items"
                  slot-scope="props"
                >
                  <td class="text-center">
                    <a
                      href="#"
                      @click="setSpending(props.item, spending.id)"
                    >{{ props.item.number }}</a>
                  </td>
                  <td class="text-center">
                    {{ props.item.vendor ? props.item.vendor.title : '' }}
                  </td>
                  <td class="text-center">
                    {{ props.item.category }}
                  </td>

                  <td class="text-center">
                    {{ props.item.dateText }}
                  </td>
                  <td class="text-center">
                    {{ props.item.line_number }}
                  </td>
                  <td class="text-center">
                    {{ props.item.line_description }}
                  </td>
                  <td class="text-center">
                    {{ props.item.amount | currency }}
                  </td>

                  <td class="justify-center layout px-0">
                    <v-icon
                      class="mr-2"
                      small
                      @click="setSpending(props.item, spending.id)"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon
                      small
                      @click="deleteLineItem(props.item, spending.id, props.index, spendingIndex)"
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
  </div>
</template>

<script>
import { db, storage } from '@/utils/Firebase'
import { mapGetters } from 'vuex'
import Spending from './Spending'
import {
  skipIterationForItems
} from '@/components/cpm/helpers/HelpersFunction'


export default {
  name: 'Spendings',
  components: {
    Spending
  },
  props: {
    pid: {
      type: [String, Number],
      default: '',
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
      { text: 'Reconciled', value: 'reconciled' },
      { text: 'Invoice Number', value: 'number' },
      { text: 'Budget Category', value: 'budgetCategory' },
      { text: 'Commitment', value: 'commitment' },
      { text: 'Vendor', value: 'vendor' },
      { text: 'Invoice Date', value: 'date' },
      { text: 'Invoice Amount', value: 'amount' }
    ]
    if (this.$route.name === 'costs') {
      headers.push({ text: 'Actions', value: 'name', sortable: false })
    }
    return {
      projectRef,
      headers,
      search: '',
      project: {},
      showForm: false,
      spendings: [],
      newSpendings: [],
      spendingId: '',
      lineItemId: '',
      spendingTotal: 0,
      lineItemsSpendingsHeaders: [
        { text: 'Number', value: 'number' },
        { text: 'Vendor', value: 'vendor.title' },
        { text: 'Category', value: 'category' },
        { text: 'Date', value: 'dateText' },
        { text: 'Line Number', value: 'line_number' },
        { text: 'Line Description', value: 'line_description' },
        { text: 'Amount', value: 'amount' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    ...mapGetters(['appLabel', 'axiosSettings']),
    spendingsAvailables() {
      this.spendingTotal = 0
      if (!this.dateRule.month || !this.dateRule.year) {
        this.spendings.map(spending => {
          this.spendingTotal += spending.amount
        })

        return this.spendings
      }

      const auxSpendings = []

      this.spendings.map(spending => {
        const auxDate = new Date(spending.date)

        const skip = skipIterationForItems(auxDate, this.dateRule)

        if (skip) {
          return
        }

        auxSpendings.push(spending)
        this.spendingTotal += spending.amount
      })

      return auxSpendings
    }
  },
  firestore() {
    return {
      spendings: this.projectRef.collection('spendings').orderBy('number'),
      project: this.projectRef
    }
  },
  mounted() {
    if (this.$route.name === 'costs') {
      this.$store.dispatch('setHeaderTitle', `CPM | ${this.appLabel.plural} | Cost | Spending`)
      this.$store.dispatch('setHeaderSubTitle', `Create New ${this.appLabel.plural}, Estimates and Manage Costs`)
      this.$root.$emit('showSpending')
      this.$root.$on('newSpending', () => {
        this.newSpending()
      })
      // axios.get(`${this.axiosSettings.baseUrl}/api/project/${this.$route.params.id}/spendings/total/`, this.axiosSettings.config)
      //   .then(response => {
      //     this.spendingTotal = response.data.total
      //   })

      this.getSpendingsFromFirestore()
    }
  },
  beforeDestroy() {
    this.$root.$emit('noButtons')
    this.$root.$off('newSpending')
  },
  methods: {
    newSpending() {
      this.projectRef.get().then(doc => {
        const invoiceNumber = doc.data().nextInvoiceNumber
        this.projectRef.update({
          nextInvoiceNumber: parseInt(invoiceNumber) + 1
        })
        let idString = '00000' + invoiceNumber
        const year = (new Date()).getFullYear()
        idString = idString.substr(idString.length - 5)
        this.projectRef.collection('spendings').add({
          number: `INV-${idString}-${year}`,
          createdAt: new Date(),
          date: (new Date()).toISOString(),
          amount: 0
        }).then(doc => {
          this.project.files[1].children[6].children.push({
            name: `INV-${idString}-${year}`,
            path: this.project.files[1].children[6].path + '/' + doc.id,
            children: []
          })

          db.collection('cpm_projects').doc(this.$route.params.id).update({
            files: this.project.files
          })

          doc.get().then(doc => {
            if (doc.exists) {
              this.addLineItem(doc)
            } else {
              console.error('No such document!')
            }
          }).catch(function (error) {
            console.error('Error getting document:', error)
          })
        })
      })
    },
    setSpending(lineItem, spendingId) {
      this.showForm = false

      this.$nextTick(() => {
        this.spendingId = spendingId
        this.lineItemId = lineItem.id
        this.showForm = true
      })
    },
    deleteSpending(spending) {
      const confirmation = confirm(`Do you want to delete this spending: ${spending.title}`)
      if (confirmation) {
        this.submitDelete(spending)
      }
    },

    deleteLineItem(lineItem, spendingId, arrayIndex, spendingIndex) {
      const confirmation = confirm(`Do you want to delete this line item: ${lineItem.number}`)

      if (confirmation) {
        this.projectRef.collection('spendings').doc(spendingId).collection('line_items').doc(lineItem.id).delete()
          .then(() => {
            this.newSpendings[spendingIndex].line_items.splice(arrayIndex, 1)
            this.$snotify.success('The Line item has been deleted', 'Success')
          })
      }
    },

    submitDelete(spending) {
      this.projectRef.collection('spendings').doc(spending.id).delete()
        .then(() => {
          const folder = this.project.files[1].children[6].children.find(dir => dir.path === path)
          folder.children.forEach(c => {
            storage
              .ref(c.path)
              .delete()
              .catch(error => {
                console.error(`file delete error occured: ${error}`)
              })
          })
          const idx = this.project.files[1].children[6].children.indexOf(folder)
          this.project.files[1].children[6].children.splice(idx, 1)
          db.collection('cpm_projects').doc(this.$route.params.id).update({
            files: this.project.files
          })
          this.$snotify.success('The Spending has been deleted', 'Success')
        })
    },

    updateCommitment(id) {
      const commitmentRef = this.projectRef.collection('commitments').doc(id)
      let spendingTotal = 0
      this.projectRef.collection('spendings').where('commitment', '==', commitmentRef)
        .get().then(result => {
          result.docs.forEach(doc => {
            spendingTotal += parseFloat(doc.data().amount)
          })
          commitmentRef.update({ invoiceTotal: spendingTotal })
        })
    },

    getTotalFromObjectArray(items, propToSum) {
      if (items && items.length > 0) {
        return items.reduce(function (a, b) {
          return a + b[propToSum]
        }, 0)
      } else {
        return 0
      }
    },

    getTotalSpending() {
      const spendingsTotals = []

      this.newSpendings.forEach(element => {
        spendingsTotals.push({
          total: this.getTotalFromObjectArray(element.line_items, 'amount')
        })
      })

      return this.getTotalFromObjectArray(spendingsTotals, 'total')
    },

    getSpendingsFromFirestore() {
      this.$bind('newSpendings', this.projectRef.collection('spendings').orderBy('number')).then(spendings => {
        spendings.forEach(c => {
          c.poBalance = c.amount - c.invoiceTotal
          this.$set(c, 'line_items', [])

          this.projectRef.collection('spendings').doc(c.id).collection('line_items').get().then(snapshot => {
            snapshot.forEach(doc => {
              const lineItem = doc.data()
              lineItem.id = doc.id
              c.line_items.push(lineItem)
            })
          })
        })
      })
    },

    lineItemUpdated() {
      this.getSpendingsFromFirestore()
    },

    addLineItem(spending) {
      const currentDate = (new Date()).toISOString()

      const newLineItem = {
        number: spending.data().number,
        po_number: 0,
        project_name: '',
        line_number: 0,
        amount: 0,
        category: '',
        account: 0,
        account_category: '',
        aoc_code: '',
        client_capital_id: null,
        custom_numeric_1: '',
        custom_text_1: '',
        custom_text_2: '',
        custom_text_3: 0,
        custom_text_4: '',
        createdAt: new Date(),
        date: '',
        dateText: '',
        paidDate: 0,
        paidDateText: '',
        line_description: '',
        reconciled: false,
        status: 0,
        vendor: null
      }

      this.projectRef.collection('spendings').doc(spending.id).collection('line_items').add(newLineItem)
        .then(docRef => {
          this.lineItemId = docRef.id
          this.spendingId = spending.id
          this.showForm = true
        })
        .catch(function (error) {
          console.error('Error adding document: ', error)
        })
    },

    formatDateToText(date) {
      const dateObj = DateTime.fromISO(date)

      return dateObj.toFormat('MM/dd/yyyy')
    }
  }
}
</script>

<style lang="scss" scoped>
      .search-input {
        margin-bottom: 25px;
      }
</style>

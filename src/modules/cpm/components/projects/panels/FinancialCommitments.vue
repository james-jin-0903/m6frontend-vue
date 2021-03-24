<template>
  <m6-card-dialog
    ref="cardDialog"
    :filter-column-list="[{text: 'All', value: 'all'}, {text: 'Document/Invoice Number', value: 'number'}]"
    min-height="0"
    :open-search-panel="openSearchPanel"
    :search-field="true"
    :title="$tc('cpm.projects.commitment', 2)"
    :title-tooltip="$t('general.doubleClickSeeMore')"
    @filterColumnChange="filterColumn = $event"
    @fullscreen="checkFullScreen"
    @search="searchKeyword = $event"
  >
    <template v-slot:after:title>
      <v-tooltip
        v-if="$route.name === 'cpm.projects.show'"
        left
      >
        <template v-slot:activator="{ on }">
          <!-- THIS CHANGE WAS BECAUSE THE SPENDINGS DIALOG WAS NOT WORKING IN ANOTHER TAB FULLSCREEN -->
          <v-icon
            light
            text
            v-on="on"
            @click="cardDialogClick"
          >
            mdi-launch
          </v-icon>
        </template>
        <span>{{ $t('general.openNewTab') }}</span>
      </v-tooltip>

      <v-menu
        v-if="search"
        nudge-top="100"
        offset-y
        open-on-hover
      >
        <template v-slot:activator="{ on }">
          <v-icon
            light
            v-on="on"
            @click="showSearchingModal = true"
          >
            mdi-magnify-scan
          </v-icon>
        </template>

        <v-card
          class="rounded-lg"
          color="rgb(255, 255, 255, 0.9)"
        >
          <v-card-text>
            <b>{{ $t('general.currentSearchTerm') }}:</b>
            {{ search }}
          </v-card-text>
        </v-card>
      </v-menu>

      <v-tooltip
        v-if="!search"
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-icon
            class="grey--text search text--darken-2"
            v-on="on"
            @click="openSearchPanel = true"
          >
            mdi-magnify-scan
          </v-icon>
        </template>
        <span class="grey lighten-3 pa-1 rounded">{{ $t('general.search') }}</span>
      </v-tooltip>

      <template v-if="search">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              class="close-search grey--text mx-2 text--darken-2"
              light
              size="25"
              v-on="on"
              @click="clearSearch"
            >
              mdi-close
            </v-icon>
          </template>
          <span class="grey lighten-3 pa-1 rounded">{{ $t('general.clearSearch') }}</span>
        </v-tooltip>
      </template>

      <v-icon
        class="cursor grey--text ml-2 text--darken-2"
        light
        @click="createShowModal = true"
      >
        mdi-plus-circle
      </v-icon>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon
            v-if="isAdmin"
            class="cursor grey--text ml-2 text--darken-2"
            color="white"
            v-on="on"
            @click="showSettings = true"
          >
            mdi-cog
          </v-icon>
        </template>
        <span class="grey lighten-3 pa-1 rounded">{{ $t('general.settings') }}</span>
      </v-tooltip>
    </template>

    <v-row
      justify="center"
    >
      <v-chip
        color="transparent"
        disabled
        text-color="black"
      >
        <strong>{{ $t('cpm.projects.po') }} {{ (poAmount || 0) | currency }}</strong>
      </v-chip>
      <v-chip
        color="transparent"
        disabled
        text-color="black"
      >
        <strong>{{ $t('cpm.projects.open') }} {{ (poTax || 0) | currency }}</strong>
      </v-chip>
      <v-chip
        color="transparent"
        disabled
        text-color="black"
      >
        <strong>{{ $t('cpm.projects.poOpenAccrual') }} {{ (poTax - project.accrual || 0) | currency }}</strong>
      </v-chip>
    </v-row>

    <m6-data-table
      v-if="dataTable"
      :align-actions="alignActions"
      class="elevation-0"
      :footer-props="{
        'items-per-page-options': [5,10,15,200]
      }"
      :headers="headers"
      :items="resourcesTestData"
    >
      <!--      :options.sync="pagination"-->
      <!--      :server-items-length="pagination.totalItems"-->
      <!--      @update:options="debounceSearch(search, false)"-->
      <!-- <template
        slot="item"
        slot-scope="props"
      >
        <tr
          class="step6"
          @click="fetchSpending(props)"
        >
          <td class="pl-20 text-left">
            <v-row>{{ props.item.number }}</v-row>
          </td>
          <td
            class="pl-20 text-left"
          >
            <template v-for="vendor in props.item.vendors">
              {{ vendor }}
            </template>
          </td>

          <td
            v-if="isFullScreen || isFullScreenPage"
            class="pl-20 text-left"
          >
            <v-row v-if="$h.dg(props.item, 'budget_category.code')">
              {{ props.item.budget_category.code }} -
              {{ $h.dg(props.item, 'budget_category.name', '') }}
            </v-row>
          </td>
          <td
            v-if="isFullScreen || isFullScreenPage"
            class="pl-20 text-left"
          >
            <v-row>{{ props.item.notes }}</v-row>
          </td>
          <td class="text-right">
            <v-row justify="end">
              {{ (props.item.amount || 0) | currency }}
            </v-row>
          </td>
          <td
            v-if="!isFullScreen || isFullScreenPage"
            class="text-right"
          >
            <v-row justify="end">
              {{ (props.item.openAmount || 0) | currency }}
            </v-row>
          </td>
          <td
            v-else
            class="text-right"
          >
            <v-row justify="end">
              {{ (props.item.spendingAmount || 0) | currency }}
            </v-row>
          </td>
          <td
            v-if="isFullScreen || isFullScreenPage"
            class="text-right"
          >
            <v-row justify="end">
              {{ (props.item.openAmount || 0) | currency }}
            </v-row>
          </td>

          <td
            class="pl-20 text-center"
          >
            <v-row justify="center">
              <v-col class="align-center d-flex text-nowrap">
                {{ formatDateToText(props.item.completionDate) }}
              </v-col>
            </v-row>
          </td>

          <td class="text-center">
            <m6-dropdown-actions
              :options="dropdownOptions"
              @attach="openModalSpendings(props.item)"
              @delete="
                settingCommitmentDelete(
                  props.item.id,
                  props.item.number,
                  props.index
                )
              "
              @edit="whichCommitmentToEdit(props.item)"
              @see="displayLineItems(props.item)"
            />
          </td>
        </tr>
      </template>

       -->


      <template v-slot:item.number="{ item }">
        {{ item.number }}
      </template>
      <!-- <template v-slot:item['budget_category.name']="{ item }">
      {{ item.budget_category.code }} -
      {{ $h.dg(item, 'budget_category.name', '') }}
    </template> -->

      <template v-slot:item.vendors="{ item }">
        <template v-for="vendor in item.vendors">
          {{ vendor.title ? vendor.title :vendor.custom_id }}
        </template>
      </template>


      <template v-slot:item.total_po_amount="{ item }">
        {{ (item.amount || 0) | currency }}
      </template>

      <template v-slot:item.total_open_po_w_tax="{ item }">
        {{ (item.openAmount || 0) | currency }}
      </template>


      <template v-slot:item.amount="{ item }">
        {{ (item.amount || 0) | currency }}
      </template>

      <template v-slot:item.spendingAmount="{ item }">
        {{ (item.spendingAmount || 0) | currency }}
      </template>
      <template v-slot:item.openAmount="{ item }">
        {{ (item.openAmount || 0) | currency }}
      </template>

      <template v-slot:item.completionDate="{ item }">
        {{ formatDateToText(item.completionDate) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <m6-dropdown-actions
          :options="dropdownOptions"
          @attach="openModalSpendings(item)"
          @delete="
            settingCommitmentDelete(
              item.id,
              item.number,
              index
            )
          "
          @edit="whichCommitmentToEdit(item)"
          @see="displayLineItems(item)"
        />
      </template>

    <!--
    <template
        v-if="isFullScreen || isFullScreenPage"
        v-slot:expand="props"
      >
        <v-row justify="center">
          <v-col cols="11">
            <v-data-table
              class="elevation-1"
              :headers="subheaders"
              hide-default-footer
              :items="props.item.spending"
            >
              <template v-slot:items="props">
                <td class="text-left">
                  {{ props.item.number }}
                </td>
                <td class="text-left">
                  <v-row v-if="$h.dg(props.item, 'budget_category.code')">
                    {{ props.item.budget_category.code }} -
                    {{ $h.dg(props.item, 'budget_category.name') }}
                  </v-row>
                </td>
                <td class="text-center">
                  {{ formatDateToText(props.item.date) }}
                </td>
                <td class="text-right">
                  {{ props.item.amount | currency }}
                </td>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </template> -->
    </m6-data-table>

    <financial-commit-modal
      is-create
      :project-id="projectId"
      :show="createShowModal"
      @close="reload"
      @close-only="createShowModal = false"
    />

    <financial-commit-modal
      v-if="editShowModal"
      :commitment-id="commitmentToEdit.id"
      :project-id="projectId"
      :show="editShowModal"
      @close="reload"
      @close-only="editShowModal = false"
    />

    <line-items-show
      v-if="showLineItems"
      :commitment="commitmentToShow"
      :show="showLineItems"
      :vendors="vendors"
      @close="closeDisplayLineItems"
      @get-vendors="getVendors"
      @reload="reload"
    />

    <m6-confirm-delete
      :message="
        $t('general.sureDeleteResource', {
          resource: $tc('cpm.projects.commitment', 1)
        })
      "
      :show="showDeleteCommitmentModal"
      :title="
        $t('general.deleteResource', {
          resource: $tc('cpm.projects.commitment', 1)
        })
      "
      @cancel="cancelCommitmentDelete"
      @confirm="deleteCommitment"
    />

    <searching
      v-if="showSearchingModal"
      :previous-search="search"
      :show="showSearchingModal"
      where="commitments"
      @clear="search = ''"
      @close="showSearchingModal = false"
      @searching="onSearch"
    />

    <m6-loading :loading="showLoading" />

    <settings-modal
      v-if="showSettings"
      :show="showSettings"
      @close="showSettings = false"
    />

    <dialog-spendings-in-commitments
      v-if="showSpendings"
      :commitments-id="commitmentSpendingId"
      :project-id="projectId"
      :title="commitmentTitle"
      @close="closeModalSpendings"
    />

    <m6-info
      v-if="showInfo"
      :title="infoTitle"
      @close="showInfo = false"
    >
      This commitment has associated spending
      <ul>
        <li
          v-for="spendingName in associatedSpending"
          :key="spendingName"
        >
          {{ spendingName }}
        </li>
      </ul>
    </m6-info>
  </m6-card-dialog>
</template>

<script>
import axios from 'axios'
import { DateTime } from 'luxon'
import { mapActions } from 'vuex'

import { db } from '@/utils/Firebase'
import EventBus from '@/Eventbus'

import mixins from '@/modules/cpm/_mixins/index'

import FinancialCommitmentsModal from '../modals/FinancialCommitmentsModal'
import LineItemsShow from '../modals/LineItemsShow'
import SearchingModal from '../modals/SearchingModal'

import settingsModal from '../settings_modals/FinancialCommitments.vue'
import DialogSpendingsInCommitments from './DialogSpendingsInCommitments'
import M6Info from '../_partials/M6Info'

export default {
  name: 'FinancialCommitments',
  components: {
    'financial-commit-modal': FinancialCommitmentsModal,
    'line-items-show': LineItemsShow,
    searching: SearchingModal,
    'settings-modal': settingsModal,
    'dialog-spendings-in-commitments': DialogSpendingsInCommitments,
    'm6-info': M6Info
  },

  mixins: [mixins],

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
    }
  },

  data() {
    const projectId = this.pid || this.$route.params.id

    return {
      infoTitle: '',
      showInfo: false,
      associatedSpending: [],
      selectedCommitment: null,
      isAdmin: true,
      showSettings: false,
      dataTable: true,
      projectId,
      showSearchingModal: false,
      showDeleteCommitmentModal: false,
      deleteCommitmentInfo: {},
      showLineItems: false,
      commitmentToShow: {},
      showLoading: false,
      commitmentId: '',
      lineItemId: '',
      createShowModal: false,
      editShowModal: false,
      commitmentToEdit: {},
      page: 1,
      commitmentNumberOpened: null,
      commitmentIdOpened: null,
      spendingDialog: false,
      projectRef: db.collection('cpm_projects').doc(projectId),
      commitmentTest: {},
      showForm: false,
      commitments: [],
      commitmentIndex: null,
      commitmentsTotal: 0,
      vendors: [],
      project: {},
      // variables for dialog spendings in commitments
      showSpendings: false,
      commitmentSpendingId: '',
      commitmentTitle: '',
      rowsPerPage: [
        10,
        50,
        100,
        { text: '$vuetify.dataIterator.rowsPerPageAll', value: 10 }
      ],
      isFullScreen: false,
      subheaders: [
        {
          text: this.$t('general.invoiceNumber'),
          value: 'number',
          class: 'header'
        },
        {
          text: this.$t('cpm.projects.budgetCategory'),
          sortable: false,
          class: 'header'
        },
        {
          text: this.$t('general.date'),
          value: 'date',
          class: 'header'
        },
        {
          text: this.$t('general.invoiceAmount'),
          value: 'amount',
          class: 'header'
        }
      ],
      pagination: {
        sortBy: ['number'],
        descending: true,
        itemsPerPage: 10,
        totalItems: 0,
        page: 1
      },
      resourcesTest: [],
      searchKeyword: '',
      filterColumn: 'all',
      filterQry: {
        number: '',
        vendor: '',
        'budget_category.name': '',
        notes: '',
        amount: '',
        spendingAmount: '',
        openAmount: '',
        completionDate: '',
        total_po_amount: '',
        total_open_po_w_tax: ''
      },
      openSearchPanel: false
    }
  },
  computed: {
    indexParameters() {
      return {
        projectId: this.projectId,
        page: this.pagination.page,
        search: this.search || '',
        sort: this.pagination.descending ? 'DESC' : 'ASC',
        sortBy: this.pagination.sortBy,
        limit: this.pagination.itemsPerPage
      }
    },

    isFullScreenPage() {
      return this.$h.dg(this.$route, 'name.cpm.projects.fullscreen') === 'cpm.projects.fullscreen'
    },

    alignActions() {
      if (!this.isFullScreen || !this.isFullScreenPage) {
        return 'end'
      } else {
        return 'center'
      }
    },

    poAmount() {
      return this.$h.dg(this.project, 'totals.commitmentTotal', 0)
    },

    poTax() {
      return this.$h.dg(this.project, 'totals.openCommitmentTotal', 0)
    },

    headers() {
      if (this.isFullScreen || this.isFullScreenPage) {
        return [
          {
            text: this.$t('cpm.projects.poNumber'),
            value: 'number',
            class: 'header'
          },
          {
            text: this.$t('cpm.projects.vendorTitle'),
            value: 'vendors',
            class: 'header',
            sortable: true
          },
          {
            text: this.$t('cpm.projects.budgetCategory'),
            value: 'budget_category.name',
            class: 'header'
          },
          {
            text: this.$t('general.description'),
            value: 'notes',
            class: 'header',
            sortable: true
          },
          {
            text: this.$t('cpm.projects.commitmentTotal'),
            value: 'amount',
            class: 'header'
          },
          {
            text: this.$t('cpm.projects.invoiceTotal'),
            value: 'spendingAmount',
            class: 'header'
          },
          {
            text: this.$t('cpm.projects.balance'),
            value: 'openAmount',
            class: 'header'
          },
          {
            text: this.$t('general.date'),
            value: 'completionDate',
            class: 'header',
            sortable: true
          },
          {
            text: this.$t('general.actions'),
            value: 'actions',
            sortable: false,
            class: 'header'
          }
        ]
      } else {
        return [
          {
            text: this.$t('cpm.projects.poNumber'),
            value: 'number',
            class: 'header'
          },
          {
            text: this.$t('cpm.projects.vendorTitle'),
            value: 'vendors',
            class: 'header',
            sortable: true
          },
          {
            text: this.$t('cpm.projects.po'),
            value: 'total_po_amount',
            class: 'header'
          },
          {
            text: this.$t('cpm.projects.open'),
            value: 'total_open_po_w_tax',
            class: 'header'
          },
          {
            text: this.$t('general.date'),
            value: 'completionDate',
            class: 'header',
            sortable: true
          },
          {
            text: this.$t('general.actions'),
            value: 'actions',
            sortable: false,
            class: 'header'
          }
        ]
      }
    },
    dropdownOptions() {
      return [
        {
          icon: 'mdi-clipboard-account-outline',
          title: this.$t('general.seeTheResource', {
            resource: this.$tc('cpm.projects.lineItem', 2)
          }),
          event: 'see'
        },
        {
          icon: 'mdi-pencil',
          title: this.$t('general.edit'),
          event: 'edit'
        },
        {
          icon: 'mdi-cash',
          title: this.$t('general.showSpendings'),
          event: 'attach'
        },
        {
          icon: 'mdi-delete',
          title: this.$t('general.delete'),
          event: 'delete'
        }
      ]
    },
    resourcesTestData: function () {
	    return this.filterItems(this.resourcesTest, this.filterQry)
    }
  },

  watch: {
    filterColumn: function (newVal, oldVal) {
      this.fillTheFilterQry()
    },
    searchKeyword: function (newVal, oldVal) {
      this.fillTheFilterQry()
    },
    poAmount: function () {
      this.fetchCommitments()
    },
    'pagination.totalItems': function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue !== this.resourcesRaw.length) {
          this.fetchCommitments()
        }
      }
    },
    isFullScreen: function (newVal, oldVal) {
      if (newVal == false) {
        this.searchKeyword = ''
        this.openSearchPanel = false
      }
    }
  },

  mounted() {
    this.fetchCommitments()
    // TODO: Change behaviour instead of refreshing everytime when something change or an spending event change to something better
    EventBus.$on('refresh-commitments-panel-by-spendings', this.fetchCommitments)
    EventBus.$on('reload-commitments', this.fetchCommitments)

    this.fillTheFilterQry()
  },

  methods: {
    fillTheFilterQry: function () {
      if (this.filterColumn == 'all') {
        Object.keys(this.filterQry).forEach((item, index) => {
          this.filterQry[item] = this.searchKeyword
        })
      } else {
        Object.keys(this.filterQry).forEach((item, index) => {
          if (item == this.filterColumn) {
            this.filterQry[item] = this.searchKeyword
          } else {
            this.filterQry[item] = ''
          }
        })
      }
    },

    filterItems: function (arr, query) {
      const _this = this
      return arr.filter(function (item) {
        const columnList = {
          number: false,
          vendor: false,
          'budget_category.name': false,
          notes: false,
          amount: false,
          spendingAmount: false,
          openAmount: false,
          completionDate: false,
          total_po_amount: false,
          total_open_po_w_tax: false
        }


        Object.keys(columnList).forEach(column => {
          if (typeof item[column] !== 'undefined' && (_this.filterColumn == 'all' || _this.filterColumn == column)) {
            let tableColumnData = item[column]
            if (column == 'completionDate') {
              tableColumnData = _this.formatDateToText(item[column])
            }
            columnList[column] = tableColumnData.toString().toLowerCase().trim().includes(query[column].toString().toLowerCase().trim())
          }
        })


        return (columnList.number || columnList.vendor || columnList['budget_category.name'] ||
                columnList.notes || columnList.amount || columnList.spendingAmount || columnList.openAmount ||
                columnList.completionDate || columnList.total_po_amount || columnList.total_open_po_w_tax)
      })
    },
    async fetchCommitments() {
      this.getCommitments({
        projectId: this.projectId
      }).then(response => {
        this.resourcesTest = response
      })
    },
    ...mapActions('companies/cpmProjects/commitments', {
      indexResource: 'index'
    }),
    ...mapActions('cpm/projects/commitments', {
      deleteCommitmentStore: 'delete',
      getCommitments: 'getCommitments'
    }),
    cardDialogClick() {
      this.$refs.cardDialog.doubleClick()
    },
    assignResourcesData({ data, meta: { lastPage, total } } = {}) {
      if (lastPage && this.pagination.page > lastPage) {
        this.pagination.page = 1
        return this.fetchCommitments()
      }

      this.resourcesRaw = data.map(item => ({
        ...item,
        invoices: [],
        line_items: []
      }))
      this.pagination.totalItems = total
    },

    clearSearch() {
      this.search = ''
      this.fetchCommitments()
    },

    onSearch(search) {
      this.search = search
      this.showSearchingModal = false
      this.fetchCommitments()
    },

    updateCommitmentsTotals() {
      return new Promise(async (resolve, reject) => {
        try {
          await axios.post(
            `${process.env.VUE_APP_FIREBASE_APIURL}/api/projects/${this.projectId}/update-commitments`
          )
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },

    checkFullScreen(value) {
      this.isFullScreen = value
    },

    async openModalSpendings(commitment) {
      this.showSpendings = true
      this.commitmentSpendingId = commitment.id
      this.commitmentTitle = commitment.number

      if (!commitment.line_items) {
        this.$set(commitment, 'invoices', [])
      }

      const spendings = await this.projectRef
        .collection('spendings')
        .where(
          'commitment',
          '==',
          this.projectRef.collection('commitments').doc(commitment.id)
        )
        .get()

      commitment.invoices = spendings.docs.map(async spend => {
        const spendData = spend.data()
        spendData.id = spend.id

        return spendData
      })
    },

    closeModalSpendings() {
      this.showSpendings = false
      this.commitmentSpendingId = ''
      this.commitmentTitle = ''
    },

    async displayLineItems(commitment) {
      this.commitmentToShow = commitment
      this.showLineItems = true

      const snapshot = await this.projectRef
        .collection('commitments')
        .doc(commitment.id)
        .collection('line_items')
        .get()

      if (!commitment.line_items) {
        this.$set(commitment, 'line_items', [])
      }

      commitment.line_items = snapshot.docs.map(doc => {
        const lineItem = doc.data()
        lineItem.id = doc.id

        return lineItem
      })
    },

    closeDisplayLineItems() {
      this.reload()
      this.showLineItems = false
      this.commitmentToShow = {}
    },

    async settingCommitmentDelete(commitmentId, commitmentNumber, commitmentIndex) {
      if (this.hasInvoices(commitmentId)) {
        this.$snotify.error(this.$t('cpm.projects.invoicesCommitment'))
        return
      }

      const commitmentRef = this.projectRef
        .collection('commitments')
        .doc(commitmentId)

      const spendingSnap = await this.projectRef
        .collection('spendings')
        .where('commitment', '==', commitmentRef)
        .get()

      if (!spendingSnap.empty) {
        this.infoTitle = 'Commitment can\'t be deleted'
        this.showInfo = true
        this.associatedSpending = await spendingSnap.docs.map(doc => doc.data().number)
        return
      }

      this.deleteCommitmentInfo = {
        commitmentId,
        commitmentNumber,
        commitmentIndex
      }
      this.showDeleteCommitmentModal = true
    },

    hasInvoices(id) {
      const commitment = this.commitments.find(
        commitment => commitment.id === id
      )

      const commitmentInvoices = this.$h.dg(commitment, 'invoices', [])

      return Boolean(commitmentInvoices.length)
    },

    cancelCommitmentDelete() {
      this.deleteCommitmentInfo = {}
      this.showDeleteCommitmentModal = false
    },

    whichCommitmentToEdit(commitment) {
      this.commitmentToEdit = commitment
      this.editShowModal = true
    },

    async reload(commitment) {
      if (commitment) {
        this.$nextTick(() => this.addResourceIfNotExists(commitment))
      }
      this.dataTable = false
      this.createShowModal = false
      this.editShowModal = false
      this.commitmentId = ''
      this.lineItemId = ''
      await this.fetchCommitments()
      if (this.$h.dg(this.commitmentToShow, 'id')) {
        this.displayLineItems(this.commitmentToShow)
      }
      this.refreshFinancialCostSummary()
      this.updateCommitmentsTotals()
      this.$nextTick(() => {
        this.dataTable = true
        EventBus.$emit('reload-reconciliation-commitments')
      })
    },

    addResourceIfNotExists(resource) {
      if (!this.$h.dg(resource, 'id')) return

      const index = this.lodash.findIndex(this.resourcesRaw, {
        id: resource.id
      })
      if (index === -1) {
        this.resourcesRaw.unshift(resource)
      }
    },

    commitmentUpdated(item) {
      this.commitments[this.commitmentIndex].line_items[
        this.lineItemIndex
      ] = item
      this.closeCommitment()
    },

    closeCommitment() {
      this.showForm = false
      this.commitmentId = null
      this.commitmentIndex = null
    },

    newCommitment() {
      const commitmentNumber = this.project.nextCommitmentNumber
      this.projectRef.update({
        nextCommitmentNumber: parseInt(commitmentNumber) + 1
      })
      let idString = '00000' + commitmentNumber
      idString = idString.substr(idString.length - 5)
      const year = new Date().getFullYear()
      this.projectRef
        .collection('commitments')
        .add({
          number: `COM-${idString}-${year}`,
          title: '',
          createdAt: new Date(),
          amount: 0,
          invoiceTotal: 0,
          startDate: new Date().toISOString()
        })
        .then(doc => {
          this.project.files[1].children[9].children.push({
            name: `COM-${idString}-${year}`,
            path: this.project.files[1].children[9].path + '/' + doc.id,
            children: []
          })

          this.projectRef.update({ files: this.project.files })

          doc
            .get()
            .then(doc => {
              if (doc.exists) {
                const commitmentObject = doc.data()
                commitmentObject.id = doc.id
                commitmentObject.poBalance = 0
                this.commitments.push(commitmentObject)
                this.resources.push(commitmentObject)
                this.reload()
              } else {
                console.error(this.$t('cpm.projects.NoSuchDocument'))
              }
            })
            .catch(function (error) {
              console.error(this.$t('cpm.projects.errorDocument'), error)
            })
        })
    },

    deleteCommitment() {
      const { commitmentId, commitmentIndex } = this.deleteCommitmentInfo
      this.showLoading = true

      this.deleteCommitmentStore({
        projectId: this.projectId,
        commitmentId: commitmentId
      })
        .then(() => {
          this.commitments.splice(commitmentIndex, 1)
          this.cancelCommitmentDelete()
          this.showLoading = false
          this.$snotify.success(
            this.$t('cpm.projects.commitmentDelete'),
            this.$t('alerts.success')
          )
          this.reload()
        })
        .catch(() => {
          this.cancelCommitmentDelete()
          this.showLoading = false
          this.$snotify.error(
            this.$t('general.thereErrorDeleting'),
            this.$t('alerts.error')
          )
        })
    },

    openSpending(commitmentNumber, commitmentId) {
      this.commitmentNumberOpened = commitmentNumber
      this.commitmentIdOpened = commitmentId
      this.spendingDialog = true
    },

    formatDateToText(date) {
      if (date) {
        const dateObj = DateTime.fromISO(date)
        return dateObj.toFormat('MM/dd/yyyy')
      }
      return ''
    },

    getVendors() {
      // this.showLoading = true
      // axios
      //   .post('/m6-platform/api/general', { action: 'get_vendors' })
      //   .then(result => {
      //     this.vendors = result.data.result
      //     this.showLoading = false
      //   })
      //   .catch(() => {
      //     this.showLoading = false
      //     this.$snotify.error(
      //       `${this.$t('general.thereWasError')} ${this.$t(
      //         'general.pleaseRefreshPage'
      //       )},`,
      //       this.$t('alerts.error')
      //     )
      //   })
    },

    refreshFinancialCostSummary() {
      EventBus.$emit('refresh-financial-cost-summary')
    },

    async fetchSpending(props) {
      const index = props.index
      const commitment = props.item
      if (!this.$h.dg(commitment, 'id') || !(this.isFullScreen || this.isFullScreenPage)) return

      if (!this.resources[index].spending) {
        this.$set(this.resources[index], 'spending', [])
        const spending = await this.projectRef
          .collection('spendings')
          .where(
            'commitment',
            '==',
            this.projectRef.collection('commitments').doc(commitment.id)
          )
          .get()

        const allSpending = await Promise.all(
          spending.docs.map(async spend => {
            const spendData = spend.data()
            spendData.id = spend.id

            if (this.$h.dg(spendData, 'budget_category.ref.id')) {
              const docBudgetCategory = await spendData.budget_category.ref.get()
              spendData.budget_category.name = this.$h.dg(
                docBudgetCategory.data(),
                'name'
              )
              spendData.budget_category.code = this.$h.dg(
                docBudgetCategory.data(),
                'code'
              )
            }

            return spendData
          })
        )
        this.$set(this.resources[index], 'spending', allSpending)
        props.expanded = !props.expanded
      } else {
        props.expanded = !props.expanded
      }
    }
  },

  firestore() {
    return {
      project: db.collection('cpm_projects').doc(this.projectId)
    }
  }
}
</script>

<style lang="scss" scoped>
.cpm-panel {
  margin-bottom: 10px;
}

.card-container {
  padding: 15px;
  max-height: 480px;
  overflow-y: auto;
  overflow-x: hidden;
}

.dependency-details {
  line-height: 1.2;

  p:first-child {
    font-size: 16px;
  }

  font-size: 12px;
}

.flex .text-xs-center p {
  margin: 0px;
}

.search-activated {
  margin-top: 0px;
}
.search {
  cursor: pointer;
  color: white;
}
.close-search {
  cursor: pointer;
  color: white;
}
.action-buttons {
  width: 85px;
}
.action-icon {
  cursor: pointer;
}
</style>

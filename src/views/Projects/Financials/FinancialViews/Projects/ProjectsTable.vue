<template>
  <div v-resize="onResize">
    <v-data-table
      :items="projects"
      :headers="headers"
      :options="pagination"
      :items-per-page="itemsPerPage"
      :page.sync="pagination.page"
      :server-items-length="totalItems"
      disable-filtering
      :footer-props="footerProps"
      :loading="gettingData"
      fixed-header
      show-expand
      :expanded.sync="expanded"
      :height="tableHeight"
    >
    <template v-for="header in headers.filter((header) => header.hasOwnProperty('formatter'))" v-slot:[`item.${header.value}`]="{ item }">
      {{ header.formatter(item, header.value) }}
    </template>
    <template v-slot:[`item.number`]="{ item }">
      <v-avatar
        size="35"
      >
        <v-img
          v-if="item.projectImage"
          :src=item.projectImage
        ></v-img>
        <v-icon
          v-else
          class="grey lighten-2"
        >
          mdi-image
        </v-icon>
      </v-avatar>
      <a
        @click="goToProject(item.id)"
        class="primary--text"
      >
        {{ item.number }}
      </a>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
        <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            small
          >
            Actions
          </v-btn>
        </template>
        <v-list>
          <template v-for="(actionItem, index) in actionsItems">
            <v-hover v-slot="{ hover }" :key="index + 'hover'">
              <v-list-item
                :key="index"
                :class="{ 'on-hover-list-item': hover }"
                :elevation="hover ? 12 : 2"
                @click="actionItem.action(item)"
              >
                  <v-list-item-title
                    :class="{ 'on-hover-list-item-title': hover }"
                  >{{ actionItem.text }}</v-list-item-title>
              </v-list-item>
            </v-hover>
          </template>
        </v-list>
      </v-menu>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-row>
            <v-col cols="12">
              <financials-table
                ref="financialsTableRef"
                :project-number="item.number"
                :items="item[financialType]"
                :po-numbers="poNumbers"
                @on-delete="onDelete"
                :financialType="financialType"
              ></financials-table>
            </v-col>
          </v-row>
        </td>
      </template>
      <template #loading>
        <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'
import { mapState, mapGetters } from 'vuex'
import axios from 'axios'
import FinancialsTable from './FinancialsTable'
export default {

  name: 'ProjectsTable',

  components: {
    FinancialsTable
  },

  props: {
    poNumbers: {
      type: Array,
      default: () => []
    },

    searchTerms: {
      type: Array,
      default: () => []
    },
    
    financialType: {
      type: String,
      default: 'commitments'
    }
  },

  data() {
    return {
      tableHeight: '60vh',
      expanded: [],
      actionsItems: [
        {
          text: 'Edit',
          action: this.openFormModal
        },
        {
          text: 'Delete',
          action: this.openDeleteForm
        },
      ],
      gettingData: true,
      firebaseUrl: process.env.VUE_APP_FIREBASE_APIURL,
      projects: [],
      itemsPerPage: 30,
      pagination: {
        page: 1,
        itemsPerPage: 30,
        pageCount: 0
      },
      footerProps: {
        itemsPerPageOptions: [ 30 ]
      },
      totalItems: 0
    }
  },

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    ...mapGetters('projects/search/financials', [
      'forceIndex'
    ]),
    headers () {
      return [
        {
          text: 'Number',
          value: 'number',
          align: '',
          class: '',
          sortable: false
        },
        {
          text: 'Site',
          value: 'basic.location',
          align: '',
          class: '',
          sortable: false
        },
        {
          text: 'Project Name',
          value: 'title',
          align: '',
          class: '',
          sortable: false
        },
        {
          text: 'Project Manager',
          value: 'manager',
          align: '',
          class: '',
          sortable: false
        },
        {
          text: 'Commitments Total',
          value: 'totals.commitmentTotal',
          align: 'end',
          class: '',
          sortable: false,
          formatter: this.formatterCurrency
        },
        {
          text: 'Commitments Open',
          value: 'totals.openCommitmentTotal',
          align: 'end',
          class: '',
          sortable: false,
          formatter: this.formatterCurrency
        },
        /* {
          text: 'Actions',
          value: 'actions',
          align: 'center',
          class: '',
          sortable: false
        }, */
      ]
    }
  },

  created() {
    this.index()
  },

  watch: {
    pagination: {
      handler () {
        this.index()
      },
      deep: true,
    },

    poNumbers () {
      this.pagination.page = 1
      this.index()
    },

    searchTerms () {
      this.pagination.page = 1
      this.index()
    },


    financialType() {
      this.onFinancialTypeChange()
    },
    
    forceIndex() {
      this.index()
    }
  },
  
  methods: {
    async index () {
      try {
        this.gettingData = true
        this.collapseAll()
        let url = `${this.firebaseUrl}/api/company/${this.currentCompany.id}/projects`

        if (this.poNumbers.length) {
          url += '/ponumber'
        }

        const {
          data: {
            projects = [],
            totalItems = 0
          } = {}
          } = await axios.post(url, {
            page: this.pagination.page,
            limit: 30,
            searchTerms: this.searchTerms,
            poNumbers: this.poNumbers,
            financialType: 'commitments'
          })

        this.projects = projects
        this.totalItems = totalItems
        this.gettingData = false
        this.setFinancialItemsIntoProjects()
      } catch (e) {
        this.notifyError(e)
      }
    },
    formatterCurrency(item, path) {
      let amount = this.$h.dg(item, path, 0)

      return this.$options.filters.currency(amount);
    },

    notifyError (error) {
      this.gettingData = false
      this.$snotify.error('Unexpected Error')
      console.error(error)
    },
    async setFinancialItemsIntoProjects () {
      try {
        if (this.projects.length) {
          this.projects.map(async project => {
            const collectionRef = db.collection('cpm_projects')
              .doc(project.id)
              .collection(this.financialType)

            if (this.$h.dg(project, this.financialType, []).length) {
              return
            }

            this.$set(
              project,
              this.financialType,
              await this.$h.ffGetDocs({ collectionRef })
            )

            await Promise.all(project[this.financialType].map(async financial => {
              financial.projectId = project.id,
              financial.projectNumber = project.number

              if (((financial || {}).commitment || {}).path) {
                const { number = '' } = (
                  await db.doc(financial.commitment.path).get()
                ).data() || {}

                financial.poNumber = number
              }

              if (this.$h.dg(financial, 'vendors', []).length) {
                let vendor = (financial.vendors.find(vendor => vendor.title) || {}).title

                if (!vendor) {
                  vendor = (financial.vendors.find(vendor => vendor.custom_id) || {}).custom_id
                }

                if (vendor) {
                  financial.vendorToShow = vendor
                }
              }
            }))
          })
        }
      } catch (error) {
        this.notifyError(error)
      }
    },
    collapseAll() {
      //this.$data.expanded = []
    },
    async onFinancialTypeChange () {
      this.collapseAll()

      if (this.poNumbers.length) {
       // await this.index()
      }

      this.setFinancialItemsIntoProjects()
    },
    onResize() {
      this.tableHeight = document.documentElement.scrollHeight - 180
    },
    openDeleteForm(item) {
    },
    onDelete() {
      this.index()
    },
    goToProject(projectId) {
      let path = ''

      if (this.$route.fullPath.search('/app/cpm') !== -1) {
        path = window.location.origin + `/cpm/${projectId}`
      } else if (this.$route.fullPath.search('/cpm/forecasting') !== -1) {
        path = window.location.origin + `/cpm/forecast/${projectId}`
      } else {
        path = `/cpm/${projectId}`
      }

      window.open(path, '_blank')
    }
  }
}
</script>

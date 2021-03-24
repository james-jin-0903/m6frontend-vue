<template>
  <v-container class="d-flex flex-wrap justify-center pa-0 rounded-lg">
    <header-component
      class="card-custom-shadow h-auto max-w-tight mb-3 mx-auto rounded w-full"
      hasslot
      :info="{title: 'Search All Companies', icon: ''}"
    >
      <template v-slot:select>
        <v-menu
          bottom
          offset-y
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="capitalize font-weight-bold mb-0 pl-1 purple--text px-0 text--darken-1 transparent"
              elevation="0"
              v-on="on"
            >
              {{ filterTypeText }}
              <v-icon class="blue--text text--darken-3">
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in areas"
              v-if="item.type !== typeFilter"
              :key="i"
              @click="setTypeFilter(item.type)"
            >
              <v-list-item-title
                :class="item.type == 'title' ? 'grey--text' : 'black--text'"
              >
                {{ item.text }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-slot:input>
        <v-text-field
          v-model="searchInput"
          class="font-weight-bold"
          dense
          flat
          height="40"
          hide-details
          label="Start Typing to Search"
          rounded
          single-line
          solo-inverted
        >
          <template v-slot:append>
            <v-row class="align-center d-flex">
              <v-icon>mdi-magnify</v-icon>
            </v-row>
          </template>
        </v-text-field>
      </template>
    </header-component>
    <app-template
      class="px-14 w-full"
      :edit-panel="true"
    >
      <v-btn
        slot="actionbtn"
        class="mb-3 w-full white"
        text
      >
        Add Company
      </v-btn>
      <div
        slot="header"
        class="align-center d-flex justify-space-between max-w-lg mx-auto pb-4 pt-6 w-full"
      >
        <div class="align-center d-flex">
          <div class="grey lighten-3 pa-16">
            <v-icon
              class="grey--text text--lighten-1"
              size="38"
            >
              mdi-image-filter-hdr
            </v-icon>
          </div>
          <div class="ml-8">
            <v-text-field
              class="add-field font-weight-regular grey lighten-3 mb-1 pt-1 px-4 rounded-xl"
              label="Title"
            />
            <v-btn
              class="blue--text capitalize px-1"
              color="transparent"
              elevation="0"
            >
              Add field
            </v-btn>
          </div>
        </div>
      </div>
      <div
        slot="btns"
        class="align-center d-flex"
      >
        <v-btn
          class="capitalize font-weight-black grey grey--text left-0 lighten-2 ml-3 pa-1 text--darken-3"
          elevation="0"
          light
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>
      <div
        slot="content"
        class="w-full"
      >
        <panel-two-columns>
          <div
            slot="leftPanel"
            class="mb-3 panel px-4 py-3 white"
          >
            <h3 class="font-weight-bold grey--text spacing-tight text--darken-1">
              Information
            </h3>
            <div class="align-start d-flex">
              <v-icon class="border mr-2 pt-2 rounded">
                mdi-alert-circle
              </v-icon>
              <div class="overflow-hidden w-full">
                <v-textarea
                  class="grey lighten-3 pt-1 px-4"
                  color="grey lighten-3"
                >
                  <template v-slot:label>
                    Description
                  </template>
                </v-textarea>
                <v-btn
                  class="blue--text capitalize px-1"
                  color="transparent"
                  elevation="0"
                >
                  Add field
                </v-btn>
              </div>
            </div>
          </div>
          <div
            slot="rightPanel"
            class="mb-3 panel px-4 py-3 white"
          >
            <h3 class="font-weight-bold grey--text spacing-tight text--darken-1">
              Information
            </h3>
            <div class="align-start d-flex">
              <v-icon class="border mr-2 pt-2 rounded">
                mdi-alert-circle
              </v-icon>
              <div class="overflow-hidden w-full">
                <v-textarea
                  class="grey lighten-3 pt-1 px-4"
                  color="grey lighten-3"
                >
                  <template v-slot:label>
                    Description
                  </template>
                </v-textarea>
                <v-btn
                  class="blue--text capitalize px-1"
                  color="transparent"
                  elevation="0"
                >
                  Add field
                </v-btn>
              </div>
            </div>
          </div>
        </panel-two-columns>
      </div>
    </app-template>
    <div
      v-for="(item, index) of filteredCompanies"
      :key="index + 'company'"
      class="px-1"
      :class="{'w-full': $vuetify.breakpoint.smAndDown, 'w-half': $vuetify.breakpoint.xl}"
    >
      <company-item :company-data="item" />
    </div>
    <div v-if="filteredCompanies.length === 0">
      No results found
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CompanyItem from '@/components/Companies/CompanyItem'
import HeaderComponent from '@/components/Home/HeaderComponent'
import AppTemplate from '@/views/Home/AppTemplate'
import PanelFull from '@/components/AppBuilder/Content/PanelFull'
import PanelTwoColumns from '@/components/AppBuilder/Content/PanelTwoColumns'

export default {
  name: 'CompaniesList',
  components: {
    CompanyItem,
    HeaderComponent,
    AppTemplate,
    PanelFull,
    PanelTwoColumns
  },
  data: () => ({
    perPage: 8,
    searchInput: '',
    typeFilter: 'all',
    items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
    areas: [
      { text: 'All Companies', type: 'all' },
      { text: 'Vendor', type: 'Vendor' },
      { text: 'Customer', type: 'Customer' }
    ],
    tabs: ['Home'],
    newTabName: ''
  }),
  computed: {
    ...mapGetters('GeneralListModule', ['get_companies_list']),
    companies() {
      return this.get_companies_list()
    },
    filteredCompanies() {
      return this.companies.filter(company => {
        const indexFound = company.record_name.toUpperCase().trim().indexOf(this.searchInput.toUpperCase().trim()) !== -1
          || company.title.toUpperCase().trim().indexOf(this.searchInput.toUpperCase().trim()) !== -1
          || company.url.toUpperCase().trim().indexOf(this.searchInput.toUpperCase().trim()) !== -1

        let typeFound = true
        if (this.typeFilter !== 'all') {
          typeFound = company.type.toUpperCase() === this.typeFilter.toUpperCase() ? true : false
        }
        return indexFound && typeFound
      })
    },
    filterTypeText() {
      return this.areas.filter(area => area.type == this.typeFilter)[0].text
    }
  },
  methods: {
    ...mapActions('GeneralListModule', ['load_mock_companies_data']),
    setTypeFilter(type) {
      this.typeFilter = type
    }
  },
  created() {
    this.load_mock_companies_data()
  }
}
</script>

<template>
  <v-container class="rounded-lg">
    <header-component
      hasslot
      :info="{title: 'Request'}"
    >
      <v-text-field
        v-model="searchText"
        height="37"
        hide-details
        label="SEARCH"
        single-line
        solo-inverted
      />
    </header-component>
    <table-component :data="{headers: get_request_table_header(), body: []}" />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import HeaderComponent from '@/components/Home/HeaderComponent'
import TableComponent from '@/components/Table'

export default {
  name: 'RequestTab',
  components: {
    HeaderComponent,
    TableComponent
  },
  data: () => ({
    searchText: ''
  }),
  computed: {
    ...mapGetters('TablesModule', ['get_request_table_header'])
  }
}
</script>

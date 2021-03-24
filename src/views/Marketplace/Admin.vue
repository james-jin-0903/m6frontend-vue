<template>
  <div>
    <v-container
      class="rounded-lg"
      fluid
    >
      <v-row>
        <v-col cols="2" />
        <v-col cols="8">
          <marketplace-admin-table />
        </v-col>
        <v-col cols="2" />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import MarketplaceAdminTable from '@/components/MarketplaceAdmin/MarketplaceAdminTable'
export default {

  components: {
    MarketplaceAdminTable
  },

  methods: {
    ...mapMutations('PageControl', {
      setShowSidePanels: 'setShowSidePanels'
    })
  },

  mounted() {
    this.setShowSidePanels(false)
  },

  beforeDestroy() {
    this.setShowSidePanels(true)
  }
}
</script>

<template>
  <v-container class="px-0 py-0 rounded-lg">
    <v-row>
      <v-col
        v-for="marketplaceItem in marketplaceItems"
        :key="marketplaceItem.id"
        :class="{
          'w-full': $vuetify.breakpoint.xs,
          'w-half': $vuetify.breakpoint.md || $vuetify.breakpoint.sm,
        }"
        :style="`${
          $vuetify.breakpoint.xlOnly || $vuetify.breakpoint.lg
            ? 'width: 33%'
            : ''
        }`"
      >
        <marketplace-item
          :marketplace-item-data="marketplaceItem"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import MarketplaceItem from './MarketplaceItem'

export default {
  name: 'MarketplaceList',
  components: {
    MarketplaceItem
  },
  data: () => ({
    marketplaceItems: []
  }),
  methods: {
    ...mapActions('AppBuilder', {
      getAppList: 'getAppList'
    }),

    ...mapActions('Marketplace', {
      getMarketplaces: 'getMarketplaces'
    }),

    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    })
  },

  computed: {
    ...mapState('AppBuilder', {
      appsList: 'appsList'
    })
  },

  async mounted() {
    try {
      await this.getAppList()
      this.marketplaceItems = await this.getMarketplaces()
    } catch (e) {
      console.log(e)
      this.notifDanger('There was an error while loading the initial data')
    }
  }
}
</script>

<style lang="scss" scoped>
div.layout.wrap {
  padding-left: 12px;
  padding-right: 12px;
  background-color: #f3f9ff;
  border-color: #f3f9ff;
}

div.flex {
  flex: none !important;
  @media (max-width: 1500px) and (min-width: 1264px) {
    width: 50% !important;
  }
  @media (max-width: 780px) and (min-width: 600px), (max-width: 480px) {
    width: 100% !important;
  }
}

.media {
  border-radius: 3%;
}
.media:hover {
  box-shadow: 0 0 3pt 2pt #ff5555;
  border-radius: 3%;
  cursor: pointer;
}
.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
  width: 100%;
  position: absolute;
}
.block {
  display: block !important;
  height: 24px;
}
</style>

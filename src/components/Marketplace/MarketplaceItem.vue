<template>
  <v-card
    class="ma-3 rounded-card"
    flat
    max-width="100%"
    outlined
  >
    <v-list-item>
      <v-list-item-avatar
        class="rounded-xl"
        tile
      >
        <v-img
          alt="no image"
          aspect-ratio="1"
          :src="getImgUrl(marketplaceItemData.app_id)"
        />
      </v-list-item-avatar>
      <v-list-item-content class="pb-0">
        <v-list-item-title class="headline mb-1 pr-4">
          {{ appsList.find((a) => a.id === marketplaceItemData.app_id).title }}
        </v-list-item-title>
        <v-list-item-subtitle class="pr-4">
          Category
        </v-list-item-subtitle>
        <v-card-text
          class="pb-0 px-0"
          v-html="marketplaceItemData.overview"
        />
      </v-list-item-content>
    </v-list-item>
    <v-card-actions class="px-4 py-2">
      <v-btn
        elevation="2"
        rounded
        small
      >
        Get
      </v-btn>
      <v-spacer />
      <v-rating
        background-color="black lighten-3"
        color="black"
        dense
        length="5"
        readonly
        size="18"
        :value="5"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'MarketplaceItem',
  props: {
    marketplaceItemData: Object
  },
  data: () => ({}),
  computed: {
    ...mapState('AppBuilder', {
      appsList: 'appsList'
    })
  },
  methods: {
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    getImgUrl(appId) {
      try {
        const imgUrl = this.appsList.find(a => a.id === appId).image_info.image_url
        if (imgUrl) return imgUrl
        else return 'https://www.freeiconspng.com/uploads/no-image-icon-7.gif'
      } catch (e) {
        return 'https://www.freeiconspng.com/uploads/no-image-icon-7.gif'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-card {
  background-color: #f3f8fe;
  min-height: 190px;
  display: flex;
  flex-direction: column;
}
.rounded-card {
  border-radius: 2rem !important;
}
.v-avatar{
  width: 40% !important;
  height: auto !important;
}
.v-card__text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 80px;
}
.v-btn.v-btn--rounded {
  width: 45%;
}
</style>

<style>
.v-card__text > * {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

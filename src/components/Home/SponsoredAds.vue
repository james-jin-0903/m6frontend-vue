<template>
  <v-row class="mx-0">
    <v-col class="pb-0 transparent">
      <v-row class="align-center justify-center mt-2 mx-0">
        <v-col
          class="d-flex grey lighten-2 mb-3 pointer pt-3 px-2 rounded-lg"
          cols="12"
        >
          <img
            alt="M6Connect"
            src="@/assets/add_1.svg"
            :style="'height:100%;'"
          >
          <div class="d-flex flex-column ml-2">
            <p class="font-weight-bold mb-0 text-body-1">
              People you can trust
            </p>
            <p>Construction Inc.</p>
          </div>
        </v-col>
        <v-col
          class="d-flex grey lighten-2 mb-3 pointer pt-3 px-2 rounded-lg"
          cols="12"
        >
          <img
            alt="M6Connect"
            src="@/assets/add_3.svg"
            :style="'height:100%;'"
          >
          <div class="d-flex flex-column ml-2">
            <p class="font-weight-bold mb-0 text-body-1">
              Save on supplies
            </p>
            <p>Office_Supply.au</p>
          </div>
        </v-col>
        <v-col
          class="d-flex grey lighten-2 mb-3 pointer pt-3 px-2 rounded-lg"
          cols="12"
        >
          <img
            alt="M6Connect"
            src="@/assets/add_2.svg"
            :style="'height:100%;'"
          >
          <div class="d-flex flex-column ml-2">
            <p class="font-weight-bold mb-0 text-body-1">
              Speedy work done right
            </p>
            <p>workdoneright.au</p>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'SponsoredAds',
  components: {
  },
  props: {
  },
  data: () => ({
    tab: null
  }),
  computed: {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>

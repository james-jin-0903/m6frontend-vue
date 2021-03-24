<template>
  <v-container class="card-custom-shadow d-flex flex-wrap justify-start panel-container py-5 relative rounded-lg white">
    <div class="absolute align-center card-content__tag d-flex font-weight-regular justify-center red text-body-1 white--text">
      {{ info['app_type'] }}
    </div>
    <div class="d-flex">
      <div class="company-image pl-5">
        <img
          v-if="info.image_info['image_url']"
          alt=""
          class="mt-2 rounded-circle"
          height="100"
          :src="info.image_info['image_url']"
          width="100"
        >
        <v-icon
          v-else
          size="100"
        >
          mdi-domain
        </v-icon>
      </div>
      <div class="pl-5">
        <p class="font-weight-regular mb-0 mt-1 text-h5">
          {{ info['title'] }} {{ info['general_info']['version'] }}
        </p>
        <span class="font-weight-regular mb-0 text-h6">{{ info['general_info']['vendor_id'] }}</span><br>
        <span class="font-weight-regular mb-1 text-h6">Version: {{ info['general_info']['version'] }}</span>
      </div>
    </div>
    <span class="font-weight-regular mb-0 mt-4 pl-5 text-h6 w-full">{{ info['general_info']['vendor_id'] }}</span>
    <span class="font-weight-regular mb-1 pl-5 text-h6 w-full">Version: {{ info['general_info']['version'] }}</span>
    <div class="align-center d-flex mb-2 mt-5 pl-5 w-full">
      <span class="font-weight-regular mb-0 mr-3 text-body-2">AKA</span>
      <div class="d-flex flex-wrap justify-center">
        <v-chip
          v-for="aka in also_know_as"
          :key="'aka-' + aka.value"
          class="mx-1 text-body-2"
          color="grey lighten-3"
        >
          {{ aka.value }}
        </v-chip>
      </div>
    </div>
    <div class="align-center d-flex pl-5 w-full">
      <span class="font-weight-regular mb-0 mr-3 text-body-2">FKA</span>
      <div class="d-flex flex-wrap justify-center">
        <v-chip
          v-for="fka in formerly_known_as"
          :key="'fka-' + fka.value"
          class="mx-1 text-body-2"
          color="grey lighten-3"
        >
          {{ fka.value }}
        </v-chip>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ITAppsSummary',
  components: {
  },
  props: {
    info: Object
  },
  data: () => ({
    formerly_known_as: [],
    also_know_as: []
  }),
  computed: {
  },
  methods: {
    ...mapActions('ITAppsModule', ['getTagsAkaFka'])
  },
  created() {
    this.getTagsAkaFka(this.info.id).then(res => (
      this.formerly_known_as = res.data.formerly_known_as,
      this.also_know_as = res.data.also_know_as
    ))
  }
}
</script>

<style lang="scss">
.panel-container {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
.list-items {
  list-style: none;
}
.company-image {
    position: relative;
    &:after {
        height: 22px;
        width: 22px;
        border-radius: 100%;
        background: #81DF06;
        bottom: 0;
        content: "";
        position: absolute;
        right: 2px;
        top: 13px;
    }
}
</style>

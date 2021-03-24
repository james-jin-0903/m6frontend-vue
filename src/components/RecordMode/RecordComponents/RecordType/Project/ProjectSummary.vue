<template>
  <v-container class="px-0 py-0 rounded-lg white">
    <v-img
      class="align-end white--text"
      height="100px"
      :src="info['record_image_url']"
    >
      <div class="absolute px-3 py-1 right-0 top-0">
        {{ info['phase'] }}
      </div>
    </v-img>
    <v-card-text class="py-1 text--primary">
      <div class="align-baseline d-flex flex-nowrap flex-row">
        <div class="font-weight-black subtitle-1">
          {{ info['record_name'] }}
        </div>
        <v-spacer />
        <div class="caption">
          <span class="font-weight-black">ID:</span>
          {{ info['uid'] }}
        </div>
      </div>
      <div class="caption custom-line-height">
        <div>
          <span class="font-weight-black">Company:</span>
          {{ info['company'] }}
        </div>
        <div>
          <span class="font-weight-black">Department:</span>
          {{ info['department'] }}
        </div>
        <div>
          <span class="font-weight-black">record Leader:</span>
          {{ info['record_leader'] || 'Not assigned' }}
        </div>
      </div>
    </v-card-text>
  </v-container>
</template>

<script>

export default {
  name: 'ProjectSummary',
  props: {
    info: Object
  },
  methods: {
  }
}
</script>

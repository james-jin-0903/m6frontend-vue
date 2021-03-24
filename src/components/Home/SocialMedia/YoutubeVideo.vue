<template>
  <div>
    <div
      v-for="(row,index) in videoIds"
      :key="index"
      class="video-container"
    >
      <youtube :video-id="row" />
    </div>
  </div>
</template>

<script>
import { getIdFromURL } from 'vue-youtube-embed'

export default {
  name: 'YoutubeVideo',
  props: {
    urls: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    videoIds: []
  }),
  mounted() {
    this.urls.map(row => {
      this.videoIds.push(getIdFromURL(row))
    })
  }
}
</script>

<style>
.video-container {
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 30px;
  height: 0;
  overflow: hidden;
}

.video-container iframe,
.video-container object,
.video-container embed {
  position: absolute;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
}
</style>

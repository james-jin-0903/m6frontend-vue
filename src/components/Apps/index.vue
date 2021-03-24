<template>
  <v-container
    class="d-flex dont-show-scroll h-full mx-0 pb-0 pt-0 pt-sm-5 px-0 rounded-lg vertical-scroll"
    :class="{
      'w-full': $vuetify.breakpoint.xs ,
      'w-3__5': ($vuetify.breakpoint.md || $vuetify.breakpoint.sm),
      'max-w-xl w-content': $vuetify.breakpoint.lgAndUp && !tableView
    }"
    fluid
    :style="` ${ tableView ? 'width: 100%' : '' } `"
  >
    <!-- General use list component-->
    <template v-if="screenStatus()">
      <record-container
        class="align-content-start main-content"
        :data="recordFullScreen()"
      />
    </template>
    <template v-else>
      <!-- Project List Component -->
      <general-list
        class="align-content-start main-content px-0"
        @tableView="validateView"
      />
    </template>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import GeneralList from '@/views/Home/GeneralList'
import RecordContainer from '@/components/RecordMode/RecordContainer'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'Records',
  components: {
    RecordContainer,
    GeneralList
  },
  data: () => ({
    tableView: false
  }),
  computed: {
    ...mapGetters({
      screenStatus: 'GeneralListModule/get_screen_status',
      recordFullScreen: 'GeneralListModule/get_record_full_screen',
      imageOverlay: 'get_image_preview_overlay'
    }),
    ...mapState(['layout']),
    imageArray() {
      return this.imageOverlay()[0]
    },
    selectedImage() {
      return this.imageOverlay()[1]
    },
    overlayActive() {
      return this.imageOverlay()[0].length > 0
    }
  },
  methods: {
    ...mapActions(['reset_image_overlay']),
    restartImageArray() {
      this.reset_image_overlay()
    },
    validateView(e) {
      this.tableView = e.key === 'table'
    }
  }
}
</script>

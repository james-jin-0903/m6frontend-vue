<template>
  <v-container class="d-flex dont-show-scroll h-full ma-0 pb-0 pt-5 px-0 rounded-lg vertical-scroll w-main-content">
    <!-- General use list component-->
    <template v-if="get_screen_status()">
      <record-container
        class="align-content-start main-content"
        :data="get_record_full_screen()"
      />
    </template>
    <template v-else>
      <!-- Companies List Component -->
      <companies-list class="align-content-start main-content" />
      sin g algon anf
    </template>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import CompaniesList from '@/views/Home/CompaniesList'
import RecordContainer from '@/components/RecordMode/RecordContainer'

export default {
  name: 'Apps',
  components: {
    CompaniesList,
    RecordContainer
  },
  data: () => ({
    tab: null,
    items: [
      'Profile',
      'People',
      'Details'
    ],
    currentTab: 0,
    showColumnLeft: true,
    showColumnRight: true
  }),
  computed: {
    ...mapGetters({
      get_screen_status: 'GeneralListModule/get_screen_status',
      get_record_full_screen: 'GeneralListModule/get_record_full_screen',
      get_image_preview_overlay: 'get_image_preview_overlay'
    })
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>

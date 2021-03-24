<template>
  <v-container class="h-full max-w-none pa-0 rounded-lg">
    <record-header :header-data-record="infoRecordData" />
    <navigation-bar
      v-if="get_screen_status() && recordData === null"
      class="dont-show-scroll preview-content vertical-scroll"
      :nav-widgets="actions"
      :project="get_record_full_screen()"
    />
    <navigation-bar
      v-else
      class="dont-show-scroll preview-content vertical-scroll"
      :nav-widgets="actions"
      :project="infoRecordData"
    />
  </v-container>
</template>

<script>
/* eslint-disable vue/prop-name-casing */
import { mapGetters, mapActions } from 'vuex'
import NavigationBar from './NavigationBar'
import globalDataApp from '../../store/data'
import RecordHeader from './RecordHeader'

export default {
  name: 'RecordContainer',
  components: {
    NavigationBar,
    RecordHeader
  },
  props: {
    recordData: {
      type: Object,
      default: () => ({})
    },
    recordIndex: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    actions: []
  }),
  computed: {
    ...mapGetters('GeneralListModule', [
      'get_screen_status',
      'get_record_full_screen'
    ]),
    infoRecordData() {
      return this.recordData
    },
    infoWidget() {
      return this.setData()
    }
  },
  watch: {
    infoRecordData: function () {
      this.setData()
    }
  },
  mounted() {
    this.setData()
  },
  methods: {
    ...mapActions('AppBuilder', {
      previewNav: 'getNavigationPreView'
    }),
    async setData() {
      if (this.infoRecordData.app_type === 'dynamic_app') {
        this.actions = await this.previewNav(this.infoRecordData.app_id)
      } else {
        this.actions = this.get_screen_status() ? globalDataApp.records_widgets[this.get_record_full_screen().app_type]
          : globalDataApp.records_widgets[this.infoRecordData.app_type]
      }
    }
  }
}
</script>

<style>
.preview-content {
  height: calc(100% - 41px);
}
</style>

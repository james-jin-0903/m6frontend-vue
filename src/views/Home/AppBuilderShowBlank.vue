<template>
  <div>
    <record-stepper v-if="app.layout_type === 'Stepper'" />
    <app-builder-show v-else />
  </div>
</template>

<script>
import AppBuilderShow from '@/views/Home/AppBuilderShow.vue'
import { mapMutations, mapActions } from 'vuex'
import RecordStepper from '@/components/RecordStepper/index.vue'

export default {
  name: 'AppBuilderShowBlank',
  components: {
    AppBuilderShow,
    RecordStepper
  },

  data: () => ({
    app: {}
  }),


  // computed: {
  //   ...mapState('AppBuilder', {
  //     app: 'app'
  //   })
  // },

  async mounted() {
    this.setShowSidePanels(false)
    this.setDisplayAppBuilderShow()

    // try {
    //   const record = await this.getRecordById(this.$route.params.id)
    //   const app = await this.getApp(record.app_id)
    //   this.app = app
    // } catch (e) {}
  },

  // beforeDestroy() {
  //   this.setDisplayAppBuilderShow()
  //   this.setShowSidePanels(true)
  // },

  methods: {
    ...mapMutations('PageControl', {
      setShowSidePanels: 'setShowSidePanels'
    }),
    ...mapMutations('RecordsInstance', {
      setDisplayAppBuilderShow: 'setDisplayAppBuilderShow',
      setCurrentRecord: 'setCurrentRecord'
    }),
    ...mapActions('AppBuilder', {
      getApp: 'getApp'
    }),
    ...mapMutations('AppBuilder', {
      setCurrentApp: 'setCurrentApp'
    }),
    ...mapActions('RecordsInstance', {
      getRecordById: 'getRecordById'
    })
  },
  beforeDestroy() {
    this.setShowSidePanels(true)
  }
}
</script>

<style lang="scss" scoped>

</style>

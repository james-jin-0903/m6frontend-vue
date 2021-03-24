<template>
  <builder-main v-if="standardView" />
  <website-builder-main v-else />
</template>

<script>
import BuilderMain from '@/views/Builder/BuilderMain'
import WebsiteBuilderMain from '@/views/Builder/WebsiteBuilderMain'
import { mapState } from 'vuex'
export default {
  name: 'MasterBuilder',
  components: {
    BuilderMain,
    WebsiteBuilderMain
  },

  computed: {
    ...mapState('AppBuilder', {
      app: 'app'
    }),

    standardView() {
      return this.$h.dg(this.app, 'layout_type', '').toUpperCase() !== 'WEBSITE'
    }
  },

  async mounted() {
    try {
      await this.$store.dispatch('AppBuilder/getApp', this.$route.params.id)
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style lang="scss" scoped>
.h-full {
  height: 100%;
}
</style>

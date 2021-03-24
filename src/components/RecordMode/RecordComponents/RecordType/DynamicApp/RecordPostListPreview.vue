<template>
  <v-card class="dont-show-scroll h-full my-5 pa-0 rounded-lg vertical-scroll">
    <project-social-media
      class="pa-0"
      :read-only="true"
    />
  </v-card>
</template>

<script>
import ProjectSocialMedia from '@/views/Home/ProjectSocialMedia'

export default {
  name: 'RecordPostListPreview',
  components: {
    ProjectSocialMedia
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
  }),
  async mounted() {
    await this.$store.dispatch('GSFeed/setRoom', 'AppBuilder')
    await this.$store.dispatch('GSFeed/setBuilderFeed', this.info.record_number.replace('#', '_'))
    await this.$store.dispatch('GSFeed/retrieveFeed')
  }
}
</script>

<template>
  <v-dialog
    v-model="show"
    max-width="900px"
    persistent
  >
    <v-card>
      <v-card-title
        class="grey--text headline text--darken-1 text-h6 white"
      >
        Schedule Settings
        <v-spacer />
        <portal-target name="schedule" />
      </v-card-title>
      <v-divider class="grey lighten-3" />
      <v-card-text
        class="hidden-overflow pa-0 vertical-scroll"
        :style="{'height': getViewPortHeight}"
      >
        <v-container
          class="pa-0 rounded-lg"
          fluid
        >
          <default-schedule :included="true" />
        </v-container>
      </v-card-text>


      <v-divider />
      <m6-loading :loading="showLoading" />
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="gray"
          elevation="1"
          text
          @click="$emit('close')"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script >
import DefaultSchedule from '../../settings/components/settings/DefaultSchedule'
export default {
  components: {
    'default-schedule': DefaultSchedule
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tab: 0,
      showLoading: false,
      viewPortHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) * 0.7
    }
  },
  computed: {
    getViewPortHeight() {
      return `${this.viewPortHeight}px`
    }
  }
}
</script>

<style lang="scss" >
  .hidden-overflow {
    overflow-x:hidden;
  }
</style>

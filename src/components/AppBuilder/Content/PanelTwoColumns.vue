<template>
  <v-row class="d-flex justify-center ma-0 mb-2 pa-0 w-full">
    <v-col
      class="d-flex flex-column pa-0"
      :class="{'pr-2': !website}"
      :cols="leftColumn"
      style="z-index: 0;"
    >
      <slot name="leftPanel" />
    </v-col>
    <v-col
      class="pa-0 pl-2"
      :class="{'pl-2': !website, 'pa-4 pr-2': $vuetify.breakpoint.xs}"
      :cols="rightColumn"
      style="z-index: 0; padding-left: 16px !important"
    >
      <slot name="rightPanel" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PanelTwoColumns',
  components: {
  },
  props: {
    website: {
      type: Boolean,
      default: false
    },
    rightColumn: {
      type: [Number, String],
      default: 6
    },
    leftColumn: {
      type: [Number, String],
      default: 6
    }
  },
  data: () => ({
  }),
  computed: {
  },
  methods: {
  }
}
</script>

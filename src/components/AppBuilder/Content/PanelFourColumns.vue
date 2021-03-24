<template>
  <v-row class="d-flex justify-center ma-0 mb-2 pa-0 w-full">
    <v-col class="d-flex flex-column pa-0" :cols="3" style="z-index: 0">
      <slot name="leftPanel" />
    </v-col>
    <v-col class="d-flex flex-column pa-0 px-2" style="z-index: 0" :cols="3">
      <slot name="leftCenterPanel"></slot>
    </v-col>
    <v-col class="d-flex flex-column pa-0 px-2" style="z-index: 0" :cols="3">
      <slot name="rightCenterPanel"></slot>
    </v-col>
    <v-col class="pa-0 pl-2" :cols="3">
      <slot name="rightPanel" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "PanelFourColumns",
  components: {},
  props: {
    website: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({}),
  computed: {},
  methods: {},
};
</script>

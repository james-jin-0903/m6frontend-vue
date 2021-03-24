<template>
  <v-row class="d-flex justify-center ma-0 mb-2 pa-0 w-full">
    <v-col
      class="d-flex flex-column pa-0"
      :class="{ 'pr-2': !website }"
      :cols="3"
      style="z-index: 0"
    >
      <slot name="leftPanel" />
    </v-col>
    <v-col class="d-flex flex-column pa-0 px-2" style="z-index: 0" :cols="6">
      <slot name="centerPanel"></slot>
    </v-col>
    <v-col class="pa-0 pl-2" :cols="3">
      <slot name="rightPanel" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "PanelThreeColumns",
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

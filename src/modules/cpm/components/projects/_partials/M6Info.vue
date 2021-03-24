<template>
  <v-dialog
    persistent
    :value="true"
    :width="600"
  >
    <v-card>
      <v-card-title class="info pa-6 title white--text">
        <v-row
          align="center"
          class="d-flex justify-between ma-0"
        >
          <v-col class="pa-0 white--text">
            {{ title }}
          </v-col>
          <v-col class="pa-0 shrink">
            <v-icon
              dark
              @click="close"
            >
              mdi-close
            </v-icon>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="dont-show-scroll pt-4 vertical-scroll">
        <slot />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'M6Info',

  props: {
    title: {
      type: String,
      required: true
    }
  },

  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

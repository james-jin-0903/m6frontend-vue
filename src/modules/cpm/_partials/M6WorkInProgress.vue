<template>
  <v-dialog
    v-model="showing"
    max-width="480"
    @input="closeModal"
  >
    <v-card class="rounded-lg white">
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">{{ title }}</span>
      </v-card-title>
      <v-divider class="grey lighten-3" />
      <v-card-text class="headline vertical-scroll white--text">
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />

        <v-btn
          color="white"
          text
          @click="closeModal"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'M6WorkInProgress',
  props: {
    title: {
      type: String,
      default: 'Coming soon...'
    },
    message: {
      type: String,
      default: 'We are working hard to give you a better experience'
    },
    show: {
      type: [Boolean, Number, String],
      required: true
    }
  },
  data() {
    return {
      showing: false
    }
  },
  watch: {
    show(v) {
      this.showing = v
    },

    showing(v) {
      if (!v) {
        this.closeModal()
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    }
  }
}
</script>

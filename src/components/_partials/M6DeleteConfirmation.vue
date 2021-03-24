<template>
  <v-dialog
    v-model="showing"
    width="500"
  >
    <v-card>
      <v-card-title color="red">
        {{ title }}
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-card-text class="pt-3">
        {{ message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="red"
          :disabled="deleting"
          text
          @click="$emit('cancel')"
        >
          Cancel
        </v-btn>

        <v-btn
          color="red"
          dark
          :disabled="deleting"
          @click="$emit('confirm')"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'M6DeleteConfirmation',

  props: {
    confirm: {
      type: Boolean,
      default: false
    },

    deleting: {
      type: [Boolean, Number, String],
      default: false
    },

    details: {
      type: Array,
      default: () => []
    },

    message: {
      type: String,
      default: 'Are you sure you want to delete this resource?'
    },

    show: {
      type: [Boolean, Number, String],
      required: true
    },

    title: {
      type: String,
      default: 'Confirmation'
    }
  },

  data: () => ({
    showing: false
  }),

  watch: {
    show: {
      immediate: true,
      handler: function (v) {
        this.showing = v
      }
    },

    showing(v) {
      if (!v) {
        this.$emit('cancel')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

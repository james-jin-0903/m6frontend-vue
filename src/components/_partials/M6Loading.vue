<template>
  <v-dialog
    persistent
    :value="loading"
    width="300"
  >
    <v-card
      color="primary"
      dark
    >
      <v-card-text class="pt-3">
        {{ message }}

        <v-progress-linear
          class="mb-0"
          color="white"
          indeterminate
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'M6Loading',

  props: {
    loading: {
      type: Boolean,
      default: false
    },

    message: {
      type: String,
      default: 'Please stand by'
    }
  }
}
</script>

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
        {{ loadingMessage }}

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
import { mapGetters } from 'vuex'

export default {
  name: 'M6LoadingV2',

  computed: {
    ...mapGetters(['loading', 'loadingMessage'])
  }
}
</script>

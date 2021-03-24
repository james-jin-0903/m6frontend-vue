<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="500"
  >
    <v-card>
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">Coming Soon</span>
      </v-card-title>
      <v-divider class="grey lighten-3" />
      <v-card-text class="vertical-scroll">
        This feature is on it's way
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="red"
          text
          @click="$emit('close-dialog')"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['html', 'dialog']
}
</script>

<style type="scss" scoped>

</style>

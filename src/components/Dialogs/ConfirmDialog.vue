<template>
  <v-card class="rounded-lg">
    <v-card-title class="headline">
      Are you sure?
    </v-card-title>

    <v-card-text>
      {{ message }}
    </v-card-text>

    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="green darken-1"
        outlined
        @click="res(false)"
      >
        {{ cancelLabel }}
      </v-btn>
      <v-btn
        color="green darken-1"
        outlined
        @click="res(true)"
      >
        {{ okLabel }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    message: String,
    okLabel: String,
    cancelLabel: String
  },
  methods: {
    res(a) {
      this.$emit('closeDeleteModal', a)
    }
  }
}
</script>

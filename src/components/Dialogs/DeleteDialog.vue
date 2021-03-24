<template>
  <v-card class="rounded-lg">
    <v-card-title class="headline">
      Are you sure?
    </v-card-title>

    <v-card-text>
      Do you want to remove the {{ element }}
    </v-card-text>

    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="green darken-1"
        outlined
        @click="res(false)"
      >
        Cancel
      </v-btn>
      <v-btn
        color="green darken-1"
        outlined
        @click="res(true)"
      >
        Remove
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'DeleteDialog',
  props: {
    element: String
  },
  methods: {
    res(a) {
      this.$emit('closeDeleteModal', a)
    }
  }
}
</script>

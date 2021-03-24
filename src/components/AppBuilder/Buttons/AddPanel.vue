<template>
  <v-btn
    class="capitalize green lighten-2 mr-2 white--text"
    :class="sm ? 'px-3 py-4' : 'px-8 py-6'"
    text
    @click="addNewPanel"
  >
    Add Panel
  </v-btn>
</template>

<script>
export default {
  name: 'AddPanel',
  props: {
    sm: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    addNewPanel() {
      this.$emit('addNewPanel')
    }
  }
}
</script>

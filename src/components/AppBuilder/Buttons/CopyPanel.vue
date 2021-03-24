<template>
  <v-btn
    class="capitalize green lighten-2 white--text"
    :class="sm ? 'px-3 py-4' : 'px-8 py-6'"
    text
    @click="copyPanel"
  >
    Copy Panel
  </v-btn>
</template>

<script>
export default {
  name: 'CopyPanel',
  props: {
    sm: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    copyPanel() {
      this.$emit('copyPanel')
    }
  }
}
</script>

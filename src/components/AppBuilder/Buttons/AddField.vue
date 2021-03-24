<template>
  <v-btn
    class="blue--text capitalize px-1"
    color="transparent"
    elevation="0"
    @click="addNewField"
  >
    Add field
  </v-btn>
</template>

<script>
export default {
  name: 'AddPanel',
  methods: {
    addNewField() {
      this.$emit('addNewField')
    }
  }
}
</script>

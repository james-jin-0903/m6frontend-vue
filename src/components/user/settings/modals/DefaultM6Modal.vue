<template>
  <v-dialog
    v-model="showInput"
    max-width="500"
  >
    <v-card>
      <v-card-title
        class="blue ctm-mb-16 d-flex headline justify-space-between"
      >
        <span class="white--text">
          <slot name="title" />
        </span>
      </v-card-title>
      <v-card-text class="m6DialogContent">
        <slot name="content" />
      </v-card-text>
      <v-card-actions>
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DefaultM6Modal',
  data() {
    return {
      showInput: true
    }
  },
  watch: {
    showInput() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.m6DialogContent{
  max-height: 60vh;
  min-height: 40vh;
  overflow-y: auto;
  overflow-x: visible;
}
</style>

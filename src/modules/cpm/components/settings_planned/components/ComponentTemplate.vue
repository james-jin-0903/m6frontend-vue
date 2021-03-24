<template>
  <v-card class="rounded-lg selected-setting">
    <v-card-title>
      <v-spacer />
      <slot name="button" />
    </v-card-title>
    <slot />
    <v-card-text class="vertical-scroll" />
  </v-card>
</template>

<script>
export default {
  name: 'ComponentTemplate'
}
</script>

<style lang="scss" scoped>
  .selected-setting {
    height: 100%;
  }
</style>

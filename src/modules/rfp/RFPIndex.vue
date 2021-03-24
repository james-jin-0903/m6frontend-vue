<template>
  <v-container
    class="d-flex dont-show-scroll h-full ma-0 mt-15 pb-0 pt-4 rounded-lg vertical-scroll"
    :class="{
      'w-full px-0': $vuetify.breakpoint.xs ,
      'w-3__5 px-4': $vuetify.breakpoint.md || $vuetify.breakpoint.sm,
      'w-70': $vuetify.breakpoint.lgAndUp }"
  >
    <iframe
      class="full-screen"
      src="https://apps.m6connect.com/company-home#/"
    />
  </v-container>
</template>

<script>
export default {
  name: 'RFPIndex',
  mounted() {
    this.$store.dispatch('PageControl/setShowSidePanels', false)
    this.$store.dispatch('PageControl/setShowChatPanel', true)
  }
}
</script>

<style scoped lang="css">
.full-screen{
  width: 100%;
  height: 100vh;
}
</style>

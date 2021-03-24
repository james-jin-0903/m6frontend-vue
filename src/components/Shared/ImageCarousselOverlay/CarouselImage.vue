<template>
  <div style="height: 90vh; overflow: hidden; position: relative;">
    <div class="align-center d-flex fill-height justify-center">
      <img
        :src="image.url"
        style="width: 80%;"
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      required: true
    }
  }
}
</script>

<style scoped>
</style>


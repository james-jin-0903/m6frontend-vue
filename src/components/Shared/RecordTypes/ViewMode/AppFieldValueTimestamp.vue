<template>
  <p>
    {{ appValue?appValue.value:'' }}
  </p>
</template>

<script>
export default {
  name: 'AppFieldValueTimestamp',
  props: {
    appValue: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

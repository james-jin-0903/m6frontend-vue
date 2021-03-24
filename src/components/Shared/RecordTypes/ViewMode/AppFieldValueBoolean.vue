<template>
  <p>
    {{ appValue?appValue.value:'' }}
  </p>
</template>

<script>
export default {
  name: 'AppFieldValueBoolean',
  props: {
    appValue: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

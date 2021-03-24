<template>
  <p>
    {{ appValue?appValue.value:'' }}
  </p>
</template>

<script>
export default {
  name: 'AppFieldValueAutocomplete',
  props: {
    appValue: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

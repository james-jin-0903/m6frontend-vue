<template>
  <p>
    {{ appValue?appValue.value:'' }}
  </p>
</template>

<script>
export default {
  name: 'AppFieldValueAutocompleteAddress',
  props: {
    appValue: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

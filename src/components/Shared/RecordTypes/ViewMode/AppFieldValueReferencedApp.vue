<template>
  <p>
    {{ appValue?appValue.value:'' }}
  </p>
</template>

<script>
export default {
  name: 'AppFieldValueReferencedApp',
  props: {
    appValue: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

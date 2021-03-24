<template>
  <p>
    {{ appValue?appValue.value:'' }}
  </p>
</template>

<script>
export default {
  name: 'AppFieldValueText',
  props: {
    appValue: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

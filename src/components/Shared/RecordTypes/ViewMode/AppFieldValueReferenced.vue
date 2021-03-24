<template>
  <p>
    {{ appValue?appValue.value:'' }}
  </p>
</template>

<script>
export default {
  name: 'AppFieldValueReferenced',
  props: {
    appValue: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

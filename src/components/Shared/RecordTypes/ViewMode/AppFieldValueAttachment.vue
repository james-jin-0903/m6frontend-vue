<template>
  <p>
    {{ appValue?appValue.value:'' }}
  </p>
</template>

<script>
export default {
  name: 'AppFieldValueAttachment',
  props: {
    appValue: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

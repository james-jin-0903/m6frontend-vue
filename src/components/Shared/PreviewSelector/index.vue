<template>
  <div class="h-full rounded-lg w-full">
    <record-container :record-data="data" />
  </div>
</template>

<script>
import RecordContainer from '@/components/RecordMode/RecordContainer'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'PreviewSelector',
  components: {
    RecordContainer
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss">
</style>

<template>
  <v-col
    class="pa-0"
    cols="12"
  >
    <template v-if="metadata.textOption === 'textarea'">
      <v-textarea
        v-if="metadata.textOption_auto_grow === 'true'"
        v-model="textValue"
        auto-grow
        :label="label"
        :value="value"
      />
      <v-textarea
        v-else
        v-model="textValue"
        :label="label"
        :rows="metadata.textOption_rows ? metadata.textOption_rows : 3"
        :value="value"
      />
    </template>
    <v-text-field
      v-else
      v-model="textValue"
      class="white"
      :label="label"
      outlined
      :value="value"
    />
  </v-col>
</template>

<script>
export default {
  name: 'TextField',
  props: {
    value: {
      type: String,
      default: ''
    },
    metadata: {
      type: Object,
      default: () => {}
    },
    label: {
      type: String,
      default: ''
    },
    textClass: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    textValue: ''
  }),
  watch: {
    textValue() {
      this.$emit('changeText', this.textValue)
    }
  }
}
</script>

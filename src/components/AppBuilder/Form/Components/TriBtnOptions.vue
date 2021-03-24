<template>
  <div>
    <label>
      {{ label }}
    </label>
    <v-radio-group 
      v-if="metadata.trileanOption === 'vertical'"
      v-model="radio"
    >
      <v-radio
        label="Yes"
        :value="1"
      />
      <v-radio
        label="No"
        :value="0"
      />
      <v-radio
        label="N/A"
        :value="-1"
      />
    </v-radio-group>
    <v-radio-group 
      v-else
      v-model="radio"
      class="horizontal-radio-group"
      row
    >
      <v-radio
        label="Yes"
        :value="1"
      />
      <v-radio
        label="No"
        :value="0"
      />
      <v-radio
        label="N/A"
        :value="-1"
      />
    </v-radio-group>
  </div>
</template>

<script>
export default {
  name: 'TriBtnOptions',
  props: {
    value: {
      type: [Number],
      default: 0
    },
    label: {
      type: String,
      default: ''
    },
    metadata: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    radio: {
      get() {
        return this.value
      },
      set(data) {
        this.$emit('input', data)
      }
    }
  },
  mounted() {
    this.$emit('input', this.radio)
  }
}
</script>

<style lang="scss">
  .horizontal-radio-group .v-input--radio-group__input {
    justify-content: center;
  }
</style>

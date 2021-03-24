<template>
  <v-tooltip
    top
  >
    <template v-slot:activator="{ on, attrs }">
      <span
        v-bind="attrs"
        :class="textColor"
        v-on="on"
      >
        <slot name="content" />
      </span>
    </template>
    <span
      v-if="hasTooltipSlot"
      class="help-text__span"
    >
      <slot name="tooltip" />
    </span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'FieldTooltip',
  props: {
    icon: {
      type: String,
      default: 'mdi-information-outline'
    },
    textColor: {
      type: String,
      default: 'grey--text lighten-2'
    }
  },
  computed: {
    hasTooltipSlot() {
      return !!this.$slots['tooltip']
    }
  }
}
</script>

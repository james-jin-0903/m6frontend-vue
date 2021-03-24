<template>
  <v-tooltip
    top
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-if="hasBuilderAccess"
        v-bind="attrs"
        class="grey--text lighten-2 mr-2"
        height="18"
        icon
        width="18"
        v-on="on"
        @click="field.showFieldForm = true"
      >
        <v-img
          v-if="field.metadata.iconUrl"
          contain
          height="18"
          :src="field.metadata.iconUrl"
          width="18"
        />
        <v-icon
          v-else
          :color="color"
          size="18"
        >
          {{ icon }}
        </v-icon>
      </v-btn>
      <span
        v-else
        v-bind="attrs"
        class="grey--text lighten-2"
        v-on="on"
      >
        <v-img
          v-if="field.metadata.iconUrl"
          contain
          height="18"
          :src="field.metadata.iconUrl"
          width="18"
        />
        <v-icon
          v-else
          :color="color"
          size="18"
        >
          {{ icon }}
        </v-icon>
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
  name: 'BuilderFieldIcon',
  props: {
    icon: {
      type: String,
      default: 'mdi-information-outline'
    },
    color: {
      type: String,
      default: 'grey'
    },
    field: {
      type: Object,
      default: () => ({
        metadata: {
          iconUrl: null
        }
      })
    }
  },
  computed: {
    hasTooltipSlot() {
      return !!this.$slots['tooltip']
    },
    hasBuilderAccess() {
      return true
    }
  }
}
</script>

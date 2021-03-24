<template>
  <v-container class="rounded-lg">
    <v-row align="center">
      <!-- Must be v-flex -->
      <slot name="before:search" />

      <v-spacer />
      <v-col
        id="step3"
        cols="3"
      >
        <v-text-field
          id="search"
          append-icon="mdi-magnify"
          clearable
          :label="label"
          :value="search"
          @input="onInputSearch"
        />
      </v-col>

      <!-- Must be v-flex -->
      <slot name="after:search" />
      <slot name="after:search:btn" />
    </v-row>

    <v-row>
      <template v-if="!withoutResults">
        <slot />
      </template>

      <m6-no-results v-else-if="!loading" />
    </v-row>

    <m6-loading :loading="loading" />
  </v-container>
</template>

<script>
export default {
  name: 'M6List',

  props: {
    label: {
      type: String,
      default: 'Search'
    },

    loading: {
      type: Boolean,
      default: false
    },

    onInputSearch: {
      type: Function,
      default: () => null
    },

    search: {
      type: [String, Number],
      default: ''
    },

    withoutResults: {
      type: Boolean,
      default: true
    }
  }
}
</script>

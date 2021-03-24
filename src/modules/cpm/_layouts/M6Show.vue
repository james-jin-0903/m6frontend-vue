<template>
  <v-container
    class="fill-height pa-0 rounded-lg"
    fluid
  >
    <v-row class="fill-height">
      <v-col
        v-if="!withoutAside"
        class="fill-height shrink"
      >
        <v-row class="fill-height">
          <v-card
            class="rounded-lg"
            :color="asideColor"
          >
            <h1
              class="display-2 ma-3 text-center white--text"
              v-text="asideTitle"
            />

            <v-row
              :style="`width: ${asideWidth}px`"
            >
              <slot name="aside" />
            </v-row>
          </v-card>
        </v-row>
      </v-col>

      <v-col :style="`width: calc(100% - ${withoutAside ? 0 : asideWidth}px)`">
        <slot />
      </v-col>
    </v-row>

    <m6-loading :loading="loading" />
  </v-container>
</template>

<script>
export default {
  name: 'M6Show',

  props: {
    asideColor: {
      type: String,
      default: '#3374BD'
    },

    asideTitle: {
      type: [Number, String],
      default: ''
    },

    asideWidth: {
      type: [Number, String],
      default: 400
    },

    loading: {
      type: Boolean,
      default: false
    },

    withoutAside: {
      type: Boolean,
      default: false
    }
  }
}
</script>


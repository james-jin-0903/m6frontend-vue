<template>
  <div class="text-center">
    <v-dialog
      v-model="show"
      width="500"
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            {{ title }}
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />

        <v-card-text class="vertical-scroll">
          {{ text }}
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="$emit('close')"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script >
export default {
  props: {
    title: {
      required: true,
      default: ''
    },
    text: {
      required: true,
      default: ''
    },
    color: {
      default: 'gray'
    },
    show: {
      default: false
    }
  }
}
</script>

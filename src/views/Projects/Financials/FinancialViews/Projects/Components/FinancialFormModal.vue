<template>
  <v-dialog
    :value="true"
    @input="close"
    width="800px"
  >
    <v-card>
      <v-card-title class="primary white--text">
        <slot name="title"></slot>
      </v-card-title>
      <v-card-text>
        <v-row class="justify-center">
          <v-col cols="10">
            <slot name="form"></slot>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title>
        <slot name="actions"></slot>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'FinancialFormModal',

  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

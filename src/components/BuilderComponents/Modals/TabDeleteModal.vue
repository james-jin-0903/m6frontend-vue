<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="500"
  >
    <v-card>
      <v-card-title>
        Delete Tab
      </v-card-title>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="red darken-2"
          text
          @click="closing"
        >
          Close
        </v-btn>
        <v-btn
          class="white--text"
          color="green darken-2"
          @click="deleteCurrentTab"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'TabDeleteModal',
  props: {
    dialog: Boolean
  },
  methods: {
    deleteCurrentTab() {
      this.$emit('deleteTab')
    },
    closing() {
      this.$emit('closeTab')
    }
  }
}
</script>

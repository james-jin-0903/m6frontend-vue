<template>
  <div>
    <v-dialog
      v-model="showActions"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          absolute
          color="primary"
          dark
          fab
          left
          small
          style="top: 65px"
          top
          v-on="on"
          @click="showActions = !showActions"
        >
          <v-icon>mdi-account-hard-hat</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="grey headline lighten-2">
          Activities
        </v-card-title>

        <v-card-text>
          <app-activities />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="showActions = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AppActivities from '@/views/AppBuilder/AppActivities'

export default {
  components: {
    AppActivities
  },

  data: () => ({
    showActions: false
  })
}
</script>

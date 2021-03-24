<template>
  <div>
    <v-dialog v-model="showModal" width="500">
      <m6-loading :loading="loading" />
      <template v-slot:activator="{ on, attrs }">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              absolute
              color="primary"
              dark
              fab
              left
              small
              style="top: 280px"
              top
              v-on="on"
              @click="showModal = !showModal"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span class="help-text__span">Edit App</span>
        </v-tooltip>
      </template>

      <v-card>
        <v-card-title class="grey headline lighten-2"> Edit App </v-card-title>
        <v-card-text class="mt-6">
          <default-fields @closeModal="showModal = false" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DefaultFields from "@/components/BuilderComponents/DefaultFields";
export default {
  name: "EditAppModal",
  components: {
    DefaultFields,
  },
  data() {
    return {
      showModal: false,
      loading: false,
    };
  },
};
</script>

<style>
</style>
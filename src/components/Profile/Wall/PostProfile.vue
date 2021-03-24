<template>
    <v-row class="d-flex justify-space-between ma-0 pt-3 pb-2 px-5 white width-100 vertical-scroll dont-show-scroll">
      <v-col cols="2 d-flex justify-end pt-0">
        <v-avatar size="70">
          <img
            src="https://cdn.vuetifyjs.com/images/john.jpg"
            alt="John"
          >
        </v-avatar>
      </v-col>
      <v-col cols="10" class="pa-0 align-center">
        <v-row class="d-flex ma-0 align-center rounded-pill grey lighten-3">
          <v-text-field label="What's on your mind, User?" class="py-3 px-8 text-left" hide-details="auto"></v-text-field>
        </v-row>
        <v-row class="d-flex align-center mt-3 mb-1 ml-2">
          <div class="caption text-left mr-3 pa-0 blue--text text--lighten-1">
            <v-icon class="blue--text text--lighten-1">mdi-file-document-outline</v-icon>
            Document
          </div>
          <div class="caption text-left mr-4 pa-0 lime--text text--darken-1">
            <v-icon class="lime--text text--darken-1">mdi-image</v-icon>
            Picture
          </div>          
          <div class="caption text-left pa-0 red--text text--lighten-1">
            <v-icon class="red--text text--lighten-1">mdi-link-variant</v-icon>
            M6Link
          </div>
        </v-row>
      </v-col>
    </v-row>
</template>

<script>
export default {
  data: () => ({
  }),
  name: "PostProfile",
  computed: {
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
</style>
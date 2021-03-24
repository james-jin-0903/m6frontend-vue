<template>
  <v-card>
    <v-card-title class="headline px-6 py-4 white">
      <span class="grey--text text--darken-1">
        {{ title }}
      </span>
    </v-card-title>
    <v-divider class="grey lighten-3" />

    <v-card-text class="vertical-scroll">
      <v-container
        class="rounded-lg"
        fluid
        grid-list-md
      >
        <v-row>
          <template v-for="(fileObj, index) in files">
            <v-col
              v-if="fileObj.inReport && (fileObj.file === 'image/jpeg' || fileObj.file === 'image/png')"
              :key="index"
              md="3"
            >
              <v-img
                v-if="fileObj.url"
                aspect-ratio="1"
                :src="fileObj.url"
              >
                <template v-slot:placeholder>
                  <v-row
                    align="center"
                    class="fill-height ma-0"
                    justify="center"
                  >
                    <v-progress-circular
                      color="blue lighten-2"
                      indeterminate
                    />
                  </v-row>
                </template>

                <v-row
                  class="fill-height lightbox pa-2 white--text"
                  column
                >
                  <v-spacer />
                  <v-col class="shrink">
                    <v-chip
                      v-for="(tag, index) in fileObj.tags"
                      :key="index"
                      color="blue lighten-2"
                      text-color="white"
                    >
                      {{ tag }}
                    </v-chip>
                  </v-col>
                </v-row>
              </v-img>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    files: {
      type: Array,
      default: []
    }
  }
}
</script>

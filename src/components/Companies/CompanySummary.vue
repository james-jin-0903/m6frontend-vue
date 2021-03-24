<template>
  <div class="mx-auto">
    <div class="card-custom-shadow mb-3 pa-4 relative rounded-lg white">
      <div
        v-if="companyData['tagType']"
        :class="tagColor + 'card-content__tag absolute white--text d-flex justify-center align-center text-body-1 font-weight-regular'"
      >
        {{ companyData['type'] }}
      </div>
      <div class="align-center d-flex mb-5">
        <img
          alt=""
          class="mt-2 rounded-circle"
          height="80"
          :src="companyData['record_image_url']"
          width="80"
        >
        <p class="font-weight-regular mb-0 ml-4 mt-1 text-h5">
          {{ companyData['title'] }}
        </p>
      </div>
      <v-row class="d-flex ma-0 pl-10">
        <v-col
          class="pa-0"
          cols="6"
        >
          <div class="align-center d-flex mb-2">
            <v-icon
              class="black--text"
              size="20"
            >
              mdi-email-outline
            </v-icon>
            <p class="body-2 mb-0 ml-2">
              {{ companyData['email'] }}
            </p>
          </div>
          <div class="align-center d-flex mb-2">
            <v-icon
              class="black--text"
              size="20"
            >
              mdi-earth
            </v-icon>
            <p class="body-2 mb-0 ml-2">
              {{ companyData['url'] }}
            </p>
          </div>
        </v-col>
        <v-col
          class="pa-0"
          cols="6"
        >
          <div class="align-center d-flex mb-2">
            <v-icon
              class="black--text"
              size="20"
            >
              mdi-phone
            </v-icon>
            <p class="body-2 mb-0 ml-2">
              {{ companyData['phone'] }}
            </p>
          </div>
        </v-col>
      </v-row>
      <div class="d-flex flex-wrap mt-2">
        <v-chip
          v-for="(tag, index) in companyData['tags']"
          :key="'tagcompany-' + index"
          class="company-chip mr-1 my-1 text-caption"
          color="grey lighten-3"
        >
          {{ tag }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompanySummary',
  props: {
    companyData: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
  }),
  computed: {
    tagColor() {
      return this.companyData['type'] === 'Vendor' ? 'indigo ' : 'teal accent-3 '
    }
  }
}
</script>

<style scoped>
.company-chip {
  height: 25px;
}
</style>

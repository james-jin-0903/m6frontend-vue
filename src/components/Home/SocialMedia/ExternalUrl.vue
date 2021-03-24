<template>
  <v-container class="rounded-lg">
    <div
      v-for="(url, index) of localUrls"
      :key="index + '-exerna-url'"
      class="my-0 px-5 py-0"
    >
      <p
        class="pointer"
        @click="redirect(url['href'])"
      >
        <v-img
          class="d-inline-block rounded"
          height="20"
          :src="url['imageUrl']"
          style="vertical-align: middle;"
          width="20"
        />
        <span
          class="blue--text d-inline-block font-weight-bold ml-2 text-subtitle-1"
          style="vertical-align: middle;"
        >
          {{ url['host'] }}
        </span>
      </p>
      <v-row
        align="center"
        class="mx-2 my-0 pl-5 pointer py-0 text-left"
        no-gutters
        style="borderLeft: thick solid rgb(238 238 238);"
        @click="redirect(url['href'])"
      >
        <v-col
          class="py-4"
          cols="12"
        >
          {{ url['description'] }}
        </v-col>
        <v-col cols="12">
          <v-img
            class="rounded"
            height="100"
            :src="url['imageUrl']"
            width="100"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  name: 'ExternalUrl',
  props: {
    urls: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    localUrls: []
  }),
  mounted() {
    this.urls.forEach(async url => {
      const res = new URL(url)

      res['imageUrl'] = `https://logo.clearbit.com/${res['origin']}`
      res['description'] = await this.getDescription({ url: res['origin'] })

      this.localUrls.push(res)
    })
  },
  methods: {
    ...mapActions('SocialNetworkModule', {
      getDescription: 'get_url_description'
    }),
    redirect(url) {
      window.open(url, '_blank')
    }
  }
}
</script>

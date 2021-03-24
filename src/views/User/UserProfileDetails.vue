<template>
  <div class="grey h-sidepanel lighten-3 vertical-scroll">
    <div class="bottom-0 profile-background relative w-full white">
      <img
        alt="Background Profile"
        class="w-full"
        src="@/assets/default-bg-profile.png"
      >
      <v-btn
        absolute
        class="bottom-0 mb-4 ml-0 pa-6 upload-image-profile"
        elevation="0"
        fab
        left
        light
        small
      >
        <v-icon size="28">
          mdi-camera
        </v-icon>
      </v-btn>
      <div class="absolute align-end bottom-0 d-flex mb-3 mr-3 right-0">
        <p class="connections-label mb-0 mr-3 text-body-2 text-center white--text">
          <span class="font-weight-bold white--text">123</span><br>
          connections
        </p>
        <v-btn
          color="blue lighten-2 white--text capitalize rounded-lg"
          depressed
        >
          Connect
        </v-btn>
      </div>
    </div>
    <div class="grey lighten-3 relative">
      <div class="absolute d-flex left-0 ml-8 mt-3 top-0">
        <img
          alt="Background Profile"
          class="mr-2"
          height="35"
          src="@/assets/social-icons/facebook.png"
          width="35"
        >
        <img
          alt="Background Profile"
          class="mr-2"
          height="35"
          src="@/assets/social-icons/linkedin.png"
          width="35"
        >
        <img
          alt="Background Profile"
          class="mr-2"
          height="35"
          src="@/assets/social-icons/instagram.png"
          width="35"
        >
        <img
          alt="Background Profile"
          class="mr-2"
          height="35"
          src="@/assets/social-icons/twitter.png"
          width="35"
        >
        <img
          alt="Background Profile"
          class="mr-2"
          height="35"
          src="@/assets/social-icons/snapchat.png"
          width="35"
        >
        <img
          alt="Background Profile"
          class="mr-2"
          height="35"
          src="@/assets/social-icons/tiktok.png"
          width="35"
        >
        <img
          alt="Background Profile"
          class="mr-2"
          height="35"
          src="@/assets/social-icons/discord.png"
          width="35"
        >
        <img
          alt="Background Profile"
          class="mr-2"
          height="35"
          src="@/assets/social-icons/youtube.png"
          width="35"
        >
        <img
          alt="Background Profile"
          class="mr-2"
          height="35"
          src="@/assets/social-icons/social-icon.png"
          width="35"
        >
        <img
          alt="Background Profile"
          class="mr-2"
          height="35"
          src="@/assets/social-icons/pinterest.png"
          width="35"
        >
        <img
          alt="Background Profile"
          class="mr-2"
          height="35"
          src="@/assets/social-icons/reddit.png"
          width="35"
        >
      </div>
      <div class="d-flex mx-auto relative top-0 user-image-container">
        <div
          class="absolute"
          style="top: -125px;"
        >
          <div class="relative">
            <img
              alt="Background Profile"
              class="rounded-circle"
              height="250"
              src="https://cdn.vuetifyjs.com/images/lists/2.jpg"
              width="250"
            >
            <v-btn
              absolute
              class="bottom-0 mb-10 ml-0 pa-6 right-0 upload-image-profile"
              elevation="0"
              fab
              light
              small
            >
              <v-icon size="28">
                mdi-camera
              </v-icon>
            </v-btn>
          </div>
          <div style="width: 250px;">
            <p class="font-weight-bold leading-tight max-w-full mb-0 mt-2 mx-auto name-profile text-center text-nowrap w-full">
              Hector Fierro Garcia
            </p>
            <p class="leading-tight mb-0 text-body-2 text-center text-nowrap w-full">
              hector@m6connect.com
            </p>
          </div>
        </div>
      </div>
      <v-row class="align-start d-flex justify-space-between max-w-lg mx-auto pt-1 user-panels w-full">
        <v-col
          class="pa-0 pr-2"
          cols="6"
        >
          <div class="card-custom-shadow mb-4 pb-4 pt-2 px-5 relative rounded-lg w-full white">
            <v-btn
              absolute
              class="mr-1 mt-1 pa-0 right-0 top-0 transparent"
              elevation="0"
              fab
              light
              small
            >
              <v-icon size="25">
                mdi-pencil
              </v-icon>
            </v-btn>
            <p class="font-weight-bold ml-2 mt-3 w-full">
              Bio
            </p>
            <p class="mt-2 px-2 text-body-2 text-center">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
              when an unknown printer took a galley of type and scrambled it to make a type
              specimen book. It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was popularised in the
              1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more
              recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
          </div>
          <div class="card-custom-shadow mb-4 pb-4 pt-2 px-6 relative rounded-lg w-full white">
            <div
              class="absolute mr-5 mt-5 pa-0 pointer right-0 top-0"
            >
              <span class="text-caption">
                See all
              </span>
            </div>
            <p class="font-weight-bold mb-2 mt-3 w-full">
              Portfolio
            </p>
            <v-row class="">
              <v-col
                class="pa-1"
                cols="6"
              >
                <img
                  alt="Background Profile"
                  class="w-full"
                  src="https://i.picsum.photos/id/889/500/500.jpg?hmac=qtHUraNSQm2U9WM8cQhrcnzMDttIWEkf_EoyKd4K3mo"
                >
              </v-col>
              <v-col
                class="pa-1"
                cols="6"
              >
                <img
                  alt="Background Profile"
                  class="w-full"
                  src="https://i.picsum.photos/id/292/500/500.jpg?hmac=AwElRL0wEK7MvAWlpXHr2erUew4UCZsrOreIIcDpMmg"
                >
              </v-col>
              <v-col
                class="pa-1"
                cols="6"
              >
                <img
                  alt="Background Profile"
                  class="w-full"
                  src="https://i.picsum.photos/id/168/500/500.jpg?hmac=Jf1kwyoaDYOUIBE4QzzrQduR_B9jHbQ8WJfGWeEd_DE"
                >
              </v-col>
              <v-col
                class="pa-1"
                cols="6"
              >
                <img
                  alt="Background Profile"
                  class="w-full"
                  src="https://i.picsum.photos/id/786/500/500.jpg?hmac=xxPjvHZK79Jbj0w252QS3zKzVB6Vuyoa3EArdq8CrC8"
                >
              </v-col>
            </v-row>
          </div>
          <div class="card-custom-shadow mb-4 pb-4 pt-2 px-6 relative rounded-lg w-full white">
            <div
              class="absolute mr-5 mt-5 pa-0 pointer right-0 top-0"
            >
              <span class="text-caption">
                See All Connections
              </span>
            </div>
            <p class="font-weight-bold mb-2 mt-3 w-full">
              Connections
            </p>
            <v-row class="">
              <v-col
                class="pa-1"
                cols="6"
              >
                <img
                  alt="Background Profile"
                  class="w-full"
                  src="https://cdn.vuetifyjs.com/images/lists/2.jpg"
                >
                <p class="d-block font-weight-bold leading-tight mb-0 text-body-2">
                  Margaret Hall
                </p>
                <p class="mb-1 text-body-2">
                  XYZ Company
                </p>
              </v-col>
              <v-col
                class="pa-1"
                cols="6"
              >
                <img
                  alt="Background Profile"
                  class="w-full"
                  src="https://cdn.vuetifyjs.com/images/john.png"
                >
                <p class="d-block font-weight-bold leading-tight mb-0 text-body-2">
                  Margaret Hall
                </p>
                <p class="mb-1 text-body-2">
                  XYZ Company
                </p>
              </v-col>
              <v-col
                class="pa-1"
                cols="6"
              >
                <img
                  alt="Background Profile"
                  class="w-full"
                  src="https://cdn.vuetifyjs.com/images/lists/1.jpg"
                >
                <p class="d-block font-weight-bold leading-tight mb-0 text-body-2">
                  Margaret Hall
                </p>
                <p class="mb-1 text-body-2">
                  XYZ Company
                </p>
              </v-col>
              <v-col
                class="pa-1"
                cols="6"
              >
                <img
                  alt="Background Profile"
                  class="w-full"
                  src="https://cdn.vuetifyjs.com/images/lists/5.jpg"
                >
                <p class="d-block font-weight-bold leading-tight mb-0 text-body-2">
                  Margaret Hall
                </p>
                <p class="mb-1 text-body-2">
                  XYZ Company
                </p>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col
          class="pa-0 pl-2"
          cols="6"
        >
          <project-social-media
            class="opacity-social-media px-0"
            post-list-show
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import ProjectSocialMedia from '@/views/Home/ProjectSocialMedia'

import { mapState, mapMutations } from 'vuex'

export default {
  name: 'UserProfileDetails',
  components: {
    ProjectSocialMedia
  },

  computed: {
    ...mapState('AppBuilder', {
      app: 'app'
    })
  },
  methods: {
    ...mapMutations('PageControl', {
      setShowSidePanels: 'setShowSidePanels'
    })
  },
  async mounted() {
    this.setShowSidePanels(false)
    try {
      await this.$store.dispatch('AppBuilder/getApp', this.$route.params.id)
    } catch (e) {
      console.log(e)
    }
  },
  beforeDestroy() {
    this.setShowSidePanels(true)
  }
}
</script>

<style lang="scss" scoped>
.profile-background {
    height: 285px;
    overflow:hidden;
    .connections-label {
        line-height: 1.25;
    }
}
.user-image-container {
    width: 250px;
    .name-profile {
        color: #001F78 !important;
        font-size: 28px !important;
    }
}
.upload-image-profile {
    border: 1px solid #ccc;
}
.user-panels {
    margin-top: 240px;
}
</style>

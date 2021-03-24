<template>
  <div>
    <v-row>
      <v-col
        v-for="(image, index) in images"
        :key="index"
        :sm="4"
      >
        <v-card
          class="transparent"
          style="height: 210px"
          @click="showGallery(index)"
        >
          <img
            alt=""
            class="rounded-lg"
            :src="image.src"
            style="height: 100%; width: 100%"
          >
        </v-card>
      </v-col>
    </v-row>
    <v-overlay
      v-model="gallery"
      class="mt-60"
      color="black"
      opacity="0.65"
    >
      <v-btn
        absolute
        color="white"
        fab
        right
        top
        @click="hideGallery"
      >
        <v-icon color="black">
          mdi-close
        </v-icon>
      </v-btn>
      <v-row class="align-center">
        <v-btn
          class="btn-fix elevation-0 flex-shrink-0 mr-n7"
          :class="themeCommon.content"
          fab
          large
          style="z-index: 3"
          @click="prevImage"
        >
          <v-icon
            :class="themeCommon.text"
            large
          >
            mdi-arrow-left
          </v-icon>
        </v-btn>
        <div class="flex-grow-1">
          <div class="rounded-xl">
            <v-tabs-items
              v-model="currentImage"
              class="darken-4 elevation-7 grey rounded-xl w-full"
            >
              <v-tab-item
                v-for="(image, index) in images"
                :key="index"
                transition="slide-x-reverse-transition"
              >
                <v-card
                  class="relative rounded-xl"
                  dark
                  style="height: 500px; z-index:1"
                >
                  <img
                    alt=""
                    :src="image.src"
                    style="width: 100%; height: 100%; object-fit: cover;"
                  >
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </div>
        <v-btn
          class="elevation-0 flex-shrink-0 ml-n7"
          :class="themeCommon.content"
          fab
          large
          style="z-index: 3"
          @click="nextImage"
        >
          <v-icon
            :class="themeCommon.text"
            large
          >
            mdi-arrow-right
          </v-icon>
        </v-btn>
      </v-row>
    </v-overlay>
  </div>
</template>

<style>
.mt-60 {margin-top: 60px}
.btn-fix::before { opacity: 0 !important; }
</style>

<script>
export default {
    data: () => ({
        gallery: false,
        images: [
            {src: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Irelia_6.jpg',
            mode: 'in-out'},
            {src: 'https://www.wallpapertip.com/wmimgs/55-553806_project-irelia-prestige-edition-skin-splash-art-lol.jpg',
            mode: 'out-in'
            },
            {mode: 'out-in', src: 'https://esports.as.com/2018/05/01/league-of-legends/Beemo-Pulso-Fuego-League-Legends_1131796817_70275_1024x576.jpg'}
        ],
        currentImage: 0,
    }),
    methods: {
        showGallery(image) {
            if (typeof(this.images[image]) != 'undefined') {
                this.currentImage = image
                this.gallery = true
            }
        },
        prevImage() {
            if (this.currentImage === 0){
                this.currentImage = (this.images.length) - 1
                return false
            }
            this.currentImage--
        },
        nextImage() {
            if ((this.currentImage) + 1 === this.images.length){
                this.currentImage = 0
                return false
            }
            this.currentImage++
        },
        hideGallery() {
            this.gallery = false
        }
    }
  }
</script>

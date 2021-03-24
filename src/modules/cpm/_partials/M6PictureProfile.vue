<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    width="300"
  >
    <template v-slot:activator="{ on }">
      <v-col
        class="m6-picture-profile pointer text-center"
        cols="12"
        v-on="on"
      >
        <v-badge :color="statusColor">
          <template v-slot:badge>
            <span />
          </template>

          <div class="avatar-cover">
            <v-avatar
              color="grey lighten-4"
              size="100"
            >
              <v-img
                v-if="url"
                aspect-ratio="1"
                class="grey lighten-2"
                :src="url"
              />

              <v-icon
                v-else
                size="100"
              >
                mdi-image
              </v-icon>
            </v-avatar>
          </div>
        </v-badge>
      </v-col>
    </template>

    <v-card>
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">Change picture</span>
      </v-card-title>
      <v-divider class="grey lighten-3" />
      <v-card-text class="vertical-scroll">
        <input
          ref="inputFile"
          accept=".png, .jpg, .jpeg, .gif, .svg"
          class="d-none"
          type="file"
          @change="fileChange"
        >

        <div class="text-center">
          <img
            v-if="imageB64"
            alt="New image"
            class="max-w-full"
            :src="imageB64"
          >
        </div>

        <p
          class="text-center"
          v-text="fileName"
        />

        <v-btn
          block
          color="primary"
          dark
          @click="$refs.inputFile.click"
        >
          Select file
        </v-btn>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="error"
          :disabled="loading"
          text
          @click="clearAllData; dialog = false"
        >
          Cancel
        </v-btn>

        <v-btn
          color="blue darken-1"
          :disabled="!imageB64"
          :loading="loading"
          text
          @click="accept"
        >
          Accept
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { storage } from '@/main'

export default {
  name: 'M6PictureProfile',

  props: {
    firestoreUrl: {
      type: String,
      default: ''
    },

    imageUrl: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    dialog: false,
    fileName: null,
    imageB64: null,
    loading: false,
    rawFile: null,
    uploaded: false,
    url: ''
  }),

  computed: {
    itemStatus() {
      return this.status ? this.status.toString().toLowerCase() : ''
    },

    statusColor() {
      if (this.itemStatus.includes('pendi')) {
        return '#9CF601'
      }

      if (this.itemStatus.includes('inact')) {
        return '#D7D7D7'
      }

      if (this.itemStatus.includes('activ')) {
        return '#40DD01'
      }

      return 'deep-orange'
    }
  },

  created() {
    this.showImage()
  },

  methods: {
    accept() {
      this.loading = true

      storage
        .ref(this.firestoreUrl)
        .putString(this.imageB64, 'data_url')
        .then(result => {
          this.$emit('image:uploaded', result)

          this.$snotify.success('Image changed successfully', 'Success')

          this.showImage()

          this.clearAllData()
          this.dialog = false
          this.uploaded = true
        })
        .catch(() => {
          this.$snotify.error('Something went wrong', 'Error')
        })
    },

    clearAllData() {
      this.imageB64 = null
      this.fileName = null
      this.loading = false
      this.rawFile = null
    },

    fileChange(event) {
      if (event.target.files[0]) {
        this.uploaded = false
        this.clearAllData()

        this.rawFile = event.target.files[0]
        this.fileName =
          this.rawFile.name || event.target.value.match(/[^\\/]*$/)[0]

        this.proccessFile()
      }
    },

    proccessFile() {
      if (this.isAValidFormat()) {
        const reader = new FileReader()

        reader.onload = ({ target: { result } }) => (this.imageB64 = result)

        reader.readAsDataURL(this.rawFile)
      } else {
        this.clearAllData()

        this.$snotify.error('Invalid file format', 'Error')
      }
    },

    showImage() {
      if (this.imageB64 && this.uploaded) {
        this.url = this.imageB64
      } else {
        storage
          .ref(this.firestoreUrl)
          .getDownloadURL()
          .then(url => (this.url = url))
          .catch(() => (this.url = this.imageUrl))
      }
    },

    isAValidFormat() {
      switch (this.rawFile.type) {
        case 'image/gif':
        case 'image/jpeg':
        case 'image/png':
        case 'image/svg+xml':
          return true

        default:
          return false
      }
    }
  }
}
</script>

<style>
.m6-picture-profile .v-badge .v-badge__badge {
  top: 0 !important;
  right: 0 !important;
}

.m6-picture-profile .avatar-cover::after {
  content: 'Change';
  display: none;
  left: 27%;
  position: absolute;
  top: 38%;
}

.m6-picture-profile .avatar-cover:hover::after {
  display: block;
}
</style>

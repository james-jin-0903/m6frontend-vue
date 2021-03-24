<template>
  <v-container class="mb-2 pa-0 rounded-lg">
    <p class="my-0 py-0 text-body-2 text-center text-h5">
      {{ label }}
    </p>
    <v-col
      v-if="!edit"
      cols="12"
    >
      <v-card class="d-flex flex-column rounded-lg">
        <v-card-title class="my-0 py-0">
          <span
            class="mt-2 pointer text-body-1"
            @click="openFile"
          >
            {{ file['file_name_full'] }}
          </span>
          <v-spacer />
          <v-btn
            class="my-2"
            icon
            @click="edit = !edit"
          >
            <v-icon color="primary">
              mdi-pencil
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text
          v-if="file['file_type'] && file['file_type'].substring(0,5) === 'image'"
          class="pb-2"
        >
          <v-img
            alt="Project Image"
            :src="getURL()"
            width="w-full"
          />
        </v-card-text>
        <v-card-actions class="pt-0 px-4">
          <v-spacer />
          <p class="mb-1">
            {{ getSize() }}
          </p>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col
      v-else
      cols="12"
    >
      <v-row>
        <v-col cols="10">
          <vue-upload-component
            class="drop-file__div"
            :drop="true"
            @input-file="selectFile"
          >
            Drop file here.
            <br>
            <span
              v-if="loadedFileName !== ''"
              class="file-name__span"
            >
              {{ loadedFileName }}
            </span>
          </vue-upload-component>
        </v-col>
        <v-col cols="2">
          <v-icon
            medium
            @click="cancelFile"
          >
            mdi-cancel
          </v-icon>
        </v-col>
      </v-row>
      <v-file-input
        :accept="metadata.attachmentOption === 'image' ? 'image/*' : '*'"
        append-outer-icon="mdi-cancel"
        counter
        dense
        filled
        :label="label"
        outlined
        prepend-icon="mdi-file-document-outline"
        show-size
        truncate-length="20"
        @change="selectFile"
        @click:append-outer="edit = !edit"
      />
    </v-col>
  </v-container>
</template>

<script>
/* eslint-disable camelcase */
import { mapActions, mapMutations } from 'vuex'
import VueUploadComponent from 'vue-upload-component'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'AppAttachment',
  components: {
    VueUploadComponent
  },
  props: {
    value: { type: Object, default: () => {} },
    label: { type: String, default: '' },
    filled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    chips: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    metadata: { type: Object, default: () => {} }
  },
  data: () => ({
    edit: false,
    loadedFileName: ''
  }),
  computed: {
    file: {
      get() {
        return this.value || {}
      },
      set(data) {
        this.$emit('input', data)
      }
    }
  },
  methods: {
    ...mapActions('AppAttachments', {
      setApp: 'post_attachment'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    getURL() {
      return `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/file/url/${this.file.id}`
    },
    getSize() {
      let bytes = this.file['file_size']
      if (bytes >= 1048576) {
        bytes = (bytes / 1048576).toFixed(2) + ' MB'
      } else if (bytes >= 1024) {
        bytes = (bytes / 1024).toFixed(2) + ' KB'
      } else if (bytes > 1) {
        bytes = bytes + ' bytes'
      } else if (bytes === 1) {
        bytes = bytes + ' byte'
      } else {
        bytes = '0 bytes'
      }
      return bytes
    },
    openFile() {
      const path = `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/file/url/${this.file.id}`
      window.open(path, '_blank')
    },
    selectFile(file) {
      if (!file) return
      if (file['name'].match(/\.[0-9a-z]+$/i) && file['size'] < 50000000) {
        if (this.metadata.attachmentOption === 'image' && file.type.split('/')[0] !== 'image') {
          this.notifDanger('You can upload only images')
          return
        }
        const localFile = {
          file_type: file['type'],
          file_extension: file['name'].match(/\.[0-9a-z]+$/i)[0],
          file_name: file['name'].substring(file['name'][0], file['name'].lastIndexOf('.')),
          file_name_full: file['name'],
          file_size: file['size'],
          file: file
        }
        this.file = { ...localFile }
        this.loadedFileName = file['name']

        this.setApp({
          file: file,
          headers: {
            'Content-Type': localFile['file_type'],
            'path': 'record/',
            'Content-Name': localFile['file_name_full']
          }
        }).then(file => {
          this.file['value'] = file['attachId']
          this.file['id'] = file['attachId']
        })
      }
    },
    cancelFile() {
      this.edit = !this.edit
      this.loadedFileName = ''
    }
  }
}
</script>

<style scoped>
.drop-file__div {
  width: 100%;
  height: 50px;
  text-align: center;
  justify-content: center;
  border: 1px solid grey;
  border-radius: 10px;
  border-style: dashed;
  box-shadow: 0 0 5px 5px #eaeaea;
}
.file-name__span {
  font-size: 12px;
  color: #359ff4;
  text-decoration: underline;
}
</style>

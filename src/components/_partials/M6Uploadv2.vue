<template>
  <div>
    <v-btn
      :color="btnButton"
      icon
      :small="small"
      @click="pickFile"
    >
      <slot />
    </v-btn>
    <input
      id="uploadCaptureInputFile"
      ref="obj"
      :accept=" fileMap[acceptedFileType] || '' "
      style="display: none"
      type="file"
      @change="onFilePicked"
    >
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
export default {
  name: 'M6Upload',
  props: {
    btnButton: {
      type: String,
      default: ''
    },
    acceptedFileType: {
      type: String,
      default: ''
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    fileMap: {
      'image': 'image/*'
    }
  }),
  methods: {
    ...mapActions('File', {
      uploadFile: 'uploadFileToS3'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger'
    }),
    pickFile() {
      console.log('hope u broken hearted')
      this.$refs.obj.click()
    },
    async onFilePicked(e) {
      const files = e.target.files

      if (files[0] !== undefined) {
        for (let x = 0; x < files.length; x++) {
          this.$emit('loading')
          if (this.acceptedFileType === this.$h.dg(this.$h.dg(files, `${x}.type`, '').split('/'), '0', '')) {
            let error = ''
            let result = {}
            await this.uploadFile(files[x]).then(data => {
              result = data
            })
              .catch((e, data) => {
                error = e
                if (data) {
                  result = data
                }
              })
            if (error !== '') {
              this.notifDanger(error)
              throw error
            }
            this.$emit('loading')
            if (Object.keys(result).length > 0) {
              this.$emit('response', result)
            }
          } else if (!this.acceptedFileType.length) {
            this.notifDanger('File is too big')
            this.$emit('loading')
          } else {
            this.notifDanger(`The file must be of type: ${this.acceptedFileType}`)
            this.$emit('loading')
          }
        }
      }
    }
  }
}
</script>

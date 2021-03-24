<template>
  <div class="field-container my-4 relative">
    <v-card elevation="0">
      <v-card-title class="px-0">
        {{ field.label }}
      </v-card-title>
      <v-card-text class="px-0 relative">
        <v-tabs>
          <v-tab>Icon</v-tab>
          <v-tab>Settings</v-tab>
          <v-tab-item class="pt-3">
            <v-btn
              absolute
              class="floating-upload-button"
              color="blue"
              icon
              @click="pickFile"
            >
              <v-icon size="25">
                mdi-cloud-upload
              </v-icon>
            </v-btn>
            <v-btn
              absolute
              class="floating-delete-button"
              color="red"
              icon
              @click="showConfirmDelete = true"
            >
              <v-icon size="25">
                mdi-delete
              </v-icon>
            </v-btn>
            <input
              id="uploadCaptureInputFile"
              ref="iconUpload"
              accept="image/*"
              class="d-none"
              type="file"
              @change="onFilePicked"
            >
            <v-img
              v-if="field.metadata.iconUrl"
              contain
              height="64"
              :src="field.metadata.iconUrl"
              width="64"
            />
            <v-icon
              v-else
              color="grey"
              size="64"
            >
              mdi-information-outline
            </v-icon>
            <v-row>
              <v-col class="text-right" />
            </v-row>
          </v-tab-item>
          <v-tab-item>
            Settings
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions class="px-0">
        <v-spacer />
        <v-btn
          class="mt-4"
          color="blue"
          text
          @click="field.showFieldForm = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
    <confirm-delete
      :message="confirmDeleteMessage"
      :show="showConfirmDelete"
      @cancel="showConfirmDelete = false"
      @confirm="deleteIconFile"
    />
  </div>
</template>

<script>
import ConfirmDelete from '@/components/_partials/M6DeleteConfirmation'
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'FieldV2',
  components: {
    ConfirmDelete
  },
  props: {
    field: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    showConfirmDelete: false,
    confirmDeleteMessage: 'Are you sure you want to delete the Icon Image?'
  }),
  mounted() {
    const iconUrl = this.$h.dg(this.field, 'metadata.iconUrl', null)
    if (!iconUrl) {
      this.$set(this.field.metadata, 'iconUrl', null)
    }
  },
  methods: {
    ...mapActions('File', {
      uploadFile: 'uploadFileToS3',
      deleteFileFromS3: 'deleteFileFromS3'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    pickFile() {
      this.$refs.iconUpload.click()
    },
    onFilePicked(e) {
      const file = e.target.files[0]

      if ('image' === this.$h.dg(this.$h.dg(file, 'type', '').split('/'), '0', '')) {
        this.$store.dispatch('showLoading', 'Uploading Image')
        this.uploadFile(file).then(result => {
          if (result.ok) {
            this.field.metadata.iconUrl = result.data.link
            this.$store.dispatch(
              'AppBuilder/updateField',
              this.field
            ).then(() => {
              this.notifSuccess('Field Updated!')
            }).catch(() => {
              this.notifDanger('There was an error while updating the field')
            })
          } else {
            this.notifDanger('There was an error while updating the field')
          }
        }).catch(e => {
          this.notifDanger(e)
        }).finally(() => {
          this.$store.dispatch('hideLoading')
        })
      } else {
        this.notifDanger('The file must be of type: Image')
      }
    },
    deleteIconFile() {
      this.showConfirmDelete = false
      this.$store.dispatch('showLoading', 'Deleting Image')
      // TODO: Delete file from S3
      this.field.metadata.iconUrl = null
      this.$store.dispatch(
        'AppBuilder/updateField',
        this.field
      ).then(() => {
        this.notifSuccess('Icon Image Deleted')
      }).catch(() => {
        this.notifDanger('There was an error while deleting the image')
      }).finally(() => {
        this.$store.dispatch('hideLoading')
      })
    }
  }
}
</script>

<style lang="scss">
.field-container {
  border-top: 1px solid #808080;
  border-bottom: 1px solid #808080;
  .floating-upload-button {
    top: 0;
    left: -5px;
    z-index: 9;
  }
  .floating-delete-button {
    top: 30px;
    left: -5px;
    z-index: 9;
  }
}
</style>

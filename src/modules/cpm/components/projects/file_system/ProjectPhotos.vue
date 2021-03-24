<template>
  <v-row class="white">
    <input
      v-show="false"
      id="files"
      ref="uploadInput"
      accept="image/*"
      :multiple="true"
      name="file"
      type="file"
      @change="detectFiles($event)"
    >
    <v-dialog
      v-model="dialog"
      persistent
      width="300"
    >
      <v-card
        color="blue"
        dark
      >
        <v-card-text class="pt-2">
          {{ $t('general.uploadingFilesMessage') }}
          <v-progress-linear
            class="mb-0"
            color="white"
            indeterminate
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-btn
      v-if="$h.dg(project, 'files')"
      absolute
      class="mt-4"
      color="blue"
      dark
      fab
      right
      small
      top
      @click="selectFile($h.dg(project, 'files.4.children.5'))"
    >
      <v-icon class="mr-1 pb-1">
        mdi-cloud-upload
      </v-icon>
    </v-btn>
    <v-col cols="12">
      <v-card
        color="white"
        elevation="0"
      >
        <v-container
          class="rounded-lg"
          fluid
          grid-list-sm
        >
          <v-row
            v-if="$h.dg(project, 'files', false)"
          >
            <v-col
              v-for="(item, index) in $h
                .dg(project, 'files.4.children.5.children', [])
                .filter(
                  ({ file }) => file === 'image/png' || file === 'image/jpeg'
                )"
              :key="index"
              class="d-flex"
              cols="6"
            >
              <v-card
                class="d-flex"
                elevation="0"
                tile
              >
                <v-img
                  aspect-ratio="1"
                  class="grey lighten-2"
                  :lazy-src="item.url"
                  :src="item.url"
                >
                  <v-row
                    slot="placeholder"
                    align="center"
                    class="fill-height ma-0"
                    justify="center"
                  >
                    <v-progress-circular
                      color="grey lighten-5"
                      indeterminate
                    />
                  </v-row>
                  <v-row
                    v-if="selectedImages.indexOf(item) > -1"
                    class="fill-height lightbox pa-2 white--text"
                    column
                    style="background: rgba(0,0,0,.5)"
                  >
                    <v-spacer />
                    <v-col class="shrink">
                      <v-checkbox
                        v-for="(tag, indexT) in settings.tags"
                        :key="indexT"
                        v-model="item.tags"
                        class="ma-0 pa-0 text--white"
                        color="blue"
                        dark
                        :label="tag"
                        :value="tag"
                        @change="updateTags(tag, item)"
                      />
                      <v-btn
                        color="blue"
                        dark
                        icon
                        small
                        @click="updateImages"
                      >
                        <v-icon small>
                          mdi-check
                        </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row
                    v-else
                    class="fill-height lightbox pa-2 white--text"
                    column
                  >
                    <div class="text-left">
                      <v-btn
                        color="red"
                        dark
                        icon
                        @click="choosingFileToDelete(item)"
                      >
                        <v-icon small>
                          mdi-delete
                        </v-icon>
                      </v-btn>
                      <v-chip
                        v-if="false"
                        :color="item.inReport ? 'green' : 'grey'"
                        text-color="white"
                      >
                        <v-switch
                          v-model="item.inReport"
                          class="pt-2"
                          @change="updateImages"
                        />
                        {{ $t('cpm.projects.inReport') }}
                      </v-chip>
                    </div>
                    <v-spacer />
                    <v-col class="shrink">
                      <v-chip
                        v-for="(tag, indexT) in item.tags"
                        :key="indexT"
                        color="blue lighten-2"
                        text-color="white"
                      >
                        {{ tag }}
                      </v-chip>
                      <v-btn
                        v-if="false"
                        color="blue"
                        dark
                        icon
                        small
                        @click="editTags(item, index)"
                      >
                        <v-icon small>
                          mdi-label
                        </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>

    <m6-confirm-delete
      :message="
        $t('general.sureDeleteResource', {resource: itemToDelete.name})
      "
      :show="showDeleteModal"
      :title="$t('cpm.projects.deleteCPMProject')"
      @cancel="cancelDelete"
      @confirm="deleteFile"
    />

    <destination-modal
      :project="project"
      :show="modalDestination"
      @close="modalDestination=false"
      @onDestinationSelected="closeDestination"
    />
  </v-row>
</template>

<script>
import { db, storage } from '@/utils/Firebase'
import DestinationModal from './DestinationModal'
import EventBus from '@/Eventbus'
import { mapState } from 'vuex'

export default {
  components: {
    'destination-modal': DestinationModal
  },
  data() {
    return {
      selectedImages: [],
      project: {},
      dialog: false,
      modalDestination: false,
      showDeleteModal: false,
      itemToDelete: {},
      destinationFolder: []
    }
  },
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  firestore() {
    return {
      project: db.collection('cpm_projects').doc(this.$route.params.id),
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
    }
  },
  methods: {
    choosingFileToDelete(item) {
      this.itemToDelete = item
      this.showDeleteModal = true
    },
    cancelDelete() {
      this.showDeleteModal = false
      this.itemToDelete = {}
    },
    editTags(item) {
      const index = this.selectedImages.indexOf(item)
      if (index > -1) {
        this.selectedImages.splice(index, 1)
      } else {
        this.selectedImages.push(item)
      }
    },
    updateTags(tag, item) {
      if (!Array.isArray(item.tags)) {
        item.tags = [tag]
      }
    },
    updateImages() {
      db.collection('cpm_projects')
        .doc(this.$route.params.id)
        .update({
          files: this.project.files
        })
    },
    selectFile(item) {
      this.currentItem = item
      this.modalDestination = true
    },
    closeDestination(item) {
      this.modalDestination = false
      this.destinationFolder = item
      this.$refs.uploadInput.click()
    },
    searchDestination(tree, target) {
      if (tree.name === target.name) {
        return tree
      }

      for (const child of tree.children) {
        const res = this.searchDestination(child, target)

        if (res) {
          return res
        }
      }
    },
    async detectFiles(e) {
      const fileList = e.target.files || e.dataTransfer.files
      const duplicates = []
      const filesToFolders = []

      Array.from(Array(fileList.length).keys()).map(x => {
        const file = fileList[x]
        const duplicate = this.currentItem.children.find(
          c => c.name === file.name
        )
        if (duplicate) {
          duplicates.push(duplicate)
        }

        this.destinationFolder.map(item => {
          const filePath = `projects/${this.project.id}${item.path}/${file.name}`

          const duplicateDestination = item.children.find(
            c => c.name === file.name
          )

          if (duplicateDestination) {
            duplicates.push(duplicateDestination)
          }
          filesToFolders.push({ item: item, filePath: filePath, file: file })
        })
      })

      if (duplicates.length) {
        let msg = this.$t('general.fileOverwritten')
        duplicates.map(d => {
          msg += `${d.name}, `
        })

        msg += this.$t('general.youWantContinue')
        const confirmation = confirm(msg)
        if (confirmation) {
          duplicates.map(d => {
            const index = this.currentItem.children.indexOf(d)
            if (index !== -1) this.currentItem.children.splice(index, 1)

            this.destinationFolder.map(item => {
              const index2 = item.children.indexOf(d)
              if (index2 !== -1) item.children.splice(index, 1)
            })
          })
        } else {
          return false
        }
      }

      this.dialog = true
      await Promise.all(
        Array.from(Array(fileList.length).keys()).map(x => {
          const file = fileList[x]
          const filePath = `projects/${this.project.id}${this.currentItem.path}/${file.name}`
          return storage.ref(filePath).put(file)
        })
      ).then(async uploadedFiles => {
        await Promise.all(
          uploadedFiles.map(snapshot => snapshot.ref.getDownloadURL().then(downloadUrl => {
            this.currentItem.children.push({
              name: snapshot.ref.name,
              file: snapshot.metadata.contentType,
              size: snapshot.metadata.size,
              url: downloadUrl,
              path: snapshot.ref.fullPath
            })
          }))
        )
      })
      await Promise.all(
        filesToFolders.map(async x => {
          const upload = await storage.ref(x.filePath).put(x.file)
          const downloadUrl = await upload.ref.getDownloadURL()
          x.item.children.push({
            name: upload.ref.name,
            file: upload.metadata.contentType,
            size: upload.metadata.size,
            url: downloadUrl,
            path: upload.ref.fullPath
          })
          return x
        })
      ).then(() => {
        this.destinationFolder = []
      })

      db.collection('cpm_projects')
        .doc(this.$route.params.id)
        .update({
          files: this.project.files
        })
      this.dialog = false
      EventBus.$emit('project-files-updated')
    },
    deleteFile() {
      const item = this.itemToDelete
      const deletePath = item.path
      let data = null
      this.project.files[4].children.some((file, index, arr) => {
        data = this.searchFiles(file, item.path, arr[index])
        if (data) {
          return true
        }
      })
      const idx = data.parent.children.indexOf(data.item)
      data.parent.children.splice(idx, 1)
      storage
        .ref(deletePath)
        .delete()
        .then(() => {
          db.collection('cpm_projects')
            .doc(this.$route.params.id)
            .update({
              files: this.project.files
            })
          this.$snotify.success(this.$t('general.fileDelete'), 'Success')
          EventBus.$emit('project-files-updated')
          this.cancelDelete()
        })
        .catch(() => {})
    },
    searchFiles(item, path, parent) {
      if (item.children) {
        let tempItem = null
        item.children.some(i => {
          tempItem = this.searchFiles(i, path, item)
          // break loop if item found
          if (tempItem) {
            return true
          }
        })
        return tempItem
      } else {
        if (item.path === path) {
          return {
            item,
            parent
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.selected {
  .label {
    color: #fff;
  }
  .v-input--selection-controls:not(.v-input--hide-details) .v-input__slot {
    margin: 0;
  }
}
</style>

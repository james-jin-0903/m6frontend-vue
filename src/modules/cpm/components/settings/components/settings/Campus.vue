<template>
  <div>
    <input
      v-show="false"
      id="files"
      ref="uploadInput"
      accept="image/*"
      :multiple="false"
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
          Please stand by, uploading image...
          <v-progress-linear
            class="mb-0"
            color="white"
            indeterminate
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-container
      class="mb-4 pa-0 rounded-lg"
      fluid
      grid-list-xs
    >
      <v-row>
        <v-col
          class="list-container"
          cols="12"
        >
          <v-toolbar
            class="mb-4"
            color="grey lighten-3"
            dense
            flat
          >
            <h5>Add or Edit Campus</h5>
            <v-btn
              absolute
              bottom
              color="blue"
              dark
              fab
              right
              small
              @click="newL1"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
          <v-expansion-panel class="elevation-0">
            <v-expansion-panel-content
              v-for="(item, index) in settings.campus"
              :key="index"
            >
              <v-icon
                v-if="item.lvl_1.length"
                slot="actions"
              >
                $vuetify.icons.expand
              </v-icon>
              <v-icon
                v-else
                slot="actions"
                color="white"
              >
                mdi-crop-free
              </v-icon>
              <v-card
                slot="header"
                class="pa-0"
                text
              >
                <v-card-title class="pa-0">
                  <div style="width: 70%">
                    {{ item.abbr ? item.abbr + ' -' : '' }} {{ item.name }}
                  </div>
                  <v-spacer />
                  <v-form on-submit="return false;">
                    <v-btn
                      class="ma-1"
                      icon
                      small
                      @click.prevent.stop="addL1(item)"
                    >
                      <v-icon
                        color="green"
                        dark
                        small
                      >
                        mdi-plus
                      </v-icon>
                    </v-btn>
                    <v-btn
                      class="ma-1"
                      icon
                      small
                      @click.prevent.stop="edit(item)"
                    >
                      <v-icon
                        color="grey"
                        dark
                        small
                      >
                        mdi-pencil
                      </v-icon>
                    </v-btn>
                    <v-btn
                      class="ma-1"
                      icon
                      small
                      @click.prevent.stop="deleteL1(index)"
                    >
                      <v-icon
                        color="grey"
                        dark
                        small
                      >
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </v-form>
                </v-card-title>
              </v-card>
              <v-card
                class="pa-0"
                flat
              >
                <v-card-text class="pa-0 vertical-scroll">
                  <v-expansion-panel class="elevation-0">
                    <v-expansion-panel-content
                      v-for="(itemL2, indexL2) in item.lvl_1"
                      :key="indexL2"
                    >
                      <v-icon
                        v-if="itemL2.lvl_2.length"
                        slot="actions"
                      >
                        $vuetify.icons.expand
                      </v-icon>
                      <v-icon
                        v-else
                        slot="actions"
                        color="white"
                      >
                        mdi-crop-free
                      </v-icon>
                      <v-card
                        slot="header"
                        class="pa-0 pl-4"
                        flat
                      >
                        <v-card-title class="pa-0">
                          <div style="width: 70%">
                            {{ itemL2.abbr ? itemL2.abbr + ' -' : '' }}
                            {{ itemL2.name }}
                          </div>
                          <v-spacer />
                          <v-form on-submit="return false;">
                            <v-btn
                              class="ma-1"
                              icon
                              small
                              @click.prevent.stop="addL2(itemL2)"
                            >
                              <v-icon
                                color="green"
                                dark
                                small
                              >
                                mdi-plus
                              </v-icon>
                            </v-btn>
                            <v-btn
                              class="ma-1"
                              icon
                              small
                              @click.prevent.stop="edit(itemL2)"
                            >
                              <v-icon
                                color="grey"
                                dark
                                small
                              >
                                mdi-pencil
                              </v-icon>
                            </v-btn>
                            <v-btn
                              class="ma-1"
                              icon
                              small
                              @click.prevent.stop="deleteL2(item, indexL2)"
                            >
                              <v-icon
                                color="grey"
                                dark
                                small
                              >
                                mdi-delete
                              </v-icon>
                            </v-btn>
                          </v-form>
                        </v-card-title>
                      </v-card>
                      <v-card
                        class="pa-0 pl-4"
                        flat
                      >
                        <v-card-text class="pa-0 pl-4 vertical-scroll">
                          <v-card
                            v-for="(itemL3, indexL3) in itemL2.lvl_2"
                            :key="indexL3"
                            class="pa-0 pl-4 pr-5"
                            flat
                          >
                            <v-card-title class="pa-0">
                              <div style="width: 70%">
                                {{ itemL3.abbr ? itemL3.abbr + ' -' : '' }}
                                {{ itemL3.name }}
                              </div>
                              <v-spacer />
                              <v-form on-submit="return false;">
                                <v-btn
                                  class="ma-1"
                                  icon
                                  small
                                  @click.prevent.stop="edit(itemL3)"
                                >
                                  <v-icon
                                    color="grey"
                                    dark
                                    small
                                  >
                                    mdi-pencil
                                  </v-icon>
                                </v-btn>
                                <v-btn
                                  class="ma-1"
                                  icon
                                  small
                                  @click.prevent.stop="
                                    deleteL3(itemL2, indexL3)
                                  "
                                >
                                  <v-icon
                                    color="grey"
                                    dark
                                    small
                                  >
                                    mdi-delete
                                  </v-icon>
                                </v-btn>
                              </v-form>
                            </v-card-title>
                          </v-card>
                        </v-card-text>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <div
            v-show="showForm"
            class="list-overlay-cover"
          />
        </v-col>
        <v-col
          v-show="showForm"
          cols="12"
        >
          <v-container
            class="rounded-lg"
            fluid
          >
            <v-form on-submit="return false;">
              <v-row>
                <v-col md="12">
                  <v-toolbar
                    id="campus-form"
                    class="mb-4"
                    color="grey lighten-3"
                    dense
                    flat
                  >
                    <h5>{{ formTitle }}</h5>
                  </v-toolbar>
                </v-col>

                <v-col md="12">
                  <v-text-field
                    v-model="name"
                    color="blue"
                    label="Campus Name"
                  />
                </v-col>

                <v-col md="12">
                  <v-text-field
                    v-model="abbr"
                    color="blue"
                    label="Abbreviation"
                  />
                </v-col>

                <v-col md="12">
                  <div
                    class="theme--light v-input v-input--is-dirty v-input--is-label-active v-text-field"
                  >
                    <div class="v-input__control">
                      <div class="v-input__slot">
                        <div class="v-text-field__slot">
                          <label
                            aria-hidden="true"
                            class="theme--light v-label v-label--active"
                            style="left: 0px; right: auto; position: absolute;"
                          >
                            Address
                          </label>

                          <google-autocomplete
                            class="input"
                            placeholder="Address"
                            :select-first-on-enter="true"
                            :value="address"
                            @place_changed="setPlace"
                          />
                        </div>
                      </div>
                      <div class="v-text-field__details">
                        <div class="theme--light v-messages">
                          <div class="v-messages__wrapper" />
                        </div>
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col md="12">
                  <v-text-field
                    v-model="entityName"
                    color="blue"
                    label="Entity Name"
                  />
                </v-col>
              </v-row>

              <v-row
                v-if="logo.url != ''"
              >
                <v-col md="6">
                  <v-img
                    aspect-ratio="1"
                    contain
                    height="200px"
                    :src="logo.url != '' ? logo.url : ''"
                    width="200px"
                  />
                </v-col>

                <v-col
                  md="6"
                  style="align-self: center;"
                >
                  <v-btn
                    color="red"
                    dark
                    @click="deleteFile"
                  >
                    Delete logo
                    <v-icon small>
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>

              <v-row
                v-if="logo.url == ''"
              >
                <v-col md="12">
                  <v-btn
                    color="blue"
                    dark
                    @click="selectFile"
                  >
                    Logo&nbsp;
                    <v-icon class="mr-1 pb-1">
                      mdi-cloud-upload
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>
                <v-spacer />
                <v-col
                  md="3"
                  sm="3"
                  style="text-align: right;"
                >
                  <v-btn
                    :disabled="loading"
                    @click="cancel"
                  >
                    Cancel
                  </v-btn>
                </v-col>
                <v-col
                  md="3"
                  sm="3"
                  style="text-align: right;"
                >
                  <v-btn
                    color="blue"
                    dark
                    :disabled="loading"
                    :loading="loading"
                    type="submit"
                    @click="save"
                  >
                    Save
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { db, storage } from '@/utils/Firebase.js'
import { mapState } from 'vuex'
// import * as easings from 'vuetify/es5/util/easing-patterns'

export default {
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  data() {
    return {
      settings: {},
      loading: false,
      name: '',
      abbr: '',
      action: '',
      level: 0,
      currentItem: {},
      currentIndex: -1,
      showForm: false,
      formTitle: '',
      options: {
        duration: 300,
        offset: 0,
        easing: 'easeInOutCubic'
      },
      // easings: Object.keys(easings),
      latitude: '',
      longitude: '',
      address: '',
      entityName: '',
      dialog: false,
      logo: {
        name: '',
        file: '',
        size: '',
        url: '',
        path: ''
      }
    }
  },
  mounted() {
    db.collection('settings')
      .doc(this.currentComp)
      .collection('settings')
      .doc('projects')
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('projects')
            .set({
              campus: []
            })
        }
      })
  },
  methods: {
    selectFile() {
      this.$refs.uploadInput.click()
    },
    deleteFile() {
      const confirmation = confirm(
        'Are you sure you want to delete this Logo Image'
      )
      if (confirmation) {
        const deletePath = this.logo.path
        storage
          .ref(deletePath)
          .delete()
          .then(() => {
            this.logo = {
              name: '',
              file: '',
              size: '',
              url: '',
              path: ''
            }
            this.$snotify.error('The logo image has been deleted', 'Success')
          })
          .catch(error => {
            console.error('file delete error occured:', error)
          })
      }
    },
    async detectFiles(e) {
      const fileList = e.target.files || e.dataTransfer.files

      this.dialog = true
      await Promise.all(
        Array.from(Array(fileList.length).keys()).map(x => {
          const file = fileList[x]
          const filePath = `project/${this.currentCompany.id}/campus-logo/${file.name}`
          return storage.ref(filePath).put(file)
        })
      ).then(async uploadedFiles => {
        await Promise.all(
          uploadedFiles.map(snapshot => snapshot.ref.getDownloadURL().then(downloadUrl => {
            this.logo = {
              name: snapshot.ref.name,
              file: snapshot.metadata.contentType,
              size: snapshot.metadata.size,
              url: downloadUrl,
              path: snapshot.ref.fullPath
            }
          }))
        )
      })
      this.dialog = false
    },
    newL1() {
      this.action = 'new'
      this.level = 1
      this.showForm = true
      this.formTitle = 'Create a new Campus'
    },
    addL1(item) {
      this.action = 'add'
      this.level = 1
      this.currentItem = item
      this.showForm = true
      this.$vuetify.goTo(300, this.options)
      this.formTitle = `Adding a Sub Location for Campus: ${item.name}`
    },
    addL2(item) {
      this.action = 'add'
      this.level = 2
      this.currentItem = item
      this.showForm = true
      this.$vuetify.goTo(300, this.options)
      this.formTitle = `Adding a Third Level Location for Sub Location: ${item.name}`
    },
    edit(item) {
      this.action = 'edit'
      this.currentItem = item
      this.name = item.name
      this.abbr = item.abbr
      this.entityName = item.entityName
      this.showForm = true
      this.$vuetify.goTo(300, this.options)
      this.formTitle = `Editing Campus: ${item.name}`

      this.$nextTick(() => {
        this.address = item.address ? item.address : ''
        this.logo = item.logo
          ? item.logo
          : {
            name: '',
            file: '',
            size: '',
            url: '',
            path: ''
          }
      })
    },
    deleteL1(index) {
      const confirmation = confirm('Are you sure you want to delete this Campus')
      if (confirmation) {
        this.settings.campus.splice(index, 1)
        this.updateData('Campus Deleted')
      }
    },
    deleteL2(parentItem, childIndex) {
      const confirmation = confirm('Are you sure you want to delete this Campus')
      if (confirmation) {
        parentItem.lvl_1.splice(childIndex, 1)
        this.updateData('Campus Deleted')
      }
    },
    deleteL3(parentItem, childIndex) {
      const confirmation = confirm('Are you sure you want to delete this Campus')
      if (confirmation) {
        parentItem.lvl_2.splice(childIndex, 1)
        this.updateData('Campus Deleted')
      }
    },
    generateId() {
      return Math.floor(Math.random() + new Date().getTime())
    },
    save() {
      this.loading = true
      if (this.name === '') {
        this.$snotify.error('Campus Name is Required', 'Error')
        this.cancel()
        return
      }
      if (!this.abbr) {
        this.abbr = ''
      }
      if (this.action === 'new') {
        if (!this.settings.campus) {
          this.settings.campus = []
        }
        this.settings.campus.push({
          name: this.name,
          abbr: this.abbr,
          latitude: this.latitude,
          longitude: this.longitude,
          address: this.address,
          entityName: this.entityName,
          logo: this.logo,
          id: this.generateId(),
          lvl_1: []
        })
        this.updateData('Campus Saved')
      } else if (this.action === 'add') {
        if (this.level === 1) {
          this.currentItem.lvl_1.push({
            name: this.name,
            abbr: this.abbr,
            lvl_2: [],
            latitude: this.latitude,
            longitude: this.longitude,
            address: this.address,
            entityName: this.entityName,
            logo: this.logo,
            id: this.generateId()
          })
        } else if (this.level === 2) {
          this.currentItem.lvl_2.push({
            name: this.name,
            abbr: this.abbr,
            latitude: this.latitude,
            longitude: this.longitude,
            address: this.address,
            entityName: this.entityName,
            logo: this.logo,
            id: this.generateId()
          })
        }
        this.updateData('Campus Updated')
      } else if (this.action === 'edit') {
        this.currentItem.name = this.name
        this.currentItem.abbr = this.abbr
        this.currentItem.latitude = this.latitude
        this.currentItem.longitude = this.longitude
        ;
        (this.currentItem.address = this.address),
        (this.currentItem.entityName = this.entityName),
        (this.currentItem.logo = this.logo),
        this.updateData('Campus Updated')
      }
    },
    updateData(msg) {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
        .update({
          campus: this.settings.campus
        })
        .then(() => {
          this.$snotify.success(msg, 'Success')
          this.cancel()
        })
    },
    cancel() {
      this.loading = false
      this.name = ''
      this.abbr = ''
      this.entityName = ''
      this.address = ''
      this.action = ''
      this.level = 0
      this.currentItem = {}
      this.currentIndex = -1
      this.showForm = false
    },
    setPlace(place) {
      if (!place) return

      this.latitude = place.geometry.location.lat()
      this.longitude = place.geometry.location.lng()
      this.address = place.formatted_address.replace(/,[^,]+$/, '')
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
    }
  }
}
</script>

<style lang="scss">
.list-container {
  position: relative;
}

.list-overlay-cover {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.8);
}
</style>

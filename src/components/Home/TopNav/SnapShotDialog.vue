<template>
  <v-dialog
    v-model="showDialog"
    fullscreen
    persistent
  >
    <v-card>
      <v-card-title class="blue dakren-2 white--text">
        <h1 class="white--text">
          Snapshot
        </h1>

        <v-spacer />

        <v-btn
          color="white"
          icon
          @click="addNotes"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="card-text">
        <v-container
          class="grey lighten-5 p-4 rounded-lg"
          fluid
        >
          <v-row>
            <v-col sm="9">
              <div>
                <v-stage
                  id="stage-layer"
                  ref="stage"
                  :config="configKonva"
                  :style="`background-image: url(&quot;${ imageTest }&quot;); background-size: 100% auto`"
                  @dragend="handleDragend"
                  @dragstart="handleDragstart"
                >
                  <v-layer ref="layer">
                    <v-circle
                      v-for="item in rapidItem.items"
                      :key="item.id"
                      :config=" {
                        x: item.rapid_x,
                        y: item.rapid_y,
                        id: item.id,
                        draggable: true,
                        width: 20,
                        height: 20,
                        fill: ratings.find( r => r.level == item.rapid_color_rating).color || '#37474F', // blue-grey darken-3
                        shadowBlur: 25,
                        opacity: 0.9
                      }"
                    />
                  </v-layer>
                </v-stage>
              </div>
            </v-col>
            <v-col
              class="sidebar-custom"
              sm="3"
            >
              <v-expansion-panels
                v-model="panelModel"
                accordion
              >
                <v-expansion-panel
                  v-for="(n, i) in rapidItem.items"
                  :key="`notes-${n.id}-${i}`"
                >
                  <v-expansion-panel-header color="grey lighten-4">
                    {{ i + 1 }}: RAP-{{ i + 1 }}-{{ new Date().getFullYear() }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div class="inline mt-2">
                      <div>
                        <speed-dial @expanding="colorPickerBool">
                          <template v-slot:activatorBtn>
                            <v-avatar
                              :color="ratings.find( r => r.level == n.rapid_color_rating).color"
                              size="28"
                            >
                              <span class="subtitle-2 white--text">{{ generatePriorityScore(n) }}</span>
                            </v-avatar>
                          </template>
                          <template v-slot:options>
                            <v-tooltip
                              v-for="(r, i) in ratings"
                              :key="`rating-${i}`"
                              color="grey darken-1"
                              right
                            >
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  :color="r.color"
                                  dark
                                  fab
                                  small
                                  v-on="on"
                                  @click="n.rapid_color_rating = r.level"
                                />
                              </template>
                              <span class="pa-2 white--text">{{ r.text }}</span>
                            </v-tooltip>
                          </template>
                        </speed-dial>

                        <speed-dial v-if="colorPickerSwitchShow">
                          <template v-slot:activatorBtn>
                            <span
                              style="font-size: 1.5rem;"
                              v-html="userReactions.find( u => u.level == n.rapid_reaction).emoji"
                            />
                          </template>
                          <template v-slot:options>
                            <v-tooltip
                              v-for="(u, i) in userReactions"
                              :key="`user-reaction-${i}`"
                              color="grey darken-1"
                              right
                            >
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  fab
                                  x-small
                                  v-on="on"
                                  @click="n.rapid_reaction = u.level"
                                >
                                  <span
                                    class="emoji-font-size"
                                    v-html="u.emoji"
                                  />
                                </v-btn>
                              </template>
                              <span class="pa-1 white--text">{{ u.text }}</span>
                            </v-tooltip>
                          </template>
                        </speed-dial>
                      </div>
                      <v-text-field
                        v-model="rapidItem.items[i].rapid_title"
                        label="Title"
                        outlined
                      />
                      <v-btn
                        v-show="rapidItem.items.length > 1"
                        color="red darken-2"
                        icon
                        @click="removeNote(n)"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <v-textarea
                      v-model="rapidItem.items[i].rapid_description"
                      label="Description"
                      outlined
                    />

                    <people-autocomplete
                      v-model="rapidItem.items[i].rapid_maestro"
                      label="Pick Your Maestro"
                    />

                    <people-autocomplete
                      v-model="rapidItem.items[i].rapid_developer"
                      label="Pick a Developer"
                    />

                    <date-picker
                      v-model="rapidItem.items[i].rapid_due_date"
                      label="Due Date"
                    />

                    <v-autocomplete
                      v-model="rapidItem.items[i].rapid_status"
                      :items="statusItems"
                      label="Status"
                    />

                    <v-autocomplete
                      v-model="rapidItem.items[i].rapid_code_type"
                      :items="codeTypes"
                      label="Type"
                    />

                    <attachment v-model="rapidItem.items[i].rapid_attachment" />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>

        <m6-loading :loading="loading" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="red"
          text
          @click="closing"
        >
          close
        </v-btn>


        <v-btn
          class="white--text"
          color="green darken-2"
          @click="saving"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import { mapState, mapActions, mapMutations } from 'vuex'
import SpeedDial from '@/components/_partials/SpeedDial.vue'
import PeopleAutocomplete from '@/components/AppBuilder/Form/Components/PeopleAutocomplete.vue'
import DatePicker from '@/components/AppBuilder/Form/Components/DatePicker.vue'
import axios from 'axios'
import Attachment from '@/components/AppBuilder/Form/Components/Attachment.vue'

const width = window.innerWidth * .7
const height = window.innerHeight * .7

const noteModel = {
  rapid_title: '',
  rapid_description: '',
  rapid_x: Math.floor(width / 2),
  rapid_y: Math.floor(height / 2),
  rotation: 180,
  selected: false,
  rapid_color_rating: 1,
  rapid_reaction: 1,
  rapid_url: '',
  rapid_status: 'Pending'
}

const rapidItemDefault = { items: [], imgLink: '' }

export default {
  name: 'SnapShotDialog',
  components: {
    SpeedDial,
    PeopleAutocomplete,
    DatePicker,
    Attachment
  },

  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    imageTest: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    defaultNote: noteModel,
    rapidItem: { ...rapidItemDefault },
    rapidItemDefault: rapidItemDefault,
    notes: [],
    dragItemId: null,
    configKonva: {
      width: width,
      height: height
    },
    loading: false,
    colorPickerSwitchShow: true,
    ratingChosen: {},
    panelModel: null,
    statusItems: [
      'Backlog',
      'Documentation',
      'ToDo',
      'In Progress',
      'Rework',
      'Pull Request',
      'Review',
      'UAT',
      'Done'
    ],
    codeTypes: ['Frontend', 'Backend']
  }),

  methods: {
    ...mapActions('RapidTicket', {
      createRapidTickets: 'createRapidTickets'
    }),

    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),

    colorPickerBool(bool) {
      this.colorPickerSwitchShow = !bool
    },

    prepareUpload(obj, name) {
      return new Promise(async (resolve, reject) => {
        try {
          const fileTypePartial = obj.type.split('/')[0]
          const data = {
            folder: fileTypePartial,
            fileType: obj.type,
            fileName: `${name}.${fileTypePartial}`
          }

          const response = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/file/upload`, data)
          const url = response.data.url

          let objectUploaded = null

          objectUploaded = await this.uploadingFile(url, obj)

          await this.processFetch(objectUploaded, false)

          const objUrl = this.getUrlForObj(url)

          resolve(objUrl)
        } catch (e) {
          reject(e)
        }
      })
    },

    processFetch(responseFetch, returnJson = true) {
      return new Promise((resolve, reject) => {
        if (responseFetch.ok && returnJson) {
          responseFetch.json().then(res => {
            resolve(res)
          })
        } else if (responseFetch.ok) {
          resolve()
        } else {
          responseFetch.json().then(err => {
            reject(err)
          })
        }
      })
    },

    getUrlForObj(url) {
      return url.split('?')[0]
    },

    uploadingFile(url, obj) {
      return new Promise((resolve, reject) => {
        const newHeaders = new Headers()
        newHeaders.append('x-amz-acl', 'public-read')
        newHeaders.append('Content-Type', obj.type)
        fetch(url, {
          method: 'PUT',
          mode: 'cors',
          body: obj,
          headers: newHeaders
        })
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },

    async saving() {
      this.loading = true

      try {
        const { data, contentType } = this.processingB64(this.imageTest)

        const obj = this.b64toBlob(data, contentType)

        const imageLink = await this.prepareUpload(obj, 'rapid_snapshot')

        const rapidItems = this.rapidItem.items.map(
          i => ({
            ...i,
            rapid_user: this.currentUser.id,
            rapid_snapshot: imageLink,
            rapid_priority: (i.rapid_color_rating + i.rapid_reaction) / 2,
            rapid_company: this.currentCompany.id
          })
        )


        const res = await this.createRapidTickets(rapidItems)
        this.notifSuccess('The Rapid Tickets were created')
        this.loading = false
        this.closing()
      } catch (e) {
        this.notifDanger('There was an error while creating the ticket')
        this.loading = false
      }
    },

    closing() {
      this.rapidItem = this.rapidItemDefault
      this.$emit('closing')
    },

    removeNote(n) {
      this.rapidItem.items = this.rapidItem.items.filter(note => note.id !== n.id)
    },

    addNotes() {
      const id = Math.floor(+new Date + (Math.random() * 1000))
      const coords = this.getRandCoordinates()
      const note = {
        id,
        ...this.defaultNote,
        ...coords,
        rapid_url: window.location.href
      }
      this.rapidItem.items.push(note)
    },

    handleDragstart(e) {
      // save drag element:
      this.dragItemId = e.target.id()
      this.rapidItem.items = this.rapidItem.items.map(n => ({
        ...n,
        selected: false
      }))

      this.panelModel = this.rapidItem.items.map(i => i.id).indexOf(this.dragItemId)
    },

    handleDragend(e) {
      this.rapidItem.items = this.rapidItem.items.map(n => ({
        ...n,
        selected: false
      }))
      const item = this.rapidItem.items.find(i => i.id === this.dragItemId)

      item.rapid_x = e.target.attrs.x
      item.rapid_y = e.target.attrs.y
      item.selected = true

      this.notes = this.rapidItem.items.map(n => n.id !== item.id ? n : item)
    },

    getRandCoordinates() {
      return {
        rapid_x: Math.floor(Math.random() * (width / 2.3 - width / 3) + width / 3),
        rapid_y: Math.floor(Math.random() * (width / 2.3 - width / 3) + width / 3)
      }
    },

    processingB64(ImageURL) {
      const block = ImageURL.split(';')
      // Get the content type of the image
      const contentType = block[0].split(':')[1]// In this case "image/gif"
      // get the real base64 content of the file
      const realData = block[1].split(',')[1]// In this case "R0lGODlhPQBEAPeoAJosM...."

      return { data: realData, contentType }
    },

    b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || ''
      sliceSize = sliceSize || 512

      const byteCharacters = atob(b64Data)
      const byteArrays = []

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)

        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)

        byteArrays.push(byteArray)
      }

      const blob = new Blob(byteArrays, { type: contentType })
      return blob
    },

    generatePriorityScore(item) {
      return (
        this.$h.dg(item, 'rapid_reaction', 0) + this.$h.dg(item, 'rapid_color_rating', 0)
      ) / 2
    }

  },

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    ...mapState('Auth', {
      currentUser: 'user'
    }),
    ...mapState('RapidTicket', {
      userReactions: 'emojis',
      ratings: 'ratings'
    })
  },

  mounted() {
    this.addNotes()
  }

}
</script>

<style lang="scss" scoped>
.card-text {
  overflow:auto;
}
.img-custom {
  width: 50rem;
  height: auto;
}
.sidebar-custom {
  height: 70vh;
  overflow: auto;
}
.inline {
  display: flex;
  display: -ms-flexbox;
  display: -webkit-flex;
  justify-content: space-between;
}
.emoji-font-size{
  font-size:30px;
}

</style>

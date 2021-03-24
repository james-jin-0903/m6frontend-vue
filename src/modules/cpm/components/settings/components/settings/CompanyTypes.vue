<template>
  <v-container
    class="pa-0 rounded-lg"
    fluid
    grid-list-xs
  >
    <v-row>
      <v-col
        v-if="!showForm"
        class="list-container"
        cols="12"
      >
        <v-toolbar
          class="mb-4"
          color="grey lighten-3"
          dense
          flat
        >
          <h5>Add or Edit Company Types</h5>
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
          <draggable
            v-model="settings.company_types"
            class="draggable-container"
            :options="{ group: 'company_types' }"
            @end="drag = false"
            @start="drag = true"
            @update="saveOrder"
          >
            <v-expansion-panel-content
              v-for="(item, index) in settings.company_types"
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
                flat
              >
                <v-card-title class="pa-0">
                  <div style="width: 60%">
                    {{ item.name }}
                  </div>
                  <v-spacer />
                  <v-btn
                    class="ma-1"
                    icon
                    small
                    @click.stop="addL1(item)"
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
                    @click.stop="edit(item)"
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
                    @click.stop="deleteL1(index)"
                  >
                    <v-icon
                      color="grey"
                      dark
                      small
                    >
                      mdi-delete
                    </v-icon>
                  </v-btn>
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
                          <div style="width: 60%">
                            {{ itemL2.name }}
                          </div>
                          <v-spacer />
                          <v-btn
                            class="ma-1"
                            icon
                            small
                            @click.stop="addL2(itemL2)"
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
                            @click.stop="edit(itemL2)"
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
                            @click.stop="deleteL2(item, indexL2)"
                          >
                            <v-icon
                              color="grey"
                              dark
                              small
                            >
                              mdi-delete
                            </v-icon>
                          </v-btn>
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
                              <div style="width: 60%">
                                {{ itemL3.name }}
                              </div>
                              <v-spacer />
                              <v-btn
                                class="ma-1"
                                icon
                                small
                                @click.stop="edit(itemL3)"
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
                                @click.stop="deleteL3(itemL2, indexL3)"
                              >
                                <v-icon
                                  color="grey"
                                  dark
                                  small
                                >
                                  mdi-delete
                                </v-icon>
                              </v-btn>
                            </v-card-title>
                          </v-card>
                        </v-card-text>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </draggable>
        </v-expansion-panel>
      </v-col>
      <v-col
        v-show="showForm"
        cols="12"
      >
        <v-form>
          <v-toolbar
            id="company-types-form"
            class="mb-4"
            color="grey lighten-3"
            dense
            flat
          >
            <h5>{{ formTitle }}</h5>
          </v-toolbar>

          <v-text-field
            v-model="name"
            color="blue"
            label="Company Type"
          />

          <v-btn
            :disabled="loading"
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue"
            dark
            :loading="loading"
            @click="save"
          >
            Save
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState, mapGetters } from 'vuex'
import axios from 'axios'
// import * as easings from 'vuetify/es5/util/easing-patterns'
import draggable from 'vuedraggable'

export default {
  data() {
    return {
      settings: {},
      loading: false,
      name: '',
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
      }
      // easings: Object.keys(easings),
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('company_types')
    }
  },
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  mounted() {
    this.CompanyTypes
      .get()
      .then(settings => {
        if (!settings.exists) {
          this.CompanyTypes
            .set({
              company_types: []
            })
        }
      })
  },
  methods: {
    newL1() {
      this.action = 'new'
      this.level = 1
      this.showForm = true
      this.formTitle = 'Create a new Company Type'
    },
    addL1(item) {
      this.action = 'add'
      this.level = 1
      this.currentItem = item
      this.showForm = true
      this.formTitle = `Adding a Sub Type for Company Type: ${item.name}`
    },
    addL2(item) {
      this.action = 'add'
      this.level = 2
      this.currentItem = item
      this.showForm = true
      this.formTitle = `Adding a Third Level Type for Sub Type: ${item.name}`
    },
    edit(item) {
      this.action = 'edit'
      this.currentItem = item
      this.name = item.name
      this.showForm = true
      this.formTitle = `Editing Type: ${item.name}`
    },
    deleteL1(index) {
      const confirmation = confirm('Are you sure you want to delete this Company Type')
      if (confirmation) {
        this.settings.company_types.splice(index, 1)
        this.$nextTick(() => {
          this.updateData('Company Type Deleted').then(() => {
            this.cancel()
          })
        })
      }
    },
    deleteL2(parentItem, childIndex) {
      const confirmation = confirm('Are you sure you want to delete this Company Type')
      if (confirmation) {
        parentItem.lvl_1.splice(childIndex, 1)
        this.$nextTick(() => {
          this.updateData('Company Type Deleted').then(() => {
            this.cancel()
          })
        })
      }
    },
    deleteL3(parentItem, childIndex) {
      const confirmation = confirm('Are you sure you want to delete this Company Type')
      if (confirmation) {
        parentItem.lvl_2.splice(childIndex, 1)
        this.$nextTick(() => {
          this.updateData('Company Type Deleted').then(() => {
            this.cancel()
          })
        })
      }
    },
    save() {
      this.loading = true
      if (this.name === '') {
        this.$snotify.error('Company Type is required', 'Error')
        this.cancel(false)
        return
      }
      if (this.action === 'new') {
        if (!this.$h.dg(this.settings, 'company_types')) {
          this.settings.company_types = []
        }
        this.settings.company_types.push({
          name: this.name,
          lvl_1: []
        })
        this.updateData('Company Type Saved').then(() => {
          this.cancel()
        })
      } else if (this.action === 'add') {
        if (this.level === 1) {
          this.currentItem.lvl_1.push({
            name: this.name,
            lvl_2: []
          })
        } else if (this.level === 2) {
          this.currentItem.lvl_2.push({
            name: this.name
          })
        }
        this.updateData('Company Type Updated').then(() => {
          this.cancel()
        })
      } else if (this.action === 'edit') {
        this.currentItem.name = this.name
        this.updateData('Company Type Updated').then(() => {
          this.cancel()
        })
      }
    },
    updateData(msg) {
      const promise = new Promise((resolve, reject) => {
        try {
          this.CompanyTypes
            .update({
              company_types: this.settings.company_types
            })
            .then(() => {
              this.$snotify.success(msg, 'Success')
              resolve(true)
            })
        } catch (error) {
          reject(error)
        }
      })
      return promise
    },
    cancel(hide = true) {
      this.loading = false
      this.name = ''
      this.action = ''
      this.level = 0
      this.currentItem = {}
      this.currentIndex = -1
      if (hide) {
        this.showForm = false
      }
    },
    saveOrder() {
      try {
        this.CompanyTypes
          .update({
            company_types: this.settings.company_types
          })
          .then(() => {})
      } catch (error) {
        console.error(error)
      }
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
    background: rgba(255,255,255,.8);
  }
</style>


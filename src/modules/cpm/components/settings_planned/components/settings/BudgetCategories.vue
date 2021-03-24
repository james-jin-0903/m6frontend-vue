<template>
  <component-template>
    <template slot="button">
      <v-btn
        v-if="!included"
        color="primary"
        dark
        fab
        small
        @click="newL1"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-container class="rounded-lg">
      <v-data-table
        v-if="settings"
        :headers="headers"
        :items="settings.costCodes"
        :items-per-page-options="[5,10,15,200]"
      >
        <template v-slot:items="props">
          <td>
            {{ props.item.code ? props.item.code + ' -' : '' }}
            {{ props.item.name }}
          </td>
          <td class="text-right">
            <v-icon
              v-if="props.item.cat_1.length > 0"
              class="ml-4 mr-0 pointer"
              color="#757575"
              size="20"
              @click.stop="showSubCategoriesL2(props.item)"
            >
              mdi-clipboard-text
            </v-icon>

            <v-icon
              class="ml-0 mr-2 pointer"
              color="#757575"
              size="20"
              @click.stop="addL1(props.item)"
            >
              mdi-plus
            </v-icon>

            <v-icon
              class="ml-0 mr-0 pointer"
              color="#757575"
              size="20"
              @click.stop="edit(props.item)"
            >
              mdi-pencil
            </v-icon>
          </td>
        </template>
      </v-data-table>
    </v-container>

    <!-- adding/editing modal -->
    <v-dialog
      v-if="showForm"
      v-model="showForm"
      max-width="800px"
      persistent
      scrollable
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            {{ formTitle }}
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="pa-2 vertical-scroll">
          <v-text-field
            v-model="name"
            color="blue"
            label="Budget Category Name"
          />

          <v-text-field
            v-model="code"
            color="blue"
            label="Code"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />

          <v-btn
            :disabled="loading"
            text
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue"
            dark
            :loading="loading"
            text
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- adding/editing modal -->

    <!-- show l2 items -->
    <v-dialog
      v-if="showSubCatL2"
      v-model="showSubCatL2"
      max-width="800px"
      persistent
      scrollable
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            Sub Category for: {{ l1Item.code ? l1Item.code + ' -' : '' }}
            {{ l1Item.name }}
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <v-data-table
            :headers="headers"
            :items="l1Item.cat_1"
          >
            <template v-slot:items="props">
              <td>
                {{ props.item.code ? props.item.code + ' -' : '' }}
                {{ props.item.name }}
              </td>

              <td class="text-right">
                <v-icon
                  v-if="props.item.cat_2.length > 0"
                  class="ml-4 mr-0 pointer"
                  color="#757575"
                  size="20"
                  @click.stop="showSubCategoriesL3(props.item)"
                >
                  mdi-clipboard-text
                </v-icon>

                <v-icon
                  class="ml-0 mr-2 pointer"
                  color="#757575"
                  size="20"
                  @click.stop="addL2(props.item)"
                >
                  mdi-plus
                </v-icon>

                <v-icon
                  class="ml-0 mr-0 pointer"
                  color="#757575"
                  size="20"
                  @click.stop="edit(props.item)"
                >
                  mdi-pencil
                </v-icon>

                <v-icon
                  class="ml-2 mr-0 pointer"
                  color="#f44336"
                  size="20"
                  @click.stop="deleteL2(l1Item, props.item)"
                >
                  mdi-delete
                </v-icon>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="showSubCatL2 = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- end l2 items  -->

    <!-- show l3 items -->
    <v-dialog
      v-if="showSubCatL3"
      v-model="showSubCatL3"
      max-width="800px"
      persistent
      scrollable
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            Sub Category for: {{ l2Item.code ? l2Item.code + ' -' : '' }}
            {{ l2Item.name }}
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <v-data-table
            :headers="headers"
            :items="l2Item.cat_2"
          >
            <template v-slot:items="props">
              <td>
                {{ props.item.code ? props.item.code + ' -' : '' }}
                {{ props.item.name }}
              </td>
              <td class="text-right">
                <v-icon
                  class="ml-0 mr-2 pointer"
                  color="#757575"
                  size="20"
                  @click.stop="edit(props.item)"
                >
                  mdi-pencil
                </v-icon>

                <v-icon
                  class="ml-0 mr-0 pointer"
                  color="#f44336"
                  size="20"
                  @click.stop="deleteL3(l2Item, props.item)"
                >
                  mdi-delete
                </v-icon>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="showSubCatL3 = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- end l3 items -->
  </component-template>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import ComponentTemplate from '../ComponentTemplate'
// import * as easings from 'vuetify/es5/util/easing-patterns'
import { mapState } from 'vuex'

export default {
  components: {
    ComponentTemplate
  },
  props: {
    included: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  data() {
    return {
      l1Item: {},
      showSubCatL2: false,
      showSubCatL3: false,
      l2Item: {},
      settings: {},
      loading: false,
      name: '',
      code: '',
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
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Action',
          value: 'action'
        }
      ]
    }
  },
  mounted() {
    db.collection('settings')
      .doc(this.currentCompany.id)
      .collection('planned_settings')
      .doc('budgets')
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('planned_settings')
            .doc('budgets')
            .set({
              costCodes: []
            })
        }
      })
  },
  methods: {
    showSubCategoriesL2(item) {
      this.l1Item = item
      this.showSubCatL2 = true
    },
    cancelShowSubCategoriesL2() {
      this.showSubCatL2 = false
      this.l1Item = {}
    },
    showSubCategoriesL3(item) {
      this.l2Item = item
      this.showSubCatL3 = true
    },
    cancelShowSubCategoriesL3() {
      this.showSubCatL3 = true
      this.l2Item = {}
    },
    newL1() {
      this.action = 'new'
      this.level = 1
      this.showForm = true
      this.formTitle = 'Create a new Budget Category'
    },
    addL1(item) {
      this.action = 'add'
      this.level = 1
      this.currentItem = item
      this.showForm = true
      this.$vuetify.goTo(300, this.options)
      this.formTitle = `Adding a Sub Category for Budget Category: ${item.name}`
    },
    addL2(item) {
      this.action = 'add'
      this.level = 2
      this.currentItem = item
      this.showForm = true
      this.$vuetify.goTo(300, this.options)
      this.formTitle = `Adding a Third Level Category for Sub Category: ${item.name}`
    },
    edit(item) {
      this.action = 'edit'
      this.currentItem = item
      this.name = item.name
      this.code = item.code
      this.showForm = true
      this.$vuetify.goTo(300, this.options)
      this.formTitle = `Editing Category: ${item.name}`
    },
    deleteL1(index) {
      const confirmation = confirm(
        'Are you sure you want to delete this Budget Category'
      )
      if (confirmation) {
        this.settings.costCodes.splice(index, 1)
        this.updateData('Budget Category Deleted')
      }
    },
    deleteL2(parentItem, childIndex) {
      const confirmation = confirm(
        'Are you sure you want to delete this Budget Category'
      )
      if (confirmation) {
        parentItem.cat_1.splice(childIndex, 1)
        this.updateData('Budget Category Deleted')
      }
    },
    deleteL3(parentItem, childIndex) {
      const confirmation = confirm(
        'Are you sure you want to delete this Budget Category'
      )
      if (confirmation) {
        parentItem.cat_2.splice(childIndex, 1)
        this.updateData('Budget Category Deleted')
      }
    },
    save() {
      this.loading = true
      if (this.name === '') {
        this.$snotify.error('Budget category name is required', 'Error')
        this.cancel()
        return
      }
      if (!this.code) {
        this.code = ''
      }
      if (this.action === 'new') {
        if (!this.settings.costCodes) {
          this.settings.costCodes = []
        }
        this.settings.costCodes.push({
          name: this.name,
          code: this.code,
          cat_1: []
        })
        this.updateData('Budget Category Saved')
      } else if (this.action === 'add') {
        if (this.level === 1) {
          this.currentItem.cat_1.push({
            name: this.name,
            code: this.code,
            cat_2: []
          })
        } else if (this.level === 2) {
          this.currentItem.cat_2.push({
            name: this.name,
            code: this.code
          })
        }
        this.updateData('Budget Category Updated')
      } else if (this.action === 'edit') {
        this.currentItem.name = this.name
        this.currentItem.code = this.code
        this.updateData('Budget Category Updated')
      }
    },
    updateData(msg) {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('budgets')
        .update({
          costCodes: this.settings.costCodes
        })
        .then(() => {
          this.$snotify.success(msg, 'Success')
          this.cancel()
        })
    },
    cancel() {
      this.loading = false
      this.name = ''
      this.code = ''
      this.action = ''
      this.level = 0
      this.currentItem = {}
      this.currentIndex = -1
      this.showForm = false
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('budgets')
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

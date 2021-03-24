<template>
  <div>
    <v-card
      class="rounded-lg"
      flat
    >
      <v-card-title class="relative">
        <portal
          v-if="included"
          to="budget-1"
        >
          <v-btn
            absolute
            class="mt-3"
            color="white"
            dark
            fab
            right
            small
            @click="newL1"
          >
            <v-icon color="blue">
              mdi-plus
            </v-icon>
          </v-btn>
        </portal>

        <v-btn
          v-else
          absolute
          color="blue"
          dark
          fab
          right
          small
          @click="newL1"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <div class="form-group">
          <label>Cost Element Category</label>
          <v-list
            class="mainList"
            dense
          >
            <v-list-item class="myListHeader">
              <v-list-item-content>Name</v-list-item-content>
              <v-list-item-action>Action</v-list-item-action>
            </v-list-item>

            <draggable
              v-model="budgetCategories"
              @end="drag = false"
              @start="drag = true"
            >
              <v-list-item
                v-for="(item, key) in budgetCategories"
                :key="key"
                class="myList"
              >
                <v-list-item-avatar>
                  <v-icon
                    color="blue"
                    small
                  >
                    mdi-drag-variant
                  </v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  {{ item.code ? item.code + ' -' : '' }} {{ item.name }}
                </v-list-item-content>

                <v-list-item-action
                  style="flex-direction:row; justify-content: flex-end;"
                >
                    <v-icon
                      class="ml-0 mr-0 pointer"
                      color="#757575"
                      size="20"
                      @click.stop="edit(item)"
                    >
                      mdi-pencil
                    </v-icon>

                    <v-icon
                      class="ml-0 mr-0 pointer"
                      color="#f44336"
                      size="20"
                      @click.stop="deleteItem(item)"
                    >
                      mdi-delete
                    </v-icon>
                </v-list-item-action>
              </v-list-item>
            </draggable>
          </v-list>
        </div>
      </v-card-text>
    </v-card>

    <!-- adding/editing modal -->
    <v-dialog
      v-if="showForm"
      v-model="showForm"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            {{ formTitle }}
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />

        <v-card-text class="px-6 py-2">
          <v-text-field
            v-model="name"
            color="blue"
            label="Budget Category"
          />

          <v-text-field
            v-model="code"
            color="blue"
            label="Code"
          />
          <v-checkbox
            v-model="contingency"
            label="Contingency"
          />
          <v-checkbox
            v-model="highLight"
            label="HighLight"
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
            type="submit"
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- adding/editing modal -->
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'
// import * as easings from 'vuetify/es5/util/easing-patterns'
import BudgetCategorySelect from '@/modules/cpm/components/projects/_partials/BudgetCategorySelect'
import draggable from 'vuedraggable'
import { mapState } from 'vuex'

export default {
  name: 'BudgetCategories',
  components: {
    draggable,
    BudgetCategorySelect
  },

  props: {
    included: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      settings: [],
      loading: false,
      name: '',
      code: '',
      action: '',
      contingency: false,
      highLight: false,
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

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    budgetCategoriesRef: function () {
      return db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('budgets')
        .collection('budget_categories')
    },
    classOption: function () {
      const classes = []
      if (this.highLight) {
        classes.push('highLight')
      }

      return classes
    },
    budgetCategories: {
      get() {
        return this.settings
          ? this.settings
            .filter(item => !item.budget_category)
            .sort(function (a, b) {
              return a.index - b.index
            })
            .map(item => ({ ...item, id: item.id, children: [] }))
          : []
      },
      set(value) {
        this.settings = value.map((item, index) => {
          if (index !== item.index) {
            this.budgetCategoriesRef.doc(`${item.id}`).update({ index })

            item.index = index
          }

          return item
        })
      }
    }
  },

  methods: {
    newL1() {
      this.action = 'new'
      this.showForm = true
      this.formTitle = 'Create a new Cost Element Category'
    },

    edit(item) {
      this.action = 'edit'
      this.currentItem = item
      this.name = item.name
      this.code = item.code
      this.contingency = item.contingency || false
      this.highLight = item.highLight || false
      this.showForm = true
      this.$vuetify.goTo(300, this.options)
      this.formTitle = `Editing Category: ${item.name}`
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

      if (!this.budgetCategories) {
        this.budgetCategories = []
      }

      if (this.action === 'new') {
        this.budgetCategoriesRef
          .add({
            name: this.name,
            code: this.code,
            contingency: this.contingency,
            highLight: this.highLight,
            classOption: this.classOption,
            index: this.budgetCategories.length
          })
          .then(() =>
            this.$snotify.success('Budget category created', 'Success')
          )
          .catch(() =>
            this.$snotify.error(
              'Something was wrong creating Budget category',
              'Error'
            )
          )
          .finally(this.cancel)
      } else {
        this.budgetCategoriesRef
          .doc(`${this.currentItem.id}`)
          .update({
            name: this.name,
            code: this.code,
            contingency: this.contingency,
            highLight: this.highLight,
            classOption: this.classOption
          })
          .then(() =>
            this.$snotify.success('Budget category updated', 'Success')
          )
          .catch(() =>
            this.$snotify.error(
              'Something was wrong updating Budget category',
              'Error'
            )
          )
          .finally(this.cancel)
      }
    },

    deleteItem(item) {
      this.loading = true
      const confirmation = confirm(
        `Do you want to delete this category: ${item.name}`
      )
      if (confirmation) {
        const index = this.settings.findIndex(cat => cat.id === item.id)
        this.submitDelete(index, item)
      }
    },
    submitDelete(index, item){
      this.budgetCategoriesRef
        .doc(`${item.id}`)
        .delete()
        .then(() => {
          this.settings.splice(index, 1)
          this.$snotify.success('Budget category deleted', 'Success')
        })
        .catch(() =>
          this.$snotify.error(
            'Something was wrong deleting Budget category',
            'Error'
          )
        )
        .finally(this.cancel)
    },
    cancel() {
      this.loading = false
      this.name = ''
      this.code = ''
      this.action = ''
      this.contingency = false
      this.highLight = false
      this.currentItem = {}
      this.currentIndex = -1
      this.showForm = false
    },
    setBudgetCategory(category) {
      this.name = category
    }
  },

  firestore() {
    return {
      settings: this.budgetCategoriesRef
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

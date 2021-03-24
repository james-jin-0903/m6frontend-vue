<template>
  <v-row>
    <v-col cols="12" :class="colClass">
      <v-autocomplete
        ref="budgetCategoryInput"
        v-model="selectedCategory"
        clearable
        :error-messages="errors"
        :filter="customFilter"
        :hide-details="hideDetails"
        item-text="name"
        item-value="code"
        :items="categories"
        :label="$t('cpm.projects.budgetCategory')"
        :loading="gettingItems"
        :multiple="multiple"
        :outlined="outline"
        return-object
        @input="returnSelectedCategory"
        :disabled="disabled"
      >
        <template
          slot="label"
        >
          <span>
            {{ $t('cpm.projects.budgetCategory') }}
          </span>
          <span
            v-if="requiredLabel"
            class="error--text"
          >
            *
          </span>
        </template>
        <template
          slot="item"
          slot-scope="{ parent, item, tile }"
        >
          <div
            class="black--text"
            :class="($h.dg(item, 'classOption', []).length > 0) ? item.classOption : 'highLightDisable'"
          >
            {{ $h.dg(item, 'code', 'N/A') }} - {{ $h.dg(item, 'name', 'Undefined') }}
          </div>
        </template>
        <template
          slot="selection"
          slot-scope="{ item }"
        >
          {{ $h.dg(item, 'code', 'N/A') }} - {{ $h.dg(item, 'name', 'Undefined') }}
        </template>
      </v-autocomplete>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
export default {
  name: 'BudgetCategorySelect',
  props: {
    colClass: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    category: {
      type: [Object, String, Array],
      default: null
    },
    errors: {
      type: [String, Array],
      default: () => []
    },
    hideDetails: {
      type: Boolean,
      default: false
    },
    outline: {
      type: Boolean,
      default: false
    },
    requiredLabel: {
      type: Boolean,
      default: false
    },
    multiple: {
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
      categories: [],
      gettingItems: true,
      selectedCategory: null
    }
  },
  watch: {
    category: {
      handler(v) {
        if (!v) return
        this.selectedCategory = v
      },
      immediate: true
    }
  },
  created() {
    if (this.multiple) {
      this.selectedCategory = []
    }
    this.fetchBudgetCategories()
  },
  methods: {
    fetchBudgetCategories() {
      const self = this
      this.axios.get(
        `${process.env.VUE_APP_FIREBASE_APIURL}/api/company/${self.currentCompany.id}/budget-categories`
      )
        .then(response => {
          const categories = response.data
          const allCategories = []

          if (categories && categories.length) {
            categories.map(category => {
              allCategories.push(category)
              const subcategories1 = []
              if (category.children && category.children.length) {
                category.children.map(childrenCategory => {
                  allCategories.push(childrenCategory)
                  subcategories1.push(childrenCategory)
                })
              }
              if (subcategories1.children && subcategories1.children.length) {
                subcategories1.children.map(childrenCategory => {
                  allCategories.push(childrenCategory)
                })
              }
            })
          }
          this.categories = _.orderBy(allCategories, 'classOption', 'asc')
          if (this.category) {
            if (!this.multiple) {
              this.selectedCategory = this.category.ref
            } else {
              this.selectedCategory.push(...this.category.ref)
            }
          }
        })
        .finally(() => this.gettingItems = false)
    },
    returnSelectedCategory(category) {
      this.$emit('newCategory', category)
    },
    customFilter(item, queryText) {
      const name = item.name.toLowerCase()
      const code = item.code.toLowerCase()
      const searchText = queryText.toLowerCase()
      return name.indexOf(searchText) > -1 ||
        code.indexOf(searchText) > -1
    }
  }
}
</script>

<style scoped>
  .highLightDisable{
    color: gray;
    opacity:0.25;
  }
  .highLight{
    color: #000;
    opacity: 1;
  }
  >>>.v-list__tile {
    padding: 0 !important;
  }
  >>>.v-list__tile__content{
    padding: 0px 20px 0px 20px !important;
  }
</style>

<template>
  <div>
    <v-card>
      <v-card-title class="relative">
        <v-btn
          absolute
          color="blue"
          dark
          fab
          right
          small
          @click="showForm = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="vertical-scroll">
        <div class="form-group">
          <label>Current Items</label>
          <v-data-table
            :headers="headers"
            :items="settings.categories"
            :options.sync="pagination"
          >
            <template v-slot:item="props">
              <tr>
                <td>{{ props.item }}</td>
                <td class="text-right">
                  <v-btn
                    icon
                    small
                    @click.prevent="editCategory(props.index, props.item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    @click.prevent="deleteCategory(props.index, props.item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>
    <v-card
      v-if="showForm"
      class="mt-2"
    >
      <v-card-text class="vertical-scroll">
        <v-form ref="form">
          <v-text-field
            v-model="category"
            color="blue"
            :label="`${appLabel.profile.category} Name`"
          />
          <input
            v-model="currentCategory"
            type="hidden"
          >
          <v-btn
            color="blue"
            outline
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue"
            dark
            type="submit"
            @click="saveCategory"
          >
            {{ submitLoading ? 'Saving...' : 'Save' }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      show: 'categories',
      category: '',
      currentCategory: '',
      categories: '',
      settings: {},
      submitLoading: false,
      showForm: false,
      rules: {
        required: value => !!value || 'Required.'
      },
      pagination: {
        rowsPerPage: -1
      },
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
    ...mapGetters(['appLabel']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  mounted() {
    db.collection('settings')
      .doc(this.currentCompany.id)
      .collection('settings')
      .doc('policy_and_standards')
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('policy_and_standards')
            .set({
              categories: []
            })
        }
      })
  },
  methods: {
    saveCategory() {
      if (this.category == '') {
        this.$snotify.error('Category name is required', 'Error')
        return
      }
      if (this.currentCategory === '') {
        if (!this.settings.categories) {
          this.settings.categories = []
        }
        this.settings.categories.push(this.category)
      } else {
        this.$set(this.settings.categories, this.currentCategory, this.category)
      }

      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('policy_and_standards')
        .update({
          categories: this.settings.categories
        })

      this.$snotify.success('The category has been saved', 'Success')
      this.cancel()
    },
    deleteCategory(id, name) {
      const confirmation = confirm(
        `Do you want to delete this category: ${name}`
      )
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.categories.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('policy_and_standards')
        .update({
          categories: this.settings.categories
        })
      this.$snotify.success(
        `The ${this.appLabel.profile.category} has been deleted`,
        'Success'
      )
    },
    editCategory(id, name) {
      this.category = name
      this.currentCategory = id
      this.showForm = true
    },
    cancel() {
      this.category = ''
      this.currentCategory = ''
      this.showForm = false
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('policy_and_standards')
    }
  }
}
</script>

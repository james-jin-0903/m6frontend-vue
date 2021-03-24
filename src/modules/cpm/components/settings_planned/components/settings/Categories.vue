<template>
  <component-template>
    <template slot="button">
      <v-btn
        color="primary"
        fab
        small
        @click="showForm = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-container class="pt-0 rounded-lg">
      <v-data-table
        :headers="headers"
        :items="settings.categories"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item }}</td>
            <td class="text-right">
              <v-btn
                icon
                small
                text
                @click.prevent="editCategory(props.index, props.item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                text
                @click.prevent="deleteCategory(props.index, props.item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>

    <v-card
      v-if="showForm"
      class="mt-2"
    >
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">
          {{ currentCategory === '' ? 'Creating' : 'Editing' }}
        </span>
      </v-card-title>
      <v-divider class="grey lighten-3" />
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
            outlined
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
  </component-template>
</template>

<script>
import { db } from '@/utils/Firebase'
import ComponentTemplate from '../ComponentTemplate'
import { mapState, mapGetters } from 'vuex'
export default {
  components: {
    ComponentTemplate
  },
  data() {
    return {
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Action',
          value: 'action'
        }
      ],
      showForm: false,
      show: 'categories',
      category: '',
      currentCategory: '',
      categories: '',
      settings: {},
      submitLoading: false,
      rules: {
        required: value => !!value || 'Required.'
      }
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
      .doc(this.appLabel.settingsCollection)
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('planned_settings')
            .doc(this.appLabel.settingsCollection)
            .set({
              categories: []
            })
        }
      })
  },
  methods: {
    saveCategory() {
      if (this.category === '') {
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
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          categories: this.settings.categories
        })

      this.$snotify.success(
        `The ${this.appLabel.profile.category} has been saved`,
        'Success'
      )
      this.category = ''
      this.currentCategory = ''
    },
    deleteCategory(id, name) {
      const confirmation = confirm(`Do you want to delete this category: ${name}`)
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.categories.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          categories: this.settings.categories
        })
      this.$snotify.success(
        `The ${this.appLabel.profile.category} has been deleted`,
        'Success'
      )
    },
    editCategory(id, name) {
      this.showForm = true
      this.category = name
      this.currentCategory = id
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
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
    }
  }
}
</script>

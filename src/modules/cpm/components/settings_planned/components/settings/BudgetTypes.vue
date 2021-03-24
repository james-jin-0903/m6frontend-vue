<template>
  <component-template>
    <portal
      v-if="included"
      to="budget-2"
    >
      <v-btn
        color="white"
        dark
        fab
        small
        @click="showForm = true"
      >
        <v-icon color="blue">
          mdi-plus
        </v-icon>
      </v-btn>
    </portal>

    <template slot="button">
      <v-btn
        v-if="!included"
        color="primary"
        dark
        fab
        small
        @click="showForm = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-container class="pt-0 rounded-lg">
      <v-data-table
        :footer-props="footerProps"
        :headers="headers"
        :items="settings.types"
      >
        <template v-slot:items="props">
          <td>{{ props.item }}</td>

          <td class="text-right">
            <v-icon
              class="ml-0 mr-2 pointer"
              color="#757575"
              size="20"
              @click.prevent="editElement(props.index, props.item)"
            >
              mdi-pencil
            </v-icon>

            <v-icon
              class="ml-0 mr-2 pointer"
              color="#f44336"
              size="20"
              @click.prevent="deleteElement(props.index, props.item)"
            >
              mdi-delete
            </v-icon>
          </td>
        </template>
      </v-data-table>
    </v-container>

    <v-dialog
      v-if="showForm"
      v-model="showForm"
      max-width="800px"
      persistent
      scrollable
    >
      <v-card class="mt-2 rounded-lg">
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            Budget Types
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <v-form ref="form">
            <v-text-field
              v-model="element"
              color="blue"
              label="Budget Type Name"
            />
            <input
              v-model="currentElement"
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
              @click="save"
            >
              {{ submitLoading ? 'Saving...' : 'Save' }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </component-template>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import ComponentTemplate from '../ComponentTemplate'
import { mapState } from 'vuex'

export default {
  name: 'BudgetTypes',
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
      footerProps: {
        'items-per-page-options': [5, 10, 15, 10000]
      },
      element: '',
      currentElement: '',
      settings: {},
      submitLoading: false,
      showForm: false,
      rules: {
        required: value => !!value || 'Required.'
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
              types: []
            })
        }
      })
  },
  methods: {
    save() {
      if (this.element === '') {
        this.$snotify.error('Budget type name is required', 'Error')
        return
      }
      if (this.currentElement === '') {
        if (!this.settings.types) {
          this.settings.types = []
        }
        this.settings.types.push(this.element)
      } else {
        this.$set(this.settings.types, this.currentElement, this.element)
      }
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('budgets')
        .update({
          types: this.settings.types
        })
      this.$snotify.success('The Budget type has been saved', 'Success')
      this.cancel()
    },
    deleteElement(id, name) {
      const confirmation = confirm(
        `Do you want to delete this budget type: ${name}`
      )
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.types.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('budgets')
        .update({
          types: this.settings.types
        })
      this.$snotify.success('The Budget type has been deleted', 'Success')
    },
    editElement(id, name) {
      this.element = name
      this.currentElement = id
      this.showForm = true
    },
    cancel() {
      this.element = ''
      this.currentElement = ''
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

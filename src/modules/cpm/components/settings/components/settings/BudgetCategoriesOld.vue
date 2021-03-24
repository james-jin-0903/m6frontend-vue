<template>
  <div>
    <v-card>
      <v-form ref="form">
        <div class="form-group">
          <label v-if="currentElement !== '' ">Edit Budget Category</label>
          <label v-else>Add New Budget Category</label>
          <v-text-field
            v-model="element"
            color="blue"
            label="Budget Category Name"
          />
          <input
            v-model="currentElement"
            type="hidden"
          >
        </div>
        <div class="form-group">
          <div
            class="action-container"
            style="text-align: center"
          >
            <button
              class="btn btn-danger"
              @click.prevent="cancel"
            >
              Cancel
            </button>
            <button
              class="btn btn-primary"
              :disabled="submitLoading"
              @click.prevent="save"
            >
              {{ submitLoading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </v-form>
    </v-card>
  </div>
  <v-card>
    <div class="form-group">
      <label>Current Cost Element Category</label>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(name,key) in settings.budgetCategories">
            <tr>
              <td>
                {{ name }}
              </td>
              <td>
                <div class="btn-group">
                  <button
                    aria-expanded="false"
                    aria-haspopup="true"
                    class="btn btn-success btn-xs dropdown-toggle"
                    data-toggle="dropdown"
                    type="button"
                  >
                    <i class="glyphicon glyphicon-cog" />&nbsp;
                    <span class="caret" />
                  </button>
                  <ul class=".dropdown-menu-right dropdown-menu">
                    <li>
                      <a
                        class="table-action"
                        href="#"
                        @click.prevent="editElement(key,name)"
                      >Edit</a>
                    </li>
                    <li>
                      <a
                        class="table-action"
                        href="#"
                        @click.prevent="deleteElement(key,name)"
                      >Delete</a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    </div>
    </div>
  </v-card>
</template>

<script>
import { db } from '@/utils/Firebase.js'
export default {
  data() {
    return {
      element: '',
      currentElement: '',
      settings: {},
      submitLoading: false,
      rules: {
        required: value => !!value || 'Required.'
      }
    }
  },
  methods: {
    save() {
      if (this.element == '') {
        this.$snotify.error('Budget category name is required', 'Error')
        return
      }
      if (this.currentElement === '') {
        this.settings.budgetCategories.push(this.element)
      } else {
        this.$set(this.settings.budgetCategories, this.currentElement, this.element)
      }
      db.collection('settings').doc('budgets').update(
        {
          budgetCategories: this.settings.budgetCategories
        }
      )
      this.$snotify.success('The Budget category has been saved', 'Success')
      this.element = ''
      this.currentElement = ''
    },
    deleteElement(id, name) {
      const confirmation = confirm(`Do you want to delete this budget category: ${name}`)
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.budgetCategories.splice(id, 1)
      db.collection('settings').doc('budgets').update(
        {
          budgetCategories: this.settings.budgetCategories
        }
      )
      this.$snotify.success('The Budget category has been deleted', 'Success')
    },
    editElement(id, name) {
      this.element = name
      this.currentElement = id
    },
    cancel() {
      this.element = ''
      this.currentElement = ''
    }
  },
  firestore() {
    return {
      settings: db.collection('settings').doc('budgets')
    }
  }
}
</script>


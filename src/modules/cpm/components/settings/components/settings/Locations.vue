<template>
  <div>
    <v-card>
      <v-form
        ref="form"
        class="mb-5"
      >
        <v-text-field
          v-model="element"
          color="blue"
          label="Campus Name"
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
    </v-card>
  </div>
  <v-card>
    <div class="form-group">
      <label>Current Campus</label>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(name,key) in settings.locations">
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
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
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
  mounted() {
    db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('projects').get().then(settings => {
      if (!settings.exists) {
        db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('projects').set(
          {
            locations: []
          }
        )
      }
    })
  },
  methods: {
    save() {
      if (this.element == '') {
        this.$snotify.error('Campus name is required', 'Error')
        return
      }
      if (this.currentElement === '') {
        if (!this.settings.locations) {
          this.settings.locations = []
        }
        this.settings.locations.push(this.element)
      } else {
        this.$set(this.settings.locations, this.currentElement, this.element)
      }
      db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('projects').update({
        locations: this.settings.locations
      })
      this.$snotify.success('The Campus has been saved', 'Success')
      this.element = ''
      this.currentElement = ''
    },
    deleteElement(id, name) {
      const confirmation = confirm(`Do you want to delete this Campus: ${name}`)
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.locations.splice(id, 1)
      db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('projects').update(
        {
          locations: this.settings.locations
        }
      )
      this.$snotify.success('The Campus has been deleted', 'Success')
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
      settings: db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('projects')
    }
  }
}
</script>


<template>
  <div>
    <v-card>
      <v-form ref="form">
        <v-text-field
          v-model="element"
          color="blue"
          label="Type Name"
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
      <label>Current Types</label>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(name,key) in settings.projectTypes">
            <tr :key="key">
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
import { mapState, mapGetters } from 'vuex'
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
  computed: {
    ...mapGetters(['appLabel']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  mounted() {
    db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('projects').get().then(settings => {
      if (!settings.exists) {
        db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('projects').set(
          {
            projectTypes: []
          }
        )
      }
    })
  },
  methods: {
    save() {
      if (this.element == '') {
        this.$snotify.error('Type name is required', 'Error')
        return
      }
      if (this.currentElement === '') {
        if (!this.settings.projectTypes) {
          this.settings.projectTypes = []
        }
        this.settings.projectTypes.push(this.element)
      } else {
        this.$set(this.settings.projectTypes, this.currentElement, this.element)
      }
      db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('projects').update({
        projectTypes: this.settings.projectTypes
      })
      this.$snotify.success('The Type has been saved', 'Success')
      this.element = ''
      this.currentElement = ''
    },
    deleteElement(id, name) {
      const confirmation = confirm(`Do you want to delete this Type: ${name}`)
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.projectTypes.splice(id, 1)
      db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('projects').update(
        {
          projectTypes: this.settings.projectTypes
        }
      )
      this.$snotify.success('The Type has been deleted', 'Success')
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

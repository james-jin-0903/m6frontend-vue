<template>
  <div>
    <v-card>
      <v-form ref="form">
        <div class="form-group">
          <label v-if="currentElement !== '' ">Edit Project Coordinator</label>
          <label v-else>Add New Project Coordinator</label>
          <v-select
            v-model="element"
            clearable
            :filterable="false"
            :options="users"
            :value="currentElement"
            @input="userAssign"
            @search="getUsers"
          >
            <template slot="no-options">
              type to search Users..
            </template>
            <template
              slot="option"
              slot-scope="option"
            >
              {{ option.label }}
            </template>
          </v-select>
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
    <v-card>
      <div class="form-group">
        <label>Current Status </label>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(projectCoordinator,key) in settings.projectCoordinator">
              <tr :key="key">
                <td>
                  {{ projectCoordinator.label }}
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
    </v-card>
  </div>
  </div>
  </v-card>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState } from 'vuex'

export default {
  name: 'ProjectCoordinator',
  data() {
    return {
      element: '',
      currentElement: '',
      settings: {},
      submitLoading: false,
      users: [],
      rules: {
        required: value => !!value || 'Required.'
      }
    }
  },
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  mounted() {
    db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('users').get().then(settings => {
      if (!settings.exists) {
        db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('users').set(
          {
            projectCoordinator: []
          }
        )
      }
    })
  },
  methods: {
    getUsers(search, loading) {
      loading(true)
      this.searchUsers(loading, search, this)
    },
    searchUsers: _.debounce((loading, search, vm) => {
      fetch(
        `/fm-dev/users/search/${escape(search)}`
      ).then(res => res.json()).then(json => {
        vm.users = json
        loading(false)
      })
    }, 350),
    userAssign() {},
    save() {
      if (this.element === '' || !this.element.label) {
        this.$snotify.error('Project Coordinator name is required', 'Error')
        return
      }
      if (this.currentElement === '') {
        if (!this.settings.projectCoordinator) {
          this.settings.projectCoordinator = []
        }
        this.settings.projectCoordinator.push(this.element)
      } else {
        this.$set(this.settings.projectCoordinator, this.currentElement, this.element)
      }
      db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('users').update(
        {
          projectCoordinator: this.settings.projectCoordinator
        }
      )
      this.$snotify.success('The Project Coordinator has been saved', 'Success')
      this.element = ''
      this.currentElement = ''
    },
    deleteElement(id, name) {
      const confirmation = confirm(`Do you want to delete this Project Coordinator: ${name}`)
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.projectCoordinator.splice(id, 1)
      db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('users').update(
        {
          projectCoordinator: this.settings.projectCoordinator
        }
      )
      this.$snotify.success('The Project Coordinator has been deleted', 'Success')
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
      settings: db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('users')
    }
  }
}
</script>


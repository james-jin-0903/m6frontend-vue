<template>
  <div>
    <v-card>
      <v-form ref="form">
        <h6
          v-if="currentDepartment"
          class="indigo--text"
        >
          Editing:
        </h6>
        <v-text-field
          v-model="department"
          color="blue"
          label="Department Name"
        />
        <input
          v-model="currentDepartment"
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
          @click="saveDepartment"
        >
          {{ submitLoading ? 'Saving...' : 'Save' }}
        </v-btn>
      </v-form>
    </v-card>
  </div>
  <v-card>
    <div class="form-group">
      <label>Current Departments</label>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(name,key) in settings.departments">
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
                        @click.prevent="editDepartment(key,name)"
                      >Edit</a>
                    </li>
                    <li>
                      <a
                        class="table-action"
                        href="#"
                        @click.prevent="deleteDepartment(key,name)"
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
      show: 'categories',
      department: '',
      currentDepartment: '',
      settings: {},
      firstTime: false,
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
            departments: []
          }
        )
      }
    })
  },
  methods: {
    saveDepartment() {
      if (this.department == '') {
        this.$snotify.error('Department name is required', 'Error')
        return
      }
      if (this.currentDepartment === '') {
        if (!this.settings.departments) {
          this.settings.departments = []
        }
        this.settings.departments.push(this.department)
      } else {
        this.$set(this.settings.departments, this.currentDepartment, this.department)
      }
      db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('projects').update(
        {
          departments: this.settings.departments
        }
      )

      this.$snotify.success('The Department has been saved', 'Success')
      this.department = ''
      this.currentDepartment = ''
    },
    deleteDepartment(id, name) {
      const confirmation = confirm(`Do you want to delete this department: ${name}`)
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.departments.splice(id, 1)
      db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('projects').update(
        {
          departments: this.settings.departments
        }
      )
      this.$snotify.success('The Department has been deleted', 'Success')
    },
    editDepartment(id, name) {
      this.department = name
      this.currentDepartment = id
    },
    cancel() {
      this.department = ''
      this.currentDepartment = ''
    }
  },
  firestore() {
    return {
      settings: db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('projects')
    }
  }
}
</script>


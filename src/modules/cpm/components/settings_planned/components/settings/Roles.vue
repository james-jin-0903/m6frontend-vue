<template>
  <div>
    <v-card>
      <v-card-title class="relative">
        <portal
          v-if="included"
          to="assignment-2"
        >
          <v-btn
            absolute
            color="white"
            fab
            light
            right
            small
            @click="showForm = true"
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
          @click="showForm = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="vertical-scroll">
        <div class="form-group">
          <label v-if="!included">Current Roles</label>
          <v-data-table
            :headers="headers"
            :items="settings.roles"
          >
            <template v-slot:items="props">
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.users.length }}</td>
              <td class="text-right">
                <v-icon
                  class="ml-0 mr-2 pointer"
                  color="#757575"
                  size="20"
                  @click.prevent="editElement(props.item)"
                >
                  mdi-pencil
                </v-icon>

                <v-icon
                  class="ml-0 mr-0 pointer"
                  color="#f44336"
                  size="20"
                  @click.prevent="deleteElement(props.item)"
                >
                  mdi-delete
                </v-icon>
              </td>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>

    <v-dialog
      v-if="showForm"
      v-model="showForm"
      max-width="800px"
      persistent
      scrollable
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            {{ Number.isInteger(currentElement) ? 'Edit Role' : 'Add New Role' }}
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <div class="form-group">
            <v-text-field
              v-model="roleName"
              color="blue"
              label="Role Name"
            />
            <v-checkbox
              v-model="vendorRole"
              label="This is a Vendor role"
            />
            <v-checkbox
              v-model="adminRole"
              label="Able to see all projects"
            />
            <label>Users</label>
            <vue-select
              v-model="selectedUsers"
              :filterable="false"
              multiple
              :options="userSearchResult"
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
            </vue-select>
            <label>Color</label>
            <chrome-picker v-model="roleColor" />
          </div>
          <v-card-actions>
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
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showConfirmDialog"
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">
          The selected Vendors will have access to the Projects if they are
          added as Team Members
        </v-card-title>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="red darken-1"
            text
            @click="showConfirmDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="green darken-1"
            dark
            @click="save"
          >
            I Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <m6-confirm-delete
      :message="
        `Are you sure you want to permanently delete the ${$h.dg(deleteInfo, 'name.name', '')} role?`
      "
      :show="showDeleteModal"
      title="Delete Role"
      @cancel="cancelDelete"
      @confirm="submitDelete"
    />
  </div>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState, mapGetters } from 'vuex'
import axios from 'axios'
import { Chrome } from 'vue-color'
import vSelect from 'vue-select'

export default {
  name: 'Roles',
  components: {
    'chrome-picker': Chrome,
    'vue-select': vSelect
  },
  props: {
    included: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      deleteInfo: {},
      showDeleteModal: false,
      settings: {},
      submitLoading: false,
      showConfirmDialog: false,
      showForm: false,
      users: [],
      userSearchResult: [],
      roleName: '',
      rules: {
        required: value => !!value || 'Required.'
      },
      currentElement: '',
      selectedUsers: [],
      vendorRole: false,
      adminRole: false,
      roleColor: {},
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Users',
          sortable: false
        },
        {
          text: 'Action',
          sortable: false
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
      .doc('roles')
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('roles')
            .set({
              roles: []
            })
        }
      })
  },
  methods: {
    getUsers(search, loading) {
      loading(true)
      if (search !== '') {
        if (!this.vendorRole) {
          this.searchUsers(loading, search, this)
        } else {
          this.searchVendorUsers(loading, search, this)
        }
      } else {
        loading(false)
      }
    },
    searchUsers: _.debounce((loading, search, vm) => {
      fetch(`/fm-dev/users/search/${escape(search)}`)
        .then(res => res.json())
        .then(json => {
          vm.userSearchResult = json
          loading(false)
        })
    }, 350),
    searchVendorUsers: _.debounce((loading, search, vm) => {
      const data = {
        search
      }
      axios
        .post('/vendor_profiles_o/get/dashboard-contacts', data)
        .then(res => {
          vm.userSearchResult = res.data.result
          loading(false)
        })
    }, 350),
    userAssign() {
      this.userSearchResult = []
    },
    saveCheck() {
      if (!this.vendorRole) {
        this.save()
      } else {
        this.showConfirmDialog = true
      }
    },
    save() {
      this.showConfirmDialog = false

      if (!this.roleName) {
        this.$snotify.error('Role name is required', 'Error')
        return
      }

      const aux = {
        name: this.roleName,
        vendorRole: this.vendorRole,
        adminRole: this.adminRole,
        users: this.selectedUsers,
        color: this.roleColor
      }

      let roles = []

      if (this.settings.roles) {
        roles = JSON.parse(JSON.stringify(this.settings.roles))
      }

      if (Number.isInteger(this.currentElement)) {
        roles[this.currentElement] = aux
      } else {
        if (!roles) {
          roles = []
        }
        roles.push(aux)
      }

      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('roles')
        .set({
          roles
        }, { merge: true })
      this.$snotify.success('The Role has been saved', 'Success')
      this.cancel()
    },
    deleteElement(name) {
      const id = this.lodash.findIndex(this.settings.roles, name)

      this.deleteInfo = { id, name }
      this.showDeleteModal = true
    },
    cancelDelete() {
      this.showDeleteModal = false
      this.deleteInfo = {}
    },
    submitDelete() {
      const id = this.deleteInfo.id
      const roles = JSON.parse(JSON.stringify(this.settings.roles))

      roles.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('roles')
        .set({
          roles
        }, { merge: true })
      this.$snotify.success('The Role has been deleted', 'Success')
      this.cancelDelete()
    },
    editElement(role) {
      this.roleName = role.name
      this.vendorRole = role.vendorRole || false
      this.adminRole = role.adminRole || false
      this.selectedUsers = role.users

      if (role.color) {
        this.roleColor = role.color
      }
      const index = this.lodash.findIndex(this.settings.roles, role)

      this.currentElement = index
      this.showForm = true
    },
    cancel() {
      this.roleName = ''
      this.vendorRole = false
      this.adminRole = false
      this.showForm = false
      this.currentElement = ''
      this.selectedUsers = []
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('roles'),
      users: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.usersCollection)
    }
  }
}
</script>

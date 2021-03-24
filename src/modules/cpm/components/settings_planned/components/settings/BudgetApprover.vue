<template>
  <component-template>
    <portal
      v-if="included"
      to="assignment-1"
    >
      <v-btn
        absolute
        color="white"
        dark
        fab
        right
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
      <label>Current Budget Approvers</label>
      <v-data-table
        :headers="headers"
        :items="settings.budgetApprover"
        :items-per-page-options="[5,10,15,200]"
      >
        <template v-slot:items="props">
          <td>{{ props.item.label }}</td>
          <td class="text-right">
            <v-icon
              class="ml-0 mr-0 pointer"
              color="#f44336"
              size="20"
              @click.prevent="deleteElement(props.index, props.item.label)"
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
            {{ currentElement !== '' ? 'Edit Budget Approver' : 'Add New Budget Approver' }}
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <v-form ref="form">
            <div class="form-group">
              <label v-if="currentElement !== ''">Edit Budget Approver</label>
              <label v-else>Add New Budget Approver</label>
              <vue-select
                v-model="element"
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
              </vue-select>
              <input
                v-model="currentElement"
                type="hidden"
              >
            </div>
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

    <m6-confirm-delete
      :message="
        `Are you sure you want to permanently delete this Budget Approver: ${deleteInfo.name} ?`
      "
      :show="showDeleteModal"
      title="Delete Budget Approver"
      @cancel="cancelDelete"
      @confirm="submitDelete"
    />
  </component-template>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import ComponentTemplate from '../ComponentTemplate'
import vSelect from 'vue-select'
import { mapState } from 'vuex'

export default {
  components: {
    ComponentTemplate,
    'vue-select': vSelect
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
      deleteInfo: {},
      showDeleteModal: false,
      element: '',
      currentElement: '',
      settings: {},
      submitLoading: false,
      showForm: false,
      users: [],
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
      .doc('users')
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('planned_settings')
            .doc('users')
            .set({
              budgetApprover: []
            })
        }
      })
  },
  methods: {
    getUsers(search, loading) {
      loading(true)
      if (search !== '') {
        this.searchUsers(loading, search, this)
      } else {
        loading(false)
      }
    },
    searchUsers: _.debounce((loading, search, vm) => {
      fetch(`/fm-dev/users/search/${escape(search)}`)
        .then(res => res.json())
        .then(json => {
          vm.users = json
          loading(false)
        })
    }, 350),
    userAssign() {},
    save() {
      if (this.element === '' || !this.element.label) {
        this.$snotify.error('Budget Approver name is required', 'Error')
        return
      }
      if (this.currentElement === '') {
        if (!this.settings.budgetApprover) {
          this.settings.budgetApprover = []
        }
        this.settings.budgetApprover.push(this.element)
      } else {
        this.$set(
          this.settings.budgetApprover,
          this.currentElement,
          this.element
        )
      }
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('users')
        .update({
          budgetApprover: this.settings.budgetApprover
        })
      this.$snotify.success('The Budget Approver has been saved', 'Success')
      this.cancel()
    },
    deleteElement(id, name) {
      this.deleteInfo = { id, name }
      this.showDeleteModal = true
    },
    cancelDelete() {
      this.showDeleteModal = false
      this.deleteInfo = {}
    },
    submitDelete() {
      const id = this.deleteInfo.id
      this.settings.budgetApprover.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc('users')
        .update({
          budgetApprover: this.settings.budgetApprover
        })
      this.$snotify.success('The Budget Approver has been deleted', 'Success')
      this.cancelDelete()
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
        .doc('users')
    }
  }
}
</script>

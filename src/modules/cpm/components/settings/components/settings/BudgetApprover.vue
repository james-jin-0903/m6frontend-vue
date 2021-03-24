<template>
  <div>
    <v-card>
      <v-card-title class="relative">
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
          <label v-if="!included">Current Budget Approvers</label>
          <v-data-table
            :headers="headers"
            :items="settings.budgetApprover"
            :items-per-page-options="[5,10,15,200]"
            :options.sync="pagination"
          >
            <template v-slot:item="props">
              <tr>
                <td>{{ `${props.item.firstName} ${ props.item.lastName }` }}</td>
                <td class="text-right">
                  <!--<v-btn-->
                  <!--  small-->
                  <!--  icon-->
                  <!--  @click.prevent="editElement(props.index, props.item)">-->
                  <!--  <v-icon>mdi-pencil</v-icon>-->
                  <!--</v-btn>-->
                  <v-icon
                    class="ml-0 mr-0 pointer"
                    color="#f44336"
                    size="20"
                    @click.prevent="deleteElement(props.index, `${props.item.firstName} ${ props.item.lastName }`)"
                  >
                    mdi-delete
                  </v-icon>
                </td>
              </tr>
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
    >
      <v-card
        class="mt-2rounded-lg"
        :style="{height: viewportHeight}"
      >
        <v-row align="center">
          <label
            v-if="currentElement !== ''"
            class="white--text"
          >
            Edit Budget Approver
          </label>
          <label
            v-else
            class="white--text"
          >Add New Budget Approver</label>
        </v-row>
        <v-card-text class="vertical-scroll">
          <v-form ref="form">
            <div class="form-group">
              <label v-if="currentElement !== ''">Edit Budget Approver</label>
              <label v-else>Add New Budget Approver</label>
              <v-autocomplete
                v-model="element"
                color="blue-grey lighten-2"
                filled
                item-text="firstName"
                :items="users"
                label="Select"
                return-object
              >
                <template v-slot:item="data">
                  <template>
                    <v-list-item-avatar>
                      <v-img
                        v-if="data.item.avatar"
                        :src="data.item.avatar"
                      />
                      <v-icon v-else>
                        mdi-account
                      </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-html="data.item.firstName + &quot; &quot; + data.item.lastName" />
                      <v-list-item-subtitle v-html="data.item.email" />
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
              <input
                v-model="currentElement"
                type="hidden"
              >
            </div>
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
  </div>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import vSelect from 'vue-select'
import { mapState, mapGetters } from 'vuex'

// eslint-disable-next-line vue/require-name-property
export default {
  components: {
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
    }),
    viewportHeight() {
      const h = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      ) * 0.63
      return `${h}px`
    }
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
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    ...mapGetters('Companies', {
      users: 'getCurrentCompanyUsers'
    }),
    viewportHeight() {
      const h = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      ) * 0.63
      return `${h}px`
    }
  },
  mounted() {
    db.collection('settings')
      .doc(this.currentCompany.result.id.toString())
      .collection('settings')
      .doc('users')
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.result.id.toString())
            .collection('settings')
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
      if (this.element === '' || !Object.keys(this.element).length > 0) {
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
        .doc(this.currentCompany.result.id.toString())
        .collection('settings')
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
        .doc(this.currentCompany.result.id.toString())
        .collection('settings')
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
        .doc(this.currentCompany.result.id.toString())
        .collection('settings')
        .doc('users')
    }
  }
}
</script>

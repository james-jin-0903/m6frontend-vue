<template>
  <div>
    <v-card
      class="rounded-lg"
      flat
    >
      <v-card-title class="relative">
        <portal
          v-if="included"
          to="budget-0"
        >
          <v-btn
            absolute
            class="mt-3"
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
      <v-card-text>
        <div class="form-group">
          <label v-if="!included">Current Budget Status</label>
          <v-data-table
            :headers="headers"
            :items="settings.status"
            :items-per-page-options="[5, 10, 15, 200]"
            :options.sync="pagination"
          >
            <template v-slot:item="props">
              <tr>
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
                    class="ml-0 mr-0 pointer"
                    color="#f44336"
                    size="20"
                    @click.prevent="deleteElement(props.index, props.item)"
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
      max-width="400px"
      persistent
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            Budget Status
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="element"
              color="blue"
              label="Budget Status Name"
            />
            <input
              v-model="currentElement"
              type="hidden"
            >
            <div class="d-flex justify-end w-full">
              <v-btn
                class="grey--text text--darken-3"
                outlined
                text
                @click="cancel"
              >
                Cancel
              </v-btn>
              <v-btn
                class="ml-2"
                color="blue"
                dark
                type="submit"
                @click="save"
              >
                {{ submitLoading ? "Saving..." : "Save" }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--DELETE MODAL-->
    <m6-confirm-delete
      v-if="showBudgetStatusDeleteModal"
      :message="
        $t('cpm.projects.budgetPanel.confirmBudgetStatus') +
          ' ' +
          budgetStatusDeleteItemName
      "
      :show="showBudgetStatusDeleteModal"
      :title="$t('cpm.projects.budgetPanel.deleteBudgetStatus')"
      @cancel="showBudgetStatusDeleteModal = false"
      @confirm="submitDelete"
    />
    <!--DELETE MODAL-->
  </div>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState } from 'vuex'

export default {
  name: 'BudgetStatus',
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
      element: '',
      currentElement: '',
      settings: {},
      submitLoading: false,
      showForm: false,
      showBudgetStatusDeleteModal: false,
      budgetStatusDeleteItemId: '',
      budgetStatusDeleteItemName: '',
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
  mounted() {
    db.collection('settings')
      .doc(this.currentCompany.id)
      .collection('settings')
      .doc('budgets')
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('budgets')
            .set({
              status: []
            })
        }
      })
  },
  methods: {
    save() {
      if (this.element == '') {
        this.$snotify.error('Budget status name is required', 'Error')
        return
      }
      if (this.currentElement === '') {
        if (!this.settings.status) {
          this.settings.status = []
        }
        this.settings.status.push(this.element)
      } else {
        this.$set(this.settings.status, this.currentElement, this.element)
      }

      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('budgets')
        .update({
          status: this.settings.status
        })
      this.$snotify.success('The Budget status has been saved', 'Success')
      this.cancel()
    },
    deleteElement(id, name) {
      this.budgetStatusDeleteItemId = id
      this.budgetStatusDeleteItemName = name
      this.showBudgetStatusDeleteModal = true
    },
    submitDelete() {
      this.showBudgetStatusDeleteModal = false
      this.settings.status.splice(this.budgetStatusDeleteItemI, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('budgets')
        .update({
          status: this.settings.status
        })
      this.$snotify.success('The Budget status has been deleted', 'Success')
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
        .collection('settings')
        .doc('budgets')
    }
  }
}
</script>

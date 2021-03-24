<template>
  <m6-card-dialog
    id="step8"
    :title="$t('cpm.projects.budgetPanel.title')"
    toolbar-color="#2196f3"
  >
    <template v-slot:after:title>
      <v-tooltip
        v-if="$route.name === 'cpm.projects.show'"
        left
      >
        <template v-slot:activator="{ on }">
          <a
            class="pointer pr-1"
            :href="'/m6apps#/cpm/projects/' + $route.params.id + '/fullscreen/financials-budgets'"
            target="_blank"
            v-on="on"
          >
            <v-icon
              light
              text
            >
              mdi-launch
            </v-icon>
          </a>
        </template>
        <span>{{ $t('general.openNewTab') }}</span>
      </v-tooltip>

      <v-icon
        class="pointer"
        light
        @click="createNewBudget"
      >
        mdi-plus
      </v-icon>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon
            v-if="isAdmin"
            class="cursor grey--text ml-2 text--darken-2"
            color="white"
            v-on="on"
            @click="openSettingModal"
          >
            mdi-cog
          </v-icon>
        </template>
        <span class="grey lighten-3 pa-1 rounded">{{ $t('cpm.projects.budgetPanel.settings') }}</span>
      </v-tooltip>
    </template>

    <v-row
      v-if="false"
      justify="end"
    >
      <v-chip color="transparent">
        {{ $t('cpm.projects.budgetPanel.budget') }} {{ totalBudget | currency }}
      </v-chip>

      <v-chip color="transparent">
        {{ $t('cpm.projects.budgetPanel.planBudget') }} {{ planBudget | currency }}
      </v-chip>
    </v-row>

    <v-data-table
      :footer-props="fProps"
      :headers="headers"
      :items="budgets"
      :items-per-page-options="[5,10,15,200]"
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.title }}</td>
          <td>{{ props.item.active ? $t('general.yes') : $t('general.no') }}</td>
          <td>{{ props.item.status || '-' }}</td>
          <td>{{ props.item.type || '-' }}</td>
          <td class="text-right">
            {{ !props.item.plan ? 0 : props.item.plan | currency }}
          </td>
          <td class="text-right">
            {{ !props.item.total ? 0 : props.item.total | currency }}
          </td>
          <td class="text-center">
            <m6-dropdown-actions
              :options="dropdownOptions"
              @delete="deleteBudget(props.item)"
              @edit="editBudget(props.item)"
            />
          </td>
        </tr>
      </template>
    </v-data-table>

    <!--DELETE MODAL-->
    <m6-confirm-delete
      v-if="showBudgetDeleteModal"
      :message="$t('cpm.projects.budgetPanel.confirmBudget')"
      :show="showBudgetDeleteModal"
      :title="$t('cpm.projects.budgetPanel.deleteBudget')"
      @cancel="cancelDelete"
      @confirm="submitDelete"
    />
    <!--DELETE MODAL-->

    <edit-modal
      v-if="editModalOpen"
      v-model="editModalOpen"
      :budget="budgetToEdit"
      :type="type"
      @createNewBudget="createNewBudget"
    />

    <m6-loading :loading="showLoading" />

    <settings-modal
      v-if="showSettings"
      :show="showSettings"
      @close="showSettings = false"
    />

    <planned-settings-modal
      v-if="showPlannedSettings"
      :show="showPlannedSettings"
      @close="showPlannedSettings = false"
    />
  </m6-card-dialog>
</template>

<script>
import { db, storage } from '@/utils/Firebase'

import EditModal from './Modals/EditBudget'
import settingsModal from '../../settings_modals/Budgets.vue'
import plannedSettingsModal from '../../settings_modals/planned/Budgets.vue'

export default {
  components: {
    'edit-modal': EditModal,
    'planned-settings-modal': plannedSettingsModal,
    'settings-modal': settingsModal
  },
  props: {
    type: {
      type: String,
      default: 'project'
    }
  },

  data() {
    return {
      fProps: {
        'items-per-page-options': [5, 10, 25, 100, { text: 'All', value: -1 }]
      },
      isAdmin: true,
      showSettings: false,
      projectRef: db.collection('cpm_projects').doc(this.$route.params.id),
      headers: [
        {
          text: this.$t('cpm.projects.budgetPanel.budgetName'),
          value: 'title'
        },
        { text: this.$t('cpm.projects.budgetPanel.active'), value: 'active' },
        { text: this.$t('cpm.projects.budgetPanel.status'), value: 'status' },
        { text: this.$t('cpm.projects.budgetPanel.type'), value: 'type' },
        {
          text: this.$t('cpm.projects.budgetPanel.planBudget'),
          value: 'plan'
        },
        {
          text: this.$t('cpm.projects.budgetPanel.totalBudget'),
          value: 'total'
        },
        {
          text: this.$t('general.actions'),
          value: 'title',
          sortable: false
        }
      ],
      budgets: [],
      editModalOpen: false,
      budgetToEdit: {},
      showBudgetDeleteModal: false,
      showPlannedSettings: false,
      budgetToDelete: {},
      showLoading: false
    }
  },

  firestore() {
    return {
      budgets: db
        .collection('cpm_projects')
        .doc(this.$route.params.id)
        .collection('budgets')
        .orderBy('title')
    }
  },

  computed: {
    planBudget() {
      return this.budgets
        .map(b => b.plan)
        .filter(p => p)
        .reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
    },

    totalBudget() {
      return this.budgets
        .map(b => b.total)
        .filter(p => p)
        .reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
    },

    dropdownOptions() {
      return [
        {
          icon: 'mdi-eye',
          title: this.$t('general.show'),
          event: 'edit'
        },
        {
          icon: 'mdi-delete',
          title: this.$t('general.delete'),
          event: 'delete'
        }
      ]
    }
  },

  methods: {
    updateBudgetInformation() {
      return new Promise(async (resolve, reject) => {
        try {
          await this.axios.post(
            `${process.env.VUE_APP_FIREBASE_APIURL}/api/projects/${this.$route.params.id}/update-budgets`
          )
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },

    editBudget(budget) {
      this.budgetToEdit = budget
      this.editModalOpen = true
    },

    deleteBudget(budget) {
      this.checkBeforeDelete(budget).then(
        () => {
          this.budgetToDelete = budget
          this.showBudgetDeleteModal = true
        },
        () => {}
      )
    },

    cancelDelete() {
      this.showBudgetDeleteModal = false
      this.budgetToDelete = {}
    },

    checkBeforeDelete(budget) {
      // BEFORE DELETE THE BUDGET WE HAVE TO CHECK IF THE LINE ITEMS HAVE A BUDGET CATEGORY USED BY COMMITMENTS OR SPENDINGS,
      // IF THEY HAVE, THE USER CANNOT DELETE THE BUDGET
      return new Promise((resolve, reject) => {
        db.collection('cpm_projects')
          .doc(this.$route.params.id)
          .collection('budgets')
          .doc(budget.id)
          .collection('lineItems')
          .get()
          .then(
            budgetSnap => {
              if (budgetSnap.empty) {
                resolve()
              } else {
                budgetSnap.docs.forEach(doc => {
                  this.checkLineItems(doc.data()).then(
                    () => {
                      resolve()
                    },
                    error => {
                      reject(error)
                    }
                  )
                })
              }
            },
            error => {
              reject(error)
            }
          )
      })
    },

    checkLineItems(lineItem) {
      // IN THIS METHOD WE CHECK IF THE 'costCodeText' IS BEING USED BY A COMMITMENT OR SPENDING

      return new Promise((resolve, reject) => {
        const costCodeText = lineItem.costCodeNumber
          ? `${lineItem.costCodeNumber} - ${lineItem.budgetCategory}`
          : lineItem.budgetCategory

        db.collection('cpm_projects')
          .doc(this.$route.params.id)
          .collection('spendings')
          .where('costCodeText', '==', costCodeText)
          .get()
          .then(
            spendingsSnap => {
              if (spendingsSnap.empty) {
                db.collection('cpm_projects')
                  .doc(this.$route.params.id)
                  .collection('commitments')
                  .where('costCodeText', '==', costCodeText)
                  .get()
                  .then(
                    commitmentsSnap => {
                      if (commitmentsSnap.empty) {
                        resolve()
                      } else {
                        this.$snotify.error(
                          this.$t('cpm.projects.budgetPanel.bugetError'),
                          this.$t('alerts.error')
                        )
                        reject()
                      }
                    },
                    error => {
                      reject(error)
                    }
                  )
              } else {
                this.$snotify.error(
                  this.$t('cpm.projects.budgetPanel.bugetError'),
                  this.$t('alerts.error')
                )
                reject()
              }
            },
            error => {
              reject(error)
            }
          )
      })
    },

    submitDelete() {
      const budget = this.budgetToDelete
      this.showLoading = true

      db.collection('cpm_projects')
        .doc(this.$route.params.id)
        .get()
        .then(snap => {
          const project = snap.data()
          this.deleteFiles(budget, project)
            .then(() => {
              this.projectRef
                .collection('budgets')
                .doc(budget.id)
                .delete()
                .then(() => {
                  this.$snotify.success(this.$t('cpm.projects.budgetPanel.successDelete'), this.$t('alerts.success'))
                  this.showBudgetDeleteModal = false
                  this.updateBudgetInformation()
                  this.showLoading = false
                  this.budgetToDelete = false
                })
                .catch(error => {
                  this.showLoading = false
                  console.log(error)
                })
            })
            .catch(error => {
              this.showLoading = false
              console.log(error)
            })
        }).catch(error => {
          this.showLoading = false
          console.log(error)
        })
    },

    deleteFiles(budget, project) {
      const aux = new Promise((resolve, reject) => {
        try {
          if (!this.$h.dg(project, 'files', false)) {
            resolve(true)
            return
          }
          const indexFolder = project.files[1].children[3].children.findIndex(
            folderAux => folderAux.name === budget.title
          )

          if (indexFolder < 0) {
            resolve(true)
          }

          const folder = project.files[1].children[3].children[indexFolder]

          // Deleting files in storage
          this.deleteFilesFromStorage(folder.children).then(() => {
            project.files[1].children[3].children = project.files[1].children[3].children.filter(
              (elementAux, index) => indexFolder !== index
            )

            this.$nextTick(() => {
              // Update Files in project
              db.collection('cpm_projects')
                .doc(this.$route.params.id)
                .update({ files: project.files })
                .then(() => {
                  resolve(true)
                })
            })
          })
        } catch (error) {
          reject(error)
        }
      })

      return aux
    },

    deleteFilesFromStorage(folderElements = []) {
      const aux = new Promise((resolve, reject) => {
        try {
          folderElements.map(element => {
            this.deleteFileFromStorage(element).then(() => {})
          })

          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },

    deleteFileFromStorage(element) {
      const aux = new Promise((resolve, reject) => {
        try {
          storage
            .ref(element.path)
            .delete()
            .then(() => {
              resolve(true)
            })
            .catch(error => {
              reject(error)
            })
        } catch (error) {
          reject(error)
        }
      })
      return aux
    },

    createNewBudget() {
      const newBudgetData = {
        active: true,
        createdAt: new Date(),
        title: this.$t('cpm.projects.budgetPanel.newBudget')
      }

      db.collection('cpm_projects')
        .doc(this.$route.params.id)
        .collection('budgets')
        .add(newBudgetData)
        .then(
          function (docRef) {
            const budgetCreated = newBudgetData
            budgetCreated.id = docRef.id

            this.editBudget(budgetCreated)
          }.bind(this)
        )
        .catch(function () {})
    },
    openSettingModal() {
      if (this.type === 'forecasted') {
        this.showPlannedSettings = true
      } else {
        this.showSettings = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cpm-panel {
  margin-bottom: 0.625rem;
}

.card-container {
  padding: 0.9375rem;
  max-height: 30rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.dependency-details {
  line-height: 1.2;

  p:first-child {
    font-size: 1rem;
  }

  font-size: 0.75rem;
}
</style>

<template>
  <m6-card-dialog
    :title="`${$t('cpm.bulletins')} ${$t('general.beta')}`"
    @fullscreen="checkFullScreen"
  >
    <template v-slot:after:title>
      <v-tooltip
        v-if="$route.name === 'cpm.projects.show'"
        left
      >
        <template v-slot:activator="{ on }">
          <a
            class="pointer pr-1"
            :href="
              '/m6apps#/cpm/projects/' +
                $route.params.id +
                '/fullscreen/financial-changes'
            "
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
        @click="showCreate = true"
      >
        mdi-plus
      </v-icon>

      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-icon
            v-if="isAdmin"
            class="cursor"
            color="white"
            v-on="on"
            @click="showSettings = true"
          >
            mdi-cog
          </v-icon>
        </template>
        <span>Settings</span>
      </v-tooltip>
    </template>

    <v-row
      justify="end"
    >
      <v-chip
        color="transparent"
        disabled
        text-color="black"
      >
        {{ $t('cpm.bulletinTotal') }}
        {{ $h.dg(project, 'totals.changesTotal', 0) | currency }}
      </v-chip>
    </v-row>

    <div
      v-if="loading"
      class="text-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        :size="32"
      />
    </div>

    <v-data-table
      :headers="headers"
      height="inherit"
      :items="changes"
      :pagination.sync="pagination"
      :rows-per-page-items="rowsPerPage"
    >
      <template v-slot:items="props">
        <td class="text-sm-left">
          <a href="#">{{ props.item.number }}</a>
        </td>
        <td class="text-sm-left">
          {{ props.item.title }}
        </td>
        <td class="text-sm-left">
          {{ props.item.costCodeText }}
        </td>
        <td class="text-right">
          {{ props.item.amount | currency }}
        </td>
        <td class="text-sm-left">
          {{ $h.dg(props, 'item.reason.name') }}
        </td>
        <td class="text-sm-left">
          {{ props.item.status }}
        </td>
        <td class="text-sm-left">
          {{ props.item.forecast ? 'Yes' : 'No' }}
        </td>
        <td class="text-center">
          <m6-dropdown-actions
            :options="dropdownOptions"
            @delete="showDeleteModal(props.item)"
            @edit="showEditModal(props.item)"
          />
        </td>
      </template>
    </v-data-table>

    <financial-change-modal
      v-if="showEdit"
      :change-id="changeToEdit.id"
      :is-create="false"
      :show="showEdit"
      @close="cancelModal"
    />
    <financial-change-modal
      v-if="showCreate"
      :is-create="true"
      :show="showCreate"
      @close="cancelModal"
    />
    <m6-confirm-delete
      :message="$t('cpm.confirmDeleteBulletinMessage')"
      :show="showDelete"
      :title="$t('cpm.confirmDeleteBulletinTitle')"
      @cancel="cancelModal"
      @confirm="submitDelete"
    />
    <m6-loading :loading="saving" />

    <settings-modal
      v-if="showSettings"
      :show="showSettings"
      @close="showSettings = false"
    />
  </m6-card-dialog>
</template>

<script>
import { db, storage } from '@/utils/Firebase'

import FinancialChange from '../modals/FinancialChange'
import settingsModal from '../settings_modals/FinancialChanges.vue'

export default {
  name: 'FinancialChanges',
  components: {
    'financial-change-modal': FinancialChange,
    'settings-modal': settingsModal
  },

  data() {
    return {
      showSettings: false,
      isAdmin: true,
      projectRef: db.collection('cpm_projects').doc(this.$route.params.id),
      project: {},
      showForm: false,
      changes: [],
      changeId: '',
      loading: false,
      headers: [
        { text: this.$t('cpm.bulletinNumber'), value: 'number' },
        { text: 'Title', value: 'title' },
        { text: 'Budget Category', value: 'costCodeText' },
        { text: 'Amount', value: 'amount' },
        { text: 'Reason Code', value: 'reason.name' },
        { text: 'Status', value: 'status' },
        { text: 'Forecast', value: 'forecast' },
        { text: 'Actions', value: 'number', sortable: false }
      ],
      showEdit: false,
      changeToEdit: {},
      changeToDelete: {},
      showDelete: false,
      showCreate: false,
      saving: false,
      fullscreen: false,
      pagination: { rowsPerPage: 3 },
      rowsPerPage: [3]
    }
  },

  computed: {
    dropdownOptions() {
      return [
        {
          icon: 'edit',
          title: this.$t('general.edit'),
          event: 'edit'
        },
        {
          icon: 'delete',
          title: this.$t('general.delete'),
          event: 'delete'
        }
      ]
    }
  },

  firestore() {
    return {
      changes: this.projectRef.collection('changes').orderBy('title'),
      project: db.collection('cpm_projects').doc(this.$route.params.id)
    }
  },
  watch: {
    fullscreen: function (v) {
      this.pagination.rowsPerPage = v ? 100 : 3
      this.rowsPerPage = v ? [10, 50, 100] : [3]
    }
  },
  methods: {
    checkFullScreen(value) {
      this.fullscreen = value
    },
    updateFinancialChangesInformation() {
      return new Promise(async (resolve, reject) => {
        try {
          await this.axios.post(
            `${process.env.VUE_APP_FIREBASE_APIURL}/api/projects/${this.$route.params.id}/update-changes`
          )
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    showEditModal(change) {
      this.showEdit = true
      this.changeToEdit = change
    },

    cancelModal(updateChangesInformation = false) {
      this.showEdit = false
      this.showDelete = false
      this.showCreate = false
      this.changeToEdit = {}
      this.changeToDelete = {}
      if (updateChangesInformation) {
        this.updateFinancialChangesInformation()
      }
    },

    showDeleteModal(change) {
      this.showDelete = true
      this.changeToDelete = change
    },

    submitDelete() {
      const change = this.changeToDelete
      this.saving = true
      const path = this.project.files[1].children[4].path + '/' + change.id
      this.projectRef
        .collection('changes')
        .doc(change.id)
        .delete()
        .then(() => {
          const folder = this.project.files[1].children[4].children.find(
            dir => dir.path === path
          )
          folder.children.forEach(c => {
            storage
              .ref(c.path)
              .delete()
              .catch(error => {
                this.saving = false
                this.cancelModal()
                this.$snotify.error(
                  'There was an error deleteing the files',
                  'Error'
                )
                console.error(`file delete error occured: ${error}`)
              })
          })

          const idx = this.project.files[1].children[4].children.indexOf(folder)
          this.project.files[1].children[4].children.splice(idx, 1)
          db.collection('cpm_projects')
            .doc(this.$route.params.id)
            .update({
              files: this.project.files
            })
          this.$snotify.success('The Change has been deleted', 'Success')
          this.updateFinancialChangesInformation()
        })
        .then(() => {
          this.saving = false
          this.cancelModal()
        })
        .catch(() => {
          this.saving = false
          this.cancelModal()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>

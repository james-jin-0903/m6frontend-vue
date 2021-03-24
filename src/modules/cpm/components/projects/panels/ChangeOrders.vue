<template>
  <m6-card-dialog :title="`${$t('cpm.changeOrders')} ${$t('general.beta')}`">
    <template v-slot:after:title>
      <v-icon
        class="cursor"
        light
        @click="showCreate = true"
      >
        mdi-plus
      </v-icon>
    </template>

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
      :items="changeOrders"
      :pagination.sync="pagination"
      :rows-per-page-items="rowsPerPage"
    >
      <template v-slot:items="props">
        <td class="text-sm-left">
          {{ props.item.number }}
        </td>

        <td class="text-sm-left">
          {{ props.item.firm }}
        </td>

        <td class="text-sm-left">
          {{ props.item.preparedBy }}
        </td>

        <td class="text-sm-left">
          {{ props.item.approvedBy }}
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

    <create-modal
      v-if="showCreate"
      :is-create="true"
      :show="showCreate"
      @close="cancelModal"
    />

    <create-modal
      v-if="showEdit"
      :change-id="changeToEdit.id"
      :is-create="false"
      :show="showEdit"
      @close="cancelModal"
    />

    <m6-confirm-delete
      :message="$t('cpm.confirmDeleteChangeOrderMessage')"
      :show="showDelete"
      :title="$t('cpm.confirmDeleteChangeOrder')"
      @cancel="cancelModal"
      @confirm="submitDelete"
    />

    <m6-loading :loading="showLoading" />
  </m6-card-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'
import ChangeOrdersCreateModal from '../modals/ChangeOrdersCreateModal'

export default {
  name: 'ChangeOrders',
  components: {
    'create-modal': ChangeOrdersCreateModal
  },

  data() {
    return {
      projectRef: db.collection('cpm_projects').doc(this.$route.params.id),
      project: {},
      showLoading: false,
      loading: false,
      showCreate: false,
      showEdit: false,
      changeToEdit: {},
      changeOrders: [],
      changeToDelete: {},
      showDelete: false,
      headers: [
        { text: this.$t('cpm.projects.changeOrderNumber'), value: 'number' },
        { text: 'Firm', value: 'firm' },
        { text: 'Prepared by', value: 'preparedBy' },
        { text: 'Approved by', value: 'approvedBy' },
        { text: 'Actions', value: 'number', sortable: false }
      ],
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
      changeOrders: this.projectRef
        .collection('change_orders')
        .orderBy('number'),
      project: db.collection('cpm_projects').doc(this.$route.params.id)
    }
  },
  methods: {
    cancelModal() {
      this.showCreate = false
      this.showEdit = false
      this.showDelete = false
      this.changeToEdit = {}
      this.changeToDelete = {}
    },
    showEditModal(change) {
      this.showEdit = true
      this.changeToEdit = change
    },

    showDeleteModal(change) {
      this.showDelete = true
      this.changeToDelete = change
    },

    submitDelete() {
      const change = this.changeToDelete
      this.showLoading = true

      this.projectRef
        .collection('change_orders')
        .doc(change.id)
        .delete()
        .then(() => {})
        .then(() => {
          this.showLoading = false
          this.cancelModal()
        })
        .catch(() => {
          this.showLoading = false
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

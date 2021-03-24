<template>
  <div
    class="max-h-55vh vertical-scroll"
  >
    <v-data-table
      :header-props="{ sortIcon: null }"
      :headers="tableHeaders"
      :items="items"
      :items-per-page="5"
      mobile-breakpoint="0"
    >
      <template v-slot:item.image="{ item }">
        <div class="d-flex justify-center">
          <img
            v-if="item.image"
            :alt="item.title"
            class="standard-image"
            :src="item.image"
          >
          <v-icon
            v-else
            size="60"
          >
            mdi-store
          </v-icon>
        </div>
      </template>
      <template v-slot:item.app_prefix="{ item }">
        {{ item.app.title }}
      </template>
      <template v-slot:item.title="{ item }">
        <p>
          <router-link
            class="router-link"
            :to="{ name: 'record.show', params: { id: item.id } }"
          >
            {{ item.title }}
          </router-link>
        </p>
      </template>
      <template v-slot:item.author="{ item }">
        {{ getAuthor(item.author) }}
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ new Date(item.created_at).getMonth() + 1 + '/' + new Date(item.created_at).getDate() + '/' + new Date(item.created_at).getFullYear() }}
      </template>
      <template v-slot:item.type="{ item }">
        <div
          v-for="(valueItem, index) in tableHeaders.slice(11, tableHeaders.length - 1)"
          :key="index"
        >
          <component
            :is="valueComponentName(valueItem.type)"
            :app-value="item[valueItem.value]"
          />
        </div>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn
          color="blue"
          fab
          icon
          x-small
          @click="editRecord(item)"
        >
          <v-icon>mdi-lead-pencil</v-icon>
        </v-btn>
        <v-btn
          color="red"
          fab
          icon
          x-small
          @click="deletingRecord(item)"
        >
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <m6-loading :loading="loading" />
    <m6-confirm-delete
      message="Are you sure you want to delete this record?"
      :show="showDeleteDialog"
      title="Delete Current Record"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import AppFieldValueAttachment from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueAttachment'
import AppFieldValueAutocomplete from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueAutocomplete'
import AppFieldValueAutocompleteAddress from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueAutocompleteAddress'
import AppFieldValueBoolean from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueBoolean'
import AppFieldValueNumber from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueNumber'
import AppFieldValuePeople from '@/components/Shared/RecordTypes/ViewMode/AppFieldValuePeople'
import AppFieldValueReferenced from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueReferenced'
import AppFieldValueReferencedApp from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueReferencedApp'
import AppFieldValueText from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueText'
import AppFieldValueTimestamp from '@/components/Shared/RecordTypes/ViewMode/AppFieldValueTimestamp'
import DeleteDialog from '@/components/Dialogs/DeleteDialog'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'RecordsTableIndex',
  components: {
    AppFieldValueAttachment,
    AppFieldValueAutocomplete,
    AppFieldValueAutocompleteAddress,
    AppFieldValueBoolean,
    AppFieldValueNumber,
    AppFieldValuePeople,
    AppFieldValueReferenced,
    AppFieldValueReferencedApp,
    AppFieldValueText,
    AppFieldValueTimestamp,
    DeleteDialog
  },
  props: {
    items: {
      type: Array,
      default: () => ([])
    },
    tableHeaders: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    showDeleteDialog: false,
    loading: false,
    selectedRecordID: 0
  }),

  computed: {
    ...mapGetters('Companies', {
      currentCompanyUsers: 'getCurrentCompanyUsers'
    })
  },

  methods: {
    ...mapActions('AppBuilder', {
      deleteRecord: 'deleteRecord'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    getAuthor(id) {
      const res = this.currentCompanyUsers.find(u => this.$h.dg(u, 'user.id', '') === id)
      return this.$h.dg(res, 'user.firstName', '') + ' ' + this.$h.dg(res, 'user.lastName', '')
    },
    editRecord(recordItem) {
      this.$router.push(`/record/${recordItem.id}`)
    },
    deletingRecord(recordItem) {
      this.selectedRecordID = recordItem.id
      this.showDeleteDialog = true
    },
    async confirmDelete() {
      this.showDeleteDialog = false

      try {
        this.loading = true
        await this.deleteRecord(this.selectedRecordID)
        this.notifSuccess('The record was deleted')
        this.$router.go()
        this.loading = false
      } catch (e) {
        this.loading = false
        this.notifDanger('There was an error while deleting the Record')
      }
    },
    cancelDelete() {
      this.showDeleteDialog = false
    },
    valueComponentName(type) {
      switch (type) {
        case 'timestamp':
          return 'app-field-value-timestamp'
        case 'people':
          return 'app-field-value-people'
        case 'autocomplete':
          return 'app-field-value-autocomplete'
        case 'attachment':
          return 'app-field-value-attachment'
        case 'boolean':
          return 'app-field-value-boolean'
        case 'number':
          return 'app-field-value-number'
        case 'text':
          return 'app-field-value-text'
        case 'autocomplete-address':
          return 'app-field-value-autocomplete-address'
        case 'referencedToApp':
          return 'app-field-value-referenced-app'
        case 'referenced':
          return 'app-field-value-referenced'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.standard-image {
  height: 3rem;
  width: auto;
}
.router-link {
  text-decoration: none;
}
.full-width-table {
  min-width: 1200px;
  max-width: none;
}
.overflow-x-scroll {
  overflow-x: scroll;
}
</style>

<style lang="scss">
.full-width-table .v-data-footer {
  justify-content: flex-start;
}
.max-h-55vh {
  max-height: 65vh;
}
</style>

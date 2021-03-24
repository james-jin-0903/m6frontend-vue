<template>
  <v-dialog
    persistent
    value="true"
    :width="800"
    @input="closeDialog"
  >
    <v-card>
      <v-card-title class="display-1 white white--text">
        <div class="relative w-full">
          <v-btn
            class="absolute left-0 pointer top-0"
            icon
          >
            <v-icon
              class="icon-close"
              light
              medium
              @click="closeDialog"
            >
              mdi-close
            </v-icon>
          </v-btn>
          <div
            class="align-center d-flex justify-center"
          >
            <p class="grey--text mb-0 text--darken-1 text-center text-h6">
              {{ $t('cpm.projects.reconciliationPanel.reconciliationStatus') }}
            </p>
          </div>
        </div>
      </v-card-title>
      <v-divider class="grey lighten-3" />
      <v-card-text class="vertical-scroll">
        <v-autocomplete
          v-model="commitment.verifiedStatus"
          class="mt-3"
          :disabled="!isManager"
          item-text="text"
          item-value="value"
          :items="verifiedStatus"
          :label="$t('cpm.projects.reconciliationPanel.reconciled')"
          outlined
        >
          <template v-slot:selection="data">
            <v-row align="center">
              <v-col class="shrink">
                <v-btn
                  :color="data.item.color"
                  fab
                  readonly
                  :size="25"
                  small
                />
              </v-col>
              <v-col class="grow">
                {{ data.item.text }}
              </v-col>
            </v-row>
          </template>
          <template v-slot:item="data">
            <v-row align="center">
              <v-col class="shrink">
                <v-btn
                  :color="data.item.color"
                  fab
                  readonly
                  :size="25"
                  small
                />
              </v-col>
              <v-col class="grow">
                {{ data.item.text }}
              </v-col>
            </v-row>
          </template>
        </v-autocomplete>
        <v-btn
          class="mb-2 mr-auto"
          color="primary"
          :disabled="!isManager"
          text
          @click="openCreateNote"
        >
          {{ addNoteButton }}
        </v-btn>

        <template v-if="showNoteInput">
          <v-textarea
            v-model="note"
            auto-grow
            :label="$tc('cpm.projects.reconciliationPanel.note', 2)"
            outline
            :rows="3"
          />
          <v-row class="justify-end">
            <v-col class="shrink">
              <v-btn
                color="primary"
                small
                @click="executeNote"
              >
                {{ noteAction === 'editing' ? 'Update note' : 'Add note' }}
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <v-data-table
          v-if="!showNoteInput"
          class="white"
          disable-initial-sort
          :headers="headers"
          :items="notes"
          light
        >
          <template
            slot="items"
            slot-scope="props"
          >
            <tr class="grey--text white">
              <td>
                {{ `${ $h.dg(props, 'item.user.name', '') } ${ $h.dg(props, 'item.user.lastName', '') }` }}
              </td>
              <td>
                {{ $h.dg(props, 'item.date') | monthDayYear('YYYY-MM-DD HH:mm') }}
              </td>
              <td>
                {{ $h.dg(props, 'item.note') }}
              </td>
              <td v-if="isManager">
                <v-icon
                  class="action-icon ml-0 mr-0"
                  color="#757575"
                  size="20"
                  @click="openEditNote(props.item)"
                >
                  mdi-pencil
                </v-icon>

                <v-icon
                  class="action-icon ml-0 mr-0"
                  color="#f44336"
                  size="20"
                  @click="openDeleteNote(props.item)"
                >
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          color="primary"
          :disabled="!commitment.verifiedStatus || !isManager"
          @click="save"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
    <M6Loading
      :loading="showLoading"
    />

    <m6-confirm-delete
      :message="
        $t('general.sureDeleteResource', {
          resource: this.$tc('cpm.projects.reconciliationPanel.note', 1)
        })
      "
      :show="showDeleteNoteModal"
      :title="
        $t('general.deleteResource', {
          resource: this.$tc('cpm.projects.reconciliationPanel.note', 1)
        })
      "
      @cancel="showDeleteNoteModal = false"
      @confirm="dropNote"
    />
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Reconciliation',

  props: {
    commitmentToEdit: {
      type: Object,
      default: null
    },
    isManager: {
      type: Boolean,
      default: false
    },
    verifiedStatus: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      commitment: {},
      showLoading: false,
      note: '',
      notes: [],
      showNoteInput: false,
      noteAction: 'creating',
      noteToEditDraft: {},
      showDeleteNoteModal: false
    }
  },

  computed: {
    addNoteButton() {
      if (this.showNoteInput) {
        return `- ${this.$t('general.close')}`
      } else {
        return `+ ${this.$t('cpm.projects.reconciliationPanel.addNote')}`
      }
    },
    headers() {
      const headers = [
        {
          text: this.$tc('cpm.projects.reconciliationPanel.user', 1),
          value: 'user',
          width: '20%',
          class: 'info white--text'
        },
        {
          text: this.$t('general.date'),
          value: 'date',
          width: '20%',
          class: 'info white--text'
        },
        {
          text: this.$tc('cpm.projects.reconciliationPanel.note', 2),
          sortable: false,
          width: '60%',
          class: 'info white--text'
        }

      ]

      if (this.isManager) {
        headers.push(
          {
            text: this.$t('general.actions'),
            sortable: false
          }
        )
      }

      return headers
    }
  },

  mounted() {
    if (this.commitmentToEdit) {
      this.commitment = {
        id: this.$h.dg(this.commitmentToEdit, 'id'),
        verifiedStatus: this.$h.dg(this.commitmentToEdit, 'verifiedStatus')
      }
    }
    this.fetchNotes()
  },

  methods: {
    ...mapActions('companies/cpmProjects/commitments', [
      'update'
    ]),
    ...mapActions('companies/cpmProjects/reconciliation', [
      'addNote',
      'updateNote',
      'deleteNote',
      'getNotesByCommitmentsId'
    ]),
    fetchNotes() {
      this.notes = []
      this.getNotesByCommitmentsId({
        projectId: this.$route.params.id,
        commitmentsId: [this.$h.dg(this.commitmentToEdit, 'id')]
      })
        .then(notes => {
          this.notes = this.$h.dg(notes, '0.notes', [])
        })
        .catch(console.error)
    },
    save() {
      this.showLoading = true
      this.update({
        commitment: this.commitment,
        projectId: this.$route.params.id
      })
        .then(() => {
          this.$snotify.success(this.$t('alerts.successfullyUpdated'))
          this.closeDialog({ reload: true })
        })
        .catch(error => {
          console.error(error)
          this.$snotify.error(this.$t('alerts.unexpectedError'))
        })
        .finally(() => this.showLoading = false)
    },
    closeDialog(reload) {
      this.$emit('close-dialog', reload)
    },
    getCurrentDate() {
      const date = new Date()

      return date.getTime()
    },
    saveNote() {
      this.showLoading = true
      const note = {
        note: this.note,
        user: this.$h.dg(window, 'Drupal.settings.m6_platform.user'),
        date: this.getCurrentDate()
      }
      this.addNote({
        note,
        projectId: this.$route.params.id,
        commitmentId: this.$h.dg(this.commitmentToEdit, 'id')
      })
        .then(() => {
          this.fetchNotes()
          this.$snotify.success(this.$t('alerts.successfullySaved'))
          this.showNoteInput = false
          this.note = ''
        })
        .catch(() => this.$snotify.error(this.$t('alerts.unexpectedError')))
        .finally(() => this.showLoading = false)
    },
    openCreateNote() {
      this.noteAction = 'creating'
      this.showNoteInput = true
    },
    openEditNote(noteToEdit) {
      this.noteToEditDraft = noteToEdit
      this.note = noteToEdit.note
      this.noteAction = 'editing'
      this.showNoteInput = true
    },
    executeNote() {
      if (this.noteAction === 'editing') {
        this.modernizeNote()
      } else {
        this.saveNote()
      }
    },
    modernizeNote() {
      this.showLoading = true
      const note = {
        id: this.noteToEditDraft.id,
        note: this.note
      }
      this.updateNote({
        note,
        projectId: this.$route.params.id,
        commitmentId: this.$h.dg(this.commitmentToEdit, 'id')
      })
        .then(() => {
          this.fetchNotes()
          this.$snotify.success(this.$t('alerts.successfullyUpdated'))
          this.showNoteInput = false
          this.note = ''
          this.noteToEditDraft = {}
        })
        .catch(() => this.$snotify.error(this.$t('alerts.unexpectedError')))
        .finally(() => this.showLoading = false)
    },
    openDeleteNote(noteToDelete) {
      this.noteToEditDraft = noteToDelete
      this.showDeleteNoteModal = true
    },
    dropNote() {
      this.showLoading = true
      const note = {
        id: this.noteToEditDraft.id,
        note: this.note
      }
      this.deleteNote({
        note,
        projectId: this.$route.params.id,
        commitmentId: this.$h.dg(this.commitmentToEdit, 'id')
      })
        .then(() => {
          this.fetchNotes()
          this.note = ''
          this.noteToEditDraft = {}
          this.showDeleteNoteModal = false
          this.$snotify.success(this.$t('alerts.successfullyDeleted'))
        })
        .catch(() => this.$snotify.error(this.$t('alerts.unexpectedError')))
        .finally(() => this.showLoading = false)
    }
  }
}
</script>

<style lang="scss" scoped>
  .icon-close {
    cursor: pointer;
    transition: all 0.2s ease-out;

    &:hover {
      transform: scale(1.1);
    }
  }
</style>

<template>
  <v-hover v-slot="{ hover }">
    <div class="mb-3 panel px-4 py-3 relative white">
      <div class="d-flex">
        <v-spacer />
        <v-btn
          icon
          right
          top
          @click="deletePanel"
        >
          <v-icon color="red lighten-3">
            mdi-delete
          </v-icon>
        </v-btn>
        <v-btn
          icon
          right
          top
          @click="editPanel"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </div>
      <p
        v-if="!panelEdit"
        class="font-weight-medium text-h5 w-full"
        :class="{'text-center': panel.title_pos === 2, 'text-right': panel.title_pos === 1}"
      >
        {{ panel.title }}
      </p>
      <template
        v-else
      >
        <div class="mb-3">
          <div class="d-flex">
            <v-text-field
              v-model="clonePanel.title"
              class="add-field font-weight-regular grey lighten-3 mb-1 pt-1 px-4 rounded-xl"
              label="Panel Name"
            />
          </div>
          <div class="d-flex mt-2">
            <v-text-field
              v-model="clonePanel.description"
              class="add-field font-weight-regular grey lighten-3 mb-1 pt-1 px-4 rounded-xl"
              label="Description"
            />
          </div>
          <div class="d-flex mt-2">
            <v-select
              v-model="clonePanel.title_pos"
              class="add-field font-weight-regular grey lighten-3 mb-1 pt-1 px-4 rounded-xl"
              item-text="label"
              item-value="value"
              :items="positionItems"
              label="Position"
            />
          </div>
          <div class="d-flex mt-2">
            <v-btn
              color="red"
              dark
              @click="panelEdit = false"
            >
              Cancel
            </v-btn>
            <v-btn
              class="ml-3"
              color="amber lighten-2"
              dark
              @click="copyingPanel"
            >
              Copy Panel
            </v-btn>
            <v-spacer />
            <v-btn
              color="green"
              dark
              @click="updatingPanel"
            >
              Save
            </v-btn>
          </div>
        </div>
      </template>

      <v-list>
        <draggable
          v-model="panel.fields"
          @change="onFieldMove"
          @end="drag=true"
          @start="drag=true"
        >
          <v-list-item
            v-for="field in sortedFields"
            :key="field.id"
          >
            <v-list-item-content @click="editField(field)">
              <v-list-item-title :class="(field.type === 'referenced') || field.type === 'referencedToApp' ? 'referenced-field' : ''">
                {{ field.label }}
              </v-list-item-title>
              <v-list-item-subtitle
                v-if="field.type === 'referenced'"
                class="font-italic"
              >
                Referenced Field {{ field.metadata.originalReference.label }}
              </v-list-item-subtitle>
              <v-list-item-subtitle
                v-if="field.type === 'referencedToApp'"
                class="font-italic"
              >
                Referenced App {{ field.metadata.originalReference.label }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="ma-0">
              <v-btn
                v-if="hover"
                icon
                @click="showDelete(field)"
              >
                <v-icon color="red lighten-3">
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </draggable>
        <v-list-item v-if="showTableCreator">
          <table-creator
            :table="activeAppTable"
            @close="showTableCreator = false"
            @updateTable="updatingTable"
          />
        </v-list-item>
        <template v-else>
          <v-list-item
            v-for="(table, index) in panel.tables"
            :key="`panel-table-${index}`"
          >
            <v-list-item-content @click="editingTable(table)">
              {{ table.title }}
            </v-list-item-content>
            <v-list-item-action class="ma-0">
              <v-btn
                v-if="hover"
                icon
                @click="deleteTable(table)"
              >
                <v-icon color="red lighten-3">
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>

      <div class="align-start d-flex">
        <div class="overflow-hidden w-full">
          <add-field @addNewField="addNewField" />
          <span class="blue--text"> / </span>
          <v-btn
            class="blue--text capitalize px-1"
            color="transparent"
            :disabled="showTableCreator"
            elevation="0"
            @click="createNewTable"
          >
            Add Table
          </v-btn>
        </div>
      </div>
      <field
        v-if="showFieldModal"
        :editing="editing"
        :field="activeField"
        :app-fields="appFields"
        :show="showFieldModal"
        @close="showFieldModal = false"
        @result="pushField"
      />
      <v-dialog
        v-model="showDeleteModal"
        width="500"
      >
        <delete-dialog
          :element="fieldToDelete ? 'Field' : tableToDelete ? 'Table' : 'Panel'"
          @closeDeleteModal="confirmDelete"
        />
      </v-dialog>

      <m6-loading :loading="loading" />
    </div>
  </v-hover>
</template>

<script>
import AddField from '@/components/AppBuilder/Buttons/AddField'
import Field from '@/components/AppBuilder/Modals/Field'
import DeleteDialog from '@/components/Dialogs/DeleteDialog'
import TableCreator from '@/components/AppBuilder/GenericTable'
import { mapActions, mapMutations } from 'vuex'
import { cloneDeep, inRange } from 'lodash'
import Draggable from 'vuedraggable'

export default {
  name: 'Panel',

  components: {
    DeleteDialog,
    AddField,
    Field,
    TableCreator,
    Draggable
  },

  props: {
    panel: {
      default: () => ({}),
      required: false,
      type: Object
    },
    appID: {
      type: Number,
      default: 0
    },
    appFields: Array
  },

  data() {
    return {
      showFieldModal: false,
      showDeleteModal: false,
      panelEdit: false,
      panelToDelete: null,
      clonePanel: {},
      editing: false,
      fieldToDelete: null,
      tableToDelete: null,
      activeField: {},
      defaultField: {
        // eslint-disable-next-line camelcase
        panel_id: this.panel.id,
        label: 'New Field',
        type: 'text',
        weight: 0,
        metadata: {
          options: [],
          required: false,
          position: 2,
          non_blocking: false
        },
        // eslint-disable-next-line camelcase
        referenced_field: null
      },
      loading: false,
      showTableCreator: false,
      activeAppTable: {},
      positionItems: [
        { label: 'Left', value: 0 },
        { label: 'Right', value: 1 },
        { label: 'Center', value: 2 }
      ]
    }
  },

  computed: {
    sortedFields() {
      return this.panel.fields.sort((a, b) => a.weight - b.weight)
    }
  },

  methods: {
    ...mapActions('AppBuilder', {
      updatePanel: 'updatePanel',
      moveField: 'moveField'
    }),

    ...mapActions('AppTables', {
      createAppTable: 'createTable'
    }),

    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),

    updatingTable(table) {
      this.activeAppTable = { ...table }
      this.$emit('updatingTable', table)
    },

    editingTable(table) {
      this.activeAppTable = table
      if (!this.$h.dg(this.activeAppTable, 'fields', []).length) this.activeAppTable.fields = []
      this.$nextTick(() => {
        this.showTableCreator = true
      })
    },

    async createNewTable() {
      try {
        this.loading = true
        this.activeAppTable = await this.createAppTable({
          panel_id: this.panel.id,
          title: 'New Table',
          app_id: this.appID
        })
        this.activeAppTable.fields = []
        this.$nextTick(() => {
          this.showTableCreator = true
        })
        this.loading = false
      } catch (e) {
        this.loading = false
        this.notifDanger('There was an error while creating the table')
      }
    },

    async updatingPanel() {
      try {
        this.loading = true
        await this.updatePanel(this.clonePanel)
        this.notifSuccess('Panel updated!')

        this.panelEdit = false
        this.loading = false
        this.$emit('updatePanel', this.clonePanel)
      } catch (e) {
        this.notifDanger('There was an error while updating the panel')
        this.loading = false
      }
    },

    async copyingPanel() {
      this.$emit('copyPanel', this.panel.id)
    },

    addNewField() {
      this.activeField = {
        ...cloneDeep(this.defaultField),
        weight: this.panel.fields.length
      }
      this.editing = false
      this.showFieldModal = true
    },

    editField(field) {
      this.activeField = { ...field }
      this.editing = true
      this.showFieldModal = true
    },

    showDelete(field) {
      this.showDeleteModal = true
      this.fieldToDelete = field.id
    },

    deleteTable(table) {
      this.showDeleteModal = true
      this.tableToDelete = table.id
    },

    async confirmDelete(result) {
      if (result) {
        if (this.fieldToDelete) {
          await this.$store.dispatch('AppBuilder/deleteField', this.fieldToDelete)
          const index = this.panel.fields.findIndex(field => field.id === this.fieldToDelete)
          this.panel.fields.forEach(field => {
            if (field.weight > this.panel.fields[index].weight) {
              field.weight--
            }
          })
          this.panel.fields.splice(index, 1)
        } else if (this.tableToDelete) {
          await this.$store.dispatch('AppBuilder/deleteTable', this.tableToDelete)
          const index = this.panel.tables.map(item => item.id).indexOf(this.tableToDelete)
          this.panel.tables.splice(index, 1)
        } else if (this.panelToDelete) {
          await this.$store.dispatch('AppBuilder/deletePanel', this.panelToDelete)
          this.$emit('deletePanel', this.panelToDelete)
        }
      }
      this.fieldToDelete = null
      this.tableToDelete = null
      this.panelToDelete = null
      this.showDeleteModal = false
    },

    editPanel() {
      this.panelEdit = !this.panelEdit
      this.clonePanel = { ...this.panel }
    },

    deletePanel() {
      this.showDeleteModal = true
      this.panelToDelete = this.panel.id
    },

    async pushField(pushField, copyField) {
      if (this.editing && !copyField) {
        const index = this.panel.fields.map(item => item.id).indexOf(pushField.id)
        this.panel.fields[index] = { ...pushField }
      } else {
        this.panel.fields.push(pushField)
      }
      if (copyField) {
        await this.moveField({
          id: pushField.id,
          newWeight: pushField.weight + 1
        })
      }
      this.showFieldModal = false
      this.editing = false
    },

    async onFieldMove(evt) {
      if (!evt.moved) {
        return
      }

      const ctx = evt.moved

      // Movement direction
      const dir = Math.sign(ctx.newIndex - ctx.element.weight)

      // Move items with weight between start and end to appropriate place
      const min = Math.min(ctx.element.weight, ctx.newIndex)
      const max = Math.max(ctx.element.weight, ctx.newIndex)
      this.panel.fields
        .filter(item => inRange(item.weight, min, max + 1) && item !== ctx.element)
        .forEach(item => item.weight = item.weight - dir)

      ctx.element.weight = ctx.newIndex

      // Dispatch move action
      try {
        this.loading = true
        const payload = {
          id: ctx.element.id,
          newWeight: ctx.newIndex
        }

        await this.moveField(payload)

        this.notifSuccess('Movement saved')
      } catch (e) {
        this.notifDanger('There was an error while saving move')
        return false
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.referenced-field {
  color: #0f75bc;
  font-style: italic;
}
</style>

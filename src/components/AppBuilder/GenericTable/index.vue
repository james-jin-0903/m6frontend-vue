<template>
  <div>
    <v-card>
      <v-card-text>
        <div class="ctm-rel">
          <v-text-field
            v-model="table.title"
            label="Table Title"
          />
          <div class="ctm-fixed">
            <v-row
              align="center"
              justify="end"
            >
              <v-checkbox
                v-model="addTotals"
                class="mr-2"
              >
                <template v-slot:label>
                  <span class="ctm-fs grey--text">Add Total Rows</span>
                </template>
              </v-checkbox>
              <v-checkbox
                v-model="addSubtotals"
              >
                <template v-slot:label>
                  <span class="ctm-fs grey--text">Add Subtotals</span>
                </template>
              </v-checkbox>
            </v-row>
          </div>
        </div>
        <add-field @addNewField="addNewField" />

        <v-data-table
          :headers="headers"
          :items="table.fields"
          :items-per-page="5"
        >
          <template
            v-for="h in headers"
            v-slot:[`header.${h.value}`]="{ header }"
          >
            <template v-if="h.text === 'Field Name'">
              {{ h.text }}
            </template>
            <v-tooltip
              v-else
              top
            >
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  {{ h.text }}
                </span>
              </template>
              <div class="help-text__span">
                {{ h.helperText }}
              </div>
            </v-tooltip>
          </template>
          <template v-slot:body="props">
            <draggable
              :list="table.fields"
              tag="tbody"
            >
              <template v-if="props.items.length === 0">
                <tr>
                  <td colspan="2">
                    no fields
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr
                  v-for="(row, index) in props.items"
                  :key="index"
                >
                  <td>{{ row.label }}</td>
                  <td>
                    <v-btn
                      color="green darken-1"
                      fab
                      icon
                      x-small
                      @click="editingField(row)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      color="red darken-1"
                      fab
                      icon
                      x-small
                      @click="deletingField(row)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </draggable>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="white--text"
          color="yellow darken-1"
          @click="importModal = true"
        >
          Import
        </v-btn>
        <v-btn
          class="white--text"
          color="red darken-1"
          @click="$emit('close')"
        >
          Close
        </v-btn>
        <v-btn
          class="white--text"
          color="green"
          @click="updatingTable"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>

    <field
      v-if="showFieldModal"
      :editing="editing"
      :field="activeField"
      :fields-bag="[]"
      :show="showFieldModal"
      @close="showFieldModal = false"
      @result="pushField"
    />

    <import-excel-dialog
      :showModal="importModal"
      @addFieldFromExcel="addFieldFromExcel"
      @closeImportModal="importModal = false"
    />

    <m6-loading :loading="loading" />
  </div>
</template>

<script>
import AddField from '@/components/AppBuilder/Buttons/AddField'
import Field from '@/components/AppBuilder/Modals/Field'
import { mapMutations, mapActions } from 'vuex'
import Draggable from 'vuedraggable'
import ImportExcelDialog from '../Modals/ImportExcelDialog'

export default {
  name: 'Index',
  components: {
    AddField,
    Field,
    Draggable,
    ImportExcelDialog
  },
  props: {
    table: {
      default: () => ({}),
      type: Object
    }
  },

  data: () => ({
    showFieldModal: false,
    editing: false,
    defaultField: {
      // eslint-disable-next-line camelcase
      // table_id: this.table.id,
      label: 'New Field',
      type: 'text',
      weight: 0,
      metadata: {
        options: [],
        required: false
      },
      // eslint-disable-next-line camelcase
      referenced_field: null
    },
    activeField: {},
    headers: [
      {
        text: 'Field Name',
        value: 'fieldName',
        helperText: ''
      },
      {
        text: 'Actions',
        value: 'action',
        sortable: false,
        helperText: 'Add actions to new table fields by selecting the edit pencil in the “Action” Column'
      }
    ],
    loading: false,
    fieldsOriginal: [],
    addTotals: false,
    addSubtotals: false,
    importModal: false
  }),

  watch: {
    table: {
      handler: function (val) {
        this.fieldsOriginal = [...val.fields]
        val.fields = val.fields.sort(function (a, b) {
          return a.order - b.order
        })
        this.addTotals = val.add_totals_row ? val.add_totals_row : this.addTotals
        this.addSubtotals = val.add_sub_totals ? val.add_sub_totals : this.addSubtotals
      },
      immediate: true
    }
  },

  async mounted() {
    try {
      if (this.$h.dg(this.table, 'fields', '').length) return
      const table = { ...this.table }
      table.fields = await this.getTableFields(this.table.id)
      this.$emit('updateTable', table)
    } catch (e) {
      this.notifDanger('There was an error while getting the tables\' fields')
    }
  },

  methods: {
    ...mapActions('AppBuilder', {
      deleteField: 'deleteField'
    }),

    ...mapActions('AppTables', {
      getTableFields: 'getTableFields',
      updateFieldsList: 'updateFieldsList',
      updateTable: 'updateTable'
    }),

    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),


    editingField(field) {
      this.activeField = { ...field }
      this.editing = true
      this.showFieldModal = true
    },
    async deletingField(field) {
      try {
        this.loading = true
        await this.deleteField(field.id)
        this.loading = false
        const fields = this.table.fields.filter(f => f.id !== field.id)
        const table = { ...this.table, fields }
        this.$emit('updateTable', table)
      } catch (e) {
        this.notifDanger('There was an error while deleting the field')
      }
    },
    addNewField() {
      this.activeField = { ...this.defaultField, table_id: this.table.id }
      this.$nextTick(() => {
        this.showFieldModal = true
      })
    },

    pushField(pushField) {
      if (this.editing) {
        const index = this.table.fields.map(item => item.id).indexOf(pushField.id)
        const table = { ...this.table }
        table.fields[index] = { ...pushField }
        this.$emit('updateTable', table)
      } else {
        const table = { ...this.table }
        table.fields.push(pushField)
        this.$emit('updateTable', table)
      }

      this.showFieldModal = false
      this.editing = false
    },

    async updatingTable() {
      try {
        this.loading = true
        this.table.add_totals_row = this.addTotals
        this.table.add_sub_totals = this.addSubtotals
        await this.updateTable(this.table)
        if (this.$h.dg(this.table, 'fields', []).length) {
          this.table.fields.map((f, index) => {
            f.order = index
          })
          await this.updateFieldsList({ fields: this.table.fields })
        }

        this.$emit('updateTable', this.table)
        this.loading = false
      } catch (e) {
        this.notifDanger('There was an error while updating the table')
        this.loading = false
      }
    },

    async addFieldFromExcel(fields) {
      this.loading = true
      this.importModal = false
      const postData = {
        ...this.defaultField,
        table_id: this.table.id,
        app_id: this.table.app_id,
        panel_id: this.table.panel_id,
        labels: []
      }
      fields.map(row => {
        postData.labels.push(row)
      })

      const data = await this.$store.dispatch('AppBuilder/saveFieldsFromExcel', postData)
      const table = { ...this.table }
      data.map(row => {
        table.fields.push(row)
      })
      this.$emit('updateTable', table)
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.ctm {
  &-fs {
    font-size: 14px !important;
  }

  &-rel {
    position: relative;

    .ctm-fixed {
      position: absolute;
      right: 0;
      bottom: 0;
      padding: 0 0.375rem;
    }
  }
}
.help-text__span {
  background-color: #1976d2;
  color: white;
  border-radius: 8px;
  padding: 5px 10px;
  width: 200px;
}
</style>

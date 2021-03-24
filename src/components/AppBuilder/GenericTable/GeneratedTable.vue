<template>
  <div>
    <v-data-table
      :custom-sort="customSort"
      :headers="headers"
      :items="tableDataRows"

      :items-per-page="5"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>{{ table.title }}</v-toolbar-title>
          <v-spacer />
          <v-btn
            color="primary"
            dark
            @click="addRow"
          >
            Add Row
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.title="{ item }">
        <div class="font-bold">
          {{ item.title }}
        </div>
      </template>
      <template
        v-for="(c, i) in columns"
        v-slot:[`item.${c}`]="{ item }"
      >
        <div
          v-if="isCurrencyFormat(c)"
          :class="`ma-0 pa-0 ${ item.title ? 'font-bold' : '' }`"
          :key="`table-c-${i}`"
        >
          {{ formatToCurrency(item[c], isRoundedFormat(c)) }} 
        </div>
        <div
          v-else-if="isRoundedFormat(c)"
          :key="`table-c-${i}`"
          :class="`ma-0 pa-0 ${ item.title ? 'font-bold' : '' }`"
        >
          {{ item[c].toFixed() }} 
        </div>
        <div
          v-else
          :key="`table-c-${i}`"
          :class="`ma-0 pa-0 ${ item.title ? 'font-bold' : '' }`"
        >
          {{ item[c] }} 
        </div>
      </template>
      <template v-slot:item.total="{ item }">
        <div class="font-bold">
          {{ item.total }}
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          v-if="!(item.subtotal || item.finalTotal)"
          color="green darken-2"
          fab
          icon
          x-small
          @click="editing(item)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          v-if="!(item.subtotal || item.finalTotal)"
          color="red darken-2"
          fab
          icon
          x-small
          @click="deleting(item)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog
      v-model="showFormModal"
      content-class="scrollable--height-90"
      max-width="80%"
      scrollable
    >
      <v-card>
        <v-card-title class="blue darken-2 headline white--text">
          Edit A Table Record
          <v-spacer />
          <v-btn
            dark
            fab
            icon
            @click="showFormModal = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-5">
          <form-show-generator
            :action-record="true"
            :data="currentGenericRecord"
            :fields="$h.dg(table, 'fields', [])"
            inherited-edit-mode
            :table="table"
            @closing="closing"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <m6-loading :loading="loading" />
  </div>
</template>

<script>
import FormShowGenerator from '@/components/AppBuilder/Form/FormShowGenerator'
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'GeneratedTable',
  components: {
    FormShowGenerator
  },
  props: {
    table: {
      type: Object,
      default: () => ({})
    },
    editMode: {
      type: Boolean,
      default: false
    },
    recordID: {
      type: Number,
      default: 0
    }
  },

  data: () => ({
    showFormModal: false,
    loading: false,
    tableDataRows: [],
    currentGenericRecord: {},
  }),

  computed: {
    headers() {
      const fields = [...this.table.fields]
      fields.sort(function (a, b) {
        return a.order - b.order
      })
      const headers = fields.map(f => ({ text: f.label, value: f.id }))
      if (this.table.add_totals_row) {
        headers.push({ text: 'Total', value: 'total', sortable: false })
      }
      headers.push({ text: 'Actions', value: 'actions', sortable: false })
      if (this.table.add_sub_totals || this.table.add_totals_row) {
        headers.unshift({
          text: '',
          value: 'title',
          sortable: false,
          optional: true
        })
      }
      return headers
    },

    columns() {
      const columns = this.table.fields.map(t => t.id)
      return columns
    },

    totalFormat() {
      let format = false
      this.table.fields.map(field => {
        if (field.metadata.numberOption === 'currency') {
          format = true
        }
      })
      return format
    },

    totalRoundedFormat() {
      let rounded = false
      this.table.fields.map(field => {
        if (field.metadata.isRoundedNumber === 'true') {
          rounded = true
        }
      })
      return rounded
    }
  },

  watch: {
    tableDataRows: function () {
      this.tableDataRows.forEach(row => {
        if (row.metadata)
        this.columns.forEach(column => {
          if (typeof (row[column]) === 'undefined') {
            row[column] = ''
          }
        })
        if (this.totalFormat && row.total) {
          row.total = this.formatToCurrency(row.total, this.totalRoundedFormat)
        }
      })
    }
  },

  async mounted() {
    try {
      this.tableDataRows = await this.getTableRowValues({
        tableID: this.table.id,
        recordID: this.recordID
      })
    } catch (e) {
      this.notifDanger('There was an error while getting data')
    }
  },

  methods: {
    ...mapActions('AppTables', {
      createAppTableRow: 'createAppTableRow',
      getTableRowValues: 'getTableRowValues',
      deleteTableRowByID: 'deleteTableRowByID'
    }),

    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),

    async deleting(row) {
      try {
        this.loading = true
        await this.deleteTableRowByID(row.metadata.tableRowID)
        this.tableDataRows = await this.getTableRowValues({
          tableID: this.table.id,
          recordID: this.recordID
        })
        this.loading = false
        this.notifSuccess('The row was deleted')
      } catch (e) {
        this.loading = false
        this.notifDanger('There was an error while deleting')
      }
    },

    async closing(genericData) {
      this.showFormModal = false
      const index = this.tableDataRows.map(t => this.$h.dg(t, 'metadata.tableRowID', '')).indexOf(this.$h.dg(this.currentGenericRecord, 'metadata.tableRowID', 0))
      if (index > -1) {
        this.tableDataRows[index] = {
          ...this.currentGenericRecord,
          ...genericData
        }
        this.tableDataRows = [...this.tableDataRows]
      } else {
        this.tableDataRows.push({
          ...this.currentGenericRecord,
          ...genericData
        })
      }
      this.$nextTick(() => {
        this.currentGenericRecord = {}
      })
      try {
        this.tableDataRows = await this.getTableRowValues({
          tableID: this.table.id,
          recordID: this.recordID
        })
      } catch (e) {
        this.notifDanger('There was an error while getting data')
      }
    },

    async addRow() {
      try {
        this.loading = true
        const createdTableRow = await this.createAppTableRow({
          tableId: this.table.id,
          recordId: this.recordID
        })
        this.currentGenericRecord = {
          metadata: { typesToIds: {}, tableRowID: createdTableRow.id }
        }
        this.loading = false
        this.$nextTick(() => {
          this.showFormModal = true
        })
      } catch (e) {
        this.notifDanger('There was an error while creating the row')
        this.loading = false
      }
    },

    editing(row) {
      this.currentGenericRecord = row
      this.$nextTick(() => {
        this.showFormModal = true
      })
    },

    customSort: function (items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] === 'date') {
          if (!isDesc[0]) {
            return new Date(b[index]) - new Date(a[index])
          } else {
            return new Date(a[index]) - new Date(b[index])
          }
        } else {
          if (typeof a[index] !== 'undefined') {
            if (!isDesc[0]) {
              return a[index].toLowerCase().localeCompare(b[index].toLowerCase())
            } else {
              return b[index].toLowerCase().localeCompare(a[index].toLowerCase())
            }
          }
        }
      })
      return items
    },

    isCurrencyFormat(id) {
      const currentField = this.table.fields.find(row => row.id === id)
      if (currentField.metadata.numberOption === 'currency') return true
      return false
    },

    isRoundedFormat(id) {
      const currentField = this.table.fields.find(row => row.id === id)
      if (currentField.metadata.isRoundedNumber === 'true') return true
      return false
    },

    formatToCurrency(num, rounded) {
      num = Number.isNaN(parseFloat(num)) ? 0 : num
      if (rounded) {
        return parseFloat(num).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        }).split(".")[0]
      } else {
        return parseFloat(num).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })
      }
    }
  }
}
</script>

<style>
  .v-dialog--scrollable.scrollable--height-90{
    max-height: 90%;
    position: static
  }

  .font-bold {
    font-weight: 800;
  }
</style>

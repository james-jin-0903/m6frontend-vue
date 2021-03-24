<template>
  <div>
    <v-dialog
      v-model="showTable"
      persistent
      :width="'90%'"
    >
      <v-card
        v-if="loading"
        color="primary"
        dark
      >
        <v-card-text>
          Please stand by
          <v-progress-linear
            class="mb-0"
            color="white"
            indeterminate
          />
        </v-card-text>
      </v-card>
      <v-card
        class="elevation-0"
        else
      >
        <v-card-text class="mb-10">
          <v-container class="rounded-lg">
            <v-row>
              <v-col
                cols="8"
              >
                <v-select
                  v-model="selectedField"
                  chips
                  item-text="label"
                  item-value="id"
                  :items="fieldList"
                  label="Field"
                />
              </v-col>
              <v-col
                cols="4"
              >
                <v-btn
                  class="mt-2"
                  color="blue"
                  dark
                  @click="addField"
                >
                  Add Field
                </v-btn>
              </v-col>
            </v-row>
            <v-data-table
              :disable-pagination="true"
              fixed-header
              :headers="headers"
              height="80%"
              :hide-default-footer="true"
              :items="tableItems"
            >
              <template v-slot:body="props">
                <draggable
                  :list="tableItems"
                  tag="tbody"
                >
                  <template v-if="props.items.length === 0">
                    <tr>
                      <td colspan="2">
                        No Fields
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
                          color="red"
                          text
                          @click="removeFromTable(index)"
                        >
                          <v-icon
                            small
                          >
                            mdi-delete
                          </v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                </draggable>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            text
            @click="closeModal"
          >
            Cancel
          </v-btn>
          <v-btn
            color="green"
            text
            @click="saveTable"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import axios from 'axios'
import { mapMutations } from 'vuex'

export default {
  name: 'TableView',
  components: {
    Draggable
  },
  props: {
    showTable: Boolean,
    tableItemsProp: {
      type: Array,
      default: () => []
    },
    fieldListProp: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      server: `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}`,
      loading: false,
      selectedField: null,
      fieldList: [],
      tableItems: [],
      headers: [
        {
          text: 'Field',
          align: 'start',
          sortable: true,
          value: 'label'
        },
        { text: 'Action', value: 'action' }
      ]
    }
  },
  watch: {
    tableItemsProp() {
      this.tableItems = this.tableItemsProp
    },
    fieldListProp() {
      this.fieldList = this.fieldListProp
    }
  },
  methods: {
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    closeModal() {
      this.selectedField = null
      this.$emit('hideTableModal')
    },
    removeFromTable(index) {
      this.tableItems.splice(index, 1)
    },
    addField() {
      if (this.selectedField) {
        if (this.tableItems.find(row => Number(row.id) === Number(this.selectedField))) {
          this.notifSuccess('Already added this field.')
        } else {
          this.tableItems.push(this.fieldList.find(row => Number(row.id) === Number(this.selectedField)))
        }
      }
    },
    saveTable() {
      this.loading = true
      this.tableItems.map((row, index) => {
        // eslint-disable-next-line camelcase
        row.table_index = index
        // eslint-disable-next-line camelcase
        row.show_in_table = true
      })
      axios.put(`${this.server}/api/app-builder/table-fields/update`, {
        tableItems: this.tableItems,
        appId: parseInt(this.$route.params.id)
      }).then(response => {
        if (response.data.success) {
          this.notifSuccess('Table updated.')
        } else {
          this.notifDanger('There was an error.')
        }
        this.loading = false
        this.closeModal()
      })
    }
  }
}
</script>

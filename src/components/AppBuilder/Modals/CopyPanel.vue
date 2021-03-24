<template>
  <v-dialog
    v-model="show"
    persistent
    :width="loading ? '400px' : '700px'"
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
      v-else
      class="elevation-0"
    >
      <v-card-title>
        Select Panel
      </v-card-title>
      <v-card-text class="mb-10">
        <v-container class="rounded-lg">
          <v-row style="min-height: 300px">
            <v-col cols="12">
              <treeselect
                v-model="panel"
                :disable-branch-nodes="true"
                :load-options="loadOptions"
                :multiple="false"
                :options="fieldList"
                placeholder="Panel"
                value-format="object"
              />
            </v-col>
          </v-row>
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
          color="blue"
          dark
          @click="copyPanel"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'

export default {
  name: 'CopyPanel',

  props: {
    show: {
      default: false,
      required: true,
      type: Boolean
    }
  },

  data: () => ({
    panel: null,
    loading: true,
    fieldList: []
  }),

  mounted() {
    axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/dynamic_apps/apps`)
      .then(response => {
        response.data.map(app => {
          this.fieldList.push({
            id: app.title + app.id,
            appId: app.id,
            label: app.title,
            children: null
          })
        })

        this.loading = false
      })
  },

  methods: {
    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/field/list/all`, {
          appId: parseInt(parentNode.appId),
          nested: true
        }).then(response => {
          parentNode.children = this.normalizeNested(response.data)
          callback()
        })
      }
    },

    normalizeNested(tabs) {
      return tabs.map(tab => {
        // TODO: Improve validation for fields without a panel.
        if (!tab.panels && tab.type) {
          tab.label = 'Field: ' + tab.label
          return tab
        }
        tab.label = 'Tab: ' + tab.title
        tab.id = tab.title + tab.id
        tab.children = tab.panels.map(panel => {
          panel.label = 'Panel: ' + panel.title
          panel.panel_id = panel.id
          panel.id = panel.title + panel.id
          return panel
        })
        return tab
      })
    },

    copyPanel() {
      this.$emit('copy', this.panel)
    },

    closeModal() {
      this.$emit('close')
    }
  }
}
</script>

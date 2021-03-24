<template>
  <v-dialog
    v-model="show"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">
          {{ $t('cpm.projects.titleDestination') }}
        </span>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-card-text class="vertical-scroll">
        <v-container class="rounded-lg">
          <v-row justify="space-between">
            <v-col>
              <v-treeview
                activatable
                hoverable
                item-key="path"
                :items="$h.dg(project, 'files.children', project.files || [])"
              >
                <template
                  slot="prepend"
                  slot-scope="{ item }"
                >
                  <v-icon
                    v-if="!item.file"
                    color="blue"
                  >
                    mdi-folder
                  </v-icon>
                </template>

                <template
                  slot="label"
                  slot-scope="{ item }"
                >
                  <span @click="selectFile(item)">{{ item.name }}</span>
                </template>
                <template
                  slot="append"
                  slot-scope="{ item }"
                >
                  <v-icon
                    v-if="!item.file && !itemSelected.includes(item)"
                    color="blue"
                    @click="selectFile(item)"
                  >
                    mdi-checkbox-blank-outline
                  </v-icon>

                  <v-icon
                    v-if="!item.file && itemSelected.includes(item)"
                    color="blue"
                    @click="unselectFile(item)"
                  >
                    mdi-check-box-outline
                  </v-icon>
                </template>
              </v-treeview>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col
            class="d-flex justify-end px-6"
            cols="12"
          >
            <v-btn
              text
              @click="$emit('close')"
            >
              {{ $t('general.cancel') }}
            </v-btn>
            <v-btn
              class="blue ml-2"
              color="white"
              text
              @click="selectFolder"
            >
              {{ $t('general.selectFolder') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  props: {
    project: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      itemSelected: []
    }
  },
  methods: {
    selectFile(item) {
      this.itemSelected.push(item)
    },
    unselectFile(item) {
      const index = this.itemSelected.indexOf(item)
      if (index !== -1) {
        this.itemSelected.splice(index, 1)
      }
    },
    selectFolder() {
      if (!this.itemSelected.length) {
        this.$snotify.error(this.$t('cpm.projects.selectOneOrMore'), this.$t('alerts.error'))
      } else {
        this.$emit('onDestinationSelected', this.itemSelected)
      }
    }
  }
}
</script>


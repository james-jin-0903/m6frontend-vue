<template>
  <!--  APP BUILDER -->
  <div>
    <v-row>
      <v-col md="4">
        <v-row>
          <v-col md="6">
            <m6-upload
              btn-button="purple"
              @loading="loading = !loading"
            >
              <v-icon>mdi-cloud-upload</v-icon>
            </m6-upload>
          </v-col>
          <v-col md="6">
            <v-text-field label="Title" />
            <v-autocomplete

              label="Status"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        class="xs"
      >
        Information


        <template v-for="(item, index) in orderedFields">
          <v-card
            :key="item.index"
            class="my-1"
          >
            <v-form
              :ref="`fields${index}`"
              @submit.prevent
            >
              <v-card-text>
                <v-text-field
                  v-model="item.label"
                  label="Field Name"
                />
                <v-autocomplete
                  v-model="item.type"
                  item-text="label"
                  item-value="value"
                  :items="types"
                  label="Field Type"
                />

                <v-divider class="my-2" />
                <h3>
                  Options
                </h3>
                <template v-if="item.type === 'timestamp'">
                  <v-select
                    v-model="item.metadata.format"
                    :items="dateFormats"
                    label="Format"
                  />
                </template>
                <template v-if="item.type === 'autocomplete'">
                  <v-text-field
                    v-model="item.metadata.max"
                    label="Max Values"
                    value="1"
                  />
                  <v-text-field
                    v-model="item.metadata.min"
                    label="Min Values"
                    value="1"
                  />
                  <h4 class="mb-2">
                    Options
                  </h4>
                  <template v-for="(option, optIndex) in item.metadata.options">
                    <v-text-field
                      :key="option"
                      v-model="item.metadata.options[optIndex]"
                      append-outer-icon="mdi-delete"
                      label="Option Name"
                      @click:append-outer="removeOption(optIndex, item.metadata.options)"
                    />
                  </template>
                  <v-btn
                    class="pa-0"
                    small
                    text
                    @click="item.metadata.options.push('New Option')"
                  >
                    Add Option
                  </v-btn>
                </template>
                <v-checkbox
                  v-model="item.metadata.required"
                  color="red"
                  hide-details
                  label="Required"
                  value="red"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn @click="saveField(item)">
                  Save
                </v-btn>
                <v-btn @click="deleteField">
                  Delete
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'AppBuilder',
  data() {
    return {
      dateFormats: [
        'mm/dd/YYYY',
        'mm/dd/YYYY H:m:s',
        'dd/mm/YYYY H:m:s'
      ],
      types: [
        {
          label: 'Text',
          value: 'text'
        },
        {
          label: 'Number',
          value: 'number'
        },
        {
          label: 'Date',
          value: 'timestamp'
        },
        {
          label: 'People',
          value: 'people'
        },
        {
          label: 'Multiple Choice',
          value: 'autocomplete'
        },
        {
          label: 'Yes / No',
          value: 'boolean'
        }
      ],
      fields: [
        {
          label: 'New Field',
          type: 'autocomplete',
          position: 0,
          metadata: {
            options: []
          }
        },
        {
          label: 'New Field 2',
          type: 'text',
          position: 1,
          metadata: {
            options: []
          }
        }
      ]
    }
  },
  computed: {
    orderedFields() {
      return [...this.fields].sort((a, b) => a.position - b.position)
    }
  },
  methods: {
    deleteField() {},
    removeOption(index, item) {
      item.splice(index, 1)
    },
    saveField(field) {
      this.$store.dispatch('AppBuilder/saveField', field)
    },
    confirmDelete(field) {
      this.$store.dispatch('AppBuilder/deleteField', field.id)
    }
  }
}
</script>

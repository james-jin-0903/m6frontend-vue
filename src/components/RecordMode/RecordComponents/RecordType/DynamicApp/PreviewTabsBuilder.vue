<template>
  <v-container
    v-if="!loading"
    class="rounded-lg"
  >
    <v-card class="mb-5 rounded-lg">
      <v-card-title
        class="justify-center"
        color="indigo darken-2"
      >
        <p class="my-0">
          {{ app.title }}
        </p>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col
            v-for="(panel, ind) in panels"
            :key="`custom-panel-${ind}`"
            cols="12"
          >
            <v-card class="mx-2 my-3 rounded-lg">
              <div
                class="align-center d-flex grey--text my-2 text-caption"
                :class="colors[Math.floor(Math.random() * 10)]"
              >
                <v-divider class="blue-grey lighten-5 ml-3" />
                <p class="mx-3 my-0 text-subtitle-2 white--text">
                  {{ panel.title }}
                </p>
                <v-divider class="blue-grey lighten-5 mr-1" />
                <v-btn
                  color="white"
                  icon
                  @click="openDialog(panel)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </div>
              <v-card-text>
                <p
                  v-if="panel['description']"
                  class="my-0 pb-5 text-body-1"
                >
                  {{ panel['description'] }}
                </p>
                <div
                  v-for="(field, i) in panel.fields"
                  :key="`panel-field-${i}`"
                >
                  <p class="font-weight-light ma-0 pa-0 text-overline">
                    {{ field.label }}
                  </p>
                  <v-spacer />
                  <div v-if="field.type === 'people'">
                    <p
                      v-for="user in panel.value.values[field.id]"
                      :key="user"
                      class="ma-0 pa-0 text-subtitle-1"
                    >
                      {{ user }}
                    </p>
                  </div>
                  <div
                    v-else-if="field.type === 'autocomplete'"
                    class="ma-0 pa-0 text-subtitle-1"
                  >
                    <p
                      v-for="(value, inde) in panel.value.values[field.id]"
                      :key="inde+'-autocomplete'"
                      class="ma-0 pa-0 text-subtitle-1 w-full"
                    >
                      {{ value['value'] }}
                    </p>
                  </div>
                  <p v-else-if="field.type === 'boolean'">
                    {{ panel.value.values[field.id] ? 'Yes' : 'No' }}
                  </p>
                  <div v-else-if="field.type === 'attachment' && panel.value.values[field.id]">
                    <v-img
                      v-if="panel.value.values[field.id]['file_type'].substr(
                        0, panel.value.values[field.id]['file_type'].indexOf('/')
                      ) === 'image'"
                      height="200"
                      :src="getURL(panel.value.values[field.id]['id'])"
                      width="200"
                    />
                    <v-chip
                      v-else-if="panel.value.values[field.id]['file_type'].substr(
                        0, panel.value.values[field.id]['file_type'].indexOf('/')
                      ) === 'application'"
                      class="ma-2 white--text"
                      :color="colors[Math.floor(Math.random() * 10)]"
                      text-color="white"
                      @click="redirect(panel.value.values[field.id]['id'])"
                    >
                      <span class="white--text">
                        {{ panel.value.values[field.id]['file_name_full'] }}
                      </span>
                    </v-chip>
                  </div>
                  <p
                    v-else
                    class="ma-0 pa-0 text-subtitle-1"
                  >
                    {{ panel.value.values[field.id] }}
                  </p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog
      v-model="dialog"
      width="700"
    >
      <edit-panel-builder
        :panel="panel"
        :record="info"
      />
    </v-dialog>
  </v-container>
  <v-container
    v-else
    class="rounded-lg"
  >
    <v-progress-circular
      class="margin-center"
      color="primary"
      indeterminate
    />
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import EditPanelBuilder from '@/components/Dialogs/EditPanelBuilder.vue'

export default {
  name: 'PreviewTabsBuilder',
  components: {
    EditPanelBuilder
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    loading: false,
    panel: {},
    app: {},
    panels: [],
    colors: [
      'green',
      'blue',
      'red',
      'purple',
      'orange',
      'pink',
      'brown',
      'light-blue',
      'cyan',
      'teal',
      'amber'
    ]
  }),
  watch: {
    index: {
      async handler() {
        this.panels = []
        this.loading = true
        this.app = await this.getApp(this.info['app_id'])
        this.app = this.app.tabs[this.index]
        this.app.panels.forEach(async (tab, i) => {
          await this.setValues(tab)
          if (i === this.app.panels.length - 1) {
            this.loading = false
          }
        })
      },
      deep: true
    }
  },
  async mounted() {
    this.loading = true
    this.app = await this.getApp(this.info['app_id'])
    this.app = this.app.tabs[this.index]
    this.app.panels.forEach(async (tab, i) => {
      await this.setValues(tab)
      if (i === this.app.panels.length - 1) {
        this.loading = false
      }
    })
  },
  methods: {
    ...mapActions('AppBuilder', [
      'getApp',
      'getFieldValuesPerPanel'
    ]),
    getURL(id) {
      return `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/file/url/${id}`
    },
    openDialog(panel) {
      this.panel = panel
      this.dialog = !this.dialog
    },
    async setValues(app) {
      const data = {
        'recordID': this.info['id'],
        'panelID': app['id']
      }

      const values = await this.getFieldValuesPerPanel(data)
      const payload = {
        ...app,
        value: values
      }

      this.panels.push(payload)
    }
  }
}
</script>

<style>
.margin-center{
  margin-left: 45%!important;
}
v-chip{
  color: white!important;
}
</style>

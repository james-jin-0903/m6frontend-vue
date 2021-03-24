<template>
  <v-card
    class="group-in-border-style"
    min-height="200"
  >
    <v-card-title
      class="py-1"
      :style="`${getBackground(items[appId])};`"
    >
      <v-row
        align="center"
        justify="center"
        no-gutters
      >
        <v-col
          class="text-center"
          cols="1"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                v-bind="attrs"
                v-on="on"
              >
                <v-img
                  v-if="item.appId && items[item.appId]['icon']"
                  max-height="30"
                  max-width="30"
                  :src="items[item.appId]['icon']"
                />
                <v-img
                  v-else
                  max-width="25"
                  src="@/assets/actioncenterIcons/Assign-Task.svg"
                />
              </div>
            </template>
            <span class="help-text__span">App Logo</span>
          </v-tooltip>
        </v-col>
        <v-col cols="7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <p
                v-bind="attrs"
                class="d-block font-weight-light ma-0 pa-0 text-caption"
                v-on="on"
              >
                {{ appId ? items[appId]['tab'] : '' }}
              </p>
            </template>
            <span class="help-text__span">App Name</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-autocomplete
                v-model="activity"
                v-bind="attrs"
                auto-select-first
                class="d-block ma-0 pa-0 text-subtitle-1"
                :disabled="!appId"
                item-text="value"
                :item-value="Object"
                :items="activities"
                v-on="on"
              >
                <template #append>
                  <span />
                </template>
              </v-autocomplete>
            </template>
            <span class="help-text__span">Activity</span>
          </v-tooltip>
        </v-col>
        <v-col cols="4">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-autocomplete
                v-model="fileSelected"
                v-bind="attrs"
                class="font-weight-regular ma-0 pa-0 text-subtitle-1"
                item-text="title"
                :item-value="Object"
                :items="files"
                v-on="on"
              >
                <template v-slot:item="data">
                  <v-img
                    v-if="data.item.image"
                    max-height="20"
                    max-width="20"
                    :src="data.item.image"
                  />
                  <v-icon
                    v-else
                    size="20"
                  >
                    mdi-file
                  </v-icon>
                  <span class="ml-4">
                    {{ data.item.title }}
                  </span>
                </template>
                <template #append>
                  <span />
                </template>
              </v-autocomplete>
            </template>
            <span class="help-text__span">File Name</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text
      style="min-height: 130px;"
    >
      <form-show-generator
        :action-record="true"
        class="mt-4"
        :fields="$h.dg(panel, 'fields', [])"
        :is-from-feed-manager="true"
        :panel="panel"
        :show-standard-fields="false"
        @updating="updating"
      />
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-avatar
            v-bind="attrs"
            class="absolute align-20p opacity-5"
            size="90"
            v-on="on"
          >
            <v-img
              v-if="fileSelected && fileSelected['image']"
              :alt="fileSelected['image']"
              class="d-inline-block rounded w-full"
              max-height="100px"
              :src="fileSelected['image']"
            />
            <v-icon
              v-else
              class="d-inline-block"
              size="100"
            >
              mdi-store
            </v-icon>
          </v-avatar>
        </template>
        <span class="help-text__span">File Image</span>
      </v-tooltip>
    </v-card-text>
    <v-card-actions>
      <v-btn
        block
        @click="save"
      >
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
/* eslint-disable camelcase */
import FormShowGenerator from '@/components/AppBuilder/Form/FormShowGenerator'
import { mapActions } from 'vuex'

export default {
  name: 'CreateActivity',
  components: {
    FormShowGenerator
  },
  props: {
    file: {
      type: String,
      default: ''
    },
    app: {
      type: String,
      default: ''
    },
    applicationId: {
      type: String,
      default: ''
    },
    recordId: {
      type: Number,
      default: 0
    },
    getActivity: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    items: [],
    fileSelected: {},
    files: [],
    panel: {
      id: 0,
      tab_id: 0,
      column: 0,
      weight: 0,
      title: '',
      description: '',
      created_at: '2020-12-02T20:54:38.000000Z',
      updated_at: '2020-12-02T20:55:23.000000Z',
      title_pos: 0,
      fields: []
    },
    currentGenericRecord: {},
    item: {
      file: '',
      app: '',
      field: {}
    },
    activityData: {},
    appId: null,
    activities: [],
    activity: {},
    colors: {
      background: '#5600FF',
      text: '#1F1F1F'
    }
  }),
  watch: {
    file(value) {
      this.item.file = value
      this.getFilesByName({ name: value }).then(result => {
        this.files = result
        this.fileSelected = this.files.length ? this.files[0] : {}
        if (this.fileSelected) {
          const app = this.items.filter(r => r.id === this.fileSelected.app_id)[0]
          this.appId = this.items.indexOf(app)
        }
      })
    },
    fileSelected(value) {
      const app = this.items.filter(r => r.id === value.app_id)[0]
      this.appId = this.items.indexOf(app)
    },
    async appId(val) {
      this.panel.fields = []
      this.item.appId = val
      this.activities = await this.getAppActivitie(this.items[val].id)
      if (this.getActivity) {
        this.activity = this.activities.find(a => a.id.toString() === this.getActivity)
      }
      if (!this.files.length) {
        this.files = await this.getFilesByAppId(this.items[val].id)
        this.fileSelected = this.recordId ? this.files.filter(r => r.id === this.recordId)[0] : this.files[0]
      }
    },
    async activity(val) {
      const fields = await this.getAppFields(this.items[this.appId].id)
      const response = []

      val.fields.forEach(field => {
        response.push(fields.filter(r => r.id === field)[0])
      })

      this.panel.fields = response
    }
  },
  async mounted() {
    this.item['file'] = this.file
    this.item['app'] = this.app
    try {
      const res = await this.getAppList()
      for (let x = 0; x < res.length; x++) {
        this.items.push({
          id: res[x].id,
          index: x,
          isGeneric: true,
          tab: res[x].title,
          component: 'GenericRecord',
          image: res[x].metadata ? JSON.parse(res[x].metadata) : null,
          icon: res[x].iconLink,
          app: res[x]
        })
        if (this.applicationId && this.applicationId === res[x].id.toString()) {
          this.appId = x
        }
      }
    } catch (e) {
      return
    }
  },
  methods: {
    ...mapActions('AppBuilder', {
      getAppList: 'getAppList',
      getAppActivitie: 'getAppActivitiesById',
      getAppFields: 'getAllAppFields'
    }),
    ...mapActions('GetShortCode', [
      'getFilesByName',
      'getFilesByAppId'
    ]),
    getBackground(value) {
      try {
        const meta = JSON.parse(value['app']['metadata'])
        if (meta) {
          if (meta['background']) {
            return `background-image: url(${meta['background']}); background-attachment: fixed`
          } else {
            return `background:${meta['appIcon']['background']}`
          }
        } else {
          return `background:${this.colors.background}`
        }
      } catch (e) {
        return `background:${this.colors.background}`
      }
    },
    save() {
    },
    updating(event) {
      console.log(event)
    }
  }
}
</script>

<style lang="scss" scoped>
.align-20p{
  right: 20%;
  top: 30%;
}
input{
  padding: 0;
}
</style>

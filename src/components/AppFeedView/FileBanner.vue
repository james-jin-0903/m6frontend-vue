<template>
  <v-card
    class="group-in-border-style mx-auto"
    max-width="659"
    rounded-t
    :style="`${getBackground()};`"
  >
    <v-card-title>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          class="text-right"
          cols="12"
        >
          <v-autocomplete
            v-model="appId"
            class="d-inline-block ma-0 pa-0 text-h6 va-middle"
            item-text="text"
            item-value="id"
            :items="apps"
            :style="'max-width: 200px;'"
          >
            <template v-slot:selection="data">
              <span :style="`color: ${labelColor};`">
                {{ data.item.text }}
              </span>
            </template>
          </v-autocomplete>
          <v-img
            v-if="app.iconLink"
            class="d-inline-block va-middle"
            max-height="50"
            max-width="50"
            :src="app.iconLink"
          />
          <v-icon
            v-else
            class="d-inline-block va-middle"
            size="50"
          >
            mdi-store
          </v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text v-if="Object.keys(record).length">
      <v-row
        align="center"
        justify="center"
        no-gutters
      >
        <v-col cols="12">
          <v-avatar
            class="d-inline-block"
            size="100px"
          >
            <v-img
              v-if="record.image"
              :alt="record.image"
              class="d-inline-block rounded w-full"
              max-height="100px"
              :src="record.image"
            />
            <v-img
              v-else-if="record.iconLink"
              :alt="record.iconLink"
              class="d-inline-block rounded w-full"
              max-height="100px"
              :src="record.iconLink"
            />
            <v-icon
              v-else
              class="d-inline-block"
              :color="labelColor"
              size="100"
            >
              mdi-store
            </v-icon>
          </v-avatar>
          <div
            class="d-inline-block h-full ml-2 va-middle"
          >
            <v-autocomplete
              v-model="recordId"
              item-text="title"
              item-value="id"
              :items="app.records"
            >
              <template v-slot:selection="data">
                <span
                  class="font-weight-bold text-body-1"
                  :style="`color: ${labelColor};`"
                >
                  {{ data.item.title }}
                </span>
              </template>
            </v-autocomplete>
            <v-spacer />
            <span :style="`color: ${labelColor};`">
              {{ currentRecord.record_number }}
            </span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-else>
      <p class="ma-0 pa-0">
        No have records :c
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'FileBanner',
  props: {
    apps: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    appId: 0,
    recordId: 0,
    currentRecord: {},
    labelColor: '#fff',
    colors: {
      background: '#5600FF'
    }
  }),
  computed: {
    ...mapGetters('AppFeedView', {
      record: 'getRecord',
      app: 'getApp'
    })
  },
  watch: {
    appId(val) {
      this.getApp(val)
    },
    record(val) {
      this.recordId = val.id
      this.currentRecord = val
    }
  },
  mounted() {
    this.appId = this.app.id
    this.recordId = this.record.id
    this.currentRecord = this.record
  },
  methods: {
    ...mapActions('AppFeedView', [
      'getApp'
    ]),
    getBackground() {
      try {
        const meta = JSON.parse(this.app['metadata'])
        if (meta) {
          if (meta['background']) {
            return `background-image: url(${meta['background']}); background-attachment: fixed`
          } else if (meta['appHeader']) {
            this.labelColor = meta['appHeader']['headerTextColor']
            return `background:${meta['appHeader']['headerBackgroundColor']}`
          } else {
            return `background:${meta['appIcon']['background']}`
          }
        } else {
          this.labelColor = '#FFF'
          return `background:${this.colors.background}`
        }
      } catch (e) {
        this.labelColor = '#FFF'
        return `background:${this.colors.background}`
      }
    }
  }
}
</script>

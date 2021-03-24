<template>
  <div>
    <v-img
      v-if="metadata.background"
      max-height="100px"
      :src="metadata.background"
    >
      <div
        class="absolute d-flex justify-end w-full"
        style="top:25px; right: 25px;"
      >
        <v-img
          v-if="getImage(info)"
          alt="App Image"
          class="d-inline-block rounded w-full"
          max-height="60px"
          max-width="60px"
          :src="getImage(info)"
        />
        <v-icon
          v-else
          class="d-inline-block"
          size="40"
        >
          mdi-store
        </v-icon>
      </div>
    </v-img>
    <v-container
      class="pb-5 px-5"
      :class="{ 'pt-5': !metadata.background , 'pt-0': metadata.background }"
    >
      <div
        v-if="!metadata.background"
        class="d-flex justify-end w-full"
      >
        <v-img
          v-if="getImage(info)"
          alt="App Image"
          class="d-inline-block rounded w-full"
          max-height="60px"
          max-width="60px"
          :src="getImage(info)"
        />
        <v-icon
          v-else
          class="d-inline-block"
          size="40"
        >
          mdi-store
        </v-icon>
      </div>
      <div class="w-full">
        <v-row
          class="pl-5"
          no-gutters
          :style="'min-height: 120px; align-items: center;'"
        >
          <v-col cols="4">
            <v-badge
              avatar
              bordered
              :color="getBadgeColor()"
              offset-x="20"
              offset-y="20"
              overlap
            >
              <v-avatar size="90">
                <v-img
                  v-if="info.image"
                  :alt="info.image"
                  class="d-inline-block rounded w-full"
                  max-height="100px"
                  :src="info.image"
                />
                <v-img
                  v-else-if="info.iconLink"
                  :alt="info.iconLink"
                  class="d-inline-block rounded w-full"
                  max-height="100px"
                  :src="info.iconLink"
                />
                <v-icon
                  v-else
                  class="d-inline-block"
                  size="100"
                >
                  mdi-store
                </v-icon>
              </v-avatar>
            </v-badge>
          </v-col>
          <v-col cols="8 px-5">
            <v-row>
              <v-col
                class="custom-col"
                cols="12"
                :style="'text-overflow: ellipsis; overflow: hidden; white-space: nowrap;'"
              >
                <span class="app-title">
                  {{ info['title'] }}
                </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="custom-col"
                cols="12"
                :style="'text-overflow: ellipsis; overflow: hidden; white-space: nowrap;'"
              >
                <span class="app-number">{{ info['record_number'] }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="custom-col"
                cols="12"
                :style="'text-overflow: ellipsis; overflow: hidden; white-space: nowrap;'"
              >
                <span>{{ getFirstLabel(info) }}</span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
      <div>
        <v-row class="app-description">
          <v-col
            class="custom-col"
            cols="12"
          >
            <p class="my-0 py-0">
              {{ info.description }}
            </p>
          </v-col>
        </v-row>
        <v-row class="app-author">
          <v-col
            class="custom-col"
            cols="12"
          >
            {{ getAuthor(info.author) }}
          </v-col>
        </v-row>
        <v-row class="app-created_at">
          <v-col
            class="custom-col"
            cols="12"
          >
            {{ dateFormater(info['created_at']) }}
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DynamicAppSummary',
  components: {
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters('DynamicAppsModule', {
      apps: 'getApps'
    }),
    ...mapGetters('Companies', {
      currentCompany: 'getCurrentCompany'
    }),
    metadata() {
      if (this.info.app.metadata) {
        return JSON.parse(this.info.app.metadata)
      }
      return {}
    }
  },
  methods: {
    getAuthor(id) {
      const user = this.currentCompany.result.Users.find(i => i.id.toString() === id.toString())
      if (user) {
        return `${user.firstName} ${user.lastName}`
      }
      return ''
    },
    getFirstLabel(item) {
      const app = this.apps.find(app => app.id === item.app_id)
      if (app && app.fields.length > 0 && app.fields[0].label) {
        return app.fields[0].label
      } else {
        return ''
      }
    },
    getImage(item) {
      if (this.$h.dg(item, 'app.iconLink', false)) {
        return item.app.iconLink
      }
      return false
    },
    dateFormater(e) {
      const date = new Date(e)
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      let hour = date.getHours()
      let mins = date.getMinutes()
      let b = 'AM'
      if (hour > 12) {
        hour -= 12
        b = 'PM'
      }
      if (mins < 10) {
        mins = '0' + mins
      }
      return `${months[month]} ${day}, ${year} ${hour}:${mins} ${b}`
    },
    getBadgeColor() {
      if (this.info.status) {
        if (this.info.status.toUpperCase() === 'PUBLISHED') return 'green'
        if (this.info.status.toUpperCase() === 'GREY') return 'yellow'
        if (this.info.status.toUpperCase() === 'ARCHIVED') return 'grey'
      } else {
        return 'grey'
      }
    }
  }
}
</script>

<style scoped>
.app-title {
  text-align: left;
  font: normal normal 600 20px/24px Raleway;
  letter-spacing: 0px;
  color: #606060;
  opacity: 1;
}
.app-number {
  text-align: left;
  font: normal normal normal 16px/21px Roboto;
  letter-spacing: 0px;
  color: #404040;
  opacity: 1;
}
.app-description {
  text-align: left;
  font: normal normal normal 16px/21px Roboto;
  letter-spacing: 0px;
  color: #404040;
  padding: 10px 30px;
  opacity: 1;
}
.app-author {
  background: #F0F0F0 0% 0% no-repeat padding-box;
  border-radius: 12px;
  text-align: left;
  font: normal normal normal 12px/16px Roboto;
  letter-spacing: 0px;
  color: #404040;
  opacity: 1;
  margin: 5px 10px;
}
.app-created_at {
  background: #F0F0F0 0% 0% no-repeat padding-box;
  border-radius: 12px;
  text-align: left;
  font: normal normal normal 12px/16px Roboto;
  letter-spacing: 0px;
  color: #404040;
  opacity: 1;
  margin: 5px 10px;
}
.custom-col {
  padding: 5px 10px;
}
.height-100 {
  height: 100%;
}

@media only screen and (max-device-width: 600px) {
  .app-author,
  .app-created_at {
    display:none;
  }
}
</style>

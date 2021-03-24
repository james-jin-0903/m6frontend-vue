<template>
  <div class="my-0 px-5 py-0">
    <p
      class="blue--text font-weight-bold pointer text-subtitle-1"
      @click="redirect(recordInfo['url'])"
    >
      {{ recordInfo["url"] }}
    </p>

    <v-row
      align="center"
      class="mx-2 my-0 px-1 py-0 text-left"
      no-gutters
      style="borderLeft: thick solid rgb(238 238 238);"
    >
      <v-col cols="12">
        <div class="d-inline-block">
          <v-img
            v-if="recordInfo['image']"
            aspect-ratio="1.7"
            class="mx-1 my-0 rounded"
            height="50"
            :src="recordInfo['image']"
            width="50"
            @click="previewImage(image)"
          />
          <v-icon
            v-else
            class="mx-1 my-0"
            size="50"
          >
            mdi-store
          </v-icon>
        </div>
        <div class="d-inline-block pl-2">
          <p class="font-weight-medium my-0 py-0 text--blue-grey">
            {{ recordInfo["subtitle"] }}
          </p>
          <v-spacer />
          <p class="font-weight-medium my-0 py-0 text--blue-grey">
            {{ recordInfo["title"] }}
          </p>
        </div>
      </v-col>
      <v-col cols="12">
        <p class="font-weight-medium my-1 py-0 text--blue-grey">
          {{ type === 'message' && recordInfo["description"].length > 100
            ? recordInfo["description"].substr(0, 100)+'...' : type === 'post' && recordInfo["description"].length > 250
              ? recordInfo["description"].substr(0, 250)+'...' : recordInfo["description"] }}
        </p>
      </v-col>
      <v-card
        class="mx-5 my-7"
        :width="type === 'message' ? '100%' : '50%'"
      >
        <v-card-title
          class="font-weight-regular mx-0 pb-0 pt-3"
          :class="type === 'message' ? 'text-subtitle-1' : ''"
        >
          {{ recordInfo["panel_title"] }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              v-for="(value, index) of recordInfo['panel']"
              :key="index + '-panel'"
              cols="12"
            >
              <p class="font-weight-light my-0 py-0">
                {{ value["name"] }}
              </p>
              <v-spacer />
              <div
                v-if="value['value'] && value['value']['id']"
              >
                <v-img
                  aspect-ratio="1.7"
                  class="mx-1 my-1"
                  :src="getURL(value['value']['id'])"
                />
              </div>
              <div v-else-if="value['value'] && typeof value['value'] === 'object' && value['value'][0]['firstName']">
                <div
                  v-for="(item, index) in value['value']"
                  :key="'multi-'+index"
                >
                  <p class="d-inline-block my-0 py-0">
                    {{ `${item.firstName} ${item.lastName}` }}
                  </p>
                </div>
              </div>
              <div v-else-if="value['value'] && typeof value['value'] === 'object' && typeof value['value'][0] === 'object'">
                <div
                  v-for="(item, index) in value['value']"
                  :key="'multi-'+index"
                >
                  <p class="d-inline-block my-0 py-0">
                    {{ item.value }}
                  </p>
                </div>
              </div>
              <div v-else-if="value['value'] && typeof value['value'] === 'object' && typeof value['value'][0] === 'string'">
                <v-progress-circular
                  color="primary"
                  indeterminate
                  style="margin-left: 45%;"
                />
              </div>
              <p
                v-else
                class="my-0 py-0"
              >
                {{ value["value"] }}
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'RecordUrl',
  props: {
    recordInfo: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'post'
    }
  },
  data: () => ({
    peopleFields: {}
  }),
  mounted() {
    if (this.recordInfo.panel) {
      this.recordInfo.panel.forEach((field, index) => {
        if (field.value && typeof field.value === 'object' && typeof field.value[0] === 'string') {
          this.getUserData(field.value).then(res => {
            // eslint-disable-next-line vue/no-mutating-props
            this.recordInfo.panel[index]['value'] = res
          })
        }
      })
    }
  },
  methods: {
    ...mapActions('WorkOrderModule', {
      getUsers: 'getUsersList'
    }),
    redirect(file) {
      window.open(file, '_blank')
    },
    getURL(id) {
      return `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/file/url/${id}`
    },
    async getUserData(usersArray) {
      const res = await this.getUsers(usersArray)

      return res.data
    }
  }
}
</script>

<template>
  <v-card class="rounded-lg">
    <v-card-title class="headline">
      App Theme
    </v-card-title>
    <v-row>
      <v-col
        class="px-0"
        cols="12"
      >
        <v-tabs
          v-model="tabsPicker"
          centered
        >
          <v-tab>
            Background
          </v-tab>
          <v-tab>
            Text
          </v-tab>
          <v-tab>
            Picture
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabsPicker">
          <v-tab-item>
            <v-card
              class="rounded-lg"
              flat
            >
              <v-card-text class="d-flex justify-center">
                <sketch-picker v-model="headerBackgroundColor" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card
              class="rounded-lg"
              flat
            >
              <v-card-text class="d-flex justify-center">
                <sketch-picker v-model="headerTextColor" />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card>
              <v-card-text>
                <m6-upload
                  @loading="loading = !loading"
                  @response="uploadAppBackground">
                    <v-icon>mdi-camera-enhance-outline</v-icon>
                </m6-upload>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>

        <div
          class="align-center d-flex justify-center py-4 w-full"
        >
          <v-card
            class="mx-auto w-full"
            max-width="500"
          >
            <v-toolbar
              :color="headerBackgroundColor.hex"
            >
              <v-toolbar-title :color="headerTextColor.hex">
                <span :style="'color: ' + headerTextColor.hex + ';'">Title</span>
              </v-toolbar-title>
              <v-spacer />
            </v-toolbar>

            <v-container
              class="rounded-lg"
              fluid
            >
              <v-row dense>
                <v-col
                  v-for="i in 3"
                  :key="i"
                  :cols="12"
                />
              </v-row>
            </v-container>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="green darken-1"
        outlined
        @click="btnClick(false)"
      >
        Cancel
      </v-btn>
      <v-btn
        color="green darken-1"
        outlined
        @click="btnClick(true)"
      >
        Select
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Sketch } from 'vue-color'
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'HeaderBuilderDialog',
  components: {
    'sketch-picker': Sketch
  },
  props: {
    appColors: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    headerBackgroundColor: {
      hex: '#000'
    },
    headerTextColor: {
      hex: '#fff'
    },
    tabsPicker: 0,
    loading: false
  }),
  mounted() {
    this.headerBackgroundColor.hex = this.appColors.appHeader ? this.appColors.appHeader.headerBackgroundColor : '#000'
    this.headerTextColor.hex = this.appColors.appHeader ? this.appColors.appHeader.headerTextColor : '#fff'
  },
  methods: {
    btnClick(selected) {
      this.$emit('selectHeaderAction', selected, {
        headerBackgroundColor: this.headerBackgroundColor.hex ? this.headerBackgroundColor.hex : '#AAA',
        headerTextColor: this.headerTextColor.hex ? this.headerTextColor.hex : '#fff'
      })
    },
    async uploadAppBackground(data) {
      try {
        this.loading = true;
        if (data.ok) {
          let metadata =
            typeof this.app.metadata == "string"
              ? JSON.parse(this.app.metadata)
              : this.app.metadata;
          if (!metadata) {
            metadata = {};
          }
          metadata.background = data.data.link;
          this.app.metadata = JSON.stringify(metadata);
          await this.updateApp({ params: this.app });
          this.notifSuccess("The image was uploaded");
          this.loading = false;
        } else {
          this.loading = false;
          this.notifDanger("There was an error while uploading");
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        this.notifDanger("There was an error while uploading");
        this.loading = false;
      }
    },
    ...mapMutations("SnackBarNotif", {
      notifDanger: "notifDanger",
      notifSuccess: "notifSuccess",
    }),
    ...mapActions("AppBuilder", {
      getApp: "getApp",
      updateApp: "updateApp",
    })
  },
  computed: {
    ...mapState("AppBuilder", {
      app: "app",
    })
  }
}
</script>

<template>
  <div class="flex-space-between">
    <div
      class="align-center d-flex flex-column justify-space-between px-5 relative"
    >
      <template v-if="app.iconLink !== ''">
        <div style="display: flex">
          <v-btn color="red darken-2" dark fab x-small @click="deleteIconLink">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <img
            class="app-icon-link pr-2"
            height="60"
            :src="app.iconLink"
            style="object-fit: contain; object-position: center"
            width="60"
          />
        </div>
      </template>
      <template v-else>
        <v-avatar
          class="pointer"
          :color="iconData.background"
          size="100"
          @click="
            iconBuilderModal = true;
            iconBuilderFor = 'app';
          "
        >
          <v-icon :color="iconData.iconColor" size="60">
            {{ iconData.icon }}
          </v-icon>
        </v-avatar>
        <v-dialog v-model="iconBuilderModal" width="800">
          <icon-builder-dialog @selectIconAction="selectIconAction" />
        </v-dialog>
      </template>
      <m6-upload
        class="absolute mr-4 purple right-0 rounded-circle"
        :small="true"
        @loading="loading = !loading"
        @response="responseAppLogo"
      >
        <v-icon color="white" size="17"> mdi-pencil </v-icon>
      </m6-upload>

      <v-menu
        v-if="app.tabs && app.tabs.length > 0"
        :close-on-content-click="false"
        left
        max-width="400"
        min-width="15%"
        offset-x
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" color="indigo" dark fab small v-on="on">
            <v-icon>mdi-play-circle</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-center">
                  Manage Tabs Icon
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider />

          <v-list>
            <v-list-item v-for="(tab, index) in app.tabs" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ tab.title }}</v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn
                  class="pointer"
                  :color="
                    tab.metadata && JSON.parse(tab.metadata).iconBackgroundColor
                      ? JSON.parse(tab.metadata).iconBackgroundColor
                      : 'grey'
                  "
                  fab
                  size="30"
                  small
                  @click="
                    iconBuilderModal = true;
                    iconBuilderFor = `tab-${index}`;
                  "
                >
                  <v-icon
                    :color="
                      tab.metadata && JSON.parse(tab.metadata).iconColor
                        ? JSON.parse(tab.metadata).iconColor
                        : 'white'
                    "
                  >
                    {{
                      tab.metadata && JSON.parse(tab.metadata).iconName
                        ? JSON.parse(tab.metadata).iconName
                        : "mdi-puzzle-edit"
                    }}
                  </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>
    <v-form ref="formApp" class="px-4">
      <v-text-field
        v-model="app.title"
        class="add-field font-weight-regular lighten-3 mb-1 pt-1 px-0 rounded-xl white"
        label="App Title"
        :rules="rules.generic"
      />
      <v-text-field
        v-model="app.prefix"
        class="add-field font-weight-regular lighten-3 mb-1 pt-1 px-0 rounded-xl white"
        label="App Prefix"
        maxlength="5"
        minlength="1"
        :rules="rules.generic"
      />

      <v-btn
        class="white--text"
        color="red darken-2"
        @click="showDeleteDialog = true"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn
        class="white--text"
        color="grey darken-2"
        style="float: left"
        @click="tableView"
      >
        Table View
      </v-btn>
      <v-btn
        class="white--text"
        color="green darken-2"
        style="float: right"
        @click="updatingApp"
      >
        save
      </v-btn>

      <m6-confirm-delete
        message="Are you sure you want to delete this App?"
        :show="showDeleteDialog"
        title="Delete Current App"
        @cancel="cancelDelete"
        @confirm="confirmingDelete"
      />

      <v-dialog v-model="iconBuilderModal" width="800">
        <icon-builder-dialog @selectIconAction="selectIconAction" />
      </v-dialog>
    </v-form>

    <m6-loading :loading="loading" />

    <table-view
      :field-list-prop="fieldList"
      :show-table="showTable"
      :table-items-prop="tableItems"
      @hideTableModal="hideTableModal"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import IconBuilderDialog from "@/components/Dialogs/IconBuilderDialog";
import TableView from "@/components/AppBuilder/Modals/TableView";
import axios from "axios";

export default {
  components: {
    IconBuilderDialog,
    TableView,
  },

  data: () => ({
    server: `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}`,
    iconBuilderModal: false,
    iconBuilderFor: "app",
    rules: {
      generic: [(v) => !!v || "This field is required"],
    },
    loading: false,
    showDeleteDialog: false,
    fieldList: [],
    showTable: false,
    tableItems: [],
  }),

  computed: {
    ...mapState("AppBuilder", {
      app: "app",
      iconData: "iconData",
    }),
  },

  methods: {
    ...mapActions("File", {
      deleteFileFromS3: "deleteFileFromS3",
    }),

    ...mapActions("AppBuilder", {
      updateApp: "updateApp",
      deleteApp: "deleteApp",
      updateTab: "updateTab",
    }),

    ...mapMutations("AppBuilder", {
      setIconData: "setIconData",
    }),

    ...mapMutations("SnackBarNotif", {
      notifDanger: "notifDanger",
      notifSuccess: "notifSuccess",
    }),

    ...mapState("AppBuilder", {
      setCurrentApp: "setCurrentApp",
    }),

    async selectIconAction(selected, iconInfo) {
      this.iconBuilderModal = !this.iconBuilderModal;
      if (selected) {
        if (this.iconBuilderFor === "app") {
          this.setIconData(iconInfo);
        } else if (this.iconBuilderFor.indexOf("tab") > -1) {
          const tab_info = this.iconBuilderFor.split("-");
          const tab_index = Number(tab_info[1]);
          if (typeof this.app.tabs[tab_index] !== "undefined") {
            this.app.tabs[tab_index].metadata = JSON.stringify({
              iconName: iconInfo.icon,
              iconBackgroundColor: iconInfo.background,
              iconColor: iconInfo.iconColor,
            });
            this.setCurrentApp(this.app);
            await this.updateTab({
              tabToEdit: this.app.tabs[tab_index],
              id: this.app.tabs[tab_index].id,
            });
          }
        }
      }
    },

    tableView() {
      this.loading = true;
      axios
        .post(`${this.server}/api/app-builder/field/list/all`, {
          appId: parseInt(this.$route.params.id),
        })
        .then((response) => {
          this.fieldList = response.data;
        });
      axios
        .post(`${this.server}/api/app-builder/table-fields/get`, {
          appId: parseInt(this.$route.params.id),
        })
        .then((response) => {
          this.showTable = true;
          this.tableItems = response.data;
        });
      this.loading = false;
    },

    hideTableModal() {
      this.showTable = false;
      this.tableItems = [];
      this.fieldList = [];
    },

    async deleteIconLink() {
      try {
        this.loading = true;
        if (this.$h.dg(this.app, "iconLink", "").length) {
          const splitLink = this.app.iconLink.split("com");
          const key = splitLink[1].substr(1);

          await this.deleteFileFromS3({ key });
          this.app.iconLink = "";
          await this.updateApp({ params: this.app });
        }

        this.loading = false;
        this.notifSuccess("The image was deleted");
      } catch (e) {
        this.notifDanger("There was an error while deleting App Icon Image");
        this.loading = false;
      }
    },

    async responseAppLogo(data) {
      this.loading = true;
      if (data.ok) {
        this.app.iconLink = data.data.link;
        await this.updateApp({ params: this.app });
        this.notifSuccess("The image was uploaded");
        this.loading = false;
      } else {
        this.loading = false;
        this.notifDanger("There was an error while uploading");
      }
    },

    async updatingApp() {
      this.loading = true;
      this.$emit("closeModal");

      if (!this.$refs.formApp.validate()) {
        this.notifDanger("Please fill in all required fields");
        this.loading = false;
        return;
      }

      try {
        const metadata =
          typeof this.app.metadata == "string"
            ? JSON.parse(this.app.metadata)
            : this.app.metadata;
        if (!metadata) {
          metadata = {};
        }

        metadata.appIcon = {
          icon: this.iconData.icon,
          background: this.iconData.background,
          iconColor: this.iconData.iconColor,
        };
        const res = await this.updateApp({
          params: {
            ...this.app,
            metadata,
          },
        });
        this.loading = false;
        this.notifSuccess("Updated!");
      } catch (e) {
        this.loading = false;

        let errorMsg = "";
        if (e.response) {
          for (const i in e.response.data) {
            errorMsg += e.response.data[i][0].replace("params.", "") + "<br />";
          }
        } else {
          errorMsg = e;
        }
        this.notifDanger(errorMsg);
      }
    },

    cancelDelete() {
      this.showDeleteDialog = false;
    },

    async confirmingDelete() {
      this.showDeleteDialog = false;

      try {
        this.loading = true;
        await this.deleteApp(this.$route.params.id);
        this.loading = false;
        this.notifSuccess("The App Was Deleted");
        this.$router.push("/");
      } catch (e) {
        this.loading = false;
        this.notifDanger("There was an error, App was NOT deleted");
      }
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.flex-space-between {
  display: flex;
  justify-content: space-between;
}
</style>

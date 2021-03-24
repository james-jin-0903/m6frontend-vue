<template>
  <div>
    <div
      v-if="appLoaded"
      class="details-content grey h-fit lighten-3 mt-2 pb-5 pt-2"
      style="height: 59vh; overflow-y: auto"
    >
      <v-row
        :class="{
          'max-w-lg': !website && panelCols.columns < 4,
          'flex-column': $vuetify.breakpoint.smAndDown,
          'w-100': panelCols.columns > 3,
        }"
        class="align-start d-flex justify-space-between mx-auto pt-1 w-full"
      >
        <v-col
          class="d-flex flex-column justify-center pa-0 mb-4"
          :class="{ 'pr-1': $vuetify.breakpoint.mdAndUp }"
          :cols="panelCols.firstCol"
        >
          <draggable
            v-model="leftPanels"
            group="panel"
            @change="onPanelMove(0, $event)"
          >
            <panel
              v-for="panel in leftPanels"
              :key="panel.id"
              :app-i-d="app.id"
              :panel="panel"
              :app-fields="appFields"
              @copyPanel="copyPanel"
              @deletePanel="deletePanel"
              @updatePanel="updatePanel"
              @updatingTable="(e) => updatingTable(panel, e)"
            />
          </draggable>
          <div class="d-flex justify-center">
            <add-panel @addNewPanel="addNewPanel(0)" />
            <copy-panel @copyPanel="copyPanelFromApp(0)" />
          </div>
        </v-col>
        <template v-if="panelCols.columns > 2">
          <v-col
            class="pa-0 mb-8"
            :class="{ 'pl-1': !$vuetify.breakpoint.smAndDown }"
            :cols="
              panelCols.columns == 3 ? panelCols.secondCol : panelCols.firstCol
            "
          >
            <draggable
              v-model="leftCenterPanels"
              group="panel"
              @change="onPanelMove(2, $event)"
            >
              <panel
                v-for="panel in leftCenterPanels"
                :key="panel.id"
                :app-i-d="app.id"
                :panel="panel"
                :app-fields="appFields"
                @copyPanel="copyPanel"
                @deletePanel="deletePanel"
                @updatePanel="updatePanel"
                @updatingTable="(e) => updatingTable(panel, e)"
              />
            </draggable>
            <div class="d-flex justify-center">
              <add-panel @addNewPanel="addNewPanel(2)" />
              <copy-panel @copyPanel="copyPanelFromApp(2)" />
            </div>
          </v-col>
        </template>
        <template v-if="panelCols.columns > 3">
          <v-col
            class="pa-0 mb-8"
            :class="{ 'pl-1': !$vuetify.breakpoint.smAndDown }"
            :cols="panelCols.firstCol"
          >
            <draggable
              v-model="rightCenterPanels"
              group="panel"
              @change="onPanelMove(3, $event)"
            >
              <panel
                v-for="panel in rightCenterPanels"
                :key="panel.id"
                :app-i-d="app.id"
                :panel="panel"
                :app-fields="appFields"
                @copyPanel="copyPanel"
                @deletePanel="deletePanel"
                @updatePanel="updatePanel"
                @updatingTable="(e) => updatingTable(panel, e)"
              />
            </draggable>
            <div class="d-flex justify-center">
              <add-panel @addNewPanel="addNewPanel(3)" />
              <copy-panel @copyPanel="copyPanelFromApp(3)" />
            </div>
          </v-col>
        </template>
        <template v-if="panelCols.columns > 1 || (panelCols.columns == 1 && isHome)">
          <v-col
            v-if="isHome"
            class="pa-0 mb-8"
            :class="{ 'pl-1': !$vuetify.breakpoint.smAndDown }"
            :cols="7"
          >
            <project-social-media class="opacity-social-media" post-list-show />
          </v-col>

          <v-col
            v-else
            class="pa-0 mb-8"
            :class="{ 'pl-1': !$vuetify.breakpoint.smAndDown }"
            :cols="isHome ? panelCols.secondCol : panelCols.firstCol"
          >
            <draggable
              v-model="rightPanels"
              group="panel"
              @change="onPanelMove(1, $event)"
            >
              <panel
                v-for="panel in rightPanels"
                :key="panel.id"
                :app-i-d="app.id"
                :panel="panel"
                :app-fields="appFields"
                @copyPanel="copyPanel"
                @deletePanel="deletePanel"
                @updatePanel="updatePanel"
                @updatingTable="(e) => updatingTable(panel, e)"
              />
            </draggable>
            <div class="d-flex justify-center">
              <add-panel @addNewPanel="addNewPanel(1)" />
              <copy-panel @copyPanel="copyPanelFromApp(1)" />
            </div>
          </v-col>
        </template>
      </v-row>
    </div>

    <copy-panel-dialog
      v-if="copyPanelDialog"
      :show="copyPanelDialog"
      @copy="copyPanelFromAnotherApp"
      @close="copyPanelDialog = false"
    />

    <m6-loading :loading="loading" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Panel from "@/components/AppBuilder/Panel";
import { inRange } from "lodash";
import Draggable from "vuedraggable";
import AddPanel from "@/components/AppBuilder/Buttons/AddPanel";
import CopyPanel from "@/components/AppBuilder/Buttons/CopyPanel.vue";
import ProjectSocialMedia from "@/views/Home/ProjectSocialMedia";
import CopyPanelDialog from "@/components/AppBuilder/Modals/CopyPanel.vue";

export default {
  props: {
    showSocial: {
      type: Boolean,
      default: true,
    },
    website: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    Panel,
    Draggable,
    AddPanel,
    ProjectSocialMedia,
    CopyPanel,
    CopyPanelDialog,
  },

  data: () => ({
    loading: false,
    leftPanels: [],
    rightPanels: [],
    centerPanels: [],
    leftCenterPanels: [],
    rightCenterPanels: [],
    copySide: 0,
    copyPanelDialog: false,
  }),

  computed: {
    ...mapState("AppBuilder", {
      app: "app",
    }),

    ...mapState("Builder", {
      activeTab: "activeTab",
    }),

    appLoaded() {
      return Boolean(this.app.id);
    },

    appFields() {
      return this.app.tabs.flatMap((t) => t.panels.flatMap((p) => p.fields));
    },

    isHome() {
      return (
        this.$h
          .dg(this.app, `tabs.${this.activeTab}`, { title: "" })
          .title.toLowerCase() === "home"
      );
    },

    panelCols() {
      const fullWidth =
        this.$h.dg(this.app, `tabs.${this.activeTab}.full_width`, false) ||
        this.$vuetify.breakpoint.smAndDown;

      const columns = this.$h.dg(this.app, `tabs.${this.activeTab}.columns`, 1);

      switch (true) {
        case fullWidth:
          return { firstCol: 12, columns };
        case columns == 2:
          return { firstcol: 5, secondCol: 7, columns };
        case columns == 3:
          return { firstCol: 4, secondCol: 4, columns };
        case columns == 4:
          return { firstCol: 3, columns };
        default:
          return { firstCol: this.isHome ? 5 : 12, columns };
      }
    },
  },

  methods: {
    ...mapActions("AppBuilder", {
      movePanel: "movePanel",
    }),

    ...mapMutations("SnackBarNotif", {
      notifDanger: "notifDanger",
      notifSuccess: "notifSuccess",
    }),

    updateTabPanels() {
      const panels = this.app.tabs[this.activeTab].panels;
      const getColumnPanels = (col) =>
        panels
          .filter((i) => i.column === col)
          .sort((a, b) => a.weight - b.weight);
      this.rightPanels = getColumnPanels(1);
      this.leftPanels = getColumnPanels(0);
      this.leftCenterPanels = getColumnPanels(2);
      this.rightCenterPanels = getColumnPanels(3);
    },

    async onPanelMove(column, evt) {
      let ctx;
      if (evt.added) {
        ctx = evt.added;

        // Fix state
        this.app.tabs[this.activeTab].panels
          .filter(
            (item) => item.column === column && item.weight > ctx.newIndex
          )
          .forEach((item) => item.weight++);

        ctx.element.column = column;
        ctx.element.weight = ctx.newIndex;
      } else if (evt.removed) {
        this.app.tabs[this.activeTab].panels
          .filter(
            (item) => item.column === column && item.weight > ctx.oldIndex
          )
          .forEach((item) => item.weight--);
      } else {
        ctx = evt.moved;

        // Movement direction
        const dir = Math.sign(ctx.newIndex - ctx.element.weight);

        // Move items with weight between start and end to appropriate place
        const min = Math.min(ctx.element.weight, ctx.newIndex);
        const max = Math.max(ctx.element.weight, ctx.newIndex);
        this.app.tabs[this.activeTab].panels
          .filter(
            (item) =>
              item.column === column &&
              inRange(item.weight, min, max + 1) &&
              item !== ctx.element
          )
          .forEach((item) => (item.weight = item.weight - dir));

        ctx.element.weight = ctx.newIndex;
      }

      if (evt.moved || evt.added) {
        // Save data
        this.loading = true;
        try {
          await this.movePanel({
            id: ctx.element.id,
            newWeight: ctx.newIndex,
            newColumn: column,
          });

          this.notifSuccess("Movement successfully saved");
        } catch (e) {
          this.notifDanger("An error occurred while saving movement");
        } finally {
          this.loading = false;
        }
      }
    },

    async copyPanel(panelId) {
      this.loading = true;

      try {
        const newPanel = await this.$store.dispatch(
          "AppBuilder/copyPanel",
          panelId
        );
        const copiedIdx = this.app.tabs[this.activeTab].panels.findIndex(
          (p) => p.id === panelId
        );
        this.app.tabs[this.activeTab].panels.splice(copiedIdx + 1, 0, newPanel);
        this.updateTabPanels();
        this.notifSuccess("Panel copied successfully");
      } catch (e) {
        this.notifDanger("There was an error when copying panel");
      } finally {
        this.loading = false;
      }
    },

    deletePanel(id) {
      const index = this.app.tabs[this.activeTab].panels
        .map((item) => item.id)
        .indexOf(id);
      this.app.tabs[this.activeTab].panels.splice(index, 1);

      this.updateTabPanels();
    },

    updatePanel(data) {
      this.app.tabs[this.activeTab].panels = this.app.tabs[
        this.activeTab
      ].panels.map((p) => (p.id === data.id ? data : p));
    },

    updatingTable(panel, table) {
      const index = panel.tables?.map((t) => t.id).indexOf(table.id);
      if (index > -1) {
        panel.tables[index] = table;
      } else {
        if (panel.tables) {
          panel.tables.push(table);
        } else {
          const tables = [];
          tables.push(table);
          panel["tables"] = tables;
        }
      }

      panel.tables = [...panel.tables];
    },

    addNewPanel(side) {
      const tab = this.app.tabs[this.activeTab];
      const newPanel = {
        tabID: tab.id,
        weight: tab.panels.filter((p) => p.column === side).length,
        column: side,
        title: "New Panel",
        description: "",
        title_pos: 0,
      };

      this.$store.dispatch("AppBuilder/savePanel", newPanel).then((result) => {
        this.app.tabs[this.activeTab].panels.push(result);
        this.updateTabPanels();
      });
    },

    copyPanelFromApp(side) {
      this.copySide = side;
      this.copyPanelDialog = true;
    },

    async copyPanelFromAnotherApp(panel) {
      this.loading = true;

      try {
        const params = {
          panelId: panel.panel_id,
          column: this.copySide,
          tabId: this.app.tabs[this.activeTab].id,
        };

        const newPanel = await this.$store.dispatch(
          "AppBuilder/copyPanelFromApp",
          params
        );
        this.app.tabs[this.activeTab].panels.push(newPanel);
        this.updateTabPanels();
        this.copyPanelDialog = false;
        this.notifSuccess("Panel copied successfully");
      } catch (e) {
        console.log(e);
        this.notifDanger("There was an error when copying panel");
      } finally {
        this.loading = false;
      }
    },
  },

  watch: {
    app: {
      immediate: true,
      handler: function (val) {
        if (!val.id) return;

        this.updateTabPanels();
      },
      deep: true,
    },

    activeTab: {
      handler: function (val) {
        if (val > -1) this.updateTabPanels();
      },
    },
  },
};
</script>

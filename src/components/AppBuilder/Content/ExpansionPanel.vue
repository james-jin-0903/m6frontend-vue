<template>
  <v-expansion-panels v-model="expansionPanel" multiple>
    <v-expansion-panel
      v-for="(panel, index) in panelsByColumn($h.dg(tab, 'panels', []), column)"
      :key="`p-${index}`"
    >
      <v-expansion-panel-header disable-icon-rotate>
        <h3
          class="w-full"
          :class="{
            'text-center': panel.column === 2,
            'text-right': panel.column === 1,
          }"
        >
          {{ panel.title }}
        </h3>
        <template v-slot:actions>
          <div></div>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <panel-show
          :app-i-d="app.id"
          :active-tab="activeTab"
          :fields="$h.dg(panel, 'fields', [])"
          :helper-media-url="helperMediaURL"
          :hide-actions="true"
          :panel="panel"
          :panel-delete="panelToDelete == panel.id"
          :panel-edit-ref="panelEditId == panel.id"
          :show-standard-fields="tab.readOnly && index == 0"
          :show-title="false"
          @deletePanel="deletePanel"
          @updatePanel="updatePanel"
          @updateRecord="$emit('updateRecord', $event)"
          @updatingTable="(e) => updatingTable(panel, e)"
        />

        <div
          v-for="(table, indexTable) in $h.dg(panel, 'tables', [])"
          :key="`panel-table-${indexTable}`"
        >
          <generated-table
            edit-mode
            :record-i-d="Number($route.params.id)"
            :table="table"
          />
        </div>
        <div class="row" v-if="panelEditId != panel.id">
          <v-spacer />
          <v-btn icon right bottom @click.prevent="panelToDelete = panel.id">
            <v-icon color="red lighten-3"> mdi-delete </v-icon>
          </v-btn>
          <v-btn icon right bottom @click.prevent="panelEditId = panel.id">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

import FormShowGenerator from "@/components/AppBuilder/Form/FormShowGenerator";
import GeneratedTable from "@/components/AppBuilder/GenericTable/GeneratedTable";
import PanelShow from "@/components/AppBuilder/Content/PanelShow";

export default {
  name: "ExpansionPanel",
  components: {
    FormShowGenerator,
    GeneratedTable,
    PanelShow,
  },
  props: {
    activeTab: {
      type: Number,
      default: 0,
    },
    column: {
      type: Number,
      default: 0,
    },

    helperMediaURL: {
      type: String,
      default: "",
    },

    tab: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showDeleteModal: false,
      panelEditId: null,
      panelToDelete: null,
      clonePanel: {},
      expansionPanel: [0, 1, 2, 3, 4, 5],
    };
  },
  computed: {
    ...mapState("AppBuilder", {
      app: "app",
      iconData: "iconData",
    }),
  },
  methods: {
    ...mapActions("AppBuilder", {
      update_panel: "updatePanel",
    }),

    ...mapMutations("SnackBarNotif", {
      notifDanger: "notifDanger",
      notifSuccess: "notifSuccess",
    }),

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
        this.$emit("updateTabPanels");
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

      this.$emit("updateTabPanels");
    },

    panelsByColumn(panels, column) {
      const res = panels.filter((p) => p.column == column);
      return res;
    },

    updatePanel(data) {
      this.app.tabs[this.activeTab].panels = this.app.tabs[
        this.activeTab
      ].panels.map((p) => (p.id === data.id ? data : p));
      this.panelEditId = null;
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
  },
};
</script>

<style>
</style>
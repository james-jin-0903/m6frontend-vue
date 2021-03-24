<template>
  <v-card>
    <v-card-title class="headline px-6 py-4 white">
      <span class="grey--text text--darken-1">
        {{ $t("cpmSettings.settings.projOptions.covid19RiskStatus") }}
      </span>
      <v-spacer />
      <v-btn color="primary" dark fab small @click="showDialog = true">
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="vertical-scroll">
      <v-data-table
        :headers="headers"
        :items="items"
        :options.sync="pagination"
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.name }}</td>
            <td class="text-center">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    :color="props.item.color"
                    fab
                    small
                    v-on="on"
                    @click="editItem(props.item)"
                  />
                </template>
                <span>{{ $t("cpmSettings.clickToPickAColor") }}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>

    <v-dialog
      v-if="showDialog"
      v-model="showDialog"
      persistent
      :value="true"
      width="500"
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            {{ $t("cpmSettings.settings.projOptions.covid19RiskStatus") }}
          </span>
          <v-spacer />
          <v-icon
            v-if="itemToEdit.id"
            class="icon__delete"
            @click="showDeleteConfirm = true"
          >
            mdi-delete
          </v-icon>
        </v-card-title>
        <v-card-text class="vertical-scroll">
          <v-text-field
            ref="statusInput"
            v-model="itemToEdit.name"
            :label="$t('general.status')"
            :rules="[rules.required]"
          />
          <v-row justify="center">
            <v-col class="shrink">
              <chrome-picker v-model="changeColor.color" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">
            {{ $t("general.cancel") }}
          </v-btn>
          <v-btn color="primary" text @click="save">
            {{ $t("general.save") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <M6ConfirmDelete
      :show="showDeleteConfirm"
      @cancel="showDeleteConfirm = false"
      @confirm="deleteItem"
    />
  </v-card>
</template>

<script>
import { db } from "@/utils/Firebase";
import { mapState, mapActions, mapGetters } from "vuex";
import { Chrome } from "vue-color";
export default {
  name: "Covid19RiskStatus",
  components: {
    "chrome-picker": Chrome,
  },
  data() {
    return {
      changeColor: { color: "#238823" },
      covidRef: db
        .collection("settings")
        .doc(this.currentCompany.id)
        .collection("covidRiskStatus"),
      pagination: {
        rowsPerPage: -1,
      },
      headers: [
        { text: this.$t("general.status"), value: "name", width: "70%" },
        {
          text: this.$tc("general.color", 1),
          sortable: false,
          width: "30%",
        },
      ],
      itemToEdit: {},
      rules: {
        required: (value) => !!value || this.$t("rules.required"),
      },
      showDeleteConfirm: false,
      showDialog: false,
    };
  },
  computed: {
    ...mapGetters("companies/cpmProjects/settings", {
      items: "getCovidRiskStatus",
    }),
    ...mapState("Companies", {
      currentCompany: "currentCompany",
    }),
  },
  created() {
    this.getCovidStatus();
  },
  methods: {
    ...mapActions("companies/cpmProjects/settings", {
      fetchCovidRiskStatus: "fetchCovidRiskStatus",
    }),
    getCovidStatus() {
      this.fetchCovidRiskStatus();
    },
    editItem(item) {
      this.itemToEdit = { ...item };
      this.changeColor.color = this.$h.dg(item, "color", "#238823");
      this.showDialog = true;
    },
    closeDialog() {
      this.itemToEdit = {};
      this.showDialog = false;
    },
    async save() {
      const { name } = this.itemToEdit;
      if (!name) {
        this.$snotify.warning(this.$t("alerts.fillRequiredFields"));
        this.$refs.statusInput.focus();
        return;
      }
      const data = {
        name,
        color: this.getColor(),
      };
      try {
        if (this.itemToEdit.id) {
          await this.covidRef.doc(this.itemToEdit.id).update(data);
          this.$snotify.success(this.$t("alerts.successfullyUpdated"));
        } else {
          const date = new Date();
          data.createdAt = date.getTime();
          await this.covidRef.add(data);
          this.$snotify.success(this.$t("alerts.successfullyCreated"));
        }
        this.getCovidStatus();
        this.showDialog = false;
      } catch (e) {
        console.error(e);
        this.$snotify.error(this.$t("alerts.unexpectedError"));
      }
    },
    getColor() {
      if (
        this.$h.dg(this.changeColor, "color.hex") &&
        typeof this.changeColor.color.hex === "string"
      ) {
        return this.changeColor.color.hex;
      } else {
        return this.$h.dg(this.changeColor, "color", "");
      }
    },
    deleteItem() {
      this.covidRef
        .doc(this.itemToEdit.id)
        .delete()
        .then(() => {
          this.$snotify.success(this.$t("alerts.successfullyDeleted"));
          this.showDeleteConfirm = false;
          this.showDialog = false;
          this.getCovidStatus();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card {
  height: 100%;
}
.icon__delete {
  color: #ffffff;
  cursor: pointer;
  transition: all 0.5s ease-out;
  &:hover {
    color: #d2222d;
  }
}
</style>

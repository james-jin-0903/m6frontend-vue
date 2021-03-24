<template>
  <v-form ref="form" @submit.prevent>
    <div class="mb-3 panel px-4 py-3 relative white">
      <!-- HEADER -->
      <div class="d-flex" v-if="!hideActions">
        <v-spacer />
        <v-btn icon right top @click="deletePanel">
          <v-icon color="red lighten-3"> mdi-delete </v-icon>
        </v-btn>
        <v-btn icon right top @click="editPanel">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </div>
      <p
        v-if="!panelEdit && showTitle"
        class="font-weight-medium text-h5 w-full"
        :class="{
          'text-center': panel.title_pos === 2,
          'text-right': panel.title_pos === 1,
        }"
      >
        {{ panel.title }}
      </p>
      <template v-else-if="panelEdit">
        <div class="mb-3">
          <div class="d-flex">
            <v-text-field
              v-model="clonePanel.title"
              class="add-field font-weight-regular grey lighten-3 mb-1 pt-1 px-4 rounded-xl"
              label="Panel Name"
            />
          </div>
          <div class="d-flex mt-2">
            <v-text-field
              v-model="clonePanel.description"
              class="add-field font-weight-regular grey lighten-3 mb-1 pt-1 px-4 rounded-xl"
              label="Description"
            />
          </div>
          <div class="d-flex mt-2">
            <v-select
              v-model="clonePanel.title_pos"
              class="add-field font-weight-regular grey lighten-3 mb-1 pt-1 px-4 rounded-xl"
              item-text="label"
              item-value="value"
              :items="positionItems"
              label="Position"
            />
          </div>
          <div class="d-flex mt-2">
            <v-btn
              color="red"
              dark
              @click="
                panelEdit = false;
                $emit('cancelEdit');
              "
            >
              Cancel
            </v-btn>
            <v-btn
              class="ml-3"
              color="amber lighten-2"
              dark
              @click="copyingPanel"
            >
              Copy Panel
            </v-btn>
            <v-spacer />
            <v-btn color="green" dark @click="updatingPanel"> Save </v-btn>
          </div>
        </div>
      </template>
      <!-- CONTENT -->
      <!-- #### HELPER MEDIA -->
      <v-container class="pa-0 relative rounded-lg" fluid>
        <template v-if="helperMediaURL !== ''">
          <img
            v-if="helperMediaURL.split('/').slice(-2)[0] === 'image'"
            alt="helperMedia"
            class="full-size"
            :src="helperMediaURL"
          />
          <video
            v-if="helperMediaURL.split('/').slice(-2)[0] === 'video'"
            class="full-size"
            controls
          >
            <source :src="helperMediaURL" />
            Your browser does not support the video tag.
          </video>
        </template>
        <v-row class="ma-0 mx-6">
          <v-col v-if="showStandardFields" class="pa-0" cols="12">
            <v-hover v-slot="{ hover }">
              <div class="d-flex justify-between relative">
                <p v-if="editMode !== 1 && !showIndexFields[1]" class="mb-0">
                  <field-icon>
                    <template slot="tooltip"> Record Description </template>
                  </field-icon>
                  <field-tooltip>
                    <template slot="content">
                      {{ recordToEdit.description }}
                    </template>
                    <template slot="tooltip">
                      This is the record description
                    </template>
                  </field-tooltip>
                </p>
                <v-textarea
                  v-if="
                    editMode === 1 || (editMode !== 1 && showIndexFields[1])
                  "
                  v-model="recordToEdit.description"
                  label="Record Description"
                  outlined
                />
                <v-btn
                  v-if="showIndexFields[1]"
                  class="accent-4 green ml-2 text--accent-2 white--text"
                  icon
                  @click="saveValues(1)"
                >
                  <v-icon size="18"> mdi-check </v-icon>
                </v-btn>
                <v-btn
                  v-if="hover && !showIndexFields[1] && editMode !== 1"
                  class="absolute right-0 top-0"
                  icon
                  right
                  top
                  @click="$set(showIndexFields, 1, true)"
                >
                  <v-icon size="18"> mdi-pencil </v-icon>
                </v-btn>
              </div>
            </v-hover>
          </v-col>
          <v-col
            v-for="(f, index) in builderFields"
            :key="`custom-field-${f.id}`"
            class="ma-0 mt-3 pa-0"
            :class="f.type === 'referenced' ? 'custom-flex-row' : ''"
            cols="12"
          >
            <field-form v-if="f.showFieldForm" :field="f" />
            <v-hover v-else v-slot="{ hover }">
              <div class="align-start d-flex justify-between relative">
                <!--DISPLAY MODE-->

                <div v-if="editMode !== 1 && !showIndexFields[index + 2]">
                  <template
                    v-if="
                      genericRecord[`${f.id}`] == null ||
                      genericRecord[`${f.id}`] == undefined
                    "
                  >
                    <field-icon :field="f" />
                    <field-tooltip>
                      <template slot="content">
                        <span
                          class="blue--text pointer"
                          @click="$set(showIndexFields, index + 2, true)"
                        >
                          {{ $h.dg(f, "label", "") }}
                        </span>
                      </template>
                      <template
                        v-if="f.metadata.helpText && f.metadata.helpText !== ''"
                        slot="tooltip"
                      >
                        {{ f.metadata.helpText }}
                      </template>
                    </field-tooltip>
                  </template>
                  <template v-else>
                    <field-icon :field="f">
                      <template slot="tooltip">
                        {{ $h.dg(f, "label", "") }}
                      </template>
                    </field-icon>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                          <progressive-field-switch
                            :attrs="attrs"
                            :field="f"
                            :genericRecord="genericRecord"
                            :on="on"
                          />
                        </span>
                      </template>
                      <span
                        v-if="f.metadata.helpText && f.metadata.helpText !== ''"
                        class="help-text__span"
                      >
                        {{ f.metadata.helpText }}
                      </span>
                    </v-tooltip>
                  </template>
                </div>

                <!--EDIT MODE-->

                <div
                  v-if="
                    editMode === 1 ||
                    (editMode !== 1 && showIndexFields[index + 2])
                  "
                  class="custom-flex-stepper mt-3"
                >
                  <template v-if="f.type === 'referenced'">
                    <v-autocomplete
                      class="mr-2"
                      item-text="title"
                      item-value="id"
                      :items="
                        recordsByAppsList[
                          $h.dg(f, 'metadata.originalReference.id', '')
                        ]
                      "
                      label="Pick a Record"
                      outlined
                      return-object
                      :value="referenceRecordsIds[f.id]"
                      @input="(e) => changingRefValue(e, f)"
                    />
                  </template>
                  <template v-else-if="f.type === 'referencedToApp'">
                    App Name:
                    {{ $h.dg(f, "metadata.originalReference.label", "") }}
                  </template>
                  <template v-if="f.type === 'referencedRecord'">
                    <referenced-record :field="f" />
                  </template>
                  <template v-else-if="f.type === 'taxonomy'">
                    <taxonomy-term-selector
                      :metadata="f.metadata"
                      @changetaxonomy="
                        (termId, termName) =>
                          changedTaxonomy(termId, termName, f.id)
                      "
                    />
                  </template>
                  <template v-else-if="f.type === 'text'">
                    <text-field
                      :label="f.label"
                      :metadata="f.metadata"
                      :text-class="
                        f.metadata.position
                          ? f.metadata.position === 3
                            ? 'righted-input'
                            : f.metadata.position === 2
                            ? 'centered-input'
                            : ''
                          : ''
                      "
                      :value="genericRecord[`${f.id}`]"
                      @changeText="
                        (value) => (genericRecord[`${f.id}`] = value)
                      "
                    />
                  </template>
                  <template v-else-if="f.type === 'imageDropArea'">
                    <drop-area
                      @loading="loading = !loading"
                      @response="saveImage(f.id, $event)"
                      :value="genericRecord[f.id]"
                    />
                  </template>
                  <template v-else-if="f.type !== 'referencedToApp'">
                    <div
                      v-if="
                        f.machine_name !== 'rapid_snapshot' && !showOuterLabels
                      "
                      class="pb-2"
                    >
                      <label class="stepper-label">{{
                        $h.dg(f, "label", "")
                      }}</label>
                    </div>
                    <template v-if="f.machine_name === 'rapid_snapshot'">
                      <img
                        alt="Rapid Image"
                        class="h-auto w-20r"
                        :src="genericRecord[`${f.id}`]"
                      />
                    </template>
                    <div
                      v-else-if="f.type === 'referenced'"
                      class="custom-flex-stepper-items"
                    >
                      <component
                        :is="
                          $h.dg(
                            typeToComponentMapping[
                              f.metadata.originalReference.type
                            ],
                            'component',
                            ''
                          )
                        "
                        v-model="genericRecord[`${f.id}`]"
                        :chips="
                          $h.dg(
                            typeToComponentMapping[
                              f.metadata.originalReference.type
                            ],
                            'chips',
                            false
                          )
                        "
                        :clearable="
                          $h.dg(
                            typeToComponentMapping[
                              f.metadata.originalReference.type
                            ],
                            'clearable',
                            false
                          )
                        "
                        :items="
                          $h.dg(
                            f,
                            'metadata.originalReference.metadata.options',
                            []
                          )
                        "
                        :label="showOuterLabels ? $h.dg(f, 'label', '') : null"
                        :multiple="$h.dg(f, 'metadata.multiple', false)"
                        outlined
                        :rules="
                          $h.dg(f, 'metadata.required', false)
                            ? formRules.standard
                            : []
                        "
                        :type="
                          $h.dg(
                            typeToComponentMapping[
                              f.metadata.originalReference.type
                            ],
                            'type',
                            ''
                          )
                        "
                      />
                    </div>
                    <div v-else class="custom-flex-stepper-items">
                      <component
                        :is="
                          $h.dg(typeToComponentMapping[f.type], 'component', '')
                        "
                        v-model="genericRecord[`${f.id}`]"
                        :chips="
                          $h.dg(typeToComponentMapping[f.type], 'chips', false)
                        "
                        :clearable="
                          $h.dg(
                            typeToComponentMapping[f.type],
                            'clearable',
                            false
                          )
                        "
                        :items="$h.dg(f, 'metadata.options', [])"
                        :label="showOuterLabels ? $h.dg(f, 'label', '') : null"
                        :metadata="f.metadata"
                        :multiple="$h.dg(f, 'metadata.multiple', false)"
                        outlined
                        :rules="
                          $h.dg(f, 'metadata.required', false)
                            ? formRules.standard
                            : []
                        "
                        :type="
                          $h.dg(typeToComponentMapping[f.type], 'type', '')
                        "
                      />
                    </div>
                  </template>
                </div>
                <v-btn
                  v-if="
                    showIndexFields[index + 2] &&
                    f.type !== 'referencedRecord' &&
                    !loading
                  "
                  class="accent-4 green ml-2 mt-4 text--accent-2 white--text"
                  icon
                  @click="saveValues(index + 2)"
                >
                  <v-icon size="18"> mdi-check </v-icon>
                </v-btn>
                <v-btn
                  v-if="
                    hover &&
                    !showIndexFields[index + 2] &&
                    editMode !== 1 &&
                    !loading
                  "
                  class="absolute right-0 top-0"
                  icon
                  right
                  top
                  @click="$set(showIndexFields, index + 2, true)"
                >
                  <v-icon size="18"> mdi-pencil </v-icon>
                </v-btn>
              </div>
            </v-hover>
          </v-col>
        </v-row>

        <div class="align-start d-flex">
          <div class="overflow-hidden w-full">
            <add-field @addNewField="addNewField" />
            <span class="blue--text"> / </span>
            <v-btn
              class="blue--text capitalize px-1"
              color="transparent"
              :disabled="showTableCreator"
              elevation="0"
              @click="createNewTable"
            >
              Add Table
            </v-btn>
          </div>
        </div>

        <v-row v-if="fields.length > 0 && editMode !== 0 && !stepperShow">
          <v-col cols="12">
            <div class="custom-flex-stepper">
              <v-col v-if="table.add_sub_totals" cols="10">
                <v-checkbox v-model="below" label="Below Subtotal" />
              </v-col>
              <v-col cols="10">
                <v-row v-if="!isFromFeedManager" align="center" justify="end">
                  <v-btn
                    v-if="isEdit"
                    class="white--text"
                    color="green"
                    @click="updating"
                  >
                    update
                  </v-btn>
                  <v-btn
                    v-else
                    class="white--text"
                    color="green"
                    @click="creating"
                  >
                    save
                  </v-btn>
                </v-row>
              </v-col>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <field
        v-if="showFieldModal"
        :editing="editing"
        :field="activeField"
        :app-fields="fields"
        :show="showFieldModal"
        @close="showFieldModal = false"
        @result="pushField"
      />

      <v-dialog v-model="showDeleteModal" width="500">
        <delete-dialog
          :element="fieldToDelete ? 'Field' : tableToDelete ? 'Table' : 'Panel'"
          @closeDeleteModal="confirmDelete"
        />
      </v-dialog>

      <table-creator
        v-if="showTableCreator"
        :table="activeAppTable"
        @close="showTableCreator = false"
        @updateTable="updatingTable"
      />

      <m6-loading :loading="loading" />
    </div>
  </v-form>
</template>

<script>
import AddField from "@/components/AppBuilder/Buttons/AddField";
import Field from "@/components/AppBuilder/Modals/Field";
import DeleteDialog from "@/components/Dialogs/DeleteDialog";
import TableCreator from "@/components/AppBuilder/GenericTable";
import { mapActions, mapMutations, mapState } from "vuex";
import { cloneDeep, inRange } from "lodash";
import Draggable from "vuedraggable";
import ProgressiveFieldSwitch from "@/components/AppBuilder/Form/Components/ProgressiveFieldSwitch";
import TaxonomyTermSelector from "@/components/AppBuilder/Form/Components/TaxonomyTermSelector";
import ReferencedRecord from "@/components/AppBuilder/Form/Components/ReferencedRecord";
import TextField from "@/components/AppBuilder/Form/Components/TextField.vue";
import FieldIcon from "@/components/AppBuilder/Form/Components/BuilderFieldIcon";
import FieldTooltip from "@/components/AppBuilder/Form/Components/FieldTooltip";
import FieldForm from "@/components/AppBuilder/Form/Components/FieldV2";
import DropArea from "@/components/AppBuilder/Content/DropArea";

export default {
  name: "PanelShow",

  components: {
    AddField,
    DeleteDialog,
    Draggable,
    DropArea,
    Field,
    FieldForm,
    FieldIcon,
    FieldTooltip,
    ProgressiveFieldSwitch,
    ReferencedRecord,
    TableCreator,
    TaxonomyTermSelector,
    TextField,
  },

  props: {
    panel: {
      default: () => ({}),
      required: false,
      type: Object,
    },

    panelDelete: {
      type: Boolean,
      default: false,
    },

    panelEditRef: {
      type: Boolean,
      default: false,
    },

    hideActions: {
      type: Boolean,
      default: false,
    },

    appID: {
      type: Number,
      default: 0,
    },

    appFields: Array,

    helperMediaURL: {
      type: String,
      default: "",
    },

    showStandardFields: {
      type: [Boolean, Number, String],
      default: false,
    },

    showTitle: {
      type: Boolean,
      default: true,
    },

    showOuterLabels: {
      // only used in stepper view
      type: Boolean,
      // eslint-disable-next-line vue/no-boolean-default
      default: true,
    },

    fields: {
      type: Array,
      default: () => [],
    },

    isFromFeedManager: {
      type: Boolean,
      default: false,
    },

    recordID: {
      type: Number,
      default: 0,
    },

    inheritedEditMode: {
      type: Boolean,
      default: false,
    },

    data: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      showFieldModal: false,
      showDeleteModal: false,
      panelEditLocal: false,
      panelToDelete: null,
      clonePanel: {},
      editing: false,
      fieldToDelete: null,
      tableToDelete: null,
      activeField: {},
      defaultField: {
        // eslint-disable-next-line camelcase
        panel_id: this.panel.id,
        label: "New Field",
        type: "text",
        weight: 0,
        metadata: {
          options: [],
          required: false,
          position: 1,
          non_blocking: false,
        },
        // eslint-disable-next-line camelcase
        referenced_field: null,
      },
      loading: false,
      showTableCreator: false,
      activeAppTable: {},
      positionItems: [
        { label: "Left", value: 0 },
        { label: "Right", value: 1 },
        { label: "Center", value: 2 },
      ],
      editMode: 0,
      showIndexFields: [],
      recordToEdit: {},
      orderedFields: [],
      genericRecord: {},
      recordsByAppsList: {},
      referenceFieldsIds: {},
      typeToComponentMapping: {
        timestamp: { component: "date-picker" },
        text: { component: "v-text-field" },
        attachment: { component: "app-attachment" },
        boolean: { component: "radio-btn-options" },
        trilean: { component: "tri-btn-options" },
        number: {
          component: "v-text-field",
          type: "number",
        },
        autocomplete: {
          component: "v-autocomplete",
          chips: true,
          clearable: true,
        },
        people: {
          component: "people-autocomplete",
          multiple: true,
          chips: true,
          clearable: true,
        },
        referencedToApp: { component: "v-text-field" },
        referenced: { component: "v-text-field" },
        "autocomplete-address": {
          component: "g-map",
        },
        taxonomy: {
          component: "taxonomy-term-selector",
        },
      },
      formRules: {
        standard: [(v) => !!v || "This field is required"],
      },
      complexDataStructs: { autocomplete: true, people: true },
      typesToIds: {},
      below: false,
      tableRowID: 0,
      referenceRecordsIds: {},
    };
  },

  computed: {
    ...mapState("RecordsInstance", {
      currentRecord: "currentRecord",
      showSelf: "displayAppBuilderShow",
    }),
    builderFields: {
      get() {
        if (this.orderedFields.length > 0) {
          return this.orderedFields;
        }
        const fieldList = this.fields.filter(
          (field) =>
            field.type !== "helper-media" &&
            (field.metadata.progressiveField !== "yes" ||
              (field.metadata.progressiveField === "yes" &&
                field.metadata.progressiveFieldSatisfied === true)) &&
            field.type !== "autonumber"
        );
        fieldList.forEach((field) => this.$set(field, "showFieldForm", false));
        return fieldList;
      },
    },
    panelEdit: {
      get() {
        return this.panelEditRef || this.panelEditLocal;
      },
      set(val) {
        this.panelEditLocal = val;
        if (!val) {
          this.$emit("cancelEdit");
        }
      },
    },
    progressiveFields() {
      const fieldList = this.fields.filter(
        (field) =>
          field.type !== "helper_media" &&
          field.metadata.progressiveField === "yes" &&
          field.type !== "autonumber"
      );
      return fieldList;
    },
    requiredFieldIds() {
      return this.fields
        .filter((val) => val.metadata.required)
        .map((val) => val.id);
    },
    rFilled() {
      return Object.keys(this.genericRecord).filter(
        (val) =>
          this.genericRecord[val] && this.requiredFieldIds.includes(Number(val))
      );
    },
    requiredFilled() {
      const filled = this.rFilled;
      return (
        (this.requiredFieldIds.length > 0 &&
          filled.length == this.requiredFieldIds.length) ||
        this.requiredFieldIds.length == 0
      );
    },
    sortedFields() {
      return this.panel.fields.sort((a, b) => a.weight - b.weight);
    },
  },

  mounted() {
    this.$nextTick(async () => {
      try {
        this.loadingData();
        this.recordToEdit = { ...this.currentRecord };
        const referencedFields = this.fields.filter(
          (f) => f.type === "referenced"
        );

        if (referencedFields.length) {
          const originals = referencedFields.map((r) => ({
            app_id: this.$h.dg(r, "metadata.originalReference.app_id", ""),
            id: this.$h.dg(r, "metadata.originalReference.id", ""),
            type: this.$h.dg(r, "metadata.originalReference.type", ""),
          }));

          this.recordsByAppsList = await this.recordsByApps({
            fields: originals,
          });
        }
        this.handleRequiredFilled({
          panelID: this.panel.id,
          tab: this.panel.tab_id,
          valid: this.requiredFilled,
        });
      } catch (e) {
        this.notifDanger("There was an error while loading");
      }
    });
  },

  watch: {
    $route() {
      this.loadingData();
    },
    inheritedEditMode: {
      handler: function (val) {
        this.editMode = val ? 1 : 0;
      },
      immediate: true,
    },
    panelDelete(val, _) {
      if (val) {
        this.deletePanel();
      }
    },
    panelEditRef(val) {
      this.clonePanel = { ...this.panel };
    },
    requiredFilled(val, _) {
      this.handleRequiredFilled({
        panelID: this.panel.id,
        tab: this.panel.tab_id,
        valid: val,
      });
    },
  },

  methods: {
    ...mapActions("AppBuilder", {
      bulkSaveFieldValues: "bulkSaveFieldValues",
      deleteFieldsByIds: "deleteFieldsByIds",
      getFieldValuesPerPanel: "getFieldValuesPerPanel",
      moveField: "moveField",
      recordsByApps: "recordsByApps",
      updatePanel: "updatePanel",
      updateRecord: "updateRecord",
      updateSomeFieldValues: "updateSomeFieldValues",
    }),

    ...mapActions("Fields", {
      handleRequiredFilled: "addRequiredField",
    }),

    ...mapActions("AppTables", {
      createAppTable: "createTable",
    }),

    ...mapMutations("SnackBarNotif", {
      notifDanger: "notifDanger",
      notifSuccess: "notifSuccess",
    }),

    ...mapActions("AppAttachments", {
      post_attachment: "post_attachment",
    }),

    updatingTable(table) {
      this.activeAppTable = { ...table };
      this.$emit("updatingTable", table);
    },

    editingTable(table) {
      this.activeAppTable = table;
      if (!this.$h.dg(this.activeAppTable, "fields", []).length)
        this.activeAppTable.fields = [];
      this.$nextTick(() => {
        this.showTableCreator = true;
      });
    },

    async createNewTable() {
      try {
        this.loading = true;
        this.activeAppTable = await this.createAppTable({
          panel_id: this.panel.id,
          title: "New Table",
          app_id: this.appID,
        });
        this.activeAppTable.fields = [];
        this.$nextTick(() => {
          this.showTableCreator = true;
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.notifDanger("There was an error while creating the table");
      }
    },

    async updatingPanel() {
      try {
        this.loading = true;
        await this.updatePanel(this.clonePanel);
        this.notifSuccess("Panel updated!");

        this.panelEdit = false;
        this.loading = false;
        this.$emit("updatePanel", this.clonePanel);
      } catch (e) {
        this.notifDanger("There was an error while updating the panel");
        this.loading = false;
      }
    },

    async copyingPanel() {
      this.$emit("copyPanel", this.panel.id);
    },

    addNewField() {
      this.activeField = {
        ...cloneDeep(this.defaultField),
        weight: this.panel.fields.length,
      };
      this.editing = false;
      this.showFieldModal = true;
    },

    editField(field) {
      this.activeField = { ...field };
      this.editing = true;
      this.showFieldModal = true;
    },

    showDelete(field) {
      this.showDeleteModal = true;
      this.fieldToDelete = field.id;
    },

    deleteTable(table) {
      this.showDeleteModal = true;
      this.tableToDelete = table.id;
    },

    async confirmDelete(result) {
      if (result) {
        if (this.fieldToDelete) {
          await this.$store.dispatch(
            "AppBuilder/deleteField",
            this.fieldToDelete
          );
          const index = this.panel.fields.findIndex(
            (field) => field.id === this.fieldToDelete
          );
          this.panel.fields.forEach((field) => {
            if (field.weight > this.panel.fields[index].weight) {
              field.weight--;
            }
          });
          this.panel.fields.splice(index, 1);
        } else if (this.tableToDelete) {
          await this.$store.dispatch(
            "AppBuilder/deleteTable",
            this.tableToDelete
          );
          const index = this.panel.tables
            .map((item) => item.id)
            .indexOf(this.tableToDelete);
          this.panel.tables.splice(index, 1);
        } else if (this.panelToDelete) {
          await this.$store.dispatch(
            "AppBuilder/deletePanel",
            this.panelToDelete
          );
          this.$emit("deletePanel", this.panelToDelete);
        }
      } else {
        this.$emit("cancelDelete");
      }
      this.fieldToDelete = null;
      this.tableToDelete = null;
      this.panelToDelete = null;
      this.showDeleteModal = false;
    },

    editPanel() {
      this.panelEdit = !this.panelEdit;
      this.clonePanel = { ...this.panel };
    },

    deletePanel() {
      this.showDeleteModal = true;
      this.panelToDelete = this.panel.id;
    },

    async pushField(pushField, copyField) {
      if (this.editing && !copyField) {
        const index = this.panel.fields
          .map((item) => item.id)
          .indexOf(pushField.id);
        this.panel.fields[index] = { ...pushField };
      } else {
        this.panel.fields.push(pushField);
      }
      if (copyField) {
        await this.moveField({
          id: pushField.id,
          newWeight: pushField.weight + 1,
        });
      }
      this.showFieldModal = false;
      this.editing = false;
      this.$store.dispatch("Fields/setLock");
    },

    async onFieldMove(evt) {
      if (!evt.moved) {
        return;
      }

      const ctx = evt.moved;

      // Movement direction
      const dir = Math.sign(ctx.newIndex - ctx.element.weight);

      // Move items with weight between start and end to appropriate place
      const min = Math.min(ctx.element.weight, ctx.newIndex);
      const max = Math.max(ctx.element.weight, ctx.newIndex);
      this.panel.fields
        .filter(
          (item) => inRange(item.weight, min, max + 1) && item !== ctx.element
        )
        .forEach((item) => (item.weight = item.weight - dir));

      ctx.element.weight = ctx.newIndex;

      // Dispatch move action
      try {
        this.loading = true;
        const payload = {
          id: ctx.element.id,
          newWeight: ctx.newIndex,
        };

        await this.moveField(payload);

        this.notifSuccess("Movement saved");
      } catch (e) {
        this.notifDanger("There was an error while saving move");
        return false;
      } finally {
        this.loading = false;
      }
    },

    saveImage(fieldID, response) {
      if (response.ok) {
        this.genericRecord[fieldID] = response.data.link;
        this.notifSuccess("The image was uploaded");
      } else {
        this.notifDanger("There was an error while uploading");
      }
    },

    selectFile(fieldID, file) {
      if (!file) return;
      this.loading = true;
      if (file["name"].match(/\.[0-9a-z]+$/i) && file["size"] < 50000000) {
        if (file.type.split("/")[0] !== "image") {
          this.notifDanger("You can upload only images");
          this.loading = false;
          return;
        }
        const localFile = {
          file_type: file["type"],
          file_extension: file["name"].match(/\.[0-9a-z]+$/i)[0],
          file_name: file["name"].substring(
            file["name"][0],
            file["name"].lastIndexOf(".")
          ),
          file_name_full: file["name"],
          file_size: file["size"],
          file: file,
        };
        this.genericRecord[fieldID] = { ...localFile };
        // this.loadedFileName = file['name']

        this.post_attachment({
          file: file,
          headers: {
            "Content-Type": localFile["file_type"],
            path: "record/",
            "Content-Name": localFile["file_name_full"],
          },
        })
          .then((file) => {
            this.genericRecord[fieldID]["value"] = file["attachId"];
          })
          .catch((err) => {
            console.log(err);
            console.log(err.response);
          });
      }
      this.loading = false;
    },

    // FORM SHOW GENERATOR MIXIN

    async creating() {
      try {
        this.loading = true;

        const payload = {
          record_id: this.currentRecord.id || this.$route.params.id,
          fields: [],
        };
        for (let x = 0; x < this.fields.length; x++) {
          const f = this.fields[x];
          const value = this.$h.dg(this.genericRecord, `${f.id}`, "");

          if (!value) continue;

          if (Array.isArray(value)) {
            const res = value.map((v) => ({
              value: v,
              field_id: f.id,
            }));
            payload.fields = [...payload.fields, ...res];
          } else {
            payload.fields.push({
              value,
              field_id: f.id,
              record_id: payload["record_id"],
            });
          }
        }

        await this.bulkSaveFieldValues(payload);
        await this.saveStandardFields();

        this.notifSuccess("The values were saved");
        this.loading = false;
        this.$emit("closing", { ...this.genericRecord });
      } catch (e) {
        this.notifDanger("The was an error while saving");
        this.loading = false;
      }
    },

    async updating() {
      try {
        this.loading = true;
        const complexTypes = this.fields
          .filter((f) => {
            const type =
              this.$h.dg(f, "metadata.originalReference.type", "") || f.type;
            return this.complexDataStructs[type];
          })
          .map((f) => f.id);
        const newGenericRecord = {
          ...this.genericRecord,
        };
        complexTypes.forEach((id) => {
          delete newGenericRecord[id];
        });
        const deleteArr = [];
        const createObj = {};
        complexTypes.forEach((a) => {
          const { toDelete, toCreate } = this.findTheDifference(
            this.typesToIds[a],
            this.genericRecord[a],
            a
          );
          const field = this.fields.find((f) => f.id === a);
          const fieldType =
            this.$h.dg(field, "metadata.originalReference.type", "") ||
            field.type;
          if (toDelete.length) deleteArr.push({ values: toDelete, fieldType });
          createObj[a] = toCreate;
        });
        const payload = this.createFieldsPayload(newGenericRecord);
        console.log(payload);
        const payloadToCreate = this.createFieldsPayload(createObj);
        if (this.isFromFeedManager) {
          this.$emit("updating", {
            payload: payload,
            payloadToCreate: payloadToCreate,
          });
          this.loading = false;
          return;
        }
        console.log("attempt 1");
        await this.updateSomeFieldValues({
          ...payload,
          below_subtotals: this.below,
          row_id: this.tableRowID > 0 ? this.tableRowID : null,
        });
        console.log("attempt 2");
        await this.bulkSaveFieldValues(payloadToCreate);
        if (deleteArr.length) {
          await this.deleteFieldsByIds({
            deleteArr,
          });
        }
        console.log("attempt 3");
        await this.saveStandardFields();

        //  Insert Progressive Fields if condition's satisfied
        this.handleProgressiveFields(
          newGenericRecord,
          this.fields,
          this.progressiveFields,
          this.builderFields
        );

        const ids = this.fields.map((f) => f.id);
        console.log("attempt 4");
        const res = await this.getFieldValuesPerPanel({
          recordID: this.$route.params.id || this.recordID,
          panelID: this.panel.id,
          ids,
        });
        console.log("finish");
        this.typesToIds = res.typesToIds;
        this.notifSuccess("The values were updated");
        this.loading = false;
        this.$emit("closing", {
          ...this.genericRecord,
          below_sub_total: this.below,
        });
        this.$emit("updateRecord", this.genericRecord);
        this.$store.dispatch("Fields/setLock");
      } catch (e) {
        console.log(e);
        console.log(e.response);
        this.notifDanger("There was an error while updated");
        this.loading = false;
      }
    },

    async loadingData() {
      if (
        this.$route.name === "record.show" &&
        Object.keys(this.panel).length > 0
      ) {
        try {
          this.loading = true;
          const ids = this.fields.map((f) => f.id);
          const taxonomyIds = this.fields
            .filter((f) => f.type === "taxonomy")
            .map((f) => f.id);
          for (let i = 0; i < taxonomyIds.length; i++) {
            this.taxonomyValues[
              `${taxonomyIds[i]}`
            ] = await this.fetchTaxonomyValue(taxonomyIds[i]);
          }

          const res = await this.getFieldValuesPerPanel({
            recordID: this.$route.params.id || this.recordID,
            panelID: this.panel.id,
            ids,
          });
          this.genericRecord = { ...res.values };
          this.handleProgressiveFields(
            this.genericRecord,
            this.fields,
            this.progressiveFields,
            this.builderFields
          );
          this.typesToIds = res.typesToIds;
          this.referenceRecordsIds = res.referenceRecordsIds;
          this.referenceFieldsIds = res.referenceFieldsIds;
          this.isEdit = true;

          const singleValMultipleField = this.fields.filter(
            (f) =>
              f.type === "autocomplete" &&
              typeof f.metadata.multiple === "boolean" &&
              !f.metadata.multiple
          );

          singleValMultipleField.forEach((val) => {
            this.genericRecord[val.id] = this.genericRecord[val.id][0].value;
          });
          this.$emit("updateRecord", this.genericRecord);
          this.loading = false;
        } catch (e) {
          this.loading = false;
        }
      }
      this.$emit("updateRequiredFilled", {
        panelId: this.panel.id,
        valid: this.requiredFilled,
      });
    },

    handleProgressiveFields(record, fields, progressiveFields, builderFields) {
      const ids = fields
        .filter(
          (field) =>
            field.type !== "helper-media" &&
            field.metadata.progressiveField !== "yes" &&
            field.type !== "autonumber"
        )
        .map((val) => val.id);
      this.orderedFields = [];
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        var conditionedFields = progressiveFields.filter((val) => {
          const stringAnswer = Boolean(record[id]) ? "Yes" : "No";
          return (
            val.metadata.progressiveFieldId == id &&
            val.metadata.progressiveFieldValue == stringAnswer
          );
        });
        conditionedFields = conditionedFields.sort((a, b) => {
          if (record[a.id] > record[b.id]) return 1;
          if (record[b.id] > record[a.id]) return -1;
          return 0;
        });
        const parent = fields.find((val) => val.id == id);
        this.orderedFields.push(parent);
        conditionedFields.forEach((f) => {
          this.orderedFields.push(f);
        });
      }
    },

    saveValues(index) {
      this.$set(this.showIndexFields, index, false);
      this.updating();
    },

    findTheDifference(reference = [], newData = []) {
      const toDelete =
        reference.filter((r) => !newData.includes(r.value)) || [];
      const transformedArray = reference.map((r) => r.value);

      let toCreate = [];
      if (Array.isArray(newData)) {
        toCreate = newData.filter((a) => !transformedArray.includes(a));
      } else if (typeof newData === "string") {
        toCreate.push(newData);
      }

      return { toDelete, toCreate };
    },

    createFieldsPayload(record) {
      let fields = [];
      for (let x = 0; x < this.fields.length; x++) {
        const f = this.fields[x];
        const idForUpdate = this.referenceFieldsIds[f.id]
          ? this.referenceFieldsIds[f.id]
          : f.id;
        const recordIdForUpdate = this.referenceRecordsIds[f.id]
          ? this.referenceRecordsIds[f.id]
          : this.recordID
          ? this.recordID
          : this.$route.params.id;
        let value = record[f.id];
        if (value == null || value == undefined || String(value).length == 0)
          value = this.$h.dg(record, `${f.id}`, "");
        if (value == null || value == undefined || String(value).length == 0)
          continue;
        if (Array.isArray(value)) {
          const res = value.map((v) => ({
            value: v,
            field_id: idForUpdate,
            record_id: recordIdForUpdate,
            table_row_id: this.tableRowID > 0 ? this.tableRowID : null,
          }));
          fields = [...fields, ...res];
        } else if (
          Object.prototype.toString.call(value) === "[object Object]"
        ) {
          delete value["created_at"];
          delete value["updated_at"];
          fields.push({
            value,
            field_id: idForUpdate,
            record_id: recordIdForUpdate,
            table_row_id: this.tableRowID > 0 ? this.tableRowID : null,
          });
        } else {
          if (value === "true" || value === "false") value = value === "true";
          fields.push({
            value,
            field_id: idForUpdate,
            record_id: recordIdForUpdate,
            table_row_id: this.tableRowID > 0 ? this.tableRowID : null,
          });
        }
      }

      return { fields };
    },

    saveStandardFields() {
      return new Promise((resolve, reject) => {
        if (this.showStandardFields) {
          this.updateRecord(this.recordToEdit)
            .then((res) => resolve(res))
            .catch((e) => reject(e));
        }

        return resolve();
      });
    },

    fetchTaxonomyValue(termId) {
      return new Promise((resolve) => {
        axios
          .get(
            `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/taxonomy/term/${termId}`
          )
          .then((response) => {
            if (response.status === 200) {
              resolve(response.data[0]["title"]);
            } else {
              this.notifDanger("There was an error getting term value.");
              resolve(termId);
            }
          })
          .catch(() => {
            this.notifDanger("There was an error getting term value.");
            resolve(termId);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.referenced-field {
  color: #0f75bc;
  font-style: italic;
}
</style>


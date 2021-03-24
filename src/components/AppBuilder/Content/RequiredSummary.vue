<template>
  <v-expansion-panels v-model="expansionPanel" multiple>
    <v-expansion-panel>
      <v-expansion-panel-header disable-icon-rotate>
        <h3 class="w-full">Required Field Summary</h3>
        <template v-slot:actions>
          <div></div>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
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
            <!-- <v-col v-if="showStandardFields" class="pa-0" cols="12">
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
            </v-col> -->
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
                          v-if="
                            f.metadata.helpText && f.metadata.helpText !== ''
                          "
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
                          v-if="
                            f.metadata.helpText && f.metadata.helpText !== ''
                          "
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
                    <template v-else-if="f.type !== 'referencedToApp'">
                      <div
                        v-if="
                          f.machine_name !== 'rapid_snapshot' &&
                          !showOuterLabels
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
                          :label="
                            showOuterLabels ? $h.dg(f, 'label', '') : null
                          "
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
                            $h.dg(
                              typeToComponentMapping[f.type],
                              'component',
                              ''
                            )
                          "
                          v-model="genericRecord[`${f.id}`]"
                          :chips="
                            $h.dg(
                              typeToComponentMapping[f.type],
                              'chips',
                              false
                            )
                          "
                          :clearable="
                            $h.dg(
                              typeToComponentMapping[f.type],
                              'clearable',
                              false
                            )
                          "
                          :items="$h.dg(f, 'metadata.options', [])"
                          :label="
                            showOuterLabels ? $h.dg(f, 'label', '') : null
                          "
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
                      f.type !== 'referencedRecord'
                    "
                    class="accent-4 green ml-2 mt-4 text--accent-2 white--text"
                    icon
                    @click="saveValues(index + 2)"
                  >
                    <v-icon size="18"> mdi-check </v-icon>
                  </v-btn>
                  <v-btn
                    v-if="
                      hover && !showIndexFields[index + 2] && editMode !== 1
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
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

import FieldIcon from "@/components/AppBuilder/Form/Components/BuilderFieldIcon";
import FieldTooltip from "@/components/AppBuilder/Form/Components/FieldTooltip";
import FieldForm from "@/components/AppBuilder/Form/Components/FieldV2";
import FormShowGenerator from "@/components/AppBuilder/Form/FormShowGenerator";
import GeneratedTable from "@/components/AppBuilder/GenericTable/GeneratedTable";
import PanelShow from "@/components/AppBuilder/Content/PanelShow";
import ProgressiveFieldSwitch from "@/components/AppBuilder/Form/Components/ProgressiveFieldSwitch";
import ReferencedRecord from "@/components/AppBuilder/Form/Components/ReferencedRecord";
import TaxonomyTermSelector from "@/components/AppBuilder/Form/Components/TaxonomyTermSelector";
import TextField from "@/components/AppBuilder/Form/Components/TextField.vue";

export default {
  name: "RequiredSummary",
  components: {
    FieldIcon,
    FieldTooltip,
    FieldForm,
    FormShowGenerator,
    GeneratedTable,
    PanelShow,
    ProgressiveFieldSwitch,
    ReferencedRecord,
    TaxonomyTermSelector,
    TextField,
  },
  props: {
    helperMediaURL: {
      type: String,
      default: "",
    },

    tab: {
      type: Object,
      default: () => {},
    },

    appFields: Array,

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
  },
  data() {
    return {
      showDeleteModal: false,
      expansionPanel: [0, 1, 2, 3, 4, 5],
      loading: false,
      editMode: 0,
      showIndexFields: [],
      recordToEdit: {},
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
    ...mapState("AppBuilder", {
      app: "app",
      iconData: "iconData",
    }),
    ...mapState("RecordsInstance", {
      currentRecord: "currentRecord",
      showSelf: "displayAppBuilderShow",
    }),
    builderFields: {
      get() {
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
      } catch (e) {
        this.notifDanger("There was an error while loading");
      }
    });
  },
  methods: {
    ...mapMutations("SnackBarNotif", {
      notifDanger: "notifDanger",
      notifSuccess: "notifSuccess",
    }),
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
        console.log("payload");
        const payload = this.createFieldsPayload(newGenericRecord);
        console.log("payload");
        const payloadToCreate = this.createFieldsPayload(createObj);
        if (this.isFromFeedManager) {
          this.$emit("updating", {
            payload: payload,
            payloadToCreate: payloadToCreate,
          });
          this.loading = false;
          return;
        }
        await this.updateSomeFieldValues({
          ...payload,
          below_subtotals: this.below,
          row_id: this.tableRowID > 0 ? this.tableRowID : null,
        });
        await this.bulkSaveFieldValues(payloadToCreate);
        if (deleteArr.length) {
          await this.deleteFieldsByIds({
            deleteArr,
          });
        }
        await this.saveStandardFields();

        this.fields.forEach(async (field) => {
          const res = await this.getFieldValuesPerPanel({
            recordID: this.$route.params.id || this.recordID,
            panelID: field.panel_id,
            ids: [field.id],
          });
          this.genericRecord = { ...this.genericRecord, ...res.values };
          this.typesToIds = {...res.typesToIds, ...this.typesToIds};
        });

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
        this.notifDanger("There was an error while updated");
        this.loading = false;
      }
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

    async loadingData() {
      if (this.$route.name === "record.show") {
        try {
          this.loading = true;
          const taxonomyIds = this.fields
            .filter((f) => f.type === "taxonomy")
            .map((f) => f.id);
          for (let i = 0; i < taxonomyIds.length; i++) {
            this.taxonomyValues[
              `${taxonomyIds[i]}`
            ] = await this.fetchTaxonomyValue(taxonomyIds[i]);
          }

          this.fields.forEach(async (field) => {
            const res = await this.getFieldValuesPerPanel({
              recordID: this.$route.params.id || this.recordID,
              panelID: field.panel_id,
              ids: [field.id],
            });
            this.genericRecord = { ...this.genericRecord, ...res.values };
            this.typesToIds = {...res.typesToIds, ...this.typesToIds};
            this.referenceRecordsIds = {...res.referenceRecordsIds, ...this.referenceRecordsIds};
            this.referenceFieldsIds = {...res.referenceFieldsIds, ...this.referenceFieldsIds};
          });

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
        console.log("f");
        const f = this.fields[x];
        console.log("idforupdate");
        const idForUpdate = this.referenceFieldsIds[f.id]
          ? this.referenceFieldsIds[f.id]
          : f.id;
        console.log("recordidforupdate");
        const recordIdForUpdate = this.referenceRecordsIds[f.id]
          ? this.referenceRecordsIds[f.id]
          : this.recordID
          ? this.recordID
          : this.$route.params.id;
        console.log("value");
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

    saveValues(index) {
      this.$set(this.showIndexFields, index, false);
      this.updating();
    },
  },
};
</script>

<style>
</style>
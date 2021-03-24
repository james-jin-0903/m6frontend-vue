<template>
  <v-form ref="form" @submit.prevent>
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
      <!-- <template v-if="actionRecord">
        <v-btn
          v-if="editMode === 0 || editMode === 2"
          class="absolute buttonTop right-0 top-0"
          icon
          right
          top
          @click="editMode = 1"
        >
          <v-icon size="25">
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn
          v-else
          class="absolute buttonTop green--text right-0 top-0"
          icon
          right
          top
          @click="editMode = 0"
        >
          <v-icon size="25">
            mdi-check
          </v-icon>
        </v-btn>
      </template> -->
      <v-row class="ma-0 mx-6 pa-0">
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
                v-if="editMode === 1 || (editMode !== 1 && showIndexFields[1])"
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
                    @changeText="(value) => (genericRecord[`${f.id}`] = value)"
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
                      :type="$h.dg(typeToComponentMapping[f.type], 'type', '')"
                    />
                  </div>
                </template>
              </div>
              <v-btn
                v-if="
                  showIndexFields[index + 2] && f.type !== 'referencedRecord'
                "
                class="accent-4 green ml-2 mt-4 text--accent-2 white--text"
                icon
                @click="saveValues(index + 2)"
              >
                <v-icon size="18"> mdi-check </v-icon>
              </v-btn>
              <v-btn
                v-if="hover && !showIndexFields[index + 2] && editMode !== 1"
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
        <!-- <v-col class="ma-0 mt-3 pa-0" :cols="12">
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
        </v-col> -->
      </v-row>

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
    <m6-loading :loading="loading" />
  </v-form>
</template>

<script>
/* eslint-disable camelcase */
import AddField from "@/components/AppBuilder/Buttons/AddField";
import Field from "@/components/AppBuilder/Modals/Field";

import { VTextField, VAutocomplete } from "vuetify/lib";
import DatePicker from "@/components/AppBuilder/Form/Components/DatePicker.vue";
import RadioBtnOptions from "@/components/AppBuilder/Form/Components/RadioBtnOptions.vue";
import TriBtnOptions from "@/components/AppBuilder/Form/Components/TriBtnOptions.vue";
import AppAttachment from "@/components/AppBuilder/Form/Components/Attachment.vue";
import PeopleAutocomplete from "@/components/AppBuilder/Form/Components/PeopleAutocomplete.vue";
import TextField from "@/components/AppBuilder/Form/Components/TextField.vue";
import FieldIcon from "@/components/AppBuilder/Form/Components/BuilderFieldIcon";
import FieldTooltip from "@/components/AppBuilder/Form/Components/FieldTooltip";
import FieldForm from "@/components/AppBuilder/Form/Components/FieldV2";
import TaxonomyTermSelector from "@/components/AppBuilder/Form/Components/TaxonomyTermSelector";
import ReferencedRecord from "@/components/AppBuilder/Form/Components/ReferencedRecord";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import GMap from "@/components/_partials/GMap";
import axios from "axios";
import { cloneDeep } from "lodash";

import ProgressiveFieldSwitch from "@/components/AppBuilder/Form/Components/ProgressiveFieldSwitch";

export default {
  name: "FormShowGenerator",
  components: {
    AddField,
    Field,
    VTextField,
    DatePicker,
    AppAttachment,
    VAutocomplete,
    RadioBtnOptions,
    TriBtnOptions,
    PeopleAutocomplete,
    GMap,
    TaxonomyTermSelector,
    TextField,
    FieldIcon,
    FieldTooltip,
    FieldForm,
    ReferencedRecord,
    ProgressiveFieldSwitch,
  },

  props: {
    fields: {
      type: Array,
      default: () => [],
    },

    isFromFeedManager: {
      type: Boolean,
      default: false,
    },

    panel: {
      type: Object,
      default: () => ({}),
    },

    showStandardFields: {
      type: [Boolean, Number, String],
      default: false,
    },
    recordID: {
      type: Number,
      default: 0,
    },
    table: {
      type: Object,
      default: () => ({}),
    },
    inheritedEditMode: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    stepperShow: {
      // only for stepper view
      type: Boolean,
      default: false,
    },
    activateStepperSave: {
      // only for stepper view
      type: Boolean,
      default: false,
    },
    filledInFields: {
      // only used in stepper view
      type: Boolean,
      default: false,
    },
    showOuterLabels: {
      // only used in stepper view
      type: Boolean,
      // eslint-disable-next-line vue/no-boolean-default
      default: true,
    },
    actionRecord: {
      type: Boolean,
      default: false,
    },
    helperMediaURL: {
      type: String,
      default: "",
    },
  },

  data: () => ({
    standardFields: {},
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
    genericRecord: {},
    formRules: {
      standard: [(v) => !!v || "This field is required"],
    },
    loading: false,
    isEdit: false,
    typesToIds: {},
    complexDataStructs: { autocomplete: true, people: true },
    recordToEdit: {},
    statusOptions: ["Published", "Draft", "Archived"],
    recordsByAppsList: {},
    showIndexFields: [],
    editMode: 0,
    tableRowID: 0,
    taxonomyValues: {},
    referenceRecordsIds: {}, // map[field.id] record.id // record that, the ref field is refering to
    referenceFieldsIds: {}, // map[field.id] field.id // id of field that is being refered to
    below: false,
    orderedFields: [],
    activeField: {},
    defaultField: {
      // eslint-disable-next-line camelcase
      // panel_id: this.panel.id,
      label: "New Field",
      type: "text",
      weight: 0,
      metadata: {
        options: [],
        required: false,
        position: 1,
      },
      // eslint-disable-next-line camelcase
      referenced_field: null,
    },
    showFieldModal: false,
    editing: false,
  }),

  computed: {
    ...mapState("RecordsInstance", {
      currentRecord: "currentRecord",
      showSelf: "displayAppBuilderShow",
    }),
    ...mapGetters("Companies", {
      currentCompanyUsers: "getCurrentCompanyUsers",
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
    requiredFilled() {
      const filled = Object.keys(this.genericRecord).filter(
        (val) => this.genericRecord[val] && this.requiredFieldIds.includes(val)
      );
      return (
        (this.requiredFieldIds.length > 0 &&
          filled.length == this.requiredFieldIds.length) ||
        this.requiredFieldIds.length == 0
      );
    },
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
    data: {
      // for table view
      handler: function (value) {
        const val = { ...value };
        if (!Object.keys(val).length) return;
        this.typesToIds = { ...val.metadata.typesToIds };
        this.tableRowID = val.metadata.tableRowID;
        delete val.metadata;
        this.isEdit = true;
        this.genericRecord = { ...val };
        this.fields.map((autoNum) => {
          if (autoNum.type === "autonumber") {
            this.genericRecord[autoNum.id] = this.generateTableAutoNum(autoNum);
          }
        });
      },
      immediate: true,
    },
    activateStepperSave: {
      handler: function (val) {
        if (val) {
          this.updating();
        }
      },
      immediate: true,
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
    ...mapActions("AppBuilder", {
      bulkSaveFieldValues: "bulkSaveFieldValues",
      getFieldValuesPerPanel: "getFieldValuesPerPanel",
      updateSomeFieldValues: "updateSomeFieldValues",
      deleteFieldsByIds: "deleteFieldsByIds",
      recordsByApps: "recordsByApps",
      getSingleRecordFieldValue: "getSingleRecordFieldValue",
      moveField: "moveField",
    }),
    ...mapMutations("SnackBarNotif", {
      notifDanger: "notifDanger",
      notifSuccess: "notifSuccess",
    }),
    ...mapActions("AppBuilder", {
      updateRecord: "updateRecord",
    }),

    addNewField() {
      this.defaultField.panel = this.panel.id;
      this.activeField = {
        ...cloneDeep(this.defaultField),
        weight: this.panel.fields.length,
      };
      this.editing = false;
      this.showFieldModal = true;
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
    },

    showProgressiveByValue(conditionAnswer, answer) {
      const stringAnswer = Boolean(answer) ? "Yes" : "No";
      return stringAnswer === conditionAnswer;
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

        //  Insert Progressive Fields if condition's satisfied
        this.handleProgressiveFields(
          newGenericRecord,
          this.fields,
          this.progressiveFields,
          this.builderFields
        );

        const ids = this.fields.map((f) => f.id);
        const res = await this.getFieldValuesPerPanel({
          recordID: this.$route.params.id || this.recordID,
          panelID: this.panel.id,
          ids,
        });
        this.typesToIds = res.typesToIds;
        this.notifSuccess("The values were updated");
        this.loading = false;
        this.$emit("closing", {
          ...this.genericRecord,
          below_sub_total: this.below,
        });
      } catch (e) {
        this.notifDanger("There was an error while updated");
        this.loading = false;
      }
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

          this.loading = false;
        } catch (e) {
          this.loading = false;
        }
      }
      this.$emit("updateRequiredFilled", {panelId: this.panel.id, valid: this.requiredFilled})
    },

    async changingRefValue(record, field) {
      const fieldID = field.metadata.originalReference.id;
      try {
        const res = await this.getSingleRecordFieldValue({
          currentRecordID: this.recordID || this.$route.params.id,
          referenceRecordID: record.id,
          fieldID,
          refID: field.id,
        });
        const genericRecord = { ...this.genericRecord };

        switch (true) {
          case this.$h.dg(field, "metadata.originalReference.type") ===
            "timestamp":
            genericRecord[`${field.id}`] = this.$h.dg(res, "0.value", "");
            break;

          default:
            genericRecord[`${field.id}`] = res.value;
            break;
        }

        this.genericRecord = { ...genericRecord };
        this.referenceRecordsIds[field.id] = record.id;
      } catch (e) {
        this.notifDanger(
          "There was an error while getting a reference fields value"
        );
      }
    },
    saveValues(index) {
      this.$set(this.showIndexFields, index, false);
      this.updating();
    },
    genNumber(value, format) {
      if (format === "currency") {
        return (
          "$" +
          parseFloat(value)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        );
      } else {
        return parseFloat(value);
      }
    },
    getTriValue(value) {
      if (value === 1) {
        return "Yes";
      } else if (value === 0) {
        return "No";
      } else {
        return "N/A";
      }
    },
    genTimestamp(value, format) {
      if (format) {
        const date = new Date(value);
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        const hour = ("0" + date.getHours()).slice(-2);
        const min = ("0" + date.getMinutes()).slice(-2);
        const sec = ("0" + date.getSeconds()).slice(-2);
        switch (format) {
          case "mm/dd/YYYY":
            return `${month}/${day}/${year}`;
          case "mm/dd/YYYY H:m:s":
            return `${month}/${day}/${year} ${hour}:${min}:${sec}`;
          case "dd/mm/YYYY H:m:s":
            return `${day}/${month}/${year} ${hour}:${min}:${sec}`;
        }
      } else {
        return value;
      }
    },
    genPeopleValue(peopleArray) {
      const name = [];
      if (Array.isArray(peopleArray)) {
        peopleArray.map((row) => {
          const res = this.currentCompanyUsers.find(
            (u) => this.$h.dg(u, "user.id", "") === row
          );
          name.push(
            this.$h.dg(res, "user.firstName", "") +
              " " +
              this.$h.dg(res, "user.lastName", "")
          );
        });
        return name.join(", ");
      }
      return peopleArray;
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
    async changedTaxonomy(termId, termName, genId) {
      this.taxonomyValues[`${genId}`] = termName;
      this.genericRecord[`${genId}`] = termId;
    },
    generateTableAutoNum(autoNum) {
      if (!this.tableRowID) return null
      const auto = '0000000' + this.tableRowID
      return `${autoNum.metadata.autoNumberPrefix}#${auto.slice(-7)}-${new Date().getFullYear()}`
    }
  }
}
</script>

<style lang="scss">
.buttonTop {
  top: -25px !important;
}
.full-size {
  height: 100%;
  width: 100%;
}
.w-20r {
  width: 20rem;
}
.rapImg {
  width: 20rem !important;
  height: auto !important;
}
.custom-flex-stepper {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  .custom-flex-stepper-items {
    width: 100%;
  }
}
.stepper-label {
  font-size: 1.5rem;
  color: rgb(58, 58, 58);
}
.w-20 {
  width: 20% !important;
}
/* Text Align in Record */
.centered-input {
  fieldset {
    padding: 0 !important;
    legend {
      text-align: center !important;
    }
  }
  .v-label {
    left: 50% !important;
    transform: translateX(-50%);
    transform-origin: top 50%;
    &.v-label--active {
      transform: translateY(-18px) scale(0.75) translateX(-50%);
    }
  }
  input {
    text-align: center;
  }
}

.righted-input {
  fieldset {
    padding-right: 8px;
    legend {
      text-align: right !important;
    }
  }
  .v-label {
    left: 100% !important;
    transform: translateX(-100%);
    transform-origin: top 50%;
    &.v-label--active {
      transform: translateY(-18px) scale(0.75) translateX(-100%);
    }
  }
  input {
    text-align: right;
  }
}
</style>

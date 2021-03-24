<template>
  <v-dialog
    v-model="show"
    persistent
    :scrollable="!loading"
    :width="loading ? '400px' : '90%'"
  >
    <v-card v-if="loading" color="primary" dark class="rounded-lg">
      <v-card-text>
        Please stand by
        <v-progress-linear class="mb-0" color="white" indeterminate />
      </v-card-text>
    </v-card>
    <v-card v-else class="elevation-0 rounded-lg">
      <v-card-title>
        <template v-if="editing"> Edit Field: {{ field.label }} </template>
        <template v-else> Create New Field </template>
      </v-card-title>
      <v-card-text class="mb-10">
        <v-container class="rounded-lg">
          <v-row>
            <v-col cols="12">
              <v-radio-group v-model="field.metadata.position" row>
                <v-radio
                  :key="1"
                  label="Field Position Left"
                  :value="1"
                ></v-radio>
                <v-radio
                  :key="2"
                  label="Field Position Center"
                  :value="2"
                ></v-radio>
                <v-radio
                  :key="3"
                  label="Field Position Right"
                  :value="3"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="field.label" label="Field Name" />
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="field.type"
                    item-text="label"
                    item-value="value"
                    :items="types"
                    label="Field Type"
                    @change="fieldTypeChanged"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-if="field.type !== 'number'"
                    v-model="field.metadata.helpText"
                    filled
                    label="Help Text"
                    rows="3"
                  />
                  <v-text-field
                    v-if="field.type === 'number'"
                    v-model="field.metadata.value"
                    label="Number Input"
                    type="number"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="field.machine_name"
                    label="Machine Name: Optional"
                  />
                </v-col>
                <v-col cols="12">
                  <v-checkbox
                    v-model="field.metadata.required"
                    color="red"
                    hide-details
                    label="Required"
                    value="red"
                  />
                </v-col>
                <v-col cols="12">
                  <v-checkbox
                    v-model="field.metadata.progressiveField"
                    color="red"
                    hide-details
                    label="Add Condition"
                    value="yes"
                  />
                </v-col>
                <v-col
                  v-if="field.type === 'number'"
                  cols="12"
                >
                  <v-checkbox
                    v-model="field.metadata.isRoundedNumber"
                    color="red"
                    hide-details
                    label="Add Rounded, No Decimals"
                    value="true"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col v-if="field.type === 'taxonomy'" cols="12">
                  <v-select
                    v-model="field.metadata.vocabulary"
                    item-text="title"
                    item-value="id"
                    :items="vocabularies"
                    label="Vocabulary"
                  />
                </v-col>
                <v-col v-if="field.type === 'timestamp'" cols="12">
                  <v-row justify="center">
                    <v-col cols="12" md="6">
                      <h2 class="font-weight-medium mb-5">
                        Language and region
                      </h2>
                      <v-select
                        v-model="field.metadata.languge"
                        filled
                        :items="languagesList"
                        label="Language"
                      />
                      <v-select
                        v-model="field.metadata.country"
                        filled
                        :items="countriesList"
                        label="Country"
                      />
                      <v-select
                        v-model="field.metadata.format"
                        filled
                        :items="dateFormats"
                        label="Date format"
                      />
                      <v-select
                        v-model="field.metadata.timeFormat"
                        filled
                        :items="timeFormats"
                        label="Time Format"
                      />
                    </v-col>
                  </v-row>
                  <v-row
                    justify="center"
                    class="px-10"
                  >
                    <v-col cols="6">
                      <!-- Date picker -->
                      <v-menu
                        ref="dateMenu"
                        v-model="datepickerMenu"
                        :close-on-content-click="false"
                        :return-value.sync="field.metadata.date"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="field.metadata.date"
                            label="Date picker"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="field.metadata.date"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="datepickerMenu = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.dateMenu.save(field.metadata.date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>

                    <v-col cols="6">
                      <!-- Time picker -->
                      <v-menu
                        ref="timeMenu"
                        v-model="timepickerMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="field.metadata.time"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="field.metadata.time"
                            label="Time picker"
                            prepend-icon="mdi-clock-time-four-outline"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="timepickerMenu"
                          v-model="field.metadata.time"
                          full-width
                          @click:minute="$refs.timeMenu.save(field.metadata.time)"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="timepickerMenu = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn text color="primary">
                            OK
                          </v-btn>
                        </v-time-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-col>
                <template v-if="field.type === 'autocomplete'">
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          v-model="field.metadata.min"
                          label="Min Values"
                          value="1"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="field.metadata.max"
                          label="Max Values"
                          value="1"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="6">
                        <v-checkbox
                          v-model="field.metadata.multiple"
                          label="Multiple Answers"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-radio-group
                          v-model="field.metadata.displayFormat"
                          mandatory
                        >
                          <v-radio
                            label="Comma Display"
                            value="comma"
                          />
                          <v-radio
                            label="Bullet Display"
                            value="bullet"
                          />
                          <v-img
                            width="30"
                            height="30"
                            contain
                            class="bullet-icon-img"
                            :src="field.metadata.bulletIcon"
                          />
                          <m6-upload
                            btn-button="purple"
                            @loading="uploadDialogLoading = !uploadDialogLoading"
                            @response="uploadBulletIcon"
                            v-if="field.metadata.displayFormat === 'bullet'"
                            class="bullet-icon-upload"
                          >
                            <v-icon
                              size="30"
                            >
                              mdi-cloud-upload
                            </v-icon>
                          </m6-upload>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                    <h4 class="mb-2">
                      Options
                    </h4>
                    <template v-for="(option, optIndex) in field.metadata.options">
                      <v-text-field
                        :key="optIndex"
                        v-model="field.metadata.options[optIndex]"
                        append-outer-icon="mdi-delete"
                        label="Option Name"
                        @click:append-outer="
                          removeOption(optIndex, field.metadata.options)
                        "
                      />
                    </template>
                    <v-btn class="pa-0" small text @click="pushOption">
                      Add Option
                    </v-btn>
                  </v-col>
                </template>
                <v-col v-if="field.type === 'referenced'" cols="12">
                  <treeselect
                    v-model="field.referenced_field"
                    :disable-branch-nodes="true"
                    :load-options="loadOptions"
                    :multiple="false"
                    :options="fieldList"
                    placeholder="Referenced Field"
                    value-format="object"
                  />
                </v-col>

                <!-- calculated field -->
                <v-col
                  v-if="field.type === 'calculated'"
                  class="pa-5"
                  cols="12"
                >
                  <!-- Result -->
                  <v-row class="align-center">
                    <v-col cols="3">
                      <h3>Set Value To:</h3>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        :value="calculatedValue"
                        readonly
                        label="Calculated Result"
                      />
                    </v-col>

                    <v-col cols="3">
                      <v-text-field
                        label="Unit"
                        readonly
                        :value="field.metadata.unit"
                        @click="isUnitModalOpen = true"
                      />
                    </v-col>
                  </v-row>

                  <!-- List of rows -->
                  <v-row
                    v-for="(item, idx) in field.metadata.formula"
                    :key="idx"
                  >
                    <v-col cols="12">
                      <v-row v-if="item.type === 'field-row'">
                        <v-col cols="4">
                          <v-select
                            v-model="item.operand1"
                            dense
                            item-text="label"
                            item-value="id"
                            :items="appFields"
                            label="Field"
                          />
                        </v-col>

                        <v-col cols="3">
                          <v-select
                            v-if="item.operand1 !== null"
                            v-model="item.operator"
                            dense
                            :items="
                              getOperatorsForField(getFieldById(item.operand1))
                            "
                            label="Operator"
                            outlined
                          />
                        </v-col>

                        <v-col cols="4">
                          <v-select
                            v-if="
                              item.operator !== '' &&
                              getFieldById(item.operand1).type ===
                                'autocomplete'
                            "
                            dense
                            @input="(value) => setFormulaSecondOperand(
                              'autocomplete',
                              item,
                              value
                            )"
                            :items="getFieldById(item.operand1).metadata.options"
                            label="Value"
                          />

                          <v-text-field
                            v-else-if="item.operator !== '' && getFieldById(item.operand1).type !== 'timestamp'"
                            dense
                            label="Value"
                            @input="(value) => setFormulaSecondOperand(
                              getFieldById(item.operand1).type === 'number' ? 'number' : 'text',
                              item,
                              value
                            )"
                            :type="getFieldById(item.operand1).type === 'number' ? 'number' : 'text'"
                          />
                        </v-col>

                        <v-spacer />

                        <v-col cols="1" v-if="idx > 0">
                          <v-btn depressed color="error" @click="removeFormulaItem(idx)">
                            <v-icon>mdi-trash-can</v-icon>
                          </v-btn>
                        </v-col>

                        <v-col
                          cols="12"
                          v-if="
                            getFieldById(item.operand1) &&
                              getFieldById(item.operand1).type === 'timestamp' &&
                              item.operator !== ''
                          "
                        >
                          <!-- Time stamp -->
                          <v-radio-group
                            v-model="item.operand2.type"
                            @change="(type) => onDateTimeDurationTypeChange(item, type)"
                            row
                            class="mb-5"
                          >
                            <v-radio
                              label="Date and time"
                              value="date"
                            ></v-radio>

                            <v-radio
                              label="Duration"
                              value="duration"
                            ></v-radio>
                          </v-radio-group>

                          <v-row
                            justify="center"
                            class="px-10"
                            v-if="item.operand2 && item.operand2.type === 'date'"
                          >
                            <!-- Date picker -->
                            <v-menu
                              ref="dateMenuu"
                              v-model="datepickerMenu"
                              :close-on-content-click="false"
                              :return-value.sync="item.operand2.date"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="item.operand2.date"
                                  label="Date picker"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="item.operand2.date"
                                no-title
                                scrollable
                              >
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="datePickerMenu = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.dateMenuu[0].save(item.operand2.date)"
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                            <!-- Time picker -->
                            <v-menu
                              ref="timeMenuu"
                              v-model="timepickerMenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              :return-value.sync="item.operand2.time"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="item.operand2.time"
                                  label="Time picker"
                                  prepend-icon="mdi-clock-time-four-outline"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-time-picker
                                v-if="timepickerMenu"
                                v-model="item.operand2.time"
                                full-width
                                @click:minute="$refs.timeMenuu[0].save(item.operand2.time)"
                              >
                                <v-spacer></v-spacer>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="timePickerMenu = false"
                                >
                                  Cancel
                                </v-btn>
                                <v-btn text color="primary">
                                  OK
                                </v-btn>
                              </v-time-picker>
                            </v-menu>
                          </v-row>

                          <v-row
                            justify="center"
                            class="px-10"
                            v-if="item.operand2 && item.operand2.type === 'duration'"
                          >
                            <v-col
                              cols="12"
                              md="4"
                              v-for="duration in durations"
                              :key="duration.label"
                            >
                              <v-text-field
                                :label="duration.label"
                                v-model="item.operand2[duration.label.toLowerCase()]"
                                outlined
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>

                      <v-row v-else>
                        <v-col cols="3">
                          <v-select
                            v-model="item.operator"
                            dense
                            :items="nonEmptyOperators"
                            label="Operator"
                            solo
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <v-btn color="primary" @click="addFormulaItem">
                        Add
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="field.type === 'attachment'" cols="12">
                  <v-select
                    v-model="field.metadata.attachmentOption"
                    item-text="text"
                    item-value="value"
                    :items="attachmentOption"
                    label="Attachment Option"
                  />
                  <v-file-input
                    counter
                    multiple
                    show-size
                    truncate-length="1"
                  />
                </v-col>
                <v-col
                  v-if="field.type === 'boolean'"
                  cols="12"
                >
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        v-model="field.metadata.booleanOption"
                        item-text="text"
                        item-value="value"
                        :items="booleanOption"
                        label="Yes/No Option"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                  v-if="field.type === 'trilean'"
                  cols="12"
                >
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        v-model="field.metadata.trileanOption"
                        item-text="text"
                        item-value="value"
                        :items="booleanOption"
                        label="Yes/No/NA Option"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-if="field.type === 'text'" cols="12">
                  <v-select
                    v-model="field.metadata.textOption"
                    item-text="text"
                    item-value="value"
                    :items="textOption"
                    label="Text Option"
                  />
                  <template v-if="field.metadata.textOption === 'textarea'">
                    <v-text-field
                      v-model="field.metadata.textOption_rows"
                      label="Number of rows"
                      type="number"
                      value="3"
                    />
                    <v-checkbox
                      v-model="field.metadata.textOption_auto_grow"
                      hide-details
                      label="Auto Grow"
                      value="true"
                    />
                  </template>
                </v-col>
                <v-col v-if="field.type === 'number'" cols="12">
                  <v-select
                    v-model="field.metadata.numberOption"
                    item-text="text"
                    item-value="value"
                    :items="numberOption"
                    label="Number Option"
                  />
                </v-col>
                <v-col v-if="field.type === 'autonumber'" cols="12">
                  <v-text-field
                    v-model="field.metadata.autoNumberPrefix"
                    label="Prefix"
                  />
                </v-col>
                <v-col v-if="field.type === 'helper-media'" cols="12">
                  <v-text-field
                    v-model="helperMedia.name"
                    prepend-icon="mdi-file-video-outline"
                    @click="() => $refs.fileInput.click()"
                  />
                  <input
                    v-show="false"
                    ref="fileInput"
                    accept="image/*, video/*, video/mp4, video/x-m4v, video/x-matroska"
                    single
                    type="file"
                    @change="onFilesChange"
                  />
                  <v-row v-if="helperMedia.type && helperMedia.url">
                    <v-col cols="12">
                      <template v-if="helperMedia.type.indexOf('image') !== -1">
                        <img
                          class="image-preview"
                          :src="helperMedia.url"
                          style="width: 100%; height: 100%"
                        />
                        <v-btn
                          class="absolute btn-chat-shadow ml-2 right-0 top-0 v-close-btn"
                          color="grey lighten-2"
                          fab
                          @click="helperMedia = {}"
                        >
                          <v-icon size="12"> mdi-close </v-icon>
                        </v-btn>
                      </template>
                      <template
                        v-else-if="helperMedia.type.indexOf('video') !== -1"
                      >
                        <video controls style="height: 100%; width: 100%">
                          <source
                            :src="helperMedia.url"
                            :type="helperMedia.type"
                          />
                          Your browser does not support the video tag.
                        </video>
                        <v-btn
                          class="absolute btn-chat-shadow ml-2 right-0 top-0 v-close-btn"
                          color="grey lighten-2"
                          fab
                          @click="helperMedia = {}"
                        >
                          <v-icon size="12"> mdi-close </v-icon>
                        </v-btn>
                      </template>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                  class="mt-4"
                  v-if="field.metadata.progressiveField === 'yes'"
                  cols="12"
                >
                  <span class="progressive-field__span">
                    Only show the current field if the below value is selected on the record
                  </span>
                  <v-autocomplete
                    class="mt-3"
                    v-model="field.metadata.progressiveFieldId"
                    item-text="label"
                    item-value="id"
                    :items="progressiveFieldItems"
                    label="Select Field"
                  />
                  <v-spacer />
                  <v-autocomplete
                    v-if="field.metadata.progressiveFieldId"
                    class="mt-3"
                    v-model="field.metadata.progressiveFieldValue"
                    :items="progressiveFieldValueItems"
                    label="Select Value"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col v-if="field.type === 'referencedToApp'" cols="12">
              <v-autocomplete
                v-model="field.referenced_app"
                item-text="label"
                item-value="appId"
                :items="appList"
                label="Referenced App"
              />
            </v-col>
            <v-col v-if="field.type === 'referencedRecord'" cols="12">
              <treeselect
                  v-model="field.metadata.referencedRecordSettings"
                  :disable-branch-nodes="true"
                  :load-options="loadOptions"
                  :multiple="true"
                  :options="fieldList"
                  placeholder="Referenced Record Settings"
                  value-format="object"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn v-if="editing" color="yellow" @click="copyField(field)">
          Copy Field
        </v-btn>
        <v-btn color="red" text @click="closeModal"> Cancel </v-btn>
        <v-btn color="blue" dark @click="saveField(field)"> Save </v-btn>
      </v-card-actions>
    </v-card>

    <m6-loading :loading="uploadDialogLoading" />

    <!-- Unit dialog -->
    <!-- Unit dialog -->
    <v-dialog v-model="isUnitModalOpen" max-width="600px" hide-overlay>
      <v-card>
        <v-card-title class="headline mb-5">
          Unit picker
        </v-card-title>
        <v-card-text>
          <v-tabs vertical v-model="unitTab">
            <v-tab clas>
              Number
            </v-tab>

            <v-tab>
              Date
            </v-tab>

            <v-tab>
              Duration
            </v-tab>
            <v-tab-item class="pl-10">
              <v-card flat class="rounded-lg">
                <v-card-text class="py-0">
                  <v-select
                    v-model="currencyUnit"
                    :items="currencyUnitItems"
                    label="Currency"
                    filled
                  ></v-select>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item class="pl-10">
              <v-card flat class="rounded-lg">
                <v-card-text class="py-0">
                  <v-select
                    v-model="dateUnit"
                    :items="dateUnitItems"
                    label="Date"
                    filled
                  ></v-select>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item class="pl-10">
              <v-card flat class="rounded-lg">
                <v-card-text class="py-0">
                  <v-select
                    v-model="durationUnit"
                    :items="durationUnitItems"
                    label="Duration"
                    filled
                  ></v-select>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
        <v-card-actions class="mt-10">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="isUnitModalOpen = false; storeUnit()">
            Done
          </v-btn>
          <v-btn color="danger" text @click="isUnitModalOpen = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions
} from 'vuex'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import { countries, languagesAll } from 'countries-list'
import { isEmpty } from 'lodash'
import moment from 'moment'
import axios from 'axios'

export default {
  name: "Field",
  props: {
    show: {
      default: false,
      required: true,
      type: Boolean,
    },
    editing: {
      default: false,
      required: true,
      type: Boolean,
    },
    field: {
      required: true,
      type: Object,
    },
    appFields: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      datepickerMenu: false,
      timepickerMenu: false,
      isUnitModalOpen: false,
      currencyUnitItems: [
        {
          value: 'dollar',
          text: 'Dollar ($)',
        },
        {
          value: 'euro',
          text: 'Euro (£)',
        },
      ],
      dateUnitItems: [
        {
          value: 'dd/mm/yyyy',
          text: '03/11/2021',
        },
        {
          value: 'full_date',
          text: 'Wednesday, March 14, 2021',
        },
      ],
      durationUnitItems: [
        {
          value: 'days',
          text: 'Days',
        },
        {
          value: 'months_days',
          text: 'Month and Days',
        },
        {
          value: 'years_months_days',
          text: 'Year and Month and Days',
        },
      ],
      durationUnit: '',
      dateUnit: '',
      currencyUnit: '',
      unitTab: '',
      dateOrDuration: 'date',

      durations: [
        {
          label: 'Years',
          value: '',
        },
        {
          label: 'Months',
          value: '',
        },
        {
          label: 'Days',
          value: '',
        },
        {
          label: 'Hours',
          value: '',
        },
        {
          label: 'Minutes',
          value: '',
        },
        {
          label: 'Seconds',
          value: '',
        },
      ],

      loading: true,
      uploadDialogLoading: false,
      dateFormats: ['31/12/2021', '12/31/2021', '2021-12-31'],
      timeFormats: ['1:00pm', '13:00'],
      countriesList: [],
      languagesList: [],
      vocabularies: [],
      attachmentOption: [
        { text: "General", value: "general" },
        { text: "Image", value: "image" },
      ],
      textOption: [
        { text: "Single Line", value: "singleLine" },
        { text: "Textarea", value: "textarea" },
      ],
      booleanOption: [
        { text: "Horizontal Alignment", value: "horizon" },
        { text: "Vertical Alignment", value: "vertical" },
      ],
      numberOption: [
        { text: "Genera", value: "genera" },
        { text: "Currency", value: "currency" },
      ],
      types: [
        { label: 'Text', value: 'text' },
        { label: 'Number', value: 'number' },
        { label: 'Auto Number', value: 'autonumber' },
        { label: 'DateTime', value: 'timestamp' },
        { label: 'People', value: 'people' },
        { label: 'Multiple Choice', value: 'autocomplete' },
        { label: 'Attachment', value: 'attachment' },
        { label: 'Yes / No', value: 'boolean' },
        { label: 'Yes / No / NA', value: 'trilean' },
        { label: 'Calculated Field', value: 'calculated' },
        { label: 'Reference Field', value: 'referenced' },
        { label: 'Reference App', value: 'referencedToApp' },
        { label: 'Referenced Record', value: 'referencedRecord' },
        { label: 'Address', value: 'autocomplete-address' },
        { label: 'Helper Media', value: 'helper-media' },
        { label: 'Taxonomy', value: 'taxonomy' },
        { label: 'Image Drop Area', value: 'imageDropArea' }
      ],
      fieldList: [],
      operators: {
        logical: ["AND", "OR"],
        math: ["+", "-", "/", "*"],
        equal: ["="],
        empty: [""],
      },
      panelFields: [],
      helperMedia: {},
      rerenderBackdoor: 0,
      progressiveFieldValueItems: ['Yes', 'No']
    }
  },
  computed: {
    ...mapState("AppBuilder", {
      currentApp: "app",
    }),
    appList() {
      return this.fieldList.filter(
        (row) => Number(row.appId) !== Number(this.currentApp.id)
      );
    },
    nonEmptyOperators() {
      return [
        ...this.operators.equal,
        ...this.operators.math
      ]
      return [...Object.values(this.operators)].flat()
    },

    calculatedValue() {
      this.rerenderBackdoor
      return this.calculate();
    },

    progressiveFieldItems() {
      return this.appFields.filter(row => row.type === 'boolean')
    }
  },

  watch: {
    "field.type": function (val) {
      if (val === "autocomplete") {
        this.field.metadata.multiple = true;
      }
    },
  },

  mounted() {
    // TODO: The available apps list should be on a global list on the store.
    axios
      .get(
        `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/dynamic_apps/apps`
      )
      .then((response) => {
        response.data.map((app) => {
          this.fieldList.push({
            id: app.title + app.id,
            appId: app.id,
            label: app.title,
            children: null,
          });
        });
        if (this.editing && this.field.type === "referenced") {
          // eslint-disable-next-line camelcase
          this.field.referenced_field = this.field.metadata.originalReference;
        }
        this.loading = false;
      });
    // Get a copy from types to available
    if (this.appFields) {
      this.panelFields = this.appFields.map(field => ({
        text: field.label
      }))
    }
    this.initVocabulary()
      .then((res) => {
        this.vocabularies = res
      })
      .catch((e) => {
        this.notifDanger('Can not fetch vocabularies')
      })

    // Language and countries list
    for (const key in languagesAll) {
      this.languagesList.push({
        value: languagesAll[key].name,
        text: `${languagesAll[key].name} (${languagesAll[key].native})`,
      })
    }

    for (const key in countries) {
      this.countriesList.push({
        value: countries[key].name,
        text: `${countries[key].name} (${countries[key].native})`,
      })
    }
  },

  methods: {
    ...mapGetters("Taxonomy", {
      getVocabulary: "getTaxonomyVocabulary",
    }),
    ...mapActions("Taxonomy", {
      initVocabulary: "setTaxonomyVocabularies",
    }),
    ...mapMutations("SnackBarNotif", {
      notifDanger: "notifDanger",
      notifSuccess: "notifSuccess",
    }),
    ...mapActions("AppAttachments", {
      setStreamFiles: "set_stream_attachments",
    }),
    deleteField() {},
    removeOption(index, item) {
      item.splice(index, 1);
    },
    uploadBulletIcon(data) {
      this.uploadDialogLoading = true
      if (data.ok) {
        this.field.metadata.bulletIcon = data.data.link
        this.notifSuccess('The icon was uploaded')
        this.uploadDialogLoading = false
      } else {
        this.uploadDialogLoading = false
        this.notifDanger('There was an error while uploading')
      }
    },
    verifyMachineName(txt) {
      const re = new RegExp("^[a-zA-Z0-9_]*$");
      const res = re.test(txt);
      return res;
    },
    async saveField(field, copyField = false) {
      try {
        if (
          field.machine_name &&
          !this.verifyMachineName(this.$h.dg(field, "machine_name", ""))
        ) {
          this.notifDanger(
            "A Machine Name Should Only Contain: Letters, Numbers or Underscores"
          );
          return;
        }

        // eslint-disable-next-line camelcase
        const postData = {
          id: field.id,
          // eslint-disable-next-line camelcase
          app_id: this.currentApp.id,
          // eslint-disable-next-line camelcase
          panel_id: field.panel_id,
          // eslint-disable-next-line camelcase
          table_id: field.table_id,
          weight: field.weight,
          metadata: field.metadata,
          type: field.type,
          label: field.label,
          // eslint-disable-next-line camelcase
          machine_name: field.machine_name,
        };

        if (field.type === "referenced") {
          postData.metadata.originalReference = field.referenced_field;
          // eslint-disable-next-line camelcase
          postData.referenced_field = field.referenced_field.id;
        } else {
          delete postData.referenced_field;
        }
        if (field.type === "referencedToApp") {
          postData.metadata.originalReference = this.appList.find(
            (row) => row.appId === field.referenced_app
          );
          // eslint-disable-next-line camelcase
          postData.referenced_app = field.referenced_app;
        } else {
          delete postData.referenced_app;
        }
        if (field.type === 'referencedRecord') {
          postData.metadata.referencedRecordSettings = field.metadata.referencedRecordSettings.map(field => ({
            label: field.label,
            app_id: field.app_id,
            id: field.id
          }))
        } else {
          delete postData.metadata.referencedRecordSettings
        }
        if (field.type !== "referenced" && field.type !== "referencedToApp") {
          delete postData.metadata.originalReference;
        }
        if (field.type === "helper-media") {
          const url = await this.setStreamFiles({
            files: this.helperMedia.file,
            headers: {
              "Content-Type": this.helperMedia["type"],
              "Content-Name": this.helperMedia["name"],
              "Stream-Id": this.currentApp.id,
              "Stream-type": "helper-media",
            },
          });
          postData.helperMediaURL = url.attachUrl;
        }
        if (this.editing && !copyField) {
          const data = await this.$store.dispatch(
            "AppBuilder/updateField",
            postData
          );
          this.notifSuccess("The Field Was Updated");
          this.$emit("result", data, false);
        } else if (!copyField) {
          const data = await this.$store.dispatch(
            "AppBuilder/saveField",
            postData
          );
          this.notifSuccess("The Field Was Created");
          this.$emit("result", data, false);
        } else {
          const data = await this.$store.dispatch(
            "AppBuilder/saveField",
            postData
          );
          this.notifSuccess("The Field Was Created");
          this.$emit("result", data, true);
        }
      } catch (e) {
        let msg = "There was an error.";
        if (field.machine_name)
          msg += " Remember that the Machine Name Must Be Unique";
        this.notifDanger(msg);
      }
    },

    async copyField(field) {
      const a = {
        label: field.label,
        metadata: field.metadata,
        panel_id: field.panel_id,
        referenced_field: field.referenced_field,
        type: field.type,
        weight: field.weight,
      };
      this.saveField(a, true);
    },

    addFormulaItem() {
      this.field.metadata.formula.push({
        type: "operator-row",
        operator: "",
      });
      this.field.metadata.formula.push({
        type: "field-row",
        operand1: null,
        operator: '',
        operand2: {}
      })
    },

    getOperatorsForField(field) {
      if (field.type === 'number') {
        return [...this.operators.empty, ...this.operators.math]
      } else if (field.type === 'timestamp') {
        return ['+', '-']
      }
    },

    fieldTypeChanged(type) {
      if (type === 'calculated' && !this.field.metadata.formula) {
        const formula = [{
          type: 'field-row',
          operand1: null,
          operator: '',
          operand2: {}
        }]
        this.$set(this.field.metadata, "formula", formula);
      }
    },

    getFieldById(id) {
      return this.appFields.find(f => f.id === id)
    },

    confirmDelete(field) {
      this.$store.dispatch("AppBuilder/deleteField", field.id);
    },
    closeModal() {
      this.$emit("close");
    },
    pushOption() {
      if (!this.field.metadata.options) {
        this.field.metadata.options = [];
      }
      this.field.metadata.options.push("New Option");
    },

    loadOptions({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        axios
          .post(
            `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/app-builder/field/list/all`,
            {
              appId: parseInt(parentNode.appId),
              nested: true,
            }
          )
          .then((response) => {
            parentNode.children = this.normalizeNested(response.data);
            callback();
          });
      }
    },

    normalizeNested(tabs) {
      return tabs.map((tab) => {
        // TODO: Improve validation for fields without a panel.
        if (!tab.panels && tab.type) {
          tab.label = "Field: " + tab.label;
          return tab;
        }
        tab.label = "Tab: " + tab.title;
        tab.id = tab.title + tab.id;
        tab.children = tab.panels.map((panel) => {
          panel.label = "Panel: " + panel.title;
          panel.id = panel.title + panel.id;
          panel.children = panel.fields
            .filter((field) => field.type !== "referenced")
            .map((field) => {
              field.label = "Field: " + field.label;
              return field;
            });
          return panel;
        });
        return tab;
      });
    },

    cleanMetadata() {
      this.field.metadata = {
        options: [],
        required: false,
      };
    },

    onFilesChange(files) {
      const file = files["srcElement"]["files"][0];
      if (file) {
        const type = file["type"].substr(0, file["type"].indexOf("/"));
        if (type === "image" || type === "video") {
          this.helperMedia = {
            file: file,
            url: URL.createObjectURL(file),
            type: file["type"],
            name: file["name"],
          };
        }
      }
    },
    calculate() {
      if (this.field.type !== 'calculated') {
        return;
      }

      const findField = (id) => {
        return this.appFields.find(f => f.id === id)
      }

      const formula = this.field.metadata.formula
      if (!formula[0] || !formula[0].operand1 || !formula[0].operand2 || isEmpty(formula[0].operand2)) {
        return;
      }

      const type = findField(formula[0].operand1)?.type;

      if (type === 'number') {
        function operate(sop1, sop2, operator) {
          const op1 = parseInt(sop1, 10)
          if (!sop2 || !operator) {
            return op1
          }

          const op2 = parseInt(sop2, 10)

          switch (operator) {
            case '+':
              return op1 + op2;

            case '-':
              return op1 - op2;

            case '*':
              return op1 * op2;

            case '/':
              return op1 / op2;
          }
        }

        let result = operate(
          findField(formula[0].operand1).metadata.value,
          formula[0].operand2.value,
          formula[0].operator
        )

        for (let i = 2; i < formula.length; i += 2) {
          if (!formula[i].operand1 || !formula[i].operand2) {
            return
          }

          const stepResult = operate(
            findField(formula[i].operand1).metadata.value,
            formula[i].operand2.value,
            formula[i].operator
          )

          result = operate(result, stepResult, formula[i - 1].operator)
        }

        switch (this.field.metadata.unit) {
          case 'dollar':
            return `$${result}`;

          case 'euro':
            return `£${result}`;

          default:
            return result;
        }
      } else if (type === 'timestamp') {
        function operate(op1, op2, operator) {
          switch (operator) {
            case '+':
              return op1.add(op2)

            case '-':
              if (!moment.isDuration(op1) && !moment.isDuration(op2)) {
                return moment.duration(op1.diff(op2))
              } else {
                return op1.subtract(op2)
              }
          }
        }

        function toMoment(info) {
          if (info.type === 'duration') {
            return moment.duration({
              years: info.years || 0,
              months: info.months || 0,
              days: info.days || 0,
              hours: info.hours || 0,
              minutes: info.minutes || 0,
              seconds: info.seconds || 0,
            })
          } else {
            if (!info.time || !info.date) {
              return moment()
            }

            const [hours, minutes] = info.time.split(':')
            return moment(info.date, "YYYY-MM-DD").add({ hours, minutes })
          }
        }

        let result = operate(
          toMoment({ type: 'datetime', ...findField(formula[0].operand1).metadata }),
          toMoment(formula[0].operand2),
          formula[0].operator
        )

        for (let i = 2; i < formula.length; i += 2) {
          if (!formula[i].operand1 || !formula[i].operand2) {
            return
          }

          const stepResult = operate(
            toMoment(findField(formula[i].operand1)),
            toMoment(formula[i].operand2),
            formula[i].operator
          )

          if (i > 0) {
            result = operate(result, stepResult, formula[i - 1].operator)
          }

          result = stepResult
        }

        if (moment.isDuration(result)) {
          switch (this.field.metadata.unit) {
            case 'days':
              return `${Math.floor(result.asDays())} days`

            case 'months_days':
              return `${Math.floor(result.asMonths())} months and ${result.days()} days`

            case 'years_months_days':
              return `${Math.floor(result.asYears())} years and ${result.months()} months ${result.days()} days`

            default:
              return result.toISOString().toLowerCase().replace(/[pt]/g, '')
          }
        } else {
          switch (this.field.metadata.unit) {
            case 'dd/mm/yyyy':
              return `${result.format("DD/MM/YYYY")}`;

            case 'full_date':
              return `${result.format("dddd, MMMM DD, YYYY")}`;

            default:
              return result.toISOString();
          }
        }
      }
    },

    setFormulaSecondOperand(type, item, value) {
      item.operand2 = {
        type,
        value,
      }
    },

    onDateTimeDurationTypeChange(item, type) {
      if (type === 'duration') {
        item.operand2 = {
          type,
          years: null,
          months: null,
          days: null,
          hours: null,
          minutes: null,
          seconds: null
        }
      } else {
        item.operand2 = {
          type,
          date: null,
          time: null
        }
      }
    },

    storeUnit() {
      if (this.unitTab === 0 && this.currencyUnit) {
        this.field.metadata.unit = this.currencyUnit
      } else if (this.unitTab === 1 && this.dateUnit) {
        this.field.metadata.unit = this.dateUnit
      } else if (this.unitTab === 2 && this.durationUnit) {
        this.field.metadata.unit = this.durationUnit
      }

      this.rerenderBackdoor++
    },

    removeFormulaItem(idx) {
      this.field.metadata.formula.splice(idx - 1, idx)
    }
  }
}
</script>
<style lang="scss" scoped>
.bullet-icon-upload {
  position: absolute;
  right: 0;
  bottom: 2px;
}
.bullet-icon-img {
  position: absolute;
  right: 45px;
  bottom: 5px;
}
</style>

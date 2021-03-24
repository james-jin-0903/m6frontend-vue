<template>
  <v-dialog
    v-model="show"
    max-width="50rem"
    persistent
    scrollable
  >
    <input
      v-show="false"
      id="files"
      ref="files"
      type="file"
      @change="handleFilesUpload"
    >

    <v-card class="contact-edit-modal rounded-lg">
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">
          <template
            v-show="tab === 0"
          >
            {{ $t('cpm.projects.editProjectInfo') }}
          </template>
          <template
            v-show="tab === 1"
          >
            {{ $t('cpm.projects.editProjectDetails') }}
          </template>
        </span>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-tabs
        v-model="tab"
        centered
        color="#0277bd"
        dark
        fixed-tabs
      >
        <v-tab>
          <span />
          &nbsp;{{ $t('general.information') }}
        </v-tab>
        <v-tab>
          <span />
          &nbsp;{{ $tc('general.detail', 2) }}
        </v-tab>
      </v-tabs>

      <v-card-text class="card-text vertical-scroll">
        <v-tabs-items v-model="tab">
          <!-- Project info -->
          <v-tab-item>
            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="shrink">
                      <label
                        v-if="!project.projectImage"
                        class="btn_add_file"
                        for="files"
                      >
                        <i class="fa fa-plus" />
                        {{ $t('cpm.projects.addProjectImage') }}
                      </label>

                      <label
                        v-else
                        class="btn_add_file"
                        for="files"
                      >
                        <i class="fa fa-plus" />
                        {{ $t('cpm.projects.changeProjectImage') }}
                      </label>
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-avatar
                  v-if="project.projectImage"
                  size="60"
                >
                  <img :src="project.projectImage">
                </v-avatar>

                <v-btn
                  v-if="!project.projectImage"
                  class="photo-button"
                  color="success"
                  @click="openUploadPhoto"
                >
                  {{ $t('cpm.projects.uploadAPhoto') }}
                </v-btn>

                <v-btn
                  v-if="project.projectImage"
                  class="photo-button"
                  color="error"
                  @click="deletePhoto"
                >
                  {{ $t('cpm.projects.deletePhoto') }}
                </v-btn>
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $tc('general.project', 1) }}
                      {{ $t('general.number') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-text-field v-model="project.number" />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $tc('general.project', 1) }}
                      {{ $tc('general.title', 1) }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-text-field
                  v-model="project.title"
                  color="blue"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('cpm.projects.editProjectTeam') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-autocomplete
                  v-model="project.manager"
                  clearable
                  item-text="label"
                  :items="sortedProjectManager"
                  :label="$t('general.projectManager')"
                  return-object
                >
                  <template v-slot:item="{ item }">
                    {{ item.label }}
                  </template>
                  <template slot="no-options">
                    {{ $t('cpm.projects.typeSearchUsers') }}
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3" />

              <v-col cols="7">
                <v-autocomplete
                  id="teamMembers"
                  clearable
                  item-text="label"
                  :items="roleUsers"
                  :label="$t('cpm.projects.teamMembers')"
                  multiple
                  :value="project.teamMembers"
                  @input="setSelected"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip
                      close
                      :style="getStyleRoleUser(item)"
                      @input="$delete(project.teamMembers, index)"
                    >
                      {{ item.label }}
                    </v-chip>
                  </template>

                  <template v-slot:item="{ item }">
                    <div class="chip-member">
                      <strong>{{ item.user }}</strong>
                      <br>
                      {{ item.role }}, {{ item.email }}
                    </div>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3" />

              <v-col cols="7">
                <v-autocomplete
                  v-model="project.sponsor"
                  clearable
                  hide-no-data
                  item-text="realname"
                  :items="usersByCompany"
                  :label="$t('cpm.projects.sponsor')"
                  return-object
                >
                  <template
                    v-if="usersByCompany && usersByCompany.length === 0"
                    v-slot:prepend-inner
                  >
                    <v-progress-circular
                      color="primary"
                      indeterminate
                    />
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $tc('general.project', 1) }}
                      {{ $t('general.description') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-textarea
                  v-model="project.description"
                  color="blue"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('cpm.projects.budget') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <money
                  v-bind="money"
                  color="blue"
                  disabled
                  :value="budgetTotal"
                />

                <span class="edit-budget-button">
                  {{ $t('cpm.projects.editBudgetTab') }}
                </span>
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('cpm.projects.budget') }}
                      {{ $t('general.status') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-select
                  v-model="project.status"
                  clearable
                  :items="settings.status"
                >
                  <template slot="no-data">
                    {{ $t('cpm.projects.typeSearchStatus') }}
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <!--
            <v-layout
              align-center
              justify-center
              row
            >
              <v-flex xs3>
                <div class="font-weight-black subheading">
                  <v-layout>
                    <v-flex shrink>
                      {{ $t('cpm.projects.currentFYProposedSpend') }}
                    </v-flex>
                  </v-layout>
                </div>
              </v-flex>

              <v-flex xs7>
                <money
                  v-model="project.proposedSpend"
                  v-bind="money"
                />
              </v-flex>
            </v-layout>
            -->
            <div
              v-for="(fy, index) in fiscalYears"
              :key="'fiscalYear-' + index"
            >
              <v-row
                v-if="fy.show"
                class="align-center d-flex justify-center"
              >
                <v-col cols="3">
                  <div class="font-weight-black subheading">
                    <v-row>
                      <v-col class="align-center d-flex text-nowrap">
                        {{ $t('cpm.projects.proposedSpend') }} {{ fy.name }}
                      </v-col>
                    </v-row>
                  </div>
                </v-col>

                <v-col cols="7">
                  <money
                    v-model="fy.amount"
                    v-bind="money"
                  />
                </v-col>
              </v-row>
            </div>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('cpm.projects.generalContractor') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-autocomplete
                  v-model="selectedContractor"
                  append-outer-icon="add"
                  :append-outer-icon-cb="addContractorList"
                  attach
                  clearable
                  hide-no-data
                  item-text="title"
                  item-value="nid"
                  :items="vendorOptions"
                  return-object
                />
              </v-col>
            </v-row>

            <v-row
              v-if="selectedContractors.length > 0"
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      Contractor List
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <v-row
                  align="center"
                >
                  <v-col cols="6">
                    Company Name
                  </v-col>
                  <v-col cols="6">
                    Company Type
                  </v-col>
                </v-row>
                <v-row
                  v-for="(item, index) in selectedContractors"
                  align="center"
                >
                  <v-col cols="6">
                    {{ item.title }}
                  </v-col>
                  <v-col cols="6">
                    <v-autocomplete
                      v-model="item.companyType"
                      clearable
                      item-text="name"
                      :items="companyTypes"
                      return-object
                      @click:clear="$nextTick(() => item.companyType=null)"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      % {{ $t('general.complete') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-slider
                  v-model="project.completion"
                  color="blue"
                  thumb-label="always"
                />
              </v-col>
            </v-row>
          </v-tab-item>
          <!-- End project info -->

          <!-- Project details -->
          <v-tab-item>
            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('cpm.projects.phase') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-select
                  v-model="project.phase"
                  clearable
                  :items="lodash.sortBy(settings.phases)"
                >
                  <template slot="no-data">
                    {{ $t('cpm.projects.typeSearchPhase') }}
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('cpm.projects.phaseTargetDate') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-menu
                  ref="menu2"
                  v-model="phaseDatePicker"
                  :close-on-content-click="false"
                  full-width
                  lazy
                  max-width="20.625rem"
                  min-width="20.625rem"
                  :nudge-right="40"
                  offset-y
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="project.phaseTargetDateText"
                      hint="MM/DD/YYYY format"
                      :label="
                        `${$t('cpm.projects.phase')} ${$t('general.date')}`
                      "
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      v-on="on"
                    />
                  </template>

                  <v-date-picker
                    v-model="project.phaseTargetDate"
                    no-title
                    @input="phaseDatePicker = false"
                  />
                </v-menu>
              </v-col>
            </v-row>

            <v-row
              v-if="!$h.dg(hideFields, 'projectDetails.projectType.hide')"
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('cpm.projects.projectType') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-select
                  v-model="project.projectType"
                  clearable
                  :items="lodash.sortBy(settings.projectTypes)"
                >
                  <template
                    slot="option"
                    slot-scope="option"
                  >
                    {{ option.label }}
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('general.campus') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-select
                  v-model="project.campus"
                  clearable
                  item-text="name"
                  :items="lodash.sortBy(campusOptions)"
                  return-object
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="7">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('cpm.projects.addressSamecampus') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="3">
                <v-checkbox
                  v-model="project.sameAsCampusAddress"
                  :disabled="!typeof project.campus === 'object'"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $tc('general.category', 1) }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-select
                  v-model="project.category"
                  clearable
                  :items="lodash.sortBy(settings.categories)"
                >
                  <template slot="no-options">
                    {{ $t('cpm.projects.typeSearchCategories') }}
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('cpm.projects.squareFootage') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-text-field
                  v-model="project.squareFootage"
                  clearable
                  color="blue"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('general.regulatory') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-select
                  v-model="project.license"
                  clearable
                  :items="lodash.sortBy(settings.licenses)"
                  multiple
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('cpm.projects.fyApproved') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-select
                  v-model="project.fyApproved"
                  clearable
                  item-text="name"
                  :items="settings.fyApproved"
                  return-object
                >
                  <template slot="no-data">
                    {{ $t('cpm.projects.typeSearchFyApproved') }}
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('general.risk') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-select
                  v-model="project.priority"
                  clearable
                  item-value="value"
                  :items="priorities"
                />
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('cpmSettings.settings.projOptions.covid19Risk') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-autocomplete
                  v-model="project.covidRiskStatus"
                  clearable
                  item-text="name"
                  :items="covidRiskStatus"
                  :label="$t('general.status')"
                  return-object
                >
                  <template v-slot:selection="{ item, parent, selected }">
                    <v-chip
                      v-if="$h.dg(item, 'color')"
                      :color="item.color"
                      dark
                      label
                      :selected="selected"
                      small
                    >
                      <span class="pr-2">
                        {{ item.name }}
                      </span>
                    </v-chip>
                  </template>

                  <template v-slot:item="{ index, item }">
                    <v-list-tile-content>
                      <v-chip
                        :color="$h.dg(item, 'color')"
                        dark
                        label
                        small
                      >
                        {{ item.name }}
                      </v-chip>
                    </v-list-tile-content>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('cpm.projects.projectAddress') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-text-field
                  v-if="
                    typeof project.address === 'object' &&
                      project.address.item &&
                      project.sameAsCampusAddress
                  "
                  v-model="project.address.item.address"
                  color="blue"
                  :disabled="project.sameAsCampusAddress"
                />

                <v-text-field
                  v-else
                  v-model="project.address"
                  color="blue"
                />
              </v-col>
            </v-row>

            <v-row
              v-if="!$h.dg(hideFields, 'projectDetails.projectCreator.hide')"
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t('cpm.projects.projectCreator') }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col
                v-show="!editCreator"
                cols="4"
              >
                {{ $h.dg(project, 'creator.label', '') }}
              </v-col>

              <v-col
                v-show="editCreator"
                cols="4"
              >
                <v-autocomplete
                  v-model="project.creator"
                  clearable
                  item-text="label"
                  :items="itemsCreators"
                  :loading="isLoadingCreators"
                  placeholder="Start typing to Search"
                  return-object
                  :search-input.sync="searchCreators"
                />
              </v-col>

              <v-col cols="3">
                <v-checkbox
                  v-model="editCreator"
                  label="Edit creator"
                />
              </v-col>
            </v-row>
          </v-tab-item>
          <!-- End project details -->
        </v-tabs-items>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="$emit('close')"
        >
          {{ $t('general.close') }}
        </v-btn>

        <v-btn
          color="primary"
          :loading="showLoading"
          text
          @click="update"
        >
          {{ $t('general.update') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <m6-loading :loading="showLoading" />
    <msg
      :color="'blue'"
      :show="showMsg"
      :text="msgText"
      :title="msgTitle"
      @close="showMsg = false"
    />
  </v-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'
import { mapState, mapActions, mapGetters } from 'vuex'
import { Money } from 'v-money'
import Msg from './Msg'

export default {
  name: 'CPMEdit',
  components: {
    money: Money,
    msg: Msg
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'project'
    }
  },

  data() {
    return {
      hideFields: {
        projectDetails: {
          projectCreator: { label: 'Project Creator', hide: true },
          projectType: { label: 'Project Type', hide: true }
        }
      },
      tab: 0,
      viewPortHeight:
        Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        ) * 0.6,
      showLoading: false,
      company_nid: this.currentCompany.id,
      settings: {},
      project: {},
      budgetTotal: 0,
      campusOptions: [],
      selectedContractors: [],
      selectedContractor: {},
      phaseDatePicker: false,
      standards: [],
      files: [],
      comments: [],
      users: [],
      companyUsers: [],
      roles: [],
      showMsg: false,
      projectManager: [],
      msgText: '',
      msgTitle: '',
      showAddTeamMembers: false,
      serverParams: {
        columnFilters: {},
        sort: {
          field: 'name',
          type: 'asc'
        },
        page: 1,
        paginatilon: false
      },
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '$',
        precision: 2,
        masked: false
      },
      company_settings: {},
      searchCreators: '',
      isLoadingCreators: false,
      editCreator: false,
      priorities: [
        { text: this.$t('general.low'), value: 'green' },
        { text: this.$t('general.medium'), value: 'yellow' },
        { text: this.$t('general.high'), value: 'red' }
      ],
      fiscalYears: []
    }
  },

  computed: {
    ...mapGetters(['appLabel']),
    ...mapGetters({
      vendorOptions: 'itApplications/getVendors'
    }),
    ...mapGetters('companies/cpmProjects/settings', {
      covidRiskStatus: 'getCovidRiskStatus'
    }),
    ...mapGetters('itApplications', ['usersByCompany']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    itemsCreators() {
      return this.users.filter(
        user =>
          user.label.includes(this.searchCreators) ||
          user.email.includes(this.searchCreators)
      )
    },
    companyTypes() {
      if (this.$h.dg(this.company_settings, 'company_types')) {
        const companies = this.company_settings.company_types

        companies.sort((a, b) => {
          if (a.name > b.name) {
            return 1
          }
          if (a.name < b.name) {
            return -1
          }
          // a must be equal to b
          return 0
        })

        return companies
      }
      return []
    },
    settingCollectionName() {
      if (this.type === 'forecasted') {
        return 'planned_settings'
      } else {
        return 'settings'
      }
    },
    sortedProjectManager() {
      let aux = []
        .concat(
          this.$h.dg(this, 'companyUsers.projectManager', []),
          this.$h.dg(this, 'companyUsers.projectCoordinator', [])
        )
        .flat()
      aux = this.lodash.orderBy(aux, 'label', 'asc')

      return aux
    },

    teamMembers() {
      const aux = []

      if (this.project.manager) {
        const manager = { ...this.project.manager }
        manager.type = 'manager'
        manager.user = manager.label
        aux.push(manager)
      }

      if (this.project.teamMembers && this.project.teamMembers.length > -1) {
        this.project.teamMembers.forEach(teamMemberId => {
          const user = this.roleUsers.find(
            roleUser => roleUser.value === teamMemberId
          )

          if (user) {
            const userAux = { ...user }
            userAux.type = 'member'
            aux.push(userAux)
          }
        })
      }

      if (aux.length > 0) {
        const ids = this.getIds(aux)
        this.getImages(ids)
      }

      return aux
    },

    roleUsers() {
      const aux = []
      if (this.roles && this.roles.roles && this.roles.roles.length > 0) {
        this.roles.roles.map(role => {
          role.users.map(user => {
            const auxObject = {
              role: role.name,
              user: user.label,
              email: user.email,
              label: user.label + ' - ' + role.name,
              color: role.color && role.color.hex ? role.color.hex : '#E0E0E0',
              value: user.value
            }
            if (role.vendorRole !== undefined) {
              auxObject.vendorRole = role.vendorRole
            }

            aux.push(auxObject)
          })
        })
      }
      return aux
    }
  },

  watch: {
    searchCreators() {
      // Items have already been loaded
      if (this.itemsCreators.length > 0) return

      // Items have already been requested
      if (this.isLoadingCreators) return

      this.isLoadingCreators = true
      fetch(`/fm-dev/users/search/${escape(this.searchCreators)}`)
        .then(res => res.json())
        .then(json => {
          this.users = json
          this.isLoadingCreators = false
        })
    },

    'project.startDate': function (newVal) {
      this.project.startDateText = this.parseDate(newVal)
    },

    'project.endDate': function (newVal) {
      this.project.endDateText = this.parseDate(newVal)
    },

    'project.phaseTargetDate': function (newVal) {
      this.project.phaseTargetDateText = this.parseDate(newVal)
    },

    'project.sameAsCampusAddress': function (newValue) {
      if (newValue && typeof this.project.campus === 'object') {
        this.project.address = this.project.campus
      } else if (newValue && Array.isArray(this.project.campus)) {
        this.project.address = this.project.campus[0]
      } else if (!newValue) {
        this.project.address = ''
      }
    },

    'project.campus': function () {
      if (this.project.sameAsCampusAddress) {
        this.project.address = this.project.campus
      }
    },

    roleUsers: function () {
      if (this.roles && this.roles.roles && this.roles.roles.length > 0) {
        this.roles.roles.map(role => {
          role.users.map(user => {
            const auxObject = {
              role: role.name,
              user: user.label,
              email: user.email,
              label: user.label + ' - ' + role.name,
              color: role.color && role.color.hex ? role.color.hex : '#E0E0E0',
              value: user.value
            }
            if (role.vendorRole !== undefined) {
              auxObject.vendorRole = role.vendorRole
            }

            if (role.name === 'Project Coordinator') {
              if (!this.projectManager) {
                this.projectManager = []
              }
              this.projectManager.push(auxObject)
            }
          })
        })
      }
    },

    settings() {
      let projectNumber = null
      if (this.$h.dg(this.settings, 'nextProjectNumber')) {
        projectNumber = this.settings.nextProjectNumber
      }

      if (!projectNumber) {
        projectNumber = 1
        db.collection('settings')
          .doc('projects')
          .update({ nextProjectNumber: parseInt(projectNumber) })
      }
      let idString = '00000' + projectNumber
      idString = idString.substr(idString.length - 5)
      const year = new Date().getFullYear()
      this.project.number = `PRJ-${idString}-${year}`
      this.campusOptions = []
      if (this.$h.dg(this.settings, 'campus') && this.settings.campus.length) {
        this.settings.campus.forEach(cl1 => {
          const itemName = cl1.abbr ? `(${cl1.abbr}) ${cl1.name}` : cl1.name
          this.campusOptions.push({
            item: cl1,
            name: itemName,
            levelName: cl1.name,
            levelAbbr: cl1.abbr,
            level: 1
          })
          if (cl1.lvl_1.length) {
            cl1.lvl_1.forEach(cl2 => {
              let itemL2Name = itemName + ' > '
              itemL2Name += cl2.abbr ? `(${cl2.abbr}) ${cl2.name}` : cl2.name
              this.campusOptions.push({
                item: cl1,
                itemL2: cl2,
                name: itemL2Name,
                levelName: cl2.name,
                levelAbbr: cl2.abbr,
                level: 2
              })
              if (cl2.lvl_2.length) {
                cl2.lvl_2.forEach(cl3 => {
                  let itemL3Name = itemL2Name + ' > '
                  itemL3Name += cl3.abbr
                    ? `(${cl3.abbr}) ${cl3.name}`
                    : cl3.name
                  this.campusOptions.push({
                    item: cl1,
                    itemL2: cl2,
                    itemL3: cl3,
                    name: itemL3Name,
                    levelName: cl3.name,
                    levelAbbr: cl3.abbr,
                    level: 3
                  })
                })
              }
            })
          }
        })

        this.campusOptions.sort((a, b) => a.name.localeCompare(b.name))
      }
    },
    selectedContractors: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.project.contractor = newVal
        }
      }
    }


  },

  created() {
    this.fetchUsersByCompany()
  },

  firestore() {
    return {
      comments: db
        .collection('cpm_projects')
        .doc(this.$route.params.id)
        .collection('comments'),
      hideFields: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('fields'),
      companyUsers: db
        .collection('settings')
        .doc(this.company_nid)
        .collection(`${this.settingCollectionName}`)
        .doc(this.appLabel.usersCollection),
      roles: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('roles'),
      company_settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('company_types')
    }
  },

  mounted() {
    this.module = this.$route.path.search('cpm/') !== -1 ? 'cpm' : 'it'
    this.getSettings()
    this.getBudget()
    this.getStandards()
    this.getProject()

    if (!this.covidRiskStatus.length) {
      this.fetchCovidRiskStatus()
    }
    this.getFiscalYears()
  },

  methods: {
    ...mapActions('companies/cpmProjects/settings', {
      fetchCovidRiskStatus: 'fetchCovidRiskStatus'
    }),
    ...mapActions('itApplications', ['fetchUsersByCompany']),
    openUploadPhoto() {
      this.$refs.files.click()
    },
    addContractorList() {
      if (this.selectedContractor.length > 0) {
        this.$snotify.error(
          this.$t('cpm.projects.errorAddingContractor'),
          this.$t('alerts.error')
        )
        this.selectedContractor = {}
        return
      }
      this.selectedContractors.push(this.selectedContractor)
      this.selectedContractor = {}
    },

    async deletePhoto() {
      await db
        .collection('cpm_projects')
        .doc(this.$route.params.id)
        .update({
          projectImage: ''
        })
      this.project.projectImage = ''
      this.$snotify.success(
        this.$t('cpm.projects.imageDeleted'),
        this.$t('alerts.success')
      )
    },

    setTab(tab) {
      if (tab < 0 || tab > 2) {
        return
      }
      this.tab = tab
    },

    getViewPortHeight() {
      return `${this.viewPortHeight}px`
    },

    getSettings() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection(`${this.settingCollectionName}`)
        .doc('projects')
        .get()
        .then(snap => {
          this.settings = snap.data()
          this.project.standard = this.settings.defaultStandard
        })
    },

    getBudget() {
      db.collection('cpm_projects')
        .doc(this.$route.params.id)
        .collection('budgets')
        .where('active', '==', true)
        .limit(1)
        .get()
        .then(res => {
          if (!res.empty) {
            this.budgetTotal = res.docs[0].data().total || 0
          }
        })
    },

    parseDate(date) {
      if (!date) return ''
      const [year, month, day] = date.split('T')[0].split('-')

      return `${month}/${day}/${year}`
    },

    getStandards() {
      db.collection('standards')
        .where('active', '==', true)
        .get()
        .then(rows => {
          for (const index in rows.docs) {
            const data = rows.docs[index].data()
            const row = {
              id: rows.docs[index].id,
              number: data.number,
              name: data.title,
              type: data.type,
              files: data.files,
              campus: data.campus,
              notes: data.notes,
              exhibit: data.exhibit,
              createdAt: '',
              updatedAt: '',
              version: data.version
            }
            this.standards.push(row)
          }
        })
    },

    handleFilesUpload() {
      this.files = this.$refs.files.files
      if (!this.files.length) return
      if (this.files[0].size <= 1048487) {
        this.createImage(this.files[0])
      } else {
        this.msgTitle = this.$t('cpm.projects.photoUploadError')
        this.msgText = this.$t('cpm.projects.uploadAPhotoMb')
        this.showMsg = true
      }
    },

    createImage(file) {
      const reader = new FileReader()
      const vm = this
      reader.onload = e => {
        vm.project.projectImage = e.target.result
        this.update(false)
      }
      reader.readAsDataURL(file)
    },

    showTeamMember(value) {
      this.showAddTeamMembers = value
    },

    setSelected(value) {
      this.project.teamMembers = value
      this.project.vendorTeamMembers = []
      value.map(u => {
        if (u.vendorRole !== undefined) {
          this.project.vendorTeamMembers.push(u.email)
        }
      })
      if (this.project.teamMembers.length === 0) {
        this.showTeamMember(false)
      }
    },

    getStyleRoleUser(option) {
      return {
        'background-color': option.color,
        'font-size': '10px'
      }
    },

    update(close = true) {
      if (this.project.startDate) {
        this.project.startDate = new Date(this.project.startDate).toISOString()
      }
      if (this.project.endDate) {
        this.project.endDate = new Date(this.project.endDate).toISOString()
      }
      if (this.project.phaseTargetDate) {
        this.project.phaseTargetDate = new Date(
          this.project.phaseTargetDate
        ).toISOString()
      }

      this.showLoading = true

      const project = {
        fyApproved: this.project.fyApproved || '',
        completion: this.project.completion || '',
        address: this.project.address || '',
        campus: this.project.campus || '',
        category: this.project.category || '',
        company_nid: this.project.company_nid || '',
        contractor: this.project.contractor || '',
        covidRiskStatus: this.project.covidRiskStatus || '',
        createdAt: this.project.createdAt || '',
        description: this.project.description || '',
        endDate: this.project.endDate || '',
        endDateText: this.project.endDateText || '',
        manager: this.project.manager || '',
        nextChangeNumber: this.project.nextChangeNumber || '',
        nextCommitmentNumber: this.project.nextCommitmentNumber || '',
        nextInvoiceNumber: this.project.nextInvoiceNumber || '',
        nextTaskNumber: this.project.nextTaskNumber || '',
        number: this.project.number || '',
        phase: this.project.phase || '',
        phaseTargetDate: this.project.phaseTargetDate || '',
        phaseTargetDateText: this.project.phaseTargetDateText || '',
        projectType: this.project.projectType || '',
        project_invoice_total: this.project.project_invoice_total || '',
        project_total_open_po_w_tax:
          this.project.project_total_open_po_w_tax || '',
        project_total_po_amount: this.project.project_total_po_amount || '',
        projectImage: this.project.projectImage || '',
        proposedSpend: this.project.proposedSpend || '',
        sameAsCampusAddress: this.project.sameAsCampusAddress || '',
        setDefaultSchedule: this.project.setDefaultSchedule || '',
        squareFootage: this.project.squareFootage || '',
        standard: this.project.standard || '',
        startDate: this.project.startDate || '',
        startDateText: this.project.startDateText || '',
        status: this.project.status || '',
        teamMembers: this.project.teamMembers || '',
        title: this.project.title || '',
        creator: this.project.creator || '',
        forecasted: this.project.forecasted || false,
        license: this.project.license || '',
        priority: this.project.priority || '',
        sponsor: this.project.sponsor || {},
        proposedFY: this.fiscalYears,
        searchTerms: this.getSearchTerms()
      }

      delete project.files

      db.collection('cpm_projects')
        .doc(this.$route.params.id)
        .set(project, { merge: true })
        .then(() => {
          this.showLoading = false
        })
        .catch(() => {
          this.$emit(this.$t('general.close'))
          this.$snotify.error(
            this.$t('general.thereErrorSaving'),
            this.$t('alerts.error')
          )
          return
        })

      // Clearing input
      this.$refs.files.value = ''

      this.$snotify.success(
        this.$t('general.theProjectUpdated'),
        this.$t('alerts.success')
      )

      if (close) {
        this.$emit('close')
      }
    },

    getProject() {
      db.collection('cpm_projects')
        .doc(this.$route.params.id)
        .get()
        .then(snapshot => {
          this.project = snapshot.data()
          this.selectedContractors = [...this.project.contractor]
        })
    },

    getSearchTerms() {
      const searchTerms = (this.project.title || '').toLowerCase().split(' ')
      searchTerms.push(this.project.number)

      return searchTerms
    },

    getFiscalYears() {
      const now = this.$moment()
      let actual = false
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
        .get()
        .then(fy => {
          const data = fy.data()
          let count = 1
          const fiscalYears = data.fiscalYears.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          this.fiscalYears = fiscalYears.map(fiscalY => {
            fiscalY.actualFY = false
            fiscalY.show = false
            fiscalY.amount = 0
            if (actual && count <= 2) {
              fiscalY.show = true
              count++
            }
            if (this.$moment(fiscalY.startDate) <= now && this.$moment(fiscalY.endDate) >= now) {
              fiscalY.actualFY = true
              fiscalY.show = true
              actual = true
            }
            if (this.project.proposedFY) {
              const find = this.project.proposedFY.find(f => f.value === fiscalY.value)
              if (find) {
                fiscalY.amount = find.amount
              }
            }
            return fiscalY
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.v-avatar {
  left: 50%;
  transform: translate(-50%);
}
.connected-indicator {
  font-size: 28px !important;
  width: 28px !important;
  position: absolute;
  top: 0;
  right: 0;
  height: 28px !important;
  color: #04d81a;
}
.contact-edit-modal {
  .v-card__title {
    padding: 0.625rem;
    background: #0277bd;
    color: #fff;
    h3 {
      font-weight: 100;
    }
  }
}
.v-select__selection {
  .v-select__selection--comma {
    background-color: rgb(166, 113, 113);
    font-size: 10.625rem;
  }
}
.address-fix {
  padding-left: 0.625rem !important;
}
.address-right-fix {
  padding-right: 1rem !important;
}

.card-text {
  height: 80vh;
}

.photo-button {
  float: right;
}

.edit-budget-button {
  color: grey;
}
</style>

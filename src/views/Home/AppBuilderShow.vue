<template>
  <div>
    <app-template
      :is-persistent="$route.name === 'record.show'"
      :nav-header="navHeader"
      :props-dialog="showSelf"
      :website="website"
      :ctmTop="85"
    >
      <div slot="navheader" class="navheader w-full">
        <div class="d-flex max-w-lg mx-auto w-full">
          <v-col class="d-flex navh relative">
            <div v-if="record.image">
              <v-img
                :alt="record.image"
                class="rounded"
                :src="record.image"
                style="width: 40px; height: 40px"
              />
            </div>
            <v-icon v-else size="40"> mdi-store </v-icon>
            <p
              class="mb-1 r-title text-h5"
              :style="`padding: 0 10px; overflow: hidden; text-overflow: ellipsis; color: ${headerTextColor}`"
            >
              {{ record.title }}
            </p>
            <v-menu bottom :offset-x="false" :offset-y="true">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" style="color: #1976d2" v-on="on">
                  <v-icon color="#1976d2"> mdi-chevron-right </v-icon>
                  {{ selectedItem }}
                </span>
              </template>
              <v-list>
                <!-- v-if="currentApp.tabs" -->
                <v-list-item
                  v-for="(item, index) in $h.dg(app, 'tabs', [])"
                  :key="`${index}-tabmenu`"
                  @click="currentTab = index"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
          <v-spacer />
          <v-col class="navh relative">
            <div
              class="align-center d-flex primary px-2 rounded"
              style="top: 10px"
            >
              <v-avatar size="30" style="margin-right: 10px">
                <img
                  v-if="currentApp.iconLink"
                  alt="John"
                  :src="currentApp.iconLink"
                />
                <v-icon v-else> mdi-store </v-icon>
              </v-avatar>
              {{ currentApp.title }}
            </div>
          </v-col>
        </div>
        <div class="absolute" style="right: 10px; top: 13px">
          <v-menu bottom left :offset-y="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" dark icon v-on="on">
                <v-icon color="black"> mdi-dots-vertical </v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="deletingRecord">
                <v-list-item-title>
                  <v-icon color="red" size="23"> mdi-delete </v-icon>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
      <v-card
        slot="header"
        class="d-flex justify-center r-header rounded-0 w-full"
        :color="headerBackgroundColor"
        flat
        :img="getBackground(app)"
      >
        <builder-header class="top-60">
          <template v-slot:zero-float>
            <v-btn
              absolute
              class="mr-5 pa-0 red white--text"
              dark
              fab
              left
              small
              style="top: 10px"
              top
              @click="$router.push('/records')"
            >
              <v-icon size="30"> mdi-close </v-icon>
            </v-btn>
          </template>

          <template v-slot:first-float>
            <app-activities-modal />
          </template>

          <template v-slot:second-float>
            <header-background-picker />
          </template>

          <template v-slot:third-float>
            <app-department-modal />
          </template>

        </builder-header>
        <builder-header class="top-60">
          <template v-slot:zero-float>
            <edit-app-modal />
            <!-- <v-btn
              absolute
              dark
              fab
              left
              small
              style="top: 280px"
              color="primary"
              top
            >
              <v-icon size="30"> mdi-pencil </v-icon>
            </v-btn> -->
          </template>
        </builder-header>
        <v-card
          class="align-center d-flex justify-space-between max-w-xl mx-auto relative rounded-0 w-full"
          :class="{ 'website-container': website }"
          color="transparent"
          flat
          :style="'height:fit-content;'"
        >
          <!-- <v-btn
            class="absolute"
            :class="{ 'mt-14': website }"
            color="grey darken-1"
            icon
            :style="'left: 0px; top: 0px;'"
            @click="$router.push('/records')"
          >
            <v-icon> mdi-arrow-left </v-icon>
          </v-btn> -->

          <div
            class="appinfo-div d-flex mx-auto relative w-full"
            :class="{ 'max-w-lg': !website, 'px-4': website }"
          >
            <v-col class="d-flex relative" cols="6" md="9">
              <placeholders />
            </v-col>
            <!-- <v-col class="d-flex relative" cols="6" md="9">
            <div class="app-img d-flex w-full">
              <div
                @mouseleave="showImageOptionButtons = false"
                @mouseover="showImageOptionButtons = true"
              >
                <v-img
                  v-if="record.image"
                  :alt="record.image"
                  class="rounded"
                  height="198"
                  :src="record.image"
                  width="198"
                />
                <v-icon
                  v-else
                  size="198"
                >
                  mdi-store
                </v-icon>

                <v-btn
                  v-if="showImageOptionButtons"
                  class="absolute align-center d-flex justify-center ml-3 mt-2 myupload primary rounded-circle top-2"
                  color="white"
                  icon
                  small
                  @click="pickFile"
                >
                  <v-icon size="15">
                    mdi-cloud-upload
                  </v-icon>
                </v-btn>
                <input
                  id="uploadCaptureInputFile"
                  ref="obj"
                  accept="image/*"
                  style="display: none"
                  type="file"
                  @change="onFilePicked"
                >

                <div
                  v-if="showImageOptionButtons"
                  class="absolute deletebtn ml-3 mt-2 rounded-circle"
                >
                  <v-btn
                    color="white"
                    icon
                    small
                    @click="deleteRecordImage"
                  >
                    <v-icon size="16">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </div>
              </div>
              <div
                class="my-auto w-full"
                :class="{
                  'pl-8': !website && $vuetify.breakpoint.smAndUp,
                  'pl-2 d-flex': website,
                  'pl-4': $vuetify.breakpoint.xs,
                }"
              >
                <div
                  v-if="!editTitleMode"
                  class="align-center d-flex relative w-fit"
                >
                  <p
                    class="mb-1 r-title text-h5"
                    :style="
                      'padding-right: 15px; overflow: hidden; text-overflow: ellipsis; color: ' +
                        headerTextColor +
                        ';'
                    "
                  >
                    {{ record.title }}
                  </p>
                  <v-btn
                    class="absolute bg-none edittitle pointer"
                    color="blue darken-3"
                    icon
                    small
                    @click="showEditTitleMode"
                  >
                    <v-icon size="25">
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </div>
                <div
                  v-else
                  class="d-flex"
                >
                  <v-textarea
                    v-model="updatedTitle"
                    auto-grow
                    class="mb-0"
                    label="Edit Title"
                    name="input-7-1"
                    outlined
                    @keyup.enter="editTitle"
                    @keyup.esc="cancelEditTitle"
                  />
                  <div class="d-flex flex-column">
                    <v-btn
                      class="ml-2"
                      color="red"
                      icon
                      @click="cancelEditTitle"
                    >
                      <v-icon size="22">
                        mdi-close
                      </v-icon>
                    </v-btn>
                    <v-btn
                      class="ml-2"
                      color="green accent-3"
                      :disabled="record.title === updatedTitle"
                      icon
                      @click="editTitle"
                    >
                      <v-icon size="22">
                        mdi-check
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
                <p
                  v-if="!website && $vuetify.breakpoint.smAndUp"
                  class="font-weight-light mb-1 recordnumber-text text-h7"
                  :style="'color: ' + headerTextColor + ';'"
                >
                  {{ record["record_number"] }}
                </p>

                <div
                  v-if="
                    app.fields &&
                      app.fields.length > 0 &&
                      $vuetify.breakpoint.smAndUp
                  "
                >
                  <form-show-generator
                    :action-record="true"
                    :fields="headerFields"
                    :helper-media-u-r-l="helperMediaURL"
                  />
                </div>
              </div>
            </div>
          </v-col> -->
            <v-col class="align-center d-flex" md="3">
              <div class="mt-3">
                <p
                  class="mb-1 r-title text-h5"
                  :style="`padding: 0 10px; overflow: hidden; text-overflow: ellipsis; color: ${headerTextColor}`"
                >
                  {{ record.title }}
                </p>
              </div>
              <div class="">
                <v-img
                  v-if="app.iconLink"
                  :alt="app.iconLink"
                  contain
                  height="80px"
                  :src="app.iconLink"
                  :style="'margin: 0 auto'"
                  width="80px"
                />
                <v-avatar
                  v-else
                  class="d-inline-block"
                  :color="iconData.background"
                  size="70"
                >
                  <v-icon :color="iconData.iconColor" size="70">
                    {{ iconData.icon }}
                  </v-icon>
                </v-avatar>
              </div>
            </v-col>
            <v-col
              class="relative"
              :class="{ 'd-flex': website }"
              cols="6"
              md="3"
            >
              <div v-if="$vuetify.breakpoint.xs">
                <p
                  v-if="!website"
                  class="font-weight-light mb-1 recordnumber-text text-h7"
                  :style="'color: ' + headerTextColor + ';'"
                >
                  {{ record["record_number"] }}
                </p>
              </div>
              <div v-if="website" class="align-center d-flex ml-3">
                <div v-if="website" class="d-flex">
                  <v-tabs
                    v-model="currentTab"
                    active-class="font-weight-black active-tab-company"
                    :hide-slider="true"
                  >
                    <v-tab
                      v-for="(tab, i) in $h.dg(app, 'tabs', [])"
                      :key="`tabs-${i}`"
                      class="capitalize"
                    >
                      {{ tab.title }}
                    </v-tab>
                  </v-tabs>
                </div>
                <v-btn class="ml-10 mr-2" depressed> Log in </v-btn>
                <v-btn class="ml-2" color="primary" depressed> Sign up </v-btn>
              </div>
              <div
                v-if="website"
                slot="btns"
                class="align-center d-flex relative"
              >
                <v-menu
                  bottom
                  class="absolute"
                  left
                  :offset-y="true"
                  :style="'right: 10px; top: 10px;'"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" dark icon v-on="on">
                      <v-icon color="black"> mdi-dots-vertical </v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="deletingRecord">
                      <v-list-item-title>Delete Record</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-col>

            <m6-loading :loading="loading" />

            <m6-confirm-delete
              message="Are you sure you want to delete this record?"
              :show="showDeleteDialog"
              title="Delete Current Record"
              @cancel="cancelDelete"
              @confirm="confirmDelete"
            />
          </div>
        </v-card>
      </v-card>
      <div
        v-if="!website"
        slot="tabs"
        class="d-flex align-center tabs-container"
      >
        <v-tabs
          v-model="currentTab"
          active-class="font-weight-black active-tab-company"
          :hide-slider="true"
        >
          <v-tab
            v-for="(tab, i) in $h.dg(app, 'tabs', [])"
            :key="`tabs-${i}`"
            class="capitalize"
          >
            {{ tab.title }}
          </v-tab>
        </v-tabs>
        <add-tab
          :layout-type="app.layout_type"
          @addNewTab="addNewTab"
          v-if="app != {}"
        />
      </div>
      <div v-if="!website" slot="btns" class="align-center d-flex relative">
        <v-menu
          bottom
          class="absolute"
          left
          :offset-y="true"
          :style="'right: 10px; top: 10px;'"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" dark icon v-on="on">
              <v-icon color="black"> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="deletingRecord">
              <v-list-item-title>
                <v-icon color="red" size="23"> mdi-delete </v-icon>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div v-if="navHeader" :style="'width:100%; height:120px'" />
      <div
        v-for="(tab, i) in $h.dg(app, 'tabs', [])"
        v-show="i === currentTab"
        :key="`tab-item-${i}`"
        slot="content"
        class="w-full"
      >
        <panel-two-columns
          :left-column="tab.full_width || $vuetify.breakpoint.xs ? 12 : 5"
          :right-column="tab.full_width || $vuetify.breakpoint.xs ? 12 : 7"
          :website="true"
          v-if="tab.columns <= 2"
        >
          <div slot="leftPanel">
            <required-summary
              :fields="getNonBlocking(i)"
              :helper-media-u-r-l="helperMediaURL"
              :tab="tab"
              class="mb-2"
              v-if="i > 0 && getNonBlocking(i).length"
              @updateRecord="addNonBlockingRecord"
            />
            <expansion-panel
              :active-tab="currentTab"
              :column="0"
              :helper-media-u-r-l="helperMediaURL"
              :tab="tab"
              @updateRecord="addRecord(tab.id, $event)"
              @updateTabPanels="updateTabPanels"
            />
            <v-expansion-panels v-model="expansionPanelLeft" multiple>
              <v-expansion-panel
                v-for="(panel, index) in panelsByColumn(
                  $h.dg(tab, 'panels', []),
                  0
                )"
                :key="`p-l-${index}`"
              >
                <v-expansion-panel-header disable-icon-rotate>
                  <h3
                    class="w-full"
                    :class="{
                      'text-center': panel.column === 2,
                      'text-right': panel.column === 1,
                    }"
                    v-if="panelEditId != panel.id"
                  >
                    {{ panel.title }}
                  </h3>
                  <div v-else>
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
                            panelEditId = null;
                            panelEdit = false;
                          "
                        >
                          Cancel
                        </v-btn>
                        <v-spacer />
                        <v-btn color="green" dark @click="updatingPanel">
                          Save
                        </v-btn>
                      </div>
                    </div>
                  </div>
                  <template v-slot:actions v-if="panelEditId != panel.id">
                    <v-btn icon right top @click="deletePanel(panel)">
                      <v-icon color="red lighten-3"> mdi-delete </v-icon>
                    </v-btn>
                    <v-btn icon right top @click="editPanel(panel)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <form-show-generator
                    :action-record="true"
                    :fields="headerFields"
                    :helper-media-u-r-l="helperMediaURL"
                    :panel="panel"
                    :show-standard-fields="tab.readOnly && index === 0"
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
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <div class="d-flex justify-center my-2">
              <add-panel @addNewPanel="addNewPanel(0)" />
              <copy-panel @copyPanel="copyPanelFromApp(0)" />
            </div>
          </div>
          <div v-if="!tab.full_width" slot="rightPanel">
            <div v-if="currentTab === 0" class="main-content px-0">
              <project-social-media class="px-0" :external="true" />
            </div>
            <div v-else>
              <expansion-panel
                :active-tab="currentTab"
                :column="1"
                :helper-media-u-r-l="helperMediaURL"
                :tab="tab"
                @updateRecord="addRecord(tab.id, $event)"
                @updateTabPanels="updateTabPanels"
              />
              <div class="d-flex justify-center my-2">
                <add-panel @addNewPanel="addNewPanel(1)" />
                <copy-panel @copyPanel="copyPanelFromApp(1)" />
              </div>
            </div>
          </div>
        </panel-two-columns>
        <panel-three-columns :website="true" v-if="tab.columns === 3">
          <div slot="leftPanel">
            <required-summary
              :fields="getNonBlocking(i)"
              :helper-media-u-r-l="helperMediaURL"
              :tab="tab"
              class="mb-2"
              v-if="i > 0 && getNonBlocking(i).length"
              @updateRecord="addNonBlockingRecord"
            />
            <expansion-panel
              :active-tab="currentTab"
              :column="0"
              :helper-media-u-r-l="helperMediaURL"
              :tab="tab"
              @updateRecord="addRecord(tab.id, $event)"
              @updateTabPanels="updateTabPanels"
            />
            <div class="d-flex justify-center my-2">
              <add-panel :sm="true" @addNewPanel="addNewPanel(0)" />
              <copy-panel :sm="true" @copyPanel="copyPanelFromApp(0)" />
            </div>
          </div>

          <div slot="centerPanel">
            <expansion-panel
              :active-tab="currentTab"
              :column="2"
              :helper-media-u-r-l="helperMediaURL"
              :tab="tab"
              @updateRecord="addRecord(tab.id, $event)"
              @updateTabPanels="updateTabPanels"
            />
            <div class="d-flex justify-center my-2">
              <add-panel @addNewPanel="addNewPanel(2)" />
              <copy-panel @copyPanel="copyPanelFromApp(2)" />
            </div>
          </div>

          <div slot="rightPanel">
            <div>
              <expansion-panel
                :active-tab="currentTab"
                :column="1"
                :helper-media-u-r-l="helperMediaURL"
                :tab="tab"
                @updateRecord="addRecord(tab.id, $event)"
                @updateTabPanels="updateTabPanels"
              />
              <div class="d-flex justify-center my-2">
                <add-panel :sm="true" @addNewPanel="addNewPanel(1)" />
                <copy-panel :sm="true" @copyPanel="copyPanelFromApp(1)" />
              </div>
            </div>
          </div>
        </panel-three-columns>
        <panel-four-columns :website="true" v-if="tab.columns === 4">
          <div slot="leftPanel">
            <required-summary
              :fields="getNonBlocking(i)"
              :helper-media-u-r-l="helperMediaURL"
              :tab="tab"
              class="mb-2"
              v-if="i > 0 && getNonBlocking(i).length"
              @updateRecord="addNonBlockingRecord"
            />
            <expansion-panel
              :active-tab="currentTab"
              :column="0"
              :helper-media-u-r-l="helperMediaURL"
              :tab="tab"
              @updateRecord="addRecord(tab.id, $event)"
              @updateTabPanels="updateTabPanels"
            />
            <div class="d-flex justify-center my-2">
              <add-panel :sm="true" @addNewPanel="addNewPanel(0)" />
              <copy-panel :sm="true" @copyPanel="copyPanelFromApp(0)" />
            </div>
          </div>

          <div slot="leftCenterPanel">
            <expansion-panel
              :active-tab="currentTab"
              :column="2"
              :helper-media-u-r-l="helperMediaURL"
              :tab="tab"
              @updateRecord="addRecord(tab.id, $event)"
              @updateTabPanels="updateTabPanels"
            />
            <div class="d-flex justify-center my-2">
              <add-panel :sm="true" @addNewPanel="addNewPanel(2)" />
              <copy-panel :sm="true" @copyPanel="copyPanelFromApp(2)" />
            </div>
          </div>
          <div slot="rightCenterPanel">
            <expansion-panel
              :active-tab="currentTab"
              :column="3"
              :helper-media-u-r-l="helperMediaURL"
              :tab="tab"
              @updateRecord="addRecord(tab.id, $event)"
              @updateTabPanels="updateTabPanels"
            />
            <div class="d-flex justify-center my-2">
              <add-panel :sm="true" @addNewPanel="addNewPanel(3)" />
              <copy-panel :sm="true" @copyPanel="copyPanelFromApp(3)" />
            </div>
          </div>

          <div slot="rightPanel">
            <div>
              <expansion-panel
                :active-tab="currentTab"
                :column="1"
                :helper-media-u-r-l="helperMediaURL"
                :tab="tab"
                @updateRecord="addRecord(tab.id, $event)"
                @updateTabPanels="updateTabPanels"
              />
              <div class="d-flex justify-center my-2">
                <add-panel :sm="true" @addNewPanel="addNewPanel(1)" />
                <copy-panel :sm="true" @copyPanel="copyPanelFromApp(1)" />
              </div>
            </div>
          </div>
        </panel-four-columns>
      </div>
    </app-template>
    <m6-loading :loading="loading" />
    <v-dialog v-model="showDeleteModal" width="500">
      <delete-dialog :element="'Panel'" @closeDeleteModal="confirmDelete" />
    </v-dialog>
    <v-dialog v-model="showConfirmDialog" width="500">
      <confirm-dialog
        :message="confirmMessage"
        :ok-label="`Yes`"
        :cancel-label="'No'"
        @closeDeleteModal="confirmDialog"
      ></confirm-dialog>
    </v-dialog>
    <copy-panel-dialog
      v-if="copyPanelDialog"
      :show="copyPanelDialog"
      @copy="copyPanelFromAnotherApp"
      @close="copyPanelDialog = false"
    />
  </div>
</template>

<script>
import AppTemplate from "@/views/Home/AppTemplate";
import AddTab from "@/components/AppBuilder/Buttons/AddTab";
import ProjectSocialMedia from "./ProjectSocialMedia";
import PanelTwoColumns from "@/components/AppBuilder/Content/PanelTwoColumns";
import PanelThreeColumns from "@/components/AppBuilder/Content/PanelThreeColumns";
import PanelFourColumns from "@/components/AppBuilder/Content/PanelFourColumns";

import AddPanel from "@/components/AppBuilder/Buttons/AddPanel";
import CopyPanel from "@/components/AppBuilder/Buttons/CopyPanel.vue";
import CopyPanelDialog from "@/components/AppBuilder/Modals/CopyPanel.vue";

import BuilderHeader from "@/components/BuilderComponents/BuilderHeader";
import AppActivitiesModal from "@/components/BuilderComponents/Modals/AppActivitiesModal";
import AppDepartmentModal from "@/components/BuilderComponents/Modals/AppDepartmentModal";
import HeaderBackgroundPicker from "@/components/BuilderComponents/Modals/HeaderBackgroundPicker";
import Placeholders from "@/components/BuilderComponents/Placeholders";
import DefaultFields from "@/components/BuilderComponents/DefaultFields";
import EditAppModal from "@/components/BuilderComponents/Modals/EditAppModal";
import ExpansionPanel from "@/components/AppBuilder/Content/ExpansionPanel";
import PanelShow from "@/components/AppBuilder/Content/PanelShow";
import RequiredSummary from "@/components/AppBuilder/Content/RequiredSummary";

import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import FormShowGenerator from "@/components/AppBuilder/Form/FormShowGenerator.vue";
import DeleteDialog from "@/components/Dialogs/DeleteDialog";
import ConfirmDialog from "@/components/Dialogs/ConfirmDialog";
import GeneratedTable from "@/components/AppBuilder/GenericTable/GeneratedTable";
import { debounce } from "lodash";
import CommitmentsStatusVue from "../../modules/cpm/components/settings/components/settings/CommitmentsStatus.vue";

export default {
  name: "AppBuilderShow",
  components: {
    AddPanel,
    AppTemplate,
    AddTab,
    AppActivitiesModal,
    AppDepartmentModal,
    BuilderHeader,
    CopyPanel,
    CopyPanelDialog,
    DefaultFields,
    EditAppModal,
    HeaderBackgroundPicker,
    ProjectSocialMedia,
    PanelTwoColumns,
    PanelThreeColumns,
    PanelFourColumns,
    Placeholders,
    FormShowGenerator,
    DeleteDialog,
    ConfirmDialog,
    GeneratedTable,
    ExpansionPanel,
    PanelShow,
    RequiredSummary,
  },
  data() {
    return {
      tabs: [],
      currentTabRef: 0,
      editTitleMode: false,
      updatedTitle: "",
      loading: false,
      currentApp: {},
      showDeleteDialog: false,
      headerBackgroundColor: "#fff",
      headerTextColor: "#aaa",
      helperMediaURL: "",
      tabItems: ["Home", "People", "Finance", "Files"],
      selectedItem: "Home",
      isDelVerClicked: false,
      scrollTop: 0,
      navHeader: false,
      expansionPanelLeft: [0, 1, 2, 3, 4, 5],
      editPanelMode: false,
      showImageOptionButtons: false,
      copyPanelDialog: false,
      copySide: 0,
      showDeleteModal: false,
      showConfirmDialog: false,
      panelEdit: false,
      panelEditId: null,
      panelToDelete: null,
      clonePanel: {},
      genericRecord: {},
      confirmMessage: "",
      tabToGo: null,
    };
  },
  computed: {
    ...mapGetters("Fields", {
      allRequiredFilled: "allValid",
    }),
    ...mapGetters("Companies", {
      currentCompany: "getCurrentCompany",
    }),

    ...mapGetters("RecordsInstance", {
      record: "getRecord",
      showSelf: "getDisplayAppBuilderShow",
    }),

    ...mapState("AppBuilder", {
      app: "app",
      iconData: "iconData",
    }),
    currentTab: {
      get() {
        return this.currentTabRef;
      },
      set(val) {
        if (val > this.currentTabRef) {
          if (this.checkValid(this.tabs[this.currentTabRef].id)) {
            const skippable = this.getNonBlocking(this.currentTabRef);
            console.log(skippable);
            if (skippable.length && !this.tabToGo) {
              this.showConfirmDialog = true;
              this.tabToGo = val;
              this.confirmMessage = `
              Skip required fields for now?
              fields: ${skippable.map((val) => val.label).join(", ")}
              `;
            } else {
              this.currentTabRef = val;
              this.setCurrentTab(val);
              this.setActiveTab(this.tabs[val]);
            }
          } else {
            this.notifDanger("Please fill all the required fields");
          }
        } else {
          this.currentTabRef = val;
        }
      },
    },
    nonBlocking() {
      const panels = this.tabs.map((tab) => tab.panels).flat();
      const fields = panels.map((panel) => panel.fields).flat();
      return fields.filter(
        (field) => field.metadata.required && field.metadata.non_blocking
      );
    },
    panelsValid() {
      if (this.tabs.length) {
        return this.checkValid(this.tabs[this.currentTab].id);
      }
      return true;
    },
    panelsByColumn() {
      return (panels, column) => panels.filter((p) => p.column === column);
    },
    tabMenu() {
      if (!this.currentApp.tabs) return [];
      return this.currentApp.tabs.filter(
        (row, index) => index !== this.currentTab
      );
    },
    website() {
      if (this.currentApp["layout_type"] !== undefined) {
        if (this.currentApp["layout_type"].toLowerCase() === "website") {
          return true;
        }
      }
      return false;
    },
    headerFields() {
      return this.app.fields.filter(
        (field) => field.metadata.headerField === true
      );
    },
  },
  watch: {
    record: {
      handler: async function (val) {
        if (!val.record_number) {
          return;
        }
        const feedRecordNumber = val.record_number.replace("#", "_");
        await this.$store.dispatch("GSFeed/setRoom", "AppBuilder");
        await this.$store.dispatch("GSFeed/setBuilderFeed", feedRecordNumber);
        await this.$store.dispatch("GSFeed/cleanFeed");
        await this.$store.dispatch("GSFeed/retrieveFeed");
      },
      immediate: true,
    },
  },
  async mounted() {
    const record = await this.getRecordById(this.$route.params.id);
    this.$store.dispatch("AppBuilder/getApp", record.app_id).then((res) => {
      this.currentApp = res;
      if (res.tabs) {
        this.tabs = res.tabs;
        if (res.tabs.length) {
          this.storeTabs(res.tabs);
          this.setActiveTab(res.tabs[0]);
        }
      }
      if (res.helperMedia && res.helperMedia.length > 0) {
        this.helperMediaURL = res.helperMedia[0].helper_media
          ? res.helperMedia[0].helper_media
          : "";
      }
      if (res.metadata) {
        this.currentApp.metadata = JSON.parse(res.metadata);
        this.headerBackgroundColor = this.currentApp.metadata.appHeader
          ? this.currentApp.metadata.appHeader.headerBackgroundColor
          : "#fff";
        // this.headerTextColor = this.currentApp.metadata.appHeader ? this.currentApp.metadata.appHeader.headerTextColor : '#606060'
        this.headerTextColor = "#606060";
      } else {
        this.headerBackgroundColor = "#fff";
        this.headerTextColor = "#606060";
      }
    });
    this.handleScrolling = debounce(this.watchScroll, 50);
    window.addEventListener("scroll", this.handleScrolling);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScrolling);
  },
  methods: {
    ...mapActions("AppBuilder", {
      getApp: "getApp",
      updateRecord: "updateRecord",
      deleteRecord: "deleteRecord",
      updateApp: "updateApp",
      updatePanel: "updatePanel",
    }),
    ...mapActions("Fields", {
      setActiveTab: "setActiveTab",
      setCurrentTab: "setCurrentTab",
      storeTabs: "storeTabs",
    }),
    ...mapMutations("RecordsInstance", {
      displayAppBuilderShow: "displayAppBuilderShow",
    }),
    ...mapActions("RecordsInstance", {
      getRecordById: "getRecordById",
    }),
    ...mapMutations("SnackBarNotif", {
      notifDanger: "notifDanger",
      notifSuccess: "notifSuccess",
    }),
    ...mapActions("File", {
      uploadFile: "uploadFileToS3",
      deleteFileFromS3: "deleteFileFromS3",
    }),
    addNewTab({ tabNumOption, columns }) {
      const newTab = {
        appID: this.app.id,
        weight: 0,
        title: "New Tab",
        fullWidth: tabNumOption,
        columns,
      };
      this.$store.dispatch("AppBuilder/saveTab", newTab).then((result) => {
        this.app.tabs.push(result);

        this.currentTab = this.app.tabs
          .map((item) => item.id)
          .indexOf(result.id);
        this.updateTabPanels();
      });
    },
    addNewPanel(side) {
      const tab = this.app.tabs[this.currentTab];
      const newPanel = {
        tabID: tab.id,
        weight: tab.panels.filter((p) => p.column === side).length,
        column: side,
        title: "New Panel",
        description: "",
        title_pos: 0,
      };

      this.$store.dispatch("AppBuilder/savePanel", newPanel).then((result) => {
        this.app.tabs[this.currentTab].panels.push(result);
        this.updateTabPanels();
      });
    },
    addRecord(tabID, record) {
      if (!this.genericRecord[tabID]) {
        this.genericRecord[tabID] = {};
      }

      const currentKeys = Object.keys(this.genericRecord[tabID]);
      const keys = Object.keys(record);

      const cleaned = currentKeys.filter((val) => !keys.includes(val));

      const cleanedObject = {};
      cleaned.forEach((key) => {
        cleanedObject[key] = this.genericRecord[tabID][key];
      });

      this.genericRecord[tabID] = { ...cleanedObject, ...record };
    },
    addNonBlockingRecord(record) {
      console.log(record);
      const panels = this.tabs.map((tab) => tab.panels).flat();
      console.log(panels);
      const fields = panels.map((panel) => panel.fields).flat();
      console.log(fields);
      const keys = Object.keys(record);
      if (keys.length) {
        console.log(keys);
        const currentField = fields.find((field) =>
          keys.includes(String(field.id))
        );
        console.log(currentField);
        const panel = panels.find((panel) => panel.id == currentField.panel_id);
        console.log(panel);
        const tabID = panel.tab_id;
        this.addRecord(tabID, record);
      }
    },
    cancelDelete() {
      this.showDeleteDialog = false;
    },
    cancelEditTitle() {
      this.editTitleMode = false;
    },
    checkValid(tabID) {
      var valid = true;
      if (tabID) {
        const tab = this.tabs[this.currentTab];
        const panels = tab.panels;
        let fields = [];
        panels.forEach((panel) => {
          var fs = panel.fields;
          fs.forEach((f) => {
            fields.push(f);
          });
        });
        fields = fields.filter(
          (field) => field.metadata.required && !field.metadata.non_blocking
        );
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i];
          if (!this.genericRecord[tabID][field.id]) {
            valid = false;
            i = fields.length;
          }
        }
      }
      return valid;
    },
    async confirmDelete(result) {
      if (result) {
        if (this.panelToDelete) {
          await this.$store.dispatch(
            "AppBuilder/deletePanel",
            this.panelToDelete
          );
          this.destroyPanel(this.panelToDelete);
        }
      }
      this.fieldToDelete = null;
      this.tableToDelete = null;
      this.panelToDelete = null;
      this.showDeleteModal = false;
    },
    confirmDialog(result) {
      if (result) {
        if (this.tabToGo) {
          this.currentTabRef = this.tabToGo;
          this.setCurrentTab(this.tabToGo);
          this.setActiveTab(this.tabs[this.tabToGo]);
        }
      }
      this.tabToGo = null;
      this.showConfirmDialog = false;
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
          tabId: this.app.tabs[this.currentTab].id,
        };

        const newPanel = await this.$store.dispatch(
          "AppBuilder/copyPanelFromApp",
          params
        );
        this.app.tabs[this.currentTab].panels.push(newPanel);
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
    deletePanel(panel) {
      this.showDeleteModal = true;
      this.panelToDelete = panel.id;
    },
    destroyPanel(id) {
      const index = this.app.tabs[this.currentTab].panels
        .map((item) => item.id)
        .indexOf(id);
      this.app.tabs[this.currentTab].panels.splice(index, 1);

      this.updateTabPanels();
    },
    deletingRecord() {
      this.showDeleteDialog = true;
    },
    async deleteRecordImage() {
      try {
        this.loading = true;
        if (this.$h.dg(this.record, "image", "").length) {
          const splitLink = this.record.image.split("com");
          const key = splitLink[1].substr(1);

          await this.deleteFileFromS3({ key });
          this.record.image = "";
          await this.updateRecord(this.record);
        }

        this.loading = false;
        this.notifSuccess("The image was deleted");
      } catch (e) {
        this.notifDanger("There was an error while deleting App Icon Image");
        this.loading = false;
      }
    },
    editPanel(panel) {
      this.panelEdit = true;
      this.panelEditId = panel.id;
      this.clonePanel = { ...panel };
      //console.logpanel.id);
    },
    async editTitle() {
      this.record.title = this.updatedTitle;
      await this.updateRecord(this.record);
      this.editTitleMode = false;
    },
    flattenObject(object) {
      const keys = Object.keys(object);
      var flatten = {};
      keys.forEach((key) => {
        flatten = { ...flatten, ...object[key] };
      });
      return flatten;
    },
    getBackground() {
      if (this.$h.dg(this.app, "metadata", false)) {
        if (typeof this.app.metadata === "string") {
          const metadata = JSON.parse(this.app.metadata);
          return metadata.background;
        } else {
          const metadata = this.app.metadata;
          return metadata.background;
        }
      }
      return "";
    },
    getNonBlocking(idx) {
      const pastTabs = this.tabs.filter((tab, index) => index <= idx);
      const panels = pastTabs.map((tab) => tab.panels).flat();
      const fields = panels.map((panel) => panel.fields).flat();
      const ids = fields.map((field) => field.id);
      const flatten = this.flattenObject(this.genericRecord);
      return this.nonBlocking.filter(
        (field) => ids.includes(field.id) && !flatten[field.id]
      );
      if (tabID) {
        const tab = this.tabs[this.currentTab];
        const panels = tab.panels;
        let fields = [];
        panels.forEach((panel) => {
          var fs = panel.fields;
          fs.forEach((f) => {
            fields.push(f);
          });
        });
        fields = fields.filter(
          (field) => field.metadata.required && field.metadata.non_blocking
        );
        return fields;
      }
      return [];
    },
    onFilePicked(e) {
      this.loading = true;
      const files = e.target.files;

      if (files[0] !== undefined) {
        for (let x = 0; x < files.length; x++) {
          if (
            "image" ===
            this.$h.dg(this.$h.dg(files, `${x}.type`, "").split("/"), "0", "")
          ) {
            this.uploadFile(files[x])
              .then((result) => {
                if (result.ok) {
                  this.record.image = result.data.link;
                  this.updateRecord(this.record)
                    .then(() => {
                      this.notifSuccess("Record Updated!");
                    })
                    .catch(() => {
                      this.notifDanger(
                        "There was an error while saving the file"
                      );
                    });
                } else {
                  this.notifDanger("There was an error while saving the file");
                }
              })
              .catch((e) => {
                this.notifDanger(e);
              })
              .finally(() => {
                this.loading = false;
              });
          } else {
            this.notifDanger("The file must be of type: Image");
            this.loading = false;
          }
        }
      } else {
        this.loading = false;
      }
    },
    pickFile() {
      this.$refs.obj.click();
    },
    showEditTitleMode() {
      this.updatedTitle = this.record.title;
      this.editTitleMode = true;
    },
    toggleIsDelVerClicked() {
      this.isDelVerClicked = !this.isDelVerClicked;
    },
    updatePanelList(data) {
      this.app.tabs[this.currentTab].panels = this.app.tabs[
        this.currentTab
      ].panels.map((p) => (p.id === data.id ? data : p));
    },
    async updatingPanel() {
      try {
        this.loading = true;
        await this.updatePanel(this.clonePanel);
        this.notifSuccess("Panel updated!");
        this.panelEditId = null;
        this.panelEdit = false;
        this.loading = false;
        this.updatePanelList(this.clonePanel);
      } catch (e) {
        this.notifDanger("There was an error while updating the panel");
        this.loading = false;
      }
    },
    updateTabPanels() {
      const panels = this.app.tabs[this.currentTab].panels;
      const getColumnPanels = (col) =>
        panels
          .filter((i) => i.column === col)
          .sort((a, b) => a.weight - b.weight);
      this.rightPanels = getColumnPanels(1);
      this.leftPanels = getColumnPanels(0);
      this.leftCenterPanels = getColumnPanels(2);
      this.rightCenterPanels = getColumnPanels(3);
    },
    watchScroll() {
      const scrollT = window.scrollY;
      if (scrollT > 150) {
        this.navHeader = true;
      } else {
        this.navHeader = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.rounded-bottom {
  border-radius: 0 0 4px 4px;
}
.website-container {
  height: 50px;
}
.flex-row {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
}
#record-header .r-header {
  max-height: 222px;
  border-radius: 0 !important;
}
.pointer {
  display: none;
}
.r-title {
  font-weight: 600 !important;
  font-family: Raleway !important;
}
.r-title:hover + .pointer,
.pointer:hover {
  display: block;
}
.edittitle {
  background-color: rgb(170, 170, 170);
  right: -25px;
}
.deletebtn {
  background-color: red;
  top: 50px;
  position: absolute;
  left: -25px;
}
.myupload {
  width: 30px;
  height: 30px;
}
.app-branding {
  color: white;
  max-width: 194px;
  height: 40px;
  top: 0px;
  right: 0px;

  .app-branding-title {
    position: absolute;
    right: 198px;
    h3 {
      color: #403e3e;
    }
  }

  .app-branding-image {
    width: 198px;
    height: 198px;
    position: absolute;
    right: 0;
    top: 10px;
  }
}
.v-tab--active {
  color: var(--v-primary-base) !important;
}
.delrecord {
  height: 48px;
  width: 144px;
  top: 40px;
  border: solid 2px black;
  z-index: 100;
}
.del-rec-btn {
  height: 100% !important;
}
.navheader {
  position: fixed;
  height: 60px;
  z-index: 1;
  background-color: white;
  box-shadow: 1px 2px 3px 3px #00000026;
}
.dropmenu {
  min-height: 40px;
  width: 150px;
  color: var(--v-primary-base) !important;
  margin-left: 20px;
}
.navh {
  align-items: center;
}
.selectedMenu {
  color: blue;
  padding-left: 5px;
  width: 100px;
  background-color: rgb(230, 230, 230);
  height: 45px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.menuItems {
  position: absolute;
  top: 40px;
  list-style: none;
  background-color: white;
  padding-left: 0px;
  width: 100px;
  line-height: 2.5;
  box-shadow: 0px 0px 6px 1px;
  overflow-y: hidden;
  cursor: pointer;
  height: 0px;
  transition: 0.2s;
}
.menuItems:hover {
  display: block;
  height: 160px;
}
.menuItem {
  padding-left: 10px;
}
.menuItem:hover {
  background-color: #eee;
}
.selectedMenu:hover + .menuItems {
  height: 160px;
}
.app-img {
  position: relative;
}
.myupload {
  position: absolute;
  left: -25px;
  top: 5px;
}
.bg-none {
  background: none;
}
.deletebtn-website {
  margin-left: -13px;
}

@media (max-width: 690px) {
  .r-header {
    max-height: none !important;
  }
  .app-img.d-flex.w-full {
    flex-direction: column;
  }
  .app-branding {
    position: relative !important;
  }
  .appinfo-div {
    align-items: start !important;
  }
  .r-title.text-h5 {
    padding: 0px !important;
    width: 230px;
    white-space: nowrap;
  }
}
</style>

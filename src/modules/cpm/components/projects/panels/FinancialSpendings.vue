<template>
  <m6-card-dialog
    id="step7"
    ref="cardDialog"
    min-height="0"
    :open-search-panel="openSearchPanel"
    :search-field="true"
    :title="$t('cpm.projects.spending')"
    :title-tooltip="$t('general.doubleClickSeeMore')"
    @fullscreen="checkFullScreen"
    @search="searchKeyword = $event"
  >
    <template v-slot:after:title>
      <v-icon
        class="grey--text text--darken-2"
        light
        text
        @click="cardDialogClick"
      >
        mdi-launch
      </v-icon>

      <v-menu
        v-if="search"
        nudge-top="100"
        offset-y
        open-on-hover
      >
        <template v-slot:activator="{ on }">
          <div class="blob white">
            <v-icon
              class="grey--text text--darken-2"
              dark
              v-on="on"
              @click="showSearchingModal = true"
            >
              mdi-magnify-scan
            </v-icon>
          </div>
        </template>

        <v-card
          class="rounded-lg"
          color="rgb(255, 255, 255, 0.9)"
        >
          <v-card-text>
            <b>{{ $t("general.currentSearchTerm") }}:</b>
            {{ search }}
          </v-card-text>
        </v-card>
      </v-menu>

      <v-tooltip
        v-if="!search"
        bottom
      >
        <template v-slot:activator="{ on }">
          <div class="blob white">
            <v-icon
              class="grey--text search text--darken-2"
              dark
              v-on="on"
              @click="openSearchPanel = true"
            >
              mdi-magnify-scan
            </v-icon>
          </div>
        </template>

        <span class="grey lighten-3 pa-1 rounded">{{
          $t("general.search")
        }}</span>
      </v-tooltip>

      <template v-if="search">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-icon
              class="close-search"
              v-on="on"
              @click="clearSearch"
            >
              mdi-close
            </v-icon>
          </template>

          <span>{{ $t("general.clearSearch") }}</span>
        </v-tooltip>
      </template>

      <v-icon
        class="cursor grey--text text--darken-2"
        dark
        @click="openModal"
      >
        mdi-plus-circle
      </v-icon>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon
            class="cursor grey--text ml-2 text--darken-2"
            color="white"
            v-on="on"
            @click="showSettings = true"
          >
            mdi-cog
          </v-icon>
        </template>
        <span class="grey lighten-3 pa-1 rounded">{{
          $t("general.settings")
        }}</span>
      </v-tooltip>
    </template>

    <v-row justify="center">
      <v-chip
        color="transparent"
        disabled
        text-color="black"
      >
        <strong>
          {{ $t("cpm.projects.spendingTotal") }}
          {{ $h.dg(project, "totals.spendingTotal", 0) | currency }}
        </strong>
      </v-chip>
    </v-row>

    <div class="text-center">
      <v-progress-circular
        v-show="loading"
        color="primary"
        indeterminate
        :size="32"
      />
    </div>

    <m6-data-table
      :align-actions="alignActions"
      :headers="headersSpendings"
      :items="resourcesTestData"
    >
      <!--      @update:options="debounceSearch(search, false)"-->
      <!--      :footer-props="footerProps"-->
      <!--      :options.sync="pagination"-->
      <!--      :server-items-length="pagination.totalItems"-->
      <template
        slot="item"
        slot-scope="props"
      >
        <tr @click="fetchLineItems(props)">
          <!-- <td>
            <v-row v-if="$h.dg(props.item, 'budget_category.code')">
              {{ props.item.budget_category.code }} -
              {{ $h.dg(props.item, "budget_category.name", "") }}
            </v-row>
          </td> -->

          <td v-if="isFullScreen">
            {{ props.item.number }}
          </td>

          <td v-if="isFullScreen">
            {{ props.item.poNumber }}
          </td>

          <td>
            <template v-if="Array.isArray(props.item.vendors)">
              {{ props.item.vendors[0].title }}
            </template>
          </td>

          <!--          <td v-if="isFullScreen">-->
          <!--            {{ props.item.description }}-->
          <!--          </td>-->

          <td class="text-center">
            {{ getDateFromText(props.item.dateOpenedText) | monthDayYear }}
          </td>

          <td
            v-if="isFullScreen"
            class="text-center"
          >
            {{ getDateFromText(props.item.postingDateText) | monthDayYear }}
          </td>

          <td class="text-right">
            {{ (props.item.amount || 0) | currency }}
          </td>

          <td class="text-center">
            <m6-dropdown-actions
              :options="dropdownOptions"
              @delete="openDeleteSpending(props.item)"
              @edit="openUpdateSpending(props.item)"
              @see="showLineItems(props.item)"
            />
          </td>
        </tr>
      </template>

      <template
        v-if="isFullScreen"
        v-slot:expand="props"
      >
        <v-row justify="center">
          <v-col cols="11">
            <v-progress-circular
              v-show="loadingExpandedSpendingLineItems"
              color="primary"
              indeterminate
              :size="32"
            />
            <v-data-table
              v-show="!loadingExpandedSpendingLineItems"
              :headers="headersLineItems"
              hide-default-footer
              :items="expandedSpending.lineItems || []"
            >
              <template
                slot="item"
                slot-scope="props"
              >
                <td class="text-center">
                  {{ props.item.number }}
                </td>
                <td class="text-center">
                  {{ props.item.vendor ? props.item.vendor.title : "" }}
                </td>
                <td class="text-center">
                  {{ props.item.account_category }}
                  {{ props.item.category }}
                </td>
                <td class="text-center">
                  {{ props.item.dateText }}
                </td>
                <td class="text-center">
                  {{ props.item.line_number }}
                </td>
                <td class="text-center">
                  {{ props.item.line_description }}
                </td>
                <td class="text-center">
                  {{ props.item.amount | currency }}
                </td>
                <td class="pa-0 text-center">
                  <v-col>
                    <v-icon
                      class="ml-0 mr-2 pointer"
                      color="#757575"
                      size="20"
                      @click="openEditLineItem(props.item)"
                    >
                      mdi-pencil
                    </v-icon>

                    <v-icon
                      class="ml-0 mr-0 pointer"
                      color="#f44336"
                      size="20"
                      @click="deleteLineItem(props.item)"
                    >
                      mdi-delete
                    </v-icon>
                  </v-col>
                </td>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </template>
    </m6-data-table>

    <!-- Spending dialog -->
    <v-dialog
      v-if="dialogSpending"
      v-model="dialogSpending"
      max-width="1200"
      persistent
    >
      <v-card
        v-show="method === 'add' || method === 'put'"
        class="w-full"
      >
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            {{ $t("cpm.projects.spending") }}
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />

        <v-divider class="grey lighten-3" />

        <v-card-text class="card-scroll vertical-scroll">
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-container
              class="pa-0 rounded-lg"
              fluid
            >
              <v-row
                align="center"
                justify="center"
              >
                <v-col cols="3">
                  <div class="font-weight-black subheading">
                    <v-row>
                      <v-col class="align-center d-flex text-nowrap">
                        {{ $t("general.invoiceDocumentDate") }}
                      </v-col>
                      <v-col class="shrink">
                        <span style="color: red">*</span>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-dialog
                    ref="dialogSpendingDateOpenedText"
                    v-model="dialogSpendingDateOpenedText"
                    persistent
                    :return-value.sync="dialogProperties.dateOpenedText"
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dialogProperties.dateOpenedText"
                        :label="$t('general.invoiceDocumentDate')"
                        prepend-icon="mdi-calendar"
                        readonly
                        :rules="[rules.required]"
                        v-on="on"
                        @blur="
                          openedDate = parseDate(
                            dialogProperties.dateOpenedText
                          )
                        "
                      />
                    </template>
                    <v-date-picker
                      v-model="openDate"
                      color="green"
                      scrollable
                    >
                      <v-spacer />
                      <v-btn
                        color="primary"
                        text
                        @click="dialogSpendingDateOpenedText = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="
                          $refs.dialogSpendingDateOpenedText.save(
                            formatDate(openDate)
                          )
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
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
                        {{ $tc("general.invoiceNumber") }}
                      </v-col>
                      <v-col class="shrink">
                        <span style="color: red">*</span>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-text-field
                    ref="number"
                    v-model="dialogProperties.number"
                    :label="$t('general.invoiceNumber')"
                    :rules="[rules.required]"
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
                        {{ $t("general.documentNumber") }}
                      </v-col>
                      <v-col class="shrink" />
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-text-field
                    ref="docNumber"
                    v-model="dialogProperties.docNumber"
                    :label="$t('general.documentNumber')"
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
                        {{ $tc("cpm.projects.commitment", 2) }}
                      </v-col>
                      <v-col class="shrink" />
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-select
                    ref="commitment"
                    v-model="dialogProperties.commitment"
                    clearable
                    item-text="number"
                    item-value="id"
                    :items="commitments"
                    return-object
                    @change="changeCommitment"
                  >
                    <template
                      slot="item"
                      slot-scope="{ item }"
                    >
                      {{ item.number }} - {{ item.title }} -
                      {{ item.amount | currency }}
                      {{
                        item.vendor && item.vendor.title
                          ? `- ${item.vendor.title}`
                          : ""
                      }}
                    </template>
                  </v-select>
                </v-col>
              </v-row>

              <v-row
                v-if="glaccount"
                align="center"
                justify="center"
              >
                <v-col cols="3">
                  <div class="font-weight-black subheading">
                    <v-row>
                      <v-col class="align-center d-flex text-nowrap">
                        {{ $tc("cpm.projects.glaccount") }}
                      </v-col>
                      <v-col class="shrink" />
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-select
                    ref="glaccount"
                    v-model="dialogProperties.glaccount"
                    clearable
                    item-text="name"
                    item-value="code"
                    :items="glaccount.codes || []"
                    return-object
                  >
                    <template
                      slot="item"
                      slot-scope="{ item }"
                    >
                      {{ item.name }} - {{ item.code }}
                    </template>
                    <template
                      slot="selection"
                      slot-scope="{ item }"
                    >
                      {{ item.name }} - {{ item.code }}
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
                        {{ $t("cpm.projects.budgetCategory") }}
                      </v-col>
                      <v-col class="shrink">
                        <span style="color: red">*</span>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <budget-category-select
                    :category="dialogProperties.budget_category"
                    :errors="budgetCategoryErrors"
                    @newCategory="setBudgetCategory"
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
                        {{ $t("general.datePosted") }}
                      </v-col>
                      <v-col class="shrink">
                        <span style="color: red">*</span>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-dialog
                    ref="dialogSpendingPostingDateText"
                    v-model="dialogSpendingpostingDateText"
                    persistent
                    :return-value.sync="dialogProperties.postingDateText"
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dialogProperties.postingDateText"
                        clearable
                        :label="$t('general.datePosted')"
                        prepend-icon="mdi-calendar"
                        readonly
                        :rules="[rules.required]"
                        v-on="on"
                        @blur="
                          openedDate = parseDate(
                            dialogProperties.postingDateText
                          )
                        "
                      />
                    </template>
                    <v-date-picker
                      v-model="openDate"
                      color="green"
                      scrollable
                    >
                      <v-spacer />
                      <v-btn
                        color="primary"
                        text
                        @click="dialogSpendingpostingDateText = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="
                          $refs.dialogSpendingPostingDateText.save(
                            formatDate(openDate)
                          )
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
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
                        {{ $t("general.datePaid") }}
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-dialog
                    ref="dialogSpendingPaidDateText"
                    v-model="dialogSpendingPaidDateText"
                    persistent
                    :return-value.sync="dialogProperties.paidDateText"
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dialogProperties.paidDateText"
                        clearable
                        :label="$t('general.datePaid')"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-on="on"
                        @blur="
                          paidDate = parseDate(dialogProperties.paidDateText)
                        "
                      />
                    </template>
                    <v-date-picker
                      v-model="paidDate"
                      color="green"
                      scrollable
                    >
                      <v-spacer />
                      <v-btn
                        color="primary"
                        text
                        @click="dialogSpendingPaidDateText = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="
                          $refs.dialogSpendingPaidDateText.save(
                            formatDate(paidDate)
                          )
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
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
                        {{ $t("general.paidToDateAmount") }}
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <money
                    ref="number"
                    v-model="dialogProperties.paidToDateAmount"
                    :label="$t('general.paidToDateAmount')"
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
                        {{ $t("general.description") }}
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
                <v-col cols="7">
                  <v-textarea v-model="dialogProperties.description" />
                </v-col>
              </v-row>
            </v-container>
          </v-form>

          <v-container
            class="pa-0 rounded-lg"
            fluid
            grid-list-md
          >
            <v-row
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t("general.attachments") }}
                    </v-col>
                    <v-col class="shrink">
                      <v-btn
                        class="mt-0"
                        color="blue"
                        dark
                        fab
                        small
                        @click.native.stop="selectFileAdd"
                      >
                        <v-icon small>
                          mdi-plus-circle
                        </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-col>

              <v-col cols="7">
                <v-treeview
                  v-model="tree"
                  activatable
                  :active.sync="active"
                  hoverable
                  item-key="path"
                  :items="spendingFiles"
                  :open="open"
                  open-on-click
                >
                  <template
                    slot="prepend"
                    slot-scope="{ item, open }"
                  >
                    <v-icon v-if="!item.file">
                      {{ open ? "mdi-folder-open" : "mdi-folder" }}
                    </v-icon>
                    <v-icon
                      v-else-if="
                        item.file === 'image/jpeg' || item.file === 'image/png'
                      "
                    >
                      mdi-image
                    </v-icon>
                    <v-icon v-else-if="item.file === 'application/pdf'">
                      mdi-file-pdf-box
                    </v-icon>
                    <v-icon v-else>
                      mdi-text-box-outline
                    </v-icon>
                  </template>

                  <template
                    slot="append"
                    slot-scope="{ item }"
                  >
                    <template v-if="item.file">
                      <a
                        v-if="item.url.search('firebase') !== -1"
                        :href="item.url"
                        style="padding-top: 6px"
                        target="_blank"
                      >
                        <v-icon small>mdi-folder-plus</v-icon>
                      </a>
                      <v-btn
                        icon
                        small
                        @click.stop="deleteFile(item)"
                      >
                        <v-icon
                          color="red"
                          small
                        >
                          mdi-delete
                        </v-icon>
                      </v-btn>
                    </template>
                  </template>
                </v-treeview>
              </v-col>
            </v-row>

            <v-row
              v-show="filesToAdd.length"
              align="center"
              justify="center"
            >
              <v-col cols="3">
                <div class="font-weight-black subheading">
                  <v-row>
                    <v-col class="align-center d-flex text-nowrap">
                      {{ $t("general.filesToAdd") }}
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="7">
                <input
                  v-show="false"
                  id="files"
                  ref="uploadInputAdd"
                  :multiple="true"
                  :name="$tc('general.file', 1)"
                  type="file"
                  @change="detectFilesAdd($event)"
                >
                <v-treeview
                  v-model="tree"
                  activatable
                  :active.sync="active"
                  hoverable
                  item-key="path"
                  :items="filesToAdd"
                  :open="open"
                  open-on-click
                >
                  <template
                    slot="prepend"
                    slot-scope="{ item, open }"
                  >
                    <v-icon v-if="!item.file">
                      {{ open ? "mdi-folder-open" : "mdi-folder" }}
                    </v-icon>
                    <v-icon
                      v-else-if="
                        item.file === 'image/jpeg' || item.file === 'image/png'
                      "
                    >
                      mdi-image
                    </v-icon>
                    <v-icon v-else-if="item.file === 'application/pdf'">
                      mdi-file-pdf-box
                    </v-icon>
                    <v-icon v-else>
                      mdi-text-box-outline
                    </v-icon>
                  </template>
                  <template
                    slot="append"
                    slot-scope="{ item }"
                  >
                    <template v-if="item.file">
                      <v-btn
                        icon
                        small
                        @click.stop="deleteFileNotSaved(item)"
                      >
                        <v-icon
                          color="red"
                          small
                        >
                          mdi-delete
                        </v-icon>
                      </v-btn>
                    </template>
                  </template>
                </v-treeview>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="gray"
            :disabled="loading"
            elevation="1"
            :loading="loading"
            text
            @click="closeModal"
          >
            Close
          </v-btn>
          <v-btn
            color="primary"
            :disabled="loading"
            elevation="1"
            :loading="loading"
            text
            @click="saveSpending"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- End spending dialog -->

    <!-- Line item dialog -->
    <v-dialog
      v-model="dialogLineItem"
      max-width="600px"
      persistent
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            {{ $t("cpm.projects.spending") }}
            {{ $tc("cpm.projects.lineItem", 1) }}
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text
          class="vertical-scroll"
          :style="{
            height: getViewPortHeight,
            overflow: 'auto',
          }"
        >
          <v-form
            ref="formLineItem"
            v-model="validLineItem"
          >
            <v-container
              class="pa-0 rounded-lg"
              fluid
              grid-list-md
            >
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.number"
                    color="blue"
                    :label="`${$tc('general.invoice', 1)} #`"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.po_number"
                    color="blue"
                    :label="$t('cpm.projects.poNumber')"
                    :rules="[rules.required]"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.project_name"
                    color="blue"
                    :label="$t('general.projectName')"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.line_number"
                    color="blue"
                    :label="`${$t('general.line')} #`"
                    :rules="[rules.required]"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <label class="money-fix v-input v-label">{{
                    $t("general.amount")
                  }}</label>
                  <money v-model="dialogLineItemProperties.amount" />
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.category"
                    color="blue"
                    :label="$tc('general.category', 1)"
                    :rules="[rules.required]"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="12"
                  sm="12"
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.vendorID"
                    label="Vendor ID"
                  />
                  <!-----<v-autocomplete
                    v-model="dialogLineItemProperties.vendor"
                    clearable
                    item-text="title"
                    :items="vendors"
                    :label="$t('cpm.projects.vendorName')"
                    return-object
                  />-->
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.vendor"
                    :label="$t('cpm.projects.vendorName')"
                  />
                  <!-----<v-autocomplete
                    v-model="dialogLineItemProperties.vendor"
                    clearable
                    item-text="title"
                    :items="vendors"
                    :label="$t('cpm.projects.vendorName')"
                    return-object
                  />-->
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.status"
                    :label="$t('general.status')"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <v-dialog
                    ref="dialogLineItemDateText"
                    v-model="dialogLineItemDateText"
                    persistent
                    :return-value.sync="dialogLineItemProperties.dateText"
                    :rules="[rules.required]"
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dialogLineItemProperties.dateText"
                        :label="$t('general.date')"
                        prepend-icon="mdi-calendar"
                        readonly
                        :rules="[rules.required]"
                        v-on="on"
                        @blur="
                          date = parseDate(dialogLineItemProperties.dateText)
                        "
                      />
                    </template>
                    <v-date-picker
                      v-model="date"
                      color="green"
                      scrollable
                    >
                      <v-spacer />
                      <v-btn
                        color="primary"
                        text
                        @click="dialogLineItemDateText = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="
                          $refs.dialogLineItemDateText.save(formatDate(date))
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  <v-dialog
                    ref="dialogLineItemPaidDateText"
                    v-model="dialogLineItemPaidDateText"
                    persistent
                    :return-value.sync="dialogLineItemProperties.paidDateText"
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dialogLineItemProperties.paidDateText"
                        :label="$t('general.datePaid')"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-on="on"
                        @blur="
                          paidDate = parseDate(
                            dialogLineItemProperties.paidDateText
                          )
                        "
                      />
                    </template>
                    <v-date-picker
                      v-model="paidDate"
                      color="green"
                      scrollable
                    >
                      <v-spacer />
                      <v-btn
                        color="primary"
                        text
                        @click="dialogLineItemPaidDateText = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="
                          $refs.dialogLineItemPaidDateText.save(
                            formatDate(paidDate)
                          )
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.account"
                    color="blue"
                    :label="$t('general.account')"
                    :rules="[rules.required]"
                  />
                </v-col>

                <v-col
                  md="6"
                  sm="12"
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.account_category"
                    color="blue"
                    :label="
                      `${$t('general.account')} ${$tc('general.category', 1)}`
                    "
                    :rules="[rules.required]"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.aoc_code"
                    color="blue"
                    :label="$t('general.aocCode')"
                    :rules="[rules.required]"
                  />
                </v-col>

                <v-col
                  md="6"
                  sm="12"
                >
                  <v-checkbox
                    v-model="dialogLineItemProperties.reconciled"
                    color="blue"
                    :label="$t('general.reconciled')"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.client_capital_id"
                    color="blue"
                    :label="$t('general.clientCapitalId')"
                    :rules="[rules.required]"
                  />
                </v-col>

                <!--<v-flex
                  md6
                  sm12
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.custom_numeric_1"
                    color="blue"
                    :label="$t('general.customNumeric', { number: '1' })"
                    :rules="[rules.required]"
                  />
                </v-flex>-->
              </v-row>

              <!--<v-layout
                row
                wrap
              >
                <v-flex
                  md6
                  sm12
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.custom_text_1"
                    color="blue"
                    :label="$t('general.customText', { number: 1 })"
                    :rules="[rules.required]"
                  />
                </v-flex>
                <v-flex
                  md6
                  sm12
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.custom_text_2"
                    color="blue"
                    :label="$t('general.customText', { number: 2 })"
                    :rules="[rules.required]"
                  />
                </v-flex>
              </v-layout>-->

              <!--<v-layout
                row
                wrap
              >
                <v-flex
                  md6
                  sm12
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.custom_text_3"
                    color="blue"
                    :label="$t('general.customText', { number: 3 })"
                    :rules="[rules.required]"
                  />
                </v-flex>
                <v-flex
                  md6
                  sm12
                >
                  <v-text-field
                    v-model="dialogLineItemProperties.custom_text_4"
                    color="blue"
                    :label="$t('general.customText', { number: 4 })"
                    :rules="[rules.required]"
                  />
                </v-flex>
              </v-layout>-->

              <v-row>
                <v-col
                  md="12"
                  sm="12"
                >
                  <v-textarea
                    v-model="dialogLineItemProperties.line_description"
                    color="blue"
                    :label="$t('general.lineItemDescr')"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="gray"
            :disabled="loading"
            :loading="loading"
            outlined
            text
            @click="closeDialogLineSpending"
          >
            Close
          </v-btn>
          <v-btn
            color="primary"
            :disabled="loading"
            :loading="loading"
            text
            @click="saveLineItemSpending"
          >
            <template v-if="methodLineItem === 'add'">
              Add
            </template>
            <template v-if="methodLineItem === 'put'">
              Update
            </template>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End line item dialog -->

    <!-- show line items modal -->
    <v-dialog
      v-if="showLineItemsModal"
      v-model="showLineItemsModal"
      max-width="1000px"
      persistent
      transition="dialog-transition"
    >
      <v-card class="ml-2 rounded-lg">
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            {{ $tc("cpm.projects.lineItem", 1) }}
          </span>
          <v-chip
            class="absolute blue darken-4 headling px-3 py-1 text-center"
            style="left: 43%"
          >
            <b class="white--text">
              {{ $tc("general.invoice", 1) }}# :
              {{ spendingToShow.number }}
            </b>
          </v-chip>
          <v-spacer />
          <v-btn
            class="mt-1"
            color="white"
            dark
            fab
            small
            @click.native.stop="openLineItems"
          >
            <v-icon color="green lighten-2">
              mdi-plus
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text
          class="vertical-scroll"
          :style="{
            height: getViewPortHeight,
            overflow: 'auto',
          }"
        >
          <!-- add card and v-card action btns -->
          <v-container
            class="pa-0 rounded-lg"
            fluid
          >
            <v-row>
              <v-col md="12">
                <v-data-table
                  :headers="headersLineItems"
                  :items="spendingToShow.lineItems"
                  :items-per-page-options="[5, 10, 15, 200]"
                >
                  <template
                    slot="item"
                    slot-scope="props"
                  >
                    <tr>
                      <td class="text-center">
                        {{ props.item.number }}
                      </td>
                      <td class="text-center">
                        {{ props.item.vendor ? props.item.vendor.title : "" }}
                      </td>
                      <td class="text-center">
                        {{ props.item.account_category }}
                        {{ props.item.category }}
                      </td>
                      <td class="text-center">
                        {{ props.item.dateText }}
                      </td>
                      <td class="text-center">
                        {{ props.item.line_number }}
                      </td>
                      <td class="text-center">
                        {{ props.item.line_description }}
                      </td>
                      <td class="text-center">
                        {{ props.item.amount | currency }}
                      </td>
                      <td class="pa-0 text-center">
                        <v-col>
                          <v-icon
                            class="ml-0 mr-2 pointer"
                            color="#757575"
                            size="20"
                            @click="openEditLineItem(props.item)"
                          >
                            mdi-pencil
                          </v-icon>

                          <v-icon
                            class="ml-0 mr-0 pointer"
                            color="#f44336"
                            size="20"
                            @click="deleteLineItem(props.item)"
                          >
                            mdi-delete
                          </v-icon>
                        </v-col>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions class="px-5">
          <v-spacer />

          <v-btn
            text
            @click="showLineItemsModal = false"
          >
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- show line items modal -->

    <searching
      v-if="showSearchingModal"
      :previous-search="search"
      :show="showSearchingModal"
      where="spending"
      @clear="search = ''"
      @close="showSearchingModal = false"
      @searching="onSearch"
    />

    <m6-confirm-delete
      :message="
        $t('general.sureDeleteResource', {
          resource: $t('cpm.projects.spending'),
        })
      "
      :show="method === 'delete'"
      :title="
        $t('general.deleteResource', {
          resource: $tc('cpm.projects.spending'),
        })
      "
      @cancel="closeModal"
      @confirm="deleteSpending"
    />

    <m6-confirm-delete
      :message="
        $t('general.sureDeleteResource', {
          resource: $tc('cpm.projects.lineItem', 1),
        })
      "
      :show="lineItemDeleteModal"
      :title="
        $t('general.deleteResource', {
          resource: $tc('cpm.projects.lineItem', 1),
        })
      "
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />

    <m6-loading :loading="showLoading" />

    <settings-modal
      v-if="showSettings"
      :show="showSettings"
      @close="showSettings = false"
    />
  </m6-card-dialog>
</template>

<script>
/* eslint-disable no-alert */
/* eslint-disable camelcase */
import axios from 'axios'
import { DateTime } from 'luxon'
import { mapState, mapActions, mapGetters } from 'vuex'

import { db, storage } from '@/utils/Firebase'
import EventBus from '@/Eventbus'

import mixins from '@/modules/cpm/_mixins/index'

import FirebaseReportComponent from './FirebaseReportComponent.vue'
import SearchingModal from '../modals/SearchingModal'
import BudgetCategorySelect from '../_partials/BudgetCategorySelect'
import settingsModal from '../settings_modals/FinancialSpendings.vue'

const defaultLineItemSpending = {
  number: '',
  po_number: '',
  project_name: '',
  line_number: '',
  amount: 0,
  category: '',
  account: '',
  account_category: '',
  aoc_code: '',
  client_capital_id: '',
  custom_numeric_1: null,
  custom_text_1: null,
  custom_text_2: null,
  custom_text_3: null,
  custom_text_4: null,
  status: '',
  dateText: '',
  paidDateText: '',
  vendor: {},
  line_description: '',
  reconciled: false
}

export default {
  name: 'FinancialSpendings',
  components: {
    searching: SearchingModal,
    BudgetCategorySelect,
    settingsModal
  },

  extends: FirebaseReportComponent,

  mixins: [mixins],

  props: {
    pid: {
      type: [String, Number],
      default: undefined
    }
  },

  data() {
    const projectId = this.pid || this.$route.params.id

    return {
      footerProps: {
        itemsPerPageOptions: [5, 10, 15, 200]
      },
      defaultItemSpending: {
        number: '',
        costCodeText: '',
        description: '',
        budget_category: {
          ref: ''
        }
      },
      commitments: [],
      glaccount: [],
      autoInit: false,
      dialogSpendingPaidDateText: false,
      dialogSpendingDateOpenedText: false,
      dialogSpendingpostingDateText: false,
      viewPortHeight:
        Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        ) * 0.53,
      projectId,
      showSearchingModal: false,
      projectRef: db.collection('cpm_projects').doc(projectId),
      showLineItemsModal: false,
      spendingToShow: {},
      loading: false,
      project: {},
      dialogProperties: {
        number: '',
        costCodeText: '',
        description: '',
        budget_category: {
          ref: ''
        },
        docNumber: '',
        accrual: ''
      },
      method: 'add',
      dialogSpending: false,
      // idstring for files when adding
      folderName: '',
      // Files
      filesToAdd: [],
      files: [],
      // Files to sgow
      spendingFiles: [],
      // Tree
      tree: [],
      active: [],
      open: [],
      rules: {
        required: value => !!value || 'Required.'
      },
      formValues: ['number', 'costCodeText'],
      valid: true,
      // Line items spending
      headersLineItems: [
        {
          text: `${this.$tc('general.invoice', 1)} #`,
          value: 'number'
        },
        {
          text: this.$t('cpm.projects.vendorName'),
          value: 'vendor'
        },
        {
          text: this.$tc('general.category', 1),
          value: 'category'
        },
        { text: this.$t('general.date'), value: 'dateText' },
        {
          text: `${this.$t('general.line')} #`,
          value: 'line_number'
        },
        {
          text: this.$t('general.lineItemDescr'),
          value: 'line_description'
        },
        { text: this.$t('general.amount'), value: 'amount' },
        {
          text: this.$t('general.actions'),
          value: 'actions',
          sortable: false
        }
      ],
      lineItems: [],
      validLineItem: true,
      methodLineItem: 'add',
      dialogLineItem: false,
      dialogLineItemProperties: { ...defaultLineItemSpending },
      dialogLineItemDateText: false,
      dialogLineItemPaidDateText: false,
      // auxliar dates format
      date: new Date().toISOString().substr(0, 10),
      paidDate: new Date().toISOString().substr(0, 10),
      openDate: new Date().toISOString().substr(0, 10),
      budgetSettings: [],
      costCodesAllArray: [],
      totalSpendings: 0,
      itemToDelete: {},
      lineItemDeleteModal: false,
      showLoading: false,
      rowsPerPage: [
        10,
        50,
        100,
        { text: '$vuetify.dataIterator.rowsPerPageAll', value: 10000 }
      ],
      isFullScreen: false,
      pagination: {
        sortBy: ['number'],
        descending: true,
        itemsPerPage: 10,
        totalItems: 0,
        page: 1
      },
      formWasValidated: false,
      expandedSpending: {},
      loadingExpandedSpendingLineItems: false,
      showSettings: false,
      resourcesTest: [],
      searchKeyword: '',
      filterColumn: 'all',
      filterQry: {
        number: '',
        po_number: '',
        vendors: '',
        amount: '',
        dateOpenedText: '',
        postingDateText: ''
      },
      openSearchPanel: false
    }
  },

  firestore() {
    return {
      project: db.collection('cpm_projects').doc(this.$route.params.id),
      budgetSettings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('budgets'),
      glaccount: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('glaccount')
    }
  },

  computed: {
    ...mapGetters('companies/cpmProjects/general', {
      vendors: 'getVendors'
    }),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    indexParameters() {
      return {
        projectId: this.projectId,
        page: this.pagination.page,
        search: this.search || '',
        sort: this.pagination.descending ? 'DESC' : 'ASC',
        sortBy: this.pagination.sortBy,
        limit: this.pagination.itemsPerPage
      }
    },

    alignActions() {
      if (this.isFullScreen) {
        return 'center'
      } else {
        return 'end'
      }
    },

    headersSpendings() {
      if (this.isFullScreen) {
        return [
          // {
          //   text: this.$t("cpm.projects.budgetCategory"),
          //   value: "budget_category.name",
          // },
          {
            text: this.$t('general.invoiceNumber'),
            value: 'number'
          },
          {
            text: this.$t('cpm.projects.poNumber'),
            value: 'po_number'
          },
          {
            text: this.$t('general.vendor'),
            value: 'vendors',
            sortable: false
          },
          // {
          //   text: this.$t('general.description'),
          //   value: 'description',
          //   sortable: false
          // },
          {
            text: this.$t('general.invDocDate'),
            value: 'dateOpenedText',
            sortable: false
          },
          {
            text: this.$t('general.distDate'),
            value: 'postingDateText',
            sortable: false
          },
          // {
          //   text: this.$t('general.status'),
          //   value: '',
          //   sortable: false
          // },
          {
            text: this.$t('general.amount'),
            value: 'amount'
          },
          {
            text: this.$t('general.actions'),
            value: 'actions',
            sortable: false
          }
        ]
      } else {
        return [
          // {
          //   text: this.$t("cpm.projects.budgetCategory"),
          //   value: "budget_category.name",
          // },
          {
            text: this.$t('cpm.projects.vendorName'),
            value: 'vendors',
            sortable: false
          },
          {
            text: this.$t('general.invDocDate'),
            value: 'dateOpenedText',
            sortable: false,
            align: 'center'
          },
          {
            text: this.$t('general.amount'),
            value: 'amount',
            align: 'end'
          },
          {
            text: this.$t('general.actions'),
            value: 'actions',
            sortable: false,
            align: 'center'
          }
        ]
      }
    },

    getViewPortHeight() {
      return `${this.viewPortHeight}px`
    },
    budgetCategoryErrors() {
      if (
        this.formWasValidated &&
        !this.$h.dg(this.dialogProperties, 'budget_category.ref')
      ) {
        return 'Budget Category is required'
      }
      return []
    },
    dropdownOptions() {
      return [
        {
          icon: 'mdi-clipboard-account-outline',
          title: this.$t('general.seeTheResource', {
            resource: this.$tc('cpm.projects.lineItem', 2)
          }),
          event: 'see'
        },
        {
          icon: 'mdi-pencil',
          title: this.$t('general.edit'),
          event: 'edit'
        },
        {
          icon: 'mdi-delete',
          title: this.$t('general.delete'),
          event: 'delete'
        }
      ]
    },
    resourcesTestData: function () {
	    return this.filterItems(this.resourcesTest, this.filterQry)
    }
  },

  watch: {
    'project.totals.spendingTotal': function () {
      EventBus.$emit('refresh-commitments-panel-by-spendings')
    },

    budgetSettings() {
      this.costCodesAllArray = []
      this.budgetSettings.costCodes.forEach(cl1 => {
        const itemName = cl1.code ? `${cl1.code} - ${cl1.name}` : cl1.name
        this.costCodesAllArray.push({
          item: cl1,
          name: itemName,
          level: 1
        })
        if (cl1.cat_1 && cl1.cat_1.length) {
          cl1.cat_1.forEach(cl2 => {
            let itemL2Name = itemName + ' | '
            itemL2Name += cl2.code ? `${cl2.code} - ${cl2.name}` : cl2.name
            this.costCodesAllArray.push({
              item: cl1,
              itemL2: cl2,
              name: itemL2Name,
              level: 2
            })
            if (cl2.cat_2.length) {
              cl2.cat_2.forEach(cl3 => {
                let itemL3Name = itemL2Name + ' | '
                itemL3Name += cl3.code ? `${cl3.code} - ${cl3.name}` : cl3.name
                this.costCodesAllArray.push({
                  item: cl1,
                  itemL2: cl2,
                  itemL3: cl3,
                  name: itemL3Name,
                  level: 3
                })
              })
            }
          })
        }
      })
    },
    'pagination.totalItems': function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue !== this.resourcesRaw.length) {
          this.fetchSpendings()
        }
      }
    },
    resources() {},
    filterColumn: function (newVal, oldVal) {
      this.fillTheFilterQry()
    },
    searchKeyword: function (newVal, oldVal) {
      this.fillTheFilterQry()
    },
    isFullScreen: function (newVal, oldVal) {
      if (newVal == false) {
        this.searchKeyword = ''
        this.openSearchPanel = false
      }
    }
  },

  mounted() {
    this.fetchSpendings()
    this.fetchCommitments()
    if (!this.vendors.length) {
      this.fetchVendors()
    }
    // Using in DialogSpendingsInCommitments.vue
    EventBus.$on('edit-spending-from-commitment', payload => {
      this.openUpdateSpending(payload.spending)
    })
    EventBus.$on('update-list-spending-from-reconciliation', () => {
      this.fetchSpendings()
      this.fetchCommitments()
    })
    EventBus.$on('show-spending-lineitems-from-commitment', payload => {
      this.showLineItems(payload.spending)
    })

    axios.post(
      `${process.env.VUE_APP_FIREBASE_APIURL}/api/projects/${this.projectId}/update-spendings`
    )

    this.fillTheFilterQry()
  },

  methods: {
    fillTheFilterQry: function () {
      if (this.filterColumn == 'all') {
        Object.keys(this.filterQry).forEach((item, index) => {
          this.filterQry[item] = this.searchKeyword
        })
      } else {
        Object.keys(this.filterQry).forEach((item, index) => {
          if (item == this.filterColumn) {
            this.filterQry[item] = this.searchKeyword
          } else {
            this.filterQry[item] = ''
          }
        })
      }
    },
    filterItems: function (arr, query) {
      const _this = this
      return arr.filter(function (item) {
        const columnList = {
          number: false,
          po_number: false,
          vendors: false,
          amount: false,
          dateOpenedText: false,
          postingDateText: false
        }


        Object.keys(columnList).forEach(column => {
          if (typeof item[column] !== 'undefined' && (_this.filterColumn == 'all' || _this.filterColumn == column)) {
            let tableColumnData = item[column] ? item[column] : ''

            if (column == 'dateOpenedText' || column == 'postingDateText') {
              tableColumnData = DateTime.fromJSDate(_this.getDateFromText(item[column])).toFormat('MM/dd/yyyy')
            } else if (column == 'vendors') {
              if (item['vendors'].length > 0) {
                tableColumnData = item['vendors'][0].title
              }
            }
            columnList[column] = tableColumnData.toString().toLowerCase().trim().includes(query[column].toString().toLowerCase().trim())
          }
        })

        return (columnList.number || columnList.vendors || columnList.po_number ||
                columnList.amount || columnList.dateOpenedText || columnList.postingDateText)
      })
    },
    formatDateToText(date) {
      if (date) {
        const dateObj = DateTime.fromISO(date)
        return dateObj.toFormat('MM/dd/yyyy')
      }
      return ''
    },
    fetchSpendings() {
      this.getSpendings({
        projectId: this.$route.params.id
      }).then(response => {
        this.resourcesTest = response
      })
    },
    fetchCommitments() {
      this.getCommitments({
        projectId: this.$route.params.id
      }).then(response => {
        this.commitments = response
      })
    },
    ...mapActions('companies/cpmProjects/spendings', {
      indexResource: 'indexELK'
    }),
    ...mapActions('companies/cpmProjects/general', {
      fetchVendors: 'fetchVendors'
    }),

    ...mapActions('cpm/projects/spending', {
      createSpending: 'create',
      submitUpdateSpending: 'update',
      submitDeleteSpending: 'delete',
      createLineItem: 'createLineItem',
      updateLineItem: 'updateLineItem',
      submitDeleteLineItem: 'deleteLineItem',
      getSpendings: 'getSpendings'
    }),
    ...mapActions('cpm/projects/commitments', {
      getCommitments: 'getCommitments'
    }),
    cardDialogClick() {
      this.$refs.cardDialog.doubleClick()
    },
    removeDuplicates(array = []) {
      const unique = new Set(array)
      return [...unique]
    },

    assignResourcesData({ data, meta: { lastPage, total } } = {}) {
      if (lastPage && this.pagination.page > lastPage) {
        this.pagination.page = 1
        return this.fetchSpendings()
      }

      this.resourcesRaw = data.map(item => ({ ...item, lineItems: [] }))
      this.pagination.totalItems = total
    },

    checkFullScreen(value) {
      this.isFullScreen = value
    },

    clearSearch() {
      this.search = ''
      this.fetchSpendings()
    },

    onSearch(search) {
      this.search = search
      this.showSearchingModal = false
      this.fetchSpendings()
    },

    showSpendingLineItemsFromCommitment(payload) {
      if (!this.$h.dg(payload, 'spending')) return
      this.openUpdateSpending(payload.spending)
    },

    budgetCategorySelected(item, reloadCommitment = true) {
      this.dialogProperties.costCode = item
      this.dialogProperties.costCodeText = item.name
      this.dialogProperties.contingency = item.item.contingency || false
      this.setCostCodeNumber(item)

      if (reloadCommitment) this.dialogProperties.commitment = null
    },

    changeCommitment(commitmet) {
      this.setDialogPropertiesCategoryRef(
        this.$h.dg(commitmet, 'budget_category.ref', '')
      )
    },

    setCostCodeNumber(costCode) {
      if (!costCode) return

      switch (costCode.level) {
        case 3:
          this.dialogProperties.costCodeNumber = this.$h.dg(
            costCode,
            'itemL3.code',
            0
          )
          break
        case 2:
          this.dialogProperties.costCodeNumber = this.$h.dg(
            costCode,
            'itemL2.code',
            0
          )
          break
        case 1:
          this.dialogProperties.costCodeNumber = this.$h.dg(
            costCode,
            'item.code',
            0
          )
          break
        default:
          this.dialogProperties.costCodeNumber = this.$h.dg(
            costCode,
            'item.code',
            0
          )
          break
      }
    },

    showLineItems(spending) {
      this.expandedSpending = {}
      this.spendingToShow = spending
      this.showLineItemsModal = true
      this.getLineItemSpending(spending)
    },

    closeShowLineItem() {
      this.showLineItemsModal = false
      this.spendingToShow = {}
    },

    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },

    parseDate(date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },

    checkErrorsLineItem() {
      this.validLineItem = this.$refs.formLineItem.validate()
      if (!this.validLineItem) {
        this.$snotify.error(
          this.$t('alerts.pleaseCheckErrors'),
          this.$t('alerts.error')
        )
      }
    },

    updateSpendingTotals(id) {
      return new Promise((resolve, reject) => {
        try {
          axios.post(
            `${process.env.VUE_APP_FIREBASE_APIURL}/api/projects/${
              this.projectId
            }/update-spendings?spendingId=${id ||
              this.dialogProperties.id ||
              this.spendingToShow.id ||
              ''}`
          ).then(() => {
            this.fetchSpendings()
            resolve(true)
          })
        } catch (error) {
          reject(error)
        }
      })
    },

    async saveLineItemSpending() {
      this.checkErrorsLineItem()
      if (!this.validLineItem) {
        return
      }
      this.loading = true

      switch (this.methodLineItem) {
        case 'add':
          await this.addLineItemSpending()
          break
        case 'put':
          this.dialogLineItem = false
          await this.updateLineItemSpending()
          break
      }
    },

    deleteLineItemFromLineItems(item, key = 'id') {
      const index = this.spendingToShow.lineItems.findIndex(
        lineItem => lineItem[key] === item[key]
      )

      if (index > -1) {
        this.spendingToShow.lineItems.splice(index, 1)
      }

      this.spendingToShow = { ...this.spendingToShow }

      this.updateSpendingTotals().then(() =>
        this.getLineItemSpending(this.spendingToShow)
      )
    },

    findIndexSpending() {
      return this.resources.findIndex(
        spending => spending.id === this.dialogProperties.id
      )
    },

    updateLineItemsOfSpending() {
      // update spending lineItems
      const index = this.findIndexSpending()
      if (index > -1) {
        this.resourcesRaw[index].lineItems = this.lineItems
      }
    },

    deleteLineItem(item) {
      // Line item added into the collection
      this.lineItemDeleteModal = true
      this.itemToDelete = item
    },

    confirmDelete() {
      const item = this.itemToDelete
      if (item.id && this.spendingToShow.id) {
        this.showLoading = true

        this.submitDeleteLineItem({
          projectId: this.$route.params.id,
          spendingId: this.spendingToShow.id,
          lineItemId: item.id
        })
          .then(() => {
            // Delete from the lineitems
            this.deleteLineItemFromLineItems(item)
            this.updateLineItemsOfSpending()
            this.showLoading = false
            this.$snotify.success(
              this.$t('general.lineItemDeleted'),
              this.$t('alerts.success')
            )

            if (this.isFullScreen && this.expandedSpending.id) {
              this.fetchLineItems(this.expandedSpending)
            }

            this.cancelDelete()
          })
          .catch(() => {
            this.showLoading = false
            this.$snotify.error(
              this.$t('general.lineItemNotDeleted'),
              this.$t('alerts.error')
            )
            this.cancelDelete()
          })
      // Line item not in the collection but in spending with id
      } else if (!item.id && this.dialogProperties.id) {
        // update spending lineItems
        this.deleteLineItemFromLineItems(item, 'number')
        this.cancelDelete()
      // Line item not in the collection and not spending with id
      } else if (!item.id && !this.dialogProperties.id) {
        this.deleteLineItemFromLineItems(item, 'number')
        this.cancelDelete()
      }
    },

    cancelDelete() {
      this.itemToDelete = {}
      this.lineItemDeleteModal = false
    },

    addLineItemSpending() {
      const newLineItem = {}
      Object.keys(this.dialogLineItemProperties).map(key => {
        if (this.dialogLineItemProperties[key]) {
          newLineItem[key] = this.dialogLineItemProperties[key]
        }
      })
      this.loading = true

      const spendingReference = db
        .collection('cpm_projects')
        .doc(this.projectId)
        .collection('spendings')
        .doc(this.spendingToShow.id)

      this.createLineItem({
        spendingRef: spendingReference,
        lineItem: newLineItem,
        projectId: this.projectId
      })
        .then(() => {
          this.spendingToShow.lineItems.push(newLineItem)
          this.loading = false
          this.$snotify.success(
            `${this.$tc('cpm.projects.lineItem', 1)} ${this.$t(
              'general.saved'
            )}`,
            this.$t('alerts.success')
          )
          setTimeout(() => {
            this.fetchSpendings()
          }, 3000)

          this.closeDialogLineSpending()
          this.updateSpendingTotals().then(() =>
            this.getLineItemSpending(this.spendingToShow)
          )
        })
        .catch(err => {
          console.error(err)
          this.loading = false
          this.$snotify(
            this.$t('general.thereWasError'),
            this.$t('alerts.error')
          )
        })
    },

    updateLineItemSpending() {
      if (this.expandedSpending.id) {
        this.updateLineItemExpandedSpending()
      } else {
        const updateLineItem = {}
        Object.keys(this.dialogLineItemProperties).map(key => {
          if (key in this.dialogLineItemProperties && key !== 'id') {
            updateLineItem[key] = this.dialogLineItemProperties[key]
          }
        })
        this.loading = true
        const spendingReference = db
          .collection('cpm_projects')
          .doc(this.projectId)
          .collection('spendings')
          .doc(this.spendingToShow.id)

        const data = {
          spendingRef: spendingReference,
          lineItem: updateLineItem,
          lineItemId: this.dialogLineItemProperties.id,
          projectId: this.projectId
        }

        this.updateLineItem(data)
          .then(() => {
            const index = this.lodash.findIndex(this.spendingToShow.lineItems, {
              id: this.spendingToShow.id
            })
            if (index !== -1) {
              this.spendingToShow.lineItems[index] = this.spendingToShow
            }
            this.loading = false
            this.dialogLineItemProperties = {
              ...defaultLineItemSpending
            }
            this.$snotify.success(
              `${this.$tc('cpm.projects.lineItem', 1)} ${this.$t(
                'general.update'
              )}`,
              this.$t('alerts.success')
            )
            setTimeout(() => {
              this.fetchSpendings()
            }, 3000)
            this.closeDialogLineSpending()
            this.updateSpendingTotals().then(() =>
              this.getLineItemSpending(this.spendingToShow)
            )
          })
          .catch(err => {
            console.error(err)
            this.loading = false
            this.$snotify(
              this.$t('general.thereWasError'),
              this.$t('alerts.error')
            )
          })
      }
    },

    updateLineItemExpandedSpending() {
      const updateLineItem = {}
      Object.keys(this.dialogLineItemProperties).map(key => {
        if (key in this.dialogLineItemProperties && key !== 'id') {
          updateLineItem[key] = this.dialogLineItemProperties[key]
        }
      })

      this.loading = true
      const spendingReference = db
        .collection('cpm_projects')
        .doc(this.projectId)
        .collection('spendings')
        .doc(this.expandedSpending.id)

      this.updateLineItem({
        spendingRef: spendingReference,
        lineItem: updateLineItem,
        lineItemId: this.dialogLineItemProperties.id
      })
        .then(() => {
          this.fetchLineItems(this.expandedSpending)
          this.updateSpendingTotals().then(() =>
            this.getLineItemSpending(this.spendingToShow)
          )
          this.closeDialogLineSpending()
        })
        .catch(err => {
          console.error(err)
          this.loading = false
          this.$snotify(
            this.$t('general.thereWasError'),
            this.$t('alerts.error')
          )
        })
    },

    closeDialogLineSpending() {
      this.dialogLineItem = false
      this.dialogLineItemProperties = { ...defaultLineItemSpending }
      this.resetFormLineSpending()
      this.loading = false
    },

    resetFormLineSpending() {
      if (this.$refs.formLineItem) {
        this.$refs.formLineItem.reset()
      }
      this.validLineItem = true
    },

    openLineItems() {
      this.dialogLineItemProperties = { ...defaultLineItemSpending }
      this.dialogLineItemProperties.dateText = this.formatDate(
        new Date().toISOString().substr(0, 10)
      )
      this.dialogLineItemProperties.paidDateText = this.formatDate(
        new Date().toISOString().substr(0, 10)
      )
      this.resetFormLineSpending()
      this.methodLineItem = 'add'
      this.dialogLineItem = true
    },

    openEditLineItem(item, fromExpanded = false) {
      this.resetFormLineSpending()
      this.dialogLineItemProperties = item
      this.methodLineItem = 'put'
      this.dialogLineItem = true
    },

    getParseLineItem(lineItem) {
      return {
        number: lineItem.number || '',
        po_number: lineItem.po_number || '',
        project_name: lineItem.project_name || '',
        line_number: lineItem.line_number || '',
        amount: lineItem.amount ? parseFloat(lineItem.amount) : 0,
        category: lineItem.category || '',
        account: lineItem.account || '',
        account_category: lineItem.account_category || '',
        aoc_code: lineItem.aoc_code || '',
        client_capital_id: lineItem.client_capital_id || '',
        custom_numeric_1: lineItem.custom_numeric_1 || null,
        custom_text_1: lineItem.custom_text_1 || null,
        custom_text_2: lineItem.custom_text_2 || null,
        custom_text_3: lineItem.custom_text_3 || null,
        custom_text_4: lineItem.custom_text_4 || null,
        status: lineItem.status || '',
        dateText: lineItem.dateText || '',
        paidDateText: lineItem.paidDateText || '',
        vendor: lineItem.vendor || {},
        line_description: lineItem.line_description || '',
        reconciled: lineItem.reconciled || false
      }
    },

    replaceLineItem(spendingId, lineItem) {
      return new Promise((resolve, reject) => {
        try {
          const aux = this.getParseLineItem(lineItem)

          db.collection('cpm_projects')
            .doc(this.projectId)
            .collection('spendings')
            .doc(spendingId)
            .collection('line_items')
            .doc(lineItem.id)
            .update(aux)
            .then(() => {
              resolve(true)
            })
        } catch (error) {
          reject(error)
        }
      })
    },

    addLineItem(spendingId, lineItem) {
      return new Promise((resolve, reject) => {
        try {
          const aux = this.getParseLineItem(lineItem)
          db.collection('cpm_projects')
            .doc(this.projectId)
            .collection('spendings')
            .doc(spendingId)
            .collection('line_items')
            .add(aux)
            .then(snap => {
              lineItem.id = snap.id
            })
        } catch (error) {
          reject(error)
        }
      })
    },

    async solveLineItems(spendingId) {
      this.lineItems.map(async lineItem => {
        // if lineitem has id  then replace the values
        if (lineItem.id) {
          await this.replaceLineItem(spendingId, lineItem)
        // if lineitem has not id create a new one
        } else {
          await this.addLineItem(spendingId, lineItem)
        }
      })

      // update the lineitems in the spending
      const spendingIndex = this.resources.findIndex(
        spending => spending.id === spendingId
      )

      if (spendingIndex > -1) {
        this.resources[spendingIndex].lineItems = this.lineItems
      }
    },

    // Spendings
    resetForm() {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.valid = true
    },

    checkErrors() {
      this.valid = this.$refs.form.validate()
      if (!this.valid) {
        this.$snotify.error(
          this.$t('alerts.pleaseCheckErrors'),
          this.$t('alerts.error')
        )
        return
      }
    },

    deleteFileNotSaved(item) {
      const confirmation = confirm(
        `${this.$t('general.sureDeleteResource', {
          resource: this.$tc('general.file', 1)
        })}: ${item.name}`
      )
      if (confirmation) {
        const index = this.filesToAdd.findIndex(c => c.name === item.name)

        if (index > -1) {
          this.filesToAdd.splice(index, 1)
        }
      }
    },

    detectFilesAdd(e) {
      const fileList = e.target.files || e.dataTransfer.files
      const duplicates = []
      Array.from(Array(fileList.length).keys()).map(x => {
        const file = fileList[x]
        const duplicate = this.filesToAdd.find(c => c.name === file.name)
        if (duplicate) {
          duplicates.push(duplicate)
        } else {
          this.filesToAdd.push({
            name: file.name,
            file: file.type,
            size: file.size,
            url: file.name,
            path: file.name,
            fileToSave: file
          })
        }
      })

      if (duplicates.length) {
        let msg = this.$t('general.fileOverwritten')
        duplicates.map(d => {
          msg += `${d.name}, `
        })
        msg += this.$t('general.youWantContinue')
        const confirmation = confirm(msg)
        if (confirmation) {
          duplicates.map(d => {
            const index = this.filesToAdd.indexOf(d)
            this.filesToAdd.splice(index, 1)
          })
        } else {
          return false
        }
      }
    },

    async addSaveFilesSpending(spendingId) {
      const path = this.$h.dg(this.project, 'files.1.children.6.path')

      if (!path) {
        return
      }

      await Promise.all(
        this.filesToAdd.map(x => {
          const file = x

          return storage
            .ref(`projects/${this.projectId}${path}/${spendingId}/${file.name}`)
            .put(file.fileToSave)
        })
      ).then(async uploadedFiles => {
        await Promise.all(
          uploadedFiles.map(snapshot =>
            snapshot.ref.getDownloadURL().then(downloadUrl => {
              this.files.push({
                name: snapshot.ref.name,
                file: snapshot.metadata.contentType,
                size: snapshot.metadata.size,
                url: downloadUrl,
                path: snapshot.ref.fullPath
              })
            })
          )
        )
      })

      // Updating spending files
      await db
        .collection('cpm_projects')
        .doc(this.projectId)
        .collection('spendings')
        .doc(spendingId)
        .update({
          files: this.files
        })
      // Updating files in project
      this.project.files[1].children[6].children.push({
        name: this.folderName,
        path: this.project.files[1].children[6].path + '/' + spendingId,
        children: this.files
      })

      await db
        .collection('cpm_projects')
        .doc(this.projectId)
        .update({ files: this.project.files })
    },

    async updateSaveFilesSpending(spendingId) {
      const path = this.$h.dg(this.project, 'files.1.children.6.path')

      if (!path) {
        return
      }

      await Promise.all(
        this.filesToAdd.map(x => {
          const file = x
          return storage
            .ref(`projects/${this.projectId}${path}/${spendingId}/${file.name}`)
            .put(file.fileToSave)
        })
      ).then(async uploadedFiles => {
        await Promise.all(
          uploadedFiles.map(snapshot =>
            snapshot.ref.getDownloadURL().then(downloadUrl => {
              this.spendingFiles.push({
                name: snapshot.ref.name,
                file: snapshot.metadata.contentType,
                size: snapshot.metadata.size,
                url: downloadUrl,
                path: snapshot.ref.fullPath
              })
            })
          )
        )
      })

      await db
        .collection('cpm_projects')
        .doc(this.projectId)
        .collection('spendings')
        .doc(spendingId)
        .update({
          files: this.spendingFiles
        })

      // Updating files in project
      this.project.files[1].children[6].children.push({
        name: this.folderName,
        path: this.project.files[1].children[6].path + '/' + spendingId,
        children: this.spendingFiles
      })

      await db
        .collection('cpm_projects')
        .doc(this.projectId)
        .update({ files: this.project.files })
    },

    selectFileAdd() {
      this.$refs.uploadInputAdd.click()
    },

    async openModal() {
      this.expandedSpending = {}
      this.dialogProperties = this.defaultItemSpending
      this.resetForm()
      await this.updateProjectId()
      this.method = 'add'
      this.dialogSpending = true
      this.lineItems = []
    },

    deleteItem(item, index) {
      const confirmation = confirm(
        this.$t('general.sureDeleteResource', {
          resource: this.$tc('general.item', 1)
        })
      )
      if (confirmation) {
        this.project.risks.splice(index, 1)
      }
    },

    closeModal() {
      this.spendingToShow = {}
      this.dialogSpending = false
      this.dialogProperties = this.defaultItemSpending

      this.method = 'add'
      this.filesToAdd = []
      this.files = []
      this.spendingFiles = []
      this.loading = false
    },

    updateProjectId() {
      return new Promise((resolve, reject) => {
        try {
          this.projectRef.get().then(async doc => {
            const invoiceNumber = doc.data().nextInvoiceNumber
            await this.projectRef.update({
              nextInvoiceNumber: parseInt(invoiceNumber) + 1
            })
            let idString = '00000' + invoiceNumber
            const year = new Date().getFullYear()
            idString = idString.substr(idString.length - 5)
            this.folderName = `INV-${idString}-${year}`
            this.dialogProperties.number = `INV-${idString}-${year}`

            resolve(true)
          })
        } catch (error) {
          reject(error)
        }
      })
    },

    getRefCommitment(commitId) {
      return db
        .collection('cpm_projects')
        .doc(this.projectId)
        .collection('commitments')
        .doc(commitId)
    },

    getParseSpending() {
      if (this.$h.dg(this.dialogProperties, 'budget_category.ref.id')) {
        this.setDialogPropertiesCategoryRef(
          db
            .collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('budgets')
            .collection('budget_categories')
            .doc(this.dialogProperties.budget_category.ref.id)
        )
      } else {
        delete this.dialogProperties.budget_category
      }

      return {
        id: this.dialogProperties.id || null,
        number: this.dialogProperties.number || '',
        commitment: this.$h.dg(this.dialogProperties, 'commitment.id')
          ? this.getRefCommitment(this.dialogProperties.commitment.id)
          : {},
        poNumber: this.dialogProperties.commitment ? this.dialogProperties.commitment.number || '' : '',
        costCode: this.dialogProperties.costCode || '',
        costCodeNumber: this.dialogProperties.costCodeNumber || 0,
        costCodeText: this.dialogProperties.costCodeText || '',
        description: this.dialogProperties.description || '',
        contingency: this.dialogProperties.contingency || false,
        paidDateText: this.dialogProperties.paidDateText || '',
        dateOpenedText: this.dialogProperties.dateOpenedText || '',
        postingDateText: this.dialogProperties.postingDateText || '',
        createdAt: new Date(),
        // TODO: move this calculation to backend
        amount: 0,
        date: new Date().toISOString(),
        budget_category: {
          ref: this.$h.dg(this.dialogProperties, 'budget_category.ref', '')
        },
        glaccount: this.dialogProperties.glaccount
          ? this.dialogProperties.glaccount : {},
        paidToDateAmount: this.dialogProperties.paidToDateAmount
      }
    },

    newSpending() {
      // Updating project
      const auxSpending = this.getParseSpending()
      // Add spending
      this.createSpending({
        projectId: this.projectId,
        spending: auxSpending
      })
        .then(async doc => {
          const spendingDoc = await doc.get()
          const spending = {
            id: spendingDoc.id,
            ...spendingDoc.data()
          }

          this.$nextTick(() => this.addResourceIfNotExists(spending))
          this.updateSpendingTotals(doc.id)

          // adding files
          await this.addSaveFilesSpending(doc.id)
          auxSpending.id = doc.id
          auxSpending.files = this.files
          await this.solveLineItems(doc.id)

          // Resetting modal
          this.closeModal()
          this.$snotify.success(
            this.$t('cpm.projects.spendingCreated'),
            this.$t('alerts.success')
          )
        })
        .catch(error => {
          console.error(error)
          this.$snotify.error(
            'There was an error while creating the Spending',
            'Error'
          )
        })
    },
    addResourceIfNotExists(resource) {
      if (!this.$h.dg(resource, 'id')) return

      const index = this.lodash.findIndex(this.resourcesRaw, {
        id: resource.id
      })

      if (index === -1) {
        this.resourcesRaw.unshift(resource)
      }
    },

    updateSpending() {
      // Updating project
      const auxSpending = this.getParseSpending()
      // Updating spendings
      this.submitUpdateSpending({
        projectId: this.projectId,
        spending: auxSpending
      }).then(async () => {
        this.updateSpendingTotals()

        // adding files
        await this.updateSaveFilesSpending(this.dialogProperties.id)
        await this.fetchSpendings()
        await this.solveLineItems(this.dialogProperties.id)

        // Resetting modal
        this.closeModal()
        this.$snotify.success(
          this.$t('cpm.projects.spendingUpdated'),
          this.$t('alerts.success')
        )
      })
    },

    async saveSpending() {
      this.checkErrors()

      if (!this.valid) {
        return
      }

      this.formWasValidated = true
      if (!this.$h.dg(this.dialogProperties, 'budget_category.ref')) {
        this.$snotify.warning(
          `${this.$t('general.pleaseSelectResource', {
            resource: this.$tc('cpm.projects.budgetCategory')
          })}`
        )
        return
      }

      this.loading = true

      switch (this.method) {
        case 'add':
          await this.newSpending()
          break
        case 'put':
          await this.updateSpending()
          break
      }
    },

    getLineItemSpending(spending) {
      return new Promise((resolve, reject) => {
        try {
          db.collection('cpm_projects')
            .doc(this.projectId)
            .collection('spendings')
            .doc(spending.id)
            .collection('line_items')
            .get()
            .then(snap => {
              if (!snap.empty) {
                resolve(true)
              }

              spending.lineItems = snap.docs.map(doc => {
                const lineItem = doc.data()
                lineItem.id = doc.id

                return lineItem
              })

              if (spending.id === this.spendingToShow.id) {
                this.spendingToShow = { ...spending }
              }

              if (spending.id === this.dialogProperties.id) {
                this.dialogProperties = { ...spending }
              }

              resolve(true)
            })
        } catch (error) {
          reject(error)
        }
      })
    },

    getExpandedSpendingLineItems(spending) {
      return new Promise((resolve, reject) => {
        this.loadingExpandedSpendingLineItems = true

        try {
          db.collection('cpm_projects')
            .doc(this.projectId)
            .collection('spendings')
            .doc(spending.id)
            .collection('line_items')
            .get()
            .then(snap => {
              if (!snap.empty) {
                resolve(true)
              }

              spending.lineItems = snap.docs.map(doc => {
                const lineItem = doc.data()
                lineItem.id = doc.id

                return lineItem
              })

              this.loadingExpandedSpendingLineItems = false
            })
        } catch (error) {
          reject(error)
          this.loadingExpandedSpendingLineItems = false
        }
      })
    },

    setDialogPropertiesCategoryRef(category = '') {
      if (!this.dialogProperties) {
        this.dialogProperties = {}
      }
      if (!this.dialogProperties.budget_category) {
        this.dialogProperties.budget_category = {}
      }

      this.dialogProperties.budget_category.ref = category // this store all the data and the ref of the bc
    },

    async openUpdateSpending(spending = {}) {
      if (typeof spending.commitment === 'string') {
        const commitmentId = spending.commitment
        spending.commitment = {
          id: commitmentId
        }
      } else {
        spending.commitment.id = spending.commitment._path ? spending.commitment._path.segments[3] : null
      }


      this.expandedSpending = {}
      this.spendingToShow = spending
      await this.getLineItemSpending(spending)
      this.method = 'put'

      this.dialogProperties = { ...spending }


      if (typeof spending.budget_category === 'object') {
        if (this.$h.dg(spending.budget_category, 'ref._path.segments')) {
          const ref = this.$h.ffGetRef(
            spending.budget_category.ref._path.segments
          )
          const doc = await ref.get()
          const data = await doc.data()
          data.id = ref.id
          data.ref = doc.ref
          this.dialogProperties.budget_category.ref = data
        }
      }
      this.dialogProperties.id = spending.id
      this.spendingFiles = spending.files ? spending.files : []
      this.lineItems = spending.lineItems || []

      if (spending.commitment) {
        const id = this.$h.dg(spending, 'commitment.id', spending.commitment)
        const commitment = this.commitments.find(c => c.id === id || c.number === id)

        if (commitment) {
          this.dialogProperties = {
            ...this.dialogProperties,
            commitment
          }
        }
      }

      this.dialogSpending = true
    },

    openDeleteSpending(spending) {
      this.method = 'delete'
      this.dialogProperties = spending
      this.dialogProperties.id = spending.id
    },

    deleteSpending() {
      if (!this.dialogProperties.id) {
        return
      }

      this.loading = true
      const index = this.resourcesTest.findIndex(
        spending => this.dialogProperties.id === spending.id
      )

      if (index < -1) {
        return
      }

      this.submitDeleteSpending({
        projectId: this.projectId,
        spendingId: this.dialogProperties.id
      }).then(() => {
        this.resourcesRaw.splice(index, 1)
        this.resourcesTest.splice(index, 1)
        this.$snotify.success(
          this.$t('cpm.projects.spendingDeleted'),
          this.$t('alerts.success')
        ),
        this.closeModal()
      })
    },

    async deleteFile(item) {
      const index = this.resources.findIndex(
        spending => this.dialogProperties.id === spending.id
      )
      if (index < 0) {
        return
      }

      const confirmation = confirm(
        `${this.$t('general.sureDeleteResource', {
          resource: this.$tc('general.file', 1)
        })}: ${item.name}`
      )
      if (confirmation) {
        // Delete file from spending
        const spendingAux = this.resources[index]

        const indexFile = this.spendingFiles.findIndex(
          c => c.path === item.path
        )
        if (indexFile < 0) {
          return
        }
        this.spendingFiles.splice(indexFile, 1)
        spendingAux.files = this.spendingFiles

        // Delete file for project
        const project = this.project.files[1].children[6].children.find(
          project =>
            project.path ===
            this.project.files[1].children[6].path +
              '/' +
              this.dialogProperties.id
        )

        if (!project) {
          return
        }

        project.children = this.spendingFiles

        await db
          .collection('cpm_projects')
          .doc(this.projectId)
          .collection('spendings')
          .doc(this.dialogProperties.id)
          .update({
            files: this.spendingFiles
          })

        // Updating project files
        await db
          .collection('cpm_projects')
          .doc(this.projectId)
          .update({ files: this.project.files })

        const deletePath = item.path
        // Deleting physical file
        storage
          .ref(deletePath)
          .delete()
          .then(() => {
            this.$snotify.success(
              this.$t('general.fileDelete'),
              this.$t('alerts.success')
            )
          })
          .catch(error => {
            console.error(this.$t('general.fileDeleteError'), error)
          })
      }
    },
    setCodes(category) {
      if (!category) return
      this.dialogProperties.costCode = category.code || ''
      this.dialogProperties.costCodeNumber = category.code || 0
      this.dialogProperties.costCodeText = category.name || ''
    },
    setBudgetCategory(category) {
      this.setDialogPropertiesCategoryRef(category)
    },

    getDateFromText(date) {
      if (!date) {
        return ''
      }

      return new Date(date)
    },

    fetchLineItems(props) {
      this.expandedSpending.lineItems = []
      this.spendingToShow = props.item ? { ...props.item } : { ...props }
      this.expandedSpending = props.item ? { ...props.item } : props
      this.getExpandedSpendingLineItems(this.expandedSpending)
      props.expanded = !props.expanded
    }
  }
}
</script>

<style scoped lang="scss">
.money-fix {
  font-size: 12px !important;
  color: rgba(0, 0, 0, 0.54) !important;
  padding-top: 5px !important;
  padding-bottom: 6px !important;
}

input.v-money {
  margin: 0px !important;
}

.search {
  cursor: pointer;
  color: white;
}

.close-search {
  cursor: pointer;
  color: white;
}

.search-activated {
  margin-top: 0px;
}

.card-scroll {
  height: 70vh;
  overflow: auto;
}

.blobs-container {
  display: flex;
}

.blob {
  background: transparent !important;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  margin: 10px;
  height: 24px;
  width: 24px;
  transform: scale(1);
  animation: pulse-black 2s infinite;
}

@keyframes pulse-black {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}

.blob.white {
  background: transparent;
  box-shadow: 0 0 0 0 rgba(255, 255, 255, 1);
  animation: pulse-white 2s infinite;
}

@keyframes pulse-white {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.blob.red {
  background: rgba(255, 82, 82, 1);
  box-shadow: 0 0 0 0 rgba(255, 82, 82, 1);
  animation: pulse-red 2s infinite;
}

@keyframes pulse-red {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
  }
}

.blob.orange {
  background: rgba(255, 121, 63, 1);
  box-shadow: 0 0 0 0 rgba(255, 121, 63, 1);
  animation: pulse-orange 2s infinite;
}

@keyframes pulse-orange {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 121, 63, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 121, 63, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 121, 63, 0);
  }
}

.blob.yellow {
  background: rgba(255, 177, 66, 1);
  box-shadow: 0 0 0 0 rgba(255, 177, 66, 1);
  animation: pulse-yellow 2s infinite;
}

@keyframes pulse-yellow {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 177, 66, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 177, 66, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 177, 66, 0);
  }
}

.blob.blue {
  background: rgba(52, 172, 224, 1);
  box-shadow: 0 0 0 0 rgba(52, 172, 224, 1);
  animation: pulse-blue 2s infinite;
}

@keyframes pulse-blue {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(52, 172, 224, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(52, 172, 224, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(52, 172, 224, 0);
  }
}

.blob.green {
  background: rgba(51, 217, 178, 1);
  box-shadow: 0 0 0 0 rgba(51, 217, 178, 1);
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(51, 217, 178, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(51, 217, 178, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(51, 217, 178, 0);
  }
}

.blob.purple {
  background: rgba(142, 68, 173, 1);
  box-shadow: 0 0 0 0 rgba(142, 68, 173, 1);
  animation: pulse-purple 2s infinite;
}

@keyframes pulse-purple {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(142, 68, 173, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(142, 68, 173, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(142, 68, 173, 0);
  }
}
</style>

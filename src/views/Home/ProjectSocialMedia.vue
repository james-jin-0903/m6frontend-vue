<!--eslint-disable vue/v-on-function-call-->
<!-- eslint-disable vue/no-parsing-error -->
<template>
  <v-container
    class="mx-auto py-0 rounded-lg w-full"
    :class="recordView ? 'px-0' : ''"
    fluid
    :style="recordView ? 'max-width: 659px;' : ''"
  >
    <header-component
      v-if="!readOnly"
      class="mb-0 rounded"
      :class="isExpanded? 'expand-on' : 'expand-off'"
      hasslot
      :info="{ title: 'Create Post', icon: '' }"
      :is-typing="isTaskMatch"
      :record-view="recordView"
    >
      <template
        v-slot:select
      >
        <div class="">
          <v-menu
            v-model="groupFilter"
            bottom
            :close-on-content-click="false"
            offset-y
            transition="slide-y-transition"
          >
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                class="capitalize font-weight-bold ma-0 pa-0 purple--text text--darken-1 text-center transparent type-class"
                elevation="0"
                v-on="on"
              >
                {{ titlePage }}
                <v-icon class="blue--text text--darken-3">
                  mdi-chevron-down
                </v-icon>
              </v-btn>
            </template>
            <template v-if="!postListShow">
              <v-list
                dense
              >
                <v-list-item
                  v-for="(item, i) in areas"
                  :key="i"
                >
                  <v-list-item-title
                    :class="
                      item.type === 'title' ? 'grey--text' : 'black--text pointer'
                    "
                    @click="item.function"
                  >
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-group v-if="!recordView">
                  <template v-slot:activator>
                    <v-list-item-title>Company Groups</v-list-item-title>
                  </template>
                  <v-list-item
                    v-for="group in myTaxonomies"
                    :key="group.id"
                    @click="setFeed(group)"
                  >
                    <v-list-item-title>
                      {{ group.taxonomy.title }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list-group>

                <div v-else>
                  <v-list-group
                    v-for="(itm, ind) in appsRecords"
                    :key="`app-${ind}`"
                  >
                    <template v-slot:activator>
                      <v-list-item-title>{{ itm.title }}</v-list-item-title>
                    </template>
                  </v-list-group>
                </div>
              </v-list>
            </template>
          </v-menu>
        </div>
      </template>
      <template
        v-if="!external"
        v-slot:user
      >
        <v-spacer />
      </template>
      <template v-slot:image>
        <v-icon
          v-if="user.avatar === ''"
          class="icon-position"
          color="primary"
          size="40"
        >
          mdi-account-outline
        </v-icon>
        <img
          v-else
          :alt="user.firstName"
          class="img-position mr-1 rounded-circle"
          height="40"
          :src="user.avatar"
          width="40"
        >
      </template>

      <template #input>
        <v-row
          align="center"
          no-gutters
        >
          <v-col cols="12">
            <div class="w-full">
              <input
                v-show="false"
                ref="fileInput"
                multiple
                type="file"
                @change="onFilesChange"
              >
              <div
                v-if="srcVideoOrImageFiles.length > 0"
                class="align-center d-flex grey--text text-caption"
                :class="!recordView ? 'my-2' : ''"
              >
                <v-divider class="blue-grey lighten-5" />
                <span class="mx-3">Image/Video</span>
                <v-divider class="blue-grey lighten-5" />
              </div>
              <div v-if="srcVideoOrImageFiles.length > 0">
                <div
                  class="d-flex images-container mx-1 preview__container px-0 py-0"
                >
                  <div
                    v-for="(srcVideoOrImage, index) in srcVideoOrImageFiles"
                    :key="'previewVI-' + index"
                    class="mx-1 relative w-fit"
                    @click="removeVideoOrImage(index)"
                  >
                    <template v-if="srcVideoOrImage.type === 'image'">
                      <img
                        class="image-preview"
                        :src="srcVideoOrImage.url"
                        style="width: 100px; height: 100px;"
                      >
                      <v-btn
                        class="absolute btn-chat-shadow ml-2 right-0 top-0 v-close-btn"
                        color="grey lighten-2"
                        fab
                        @click="removeVideoOrImage(index)"
                      >
                        <v-icon size="12">
                          mdi-close
                        </v-icon>
                      </v-btn>
                    </template>
                    <template v-else>
                      <video
                        controls
                        height="100"
                        width="100"
                      >
                        <source
                          :src="srcVideoOrImage.url"
                          :type="srcVideoOrImage.type"
                        >
                        Your browser does not support the video tag.
                      </video>
                      <v-btn
                        class="absolute btn-chat-shadow ml-2 right-0 top-0 v-close-btn"
                        color="grey lighten-2"
                        fab
                        @click="removeVideoOrImage(index)"
                      >
                        <v-icon size="12">
                          mdi-close
                        </v-icon>
                      </v-btn>
                    </template>
                  </div>
                </div>
              </div>
              <div
                v-if="docsFiles.length > 0"
                class="align-center d-flex grey--text my-2 text-caption"
              >
                <v-divider class="blue-grey lighten-5" />
                <span class="mx-3">Documents</span>
                <v-divider class="blue-grey lighten-5" />
              </div>
              <div v-if="docsFiles.length > 0">
                <div
                  class="d-flex images-container mx-1 my-1 preview__container px-0 py-0"
                >
                  <div
                    v-for="(doc, index) in docsFiles"
                    :key="'doc-' + index"
                    class="mx-1 relative w-fit"
                  >
                    <v-chip
                      class="ma-2"
                      color="primary"
                    >
                      <span class="white--text">{{ doc.name }}</span>
                    </v-chip>
                    <v-btn
                      class="absolute btn-chat-shadow ml-2 my-1 right-0 top-0 v-close-btn"
                      color="grey lighten-2"
                      fab
                      @click="removeFile(index)"
                    >
                      <v-icon size="12">
                        mdi-close
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
              <div
                v-if="itemInfo['panel']"
                class="align-center d-flex grey--text text-caption"
                :class="!recordView ? 'my-2' : ''"
              >
                <v-divider class="blue-grey lighten-5" />
                <span class="mx-3">Panel</span>
                <v-divider class="blue-grey lighten-5" />
              </div>
              <div
                v-if="itemInfo['panel']"
                class="mx-1 relative w-full"
              >
                <v-row no-gutters>
                  <v-col
                    class="pr-3"
                    cols="3"
                  >
                    <p class="grey--text my-0 py-0 text-caption text-center">
                      App
                    </p>
                    <v-spacer />
                    <p class="my-0 py-0">
                      {{
                        itemInfo['recordId']['app']['title'].length < 30
                          ? itemInfo['recordId']['app']['title']
                          : itemInfo['recordId']['app']['title'].substr(0, 20) +
                            '...'
                      }}
                    </p>
                  </v-col>
                  <v-col
                    class="pr-3"
                    cols="3"
                  >
                    <p class="grey--text my-0 py-0 text-caption text-center">
                      Record
                    </p>
                    <v-spacer />
                    <p class="my-0 py-0">
                      {{
                        itemInfo['panel']['recordTitle'].length < 30
                          ? itemInfo['panel']['recordTitle']
                          : itemInfo['panel']['recordTitle'].substr(0, 20) +
                            '...'
                      }}
                    </p>
                  </v-col>
                  <v-col
                    class="pr-3"
                    cols="3"
                  >
                    <p class="grey--text my-0 py-0 text-caption text-center">
                      Tab
                    </p>
                    <v-spacer />
                    <p class="my-0 py-0">
                      {{
                        itemInfo['panel']['tabTitle'].length < 30
                          ? itemInfo['panel']['tabTitle']
                          : itemInfo['panel']['tabTitle'].substr(0, 20) + '...'
                      }}
                    </p>
                  </v-col>
                  <v-col
                    class="pr-3"
                    cols="3"
                  >
                    <p class="grey--text my-0 py-0 text-caption text-center">
                      Panel
                    </p>
                    <v-spacer />
                    <p class="my-0 py-0">
                      {{
                        itemInfo['panel']['panelTitle'].length < 30
                          ? itemInfo['panel']['panelTitle']
                          : itemInfo['panel']['panelTitle'].substr(0, 20) +
                            '...'
                      }}
                    </p>
                  </v-col>
                </v-row>
                <v-btn
                  class="absolute btn-chat-shadow ml-2 my-1 right-0 top-0 v-close-btn"
                  color="grey lighten-2"
                  fab
                  @click="itemInfo['panel'] = undefined"
                >
                  <v-icon size="12">
                    mdi-close
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>
          <v-col
            class="pt-0"
            cols="12"
          >
            <v-combobox
              v-model="postValue"
              class="ma-0 px-0 search-input"
              dense
              :disabled="postListShow"
              :filter="filter"
              flat
              height="40"
              hide-details
              :items="autocomplete"
              label="What do you want to do?"
              :menu-props="menuProps"
              rounded
              :search-input.sync="postText"
              single-line
              solo
              @focus="mainInputClick(true)"
              @keyup="checkRegex"
              @keyup.enter="submit"
            >
              <template #append>
                <v-row
                  class="align-center d-flex"
                  style="min-width: 108px;"
                >
                  <v-menu
                    bottom
                    offset-y
                    open-on-hover
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        color="primary"
                        dark
                        icon
                        :x-small="$vuetify.breakpoint.smAndDown"
                        v-on="on"
                        @click="$refs.fileInput.click()"
                      >
                        <v-icon>mdi-file-plus-outline</v-icon>
                      </v-btn>
                    </template>
                  </v-menu>
                  <v-menu
                    v-model="menu"
                    bottom
                    :close-on-content-click="false"
                    offset-y
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        color="primary"
                        dark
                        icon
                        :x-small="$vuetify.breakpoint.smAndDown"
                        v-on="on"
                      >
                        <v-icon>mdi-apps</v-icon>
                      </v-btn>
                    </template>
                    <v-list width="256">
                      <v-list-item>
                        <v-select
                          v-model="itemInfo.applicationId"
                          item-text="title"
                          item-value="id"
                          :items="availableApps"
                          label="Application"
                          @change="changeApp($event)"
                        >
                          <template
                            slot="selection"
                            slot-scope="data"
                          >
                            <!-- HTML that describe how select should render selected items -->
                            {{
                              data.item.title.length < 8
                                ? data.item.title
                                : data.item.title.substr(0, 7) + '...'
                            }}
                          </template>
                        </v-select>
                      </v-list-item>
                      <v-list-item>
                        <v-select
                          v-model="itemInfo.recordId"
                          :class="{ disabled: itemInfo.applicationId === null }"
                          height="50"
                          :item-value="Object"
                          :items="options.records"
                          label="Record"
                          @change="selectRecord($event)"
                        >
                          <template
                            slot="selection"
                            slot-scope="data"
                          >
                            <!-- HTML that describe how select should render selected items -->
                            {{ data.item.record_number }} -
                            {{
                              data.item.title.length < 8
                                ? data.item.title
                                : data.item.title.substr(0, 7) + '...'
                            }}
                          </template>
                          <template
                            slot="item"
                            slot-scope="data"
                          >
                            <!-- HTML that describe how select should render items when the select is open -->
                            {{ data.item.record_number }} -
                            {{ data.item.title }}
                          </template>
                        </v-select>
                      </v-list-item>
                      <v-list-item>
                        <v-select
                          v-model="itemInfo.panel"
                          :class="{ disabled: itemInfo.applicationId === null }"
                          height="50"
                          item-text="label"
                          :item-value="Object"
                          :items="options.panles"
                          label="Panel"
                          @change="selectPanel($event)"
                        >
                          <template
                            slot="selection"
                            slot-scope="data"
                          >
                            <!-- HTML that describe how select should render selected items -->
                            {{
                              data.item.label.length < 8
                                ? data.item.label
                                : data.item.label.substr(0, 7) + '...'
                            }}
                          </template>
                        </v-select>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <v-btn
                    :disabled="postListShow"
                    icon
                    :x-small="$vuetify.breakpoint.smAndDown"
                    @click="submit"
                  >
                    <v-icon class="blue--text text--lighten-1">
                      mdi-send
                    </v-icon>
                  </v-btn>
                </v-row>
              </template>
            </v-combobox>
          </v-col>
        </v-row>
      </template>
      <template
        v-slot:action-input
      >
        <action-input
          class="mb-1 mt-16"
        />
      </template>
      <template
        v-slot:actionCard
      >
        <div
          v-if="kindPost === 'task'"
          class="mb-4"
        >
          <action-card-builder
            v-for="(item, index) in actionItems"
            :key="`${index}-actions`"
            :action-type="item.type"
            :has-default="item.default"
            :p-description="item.description"
            :p-title="item.title"
            :start-date="item.startDate"
            :submit-status="submitStatus"
            @close="closeActionCardBuilder(index)"
          />
        </div>
        <div
          v-if="kindPost === 'file'"
          class="mb-4"
        >
          <create-dynamic-file
            v-for="(item, index) in projectItems"
            :key="`${index}-app`"
            :app="item.app"
            :file="item.file"
            :submit-status="submitStatus"
            @close="closeFileBuilder(index)"
          />
        </div>
        <div
          v-if="kindPost === 'activity'"
          class="mb-4"
        >
          <create-activity
            v-for="(item, index) in activityItems"
            :key="`${index}-activity`"
            :app="item.app"
            :application-id="item.appId"
            :file="item.file"
            :get-activity="item.getActivity"
            :record-id="item.recordId"
            :submit-status="submitStatus"
            @close="closeActivityBuilder(index)"
          />
        </div>
      </template>
      <template v-slot:bottomCard>
        <post-item
          v-if="kindPost === 'post' && postText.length > 0"
          :data="previewPostData"
          :is-preview="true"
        />
      </template>
      <template
        v-if="isGet"
        v-slot:table
      >
        <v-data-table
          class="elevation-1 mb-4 w-full"
          :headers="headers"
          :items="getItems"
          :items-per-page="5"
          :loading="isGetLoadingTable"
          loading-text="Loading..."
          @click:row="pushInActivities"
        >
          <template v-slot:item.appId="{ item }">
            <v-img
              v-if="item.appImg"
              class="inline mr-4"
              max-height="20"
              max-width="20"
              :src="item.appImg"
              width="20"
            />
            <v-icon
              v-else
              class="inline mr-4"
              color="#3382FA"
            >
              mdi-file
            </v-icon>
            <span>{{ item.appName }}</span>
          </template>
        </v-data-table>
      </template>
    </header-component>

    <v-skeleton-loader
      v-if="showSkeletonPost"
      :class="!recordView ? 'my-3' : ''"
      type="list-item-avatar-three-line, actions"
    />
    <M6Loading :loading="showLoading" />
    <posts-list
      v-if="!postListShow"
      :external="external"
      :record-view="recordView"
    />
  </v-container>
</template>

<script>
/* eslint-disable camelcase */
import HeaderComponent from '@/components/Home/HeaderComponent'
import PostsList from '@/components/Home/SocialMedia/PostsList'
import ActionInput from '@/views/Home/ActionCenter/ActionInput'
import ActionCardBuilder from '@/views/Home/ActionCenter/ActionCardBuilder'
import PostItem from '@/components/Home/SocialMedia/PostItem'
import CreateDynamicFile from '@/components/RecordMode/RecordComponents/RecordType/DynamicApp/CreateDynamicFile'
import CreateActivity from '@/components/RecordMode/RecordComponents/RecordType/DynamicApp/CreateActivity'

import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'SocialMedia',
  components: {
    CreateDynamicFile,
    HeaderComponent,
    CreateActivity,
    PostsList,
    PostItem,
    ActionInput,
    ActionCardBuilder
  },
  props: {
    external: {
      type: Boolean,
      default: false
    },
    recordView: {
      type: Boolean,
      default: false
    },
    postListShow: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    headers: [
      {
        text: 'App',
        align: 'start',
        sortable: false,
        value: 'appId'
      },
      { text: 'Activity', value: 'activityName' },
      { text: 'File', value: 'recordName' }

    ],
    kindPost: '',
    actionItems: [],
    autocomplete: [],
    getItems: [],
    appsRecords: [],
    projectItems: [],
    activityItems: [],
    isTaskMatch: false,
    submitStatus: false,
    isAppMatch: false,
    titlePage: '',
    menu: false,
    showLoading: false,
    postText: '',
    postValue: '',
    docsFiles: [],
    imageFiles: [],
    urlInfo: {},
    itemInfo: {
      applicationId: null,
      recordId: null,
      panel: null
    },
    showSkeletonPost: false,
    options: {
      records: [],
      panles: [],
      type: []
    },
    availableApps: [],
    isExpanded: false,
    groupFilter: false,
    isSearch: false,
    isGet: false,
    isGetLoadingTable: false

  }),

  computed: {
    ...mapGetters('Auth', { user: 'getUser' }),
    ...mapGetters('Companies', { currentCompany: 'getCurrentCompany' }),
    ...mapGetters('Taxonomy', { myTaxonomies: 'getUserTaxonomies' }),
    ...mapGetters('GSFeed', { buildActivity: 'getBuildActivity' }),
    ...mapGetters('AppFeedView', {
      record: 'getRecord',
      app: 'getApp'
    }),
    previewPostData() {
      return {
        actor: {
          created_at: new Date(),
          updated_at: new Date(),
          id: this.user.id,
          data: {
            image: this.user.avatar,
            name: `${this.user.firstName} ${this.user.lastName}`
          }
        },
        message: this.postText,
        own_reactions: {},
        reaction_counts: {}
      }
    },
    menuProps() {
      return !this.postText || this.isGet ? { value: false } : {}
    },
    srcVideoOrImageFiles() {
      const srcVideoOrImages = []
      this.imageFiles.forEach(file => {
        if (file['type'].substr(0, file['type'].indexOf('/')) === 'video') {
          srcVideoOrImages.push({
            url: URL.createObjectURL(file),
            type: file['type']
          })
        }
        if (file['type'].substr(0, file['type'].indexOf('/')) === 'image') {
          srcVideoOrImages.push({
            url: URL.createObjectURL(file),
            type: 'image'
          })
        }
      })
      return srcVideoOrImages
    },
    areas() {
      return this.recordView ? [] : [
        {
          text: 'Private',
          type: 'subtitle',
          function: () => {
            this.privateState()
          }
        },
        {
          text: 'Everyone',
          type: 'subtitle',
          function: () => {
            this.printSc('Everyone')
          }
        },
        {
          text: this.currentCompany.result.name.split(' ')[0] + ' Central',
          type: 'subtitle',
          function: () => {
            this.companyState()
          }
        }
      ]
    }
  },
  watch: {
    buildActivity(value) {
      this.kindPost = 'task'
      this.actionItems.push({
        type: 'task',
        startDate: value.date,
        title: '',
        to: [],
        description: ''
      })
    },
    async postText(value) {
      const _isSearch = /(^(\b(search|s)\b)*\s+(\b(activity|task|people|status)\b))/gi
      const hasSearch = /(^(\b(search|s)\b)+\s*)$/gi

      const _isGet = /(^(\b(get|g)\b)*\s+(\b(ta|task|add|new|app|ac|activity|support)\b))/gi
      const hasGet = /(^(\b(get|g)\b)+\s*(?<name>(\w*\s*\w*)*)?)$/

      this.isSearch = hasSearch.test(value)
      this.isGet = hasGet.test(value)

      if (!_isGet.test(value) && this.isGet) {
        const words = value.match(hasGet).groups

        this.kindPost = ''
        this.isGetLoadingTable = true
        this.getItems = []
        const apps = await this.getAppsValue(words.name ? words.name : '')
        apps.forEach(app => {
          app.activities.forEach(activity => {
            app.records.forEach(record => {
              this.getItems.push({
                appId: app.id,
                appImg: app.iconLink,
                appName: app.title,
                recordName: record.title,
                recordId: record.id,
                activityName: activity.value,
                activityId: activity.id
              })
            })
          })
        })
        this.isGetLoadingTable = false
      }
      if (!_isSearch.test(value) && this.isSearch) {
        this.autocomplete = [
          value.trim() + ' App Name',
          value.trim() + ' File Name',
          value.trim() + ' Activity',
          value.trim() + ' Task',
          value.trim() + ' People',
          value.trim() + ' Status'
        ]
      }
    }
  },
  mounted() {
    this.$store.dispatch('Taxonomy/getUserTerms', { userId: this.user.id })
    this.$store.dispatch('GSFeed/cleanFeed')
    if (!this.external) {
      this.companyState()
    } else if (this.recordView) {
      this.getAppsValue('').then(apps => {
        this.appsRecords = apps
        this.recordState()
      })
    }

    this.getApps().then(response => {
      response.data.map(app => {
        this.availableApps.push({
          id: app.id,
          title: app.title
        })
      })
    })
  },
  methods: {
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger'
    }),
    ...mapActions('SocialNetworkModule', ['filter_posts']),
    ...mapActions('GetShortCode', ['getAppsValue']),
    ...mapActions('AppAttachments', { getPostsUrl: 'get_post_file_url' }),
    ...mapActions('AppAttachments', {
      setStreamFiles: 'set_stream_attachments'
    }),
    ...mapActions('WorkOrderModule', {
      getApps: 'getAvailableApps',
      getActions: 'getActionsFeed'
    }),
    ...mapActions('AppBuilder', {
      getFieldValues: 'getFieldValuesPerPanel'
    }),
    ...mapActions('GetShortCode', {
      getAppsValue: 'getAppsValue'
    }),
    pushInActivities(event) {
      this.isGet = false
      this.kindPost = 'activity'
      this.activityItems = []

      this.activityItems.push({
        type: 'activity',
        appId: event.appId.toString(),
        getActivity: event.activityId.toString(),
        recordId: event.recordId,
        file: '',
        description: ''
      })
    },
    filter(item, queryText, itemText) {
      const hasValue = val => val !== null ? val : ''

      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return text.toString()
        .toLowerCase()
        .indexOf(query.toString().toLowerCase()) > -1
    },
    changeApp(event) {
      this.getActions(event).then(response => {
        this.options['records'] = response.data
      })
    },
    getRecord(label) {
      const res = `${
        label['recordTitle'].length < 30
          ? label['recordTitle']
          : label['recordTitle'].substr(0, 20) + '...'
      } - ${
        label['label'].length < 30
          ? label['label']
          : label['label'].substr(0, 20) + '...'
      }`
      return res
    },
    submit() {
      if (this.postText.length > 0) {
        switch (this.kindPost) {
          case 'post':
            this.addActivity()
            break
          case 'task':
            this.submitStatus = true
            this.postText = ''
            break
          case 'file':
            this.submitStatus = true
            this.postText = ''
            break
        }
      }
    },
    fillOptions() {
      if (!this.postText) {
        this.autocomplete = ['get', 'search']
      }
    },
    closeActionCardBuilder(index) {
      this.actionItems.splice(index, 1)
      this.submitStatus = false
      this.postText = ''
    },
    closeFileBuilder(index) {
      this.projectItems.splice(index, 1)
      this.submitStatus = false
      this.postText = ''
    },
    closeActivityBuilder(index) {
      this.projectItems.splice(index, 1)
      this.submitStatus = false
      this.postText = ''
    },
    async selectRecord($event) {
      this.itemInfo['panel'] = null
      this.options['panles'] = []

      const app = await this.$store.dispatch(
        'AppBuilder/getApp',
        $event['app']['id']
      )

      app['tabs'].forEach(tab => {
        tab.panels.forEach(panel => {
          this.options['panles'].push({
            id: $event['id'],
            recordTitle: $event.title,
            label: `${tab['title']} - ${panel['title']}`,
            tabTitle: tab['title'],
            panelTitle: panel['title'],
            fields: panel['fields'],
            panelId: panel['id'],
            subtitle: $event.app.title,
            image: $event.app.iconLink,
            description: $event.description
          })
        })
      })
    },
    async selectPanel($event) {
      const values = await this.getFieldValues({
        recordID: $event['id'],
        panelID: $event['panelId']
      })

      const panel = []

      $event['fields'].forEach(field => {
        panel.push({ name: field.label, value: values['values'][field.id] })
      })

      this.urlInfo = {
        url: `${new URL(location.href)['href']}record/${$event.id}`,
        id: $event.id,
        panel: panel,
        description: $event['description'],
        panel_title: $event['panelTitle'],
        subtitle: $event['subtitle'],
        title: $event['recordTitle'],
        image: $event['image']
      }
      this.menu = false
    },
    printSc(msg) {
      this.titlePage = `${msg}`
      this.groupFilter = false
    },
    onFilesChange(files) {
      files['srcElement']['files'].forEach(file => {
        const type = file['type'].substr(0, file['type'].indexOf('/'))
        if (type === 'image' || type === 'video') {
          this.imageFiles.push(file)
        } else {
          this.docsFiles.push(file)
        }
      })
    },
    async privateState() {
      this.groupFilter = false
      this.titlePage = 'Private'
      await this.$store.dispatch('GSFeed/setRoom', 'users')
      await this.$store.dispatch('GSFeed/setFeed', this.user.id)
      await this.reloadFeed()
    },
    async companyState() {
      this.groupFilter = false
      this.titlePage = this.currentCompany.result.name.split(' ')[0] + ' Central'
      await this.$store.dispatch('GSFeed/setRoom', 'companies')
      await this.$store.dispatch('GSFeed/setCompanyFeed', this.user.id)
      await this.reloadFeed()
    },
    async recordState() {
      this.groupFilter = false
      this.titlePage = 'App name Central'
    },
    async setFeed(item) {
      this.groupFilter = false
      this.titlePage = item.taxonomy.title
      await this.$store.dispatch('GSFeed/setRoom', 'groups')
      await this.$store.dispatch('GSFeed/setCustomFeed', {
        id: `${this.currentCompany.result.id}_${item.taxonomy.id}`,
        userId: this.user.id,
        type: 'groups'
      })
      await this.reloadFeed()
    },
    addActivity() {
      this.showLoading = true
      this.showSkeletonPost = true
      const comp = this.user.currentCompany

      const urls = this.urlify()

      const activity = {
        req: {
          userID: this.user.id,
          data: {
            actor: {
              created_at: new Date(),
              updated_at: new Date(),
              id: this.user.id,
              data: {
                image: this.user.avatar,
                name: `${this.user.firstName} ${this.user.lastName}`
              }
            },
            message: this.postText,
            external_url: urls,
            record_url: this.urlInfo,
            verb: 'post',
            object: 1,
            images: this.imageFiles
          }
        },
        compID: comp
      }

      this.postText = ''

      this.$store.dispatch('GSFeed/addActivity', activity).then(async res => {
        if (this.imageFiles.length > 0) {
          const urls = []
          for (let index = 0; index < this.imageFiles.length; index++) {
            const image = this.imageFiles[index]
            const url = await this.setStreamFiles({
              files: image,
              headers: {
                'Content-Type': image['type'],
                'Content-Name': image['name'],
                'Stream-Id': res['data']['results'][0]['id'],
                'Stream-type': 'post'
              }
            })
            urls.push(url['attachUrl'])
            if (index === this.imageFiles.length - 1) {
              this.imageFiles = []
              const activity = res['data']['results'][0]
              if (typeof activity['actor'] === 'string') {
                activity['actor'] = JSON.parse(activity['actor'])
              }

              activity['actor']['data'][
                'name'
              ] = `${this.user.firstName} ${this.user.lastName}`
              activity['actor']['data']['image'] = this.user.avatar
              activity['images'] = urls

              await this.$store.dispatch('GSFeed/updateActivity', activity)
            }
          }
        }

        if (this.docsFiles.length > 0) {
          const urls = []
          for (let index = 0; index < this.docsFiles.length; index++) {
            const file = this.docsFiles[index]
            const url = await this.setStreamFiles({
              files: file,
              headers: {
                'Content-Type': file['type'],
                'Content-Name': file['name'],
                'Stream-Id': res['data']['results'][0]['id'],
                'Stream-type': 'post'
              }
            })

            urls.push(url['attachUrl'])
            if (index === this.docsFiles.length - 1) {
              this.docsFiles = []
              const activity = res['data']['results'][0]
              if (typeof activity['actor'] === 'string') {
                activity['actor'] = JSON.parse(activity['actor'])
              }

              activity['actor']['data'][
                'name'
              ] = `${this.user.firstName} ${this.user.lastName}`
              activity['actor']['data']['image'] = this.user.avatar
              activity['files'] = urls

              await this.$store.dispatch('GSFeed/updateActivity', activity)
            }
          }
        }

        await this.$store.dispatch('GSFeed/cleanFeed')
        this.showLoading = false
        await this.reloadFeed()

        this.urlInfo = {}
        this.itemInfo.applicationId = null
        this.itemInfo.recordId = null
        this.itemInfo.panel = null
        this.showSkeletonPost = false
      })
    },
    mainInputClick(p_isexp) {
      this.fillOptions()
      this.isExpanded = p_isexp
    },
    checkRegex() {
      this.isTaskMatch = false
      this.isAppMatch = false

      this.actionItems = []
      this.projectItems = []
      this.activityItems = []
      let temp_text = this.postText

      const reg_task = /(^(.*?(\b(get|g)\b)[^$]*)+(?<key>\b(ta|task))\b(?<title>(?:.*)))+/
      const reg_file = /(^(.*?(\b(get|g)\b)[^$]*)+(?<key>\b(add|new|app|ac|activity|support))\b(?<file_name>(?:.*)))+/i

      this.isTaskMatch = reg_task.test(temp_text)
      this.isAppMatch = reg_file.test(temp_text)

      if (this.isTaskMatch) {
        this.isGet = false
        const matchWorld = temp_text.match(reg_task).groups
        this.kindPost = 'task'
        temp_text = temp_text.replace(matchWorld.key, '')

        this.actionItems.push({
          type: matchWorld.key,
          default: 'Task',
          title: matchWorld.title,
          to: matchWorld.to ? matchWorld.to.split(' ') : [],
          description: matchWorld.desc
        })
      } else if (this.isAppMatch) {
        this.isGet = false
        const matchWorld = temp_text.match(reg_file).groups
        const key = matchWorld.key

        if (key === 'add' || key === 'new' || key === 'create') {
          this.kindPost = 'file'

          this.projectItems.push({
            type: key,
            app: matchWorld.app_name,
            file: matchWorld.file_name,
            description: matchWorld.description
          })
        } else if (key === 'activity' || key === 'ac' || key === 'support') {
          this.kindPost = 'activity'

          this.activityItems.push({
            type: key,
            file: matchWorld.file_name.trim(),
            description: matchWorld.description
          })
        }
      } else {
        if (temp_text !== '') {
          this.fillOptions()
        }
        if (!this.isGet) {
          this.kindPost = 'post'
        }
      }
    },
    urlify() {
      const urlRegex = /(https?:\/\/[^\s]+)/g
      const res = []
      this.postText.replace(urlRegex, function (url) {
        res.push(url)
      })
      return res
    },
    async reloadFeed() {
      await this.$store.dispatch('GSFeed/retrieveFeed')
    },
    removeVideoOrImage(index) {
      this.imageFiles.splice(index, 1)
    },
    removeFile(index) {
      this.docsFiles.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.type-class{
  float: right;
}
.icon-position{
  top: -20px !important;
}
.img-position{
  top: -20px !important;
}
.v-close-btn {
  height: 15px !important;
  width: 15px !important;
}
.v-select__selections {
  min-height: 30px;
}
.preview__container {
  flex-wrap: wrap;
}
.search-input{
  padding-top: 0px !important;
  .v-input__slot{
    background: #F0F2F5!important;
    background-color: #F0F2F5!important;
  }
}

.center-content{
  vertical-align: middle;
}
.center-menu{
    position: relative;
    float: right;
    left: 15vw;
}
 .v-text-field--solo-inverted.v-input--is-focused .v-select__selection--comma{
    background: green!important;
  }
/*@keyframes expand-anim-on{
  0%{
    height: 123px;
  }
  100%{
    height: 240px;
  }
}
@keyframes expand-anim-off{
  0%{
    height: 240px;
  }
  100%{
    height: 123px;
  }
}*/
</style>

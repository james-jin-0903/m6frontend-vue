<template>
  <v-card class="group-in-border-style">
    <v-card-title
      v-if="!item.appId || items[item.appId]['image'] === null"
      :style="`background:${colors.background}; backgroundAttachment: 'fixed';`"
    >
      <div class="banner-img-style" />
      <v-img
        v-if="item.appId && items[item.appId]['icon']"
        class="icon-style mr-4"
        max-height="25"
        max-width="25"
        :src="items[item.appId]['icon']"
      />
      <v-img
        v-else
        class="icon-style mr-4"
        max-width="25"
        src="@/assets/actioncenterIcons/Assign-Task.svg"
      />
      <v-text-field
        v-model="item.file"
        class="card-title-style mt-0 pt-0"
        :color="colors.text"
        value="item.file"
      />
      <v-avatar class="avatar-positioned">
        <v-img
          v-if="currentUser.avatar"
          class="icon-style ml-4"
          max-height="30"
          min-height="30"
          :src="currentUser.avatar"
          width="30"
        />
        <v-icon
          v-else
          size="30"
          style="top:-14px"
        >
          mdi-account
        </v-icon>
      </v-avatar>
    </v-card-title>
    <v-card-title
      v-else-if="typeof items[item.appId]['image'] === 'object' && items[item.appId]['image']['background']"
      :style="`background-image: url('${items[item.appId]['image']['background'] ?
        items[item.appId]['image']['background'] : colors.background}'); background-attachment: fixed;`"
    >
      <div class="banner-img-style rounded-t-lg" />
      <v-img
        v-if="items[item.appId]['icon']"
        class="icon-style mr-4"
        max-height="25"
        max-width="25"
        :src="items[item.appId]['icon']"
      />
      <v-img
        v-else
        class="icon-style mr-4"
        max-width="25"
        src="@/assets/actioncenterIcons/Assign-Task.svg"
      />
      <v-text-field
        v-model="item.file"
        class="card-title-style mt-0 pt-0"
        :color="colors.text"
        :style="`color:${items[item.appId]['image']['appIcon'] ?
          items[item.appId]['image']['appIcon']['iconColor']: colors.text}`"
        value="item.file"
      />
    </v-card-title>
    <v-card-title
      v-else-if="typeof items[item.appId]['image'] === 'object'"
      :style="`background:${items[item.appId]['image']['appIcon'] ?
        items[item.appId]['image']['appIcon']['background'] : colors.background}; backgroundAttachment: 'fixed';`"
    >
      <div class="banner-img-style" />
      <v-img
        v-if="items[item.appId]['icon']"
        class="icon-style mr-4"
        max-height="25"
        max-width="25"
        :src="items[item.appId]['icon']"
      />
      <v-img
        v-else
        class="icon-style mr-4"
        max-width="25"
        src="@/assets/actioncenterIcons/Assign-Task.svg"
      />
      <v-text-field
        v-model="item.file"
        class="card-title-style mt-0 pt-0"
        :color="colors.text"
        :style="`color:${items[item.appId]['image']['appIcon'] ?
          items[item.appId]['image']['appIcon']['iconColor']: colors.text}`"
      />
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-autocomplete
          v-model="appId"
          auto-select-first
          item-text="tab"
          item-value="index"
          :items="items"
          label="Select App"
          :rules="rules.number"
        />
        <v-autocomplete
          v-model="fileData.status"
          :items="statusOptions"
          label="File Status"
          :rules="rules.generic"
        />
        <v-textarea
          v-model="fileData.description"
          label="Description"
          rows="2"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        block
        @click="createFile"
      >
        Create
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'CreateDynamicFile',
  props: {
    file: {
      type: String,
      default: ''
    },
    submitStatus: {
      type: Boolean,
      default: false
    },
    app: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    statusOptions: ['Published', 'Draft', 'Archived'],
    rules: {
      generic: [v => !!v || 'Item is required'],
      number: [v => v !== null || 'Item is required']
    },
    items: [],
    item: {
      file: '',
      app: '',
      field: {}
    },
    fileData: {
      app_id: '',
      record_number: '',
      title: '',
      description: '',
      status: 'Draft',
      author: '',
      metadata: {}
    },
    appId: null,
    activities: [],
    fields: [],
    activity: {},
    colors: {
      background: '#EAEAEA',
      text: '#1F1F1F'
    }
  }),
  computed: {
    ...mapGetters('Auth', {
      currentUser: 'getUser'
    })
  },
  watch: {
    file(value) {
      this.item.file = value
    },
    submitStatus(val) {
      if (val) {
        this.createFile()
      }
    },
    app(value) {
      this.item.app = value
    },
    async appId(val) {
      this.fields = []
      this.item.appId = val
      this.activities = await this.getAppActivitie(this.items[val].id)
    },
    async activity(val) {
      const fields = await this.getAppFields(this.items[this.appId].id)
      const response = []

      val.fields.forEach(field => {
        response.push(fields.filter(r => r.id === field)[0])
      })
      this.fields = response
    }
  },
  async mounted() {
    this.item['file'] = this.file
    this.item['app'] = this.app
    try {
      const res = await this.getAppList()
      for (let x = 0; x < res.length; x++) {
        this.items.push({
          id: res[x].id,
          index: x,
          isGeneric: true,
          tab: res[x].title,
          component: 'GenericRecord',
          image: res[x].metadata ? JSON.parse(res[x].metadata) : null,
          icon: res[x].iconLink,
          prefix: res[x].prefix,
          app: res[x]
        })
      }
    } catch (e) {
      return
    }
  },
  methods: {
    ...mapActions('AppBuilder', {
      getAppList: 'getAppList',
      getAppActivitie: 'getAppActivitiesById',
      getAppFields: 'getAppFields',
      createRecord: 'createRecord'
    }),
    ...mapActions('AppAttachments', {
      setApp: 'post_attachment'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    async createFile() {
      try {
        if (!this.$refs.form.validate()) {
          this.notifDanger('Please Fill Out The Entire Form')
          return
        }

        this.fileData = {
          ...this.fileData,
          author: this.currentUser.id,
          appID: this.items[this.appId].id,
          title: this.item.file.trim(),
          image: ''
        }

        this.fileData = await this.createRecord({
          record: this.fileData,
          appId: this.items[this.appId].id,
          prefix: this.items[this.appId].prefix
        })

        this.notifSuccess('The Record Was Created')
        this.$emit('close')
      } catch (e) {
        this.notifDanger('There Was An Error While Creating The Record')
      }
    }
  }
}
</script>

<style>
.title{
  background-position: center;
}
.card-title-style{
    font-weight: bold;
    font-size: 1.5rem;
    position: relative;
    top: -2px;
  }
  .icon-style{
    top: -10px;
  }
  .banner-img-style{
    backdrop-filter: blur(5px);
    width: -webkit-fill-available;
    height: inherit;
    position: absolute;
    left: 0;
  }
  .avatar-positioned{
    position: relative;
    /*top: -14px;*/
    overflow: visible;
  }
</style>

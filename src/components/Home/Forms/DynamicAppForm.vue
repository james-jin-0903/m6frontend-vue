<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-row>
      <v-col
        class="pa-0 text-center"
        cols="12"
      >
        <m6-upload
          btn-button="white"
          class="ctm-m6-btn"
          @loading="loading = !loading"
          @response="responseRecordImg"
        >
          <v-avatar
            class="text-center"
            size="100"
          >
            <img
              v-if="appImage !== ''"
              :alt="appImage"
              :src="appImage"
            >
            <v-icon
              v-else
              size="100"
            >
              mdi-image-outline
            </v-icon>
          </v-avatar>
          <v-icon
            class="ctm-v-icon-circle"
            size="20"
          >
            mdi-cloud-upload
          </v-icon>
        </m6-upload>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="itemInfo.title"
          label="Title"
          required
          :rules="stringsRules('Title')"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="itemInfo.prefix"
          counter="3"
          label="Prefix"
          required
          :rules="stringLengthRules('Prefix')"
          @keypress="isLetter($event)"
        />
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          v-model="itemInfo.layout_type"
          :items="['Profile', 'Stepper', 'Website']"
          label="Layout Type"
          required
          :rules="stringsRules('Layout Type')"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="itemInfo.description"
          label="Description"
          required
          :rules="stringsRules('Description')"
        />
      </v-col>
      <v-col
        v-for="(tab, index) in itemInfo.tabs"
        :key="index + '-tab'"
        cols="12"
      >
        <v-chip color="green">
          <span class="white--text">{{ tab.title }}</span>
        </v-chip>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-btn
        class="mr-4"
        color="secondary"
        outlined
        @click="close"
      >
        Cancel
      </v-btn>
      <v-btn
        class="mr-4"
        color="primary"
        :disabled="!valid"
        outlined
        @click="validate"
      >
        Create
      </v-btn>
    </v-row>
  </v-form>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'DynamicAppForm',
  data: () => ({
    valid: false,
    showTabInput: false,
    appImage: '',
    loading: false,
    // RecordInfo
    itemInfo: {
      title: '',
      prefix: '',
      layout_type: '',
      description: '',
      tabs: []
    },
    // Lists
    validation: [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ]
  }),

  computed: {
    ...mapState('Auth', {
      currentUser: 'user'
    })
  },

  methods: {
    ...mapActions('DynamicAppsModule', {
      post_app: 'post_app',
      pushAppId: 'push_app_id'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger'
    }),
    responseRecordImg(res) {
      if (res.ok) {
        this.appImage = res.data.link
      } else {
        this.notifDanger('There was an error while saving the file')
      }
    },
    postNewDynamicApp() {
      this.itemInfo['image'] = {
        image_url: this.appImage === '' ? null : this.appImage
      }
      this.itemInfo.author = this.currentUser.id

      this.post_app(this.itemInfo)
        .then(res => {
          this.pushAppId(res['data']['id'])
          this.$router.push(`/dev/${res['data']['id']}`)
          this.$nextTick(() => {
            this.itemInfo = {}
          })
          this.close()
        })
        .catch(error => {
          let errorMsg = ''

          for (const i in error.response.data) {
            errorMsg += error.response.data[i] + '<br />'
          }
          this.notifDanger(errorMsg)
        })
    },
    pushTab() {
      this.itemInfo['tabs'].push(this.tab)
      this.tab = {
        readOnly: false,
        title: '',
        weight: 0,
        order: 0
      }
      this.showTabInput = false
    },
    isLetter(e) {
      const char = String.fromCharCode(e.keyCode)
      if (/^[A-Za-z]+$/.test(char)) return true
      else e.preventDefault()
    },
    selectRules(name) {
      return [v => !!v || name + ' is required']
    },
    radioRules(model) {
      return [model !== null || 'At least one item should be selected']
    },
    stringsRules(name) {
      return [
        v => !!v || name + ' is required',
        v => (v && v.length <= 255) || name + ' must be less than 255 characters'
      ]
    },
    stringLengthRules(name) {
      return [
        v => !!v || name + ' is required',
        v => v && v.length >= 1 || name + ' must be at least 1 character',
        v => v && v.length <= 5 || name + ' must be less than 5 characters'
      ]
    },
    close() {
      this.itemInfo = {}
      this.$emit('closeModal')
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.postNewDynamicApp()
      }
    }
  }
}
</script>

<style scoped>
.ctm-v-icon-circle {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #2196f3 !important;
  color: white;
  border-radius: 50%;
  padding: 0.2rem;
  box-sizing: content-box;
}
</style>

<style>
.ctm-m6-btn .v-btn {
  min-width: 100px;
  min-height: 100px;
  position: relative !important;
}
</style>

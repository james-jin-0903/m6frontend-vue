<template>
  <v-dialog
    v-model="show"
    max-width="600"
    persistent
    scrollable
  >
    <v-card>
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">
          {{ $t('cpm.projects.shareGantt') }}
        </span>
      </v-card-title>
      <v-divider class="grey lighten-3" />
      <v-card-text class="vertical-scroll">
        <v-container class="rounded-lg">
          <v-row
            v-if="!previewShow"
            class="fill-height fluid"
            column
          >
            <v-col>
              <label id="step18">{{ $t('cpm.projects.shareWith') }}</label>
              <v-text-field
                v-model="mail"
                :placeholder="$t('cpm.projects.customMail')"
              />
            </v-col>
            <br><br>
            <v-divider />
            <br><br>
            <v-col>
              <label>{{ $t('cpm.projects.expiryDate') }}</label>
              <v-menu
                v-model="fromDateMenu"
                :close-on-content-click="false"
                full-width
                lazy
                max-width="20.5rem"
                min-width="20.5rem"
                :nudge-right="40"
                offset-y
                transition="scale-transition"
              >
                <template v-slot:activator="{ on }">
                  <v-row>
                    <v-col cols="10">
                      <v-btn
                        id="step19"
                        class="ma-2"
                        :disabled="!expire"
                        outline
                        tile0
                        v-on="on"
                      >
                        <v-icon left>
                          mdi-calendar-check
                        </v-icon>
                        {{ expireDate.formated }}
                      </v-btn>
                    </v-col>
                    <v-col cols="2">
                      <v-switch
                        v-model="expire"
                        :label="
                          `${expire ? $t('general.on') : $t('general.off')}`
                        "
                      />
                    </v-col>
                  </v-row>
                </template>
                <v-date-picker
                  v-model="fromDateVal"
                  locale="en-in"
                  :min="formatDate(minDate).expireDate"
                  no-title
                  @input="fromDateMenu = false"
                />
              </v-menu>
            </v-col>
            <v-col>
              <vue-editor
                id="step20"
                v-model="custom"
                :placeholder="$t('cpm.projects.customMessage')"
              />
            </v-col>
          </v-row>

          <v-row
            v-if="previewShow"
            class="fill-height fluid"
            column
          >
            <div v-html="cardEmailText" />
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col cols="8" />
          <v-col cols="6">
            <v-btn
              text
              @click="closeModal"
            >
              {{ $t('general.cancel') }}
            </v-btn>
            <v-btn
              v-if="!previewShow && type.value === 'mail'"
              id="step21"
              text
              @click="showPreview"
            >
              {{ $t('general.preview') }}
            </v-btn>
            <v-btn
              v-if="previewShow || type.value === 'message'"
              text
              @click="showConfirm = true"
            >
              {{ $t('general.send') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <m6-loading :loading="showLoading" />
    <m6-confirm-delete
      message=""
      :show="showConfirm"
      :title="$t('cpm.projects.proceedConfirm')"
      @cancel="closeModal"
      @confirm="sendShare"
    />
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { VueEditor } from 'vue2-editor'
export default {
  name: 'ShareModal',
  components: {
    'vue-editor': VueEditor
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },

    url: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      expire: true,
      previewShow: false,
      showLoading: false,
      showConfirm: false,
      expirationDefaultDate: 7,
      mail: '',
      type: {
        label: 'Mail',
        value: 'mail'
      },
      cardEmailText: '',
      custom: null,
      fromDateMenu: false,
      fromDateVal: null,
      defaultValues: {
        buttons: ''
      },
      minDate: Date.now()
    }
  },
  computed: {
    ...mapGetters(['appLabel']),
    expireDate() {
      return this.fromDateVal
        ? this.formatDate(this.fromDateVal)
        : this.formatDate(Date.now())
    },
    messageExpire() {
      return this.expire ? this.expireDate.formated : 'No End Date'
    },
    sender() {
      return (
        window.Drupal.settings.m6_platform.user.name +
        ' ' +
        window.Drupal.settings.m6_platform.user.lastName
      )
    }
  },
  watch: {
    expire() {
      this.cardEmailText = this.$t('cpm.projects.templateMail', {
        custom: this.custom,
        by: this.sender,
        expire: this.messageExpire,
        ...this.defaultValues
      })
    },
    custom(val) {
      this.cardEmailText = this.$t('cpm.projects.templateMail', {
        custom: val,
        by: this.sender,
        expire: this.messageExpire,
        ...this.defaultValues
      })
    }
  },
  mounted() {
    if (this.url) {
      this.cardEmailText = this.$t('cpm.projects.templateMail', {
        custom: this.custom,
        by: this.sender,
        expire: this.messageExpire,
        ...this.defaultValues
      })
    }
  },
  methods: {
    ...mapActions('itApplications/instalationInformation', {
      getSignedUrl: 'getSignedUrl',
      sendMail: 'sendMail'
    }),
    async sendShare() {
      try {
        this.showLoading = true
        const timestamp = new Date().getTime()
        const link = await this.getSignedUrl({
          bucket: window.Drupal.settings.m6_platform.f_base.config.storageBucket,
          expireDate: this.expireDate.expireDate,
          file: `Gantt_${timestamp}.png`,
          url: this.url
        }).catch(() => {
          throw this.$t('cpm.projects.fileNotFound')
        })
        const buttons = `<a href="${link}" ><img src="${link}" width="400" height="300"></a><br><a href="${link}" style="display: inline-block; color: #FFF; width: 140px; margin: 20px auto; padding: 10px 20px; background: rgb(33,150,243); text-decoration: none; text-align: center;">Open Gantt Image</a><br>`
        this.$set(this.defaultValues, 'buttons', buttons)
        await this.sendMail({
          type: 'via_mail',
          action: 'send_share',
          data: {
            to: this.mail,
            sender: this.sender,
            body: this.$t('cpm.projects.templateMail', {
              custom: this.custom,
              by: this.sender,
              expire: this.messageExpire,
              ...this.defaultValues
            })
          }
        })
        this.showLoading = false
        this.$snotify.success(
          this.$t('cpm.projects.successfullyFileSend'),
          this.$t('alerts.done')
        )
      } catch (e) {
        this.$snotify.error(e, this.$t('alerts.error'))
      } finally {
        this.closeModal()
      }
    },
    closeModal() {
      this.showConfirm = false
      this.previewShow = false
      this.custom = null
      this.defaultValues = {
        buttons: ''
      }
      this.$emit('close')
    },
    addDays(date, days) {
      const d = new Date(date)
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000))
      return d
    },
    formatDate(date) {
      date = this.addDays(date, this.expirationDefaultDate)
      const d = (
        new Date(date).toISOString().slice(0, 10) || '2099-01-01'
      ).split('-')
      let dateFormatted = [d[1], d[2], d[0]].join('/').concat(' 11:59:59 PM')
      let expireDate = d.join('-')
      if (!this.expire) {
        dateFormatted = this.$t('general.unlimited')
        expireDate = '2099-01-01'
      }
      return {
        formated: dateFormatted,
        expireDate: expireDate
      }
    },
    showPreview() {
      this.cardEmailText = this.$t('cpm.projects.templateMail', {
        custom: this.custom,
        by: this.sender,
        expire: this.messageExpire,
        ...this.defaultValues
      })
      this.previewShow = !this.previewShow
    }
  }
}
</script>

<style lang="scss" scoped>
.directory-item {
  width: 2.25rem;
  height: 2.25rem;
}
</style>

<template>
  <v-dialog
    v-model="dialog"
    width="600"
  >
    <template v-slot:activator="{ on }">
      <div
        id="support-tab-common"
        class="getsupport-button"
        v-on="on"
        @click="dialog = true"
      >
        Get Support
      </div>
    </template>

    <v-card>
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">Support Tickets</span>
      </v-card-title>
      <v-divider class="grey lighten-3" />
      <v-tabs
        v-model="tab"
        centered
        color="#006699"
        dark
        fixed-tabs
      >
        <v-tab>
          Create A Ticket
        </v-tab>
      </v-tabs>

      <v-card-text
        class="vertical-scroll"
        style="height: 350px;"
      >
        <div v-show="tab === 0">
          <v-form ref="form">
            <v-text-field
              v-model="ticket.name"
              label="Title"
              :rules="txtRules"
            />

            <v-textarea
              v-model="ticket.description"
              height="100"
              label="Please describe the issue"
              :rules="txtRules"
            />

            <input
              id="uploadCaptureInputFile"
              ref="image"
              class="d-none"
              multiple
              type="file"
              @change="onFilePicked"
            >
            <v-row>
              <v-col cols="10">
                <label>Attachments</label>
                <br>
                <v-btn
                  color="primary"
                  dark
                  fab
                  small
                  @click="pickFile"
                >
                  <v-icon>mdi-cloud-upload</v-icon>
                </v-btn>
                <br>
                <template v-if="screenshotTemp">
                  <img
                    class="w-50"
                    :src="screenshotTemp"
                    style="height: 50%;"
                  >
                </template>
                <br>
                <template v-if="files.length > 0">
                  <v-chip
                    v-for="(f, index) in files"
                    :key="`support-${index}`"
                    close
                    color="blue lighten-1"
                    dark
                    @input="deleteFile(f)"
                  >
                    <v-icon>mdi-content-copy</v-icon>
                    <span>{{ f.name }}</span>
                  </v-chip>
                </template>
              </v-col>
              <v-col cols="2">
                <template v-if="screenshotTemp === ''">
                  <label>Take a Screenshot</label>
                  <br>
                  <v-btn
                    color="deep-purple darken-1"
                    dark
                    fab
                    small
                    @click="takeScreenshot"
                  >
                    <v-icon>mdi-camera</v-icon>
                  </v-btn>
                </template>
                <template v-else>
                  <label>Delete Screenshot</label>
                  <br>
                  <v-btn
                    color="red"
                    dark
                    fab
                    small
                    @click="screenshotTemp = ''"
                  >
                    <v-icon>mdi-minus-circle</v-icon>
                  </v-btn>
                </template>
              </v-col>
            </v-row>
          </v-form>
        </div>
        <div v-show="tab === 1">
          <v-tab>
            Check on my tickets
          </v-tab>
          <v-data-table
            class="elevation-0"
            :headers="headers"
            :items="filteredTickets"
          >
            <template v-slot:items="props" />
          </v-data-table>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions v-if="tab === 0">
        <v-spacer />
        <v-btn
          color="error"
          text
          @click="close"
        >
          Close
        </v-btn>
        <v-btn
          color="success"
          text
          @click="createTicket"
        >
          Create Ticket
        </v-btn>
      </v-card-actions>
      <v-card-actions v-if="tab === 1" />
    </v-card>

    <m6-loading :loading="showLoading" />
  </v-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'
import html2canvas from 'html2canvas'

export default {
  name: 'M6GetSupport',
  data() {
    return {
      screenshotBlob: null,
      screenshotTemp: '',
      files: [],
      filesExist: false,
      isAttatchment: false,
      formData: new FormData(),
      showLoading: false,
      txtRules: [v => !!v || 'This field is required'],
      headers: [
        { text: 'Ticket Number', value: 'ticket number' },
        { text: 'Title', value: 'title' },
        { text: 'Description', value: 'desc' },
        { text: 'Status', value: 'status' },
        { text: 'See Ticket', value: 'see' }
      ],
      dialog: false,
      tickets: [],
      ticket: {
        name: '',
        description: '',
        url: ''
      },
      defaultTicket: {
        name: '',
        description: '',
        url: ''
      },
      tab: 0
    }
  },
  computed: {
    filteredTickets() {
      return this.tickets.filter(
        t => t.temp && t.uid === Drupal.settings.m6_platform_header.uid
      )
    }
  },
  methods: {
    hideModals() {
      this.lodash.each(
        document.querySelectorAll('.v-dialog__content'),
        element => element.setAttribute('data-html2canvas-ignore', true)
      )
      this.lodash.each(document.querySelectorAll('.v-overlay'), element =>
        element.setAttribute('data-html2canvas-ignore', true)
      )
    },
    takeScreenshot() {
      this.showLoading = true

      this.hideModals()
      html2canvas(document.body).then(canvas => {
        this.screenshotTemp = canvas.toDataURL()
        canvas.toBlob(blob => {
          this.screenshotBlob = blob
        })

        this.filesExist = true
        this.showLoading = false
      })
    },
    deleteFile(file) {
      this.files = this.files.filter(f => f.name !== file.name)
    },
    close(closeModal = true) {
      this.ticket = { ...this.defaultTicket }
      this.formData = new FormData()
      this.files = []
      this.screenshotTemp = ''
      this.screenshotBlob = null
      this.showLoading = false
      if (closeModal) this.dialog = false
    },
    createTicket() {
      const ticket = { ...this.ticket }
      if (!this.$refs.form.validate()) {
        this.$snotify.error(
          'Please fill out all of the required fields',
          'Error'
        )
        return
      } else {
        this.ticket.url = window.location.href
        const string = this.ticket
        this.showLoading = true
        this.axios
          .post('/ticket/create', string)
          .then(res => {
            this.dialog = false
            this.$snotify.success('The ticket was created', 'Success')
            this.ticket = { ...this.defaultTicket }
            return res
          })
          .then(async data => {
            this.sendSupportSlackMessage(ticket)

            if (this.screenshotTemp) {
              this.formData.append(
                'files[]',
                this.screenshotBlob,
                `screenshot-${data.data.result.id}.jpg`
              )
            }

            if (this.filesExist) {
              for (const index in this.files) {
                this.formData.append('files[]', this.files[index])
              }
              this.formData.append('action', 'upload_file')
              this.formData.append('ticket_id', data.data.result.id)

              this.axios
                .post('/ticket/edit/files', this.formData)
                .then(() => {
                  this.filesExist = false
                  this.formData = new FormData()
                  this.$snotify.success(
                    'The attachments were uploaded',
                    'Success'
                  )
                  this.close(false)
                })
                .catch(() => {
                  this.$snotify.error(
                    'There was an error while uploading the attachements',
                    'Error'
                  )
                  this.showLoading = false
                })
            } else {
              this.close(false)
            }
          })
          .catch(() => {
            this.$snotify.error(
              'There was an Error while saving the ticket',
              'Error'
            )
            this.showLoading = false
          })
      }
    },
    sendSupportSlackMessage(ticket) {
      const appName = this.$h.dg(this.$route, 'path', '').replace(/\//g, ' ').trim()
      const { name, lastName } = this.$h.dg(window, 'Drupal.settings.m6_platform.user', '')
      const companyLogo = this.$h.dg(window, 'Drupal.settings.m6_platform.company_logo')
      const companyName = this.$h.dg(window, 'Drupal.settings.m6_platform.current_user.company')
      const currentURL = window.location.href
      const cloudFunctionURL = this.$h.dg(window, 'Drupal.settings.m6_platform.f_base.functions.api_url', '')
      this.axios.post(
        `${cloudFunctionURL}/api/slack/m6-support/send-message`,
        {
          appName,
          name,
          lastName,
          companyLogo,
          companyName,
          currentURL,
          ticket
        }
      )
    },
    pickFile() {
      this.$refs.image.click()
    },
    onFilePicked(e) {
      const files = e.target.files
      if (files[0] !== undefined) {
        this.filesExist = true
        for (const index in files) {
          if (files[index].name && files[index].name !== 'item') {
            this.files.push(files[index])
          }
        }
        this.$snotify.success('File(s) added to queue', 'Success')
      }
    }
  },
  firestore() {
    return {
      tickets: db.collection('tickets')
    }
  }
}
</script>

<style lang="scss" scoped>
.pre-formatted {
  white-space: pre-wrap;
}
.getsupport-button {
  position: fixed;
  right: -29px;
  top: 85%;
  z-index: 90;
  transform: rotate(-90deg);
  background: green;
  padding: 10px;
  color: #fff;
  font-size: 12px;
  border-radius: 10px 10px 0 0;
  cursor: pointer;
}
</style>

<!--
  TODO:

  when a ticket is submitted show a popup with their ticket number, and m6's phone number

  send an email, with description and attachements when a ticket has been created
  --- have link to see ticket status, open to support ticket modal with that ticket selected

  create another modal, that allows the users to view the entire ticket, on top of the support tickets modal

  'check on my tickets' tab

  if status change
    email user

-->

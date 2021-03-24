<template>
  <v-container class="ma-0 pa-0">
    <v-card
      v-if="!editing"
      class="transparent"
      flat
    >
      <v-card-title class="d-flex pa-0">
        <h1
          class="font-weight-bold mb-2 text-h6 text-left w-full"
          :class="[!darkMode ? 'black--text' : 'white--text']"
        >
          Mail Templates
        </h1>
      </v-card-title>
      <v-divider class="grey my-2 w-full" />
      <div class="d-flex justify-end">
        <v-btn
          color="green"
          dark
          icon
          rounded
          @click="openModal(false)"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
      <v-data-table
        :dark="darkMode"
        :headers="headers"
        :items="templates"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            color="blue"
            icon
            @click="editTemplate(item)"
          >
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>

          <v-btn
            color="red"
            icon
            @click="deleteTemplate(item)"
          >
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <v-divider class="grey my-2 w-full" />
    </v-card>

    <v-card
      v-if="template.id"
    >
      <v-card-title>
        Editing {{ template.name }} template
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="template.name" />
        <v-text-field v-model="template.subject" />
        <v-autocomplete
          v-model="template.target"
          :items="targets"
          label="Target"
        />
        <vue-editor
          v-model="template.content"
          :value="'<div><br></div>'"
        />

        <p>Available tags</p>
        <ul>
          <li>User First Name - <kbd>$user.firstName</kbd> </li>
          <li>User Last Name - <kbd>$user.lastName</kbd> </li>
          <li>User Email - <kbd>$user.email</kbd> </li>
          <li>Current Company Name - <kbd>$company.name</kbd> </li>
          <li>Current Company Email - <kbd>$company.email</kbd> </li>
          <li>Current Domain - <kbd>$domain</kbd> </li>
          <li>Reset Password Link - <kbd>$resetPasswordLink</kbd></li>
          <li>Confirmation Account Link - <kbd>$confirmAccountLink</kbd> </li>
          <li>Forgot Password / Confirmation Code - <kbd>$code</kbd> </li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="red"
          outlined
          text
          @click="cancelEdit"
        >
          Cancel
        </v-btn>
        <v-btn
          color="green"
          outlined
          text
          @click="update"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>

    <default-m6-modal
      v-if="showNewForm"
      @close="close"
    >
      <template slot="title">
        Create New Template
      </template>
      <template slot="content">
        <v-text-field
          v-model="template.name"
          label="Template Name"
        />
        <v-text-field
          v-model="template.subject"
          label="Subject"
        />
        <v-autocomplete
          v-model="template.target"
          :items="targets"
          label="Target"
        />
      </template>
      <template slot="actions">
        <v-spacer />
        <v-btn
          color="red"
          outlined
          text
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="green"
          outlined
          text
          @click="save"
        >
          Save
        </v-btn>
      </template>
    </default-m6-modal>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { VueEditor } from 'vue2-editor'
export default {
  name: 'MailTemplate',
  components: {
    VueEditor
  },
  data() {
    return {
      editing: false,
      templates: [],
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Subject',
          value: 'subject'
        },
        {
          text: 'Target',
          value: 'target'
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          align: 'right'
        }
      ],
      template: {},
      targets: [
        'Sign Up',
        'Confirm Account',
        'Forgot Password',
        'Password Change',
        'Invitation to company'
      ],
      showNewForm: false
    }
  },
  computed: {
    ...mapState('PageControl', {
      darkMode: 'darkModeGlobal'
    })
  },
  async mounted() {
    await this.fetchTemplates()
  },
  methods: {
    async fetchTemplates() {
      this.templates = await this.$store.dispatch('MailSystem/fetchTemplates')
    },
    editTemplate(template) {
      this.template = { ...template }
      this.editing = true
    },
    openModal() {
      this.showNewForm = true
      this.template = {}
    },
    close() {
      this.showNewForm = false
      this.template = {}
    },
    async cancelEdit() {
      this.template = {}
      this.editing = false
      await this.fetchTemplates()
    },
    async save() {
      try {
        const newTemplate = await this.$store.dispatch('MailSystem/createTemplate', this.template)
        this.templates.push(newTemplate)
        this.$snotify.success('Template Created', 'Success')
        this.close()
      } catch (e) {
        this.$snotify.error(e, 'Error')
      }
    },
    async update() {
      try {
        await this.$store.dispatch('MailSystem/updateTemplate', this.template)
        this.$snotify.success('Template Updated', 'Success')
      } catch (e) {
        this.$snotify.error(e, 'Error')
      }
    },
    async deleteTemplate(item) {
      try {
        await this.$store.dispatch('MailSystem/deleteTemplate', item)
        this.$snotify.success('Template Deleted', 'Success')
        const index = this.templates.map(i => i.id).indexOf(item.id)
        this.templates.splice(index, 1)
      } catch (e) {
        this.$snotify.error(e, 'Error')
      }
    }
  }
}
</script>

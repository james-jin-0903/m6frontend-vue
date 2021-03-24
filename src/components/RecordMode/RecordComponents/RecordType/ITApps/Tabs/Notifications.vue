<template>
  <v-container
    v-if="!isLoading"
    class="mt-5 px-0 py-0 rounded-lg"
  >
    <template v-if="items.length === 0">
      <v-container
        class="align-center d-flex flex-column justify-center px-0 py-10 rounded-lg"
        :class="baseColor"
      >
        <p class="text-h5 white--text">
          There are no {{ itemsName }}
        </p>
        <v-divider class="mt-0 w-full white" />
        <a
          class="align-center border border-t-1 d-flex justify-center pointer py-3 text-body-2 w-full white--text"
          @click="dialog = true, dialogMode = true"
        >
          ADD NEW <v-icon class="white--text">mdi-plus</v-icon>
        </a>
        <v-divider class="mb-3 w-full white" />
      </v-container>
    </template>
    <template v-else>
      <v-card>
        <div :class="baseColor + ' card rounded-0 rounded-t-sm px-3 py-4 text-body-1 white--text capitalize'">
          {{ itemsName }}
        </div>
        <v-btn
          :class="baseColor + ' btn-circle-add-item'"
          dark
          fab
          small
          @click="dialog = true, dialogMode = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <div class="notifications-container pa-3">
          <v-data-table
            v-model="selected"
            class="elevation-0"
            :headers="headers"
            item-key="id"
            :items="items"
            :single-select="singleSelect"
          >
            <template v-slot:[`item.notification_required`]="{ item }">
              {{ item.notification_required == 1 || item.notification_required == 'Yes' ? 'Yes' : 'No' }}
            </template>
            <template v-slot:[`item.noti_cont`]="{ item }">
              <v-chip
                v-for="(who, index) in item.noti_cont"
                :key="'who-'+index"
                color="blue lighten-3 mx-1"
                dark
              >
                <span v-if="who.contact_id">
                  {{ companyUsers[companyUsers.findIndex(i => i.id === who.contact_id)]['name'] }}
                </span>
                <span v-if="who.name">
                  {{ companyUsers[companyUsers.findIndex(i => i.id === who.id)]['name'] }}
                </span>
              </v-chip>
            </template>
            <template v-slot:[`item.description`]="{ item }">
              <div class="d-flex justify-space-between">
                <p>{{ item.description }}</p>
                <v-icon
                  class="mr-2"
                  color="blue lighten-1"
                  small
                  @click="showUpdateDialog(item)"
                >
                  mdi-pencil
                </v-icon>
              </div>
            </template>
          </v-data-table>
        </div>
      </v-card>
    </template>

    <v-dialog
      v-model="dialog"
      max-width="600px"
      persistent
    >
      <v-form
        ref="form"
        v-model="valid"
        class="white"
      >
        <v-card-title :class="baseColor + ' white--text d-flex justify-space-between'">
          <span class="capitalize headline white--text">{{ titleDialog }}</span>
          <v-dialog
            v-if="!dialogMode"
            v-model="deleteDialog"
            width="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                color="white"
                icon
                v-on="on"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <delete-dialog
              :element="itemInfo.name+' notification'"
              @closeDeleteModal="beforeDelete"
            />
          </v-dialog>
        </v-card-title>
        <v-card-text class="form-labels px-16 py-10">
          <v-text-field
            v-model="itemInfo.name"
            :color="baseColor"
            label="Name"
            :rules="nameRules"
          />
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            min-width="290px"
            :nudge-right="40"
            offset-y
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="itemInfo.notification_date.date"
                v-bind="attrs"
                label="Date"
                readonly
                :rules="textRules"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="itemInfo.notification_date.date"
              @input="menu = false"
            />
          </v-menu>
          <v-select
            v-model="itemInfo.notification_required"
            :color="baseColor"
            item-text="label"
            item-value="value"
            :items="validation"
            label="Required"
            :rules="selectBool"
          />

          <v-autocomplete
            v-model="itemInfo.noti_cont"
            chips
            :color="baseColor"
            deletable-chips
            full-width
            hide-details
            hide-no-data
            hide-selected
            item-text="name"
            :item-value="Object"
            :items="companyUsers"
            label="Who to notify"
            multiple
            single-line
          />

          <v-textarea
            v-model="itemInfo.description"
            :color="baseColor"
          >
            <template v-slot:label>
              <div>
                Description
              </div>
            </template>
          </v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :color="baseColor"
            text
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            :color="baseColor"
            :disabled="!valid"
            text
            @click="clickAction"
          >
            {{ titleAction }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-dialog>
  </v-container>
  <v-container
    v-else
    class="rounded-lg"
  >
    <v-progress-circular
      color="primary"
      indeterminate
      style="margin-left: 45%;"
    />
  </v-container>
</template>

<script>
import { items } from '@/mixins/items'
import { validations } from '@/mixins/form-validations'
import { mapActions, mapGetters } from 'vuex'
import DeleteDialog from '@/components/Dialogs/DeleteDialog'

export default {
  name: 'Notifications',
  components: {
    DeleteDialog
  },
  mixins: [items, validations],
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    deleteDialog: false,
    menu: false,
    isLoading: true,
    baseColor: 'deep-purple darken-3',
    itemsName: 'notifications',
    itemInfo: {
      name: undefined,
      notification_date: {
        id: undefined,
        date: undefined
      },
      notification_required: undefined,
      noti_cont: [],
      description: undefined
    },
    preview_noti_cont: [],
    singleSelect: false,
    selected: [],
    validation: [{
      label: 'Yes',
      value: 1
    }, {
      label: 'No',
      value: 0
    }],
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Date', value: 'notification_date.date' },
      { text: 'Required', value: 'notification_required' },
      { text: 'Who to notify', value: 'noti_cont' },
      { text: 'Description', value: 'description' }
    ]
  }),
  methods: {
    ...mapActions('ITAppsModule', [
      'post_notification',
      'get_notifications',
      'delete_notification',
      'put_notification'
    ]),
    getContact(contactId) {
      return this.companyUsers[this.companyUsers.findIndex(i => i.id === contactId.contact_id)]['name']
    },
    post() {
      this.post_notification({
        noti_date: this.itemInfo.notification_date,
        notification: {
          app_id: this.info.id,
          notification_required: this.itemInfo.notification_required == 1 ? true : false,
          name: this.itemInfo.name,
          description: this.itemInfo.description
        },
        noti_cont: this.itemInfo.noti_cont
      }).then(res => (
        Object.assign(...[this.items[this.items.length - 1], res])
      ))
    },
    put() {
      this.put_notification({
        noti_date: this.itemInfo.notification_date,
        notification: {
          notification_required: this.itemInfo.notification_required == 1 ? true : false,
          description: this.itemInfo.description,
          name: this.itemInfo.name,
          id: this.itemInfo.id,
          app_id: this.info.id
        },
        noti_cont: this.itemInfo.noti_cont,
        preview_noti_cont: this.preview_noti_cont
      })
    },
    beforeDelete(decision) {
      decision ? this.deleteItem() : this.deleteDialog = false
    },
    delete() {
      this.delete_notification(this.itemInfo.id)
    }
  },
  computed: {
    ...mapGetters('Companies', { companyUsers: 'getCurrentCompanyUsers' })
  },
  watch: {
    dialog: function (val) {
      if (val) {
        this.dialogMode ? this.itemInfo.noti_cont = [] : null
        this.itemInfo.noti_cont.forEach((item, ind) => {
          if (item.contact_id !== undefined) {
            this.itemInfo.noti_cont[ind] = this.companyUsers[this.companyUsers.findIndex(i => i.id === item.contact_id)]
          }
        })
        this.preview_noti_cont = this.itemInfo.noti_cont
      }
    }
  },
  mounted() {
    this.companyUsers.forEach(company => {
      company.name = `${company.user.firstName} ${company.user.lastName}`
    })
    this.get_notifications(this.info.id).then(
      res => (this.items = res),
      this.isLoading = false
    )
  }
}
</script>

<style lang="scss">
.notifications-container {
  min-height: 180px;
  overflow-x: auto;
  overflow-y: auto;
}
.btn-circle-add-item {
  position: absolute;
  top: 35px;
  right: 15px;
}
.edit-license {
  position: absolute;
  top: 65px;
  right: 20px;
}
</style>

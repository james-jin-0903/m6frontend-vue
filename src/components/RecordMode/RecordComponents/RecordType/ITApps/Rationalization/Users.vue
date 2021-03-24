<template>
  <v-container
    class="rounded-lg"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
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
        <v-card>
          <v-card-title class="blue d-flex darken-3 justify-space-between white--text">
            <span class="headline white--text">{{ titleDialog }}</span>
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
                :element="'rationalization user'"
                @closeDeleteModal="beforeDelete"
              />
            </v-dialog>
          </v-card-title>
          <v-card-text class="form-labels px-16">
            <v-container class="rounded-lg">
              <v-row>
                <v-select
                  v-model="itemInfo.user_type"
                  item-text="value"
                  item-value="id"
                  :items="types"
                  label="User Type"
                  :rules="selectRules"
                />
              </v-row>
              <v-row>
                <v-text-field
                  v-model="itemInfo.users"
                  label="Users"
                  :rules="quantityRules"
                  type="number"
                />
              </v-row>
              <v-row>
                <v-textarea
                  v-model="itemInfo.notes"
                  label="Notes"
                />
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="closeDialog"
            >
              Close
            </v-btn>
            <v-btn
              class="white--text"
              color="primary"
              :disabled="!valid"
              @click="clickAction"
            >
              {{ titleAction }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-subheader class="primary relative rounded-t white--text">
      Rationalization Users
      <v-btn
        absolute
        bottom
        :color="isHover ? 'orange' : 'blue'"
        dark
        fab
        right
        small
        @click="dialog = true, dialogMode = true"
      >
        <v-icon>mdi-account-plus-outline</v-icon>
      </v-btn>
    </v-subheader>
    <v-card class="pt-5 rounded-lg">
      <v-data-table
        class="elevation-0"
        :headers="table.headers"
        item-key="name"
        :items="items"
      >
        <template v-slot:[`item.user_type`]="{ item }">
          <p>
            {{
              types.filter(
                (e) => { return e['id'] === item['user_type'] }
              )[0]['value']
            }}
          </p>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            class="mr-2"
            color="blue lighten-1"
            small
            @click="showUpdateDialog(item)"
          >
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
const ratioUserConvert = require('@/store/models/rationalization/itapp_rationalization_users')
import DeleteDialog from '@/components/Dialogs/DeleteDialog'

import { mapActions } from 'vuex'
import { validations } from '@/mixins/form-validations'
import { items } from '@/mixins/items'

export default {
  name: 'Users',
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
    dialogMode: false,
    isHover: false,
    itemsName: 'users',
    types: [],
    itemInfo: {
      user_type: null,
      users: null,
      notes: ''
    },
    table: {
      headers: [
        { text: 'User Type', value: 'user_type' },
        { text: 'Users', value: 'users' },
        { text: 'Notes', value: 'notes' },
        { text: 'Actions', value: 'actions' }
      ]
    }
  }),
  methods: {
    ...mapActions('ITAppsModule', {
      delete_usr: 'delete_ratio_usr',
      post_usr: 'post_ratio_usr',
      put_usr: 'put_ratio_usr',
      get_usr: 'get_ratio_usr',
      select: 'get_selects'
    }),
    post() {
      this.post_usr(this.itemInfo).then(res => {
        this.items[this.items.length - 1]['id'] = res['data']['rationalization_user_id']
      })
    },
    put() {
      this.put_usr(this.itemInfo)
    },
    delete() {
      this.deleteDialog = false
      this.delete_usr(this.itemInfo.id)
    },
    beforeDelete(decision) {
      decision ? this.deleteItem() : this.deleteDialog = false
    }
  },
  mounted() {
    this.itemInfo['app_id'] = this.info['id']
    this.select('/RationalizationUserType').then(res => {
      this.types = res.data
    })
    this.get_usr(this.itemInfo['app_id']).then(usrs => {
      this.items = ratioUserConvert.toRationalizationUser(usrs.data)
    })
  }
}
</script>

<style>

</style>

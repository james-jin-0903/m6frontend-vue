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
            <span class="headline white--text">Create Governance</span>
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
                :element="'rationalization governance'"
                @closeDeleteModal="beforeDelete"
              />
            </v-dialog>
          </v-card-title>
          <v-card-text class="form-labels px-16">
            <v-container class="rounded-lg">
              <v-row>
                <v-select
                  v-model="itemInfo.responsible_division"
                  item-text="value"
                  item-value="id"
                  :items="options.resp_division"
                  label="Responsible Division"
                  :rules="selectRules"
                />
              </v-row>
              <v-row>
                <v-select
                  v-model="itemInfo.responsible_committee"
                  item-text="value"
                  item-value="id"
                  :items="options.resp_comittee"
                  label="Responsible Comitee"
                  :rules="selectRules"
                />
              </v-row>
              <v-row>
                <v-select
                  v-model="itemInfo.responsible_manager"
                  item-text="name"
                  item-value="id"
                  :items="users"
                  label="Responsible Manager"
                  :rules="selectRules"
                />
              </v-row>
              <v-row>
                <v-select
                  v-model="itemInfo.responsible_vp_dir"
                  item-text="name"
                  item-value="id"
                  :items="users"
                  label="Responsible VP/Dir"
                  :rules="selectRules"
                />
              </v-row>
              <v-row>
                <v-select
                  v-model="itemInfo.first_contact_group"
                  item-text="value"
                  item-value="id"
                  :items="options.contact_group"
                  label="First Contact Group"
                  :rules="selectRules"
                />
              </v-row>
              <v-row>
                <v-text-field
                  v-model="itemInfo.primary_customer_group"
                  label="Primary Customer Group"
                  :rules="textRules"
                />
              </v-row>
              <v-row>
                <v-text-field
                  v-model="itemInfo.estimated_days_to_replace"
                  label="Estimated Days to Replace"
                  :rules="textRules"
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
              color="primary"
              :disabled="!valid"
              text
              @click="clickAction"
            >
              {{ titleAction }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-subheader class="primary relative rounded-t white--text">
      Rationalization Governance
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
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-subheader>

    <v-card class="pt-5 rounded-lg">
      <v-data-table
        class="elevation-0"
        :headers="table.headers"
        item-key="name"
        :items="items"
      >
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
        <template v-slot:[`item.responsible_division`]="{ item }">
          <p>
            {{ options.resp_division.filter(
              (e) => { return e['id'] === item['responsible_division'] }
            )[0]['value'] }}
          </p>
        </template>
        <template v-slot:[`item.responsible_committee`]="{ item }">
          <p>
            {{ options.resp_comittee.filter(
              (e) => { return e['id'] === item['responsible_committee'] }
            )[0]['value'] }}
          </p>
        </template>
        <template v-slot:[`item.first_contact_group`]="{ item }">
          <p>
            {{ options.contact_group.filter(
              (e) => { return e['id'] === item['first_contact_group'] }
            )[0]['value'] }}
          </p>
        </template>
        <template v-slot:[`item.responsible_manager`]="{ item }">
          <p>
            {{ users.filter(
              (e) => { return e['id'] === item['responsible_manager'] }
            )[0]['name'] }}
          </p>
        </template>
        <template v-slot:[`item.responsible_vp_dir`]="{ item }">
          <p>
            {{ users.filter(
              (e) => { return e['id'] === item['responsible_vp_dir'] }
            )[0]['name'] }}
          </p>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
const goverConvert = require('@/store/models/rationalization/itapp_rationalization_governance')
import DeleteDialog from '@/components/Dialogs/DeleteDialog'

import { items } from '@/mixins/items'
import { validations } from '@/mixins/form-validations'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Governance',
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
    users: [],
    itemInfo: {
      responsible_vp_dir: null,
      first_contact_group: null,
      responsible_manager: null,
      responsible_division: null,
      responsible_committee: null,
      primary_customer_group: null,
      estimated_days_to_replace: null
    },
    table: {
      headers: [
        {
          text: 'Responsible Division',
          value: 'responsible_division'
        },
        {
          text: 'Responsible Comittee',
          value: 'responsible_committee'
        },
        {
          text: 'Responsible Manager',
          value: 'responsible_manager'
        },
        {
          text: 'Responsible VP/Dir',
          value: 'responsible_vp_dir'
        },
        {
          text: 'First Contact Group',
          value: 'first_contact_group'
        },
        {
          text: 'Primary Customer Group',
          value: 'primary_customer_group'
        },
        {
          text: 'Estimated days to Replace',
          value: 'estimated_days_to_replace'
        },
        {
          text: 'Actions',
          value: 'actions'
        }
      ]
    },
    options: {
      resp_division: [],
      resp_comittee: [],
      contact_group: []
    }
  }),
  computed: {
    ...mapGetters('Companies', { companyUsers: 'getCurrentCompanyUsers' })
  },
  methods: {
    ...mapActions('ITAppsModule', {
      selects: 'get_all_selects',
      put_gov: 'put_ratio_gov',
      get_gov: 'get_ratio_gov',
      post_gov: 'post_ratio_gov',
      delete_gov: 'delete_ratio_gov'
    }),
    post() {
      this.post_gov(this.itemInfo).then(res => {
        this.items[this.items.length - 1]['id'] = res['data']['rationalization_governance_id']
      })
    },
    put() {
      this.put_gov(this.itemInfo)
    },
    delete() {
      this.deleteDialog = false
      this.delete_gov(this.itemInfo.id)
    },
    beforeDelete(decision) {
      decision ? this.deleteItem() : this.deleteDialog = false
    }
  },
  mounted() {
    this.itemInfo['app_id'] = this.info.id

    this.users = this.companyUsers

    this.selects({
      params: [
        'RationalizationGovernanceRespDivision',
        'RationalizationGovernanceRespCommittee',
        'RationalizationGovernanceFirstContactGroup'
      ]
    }).then(res => {
      Object.keys(res.data).forEach(key => {
        switch (key) {
          case 'RationalizationGovernanceRespDivision':
            this.options.resp_division = res.data[key]
            break
          case 'RationalizationGovernanceRespCommittee':
            this.options.resp_comittee = res.data[key]
            break
          case 'RationalizationGovernanceFirstContactGroup':
            this.options.contact_group = res.data[key]
            break
        }
      })
    })

    this.get_gov(this.info.id).then(res => {
      this.items = goverConvert.toRationalizationGovernance(res.data)
    })
  }
}
</script>

<style>

</style>

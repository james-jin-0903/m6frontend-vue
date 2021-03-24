<template>
  <v-container class="rounded-lg">
    <v-subheader class="primary rounded-t white--text">
      Rationalization Attributes
    </v-subheader>
    <v-card class="px-3 rounded-lg">
      <v-form v-model="valid">
        <v-row>
          <v-col cols="6">
            <v-select
              v-model="itemInfo.is_needs"
              item-text="label"
              item-value="value"
              :items="object.valid"
              label="Meeting customer needs"
              :rules="selectBool"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-if="itemInfo.is_needs === true"
              v-model="itemInfo.rationalization_kind"
              item-text="value"
              item-value="id"
              :items="object.atributesKind"
              label="Rationalization"
              :rules="selectRules"
            />
            <v-text-field
              v-else
              v-model="itemInfo.if_no_need"
              label="If no please describe"
              :rules="textRules"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-input
              :hint="'$ ' + this.itemInfo.total_annual_cost"
              persistent-hint
            >
              Total Annual Cost
            </v-input>
          </v-col>
          <v-col cols="6">
            <v-input
              :hint="this.itemInfo.estimated_users.toString()"
              persistent-hint
            >
              Estimated Users
            </v-input>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-input
              :hint="'$ ' + this.itemInfo.total_annual_cost/this.itemInfo.ratio_of_cost_to_user"
              persistent-hint
            >
              Ratio of Cost to User
            </v-input>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="itemInfo.capabilities"
              label="Capabilities"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              v-model="itemInfo.application_value"
              chips
              item-text="value"
              item-value="id"
              :items="object.appValue"
              label="Application Value"
              multiple
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
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
                  v-model="itemInfo.retirement_date"
                  v-bind="attrs"
                  label="Retire"
                  prepend-icon="mdi-calendar"
                  readonly
                  :rules="textRules"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="itemInfo.retirement_date"
                @input="menu = false"
              />
            </v-menu>
            <v-spacer />
            <v-btn
              color="primary"
              :disabled="!valid"
              @click="updateItemDescription"
            >
              Save Changes
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
const attributesConvert = require('@/store/models/rationalization/itapp_rationalization_attributes')

import { items } from '@/mixins/items'
import { mapActions } from 'vuex'
import { validations } from '@/mixins/form-validations'

export default {
  mixins: [items, validations],
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    menu: false,
    object: {
      atributesKind: [],
      appValue: [],
      valid: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ]
    },
    application_value: [],
    itemInfo: {
      estimated_users: 1,
      total_annual_cost: 0,
      ratio_of_cost_to_user: 0,
      application_value: [],
      first_state: [],
      rationalization_kind: null,
      retirement_date: null,
      capabilities: null,
      if_no_need: null,
      is_needs: false
    }
  }),
  methods: {
    ...mapActions('ITAppsModule', {
      selects: 'get_all_selects',
      get_att: 'get_ratio_att',
      put_att: 'put_ratio_att'
    }),
    updateItemDescription() {
      this.itemInfo['is_needs'] === true ?
        this.itemInfo['if_no_need'] = null : this.itemInfo['rationalization_kind'] = null

      this.put_att(this.itemInfo)
    }
  },
  mounted() {
    this.itemInfo['app_id'] = this.info.id

    this.selects({
      params: [
        'RationalizationAttributesKind',
        'RationalizationAttributesAppValue'
      ]
    }).then(select => {
      Object.keys(select.data).forEach(key => {
        if (key === 'RationalizationAttributesKind') {
          this.object.atributesKind = select['data'][key]
        } else if (key === 'RationalizationAttributesAppValue') {
          this.object.appValue = select['data'][key]
        }
      })
    })

    this.get_att(this.info.id).then(res => {
      if (Object.keys(res.data).length !== 0) {
        this.itemInfo = attributesConvert.toRationalizationAttributes(res.data)
        this.itemInfo['is_needs'] = this.itemInfo['is_needs'] === 1 ? true : false
        this.itemInfo['first_state'] = res['data']['application_value']
      }
    })
  }
}
</script>

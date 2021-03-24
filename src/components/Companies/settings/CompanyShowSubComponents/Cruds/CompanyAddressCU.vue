<template>
  <div class="text-center">
    <v-dialog
      v-model="show"
      persistent
      :width=" $vuetify.breakpoint.smAndDown ? '80vw' : '60vw'"
    >
      <v-card>
        <v-card-title class="blue darken-1 headline white--text">
          {{ isEdit ? 'Update a' : 'Create a' }} Company Address
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-container class="rounded-lg">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="address.name"
                    label="Name"
                    :rules="genericRules"
                  />
                </v-col>
                <v-col cols="6">
                  <v-checkbox
                    v-model="address.mainLocation"
                    label="Main Location"
                  />
                </v-col>
                <v-col cols="12">
                  <g-map
                    placeholder="Company Address"
                    :value="address.address"
                    @placeUpdate="placeUpdate"
                  />
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="address.type"
                    item-text="label"
                    item-value="value"
                    :items="locationTypes"
                    label="Location Type"
                    :rules="genericRules"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            text
            @click="$emit('close')"
          >
            close
          </v-btn>
          <v-btn
            v-if="isEdit"
            class="white--text"
            color="green"
            @click="$emit('updateAddress', address)"
          >
            update
          </v-btn>
          <v-btn
            v-else
            class="white--text"
            color="green"
            @click="$emit('appendAddress', address)"
          >
            create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CompanyAddressCU',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    addressToUpdate: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    address: {},
    genericRules: [
      v => !!v || 'This field is required'
    ]

  }),
  computed: {
    ...mapState('Companies', {
      locationTypes: 'locationTypes'
    }),
    isEdit() {
      return Boolean(this.address.id)
    }
  },
  watch: {
    addressToUpdate(val) {
      this.address = { ...val }
    }
  },
  methods: {
    placeUpdate(val) {
      this.address.address = val.formatted_address

      this.address.lat = val.geometry.location.lat()
      this.address.lng = val.geometry.location.lng()

      const attrRel = [
        {
          attr: 'postal_code',
          addressKey: 'postalCode',
          path: 'long_name'
        },
        {
          attr: 'administrative_area_level_2',
          addressKey: 'county',
          path: 'long_name'
        },
        {
          attr: 'administrative_area_level_1',
          addressKey: 'stateCode',
          path: 'short_name'
        },
        {
          attr: 'administrative_area_level_1',
          addressKey: 'stateFull',
          path: 'long_name'
        },
        { attr: 'locality', addressKey: 'city', path: 'long_name' },
        {
          attr: 'sublocality_level_1',
          addressKey: 'city',
          path: 'long_name'
        },
        { attr: 'country', addressKey: 'country', path: 'long_name' }
      ]

      attrRel.map(at => {
        const res = val.address_components.find(a => a.types.includes(at.attr))
        this.address[at.addressKey] = this.$h.dg(res, at.path, '') || this.address[at.addressKey]
      })
    }
  }
}
</script>

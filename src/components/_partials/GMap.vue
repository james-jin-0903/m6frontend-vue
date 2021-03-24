<template>
  <div :class="`theme--light v-input v-text-field ${ outlined ?  outlinedAndFilledClasses : ''}`">
    <div class="v-input__control">
      <div class="v-input__slot">
        <fieldset aria-hidden="true" v-if="outlined">
          <legend style="width: 0px;">
            <span>
              ​</span>
          </legend>
        </fieldset>
        <div class="v-text-field__slot">
          <google-autocomplete
            class="input"
            :placeholder="placeholder || label"
            :select-first-on-enter="selectFirstOnEnter"
            :value="addressVal"
            @place_changed="sendingData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GMap',
  props: {
    outlined: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Object, String],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    selectFirstOnEnter: {
      type: Boolean,
      default: true
    }
  },
  
  computed: {
    addressVal: {
      get(){
        if( typeof this.value == "string" ) return this.value
        return this.value.value
      }
    }
  },

  data: () => ({
    outlinedAndFilledClasses: 'v-text-field--enclosed v-text-field--filled v-text-field--is-booted v-text-field--outlined'
  }),

  methods: {
    sendingData(place) {
      this.$emit('placeUpdate', place)
      const address = {}
      address.value = place.formatted_address

      address.lat = place.geometry.location.lat().toString()
      address.lng = place.geometry.location.lng().toString()
      this.$emit('input', address) 
    },
  }
}
</script>

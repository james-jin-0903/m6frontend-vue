<template>
  <knob-control
    :max="maxValue"
    :primary-color="auxPrimaryColor"
    :size="size"
    :stroke-width="strokeWidth"
    :text-color="auxTextColor"
    :value="auxValue"
    :value-display-function="solveDisplay"
    :value-to-display="valueToDisplay"
  />
</template>

<script>
import Helpers from '../../../Helpers'

import KnobControl from './KnobSourceCustom'

export default {
  name: 'KnobCustom',
  components: {
    'knob-control': KnobControl
  },
  props: {
    knobTitle: {
      type: String,
      default: ''
    },
    max: {
      type: Number,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    primaryColor: {
      type: String,
      default: '#409eff'
    },
    textColor: {
      type: String,
      default: '#409eff'
    },
    size: {
      type: Number,
      default: 15
    },
    strokeWidth: {
      type: Number,
      default: 5
    },
    valueToDisplay: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      maxValue: 0,
      auxValue: 0,
      auxPrimaryColor: '',
      auxTextColor: '',
      red: '#c74213'
    }
  },
  watch: {
    max: function (val) {
      this.maxValue = val
      this.checkMax()
    },
    value: function (val) {
      this.auxValue = val
      this.checkMax()
    }
  },
  methods: {
    solveDisplay(value) {
      if (this.knobTitle) {
        return this.knobTitle + '<br>' + this.formatCurrency(value)
      } else {
        return this.formatCurrency(value)
      }
    },
    formatCurrency(value = '0') {
      return Helpers.formatCurrency(Math.ceil(value)).split('.')[0]
    },
    checkMax() {
      if (this.maxValue <= this.auxValue) {
        this.maxValue = this.auxValue
        this.auxPrimaryColor = this.red
        this.auxTextColor = this.red
      } else {
        this.auxPrimaryColor = this.primaryColor
        this.auxTextColor = this.textColor
      }
    }
  }
}
</script>

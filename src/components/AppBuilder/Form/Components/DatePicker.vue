<template>
  <v-menu
    ref="menu1"
    v-model="menu1"
    :close-on-content-click="false"
    full-width
    lazy
    max-width="290px"
    min-width="290px"
    transition="scale-transition"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="dateFormatted"
        clearable
        :filled="filled"
        hint="MM/DD/YYYY format"
        :label="label"
        :outlined="outlined"
        persistent-hint
        :readonly="readonly"
        :rules="rules"
        :value="value"
        v-on="on"
        @blur="date = parseDate(dateFormatted)"
      />
    </template>
    <v-date-picker
      v-model="date"
      no-title
      @input="menu1 = false"
    />
  </v-menu>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    label: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    outlined: {
      type: Boolean,
      default: false
    },
    filled: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    date: '',
    dateFormatted: '',
    menu1: false
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date)
    }
  },

  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date)
    }
  },

  mounted() {
    this.dateFormatted = this.formatDate(this.value)
  },

  methods: {
    formatDate(date = '') {
      if (!date) return null

      const [year, month, day] = this.$h.dg(date.split(' '), '0', []).split('-')
      const res = `${month}/${day}/${year}`
      this.$emit('input', date)
      return res
    },
    parseDate(date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }
}
</script>

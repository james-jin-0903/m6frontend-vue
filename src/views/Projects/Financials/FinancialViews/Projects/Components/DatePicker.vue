<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="computedDateFormatted"
        label="Date"
        hint="MM/DD/YYYY format"
        persistent-hint
        readonly
        v-bind="attrs"
        v-on="on"
        dense
      >
      <template #prepend-inner>
        <v-icon class="pa-0 ma-0">
          mdi-calendar
        </v-icon>
      </template>
      </v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      no-title
      @input="menu = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: 'DatePicker',

  props: {
    dateToEdit: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      date: '',
      menu: false
    }
  },

  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date)
    }
  },

  watch: {
    computedDateFormatted(date) {
      this.onChange(date)
    }
  },

  created() {
    if (this.dateToEdit) {
      this.date = this.$moment(this.dateToEdit, 'MM/DD/YYYY').format('YYYY-MM-DD')
    }
  },

  methods: {
    onChange (usaDateFormat) {
      this.$emit('on-change', {
        usaDateFormat,
        pickerDateFormat: this.date,
        timestamp: this.$moment(usaDateFormat, 'MM/DD/YYYY').format('X') * 1000
      })
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    }
  }
}
</script>

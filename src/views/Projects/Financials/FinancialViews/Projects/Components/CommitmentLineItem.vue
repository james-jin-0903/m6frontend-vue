<template>
<v-card flat class="pa-3">
  <v-row 
    class="align-end mb-2"
  >
    <v-col cols="12 py-0 caption font-weight-bold">
      {{ title }}
    </v-col>
    <v-col class="py-0">
      <date-picker
        :dateToEdit="lineItem.startDateText"
        :menu="lineItem.menu"
        @on-change="(dates) => onPickerChange(lineItem, dates)"
      ></date-picker>
    </v-col>
    <v-col class="py-0">
      <v-textarea
        label="Description"
        v-model="lineItem.description"
        rows="1"
        auto-grow
        clearable
        dense
        counter
        maxlength="65"
      ></v-textarea>
    </v-col>
    <v-col class="py-0">
      <vuetify-money
        v-model="lineItem.amount"
        label="Amount"
        :options="options"
        dense
      />
    </v-col>
    <v-col cols="12" class="text-right py-1">
      <v-btn right small class="error mr-2" @click="deleteLineItem" v-if="isEditing">
        Delete
      </v-btn>
      <v-btn right small class="mr-2" @click="close">
        Cancel
      </v-btn>
      <v-btn right color="primary" small @click="save">
        {{ actionButtonName }}
      </v-btn>
    </v-col>
  </v-row>
  </v-card>
</template>

<script>
import DatePicker from './DatePicker'

export default {
  name: 'LineItem',

  components: {
    DatePicker
  },

  props: {
    title: {
      tpye: String,
      default: 'Line Item'
    },
    lineItemToEdit: {
      type: Object,
      default: null
    }
  },
  
  computed: {
    actionButtonName() {
      return this.$h.dg(this.lineItemToEdit, 'id') ? 'Update' : 'Create'
    },
    isEditing () {
      return !!this.$h.dg(this.lineItemToEdit, 'id')
    }
  },

  data() {
    return {
      lineItem: {
        amount: 0,
        description: '',
        date: '',
        menu: false
      },
      options: {
        locale: 'en-US',
        decimal: '.',
        thousands: ',',
        prefix: '$',
        suffix: '',
        length: 12,
        precision: 2
      },
    }
  },

  watch: {
    lineItemToEdit: {
      handler (lineItem) {
        this.lineItem = { ...lineItem }
      },
      immediate: true
    }
  },

  methods: {
    onPickerChange(lineItem, { usaDateFormat: startDateText = '' } = {}) {
      const startDate = this.$moment(startDateText, 'MM/DD/YYYY').format('X') * 1000
      lineItem.startDate = startDate
      lineItem.startDateText = startDateText
    },
    save() {
      this.$emit('change', {
        lineItem: this.lineItem,
        action: 'save'
      })
    },
    close() {
      this.$emit('close')
    },
    deleteLineItem() {
      this.$emit('change', {
        lineItem: this.lineItem,
        action: 'delete'
      })
    }
  }
}
</script>

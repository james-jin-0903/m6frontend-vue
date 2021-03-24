<template>
  <v-dialog
    :value="true"
    @input="close"
    width="500px"
  >
    <v-card>
      <v-card-title class="primary title white--text">
        {{ action.title }}
      </v-card-title>

      <v-card-text>
        <v-row class="justify-center">
          <v-col cols="10">
            <v-text-field
              label="Project Number"
              v-model="item.projectTitle"
              disabled
            ></v-text-field>

            <v-text-field
              label="PO Number"
              v-model="item.po_number"
              disabled
            ></v-text-field>

            <v-text-field
              label="Amount"
              v-model="item.amount"
              disabled
            ></v-text-field>

            <v-textarea
              label="Description"
              v-model="item.description"
              auto-grow
              rows="2"
            ></v-textarea>
            
            <v-text-field
              label="Budget Category"
              v-model="item.wbsElement"
              disabled
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">Cancel</v-btn>
        <v-btn @click="action.onSave()" color="primary">
          {{ action.button }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'

export default {
  name: 'SpendingForm',

  props: {
    spendingToEdit: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      item: {}
    }
  },

  computed: {
    action() {
      let action = {
      }

      if (this.item.id) {
        action = {
          title: 'Update Line Item',
          button: 'Update',
          onSave: this.updateitem
        }
      }

      return action
    }
  },

  created() {
    if (this.spendingToEdit.id) {
      this.item = { ...this.spendingToEdit }
    }
  },

  methods: {
    async updateitem() {
      try {
        const item = { ...this.item }
        
        if (item.ref) {
          delete item.ref
        }

        await this.spendingToEdit.ref.update(item)

        this.$emit('update')
      } catch (error) {
        throw new Error(error)
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

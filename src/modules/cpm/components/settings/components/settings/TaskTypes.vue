<template>
  <div>
    <v-card>
      <v-card-title class="relative">
        <v-btn
          absolute
          color="blue"
          fab
          light
          right
          small
          @click="showForm = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="vertical-scroll">
        <div class="form-group">
          <label>Current {{ appLabel.singular }} Task Types</label>
          <v-data-table
            :headers="headers"
            :items="settings.taskTypes"
            :options.sync="pagination"
          >
            <template v-slot:item="props">
              <tr>
                <td>{{ props.item.name }} - {{ props.item.color }}</td>
                <td class="text-right">
                  <v-btn
                    icon
                    small
                    text
                    @click.prevent="edit(props.index, props.item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    text
                    @click.prevent="deleteType(props.index, props.item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>
    <v-card
      v-if="showForm"
      class="mt-2"
    >
      <v-card-text class="vertical-scroll">
        <v-form ref="form">
          <v-text-field
            v-model="type"
            color="blue"
            :label="`${appLabel.singular} Task Type Name`"
          />
          <v-select
            v-model="color"
            clearable
            :items="options"
            label="Task Type Color"
          />
          <input
            v-model="currentType"
            type="hidden"
          >
          <v-btn
            color="blue"
            outlined
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue"
            dark
            type="submit"
            @click="save"
          >
            {{ submitLoading ? 'Saving...' : 'Save' }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'TaskTypes',
  data() {
    return {
      type: '',
      color: '',
      options: ['red', 'blue', 'yellow', 'green', 'orange', 'purple', 'pink'],
      currentType: '',
      settings: {},
      submitLoading: false,
      showForm: false,
      rules: {
        required: value => !!value || 'Required.'
      },
      pagination: {
        rowsPerPage: -1
      },
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Action',
          value: 'action'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['appLabel']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  mounted() {
    db.collection('settings')
      .doc(this.currentCompany.id)
      .collection('settings')
      .doc('projects')
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('projects')
            .set({
              taskTypes: []
            })
        }
      })
  },
  methods: {
    save() {
      if (!this.type) {
        this.$snotify.error(
          `${this.appLabel.singular} type name is required`,
          'Error'
        )
        return
      }

      const data = {
        name: this.type,
        value: this.type,
        color: this.color
      }

      if (this.currentType === '') {
        if (!this.settings.taskTypes) {
          this.settings.taskTypes = []
        }
        this.settings.taskTypes.push(data)
      } else {
        this.$set(this.settings.taskTypes, this.currentType, data)
      }

      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
        .update({
          taskTypes: this.settings.taskTypes
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} task type has been saved`,
        'Success'
      )
      this.cancel()
    },
    deleteType(id, obj) {
      const confirmation = confirm(
        `Do you want to delete this ${this.appLabel.singular} type: ${obj.name}`
      )
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.taskTypes.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
        .update({
          taskTypes: this.settings.taskTypes
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} type has been deleted`,
        'Success'
      )
      this.cancel()
    },
    edit(id, obj) {
      this.type = obj.name
      this.color = obj.color
      this.currentType = id
      this.showForm = true
    },
    cancel() {
      this.type = ''
      this.color = ''
      this.currentType = ''
      this.showForm = false
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
    }
  }
}
</script>

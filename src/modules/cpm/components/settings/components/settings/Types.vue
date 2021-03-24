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
          <label>Current {{ appLabel.singular }} Types</label>
          <v-data-table
            :headers="headers"
            :items="settings.types"
            :options.sync="pagination"
          >
            <template v-slot:item="props">
              <tr>
                <td>{{ props.item }}</td>
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
          <h6
            v-if="currentType"
            class="indigo--text"
          >
            Editing:
          </h6>
          <v-text-field
            v-model="type"
            color="blue"
            :label="`${appLabel.singular} Type Name`"
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
  data() {
    return {
      type: '',
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
              types: []
            })
        }
      })
  },
  methods: {
    save() {
      if (this.type == '') {
        this.$snotify.error(
          `${this.appLabel.singular} type name is required`,
          'Error'
        )
        return
      }
      if (this.currentType === '') {
        if (!this.settings.types) {
          this.settings.types = []
        }
        this.settings.types.push(this.type)
      } else {
        this.$set(this.settings.types, this.currentType, this.type)
      }
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
        .update({
          types: this.settings.types
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} type has been saved`,
        'Success'
      )
      this.cancel()
    },
    deleteType(id, name) {
      const confirmation = confirm(
        `Do you want to delete this ${this.appLabel.singular} type: ${name}`
      )
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.types.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
        .update({
          types: this.settings.types
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} type has been deleted`,
        'Success'
      )
    },
    edit(id, name) {
      this.type = name
      this.currentType = id
      this.showForm = true
    },
    cancel() {
      this.type = ''
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

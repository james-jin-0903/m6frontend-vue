<template>
  <div>
    <v-card>
      <v-card-title class="relative">
        <v-btn
          absolute
          color="blue"
          dark
          fab
          right
          small
          @click="showForm = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="vertical-scroll">
        <div class="form-group">
          <label>Current Items</label>
          <v-data-table
            :headers="headers"
            :items="settings.types"
            :options.sync="pagination"
          >
            <template v-slot:items="props">
              <td>{{ props.item.name }}</td>
              <td class="text-right">
                <v-btn
                  icon
                  small
                  @click.prevent="editCategory(props.index, props.item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  @click.prevent="deleteCategory(props.index, props.item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
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
            label="Type Name"
          />
          <input
            v-model="currentType"
            type="hidden"
          >
          <v-btn
            color="blue"
            outline
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue"
            dark
            type="submit"
            @click="saveType"
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
      show: 'types',
      type: '',
      currentType: '',
      types: '',
      settings: {},
      submitLoading: false,
      showForm: false,
      rules: {
        required: value => !!value || 'Required.'
      },
      defaultTypes: ['policy-procedure', 'form', 'chapter'],
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
      .doc('policy_and_standards')
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('policy_and_standards')
            .set({
              types: []
            })
        }
      })
  },
  methods: {
    isInDefaultTypes(type) {
      const found = this.defaultTypes.find(
        defaultType => defaultType == type.value
      )

      return found ? false : true
    },
    slugify(string) {
      return string
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w]+/g, '')
        .replace(/\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
    },
    saveType() {
      if (this.type == '') {
        this.$snotify.error('Type name is required', 'Error')
        return
      }
      const aux = {
        name: this.type,
        value: this.slugify(this.type)
      }

      if (this.currentType === '') {
        if (!this.settings.types) {
          this.settings.types = []
        }
        this.settings.types.push(aux)
      } else {
        this.$set(this.settings.types, this.currentType, aux)
      }

      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('policy_and_standards')
        .update({
          types: this.settings.types
        })

      this.$snotify.success('The type has been saved', 'Success')
      this.cancel()
    },
    deleteCategory(id, name) {
      const confirmation = confirm(`Do you want to delete this type: ${name}`)
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.types.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('policy_and_standards')
        .update({
          types: this.settings.types
        })
      this.$snotify.success(
        `The ${this.appLabel.profile.type} has been deleted`,
        'Success'
      )
    },
    editCategory(id, type) {
      this.type = type.name
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
        .doc('policy_and_standards')
    }
  }
}
</script>

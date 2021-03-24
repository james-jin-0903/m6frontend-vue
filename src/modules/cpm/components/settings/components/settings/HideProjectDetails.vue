<template>
  <div>
    <v-card>
      <v-card-text class="vertical-scroll">
        <v-progress-circular
          v-if="showLoading"
          color="primary"
          indeterminate
          :size="50"
          style="left: 50%;"
        />
        <div
          v-else
          class="form-group"
        >
          <label>Fields to Hide</label>
          <v-checkbox
            v-for="(field, index) in fields"
            :key="index"
            v-model="field.hide"
            :label="field.label"
          />

          <v-btn
            color="blue"
            dark
            type="submit"
            @click="save"
          >
            {{ submitLoading ? 'Saving...' : 'Save' }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  data() {
    return {
      element: '',
      currentElement: '',
      settings: {},
      fields: {
        projectCreator: { label: 'Project Creator', hide: false },
        projectType: { label: 'Project Type', hide: false }
      },
      submitLoading: false,
      showLoading: false
    }
  },
  mounted() {
    this.showLoading = true
    db.collection('settings')
      .doc(this.currentCompany.id)
      .collection('settings')
      .doc('fields')
      .get()
      .then(settings => {
        if (settings.exists) {
          const data = settings.data()
          if (data.projectDetails) {
            for (const index in data.projectDetails) {
              if (this.fields[index]) {
                this.fields[index].hide = data.projectDetails[index].hide
              }
            }
          }
        } else {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('fields')
            .update(
              {
                projectDetails: {}
              }
            )
        }
        this.showLoading = false
      })
      .catch(() => {
        this.showLoading = false
        this.$snotify.error(
          'There was an error while loading the data',
          'Error'
        )
      })
  },
  methods: {
    save() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('fields')
        .update(
          {
            projectDetails: this.fields
          }
        )
        .then(() => {
          this.$snotify.success('The fields have been saved', 'Success')
        })
    }
  }
}
</script>

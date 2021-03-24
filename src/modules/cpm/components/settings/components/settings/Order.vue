<template>
  <v-card>
    <v-card-text class="vertical-scroll">
      <v-select
        v-model="project_order.phase_order"
        clearable
        :items="order"
        label="Phase Order List"
      >
        <template slot="no-options">
          Select the order list
        </template>
      </v-select>

      <v-select
        v-model="project_order.status_order"
        clearable
        :items="order"
        label="Project Status Order List"
      >
        <template slot="no-options">
          Select the order list
        </template>
      </v-select>

      <v-btn
        color="blue"
        outlined
        @click="clear"
      >
        Clear
      </v-btn>
      <v-btn
        color="blue"
        dark
        type="submit"
        @click="save"
      >
        {{ submitLoading ? 'Saving...' : 'Save' }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Order',
  data: vm => ({
      phase: '',
      currentPhase: '',
      settings: {},
      project_order: { phase_order: '', status_order: '' },
      order: ['Ascending', 'Descending'],
      submitLoading: false,
      rules: {
        required: value => !!value || 'Required.'
      }
  }),
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
      .doc(this.appLabel.settingsCollection)
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc(this.appLabel.settingsCollection)
            .set({
              project_order: []
            })
        } else {
          this.project_order = settings.data()['project_order']
            ? settings.data()['project_order']
            : this.settings.project_order
        }
      })
  },
  methods: {
    clear() {
      this.project_order = { phase_order: '', status_order: '' }
    },
    save() {
      this.submitLoading = true
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          project_order: this.project_order
        })
        .then(() => {
          this.$snotify.success(
            `The ${this.appLabel.singular} ${this.appLabel.profile.phase} has been saved`,
            'Success'
          )
          this.submitLoading = false
        })
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.settingsCollection)
    }
  }
}
</script>

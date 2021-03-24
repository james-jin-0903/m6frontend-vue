<template>
  <m6-card-dialog title="Capital Plan">
    <v-container
      class="pa-0 rounded-lg"
      fluid
      grid-list-md
    >
      <v-row>
        <v-col md="12">
          <v-text-field
            v-model="name"
            label="Capital Plan Name"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-spacer />

        <v-btn
          color="primary"
          :loading="loading"
          @click="saveCapitalName"
        >
          Save
        </v-btn>
      </v-row>
    </v-container>
  </m6-card-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'
import DefaultCapital from '../DefaultCapital'
import Eventbus from '../../../../Eventbus'

export default {
  extends: DefaultCapital,

  data() {
    const capitalPlanId = this.$route.params.id
    return {
      capitalPlanId: capitalPlanId,
      allProjects: [],
      dialog: true,
      loading: false,
      name: ''
    }
  },

  watch: {
    'capitalPlan.name': function () {
      if (this.capitalPlan != null && this.capitalPlan.name) {
        this.name = this.capitalPlan.name
      } else {
        this.name = ''
      }
    }
  },

  methods: {
    saveCapitalName() {
      this.loading = true

      const capitalPlan = {
        name: this.name
      }

      db.collection('cpm_capital_plan')
        .doc(this.capitalPlanId)
        .update(capitalPlan)
        .then(() => {
          this.$snotify.success(
            'The Capital Plan name has been updated',
            'Success'
          )
          Eventbus.$emit('show-projects-capital-plan', false)
        })
        .catch(() => this.$snotify.error('Error'))
        .then(() => (this.loading = false))
    }
  }
}
</script>

<template>
  <v-dialog
    v-model="show"
    persistent
    width="500"
  >
    <v-card>
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">Create a {{ title }} Comment</span>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-card-text class="vertical-scroll">
        <v-form ref="form">
          <v-textarea
            v-model="comment"
            :label="`${title} Comment *`"
            spellcheck="true"
          />
        </v-form>
      </v-card-text>

      <v-divider />
      <m6-loading :loading="showLoading" />
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="gray"
          text
          @click="cancel"
        >
          Close
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="create"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    projectId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      comment: '',
      showInReport: false,
      showLoading: false
    }
  },
  methods: {
    cancel() {
      this.comment = ''
      this.showInReport = false
      this.$emit('close')
    },
    create() {
      const isValid = this.$refs.form.validate()
      if (!isValid) {
        this.$snotify.error('Please fill in the comment', 'Error')
        return
      }

      if (this.comment === '') {
        this.$snotify.error('Please fill in the comment', 'Error')
        return
      }

      const aux = {
        comment: this.comment,
        createdAt: new Date(),
        type: this.type,
        inReport: this.showInReport
      }

      /* if (Drupal.settings.m6_cpm.current_user_name){
          aux.user = Drupal.settings.m6_cpm.current_user_name;
        }*/
      this.showLoading = true
      db.collection('cpm_projects')
        .doc(this.projectId)
        .collection('comments')
        .add(aux)
        .then(() => {
          this.$snotify.success(`${this.type} Comment Saved`, 'Success')
          this.comment = ''
          this.showInReport = false
          this.showLoading = false
          this.$emit('reload')
          this.$emit('close')
        })
        .catch(() => {
          this.$snotify.error(
            `There was an error while saving the ${this.type} Comment`,
            'Error'
          )
        })
    }
  }
}
</script>

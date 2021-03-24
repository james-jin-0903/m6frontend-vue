<template>
  <v-dialog
    v-model="show"
    persistent
    width="500"
  >
    <v-card>
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">Edit a {{ title }} Comment</span>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-card-text class="vertical-scroll">
        <v-form ref="form">
          <v-textarea
            v-model="comment.data.comment"
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
          @click="update"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script >
import { db } from '@/utils/Firebase'
export default {

  /*
      connect the delete btn, and do the same for the other panel and done
      make it quick
    */
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
    },
    commentToEdit: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      comment: { data: { comment: '', showInReport: '' } },
      showLoading: false
    }
  },
  mounted() {
    this.comment = { ...this.commentToEdit }
  },
  methods: {
    cancel() {
      this.comment = { data: { comment: '', showInReport: '' } }
      this.$emit('close')
    },
    update() {
      const isValid = this.$refs.form.validate()
      if (!isValid) {
        this.$snotify.error('Please fill in the comment', 'Error')
        return
      }

      if (this.$h.dg(this.comment, 'data.comment', '') === '') {
        this.$snotify.error('Please fill in the comment', 'Error')
        return
      }

      this.showLoading = true
      db.collection('cpm_projects').doc(this.projectId).collection('comments').doc(this.comment.id).update(this.comment.data)
        .then(() => {
          this.$snotify.success(`${this.type} Comment Updated`, 'Success')
          this.showLoading = false
          this.$emit('reload')
          this.$emit('close')
        })
        .catch(() => {
          this.$snotify.error(`There was an error while saving the ${this.type} Comment`, 'Error')
        })
    }
  }
}
</script>

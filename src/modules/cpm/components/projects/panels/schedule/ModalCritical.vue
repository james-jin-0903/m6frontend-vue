<template>
  <div class="main_content">
    <div class="modal-mask new-template-modal">
      <div class="modal-wrapper">
        <div
          class="modal-container"
          style="max-width: 600px"
        >
          <div class="modal-body">
            <slot name="body">
              <h3 class="danger">
                Are you sure you want to set this task as critical?
              </h3>
              <h5>Setting the task as critical will trigger email notifications</h5>
              <div class="actions margin-top-25 text-right">
                <button
                  class="btn btn-default"
                  @click="$emit('modalCriticalClose')"
                >
                  Cancel
                </button>
                <button
                  class="btn btn-danger"
                  @click="save"
                >
                  Set as Critical
                </button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'

export default {
  props: ['id'],
  data() {
    let taskRef = {}
    if (this.$route.name === 'tasks' || this.$route.name === 'task') {
      taskRef = db.collection('projects').doc(this.$route.params.id).collection('tasks').doc(this.id)
    } else if (this.$route.name === 'tickets') {
      taskRef = db.collection('tickets').doc(this.id)
    }
    return {
      taskRef,
      task: {}
    }
  },
  // Returns array or object
  firestore() {
    return {
      task: this.taskRef
    }
  },
  mounted() {
    document.documentElement.classList.add('has-modal-open')
  },
  destroyed() {
    document.documentElement.classList.remove('has-modal-open')
  },
  methods: {
    save() {
      this.taskRef.update({ priority: 'critical' })
      this.$emit('modalCriticalClose')
    }
  }
}
</script>

<style lang="scss">
</style>

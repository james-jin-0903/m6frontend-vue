<template>
  <m6-card-dialog title="Status Comments">
    <template v-slot:after:title>
      <v-tooltip
        v-if="$route.name === 'cpm.projects.show'"
        left
      >
        <template v-slot:activator="{ on }">
          <a
            class="pointer pr-1"
            :href="'/m6apps#/cpm/projects/' + $route.params.id + '/fullscreen/status-comment'"
            target="_blank"
            v-on="on"
          >
            <v-icon
              light
              text
            >
              mdi-launch
            </v-icon>
          </a>
        </template>
        <span>{{ $t('general.openNewTab') }}</span>
      </v-tooltip>

      <v-icon
        class="pointer"
        light
        @click="createModal = true"
      >
        mdi-plus
      </v-icon>
    </template>

    <div
      v-if="loading"
      class="text-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        :size="32"
      />
    </div>

    <div
      v-for="(status, index) in commentsSortedByDate"
      :key="index"
      style="padding: 7px 0px 7px 0px;"
    >
      <v-row
        align="center"
        @mouseleave="statusIndex = null"
        @mouseover="statusIndex = index"
      >
        <v-col cols="10">
          <span class="dependency-details">
            <p
              class="mb-0"
              style="font-size: 16px;"
            >
              {{ status.data.comment }}
            </p>
            <p
              class="mb-0"
              style="font-size: 12px;"
            >
              {{
                status.data.createdAt
                  .toDate()
                  .toString()
                  .substring(0, 24)
              }}
            </p>
          </span>
        </v-col>

        <td class="text-right">
          <v-icon
            class="ml-0 mr-1 pointer"
            color="#757575"
            size="20"
            @click="pickingStatusComment(status)"
          >
            mdi-pencil
          </v-icon>

          <v-icon
            class="ml-0 mr-0 pointer"
            color="#f44336"
            size="20"
            @click="deletingComment(status)"
          >
            mdi-delete
          </v-icon>
        </td>
      </v-row>
      <v-divider />
    </div>

    <div
      v-if="statusComments.length == 0 && !loading"
      style="padding: 7px 0px 7px 0px;"
    >
      <span class="text-center">No Status Comments Have Been Made Yet</span>
    </div>

    <status-comment-create
      v-if="createModal"
      :project-id="projectId"
      :show="createModal"
      title="Status"
      :type="type"
      @close="createModal = false"
      @reload="getComments"
    />
    <status-comment-edit
      v-if="editModal"
      :comment-to-edit="commentToEdit"
      :project-id="projectId"
      :show="editModal"
      title="Status"
      :type="type"
      @close="closingEdit"
      @reload="getComments"
    />
    <m6-confirm-delete
      :message="
        `Are you sure you want to permanently delete this Status Comment?`
      "
      :show="showDeleteConfirm"
      title="Delete Status Comment"
      @cancel="cancelDelete"
      @confirm="deleteComment"
    />
  </m6-card-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'

import CommentCreate from '../modals/CommentCreate'
import CommentEdit from '../modals/CommentEdit'

export default {
  components: {
    'status-comment-create': CommentCreate,
    'status-comment-edit': CommentEdit
  },

  props: {
    pid: {
      type: [String, Number],
      default: undefined
    }
  },

  data() {
    const projectId = this.pid ? this.pid : this.$route.params.id

    return {
      projectId: projectId,
      createModal: false,
      editModal: false,
      statusIndex: null,
      commentToEdit: {},
      type: 'Status',
      comments: [],
      loading: false,
      showDeleteConfirm: false,
      commentToDelete: {}
    }
  },

  computed: {
    statusComments() {
      return this.comments.filter(c => c.data.type === 'Status')
    },

    commentsSortedByDate() {
      const sorted = [...this.comments].sort(function (a, b) {
        const dateA = new Date(a.data.createdAt.seconds * 1000),
          dateB = new Date(b.data.createdAt.seconds * 1000)
        return dateB - dateA
      })
      return sorted.filter(status => status.data.type === 'Status')
    }
  },

  mounted() {
    this.getComments()
  },

  methods: {
    deletingComment(status) {
      this.commentToDelete = status
      this.showDeleteConfirm = true
    },

    cancelDelete() {
      this.showDeleteConfirm = false
      this.commentToDelete = {}
    },

    getComments() {
      this.comments = []
      this.loading = true
      db.collection('cpm_projects')
        .doc(this.projectId)
        .collection('comments')
        .get()
        .then(snapshot => {
          snapshot.forEach(snap => {
            const data = {}
            data.data = snap.data()
            data.id = snap.id
            this.comments.push(data)
          })
          this.loading = false
        })
        .catch(() => {
          this.$snotify.error(
            'There was an error while getting the status comments',
            'Error'
          )
        })
    },

    pickingStatusComment(status) {
      this.commentToEdit = { ...status }
      this.editModal = true
    },

    closingEdit() {
      this.commentToEdit = {}
      this.editModal = false
    },

    deleteComment() {
      db.collection('cpm_projects')
        .doc(this.projectId)
        .collection('comments')
        .doc(this.commentToDelete.id)
        .delete()
        .then(() => {
          this.$snotify.success('Budget Comment Deleted', 'Success')
          this.getComments()
          this.cancelDelete()
        })
        .catch(() => {
          this.$snotify.error(
            'There was an error while saving the Budget Comment',
            'Error'
          )
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.cpm-panel {
  margin-bottom: 10px;
}
.card-container {
  padding: 15px;
  height: 180px;
  overflow-y: auto;
  overflow-x: hidden;
}
.dependency-details {
  line-height: 1.2;
  p:first-child {
    font-size: 16px;
  }
  font-size: 12px;
}
.btn-right {
  margin: 0px;
  float: right;
}
</style>

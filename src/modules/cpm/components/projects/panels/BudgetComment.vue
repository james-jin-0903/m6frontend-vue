<template>
  <m6-card-dialog title="Budget/Schedule Comments">
    <template v-slot:after:title>
      <v-tooltip
        v-if="$route.name === 'cpm.projects.show'"
        left
      >
        <template v-slot:activator="{ on }">
          <a
            class="pointer pr-1"
            :href="'/m6apps#/cpm/projects/' + $route.params.id + '/fullscreen/budget-comment'"
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
        class="cursor"
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
      class="py-2 px-0"
      v-for="(budget, index) in commentsSortedByDate"
      :key="index"
    >
      <v-row
        align="center"
        @mouseleave="budgetIndex = null"
        @mouseover="budgetIndex = index"
      >
        <v-col cols="10">
          <span class="dependency-details">
            <p
              class="mb-0"
              style="font-size: 16px;"
            >
              {{ budget.data.comment }}
            </p>
            <p
              class="mb-0"
              style="font-size: 12px;"
            >
              {{
                budget.data.createdAt
                  .toDate()
                  .toString()
                  .substring(0, 24)
              }}
            </p>
          </span>
        </v-col>

        <td class="text-right">
          <v-icon
            class="ml-0 mr-1"
            color="#757575"
            text
            size="20"
            @click="pickingBudgetComment(budget)"
          >
            mdi-pencil
          </v-icon>

          <v-icon
            class="ml-0 mr-0"
            color="#f44336"
            text
            size="20"
            @click="deletingComment(budget)"
          >
            mdi-delete
          </v-icon>
        </td>
      </v-row>
      <v-divider />
    </div>

    <div
      class="py-2 px-0"
      v-if="budgetComments.length == 0 && !loading"
    >
      <span class="text-center">No Status Budget Have Been Made Yet</span>
    </div>

    <status-comment-create
      v-if="createModal"
      :project-id="projectId"
      :show="createModal"
      title="Budget/Schedule"
      :type="type"
      @close="createModal = false"
      @reload="getComments"
    />
    <status-comment-edit
      v-if="editModal"
      :comment-to-edit="Object.assign({}, commentToEdit)"
      :project-id="projectId"
      :show="editModal"
      title="Budget/Schedule"
      :type="type"
      @close="closingEdit"
      @reload="getComments"
    />
    <m6-confirm-delete
      :message="
        `Are you sure you want to permanently delete this Budget/Schedule Comment?`
      "
      :show="showDeleteConfirm"
      :title="`Delete Budget/Schedule Comment`"
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
      budgetIndex: null,
      commentToEdit: {},
      comments: [],
      loading: false,
      type: 'Budget',
      showDeleteConfirm: false,
      commentToDelete: {}
    }
  },

  computed: {
    budgetComments() {
      return this.comments.filter(c => c.data.type === 'Budget')
    },

    commentsSortedByDate() {
      const sorted = [...this.comments].sort(function (a, b) {
        const dateA = new Date(a.data.createdAt.seconds * 1000),
          dateB = new Date(b.data.createdAt.seconds * 1000)
        return dateB - dateA
      })
      return sorted.filter(status => status.data.type === 'Budget')
    }
  },

  mounted() {
    this.getComments()
  },

  methods: {
    deletingComment(budget) {
      this.commentToDelete = budget
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

    pickingBudgetComment(status) {
      this.commentToEdit = status
      this.editModal = true
    },

    closingEdit() {
      this.editModal = false
      this.commentToEdit = {}
    },

    deleteComment() {
      db.collection('cpm_projects')
        .doc(this.projectId)
        .collection('comments')
        .doc(this.commentToDelete.id)
        .delete()
        .then(() => {
          this.$snotify.success('Budget/Schedule Comment Deleted', 'Success')
          this.getComments()
          this.cancelDelete()
        })
        .catch(() => {
          this.$snotify.error(
            'There was an error while saving the Budget/Schedule Comment',
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
</style>

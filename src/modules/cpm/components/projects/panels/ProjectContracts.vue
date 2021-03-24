<template>
  <m6-card-dialog
    v-if="project.contracts && project.contracts.length > 0"
    title="No Risks Have Been Made Yet"
  >
    <template v-slot:after:title>
      <v-tooltip
        v-if="$route.name === 'cpm.projects.show'"
        left
      >
        <template v-slot:activator="{ on }">
          <a
            class="pointer pr-1"
            :href="'/m6apps#/cpm/projects/' + $route.params.id + '/fullscreen/project-contracts'"
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
    </template>

    <v-card-text class="pr-0 vertical-scroll">
      <div class="text-center">
        <v-progress-circular
          v-show="loading"
          color="primary"
          indeterminate
          :size="32"
        />
      </div>
      <template>
        <div style="padding: 7px 0px 7px 0px;">
          <v-row align="center">
            <table class="theme--light v-table">
              <tr>
                <th class="text-left">
                  Contract Name
                </th>
                <th class="text-center" />
              </tr>
              <tr
                v-for="(contract, index) in project.contracts"
                :key="index"
              >
                <td class="text-left">
                  {{ contract.title }}
                </td>
                <td>
                  <a
                    :href="'/m6apps#/cpm/contracts/' + contract.nid"
                    target="_blank"
                  >
                    View
                  </a>
                </td>
              </tr>
            </table>
          </v-row>
          <v-divider />
        </div>
      </template>
    </v-card-text>

    <m6-loading :loading="loading" />
  </m6-card-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'

const defaultItem = {
  issue: '',
  factors: '',
  riskScore: 0,
  mitigation: '',
  color: { color: '', label: '' }
}

export default {
  data() {
    return {
      loading: false,
      dialogProperties: { ...defaultItem },
      method: 'add',
      showModal: false,
      project: {
        risks: []
      },
      optionsColor: [
        { label: 'High', color: 'red' },
        { label: 'Medium', color: 'orange' },
        { label: 'Low', color: 'rgb(182,221,232)' }
      ],
      showDeleteModal: false,
      deleteIndex: 0
    }
  },

  watch: {
    showModal(val) {
      val || this.closeModal()
    }
  },

  methods: {
    openModal() {
      this.showModal = true
      this.dialogProperties = { ...this.defaultItem }
      this.method = 'add'
      this.$refs.tiptap.setText(this.dialogProperties.mitigation)
    },
    editItem(item) {
      this.dialogProperties = item
      this.$refs.tiptap.setText(this.dialogProperties.mitigation)

      this.showModal = true
      this.method = 'put'
    },

    deleteItem(item, index) {
      this.deleteIndex = index
      this.showDeleteModal = true
    },

    confirmDelete() {
      this.project.risks.splice(this.deleteIndex, 1)
      this.updateData()
    },

    cancelDelete() {
      this.deleteIndex = 0
      this.showDeleteModal = false
    },

    closeModal() {
      this.showModal = false

      this.dialogProperties = { ...this.defaultItem }
    },

    saveModal() {
      switch (this.method) {
        case 'add':
          if (!this.project.risks) {
            this.project.risks = []
          }
          this.dialogProperties.mitigation = this.$refs.tiptap.getText()
          this.project.risks.push(this.dialogProperties)
          break
        case 'put':
          this.dialogProperties.mitigation = this.$refs.tiptap.getText()
          break
      }

      this.updateData()
    },

    updateData() {
      this.loading = true
      this.deleteIndex = 0
      this.showDeleteModal = false
      db.collection('cpm_projects')
        .doc(this.$route.params.id)
        .update({
          risks: this.project.risks
        })
        .then(() => {
          this.loading = false
          this.deleteIndex = 0
          this.showDeleteModal = false
          this.closeModal()
        })
    }
  },

  firestore() {
    return {
      project: db.collection('cpm_projects').doc(this.$route.params.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-delete-btns {
  height: 45px;
  cursor: pointer;
  padding: 0px 7px 0px 7px;
}
.scroll-risk {
  overflow-y: auto;
  overflow-x: hidden;
  height: 170px;
}

th {
  padding-bottom: 15px;
}
td {
  padding-bottom: 10px;
  padding-top: 10px;
  border-bottom: 1px solid #ccc;
}
</style>

<template>
  <m6-card-dialog title="Risk Management">
    <template v-slot:after:title>
      <v-icon
        class="cursor"
        light
        @click="openModal"
      >
        mdi-plus
      </v-icon>
    </template>

    <div class="text-center">
      <v-progress-circular
        v-show="loading"
        color="primary"
        indeterminate
        :size="32"
      />
    </div>

    <template v-if="project.risks && project.risks.length > 0">
      <div
        v-for="(risk, index) in project.risks"
        :key="index"
        style="padding: 7px 0px 7px 0px;"
      >
        <v-row align="center">
          <v-col cols="10">
            <span class="dependency-details">
              <p
                class="mb-0"
                style="font-size: 16px;"
              >
                {{ index + 1 }}. {{ risk.issue }}
              </p>
              <p
                class="mb-0"
                style="font-size: 12px;"
              >
                Score: {{ risk.riskScore }}
              </p>
            </span>
          </v-col>

          <td class="text-right">
            <v-icon
              class="ml-0 mr-1 pointer"
              color="#757575"
              size="20"
              text
              @click="editItem(risk)"
            >
              mdi-pencil
            </v-icon>

            <v-icon
              class="ml-0 mr-0"
              color="#f44336"
              size="20"
              text
              @click="deleteItem(risk)"
            >
              mdi-delete
            </v-icon>
          </td>
        </v-row>
        <v-divider />
      </div>
    </template>
    <template v-else>
      <div style="padding: 7px 0px 7px 0px;">
        <span class="text-center">No Risks Have Been Made Yet</span>
      </div>
    </template>

    <v-dialog
      v-model="showModal"
      max-width="550px"
      persistent
      scrollable
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            Risk Management
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />

        <v-card-text class="vertical-scroll">
          <v-container
            class="pa-0 rounded-lg"
            fluid
            grid-list-md
          >
            <v-row>
              <v-col md="12">
                <v-textarea
                  v-model="dialogProperties.issue"
                  label="Issue"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <v-textarea
                  v-model="dialogProperties.factors"
                  label="Factors"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col
                md="6"
                sm="12"
              >
                <v-text-field
                  v-model="dialogProperties.riskScore"
                  label="Risk Score"
                />
              </v-col>
              <v-col
                md="6"
                sm="12"
              >
                <v-select
                  v-model="dialogProperties.color"
                  clearable
                  :items="optionsColor"
                  label="Level of Risk"
                >
                  <template
                    slot="item"
                    slot-scope="{ item }"
                  >
                    {{ item.label }}
                    <v-icon :style="`color:${item.color}`">
                      fiber_manual_record
                    </v-icon>
                  </template>
                  <template
                    slot="selection"
                    slot-scope="{ item }"
                  >
                    {{ item.label }}
                    <v-icon :style="`color:${item.color}`">
                      fiber_manual_record
                    </v-icon>
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                md="12"
                style="min-height:140px;"
              >
                <span class="label-select">Sharp's Mitigation</span>
                <tiptap ref="tiptap" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="gray"
            :disabled="loading"
            :loading="loading"
            text
            @click="closeModal"
          >
            Close
          </v-btn>
          <v-btn
            color="primary"
            :disabled="loading"
            :loading="loading"
            text
            @click="saveModal"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--DELETE MODAL-->
    <m6-confirm-delete
      message="Are you sure to delete this Risk Management Line Item?"
      :show="showDeleteModal"
      title="Delete Risk Managment"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />
    <!--DELETE MODAL-->

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
import Tiptap from './Tiptap/TextEditorTipTap'

export default {
  name: 'RiskManagement',
  components: {
    Tiptap
  },
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

  firestore() {
    return {
      project: db.collection('cpm_projects').doc(this.$route.params.id)
    }
  },

  watch: {
    showModal(val) {
      val || this.closeModal()
    }
  },

  mounted() {
    setTimeout(() => {
      const editor = document.getElementsByClassName('ProseMirror')
      editor[0].setAttribute('style', 'white-space: pre-wrap; height: 200px;')
    }, 1000)
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
  }
}
</script>

<style lang="scss" scoped>
.edit-delete-btns {
  height: 45px;
  cursor: pointer;
  padding: 0px 7px 0px 7px;
}
</style>

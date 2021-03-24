<template>
  <m6-card-dialog :title="$t('cpm.projects.riskAssessmentPanel.title')">
    <template v-slot:after:title>
      <v-icon
        class="cursor"
        light
        @click="openCreateForm"
      >
        mdi-plus
      </v-icon>
    </template>

    <v-data-table
      :headers="headers"
      :items="riskAssessments"
    >
      <template v-slot:items="props">
        <tr>
          <td>
            <v-chip
              class="ma-0"
              :color="$h.dg(props, 'item.status.color', 'info')"
              dark
              label
              small
            >
              <span class="pr-2">
                {{ $h.dg(props, 'item.status.name', $t('general.nA')) }}
              </span>
            </v-chip>
          </td>
          <td>
            {{ props.item.purpose }}
          </td>
          <td>
            {{ props.item.comment }}
          </td>
          <td class="text-center">
            {{ getDate(props.item.date) }}
          </td>
          <td class="text-right">
            <v-icon
              class="action-icon action-icon__edit pointer"
              @click="editRisk(props.item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              class="action-icon action-icon__delete pointer"
              @click="deleteRiskConfirm(props.item)"
            >
              mdi-delete
            </v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>

    <project-risk-form
      v-if="showForm"
      :risk-to-edit="riskToEdit"
      @closeDialog="closeForm"
    />

    <M6ConfirmDelete
      :show="showConfirmDelete"
      :title="$t('cpm.projects.riskAssessmentPanel.deleteConfirm')"
      @cancel="showConfirmDelete = false"
      @confirm="deleteRisk"
    />

    <m6-loading
      :loading="loading"
    />
  </m6-card-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ProjectRiskForm from '../modals/ProjectRiskForm'
export default {
  name: 'ProjectRiskAssessment',

  components: {
    ProjectRiskForm
  },

  data() {
    return {
      loading: false,
      projectId: '',
      riskToEdit: null,
      showForm: false,
      showConfirmDelete: false,
      headers: [
        { text: this.$t('cpm.projects.riskAssessmentPanel.heatMapStatus') },
        {
          text: this.$t('cpm.projects.riskAssessmentPanel.purpose'),
          sortable: false
        },
        {
          text: this.$t('cpm.projects.riskAssessmentPanel.comment'),
          sortable: false
        },
        { text: this.$t('general.date'), sortable: false },
        { text: this.$t('general.actions'), sortable: false }
      ]
    }
  },

  computed: {
    ...mapGetters('companies/cpmProjects/riskAsssessment', {
      riskAssessments: 'riskAssessments'
    })
  },

  created() {
    this.projectId = this.$h.dg(this.$route, 'params.id', '')
    if (!this.riskAssessments.length) {
      this.fetchRiskAssessments({
        projectId: this.$h.dg(this.$route, 'params.id', '')
      })
    }
  },

  methods: {
    ...mapActions('companies/cpmProjects/riskAsssessment', {
      fetchRiskAssessments: 'fetchRiskAssessments',
      delete: 'delete'
    }),
    openCreateForm() {
      this.showForm = true
    },
    editRisk(risk) {
      this.riskToEdit = risk
      this.showForm = true
    },
    deleteRiskConfirm(risk) {
      this.riskToDelete = risk
      this.showConfirmDelete = true
    },
    deleteRisk() {
      this.loading = true
      this.delete({
        projectId: this.projectId,
        riskId: this.$h.dg(this, 'riskToDelete.id')
      })
        .then(() => {
          this.$snotify.success(this.$t('alerts.successfullyDeleted'))
          this.showConfirmDelete = false
        })
        .catch(error => {
          console.error(error)
          this.$snotify.error(this.$t('alerts.unexpectedError'))
        })
        .finally(() => this.loading = false)
    },
    getDate(date) {
      if (date) {
        return this.$moment(date).format('YYYY-MM-DD')
      } else {
        return this.$t('general.noDate')
      }
    },
    closeForm() {
      this.riskToEdit = null
      this.showForm = false
    },
    async getReferenceData(documentReference) {
      const res = await documentReference.get()
      if (res.exists) {
        const data = res.data()

        return data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .action-icon {
    transition: all 0.2s ease-out;

    &__edit:hover {
      transform: scale(1.2);
      color: #2196F3;
    }
    &__delete:hover {
      transform: scale(1.2);
      color: #FF0000;
    }
  }
</style>

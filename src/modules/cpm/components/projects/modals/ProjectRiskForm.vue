<template>
  <v-dialog
    scrollable
    :value="true"
    :width="700"
    @input="closeDialog"
  >
    <v-card>
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">
          {{ actionButton }} {{ $t('cpm.projects.riskAssessmentPanel.title') }}
        </span>
      </v-card-title>
      <v-divider class="grey lighten-3" />
      <v-card-text class="vertical-scroll">
        <v-form ref="form">
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="risk.status"
                clearable
                item-text="name"
                :items="covidRiskStatus"
                return-object
                :rules="[rules.required]"
              >
                <template v-slot:label>
                  {{ $t('cpm.projects.riskAssessmentPanel.heatMapStatus') }}
                  <span class="error--text">*</span>
                </template>
                <template v-slot:selection="{ item, parent, selected }">
                  <v-chip
                    v-if="$h.dg(item, 'color')"
                    :color="item.color"
                    dark
                    label
                    :selected="selected"
                    small
                  >
                    <span class="pr-2">
                      {{ item.name }}
                    </span>
                  </v-chip>
                </template>

                <template v-slot:item="{ index, item }">
                  <v-list-tile-content>
                    <v-chip
                      :color="$h.dg(item, 'color')"
                      dark
                      label
                      small
                    >
                      {{ item.name }}
                    </v-chip>
                  </v-list-tile-content>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="risk.purpose"
                auto-grow
                clearable
                :label="$t('cpm.projects.riskAssessmentPanel.purpose')"
                rows="3"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="risk.comment"
                auto-grow
                clearable
                :label="$t('cpm.projects.riskAssessmentPanel.comment')"
                rows="3"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="formattedDate"
                disabled
                :label="$t('general.date')"
                readonly
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          @click="closeDialog"
          v-text="$t('general.cancel')"
        />
        <v-btn
          color="primary"
          @click="save"
        >
          {{ actionButton }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <m6-loading
      :loading="loading"
    />
  </v-dialog>
</template>

<script>
import { db } from '@/utils/Firebase'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'ProjectRiskForm',

  props: {
    riskToEdit: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      loading: false,
      risk: {},
      projectId: '',
      rules: {
        required: value => !!value || this.$t('rules.required')
      }
    }
  },

  computed: {
    ...mapGetters('companies/cpmProjects/settings', {
      covidRiskStatus: 'getCovidRiskStatus'
    }),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    actionButton() {
      if (this.$h.dg(this.risk, 'id')) {
        return this.$t('general.update')
      } else {
        return this.$t('general.create')
      }
    },
    formattedDate() {
      if (this.$h.dg(this.risk, 'date')) {
        return this.$moment(this.risk.date).format('YYYY-MM-DD')
      } else {
        return this.$t('general.noDate')
      }
    }
  },

  created() {
    this.projectId = this.$h.dg(this.$route, 'params.id', '')
  },
  mounted() {
    if (this.riskToEdit) {
      this.risk = { ...this.riskToEdit }
    }

    if (!this.covidRiskStatus.length) {
      this.fetchCovidRiskStatus()
    }

    if (!this.$h.dg(this.risk, 'id')) {
      this.$set(this.risk, 'date', this.getCurrentDate())
    }
  },

  methods: {
    ...mapActions('companies/cpmProjects/settings', {
      fetchCovidRiskStatus: 'fetchCovidRiskStatus'
    }),
    ...mapActions('companies/cpmProjects/riskAsssessment', {
      create: 'create',
      update: 'update'
    }),
    async save() {
      if (!this.$refs.form.validate()) {
        this.$snotify.warning(this.$t('alerts.fillRequiredFields'))
        return
      }

      this.loading = true

      this.risk.status = this.getStatusReference(this.$h.dg(this.risk, 'status.id'))
      const postData = {
        projectId: this.projectId,
        risk: this.risk
      }

      try {
        if (this.$h.dg(this.risk, 'id')) {
          postData.risk.date = this.getCurrentDate()
          await this.update({ ...postData })
        } else {
          await this.create({ ...postData })
        }

        this.$snotify.success(this.$t('alerts.successfullySaved'))
        this.loading = false
        this.closeDialog()
      } catch (error) {
        console.error(error)
        this.loading = false
        this.$snotify.error(this.$t('alerts.unexpectedError'))
      }
    },
    getStatusReference(statusID) {
      if (!statusID) return ''

      return db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('covidRiskStatus')
        .doc(statusID)
    },
    getCurrentDate() {
      const date = new Date()

      return date.getTime()
    },
    closeDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>

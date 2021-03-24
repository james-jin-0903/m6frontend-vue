<template>
  <v-dialog
    v-model="createDialog"
    max-width="600px"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ status === 'create' ? 'Create New Structure' : 'Edit Structure' }}</span>
      </v-card-title>
      <v-card-text>
        <v-container class="rounded-lg">
          <v-row v-if="status === 'create'">
            <v-col cols="12">
              <v-text-field
                v-model="title"
                label="Structure Title"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="description"
                label="Structure Description"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="weight"
                label="Structure Weight"
                required
                type="number"
              />
            </v-col>
          </v-row>
          <v-row v-if="status === 'edit'">
            <v-col cols="12">
              <v-text-field
                v-model="selectedVocabulary.title"
                label="Structure Title"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="selectedVocabulary.description"
                label="Structure Description"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="selectedVocabulary.weight"
                label="Structure Weight"
                required
                type="number"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="saveVocabulary"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
    <m6-loading :loading="loading" />
  </v-dialog>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'TaxonomyVocabularyDialog',
  props: {
    createDialog: {
      type: Boolean,
      default: false
    },
    selectedVocabulary: {
      type: Object,
      default: () => {}
    },
    status: {
      type: String,
      default: 'create'
    }
  },
  data: () => ({
    title: '',
    description: '',
    weight: '',
    loading: false
  }),
  methods: {
    ...mapActions('Taxonomy', {
      createVocabulary: 'createVocabulary',
      initVocabulary: 'setTaxonomyVocabularies',
      editVocabulary: 'editVocabulary'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    saveVocabulary() {
      this.loading = true
      const payload = {
        title: this.title,
        description: this.description,
        weight: this.weight
      }
      if (this.status === 'create') {
        this.createVocabulary(payload).then(res => {
          this.loading = false
          if (res.result) {
            this.notifSuccess('Vocabulary created!')
            this.initVocabulary()
          } else {
            this.notifDanger('Error, Can not create vocabulary!')
          }
          this.clearData()
          this.$emit('closeDialog')
        }).catch(e => {
          this.notifDanger('Error, Can not create vocabulary!')
          this.clearData()
          this.$emit('closeDialog')
        })
      } else {
        this.editVocabulary(this.selectedVocabulary).then(res => {
          this.loading = false
          if (res.result) {
            this.notifSuccess('Vocabulary updated!')
            this.initVocabulary()
          } else {
            this.notifDanger('Error, Can not update vocabulary!')
          }
          this.clearData()
          this.$emit('closeDialog')
        }).catch(e => {
          this.notifDanger('Error, Can not update vocabulary!')
          this.clearData()
          this.$emit('closeDialog')
        })
      }
    },
    cancel() {
      this.clearData()
      this.$emit('closeDialog')
    },
    clearData() {
      this.title = ''
      this.description = ''
      this.weight = ''
    }
  }
}
</script>

<style scopped>
</style>

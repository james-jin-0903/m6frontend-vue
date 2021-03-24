<template>
  <div>
    <v-dialog
      v-model="showModal"
      width="500"
    >
      <m6-loading :loading="loading" />
      <template v-slot:activator="{ on, attrs }">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              absolute
              color="primary"
              dark
              fab
              left
              small
              style="top: 175px"
              top
              v-on="on"
              @click="showModal = !showModal"
            >
              <v-icon>mdi-database</v-icon>
            </v-btn>
          </template>
          <span class="help-text__span">Add Marketplace.</span>
        </v-tooltip>
      </template>

      <App-creation-form/>
    </v-dialog>
  </div>
</template>

<script>
import {
  mapGetters,
  mapActions,
  mapMutations,
  mapState
} from 'vuex'

import AppCreationForm from '@/components/Marketplace/components/forms/AppCreation'

export default {
  name: 'AppDepartmentModal',
  components: {AppCreationForm},
  data: () => ({
    showModal: false,
    loading: false,
    taxonomy: null,
    selectedTerm: null,
    terms: []
  }),
  computed: {
    ...mapState('AppBuilder', {
      app: 'app'
    }),
    vocabulary() {
      return this.getVocabulary()
    }
  },
  watch: {
    taxonomy() {
      this.selectedTerm = null
      this.initializeTerms()
    }
  },
  async mounted() {
    this.loading = true
    await this.initVocabulary()
    this.loading = false
  },
  methods: {
    ...mapGetters('Taxonomy', {
      getVocabulary: 'getTaxonomyVocabulary'
    }),
    ...mapActions('Taxonomy', {
      initVocabulary: 'setTaxonomyVocabularies',
      fetchTaxonomyTerms: 'fetchTaxonomyTerms'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    ...mapActions('AppBuilder', {
      updateApp: 'updateApp'
    }),
    async saveDepartment() {
      try {
        if (!this.selectedTerm) {
          this.notifDanger('Please select department.')
          return
        }
        const metadata = JSON.parse(this.app.metadata)
        metadata.department = this.selectedTerm
        const res = await this.updateApp({
          params: {
            ...this.app,
            metadata
          }
        })
        this.loading = false
        this.showModal = false
        this.notifSuccess('Department saved!')
      } catch (e) {
        this.notifDanger('There was an error.')
        this.loading = false
        this.showModal = false
      }
    },
    initializeTerms() {
      if (!this.taxonomy) return
      this.loading = true
      this.fetchTaxonomyTerms(this.taxonomy).then(res => {
        this.terms = this.generateTreeItems(res)
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.notifDanger('Can not fetch terms.')
      })
    },
    generateTreeItems(result) {
      return result.filter(row => row.parent_id === null).map(row => ({
        id: row.id,
        label: row.title,
        children: this.getChildren(row.id, result)
      }))
    },
    getChildren(termId, result) {
      const childrenTerms = result.filter(row => row.parent_id === termId)
      if (childrenTerms.length === 0) {
        return
      } else {
        return childrenTerms.map(row => ({
          id: row.id,
          label: row.title,
          children: this.getChildren(row.id, result)
        }))
      }
    },
    removeDepartment(index) {
      this.selectedTerm.splice(index, 1)
    }
  }
}
</script>

<style scopped>
.vue-treeselect .vue-treeselect__control {
  border: none;
  border-bottom: 1px solid;
  border-radius: 0;
  border-color: #949494;
}

.help-text__span {
  background-color: #1976d2;
  color: white;
  border-radius: 8px;
  padding: 5px 10px;
}
</style>

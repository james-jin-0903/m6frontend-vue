<template>
  <v-card>
    <v-card-title class="d-flex justify-center">
      <div class="blue--text pa-1 subtitle-2">
        Terms |
      </div>
      <v-spacer />
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-treeview
            v-model="tree"
            expand-icon="mdi-chevron-down"
            indeterminate-icon="mdi-bookmark-minus"
            :items="terms"
            off-icon="mdi-bookmark-outline"
            on-icon="mdi-bookmark"
            open-on-click
            return-object
            selectable
            selected-color="indigo"
          >
            <template v-slot:label="{ item }">
              <template v-if="item.nodeId === 0">
                <label class="float-left">
                  {{ item.name }}
                </label>
                <v-icon
                  class="float-right"
                  color="primary"
                  @click="currentTermId = item.nodeId"
                >
                  mdi-plus-circle
                </v-icon>
              </template>
              <template v-else>
                <label class="float-left">
                  {{ item.name }}
                </label>
                <v-icon
                  class="float-right"
                  @click.stop="onDeleteBtn(item)"
                >
                  mdi-delete
                </v-icon>
                <v-icon
                  class="float-right"
                  color="primary"
                  @click.stop="currentTermId = item.nodeId"
                >
                  mdi-plus-circle
                </v-icon>

                <v-icon
                  class="float-right"
                  color="green"
                  @click.stop="editTerm(item)"
                >
                  mdi-pencil
                </v-icon>
              </template>
            </template>
          </v-treeview>
        </v-col>
        <v-col cols="6">
          <template v-if="currentTermId !== null">
            <v-text-field
              v-model="newTerm.title"
              label="Term Title"
            />
            <v-text-field
              v-model="newTerm.code"
              label="Term Number/Code"
            />
            <v-textarea
              v-model="newTerm.description"
              label="Term Description"
            />
            <v-text-field
              v-model="newTerm.weight"
              label="Term Weight"
              type="number"
            />
            <v-spacer />
            <v-btn
              color="blue darken-1"
              text
              @click="currentTermId = null"
            >
              Cancel
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="saveTerm"
            >
              Save
            </v-btn>
          </template>
          <template v-else>
            Select term.
          </template>
        </v-col>
      </v-row>
    </v-card-text>
    <m6-loading :loading="loading" />
    <v-dialog
      v-model="deleteDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">Are you sure?</span>
        </v-card-title>
        <v-card-text>
          <v-container class="rounded-lg">
            Delete term.
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="confirmDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'TaxonomyTerms',
  data: () => ({
    loading: false,
    terms: [],
    tree: [],
    newTerm: {
      title: '',
      description: '',
      parent_id: null,
      vocabulary_id: null,
      weight: null
    },
    currentTermId: null,
    deleteDialog: false,
    deletingTermId: null
  }),
  watch: {
    currentTermId() {
      if (this.currentTermId === null) {
        this.newTerm = {
          title: '',
          description: '',
          parent_id: null,
          vocabulary_id: null,
          weight: null
        }
      }
    }
  },
  mounted() {
    this.initializeTerms()
  },
  methods: {
    ...mapGetters('Taxonomy', {
      getCurrentVocabularyId: 'getCurrentVocabularyId',
      getAllVocabularies: 'getTaxonomyVocabulary',
      getAllTerms: 'getTaxonomyTerms'
    }),
    ...mapActions('Taxonomy', {
      createTerm: 'createTerm',
      initTerms: 'setTaxonomyTerms',
      deleteTerm: 'deleteTerm'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    editTerm(term) {
      this.currentTermId = term.id
      this.newTerm = term
    },
    initializeTerms() {
      const vocabularies = this.getAllVocabularies()
      const currentVocabulary = vocabularies.find(row => row.id === this.getCurrentVocabularyId())
      const tempTerm = [{ nodeId: 0, name: currentVocabulary.title }]
      this.initTerms().then(res => {
        tempTerm[0]['children'] = this.generateTreeItems(res)
        this.terms = tempTerm
      }).catch(e => {
        this.notifDanger('Can not fetch terms.')
      })
    },
    confirmDelete() {
      this.deleteDialog = false
      this.loading = true
      if (this.deletingTermId) {
        this.deleteTerm(this.deletingTermId).then(res => {
          if (res.result) {
            this.notifSuccess('Deleted term.')
            this.initializeTerms()
          } else {
            this.notifDanger('Error, can not delete term.')
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
          this.notifDanger('Error, can not delete term.')
        })
      }
    },
    saveTerm() {
      this.loading = true
      if (!this.$h.dg(this.newTerm, 'id', false)) {
        const payload = {
          title: this.newTerm.title,
          description: this.newTerm.description,
          weight: this.newTerm.weight,
          parent_id: this.currentTermId === 0 ? null : this.currentTermId,
          vocabulary_id: this.getCurrentVocabularyId()
        }
        this.createTerm(payload).then(res => {
          if (res.result) {
            this.currentTermId = null
            this.notifSuccess('Created term.')
            this.initializeTerms()
          } else {
            this.notifDanger('Error, can not create.')
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
          this.notifDanger('Error, can not create.')
        })
      } else {
        this.$store.dispatch('Taxonomy/updateTerm', this.newTerm).then(response => {
          if (response.result) {
            this.currentTermId = null
            this.notifSuccess('Term updated.')
            this.initializeTerms()
          } else {
            this.notifDanger('Error, can not update.')
          }
        }).catch(() => {
          this.notifDanger('Error, can not update.')
        }).finally(() => {
          this.loading = false
        })
      }
    },
    generateTreeItems(result) {
      return result.filter(row => row.parent_id === null).map(row => ({
        ...row,
        nodeId: row.id,
        name: row.title,
        children: this.getChildren(row.id, result)
      }))
    },
    getChildren(termId, result) {
      const childrenTerms = result.filter(row => row.parent_id === termId)
      if (childrenTerms.length === 0) {
        return
      } else {
        return childrenTerms.map(row => ({
          ...row,
          nodeId: row.id,
          name: row.title,
          children: this.getChildren(row.id, result)
        }))
      }
    },
    onDeleteBtn(item) {
      this.deletingTermId = item.nodeId
      this.deleteDialog = true
    }
  }
}
</script>

<style scoped>
.float-left {
  float: left;
}
.float-right {
  float: right;
}
</style>

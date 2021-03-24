<template>
  <v-card
    class="transparent"
    flat
  >
    <v-card-title class="d-flex justify-center pa-0">
      <h1
        class="font-weight-bold mb-2 text-h6 text-left w-full"
        :class="[!darkMode ? 'black--text' : 'white--text']"
      >
        Company Organization
      </h1>
      <div class="absolute right-0 top-0">
        <v-btn
          color="primary"
          @click="newVocabularyDialog"
        >
          Add Structure
        </v-btn>
      </div>
    </v-card-title>
    <v-divider class="grey my-2 w-full" />
    <v-card-text class="px-0">
      <v-data-table
        :dark="darkMode"
        :headers="headers"
        :items="vocabulary"
        :items-per-page="5"
      >
        <template v-slot:body="props">
          <template v-if="props.items.length === 0">
            <tr>
              <td
                class="no-data-td"
                colspan="2"
              >
                No available data.
              </td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="(row, index) in props.items"
              :key="index"
            >
              <td
                class="vocabulary-td"
                @click="clickedVocabulary(row)"
              >
                {{ row.title }}
              </td>
              <td class="vocabulary-td">
                <v-btn
                  color="blue"
                  dark
                  icon
                  small
                  @click="editVocabulary(row.id)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  color="red"
                  icon
                  @click="deleteV(row.id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </template>
      </v-data-table>
    </v-card-text>
    <v-divider class="grey my-2 w-full" />
    <m6-loading :loading="loading" />
    <taxonomy-vocabulary-dialog
      :create-dialog="createDialog"
      :selected-vocabulary="editingVocabulary"
      :status="editOrCreate"
      @closeDialog="createDialog = false"
    />
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
            Delete vocabulary.
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
            @click="confirmDeleteV"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import TaxonomyVocabularyDialog from './TaxonomyVocabularyDialog'
import {
  mapGetters,
  mapState,
  mapActions,
  mapMutations
} from 'vuex'

export default {
  name: 'TaxonomyVocabulary',
  components: {
    TaxonomyVocabularyDialog
  },
  data: () => ({
    headers: [
      { text: 'Structure Title', value: 'title' },
      { text: 'Actions', value: 'actions' }
    ],
    loading: true,
    createDialog: false,
    editOrCreate: 'create',
    editingVocabulary: {},
    deleteDialog: false,
    deleteItemId: null
  }),
  computed: {
    vocabulary() {
      return this.getVocabulary()
    },
    ...mapState('PageControl', {
      darkMode: 'darkModeGlobal'
    })
  },
  async mounted() {
    await this.initVocabulary()
    this.loading = false
  },
  methods: {
    ...mapGetters('Taxonomy', {
      getVocabulary: 'getTaxonomyVocabulary'
    }),
    ...mapActions('Taxonomy', {
      initVocabulary: 'setTaxonomyVocabularies',
      deleteVocabulary: 'deleteVocabulary',
      setSelectedVocabularyId: 'setCurrentVocabularyId'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    ...mapMutations('UserSettingsControl', {
      pickingComponent: 'setSecondColumnComponent'
    }),
    newVocabularyDialog() {
      this.editOrCreate = 'create'
      this.createDialog = true
    },
    clickedVocabulary(item) {
      this.setSelectedVocabularyId(item.id)
      this.pickingComponent({
        name: 'taxonomy-terms'
      })
    },
    deleteV(id) {
      this.deleteItemId = id
      this.deleteDialog = true
    },
    confirmDeleteV() {
      this.loading = true
      this.deleteVocabulary(this.deleteItemId).then(res => {
        if (res.result) {
          this.initVocabulary()
          this.notifSuccess('Deleted vocabulary.')
        } else {
          this.notifDanger('Error, can not delete vocabulary.')
        }
        this.loading = false
        this.deleteDialog = false
      }).catch(e => {
        this.notifDanger('Error, can not delete vocabulary.')
        this.loading = false
        this.deleteDialog = false
      })
    },
    editVocabulary(id) {
      this.editingVocabulary = this.vocabulary.find(row => row.id === id)
      this.editOrCreate = 'edit'
      this.createDialog = true
    }
  }
}
</script>

<style scoped>
.vocabulary-td {
  text-align: left;
  padding-left: 15px;
  height: 40px;
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
}
.no-data-td {
  height: 100px;
  text-align: center;
}
</style>

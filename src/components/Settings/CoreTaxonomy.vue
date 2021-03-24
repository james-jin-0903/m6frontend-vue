<template>
  <v-container class="ma-0 pa-0">
    <v-card
      class="transparent"
      flat
    >
      <v-card-title class="d-flex pa-0">
        <h1
          class="font-weight-bold mb-2 text-h6 text-left w-full"
          :class="[!darkMode ? 'black--text' : 'white--text']"
        >
          Core Taxonomy
        </h1>
      </v-card-title>
      <v-divider class="grey my-2 w-full" />
      <div class="d-flex justify-end">
        <v-btn
          color="green"
          dark
          icon
          rounded
          @click="openModal(false)"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
      <v-data-table
        :dark="darkMode"
        :headers="headers"
        :items="taxonomies"
      >
        <template v-slot:item.actions="{item}">
          <v-btn
            icon
            @click="openTaxonomy(item.id)"
          >
            <v-icon>mdi-clipboard-list</v-icon>
          </v-btn>
          <v-btn
            color="blue"
            icon
            @click="openModal(item.id)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            color="red"
            icon
            @click.stop="deleteTerm(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <v-divider class="grey my-2 w-full" />
    </v-card>

    <v-card
      v-if="selectedTaxonomy"
      class="mt-5"
    >
      <v-treeview
        v-model="tree"
        expand-icon="mdi-chevron-down"
        :items="taxonomyTerms"
        open-on-click
        return-object
      >
        <template v-slot:label="{ item }">
          <label class="float-left">
            {{ item.name }} - {{ item.code }}
          </label>
          <v-icon
            class="float-right"
            color="green"
            @click.stop="openModal(false, item)"
          >
            mdi-plus-circle
          </v-icon>
          <v-icon
            class="float-right"
            color="primary"
            @click.stop="openModal(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            class="float-right"
            color="red"
            @click.stop="deleteTerm(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-treeview>
    </v-card>

    <!-- Create/Edit Modal-->
    <default-m6-modal
      v-if="showCreateModal"
      @close="close"
    >
      <template slot="title">
        {{ !edit ? 'Create New' : 'Edit' }} Taxonomy
      </template>
      <template slot="content">
        <v-form ref="taxonomyForm">
          <v-text-field
            v-model="taxonomy.name"
            label="Taxonomy Name"
          />
          <v-textarea
            v-model="taxonomy.value"
            label="Taxonomy Description"
          />
          <v-autocomplete
            v-if="!taxonomy.parentId"
            v-model="taxonomy.type"
            :items="types"
            label="Taxonomy Type"
          />
          <v-text-field
            v-model="taxonomy.code"
            label="Taxonomy Code"
          />
        </v-form>
      </template>
      <template slot="actions">
        <v-spacer />
        <v-btn
          color="red"
          outlined
          text
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="green"
          outlined
          text
          @click="save"
        >
          Save
        </v-btn>
      </template>
    </default-m6-modal>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CoreTaxonomy',
  data() {
    return {
      types: [
        {
          text: 'Company Type',
          value: 'companyType'
        },
        {
          text: 'NAIC Code',
          value: 'naic'
        },
        {
          text: 'Region',
          value: 'region'
        },
        {
          text: 'UNSPC',
          value: 'unspc'
        },
        {
          text: 'Marketplace Categories',
          value: 'marketCategories'
        }
      ],
      taxonomy: {},
      taxonomies: [],
      taxonomyTerms: [],
      headers: [
        {
          text: 'Taxonomy',
          value: 'name'
        },
        {
          text: 'Code',
          value: 'code'
        },
        {
          text: 'Description',
          value: 'value'
        },
        {
          text: 'Type',
          value: 'type'
        },
        {
          text: 'Actions',
          value: 'actions',
          align: 'right'
        }
      ],
      showCreateModal: false,
      edit: false,
      tree: [],
      selectedTaxonomy: false,
      creatingChild: false,
      term: {},
      currentEdit: {}
    }
  },
  computed: {
    ...mapState('PageControl', {
      darkMode: 'darkModeGlobal'
    })
  },
  created() {
    this.fetchTaxonomies()
  },
  methods: {
    async fetchTaxonomies() {
      this.taxonomies = await this.$store.dispatch('CoreTaxonomy/fetchTerms')
    },
    openModal(id, item = false) {
      this.edit = false
      this.creatingChild = false
      if (!id) {
        this.taxonomy = {}
        if (item) {
          this.term = item
          this.creatingChild = true
          this.taxonomy.parentId = item.id
          this.taxonomy.type = item.type
        }
      } else {
        const taxonomy = this.taxonomies.find(i => i.id === id)
        if (taxonomy) {
          this.taxonomy = { ...taxonomy }
          this.currentEdit = id
        } else {
          // In this case the id is the full object
          this.taxonomy = { ...id }
          this.currentEdit = id
        }
        this.edit = true
      }

      this.showCreateModal = true
    },
    openTaxonomy(id) {
      this.selectedTaxonomy = id
      this.fetchTaxonomyTerms()
    },
    async save() {
      if (this.taxonomy.id) {
        const updateItem = await this.$store.dispatch('CoreTaxonomy/updateTerm', this.taxonomy)
        this.currentEdit.code = updateItem.setting.code
        this.currentEdit.value = updateItem.setting.value
      } else {
        const newItem = await this.$store.dispatch('CoreTaxonomy/createTerm', this.taxonomy)

        if (Array.isArray(this.term.children)) {
          this.term.children.push(newItem.setting)
        } else {
          this.$set(this.term, 'children', [newItem.setting])
        }
      }
      this.close()
    },
    async deleteTerm({ id }) {
      await this.$store.dispatch('CoreTaxonomy/deleteTerm', { id })
      await this.fetchTaxonomyTerms()
      await this.fetchTaxonomies()
    },
    async close() {
      await this.fetchTaxonomies()
      this.term = {}
      this.taxonomy = {}
      this.showCreateModal = false
    },
    async fetchTaxonomyTerms() {
      this.taxonomyTerms = await this.$store.dispatch('CoreTaxonomy/fetchTaxonomyTerms', {
        parentId: this.selectedTaxonomy
      })
    }
  }

}
</script>

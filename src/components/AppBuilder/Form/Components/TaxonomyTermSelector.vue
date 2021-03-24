<template>
  <div class="w-full">
    <span>Select term</span>
    <v-treeview
      expand-icon="mdi-chevron-down"
      indeterminate-icon="mdi-bookmark-minus"
      item-key="nodeId"
      :items="terms"
      off-icon="mdi-bookmark-outline"
      on-icon="mdi-bookmark"
      open-on-click
      return-object
    >
      <template v-slot:label="{ item }">
        <label class="float-left">
          {{ item.name }}
        </label>
        <v-icon
          class="float-right"
          :color="selectedTermId === item.nodeId ? 'primary' : ''"
          @click="selectedTerm(item)"
        >
          mdi-check-circle
        </v-icon>
      </template>
    </v-treeview>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TaxonomyTermSelector',
  props: {
    metadata: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    terms: [],
    selectedTermId: null,
    selectedTermName: ''
  }),
  watch: {
    selectedTermId() {
      if (this.selectedTermId) {
        this.$emit('changetaxonomy', this.selectedTermId, this.selectedTermName)
      }
    }
  },
  mounted() {
    axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/taxonomy/terms/${this.metadata.vocabulary}`).then(({ data }) => {
      this.terms = this.generateTreeItems(data)
    }).catch(e => this.notifDanger('Can not fetch terms.'))
  },
  methods: {
    generateTreeItems(result) {
      return result.filter(row => row.parent_id === null).map(row => ({
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
          nodeId: row.id,
          name: row.title,
          children: this.getChildren(row.id, result)
        }))
      }
    },
    selectedTerm(item) {
      this.selectedTermId = item.nodeId
      this.selectedTermName = item.name
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

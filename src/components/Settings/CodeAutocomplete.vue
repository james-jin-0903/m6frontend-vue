<template>
  <div>
    <v-autocomplete
      v-if="items.length"
      v-model="selected"
      clearable
      item-text="name"
      item-value="id"
      :items="items"
      return-object
      @change="save"
    />
    <template v-if="selected">
      <code-autocomplete
        :level="level + 1"
        :parent-id="selected.id"
        :type="type"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CodeAutocomplete from './CodeAutocomplete'
export default {
  name: 'CodeAutocomplete',
  components: {
    CodeAutocomplete
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    parentId: {
      type: Number,
      default: null
    },
    level: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      items: [],
      selected: false,
      codes: []
    }
  },
  computed: {
    ...mapGetters('Companies', {
      currentCompany: 'getCurrentCompany',
      auxiliarCodes: 'getAuxiliarCodes'
    })
  },
  async created() {
    this.items = await this.$store.dispatch('CoreTaxonomy/listTaxonomyTerms', {
      type: this.type,
      parentId: this.parentId
    })
  },
  methods: {
    save(item) {
      const payload = [...this.auxiliarCodes]
      if (item !== undefined) {
        payload[this.level] = item.id
      } else {
        payload.length = this.level
      }
      this.$store.dispatch('Companies/saveAuxliarCodes', payload)
    },
    pushCodes(item) {
      this.codes.push(item)
    },
    returnCodeValue() {
      this.$emit('returnCodeValue', this.codes)
    }
  }
}
</script>

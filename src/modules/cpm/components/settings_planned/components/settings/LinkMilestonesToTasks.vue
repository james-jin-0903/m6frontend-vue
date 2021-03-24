<template>
  <div class="linkMilestonesToLink">
    <h3>Link to tasks</h3>
    <treeselect
      v-model="values"
      clearable
      :default-expand-level="1"
      :flat="true"
      :multiple="true"
      :options="list"
      placeholder="Link to Tasks"
      value-format="object"
      @input="updateValue"
    />
  </div>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState, mapGetters } from 'vuex'

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'LinkMilestonesToTasks',
  components: {
    Treeselect
  },
  props: {
    options: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      values: [],
      list: []
    }
  },
  methods: {
    getList() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.scheduleCollection)
        .get()
        .then(settings => {
          const data = settings.data()
          const list = data.tasks ? data.tasks : []
          this.list = list.map(row => ({
            id: row.name.toLowerCase(),
            label: row.name,
            level: 1,
            children: row.cat_1.map(cat1 => ({
              id: row.name.toLowerCase() + '-' + cat1.name.toLowerCase(),
              label: cat1.name,
              level: 2,
              parent: row.name
            }))
          }))
        })
    },
    updateValue() {
      this.$emit('updateLinks', this.values)
    }
  },
  computed: {
    ...mapGetters(['appLabel']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  watch: {
    options(value) {
      this.values = value
    }
  },
  mounted() {
    this.values = this.options
    this.getList()
  }
}
</script>

<style lang="scss">
  .linkMilestonesToLink {
    .vue-treeselect__multi-value-item-container {
      padding-top: 0;
    }
  }
</style>

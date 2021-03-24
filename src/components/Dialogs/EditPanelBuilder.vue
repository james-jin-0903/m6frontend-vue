<template>
  <v-card
    class="pa-7"
    rounded
  >
    <v-card-title>
      {{ panel['title'] }}
    </v-card-title>
    <v-card-text>
      <form-show-generator
        :action-record="true"
        :fields="panel['fields']"
        :panel="panel"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import FormShowGenerator from '@/components/AppBuilder/Form/FormShowGenerator.vue'
import { mapMutations } from 'vuex'

export default {
  name: 'EditPanelBuilder',
  components: {
    FormShowGenerator
  },
  props: {
    record: {
      type: Object,
      default: () => {}
    },
    panel: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.setCurrentRecord(this.record)
  },
  methods: {
    ...mapMutations('RecordsInstance', {
      setCurrentRecord: 'setCurrentRecord'
    })
  }
}
</script>

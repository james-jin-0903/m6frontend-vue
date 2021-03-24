<template>
  <v-card>
    <v-card-title class="blue ctm-mb-16 headline">
      <span class="white--text">{{ title }}</span>
    </v-card-title>
    <v-card-text class="overflow-auto record-text">
      <v-autocomplete
        v-model="tab"
        auto-select-first
        item-text="tab"
        item-value="id"
        :items="items"
        label="Select App"
      />
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="(item, index) in items"
          :key="index"
          class="ctm-v-item"
        >
          <component
            :is="item.component"
            :app="item.app"
            @closeModal="closeModal"
            @closingGenericRecord="closingGenericRecord"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script>
import ItAppForm from '@/components/Home/Forms/ItAppForm'
import GenericRecord from '@/components/Home/Forms/GenericRecord'
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'AddRecordDialog',
  components: {
    ItAppForm,
    GenericRecord
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    tab: 0,
    items: [
      {
        tab: 'ItApp',
        component: ItAppForm,
        id: 0
      }
    ]
  }),
  async mounted() {
    try {
      const res = await this.getAppList()
      for (let x = 0; x < res.length; x++) {
        this.items.push({
          isGeneric: true,
          tab: res[x].title,
          component: 'GenericRecord',
          app: res[x],
          id: x + 1
        })
      }
    } catch (e) {
      return
    }
  },

  methods: {
    ...mapActions('AppBuilder', {
      getAppList: 'getAppList'
    }),

    ...mapMutations('RecordsInstance', {
      setCurrentRecord: 'setCurrentRecord',
      setDisplayShow: 'setDisplayAppBuilderShow'
    }),

    closeModal() {
      this.$emit('closeModal')
    },
    closingGenericRecord() {
      this.closeModal()
    }
  }
}
</script>

<style scoped>

.v_card__title.ctm-mb-16 {
  margin-bottom: 16px !important;
}

</style>

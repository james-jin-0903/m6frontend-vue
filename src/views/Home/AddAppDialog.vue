<template>
  <div>
    <div
      v-if="!showInput"
      class="pointer"
      @click="showInput = !showInput"
    >
      <slot name="btn" />
    </div>
    <v-dialog
      v-model="showInput"
      max-width="500"
    >
      <v-card>
        <v-card-title class="blue ctm-mb-16 headline">
          <span class="white--text">{{ title }}</span>
        </v-card-title>
        <v-card-text class="overflow-visible record-text">
          <dynamic-app-form
            @closeModal="closeModal"
            @closingGenericRecord="closingGenericRecord"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DynamicAppForm from '@/components/Home/Forms/DynamicAppForm'
import ItAppForm from '@/components/Home/Forms/ItAppForm'
import { validations } from '@/mixins/form-validations'

export default {
  name: 'AddAppDialog',
  components: {
    DynamicAppForm
  },
  mixins: [validations],
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    tab: null,
    showInput: false,
    items: [
      { tab: 'ItApp', component: ItAppForm },
      { tab: 'Dynamic App', component: DynamicAppForm }
    ],
    itemInfo: {}
  }),
  computed: {},
  methods: {
    closeModal() {
      this.showInput = false
    },
    closingGenericRecord() {
      this.closeModal()
    }
  }
}
</script>

<style scoped>
.disabled {
  pointer-events: none;
  color: #b6b6b6;
  cursor: not-allowed;
  background-image: none;
}

.v-card__title.ctm-mb-16 {
    margin-bottom: 16px !important;
}
</style>

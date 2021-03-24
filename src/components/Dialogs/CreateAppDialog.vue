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
        <v-card-title class="headline">
          New App
        </v-card-title>
        <v-card-text class="record-text vertical-scroll">
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
  name: 'CreateAppDialog',
  components: {
    DynamicAppForm
  },
  mixins: [validations],
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
</style>

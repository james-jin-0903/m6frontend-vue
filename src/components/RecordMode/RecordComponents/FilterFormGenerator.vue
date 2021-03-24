<template>
  <div>
    <v-container
      class="rounded-lg"
      fluid
    >
      <v-row>
        <v-col
          v-for="(f, index) in fields"
          :key="`field-${index}`"
          cols="6"
        >
          <div
            v-if="f.type === 'referenced'"
            class="custom-flex-stepper-items"
          >
            <component
              :is=" $h.dg( typeToComponentMapping[f.metadata.originalReference.type], 'component', '')"
              v-model="recordSearch[`${f.id}`]"
              :chips="$h.dg(typeToComponentMapping[f.metadata.originalReference.type], 'chips', false)"
              :clearable="$h.dg( typeToComponentMapping[f.metadata.originalReference.type], 'clearable', false )"
              :items="$h.dg( f, 'metadata.originalReference.metadata.options', [] )"
              :label="$h.dg( f, 'label', '' )"
              :metadata="f.metadata"
              :multiple="$h.dg(typeToComponentMapping[f.metadata.originalReference.type], 'multiple', false)"
              outlined
              :rules=" $h.dg( f, 'metadata.required', false) ? formRules.standard : []"
              :type=" $h.dg( typeToComponentMapping[f.metadata.originalReference.type], 'type', '' ) "
            />
          </div>
          <div
            v-else
            class="custom-flex-stepper-items"
          >
            <component
              :is=" $h.dg( typeToComponentMapping[f.type], 'component', '')"
              v-model="recordSearch[`${f.id}`]"
              :chips="$h.dg(typeToComponentMapping[f.type], 'chips', false)"
              :clearable="$h.dg( typeToComponentMapping[f.type], 'clearable', false )"
              :items="$h.dg( f, 'metadata.options', [] )"
              :label="$h.dg( f, 'label', '' )"
              :metadata="f.metadata"
              :multiple="$h.dg(typeToComponentMapping[f.type], 'multiple', false)"
              outlined
              :rules=" $h.dg( f, 'metadata.required', false) ? formRules.standard : []"
              :type=" $h.dg( typeToComponentMapping[f.type], 'type', '' ) "
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { VTextField, VAutocomplete } from 'vuetify/lib'
import DatePicker from '@/components/AppBuilder/Form/Components/DatePicker.vue'
import RadioBtnOptions from '@/components/AppBuilder/Form/Components/RadioBtnOptions.vue'
import AppAttachment from '@/components/AppBuilder/Form/Components/Attachment.vue'
import PeopleAutocomplete from '@/components/AppBuilder/Form/Components/PeopleAutocomplete.vue'
import TextField from '@/components/AppBuilder/Form/Components/TextField.vue'
import GMap from '@/components/_partials/GMap'
import { mapState, mapMutations } from 'vuex'

export default {

  components: {
    VTextField,
    DatePicker,
    AppAttachment,
    VAutocomplete,
    RadioBtnOptions,
    PeopleAutocomplete,
    TextField,
    GMap
  },
  props: {
    fields: {
      type: Array,
      default: () => ([])
    }
  },

  data: () => ({
    recordSearch: {},
    typeToComponentMapping: {
      'timestamp': { component: 'date-picker' },
      'text': { component: 'v-text-field' },
      'attachment': { component: 'app-attachment' },
      'boolean': { component: 'radio-btn-options' },
      'number': {
        component: 'v-text-field',
        type: 'number'
      },
      'autocomplete': {
        component: 'v-autocomplete',
        multiple: true,
        chips: true,
        clearable: true
      },
      'people': {
        component: 'people-autocomplete',
        multiple: true,
        chips: true,
        clearable: true
      },
      'referencedToApp': { component: 'v-text-field' },
      'referenced': { component: 'v-text-field' },
      'autocomplete-address': {
        component: 'g-map'
      }
    }
  }),

  methods: {
    ...mapMutations('Filtering', {
      saveRecordSearchModel: 'saveRecordSearchModel',
      getRecordSearchModal: 'getRecordSearchModal'
    })
  },

  watch: {
    recordSearch(val) {
      this.saveRecordSearchModel(val)
      this.$emit('sendData', val)
    },
    recordSearchModel(val) {
      if (!val) this.recordSearch = {}

      this.recordSearch = { ...val }
    }
  },

  computed: {
    ...mapState('Filtering', {
      recordSearchModel: 'recordSearchModel'
    })
  },

  mounted() {
    this.getRecordSearchModal()
  }

}
</script>

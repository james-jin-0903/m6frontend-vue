<template>
  <v-container>
    <v-card>
      <v-card-title>
        NAIC Codes
        <v-btn
          absolute
          color="green"
          icon
          right
          @click="openModal('naic')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-chip
          v-for="chip in naicCodes"
          :key="chip.id"
          class="mx-2"
          close
          @click:close="deleteTag(chip.id,naicCodes)"
        >
          {{ $h.dg(chip, 'globalSetting.code', '') }} - {{ $h.dg(chip, 'globalSetting.name' , '') }}
        </v-chip>
      </v-card-text>
    </v-card>

    <v-card class="my-3">
      <v-card-title>
        UNSPC Codes
        <v-btn
          absolute
          color="green"
          icon
          right
          @click="openModal('unspc')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-chip
          v-for="chip in unspcCodes"
          :key="chip.id"
          class="mx-2"
          close
          @click:close="deleteTag(chip.id,unspcCodes)"
        >
          {{ $h.dg(chip, 'globalSetting.code', '') }} - {{ $h.dg(chip, 'globalSetting.name' , '') }}
        </v-chip>
      </v-card-text>
    </v-card>

    <v-card class="my-3">
      <v-card-title>
        Region
        <v-btn
          absolute
          color="green"
          icon
          right
          @click="openModal('region')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-chip
          v-for="chip in regionCodes"
          :key="chip.id"
          class="mx-2"
          close
          @click:close="deleteTag(chip.id,regionCodes)"
        >
          {{ $h.dg(chip, 'globalSetting.code', '') }} - {{ $h.dg(chip, 'globalSetting.name' , '') }}
        </v-chip>
      </v-card-text>
    </v-card>

    <v-card class="my-3">
      <v-card-title>
        Company Types
        <v-btn
          absolute
          color="green"
          icon
          right
          @click="openModal('companyType')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-chip
          v-for="chip in companyTypesCodes"
          :key="chip.id"
          class="mx-2"
          close
          @click:close="deleteTag(chip.id,companyTypesCodes)"
        >
          {{ $h.dg(chip, 'globalSetting.code', '') }} - {{ $h.dg(chip, 'globalSetting.name' , '') }}
        </v-chip>
      </v-card-text>
    </v-card>

    <default-m6-modal
      v-if="addModal"
      @close="close"
    >
      <template slot="title">
        Add New Code
      </template>
      <template slot="content">
        <code-autocomplete
          v-model="codes"
          :level="0"
          :type="type"
        />
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
          @click="saveCodes"
        >
          Save
        </v-btn>
      </template>
    </default-m6-modal>
  </v-container>
</template>


<script>
import CodeAutocomplete from './CodeAutocomplete'
import { mapGetters } from 'vuex'
export default {
  name: 'CompanyCodes',
  components: {
    CodeAutocomplete
  },
  data() {
    return {
      addModal: false,
      levels: 1,
      type: 'naic',
      codes: [],
      naicCodes: [],
      unspcCodes: [],
      regionCodes: [],
      companyTypesCodes: []
    }
  },
  computed: {
    ...mapGetters('Companies', {
      currentCompany: 'getCurrentCompany',
      auxiliarCodes: 'getAuxiliarCodes'
    })
  },
  mounted() {
    this.fetchNaicCodes()
    this.fetchUNSPCCodes()
    this.fetchRegionCodes()
    this.fetchCompanyTypeCodes()
  },
  methods: {
    async fetchNaicCodes() {
      const payload = {
        companyId: this.currentCompany.result.id,
        type: 'naic'
      }
      this.naicCodes = await this.$store.dispatch('Companies/getCodes', payload)
    },
    async fetchUNSPCCodes() {
      const payload = {
        companyId: this.currentCompany.result.id,
        type: 'unspc'
      }
      this.unspcCodes = await this.$store.dispatch('Companies/getCodes', payload)
    },
    async fetchRegionCodes() {
      const payload = {
        companyId: this.currentCompany.result.id,
        type: 'region'
      }
      this.regionCodes = await this.$store.dispatch('Companies/getCodes', payload)
    },
    async fetchCompanyTypeCodes() {
      const payload = {
        companyId: this.currentCompany.result.id,
        type: 'companyType'
      }
      this.companyTypesCodes = await this.$store.dispatch('Companies/getCodes', payload)
    },
    async saveCodes() {
      await Promise.all(this.auxiliarCodes.map(async item => {
        const payload = {
          companyId: this.currentCompany.result.id,
          settingId: item,
          type: this.type
        }
        await this.$store.dispatch('Companies/saveCode', payload)
        this.$store.dispatch('Companies/saveAuxliarCodes', [])
      }))
      this.close()
    },
    async openModal(type) {
      this.type = type
      this.addModal = true
    },
    async deleteTag(id, list) {
      try {
        await this.$store.dispatch('Companies/deleteCode', { id })
        const index = list.map(i => i.id).indexOf(id)
        list.splice(index, 1)
      } catch (e) {
        console.log(e)
      }
    },
    close() {
      this.addModal = false
      if (this.type === 'naic') {
        this.fetchNaicCodes()
      }
      if (this.type === 'unspc') {
        this.fetchUNSPCCodes()
      }
      if (this.type === 'region') {
        this.fetchRegionCodes()
      }
      if (this.type === 'companyType') {
        this.fetchCompanyTypeCodes()
      }
    }
  }
}
</script>

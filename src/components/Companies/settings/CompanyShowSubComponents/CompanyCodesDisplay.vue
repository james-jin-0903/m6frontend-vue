<template>
  <div>
    <v-container class="pa-0 rounded-lg">
      <v-tabs vertical>
        <v-tab>
          Unspc
        </v-tab>
        <v-tab>
          Regions
        </v-tab>
        <v-tab>
          Naics
        </v-tab>
        <v-tab>
          Company Types
        </v-tab>

        <v-tab-item class="text-right">
          <v-btn
            color="green"
            dark
            fab
            x-small
            @click="( addingNewCode( enumForCodes.unspsc ) )"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <div
            v-for="( u, index ) in $h.dg(currentCompany, 'unspcs', [])"
            :key="`unspsc-${index}`"
          >
            <v-chip
              v-for="( item, i ) in JSON.parse(u)"
              :key="`u-item-${i}`"
              color="blue darken-2"
              @click=" addingNewCode( enumForCodes.unspsc, u, i ) "
            >
              <span class="white--text">{{ item.value.name }}</span>
            </v-chip>
          </div>
        </v-tab-item>

        <v-tab-item class="text-right">
          <v-btn
            color="green"
            dark
            fab
            x-small
            @click="( addingNewCode( enumForCodes.regions ) )"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <div
            v-for="( r, index ) in $h.dg(currentCompany, 'regions', [])"
            :key="`regions-${index}`"
          >
            <v-chip
              v-for="( item, i ) in JSON.parse(r)"
              :key="`r-item-${i}`"
              color="blue darken-2"
              @click=" addingNewCode( enumForCodes.regions, r, i ) "
            >
              <span class="white--text">{{ item.value.name }}</span>
            </v-chip>
          </div>
        </v-tab-item>


        <v-tab-item class="text-right">
          <v-btn
            color="green"
            dark
            fab
            x-small
            @click="( addingNewCode( enumForCodes.naics ) )"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <div
            v-for="( n, index ) in $h.dg(currentCompany, 'naics', [])"
            :key="`naics-${index}`"
          >
            <v-chip
              v-for="( item, i ) in JSON.parse(n)"
              :key="`n-item-${i}`"
              color="blue darken-2"
              @click=" addingNewCode( enumForCodes.naics, n, i ) "
            >
              <span class="white--text">{{ item.value.name }}</span>
            </v-chip>
          </div>
        </v-tab-item>


        <v-tab-item class="text-right">
          <v-btn
            color="green"
            dark
            fab
            x-small
            @click="( addingNewCode( enumForCodes.companyTypes ) )"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <div
            v-for="( t, index ) in $h.dg(currentCompany, 'types', [])"
            :key="`types-${index}`"
          >
            <v-chip
              v-for="( item, i ) in JSON.parse(t)"
              :key="`t-item-${i}`"
              color="blue darken-2"
              @click=" addingNewCode( enumForCodes.companyTypes, t, i ) "
            >
              <span class="white--text">{{ item.value.name }}</span>
            </v-chip>
          </div>
        </v-tab-item>
      </v-tabs>
    </v-container>

    <company-codes-c-u
      :code-cat="codeCat"
      :codes-to-edit="codesToEdit"
      :dialog="dialogShow"
      :enum-for-codes="enumForCodes"
      :index-to-edit="indexToEdit"
      @close="closing"
    />
  </div>
</template>

<script>

import CompanyCodesCU from './CompanyCodesCU'
import { mapState } from 'vuex'
// eslint-disable-next-line vue/require-name-property
export default {
  name: 'CompanyCodesDisplay',
  components: {
    CompanyCodesCU
  },

  data: () => ({
    enumForCodes: {
      unspsc: { name: 'Unspc', pathInCompany: 'unspcs' },
      regions: { name: 'regions', pathInCompany: 'regions' },
      naics: { name: 'Naics', pathInCompany: 'naics' },
      companyTypes: { name: 'companyTypes', pathInCompany: 'types' }
    },
    items: {
      unspsc: [],
      regions: [],
      naics: [],
      companyTypes: []
    },
    loading: false,
    dialogShow: false,
    codesToEdit: [],
    indexToEdit: -1,
    codeCat: {}
  }),

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },

  mounted() {
    this.getItems()
  },

  methods: {
    closing() {
      this.getItems()
      this.dialogShow = false
      this.codesToEdit = [{ value: {}, id: '0', index: 0 }]
      this.indexToEdit = -1
      this.codeCat = {}
    },
    async getItems() {
      this.loading = true
      this.items = {
        unspsc: [],
        regions: [],
        naics: [],
        companyTypes: []
      }
      const res = await this.$store.dispatch('Companies/getDataCodes')
      res.forEach(codeGroups => {
        switch (codeGroups.type) {
          case 'code-unspcs':
            this.items['unspsc'].push(codeGroups.childs)
            break
          case 'code-regions':
            this.items['regions'].push(codeGroups.childs)
            break
          case 'code-naics':
            this.items['naics'].push(codeGroups.childs)
            break
          case 'code-types':
            this.items['companyTypes'].push(codeGroups.childs)
            break
        }
      })
      this.loading = false
    },
    addingNewCode(code, items = null, index = null) {
      if (items && index >= 0) {
        this.codesToEdit = items
        this.indexToEdit = index
      }

      this.codeCat = code

      this.$nextTick(() => {
        this.dialogShow = true
      })
    }
  }

}
</script>

<style lang="scss" scoped>
</style>

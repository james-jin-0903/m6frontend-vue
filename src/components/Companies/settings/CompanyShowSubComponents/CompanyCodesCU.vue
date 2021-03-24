<template>
  <div>
    <v-dialog
      v-model="dialog"
      persistent
      :width=" $vuetify.breakpoint.xs ? '95vw' : '70vw' "
    >
      <v-card>
        <v-card-title class="blue darken-2 headline mb-2 white--text">
          {{ indexToEdit > -1 ? 'Edit' : 'Add' }} a {{ codeCat.name }} Code
        </v-card-title>
        <v-card-text class="card-text-custom">
          <v-autocomplete
            v-for="(l, i) in levels"
            :key="`level-${i}`"
            v-model="l.value"
            item-text="name"
            item-value="name"
            :items="getItems(l.id)"
            :label="`${
              $h.dg(codeCat, 'name', '').charAt(0).toUpperCase() +
              $h.dg(codeCat, 'name', '').slice(1)
            } Codes`"
            return-object
            @input=" e => generateMoreLevels(e, i) "
          />
          <!-- :items="getSpecificUNSPC(l.id)" -->
          <m6-loading :loading="loading" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            dark
            text
            @click="closing"
          >
            close
          </v-btn>
          <v-btn
            color="green"
            dark
            @click="saveCode"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations
} from 'vuex'

export default {
  name: 'CompanyCodesCU',
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    indexToEdit: {
      type: Number,
      default: -1
    },
    codesToEdit: {
      type: Array,
      default: () => []
    },
    codeCat: {
      type: Object,
      default: () => {}
    },
    enumForCodes: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    loading: false,
    items: [],
    levels: [
      { value: {}, id: '0', index: 0 }
    ]
  }),

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    ...mapState('M6Codes', {
      unspcItems: 'unspc',
      companyTypesItems: 'companyTypes',
      regionsItems: 'regions',
      naicsTypes: 'naics'
    }),
    getSpecificUNSPC() {
      return id => this.unspcItems[id]
    },
    getItems() {
      return id => {
        const pathInCompany = this.$h.dg(this.codeCat, 'pathInCompany', '')

        switch (true) {
          case this.$h.dg(this.enumForCodes, 'unspsc.pathInCompany', 'none') === pathInCompany:
            return this.unspcItems[id] || []
          case this.$h.dg(this.enumForCodes, 'regions.pathInCompany', 'none') === pathInCompany:
            return this.regionsItems[id] || []
          case this.$h.dg(this.enumForCodes, 'naics.pathInCompany', 'none') === pathInCompany:
            return this.naicsTypes[id] || []
          case this.$h.dg(this.enumForCodes, 'companyTypes.pathInCompany', 'none') === pathInCompany:
            return this.companyTypesItems[id] || []
        }
      }
    }
  },

  watch: {
    async codesToEdit(val) {
      if (!val.length) return

      this.levels = [{ value: {}, id: '0', index: 0 }]

      try {
        const newVal = val.map((v, ind) => new Object({
          id: ind === 0 ? '0' : JSON.parse(val[ind - 1].value)['id'],
          parentId: !v.parentId ? v.id : v.parentId,
          value: {
            id: JSON.parse(v.value)['id'],
            name: JSON.parse(v.value)['value']
          },
          index: ind
        }))

        this.levels = newVal

        this.loading = true

        const pathInCompany = this.$h.dg(this.codeCat, 'pathInCompany', '')
        const ids = newVal.map(v => v.id)

        switch (true) {
          case this.$h.dg(this.enumForCodes, 'unspsc.pathInCompany', 'none') === pathInCompany:
            await this.getUnspcCodesByIds(ids)
            break
          case this.$h.dg(this.enumForCodes, 'regions.pathInCompany', 'none') === pathInCompany:
            await this.getRegionsByIds(ids)
            break
          case this.$h.dg(this.enumForCodes, 'naics.pathInCompany') === pathInCompany:
            await this.getNaicsByIds(ids)
            break
          case this.$h.dg(this.enumForCodes, 'companyTypes.pathInCompany') === pathInCompany:
            await this.getCompanyTypesByIds(ids)
            break
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async dialog() {
      const pathInCompany = this.$h.dg(this.codeCat, 'pathInCompany', '')
      this.loading = true

      try {
        switch (true) {
          case this.$h.dg(this.enumForCodes, 'unspsc.pathInCompany', 'none') === pathInCompany:
            await this.getUnspcCodes()
            break
          case this.$h.dg(this.enumForCodes, 'regions.pathInCompany', 'none') === pathInCompany:
            await this.getRegions()
            break
          case this.$h.dg(this.enumForCodes, 'naics.pathInCompany') === pathInCompany:
            await this.getNaics()
            break
          case this.$h.dg(this.enumForCodes, 'companyTypes.pathInCompany') === pathInCompany:
            await this.getCompanyTypes()
            break
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    }
  },

  methods: {
    ...mapActions('M6Codes', {
      getUnspcCodes: 'getUnspcCodes',
      getUnspcCodesByIds: 'getUnspcCodesByIds',

      getCompanyTypes: 'getCompanyTypes',
      getCompanyTypesByIds: 'getCompanyTypesByIds',

      getRegions: 'getRegions',
      getRegionsByIds: 'getRegionsByIds',

      getNaics: 'getNaics',
      getNaicsByIds: 'getNaicsByIds'
    }),
    ...mapActions('Companies', {
      updateCompany: 'updateCompany',
      postCodes: 'postCodesData',
      updateCodes: 'updateCodesData'
    }),
    ...mapMutations('Companies', {
      setCurrentCompany: 'setCurrentCompany'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),

    async generateMoreLevels({ id }, index) {
      this.loading = true

      try {
        const pathInCompany = this.$h.dg(this.codeCat, 'pathInCompany', '')

        let res = {}
        switch (true) {
          case this.$h.dg(this.enumForCodes, 'unspsc.pathInCompany', 'none') === pathInCompany:
            res = await this.getUnspcCodes(id)
            break
          case this.$h.dg(this.enumForCodes, 'regions.pathInCompany', 'none') === pathInCompany:
            res = await this.getRegions(id)
            break
          case this.$h.dg(this.enumForCodes, 'naics.pathInCompany') === pathInCompany:
            res = await this.getNaics(id)
            break
          case this.$h.dg(this.enumForCodes, 'companyTypes.pathInCompany') === pathInCompany:
            res = await this.getCompanyTypes(id)
            break
        }

        this.loading = false

        this.levels = this.levels.filter(l => l.index <= index)
        index++
        if (res.length) this.levels.push({ value: { }, id, index })
      } catch (err) {
        this.loading = false
      }
    },

    findItems(id) {
      return this.unspcItems[id]
    },

    saveCode() {
      const currentCompany = { ...this.currentCompany }

      const response = this.levels.map((v, ind) => new Object({
        type: ind === 0 ? 'father' : 'child',
        parentId: v.parentId,
        name: `code-${this.codeCat.pathInCompany}`,
        value: JSON.stringify({
          id: v['value']['id'],
          value: v['value']['name']
        })
      }))

      if (this.indexToEdit > -1) {
        this.updateCodes({
          codes: response
        }).then(() => {
          this.loading = false
          this.$nextTick(() => {
            this.closing()
          })
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.postCodes({
          companyId: currentCompany.result.id,
          data: response
        }).then(() => {
          this.loading = false
          this.$nextTick(() => {
            this.closing()
          })
        }).catch(() => {
          this.loading = false
        })
      }

      this.loading = true
    },

    closing() {
      this.levels = [{ value: {}, id: '0', index: 0 }]
      this.$nextTick(() => {
        this.$emit('close')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-text-custom {
    height: 50vh;
    overflow-y: auto;
}
</style>

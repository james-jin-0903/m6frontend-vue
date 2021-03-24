<template>
  <div class="align-end d-flex flex-column justify-end text-center">
    <v-dialog
      v-model="dialog"
      content-class="filter-dialog-wrapper"
      persistent
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-show="showFilterBtn"
          v-bind="attrs"
          class="filter mx-3 white--text"
          color="primary"
          fab
          small
          v-on="on"
        >
          <v-icon>mdi-filter</v-icon>
        </v-btn>
        <div class="filter flex-row-chips pointer">
          <v-chip
            v-for="(field, index) in fieldsLffilter-forist"
            :key="`field-item-${index}`"
            class="filter-chip ma-2"
            close
            color="blue"
            @click:close="removeField(field)"
          >
            <span class="white--text">{{ field.label }}</span>
          </v-chip>
        </div>
      </template>

      <v-card>
        <v-card-title class="blue darken-1 headline white--text">
          Filter by
        </v-card-title>

        <v-card-text>
          <v-autocomplete
            v-model="fieldsList"
            chips
            item-text="label"
            item-val="id"
            :items="filterByList"
            label="Filter by"
            multiple
            return-object
          />
          <!-- <filter-form-generator
            :fields="fieldsList"
            @sendData=" e => filteringData = e "
          /> -->
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            text
            @click="dialog = false"
          >
            close
          </v-btn>
          <v-btn
            class="white--text"
            color="green"
            @click="setFilter"
          >
            Set Filter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <m6-loading :loading="loading" />
  </div>
</template>


<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import FilterFormGenerator from '@/components/RecordMode/RecordComponents/FilterFormGenerator'
export default {
  components: {
    FilterFormGenerator
  },
  props: {
    showFilterBtn: {
      type: Boolean,
      default: false
    },
    currentAppID: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      dialog: false,
      currentAppFields: [],
      fieldsList: [],
      filteringData: {},
      loading: false,
      filterByList: [{
        label: 'Application'
      }, {
        label: 'Files'
      }
      ]
    }
  },

  methods: {
    ...mapActions('AppBuilder', {
      getAppFields: 'getAppFields'
    }),

    ...mapActions('Filtering', {
      filterRecordsByFields: 'filterRecordsByFields'
    }),

    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),

    ...mapMutations('Filtering', {
      saveFilterSettings: 'saveFilterSettings',
      saveRecordSearchModel: 'saveRecordSearchModel'
    }),

    removeField(field) {
      this.fieldsList = this.fieldsList.filter(f => f.id !== field.id)
      const filteringData = { ...this.filteringData }
      delete filteringData[field.id]
      this.filteringData = { ...filteringData }
      this.saveFilterSettings(this.filteringData)

      this.setFilter()
    },

    setFilter() {
      try {
        // if( this.lodash.isEmpty(this.filteringData)) {
        //   // this.saveRecordSearchModel({})
        //   this.$emit('clearFilter')
        //   this.dialog = false
        //   return
        // }

        this.loading = true
        // const res = await this.filterRecordsByFields({
        //   appId: this.currentAppID,
        //   filterData: this.filteringData,
        //   fieldsList: this.fieldsList
        // })
        // this.$emit('recordsToShow', { ids: res.data,fieldsList: this.fieldsList })

        this.$emit('recordsToShow', { filterList: this.fieldsList })

        this.loading = false
        this.dialog = false
      } catch (e) {
        this.notifDanger('There was an error while filtering the data')
        this.loading = false
      }
    }

  },

  computed: {
    ...mapState('Filtering', {
      filterSettings: 'filterSettings'
    })
  },

  watch: {
    async currentAppID(val) {
      if (!val) return
      try {
        this.currentAppFields = await this.getAppFields(val)
        if (this.$h.dg(this.filterSettings, 'currentAppID', -1) != val) this.fieldsList = []
      } catch (e) {
        this.notifDanger('There was an error while loading app fields')
      }
    },
    filterSettings: {
      handler: function (val) {
        const list = this.$h.dg(val, 'idsAndFieldsList.fieldsList', [])
        this.fieldsList = [...list]
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.filter {
  // float: right;
  // margin-top: -30px;
  // margin-right: 10px;
}
.filter-dialog-wrapper{
  min-width: 45vw;
  max-width: 80%;
  width: 350px;
}
</style>

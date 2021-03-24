<template>
  <v-tabs
    v-model="currentChoice"
    active-class="blue--text"
    centered
    slider-color="blue"
  >
    <v-tab
      v-for="(choice) in choices"
      :key="choice.text"
      @click="pickingView(choice)"
    >
      <v-icon>{{ choice.icon }}</v-icon> {{ choice.text }}
    </v-tab>
  </v-tabs>
</template>


<script>

export default {
  name: 'GeneralListDropDown',
  props: {
    currentApp: {
      type: Object,
      default: () => ({})
    },
    color: {
      type: String,
      default: 'white'
    }
  },
  data: () => ({
    currentAppFields: [],
    currentChoice: 3,
    choicesBase: [
      {
        icon: 'mdi-table',
        text: 'App Feed View',
        key: 'app_feed'
      },
      {
        icon: 'mdi-table',
        text: 'Table View',
        key: 'table'
      },
      {
        icon: 'mdi-arrange-bring-forward',
        text: 'Apps View',
        key: 'card'
      },
      {
        icon: 'mdi-text-box-outline',
        text: 'Files View',
        key: 'files'
      }
    ],
    fieldsList: []
  }),
  computed: {
    choices() {
      const choices = [...this.choicesBase]
      if (this.$h.dg(this.currentApp, 'prefix', '') === 'RAP') {
        choices.push({
          icon: 'mdi-view-parallel',
          text: 'Kanban View',
          key: 'kanban'
        })
      }

      return choices
    }
  },
  watch: {
    async currentAppID(val) {
      if (!val) return
      try {
        this.currentAppFields = await this.getAppFields(val)
        if (this.$h.dg(this.filterSettings, 'currentAppID', -1) !== val) this.fieldsList = []
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
  },
  methods: {
    pickingView(choice) {
      this.$emit('input', choice)
    }
  }
}
</script>

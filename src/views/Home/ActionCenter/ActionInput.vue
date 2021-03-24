<template>
  <!--
  <div>
    <v-autocomplete
      v-model="people.invite"
      chips
      item-value="id"
      :items="companyUsers"
      label="Invite"
      multiple
    />
    <v-autocomplete
      v-model="taskText"
      class="ma-0 search-input w-full"
      dense
      filled
      hide-details
      :items="inputFields"
      label="What you whant to do?"
      rounded
      @keyup.enter="keyclick"
    />
  </div>
  -->
  <v-card
    color="grey darken-1"
    dark
  >
    <v-card-text>
      <v-autocomplete
        v-model="model"
        clearable
        color="white"
        hide-no-data
        hide-selected
        item-text="value"
        item-value="value"
        :items="inputFields"
        :loading="isLoading"
        placeholder="What you whant to do?"
        prepend-icon="mdi-database-search"
        return-object
        :search-input.sync="search"
      />
    </v-card-text>
    <v-divider />
    <v-expand-transition>
      <v-list
        v-if="model"
        class="light-blue lighten-1"
      >
        <v-list-item
          v-for="(field, i) in fields"
          :key="i"
        >
          <v-list-item-content>
            <v-list-item-title v-text="field.value" />
            <v-list-item-subtitle v-text="field.key" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: 'ActionInput',
  data: () => ({
    taskText: '',
    inputFields: [
      {
        type: 'actionCenter',
        value: 'task'
      },
      {
        type: 'actionCenter',
        value: 'meeting'
      },
      {
        type: 'actionCenter',
        value: 'appointment'
      }
    ],
    groups: {},

    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    model: null,
    search: null
  }),
  computed: {
    fields() {
      if (!this.model) return []

      return Object.keys(this.model).map(key => ({
        key,
        value: this.model[key] || 'n/a'
      }))
    }
  },

  watch: {
    search() {
      // Items have already been loaded
      if (this.items.length > 0) return

      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

      // Lazily load input items
      fetch('https://api.publicapis.org/entries')
        .then(res => res.json())
        .then(res => {
          const { count, entries } = res
          this.count = count
          this.entries = entries
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    }
  },

  methods: {
    keyclick() {
      console.log(this.taskText)

      const regex = /((?<task>[\w]+)\s+(?<text>([\w\s]+)))/
      this.groups = this.taskText.match(regex).groups

      console.log(this.groups.task)
      console.log(this.groups.text)
    }
  }
}
</script>

<style>

</style>

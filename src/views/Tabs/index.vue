<template>
  <v-card class="rounded-lg">
    <button @click="asd">
      asdasd
    </button>
    <v-tabs
      v-model="tab"
      background-color="#2D2D2D"
      dark
    >
      <v-tab
        v-for="item in get_tabs()"
        :key="item.tab"
      >
        {{ item.tab }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="item in get_tabs()"
        :key="item.tab"
      >
        <component :is="item.content" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Tabs',
  data: () => ({
    tab: null
  }),
  computed: {
    ...mapGetters(['get_tabs'])
  },
  methods: {
    asd() {
      console.log(this.tab)
    }
  }
}
</script>

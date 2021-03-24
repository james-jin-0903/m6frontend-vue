<template>
  <v-menu
    v-model="menu"
    absolute
    offset-y
    style="max-width: 600px"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        class="green lighten-2 ml-6 pa-0 white--text"
        icon
        v-on="on"
      >
        <v-icon size="23">
          mdi-plus
        </v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item v-if="layoutType.toUpperCase() == 'PROFILE'">
        <v-list-item-title>
          <v-btn text @click="addNewTab(false, 4)">
            4 Columns
          </v-btn>
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="layoutType.toUpperCase() == 'PROFILE'">
        <v-list-item-title>
          <v-btn text @click="addNewTab(false, 3)">
            3 Columns
          </v-btn>
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="layoutType.toUpperCase() == 'PROFILE'">
        <v-list-item-title>
          <v-btn text @click="addNewTab(false, 2)">
            2 Columns
          </v-btn>
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <v-btn text @click="addNewTab(true, 1)" >
            Full Width
          </v-btn>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'AddTab',
  props: {
    layoutType: {
      type: String,
      required: true,
      default: 'Profile'
    }
  },
  data: () => ({
    menu: false
  }),
  methods: {
    addNewTab(tabNumOption, columns) {// false is two panels, true is one full width
      this.$emit('addNewTab', {tabNumOption, columns})
    }
  }
}
</script>

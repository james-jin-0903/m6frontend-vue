<template>
  <v-sheet class="relative h-viewport">
    <div class="pl-14">
      <v-row no-gutters class="pa-3">
        <v-spacer></v-spacer>
        <v-icon @click="change_preview_navigation_drawer(false)">mdi-close</v-icon>
      </v-row>
      <slot></slot>
    </div>

    <v-navigation-drawer v-model="drawer" absolute class="no-scroll" expand-on-hover>
      <v-list dense>
        <!-- <v-list-item
          link
          @click="asd()"
        >
          <v-list-item-content>
            <v-list-item-title>asdasd</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
        <v-list-item
          v-for="(item, index) in get_views_list()"
          :key="index"
          link
          @click="set_status_bootom_template(true)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.iconName }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-sheet>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data () {
      return {
        drawer: true,
        mini: true,
      }
    },
    computed: {
      // get_views_list has a list of objects with name, iconName, route
      ...mapGetters(["get_views_list"]),
    },
    methods: {
      ...mapActions(["set_status_bootom_template"])
    }
  }
</script>

<style scoped lang="scss">
.no-scroll {
  overflow-x: hidden !important;

  ::-webkit-scrollbar {
    -webkit-appearance: none !important;
    width: 0px !important;
  }
}
</style>
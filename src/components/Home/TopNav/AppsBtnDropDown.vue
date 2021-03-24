<template>
  <div class="text-center">
    <v-menu
      bottom
      open-on-hover
      :nudge-width="200"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-icon
          color="white"
          :large="true"
          v-on="on"
        >
          mdi-{{ icon }}
        </v-icon>
      </template>

      <v-list>
        <v-list-item
          v-for="(link, index) in links"
          :key="index"
        >
          <v-list-item-title>
            <router-link
              class="router-link"
              :to="{ name: link.routeName }"
            >
              {{ link.name }}
            </router-link>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'AppsBtnDropDown',
  props: {
    icon: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    links: [
      { name: 'Capital Projects', routeName: 'app.cpm' }
    ]
  })
}
</script>

<style lang="scss" scoped>
.router-link {
    text-decoration: none;
}
</style>

<template>
  <v-menu
    class="card-custom-shadow m6-dropdown"
    right
    transition="scale-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        color="info"
        dark
        small
        v-on="on"
      >
        <v-icon
          class="mr-2"
          dark
        >
          mdi-arrow-down-bold-circle
        </v-icon>
        Actions
      </v-btn>
    </template>
    <v-list
      class="pa-0"
      dense
    >
      <template v-for="(option, index) in options">
        <v-list-item
          v-if="!option.hide"
          :key="index"
          class="list-item px-0"
        >
          <v-list-item-title @click="emitEvent(option.event)">
            <v-row class="align-center list-item ma-0">
              <v-col class="mx-0 pa-2 pr-0 shrink transparent">
                <v-icon
                  v-if="option.icon"
                  class="mr-0 transparent"
                >
                  {{ option.icon }}
                </v-icon>
              </v-col>
              <v-col class="grow ma-2 px-1 py-0">
                <span class="line-item-text">
                  {{ option.title }}
                </span>
              </v-col>
            </v-row>
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script>

/* HOW TO USE
 *
 * Options: Array[Objects]
 *
 * OPTION ITEMS PROPERTIES:
 * icon(optional): material icon name
 * title: title that will be displayed on the right of the icon
 * event: the event that you wanna catch in the parent and execute your action
 * hide(optional): set true to hide the option
 *
 * Enjoy it :D
*/
export default {
  name: 'M6DropdownActions',
  props: {
    options: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({}),
  methods: {
    emitEvent(eventToEmit) {
      console.log(eventToEmit)
      this.$emit(eventToEmit)
    }
  }
}
</script>

<style lang="scss">
  .list-item {
    cursor: pointer;
    transition: 0s all;
  }
  .list-item:hover {
    background: #24b6ff;
    color: white;
  }
  .list-item:hover line-item-text {
    background: #24b6ff;
    color: white;
  }
  .list-item:hover i {
    background: #24b6ff;
    color: white;
  }
  .list-item:hover .line-item-text{
    color: white !important;
  }
  .v-icon.v-icon {
    background: transparent;
  }
  .m6-dropdown .v-menu__content {
    left: 2000px;
  }
</style>

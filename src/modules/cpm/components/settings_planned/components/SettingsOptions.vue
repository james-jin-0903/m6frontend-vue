<template>
  <v-card
    class="rounded-lg"
    height="100%"
  >
    <v-card-text class="vertical-scroll">
      <v-list>
        <template v-for="(item, index) in options">
          <v-list-item
            :key="index"
            :class="optSelected === item.name ? 'm6_optActive' : ''"
            @click="selectOption(item)"
          >
            <v-list-item-content>
              <v-list-item-title
                class="text--white"
                v-html="item.name"
              />
            </v-list-item-content>
          </v-list-item>
          <v-divider :key="'divider' + index" />
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    options: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      optSelected: ''
    }
  },
  mounted() {
    this.options.sort()
  },
  methods: {
    selectOption(item) {
      this.optSelected = item.name
      this.$emit('updateOption', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.m6_optActive {
  color: #fff;
  background: #0277bd;
}
</style>

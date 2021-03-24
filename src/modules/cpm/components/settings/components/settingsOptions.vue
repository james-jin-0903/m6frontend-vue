<template>
  <v-card
    class="card-custom-shadow"
    height="100%"
  >
    <v-card-text class="vertical-scroll">
      <v-list>
        <template v-for="(item, index) in options">
          <v-list-item
            :key="index"
            :class="optSelected == item.name ? 'm6_optActive' : ''"
            @click="selectOption(item)"
          >
            <v-list-item-content>
              <v-list-item-title :class="{'white--text': optSelected == item.name }">
                {{ item.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
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

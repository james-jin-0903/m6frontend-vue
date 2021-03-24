<template>
  <v-container
    v-if="component.app_type !== 'dynamic_app'"
    class="dont-show-scroll h-full px-0 rounded-lg vertical-scroll w-full"
  >
    <!-- That ID is used to scrolling the component -->
    <component
      :is="item.component"
      v-for="(item, index) of items"
      :id="name+'-'+index"
      :key="index+'-widget'"
      class="w-full"
      :class="index !== 0 ? 'px-2' : 'px-0'"
      :index="item.index >= 0 ? item.index : null"
      :info="component"
    />
    <infinite-loading
      :identifier="NavCommp"
      infinite-scroll-disabled="busy"
      @infinite="infiniteHandler"
    >
      <div slot="no-more" />
    </infinite-loading>
    <div
      v-for="(item, i) of emptyItems"
      :id="name+'-'+(currentIndex+i)"
      :key="i+'-no-container'"
      class="no-container"
    />
  </v-container>
  <v-container
    v-else
    class="dont-show-scroll h-full px-0 rounded-lg vertical-scroll w-full"
  >
    <!-- That ID is used to scrolling the component -->
    <component
      :is="builder"
      class="w-full"
      :class="index !== 0 ? 'px-2' : 'px-0'"
      :index="index >= 0 ? index : null"
      :info="component"
    />
  </v-container>
</template>

<script>

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'PreviewBody',
  props: {
    builder: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: null
    },
    component: {
      type: Object,
      default: () => {}
    },
    sortArray: {
      type: Array,
      default: () => ([])
    },
    // eslint-disable-next-line vue/prop-name-casing
    NavCommp: {
      type: Array,
      default: () => ([])
    },
    name: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    items: [],
    emptyItems: [],
    currentIndex: 0,
    busy: false
  }),
  watch: {
    NavCommp: function () {
      this.emptyItems = []
      this.NavCommp.forEach(item => this.emptyItems.push(item))
      this.currentIndex = 0
      this.items = []
    },
    sortArray: function () {
      if (this.currentIndex < this.NavCommp.length) {
        this.items.push(this.sortArray[this.currentIndex])
        this.emptyItems.shift()
        this.refactorWidgets()
        this.currentIndex++
      }
    }
  },
  methods: {
    // Functionality on the infinite scroll
    infiniteHandler($state) {
      this.busy = true
      setTimeout(() => {
        if (this.currentIndex < this.NavCommp.length) {
          this.items.push(this.sortArray[this.currentIndex])
          this.emptyItems.shift()
          this.refactorWidgets()
          this.currentIndex++
          $state.loaded()
        } else {
          $state.complete()
        }
        this.busy = false
      }, 100)
    },
    // On change in the widgets index
    refactorWidgets() {
      this.$emit('items', this.items.length)
    }
  }
}
</script>

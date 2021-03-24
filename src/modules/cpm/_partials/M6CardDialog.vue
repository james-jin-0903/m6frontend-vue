<template>
  <component
    :is="rootComponent"
    class="card-custom-shadow m6-card-dialog mb-2 rounded w-full white"
    :class="{ 'ma-0': !dialog }"
    column
    fill-height
    fullscreen
    name="row"
    :value="dialog"
    @keydown.27="dialog = false"
  >
    <v-toolbar
      class="font-weight-medium rounded-t step3"
      :color="'white'"
      dark
      elevation="0"
      :height="50"
      @dblclick="doubleClick"
    >
      <v-icon
        v-show="dialog"
        class="grey--text pointer text--darken-1"
        @click="dialog = false"
      >
        mdi-close
      </v-icon>

      <v-tooltip
        v-if="titleTooltip && !dialog"
        right
      >
        <template v-slot:activator="{ on }">
          <span
            class="subheading"
            v-on="on"
          >
            {{ title }}
          </span>
        </template>

        <span class="grey lighten-3 pa-1 rounded">{{ titleTooltip }}</span>
      </v-tooltip>

      <v-container
        v-else-if="dialog && searchField"
        class="rounded-lg"
      >
        <v-row style="max-width: 300px">
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="searchFieldValue"
              clearable
              dense
              label="Search"
              light
              style="padding: 20px 5px 5px;"
              @click:clear="$emit('search', searchFieldValue)"
              @keyup="$emit('search', searchFieldValue)"
            />
          </v-col>

          <v-col
            cols="12"
            sm="6"
          >
            <v-select
              v-if="filterColumnList.length > 0"
              v-model="filterColumnValue"
              dense
              item-text="text"
              item-value="value"
              :items="filterColumnList"
              label="Filter"
              light
              style="padding: 16px 5px 5px;"
              @change="$emit('filterColumnChange', filterColumnValue)"
            />
          </v-col>
        </v-row>
      </v-container>

      <span
        v-else
        class="mb-0 subheading"
      >
        {{ title }}
      </span>

      <v-spacer />

      <slot name="after:title" />
    </v-toolbar>
    <v-divider class="grey lighten-3" />

    <v-card
      elevation="0"
      :style="{
        height: cardHeight
      }"
    >
      <v-card-text
        :class="`vertical-scroll card-container ${cardTextClass}`"
        :style="{
          height: contentHeight,
          'min-height': minHeight,
          'max-height': maxHeight,
          overflow: 'auto'
        }"
      >
        <slot />
      </v-card-text>
    </v-card>
  </component>
</template>

<script>
export default {
  name: 'M6CardDialog',
  props: {
    cardTextClass: {
      type: String,
      default: ''
    },

    cardHeight: {
      type: String,
      default: '100%'
    },

    contentHeight: {
      type: String,
      default: 'auto'
    },

    expandable: {
      type: Boolean,
      default: true
    },

    maxHeight: {
      type: String,
      default: '98vh'
    },

    minHeight: {
      type: String,
      default: '200px'
    },

    titleTooltip: {
      type: [Number, String],
      default: ''
    },

    title: {
      type: String,
      default: ''
    },

    toolbarColor: {
      type: String,
      default: '#4caf50'
    },

    toolbarHeight: {
      type: [Number, String],
      default: '28px'
    },
    searchField: {
      type: Boolean,
      default: false
    },
    filterColumnList: {
      type: Array,
      default: () => []
    },
    openSearchPanel: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    filterColumnValue: 'all',
    searchFieldValue: '',
    dialog: false
  }),
  computed: {
    rootComponent() {
      return 'div'
    }
  },
  watch: {
    dialog() {
      this.$emit('fullscreen', this.dialog)
    },
    openSearchPanel(newVal, oldVal) {
      if (newVal == true) {
        this.dialog = true
      } else {
        this.searchFieldValue = ''
      }
    }
  },
  methods: {
    doubleClick() {
      if (this.expandable) {
        this.dialog = !this.dialog
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m6-card-dialog {
  .card-container {
    padding: 17px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .v-toolbar {
    transform: none !important;
  }
}
.subheading {
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
</style>

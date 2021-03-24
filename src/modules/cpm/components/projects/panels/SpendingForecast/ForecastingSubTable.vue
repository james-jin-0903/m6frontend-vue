<template>
  <v-data-table
    :headers="headers"
    hide-default-footer
    item-key="code"
    :items="items"
  >
    <template
      v-slot:headers="headerProps"
    />

    <template
      v-slot:items="props"
    >
      <tr
        :class="getRowClass"
        @click="props.expanded = !props.expanded"
      >
        <td
          v-if="showPreviewsFY && previousFiscalYearsColspan"
          class="cell-default-width cell-solid-border"
          :colspan="previousFiscalYearsColspan"
        />

        <td
          class="cell-solid-border cell-title-width font-weight-bold subheading"
        >
          <v-row>
            <v-col class="shrink">
              {{ getTitle(props.item) }} <br>
              <span class="caption">
                {{ arrayToString($h.dg(props.item, 'vendors', [])) }}
              </span>
            </v-col>
            <v-col class="text-right">
              <span class="caption">
                {{ props.item.paidDate }}
              </span>
            </v-col>
          </v-row>
        </td>

        <template
          v-for="(month, index) in monthsForForecastTable"
        >
          <td
            :key="'months-sub1' + index + deep"
            class="cell-default-width cell-solid-border"
          />
          <td
            :key="'months-sub2' + index + deep"
            class="cell-default-width cell-solid-border text-right"
          >
            {{ $h.dg(props.item, `months.${month}.amount`, 0) | currency }}
          </td>
          <td
            :key="'months-sub3' + index + deep"
            class="cell-default-width cell-solid-border"
          />
        </template>

        <td
          v-if="showFuturesFY && futureFiscalYearsColspan"
          class="cell-default-width cell-solid-border"
          :colspan="futureFiscalYearsColspan"
        />
      </tr>
    </template>

    <template
      v-if="deep === 0"
      v-slot:expand="props"
    >
      <forecasting-sub-table
        v-bind="$props"
        :deep="1"
        :items="$h.dg(props.item, 'spending', [])"
      />
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'ForecastingSubTable',

  props: {
    items: {
      type: Array,
      default: () => []
    },
    futureFiscalYearsColspan: {
      type: Number,
      default: 0
    },
    minimunColumnNumbers: {
      type: Number,
      default: 0
    },
    monthsForForecastTable: {
      type: Array,
      default: () => []
    },
    previousFiscalYearsColspan: {
      type: Number,
      default: 0
    },
    showFuturesFY: {
      type: Boolean,
      default: false
    },
    showPreviewsFY: {
      type: Boolean,
      default: false
    },
    deep: {
      type: Number,
      default: 0
    },
    headers: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    getRowClass() {
      return this.deep === 0 ?
        'blue lighten-2' :
        'blue lighten-4'
    }
  },

  methods: {
    getTitle(item) {
      if (this.deep === 0) {
        return `${item.name} - ${item.code}`
      } else {
        return `${item.number}`
      }
    },
    arrayToString(array = [], separator = ', ') {
      return array.map(element => element).join(separator)
    }
  }
}
</script>

<style lang="scss" scoped>
  .cell-default-width {
    min-width: 140px !important;
    width: 140px !important;
    max-width: 140px !important
  }

  .cell-title-width {
    min-width: 420px !important;
    width: 420px !important;
    max-width: 420px !important
  }

  .cell-solid-border {
    border: black 1px solid !important;
  }
  ::v-deep .v-table__overflow {
    overflow: hidden !important;
  }
</style>

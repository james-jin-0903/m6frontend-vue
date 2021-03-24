<script>
import { debounce } from 'lodash'

import { getObjectValueByPath } from 'vuetify/lib/util/helpers'

import VDataTable from 'vuetify/lib/components/VDataTable/VDataTable'
import VCheckbox from 'vuetify/lib/components/VCheckbox/VCheckbox'

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (let i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i]
    }
    return arr2
  } else {
    return Array.from(arr)
  }
}

// TODO: implement right columns fixed ;)
export default {
  name: 'M6DataTable',

  extends: VDataTable,

  props: {
    alignActions: {
      type: String,
      default: 'end',
      validator: value => ['start', 'center', 'end'].indexOf(value) !== -1
    }
  },

  data() {
    return {
      actionsClasses: `v-datatable__actions m6-datatable__actions m6-datatable__align-actions-${this.alignActions}`,
      actionsRangeControlsClasses: 'v-datatable__actions__range-controls',
      actionsSelectClasses: 'v-datatable__actions__select',
      actionsPaginationClasses: 'v-datatable__actions__pagination',
      hasMounted: false,
      tFooter: null,
      hasFooter: false,
      headersWidth: {}
    }
  },

  watch: {
    headers() {
      this.setHeadersSize()
    },

    items() {
      this.setHeadersSize()
    }
  },

  mounted() {
    this.hasMounted = true
    this.tFooter = this.$el.querySelector('tfoot tr')
    this.hasFooter = Boolean(this.tFooter)
    this.setHeadersSize()
  },

  methods: {
    setHeadersSize: debounce(function () {
      if (this.hasMounted) {
        const nodes = this.$el.querySelectorAll('thead tr:not(.v-datatable__progress)')
        const row = nodes[nodes.length - 1]

        this.headers.map((item, index) => {
          if (item.fixed) {
            const th = row.children[index]
            this.headersWidth[index] = th.offsetWidth

            if (!th.hasAttribute('column-header')) {
              this.$nextTick(() => this.setColumnHeaderMissedProps(th, index))
            }

            if (this.hasFooter) {
              this.$nextTick(() => this.setColumnHeaderMissedProps(this.tFooter.children[index], index))
            }
          }
        })
      }
    }, 1000),

    setColumnHeaderMissedProps(th, index) {
      th.setAttribute('width', this.headersWidth[index])
      th.style.left = `${this.getFixedColumnLeft(index)}px`
      th.className = th.className + ' fixed-column'

      if (this.headers[index + 1] && !this.headers[index + 1].fixed) {
        th.className = th.className + ' last-fixed-column'
      }
    },

    genTHead() {
      if (this.hideHeaders) return // Exit Early since no headers are needed.

      let children = []
      if (this.$scopedSlots.headers) {
        const row = this.$scopedSlots.headers({
          headers: this.headers,
          indeterminate: this.indeterminate,
          all: this.everyItem
        })
        children = [
          this.hasTag(row, 'th') ? this.genTR(row) : row,
          this.genTProgress()
        ]
      } else {
        const _row = this.headers.map((o, i) => this.genHeader(o, this.headerKey ? o[this.headerKey] : i, i))

        const checkbox = this.$createElement(VCheckbox, {
          props: {
            dark: this.dark,
            light: this.light,
            color: this.selectAll === true ? '' : this.selectAll,
            hideDetails: true,
            inputValue: this.everyItem,
            indeterminate: this.indeterminate
          },
          on: { change: this.toggle }
        })
        this.hasSelectAll && _row.unshift(this.$createElement('th', [
          checkbox
        ]))
        children = [this.genTR(_row), this.genTProgress()]
      }
      return this.$createElement('thead', [children])
    },

    genSelectAllHeader(data = {}) {
      const checkbox = this.$createElement(VCheckbox, {
        props: {
          dark: this.dark,
          light: this.light,
          color: this.selectAll === true ? '' : this.selectAll,
          hideDetails: true,
          inputValue: this.everyItem,
          indeterminate: this.indeterminate
        },
        on: { change: this.toggle }
      })

      return this.$createElement('th', data, [checkbox])
    },

    genHeader(header, key, index) {
      if (this.hasSelectAll && header.fixed === true && index === 0) {
        return this.genSelectAllHeader({
          class: 'fixed-column',
          attrs: { width: this.headersWidth[index] || null },
          style: { left: `${this.getFixedColumnLeft(index)}px` }
        })
      }

      const array = [
        this.$scopedSlots.headerCell
          ? this.$scopedSlots.headerCell({ header })
          : header[this.headerText]
      ]

      return this.$createElement(
        'th',
        ...this.genHeaderData(header, array, key, index)
      )
    },

    genHeaderData(header, children, key, index) {
      const classes = ['column']
      const data = {
        key,
        attrs: {
          role: 'columnheader',
          scope: 'col',
          width: this.headersWidth[index] || null,
          'aria-label': header[this.headerText] || '',
          'aria-sort': 'none',
          'column-header': index
        }
      }

      if (header.sortable == null || header.sortable) {
        this.genHeaderSortingData(header, children, data, classes)
      } else {
        data.attrs['aria-label'] += ': Not sorted.'
      }

      if (header.fixed === true) {
        classes.push('fixed-column')
        if (this.headers[index + 1] && !this.headers[index + 1].fixed) {
          classes.push('last-fixed-column')
        }
        data.style = { left: `${this.getFixedColumnLeft(index)}px` }
      }

      classes.push('text-xs-' + (header.align || 'left'))
      if (Array.isArray(header.class)) {
        classes.push.apply(classes, _toConsumableArray(header.class))
      } else if (header.class) {
        classes.push(header.class)
      }
      data.class = classes
      return [data, children]
    },

    getFixedColumnLeft(index = this.headers.length) {
      let currentValue = 0

      for (let i = 0; i < index; i++) {
        currentValue += this.headers[i].fixed ? parseInt(this.headersWidth[i]) : 0
      }

      return currentValue
    },

    augmentRow(row) {
      const tds =
        row.tag === 'td'
          ? [row]
          : row.tag === 'tr'
            ? row.children
            : this.hasTag(row, 'td')
              ? row
              : row[0].children

      let i = 0
      for (const td of tds) {
        if (
          this.headers[i] &&
          this.headers[i].fixed === true &&
          td.tag === 'td'
        ) {
          td.data = td.data || {}
          td.data.class = `${td.data['class'] || ''} fixed-column`.trim()
          td.data.style = {
            left: `${this.getFixedColumnLeft(i)}px`,
            width: this.headersWidth[i]
          }
          if (this.headers[i + 1] && !this.headers[i + 1].fixed) {
            td.data.class += ' last-fixed-column'
          }
          i++
        }
      }
    },

    genFilteredItems() {
      if (!this.$scopedSlots.items) {
        return null
      }

      const rows = []

      for (
        let index = 0, len = this.filteredItems.length;
        index < len;
        ++index
      ) {
        const item = this.filteredItems[index]
        const props = this.createProps(item, index)
        const row = this.$scopedSlots.items(props)

        this.augmentRow(row)

        rows.push(
          this.hasTag(row, 'td')
            ? this.genTR(row, {
              key: this.itemKey
                ? getObjectValueByPath(props.item, this.itemKey)
                : index,
              attrs: { active: this.isSelected(item) }
            })
            : row
        )
        if (this.$scopedSlots.expand) {
          const expandRow = this.genExpandedRow(props)
          rows.push(expandRow)
        }
      }
      return rows
    }
  }
}
</script>

<style lang="scss" scoped>
.fixed-column {
  position: sticky;
  z-index: 1;
  background-color: white;
}

.m6-datatable__actions {
  &.m6-datatable__align-actions-center {
    justify-content: center !important;
  }

  &.m6-datatable__align-actions-start {
    justify-content: flex-start !important;
  }

  .v-datatable__actions__select {
    width: 175px;
  }
}
</style>

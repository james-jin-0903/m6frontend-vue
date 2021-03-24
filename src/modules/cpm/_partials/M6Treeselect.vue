<script>
import Treeselect from '@riophae/vue-treeselect'

export default {
  name: 'M6Treeselect',

  extends: Treeselect,

  props: {
    label: {
      type: [Number, String],
      required: false
    },

    valueConsistsOf: {
      type: String,
      default: 'ALL_WITH_INDETERMINATE',
      validator: value =>
        [
          'ALL',
          'BRANCH_PRIORITY',
          'LEAF_PRIORITY',
          'ALL_WITH_INDETERMINATE'
        ].indexOf(value) !== -1
    }
  },

  computed: {
    selectedNodes() {
      return this.forest.selectedNodeIds
        .map(this.getNode)
        .filter(({ hide }) => !hide)
    }
  },

  mounted() {
    this.setLabel()
  },

  methods: {
    setLabel() {
      if (this.label) {
        const label = document.createElement('span')
        label.innerText = this.label
        label.className = 'label'
        this.$el.prepend(label)
      }
    },

    createFallbackNode(id) {
      const raw = this.extractNodeFromValue(id)
      const label = this.enhancedNormalizer(raw).label || ''

      const fallbackNode = {
        id,
        label,
        hide: !label,
        ancestors: [],
        parentNode: 'NO_PARENT_NODE',
        isFallbackNode: true,
        isRootNode: true,
        isLeaf: true,
        isBranch: false,
        isDisabled: !label,
        isNew: false,
        index: [-1],
        level: 0,
        raw
      }

      return this.$set(this.forest.nodeMap, id, fallbackNode)
    }
  }
}
</script>

<style lang="scss">
.vue-treeselect {
  border: none;
  border-bottom: solid #949494 1px;
  margin-bottom: 10px;
  top: 4px;
  padding: 0;

  .label {
    color: #818181;
    font-size: 13px;
  }

  .vue-treeselect__value-remove,
  .vue-treeselect__multi-value-label {
    padding: 5px 5px 5px 10px;
  }

  .vue-treeselect__control {
    border: none;
    box-shadow: none !important;
    padding-left: 0;

    .vue-treeselect__value-remove,
    .vue-treeselect__multi-value-item:hover .vue-treeselect__value-remove {
      border-left: none;
      color: #e0e0e0;
    }

    .vue-treeselect__multi-value-item {
      background: #e0e0e0;
      border-radius: 32px;
      color: #232323;
      height: 32px;
      padding: 2px;
    }

    .vue-treeselect__value-remove > svg {
      background-color: #7e7e7e;
      border-radius: 20px;
      box-sizing: content-box;
      height: 10px;
      padding: 3px;
      width: 10px;
    }

    .vue-treeselect__control-arrow-container {
      vertical-align: baseline;

      .vue-treeselect__control-arrow {
        color: #757575;
      }
    }

    .vue-treeselect__x-container {
      color: rgba(0, 0, 0, 0.54);
      vertical-align: baseline;
      width: 30px;

      .vue-treeselect__x {
        width: 14px;
        height: 14px;
      }
    }
  }

  .vue-treeselect__checkbox {
    width: 18px;
    height: 18px;
    border-width: 2px;
  }

  .vue-treeselect__checkbox--unchecked {
    border-color: #757575;
  }

  .vue-treeselect__checkbox--checked {
    border-color: #1976d2;
    background: #1976d2;
  }

  .vue-treeselect__label-container:hover .vue-treeselect__checkbox--unchecked {
    border-color: #1976d2;
  }

  .vue-treeselect__minus-mark,
  .vue-treeselect__check-mark {
    width: 12px;
    height: 12px;
    background-size: 12px;
  }

  .vue-treeselect__option {
    font-size: 16px;
    height: 48px;
  }

  .vue-treeselect__label-container {
    height: 100%;
  }

  .vue-treeselect__multi-value-item-disabled {
    display: none;
  }
}

.vue-treeselect.vue-treeselect--open {
  border-bottom: solid #1976d2 2px;

  .vue-treeselect__x,
  .vue-treeselect__control-arrow.vue-treeselect__control-arrow--rotated {
    color: #1976d2 !important;
  }
}
</style>

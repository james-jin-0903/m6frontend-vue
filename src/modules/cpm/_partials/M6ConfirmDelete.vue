<template>
  <v-dialog
    v-model="showing"
    max-width="480"
  >
    <v-card class="m6_connect_card rounded-lg">
      <v-card-title class="headline px-6 py-4 white">
        <span class="grey--text text--darken-1">{{ title }}</span>
      </v-card-title>
      <v-divider class="grey lighten-3" />

      <v-card-text
        class="pt-3"
        v-html="message"
      >
        <div>
          <div
            v-for="(item, indexD) in details"
            :key="indexD"
          >
            <b v-text="`${item.key}: `" />
            <span v-text="item.value" />
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          :color="theme===2?'gray':'red'"
          :disabled="deleting"
          elevation="1"
          text
          @click="$emit('cancel')"
        >
          {{noText}}
        </v-btn>

        <v-btn
          :color="theme===2?'blue':'blue darken-1 white--text'"
          :disabled="deleting"
          elevation="1"
          text
          @click="$emit('confirm')"
        >
          {{yesText}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'M6ConfirmDelete',

  props: {
    yesText: {
      type: String,
      default: 'Yes'
    },
    noText: {
      type: String,
      default: 'No'
    },
    confirm: {
      type: Boolean,
      default: false
    },

    deleting: {
      type: [Boolean, Number, String],
      default: false
    },

    details: {
      type: Array,
      default: () => []
    },

    message: {
      type: String,
      default: 'Are you sure you want to delete this resource?'
    },

    show: {
      type: [Boolean, Number, String],
      required: true
    },

    title: {
      type: String,
      default: 'Confirmation'
    },
    theme: {
      type: Number,
      default: 1
    }
  },

  data: () => ({
    showing: false
  }),

  watch: {
    show: {
      immediate: true,
      handler: function (v) {
        this.showing = v
      }
    },

    showing(v) {
      if (!v) {
        this.$emit('cancel')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m6_connect_card {
  width: 100%;
  max-width: 100%;

  .v-card__title {
    padding: 10px;
    background: #1976d2;
    color: #fff;

    h3 {
      font-weight: 100;
    }
  }

  .cursor-pointer-row {
    cursor: pointer;
  }
}
</style>

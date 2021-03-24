<template>
  <v-snackbar
    v-model="snackbarVal"
    :bottom="bottom"
    :color="notifColor"
    :left="left"
    :multi-line="multiLine"
    :right="right"
    :top="top"
    :vertical="vertical"
  >
    <b
      class="white--text"
      v-html="text"
    />

    <template v-slot:action="{ attrs }">
      <v-btn
        v-bind="attrs"
        dark
        text
        @click="$emit('closing')"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import colors from 'vuetify/lib/util/colors'
import { mapMutations } from 'vuex'

export default {
  name: 'M6Notification',
  props: {
    snackbar: {
      type: Boolean,
      default: false
    },
    success: {
      type: Boolean,
      default: false
    },
    warning: {
      type: Boolean,
      default: false
    },
    danger: {
      type: Boolean,
      default: false
    },
    top: {
      type: Boolean,
      default: false
    },
    bottom: {
      type: Boolean,
      default: false
    },
    left: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    multiLine: {
      type: Boolean,
      default: false
    },
    vertical: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapMutations('SnackBarNotif', {
      notifClose: 'notifClose'
    })
  },
  computed: {
    snackbarVal: {
      get() {
        return this.snackbar
      },
      set(val) {
        if (!val) this.notifClose()
      }
    },
    notifColor() {
      let str = ''
      switch (true) {
        case this.success:
          str = colors.green.darken1
          break
        case this.warning:
          str = colors.yellow.darken1
          break
        case this.danger:
          str = colors.red.darken1
          break

        default:
          str = colors.blue.darken1
          break
      }

      return str
    }
  }
}
</script>

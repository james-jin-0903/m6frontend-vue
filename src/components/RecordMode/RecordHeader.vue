<template>
  <v-container class="max-w-none px-0 py-0 rounded-lg">
    <!-- Full screen view -->
    <div
      v-if="get_screen_status() && headerDataRecord === null"
      class="blue d-flex darken-1 pl-3 pr-2 py-2 white--text"
    >
      <p class="text-body-1 white--text">
        {{ get_record_full_screen().title }}
      </p>
      <v-spacer />
      <v-icon
        class="px-2"
        color="white"
        size="18"
        @click="hidden_full_screen(get_record_full_screen())"
      >
        mdi-minus
      </v-icon>
      <v-icon
        class="px-2"
        color="white"
        size="18"
        @click="preview_screen_from_full_screen(get_record_full_screen())"
      >
        mdi-arrow-bottom-left
      </v-icon>
      <v-icon
        class="px-2"
        color="white"
        size="18"
        @click="close_full_screen"
      >
        mdi-close
      </v-icon>
    </div>
    <!-- Preview View -->
    <div
      v-else
      class="blue d-flex darken-1 pl-3 pr-2 py-2 white--text"
    >
      <p class="text-body-1 white--text">
        {{ headerDataRecord.title }}
      </p>
      <v-spacer />
      <v-icon
        class="px-2"
        color="white"
        size="18"
        @click="hidden_preview(headerDataRecord)"
      >
        mdi-minus
      </v-icon>
      <v-icon
        class="px-2"
        color="white"
        size="18"
        @click="full(headerDataRecord)"
      >
        mdi-arrow-top-right
      </v-icon>
      <v-icon
        class="px-2"
        color="white"
        size="18"
        @click="remove_record_from_active(headerDataRecord)"
      >
        mdi-close
      </v-icon>
    </div>
  </v-container>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'RecordHeader',
  props: {
    headerDataRecord: Object
  },
  computed: {
    ...mapGetters('GeneralListModule', [
      'get_screen_status',
      'get_record_full_screen'
    ])
  },
  methods: {
    ...mapActions('GeneralListModule', [
      'preview_screen_from_full_screen',
      'remove_record_from_active',
      'hidden_full_screen',
      'hidden_preview',
      'full_screen',
      'close_full_screen'
    ]),
    full(record) {
      this.hidden_preview(this.headerDataRecord)
      record['prefix'] !== null
        ? this.redirect(record)
        : this.full_screen(record)
    },
    redirect(record) {
      if (record['record_number']) {
        this.$router.push(`/record/${record['id']}`)
      } else {
        this.$router.push(`/dev/${record['id']}`)
      }
    }
  }
}
</script>

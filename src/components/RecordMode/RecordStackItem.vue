<template>
  <div class="blue d-flex darken-1 pl-3 pr-2 py-2 white--text">
    <p
      v-if="indexState === 0"
      class="cursor-hover text-body-1 white--text"
      @click="preview_screen(recorIdle)"
    >
      {{ recorIdle.title }}
    </p>
    <p
      v-else
      class="cursor-hover text-body-1 white--text"
      @click="unshift_data_to_active(recorIdle)"
    >
      {{ recorIdle.title }}
    </p>
    <v-spacer
      v-if="indexState === 0"
      class="cursor-hover"
      @click="preview_screen(recorIdle)"
    />
    <v-spacer
      v-else
      class="cursor-hover"
      @click="unshift_data_to_active(recorIdle)"
    />
    <v-icon
      class="px-2"
      color="white"
      size="18"
      @click="full(recorIdle)"
    >
      mdi-arrow-top-right
    </v-icon>
    <v-icon
      class="px-2"
      color="white"
      size="18"
      @click="remove_from_idle(recorIdle)"
    >
      mdi-close
    </v-icon>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'RecordStackItem',
  props: {
    recorIdle: Object,
    indexState: Number
  },
  methods: {
    ...mapActions(
      'GeneralListModule', [
        'preview_screen',
        'unshift_data_to_active',
        'full_screen',
        'remove_from_idle'
      ]
    ),
    full(record) {
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

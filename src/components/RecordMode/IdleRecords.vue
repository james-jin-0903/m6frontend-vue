<template>
  <v-container class="px-0 py-0 rounded-lg">
    <v-menu
      offset-y
      open-on-hover
      top
    >
      <template v-slot:activator="{ on, attrs }">
        <div
          v-bind="attrs"
          color="primary"
          dark
          v-on="on"
        >
          <record-stack-item
            v-if="index == 1"
            :index-state="index"
            :recor-idle="get_idle_previews()[0]"
            @click="preview_screen(recorIdle)"
          />
          <record-stack-item
            v-else
            :index-state="index"
            :recor-idle="get_idle_previews()[get_idle_previews().length - 1]"
            @click="preview_screen(recorIdle)"
          />
        </div>
      </template>
      <div
        v-for="(record, i) of get_idle_previews()"
        :key="i"
      >
        <record-stack-item
          v-if="record != get_idle_previews()[0] && index == 1"
          :index-state="index"
          :recor-idle="record"
        />
        <record-stack-item
          v-if="record != get_idle_previews()[get_idle_previews().length-1] && index == 0"
          :index-state="index"
          :recor-idle="record"
        />
      </div>
    </v-menu>
  </v-container>
</template>

<script>
import RecordStackItem from './RecordStackItem'
import { mapGetters } from 'vuex'

export default {
  name: 'IdleRecords',
  components: {
    RecordStackItem
  },
  data: () => ({
    cruds: [
      ['Create', 'mdi-add'],
      ['Read', 'insert_drive_file'],
      ['Update', 'update'],
      ['Delete', 'delete']
    ]
  }),
  computed: {
    ...mapGetters('GeneralListModule', ['get_idle_previews'])
  },
  props: {
    index: Number
  }
}
</script>

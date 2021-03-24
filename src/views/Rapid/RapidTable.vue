<template>
  <div>
    <v-container
      class="rounded-lg"
      fluid
    >
      <v-row class="text-center">
        <v-col cols="1" />
        <v-col cols="10">
          <v-data-table
            :headers="headers"
            :items="rapids"
            :items-per-page="5"
          >
            <template v-slot:item.rapid_description="{ item }">
              {{ $h.dg( item, 'rapid_description', '' ) }}
            </template>

            <template v-slot:item.rapid_color_rating="{ item }">
              <v-avatar
                :color="ratings.find( e => e.level == item.rapid_color_rating ).color"
                size="2rem"
              />
            </template>
            <template v-slot:item.rapid_reaction="{ item }">
              <span
                class="emoji-height"
                v-html="emojis.find( e => e.level == item.rapid_reaction ).emoji"
              />
            </template>
            <template v-slot:item.actions="{ item }">
              <router-link :to="{ name: 'record.show', params: { id: item.record_id } } ">
                <v-btn
                  color="green darken-1"
                  fab
                  icon
                  x-small
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </router-link>
              <v-btn
                color="red darken-1"
                fab
                icon
                x-small
                @click="showDeleteRapidDialog = true"
              >
                <v-icon>mdi-delete-forever-outline</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
        <v-col cols="1" />
      </v-row>
    </v-container>

    <m6-loading :loading="loading" />
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
export default {

  name: 'RapidTable',

  data: () => ({
    headers: [
      { text: 'Title', value: 'rapid_title' },
      { text: 'Description', value: 'rapid_description' },
      { text: 'Status', value: 'rapid_status', sortable: false },
      { text: 'Emoji', value: 'rapid_reaction', sortable: false },
      { text: 'Color', value: 'rapid_color_rating', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    rapids: [],
    loading: false
  }),

  methods: {
    ...mapMutations('PageControl', {
      setShowSidePanels: 'setShowSidePanels'
    }),

    ...mapActions('RapidTicket', {
      getRapidList: 'getList'
    }),

    ...mapActions('WorkOrderModule', {
      getUsers: 'getUsersList'
    }),

    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    })
  },

  async mounted() {
    try {
      this.loading = true
      this.setShowSidePanels(false)
      this.rapids = await this.getRapidList()
      this.loading = false
    } catch (e) {
      this.loading = false
      this.notifDanger('There was an error while loading the Rapids')
    }
  },

  computed: {
    ...mapState('RapidTicket', {
      emojis: 'emojis',
      ratings: 'ratings'
    })
  },

  beforeDestroy() {
    this.setShowSidePanels(true)
  }
}
</script>


<style lang="scss" scoped>
.emoji-height {
  font-size: 2rem;
}
</style>

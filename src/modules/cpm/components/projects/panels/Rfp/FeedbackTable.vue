<template>
  <div>
    <v-data-table
      :headers="headers"
      hide-default-footer
      :items="responses"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td class="pa-1 text-center">
          <v-row
            align="center"
            class="spacer"
          >
            <v-col cols="4">
              <v-avatar
                class="ml-2"
                size="36px"
              >
                <img :src="props.item.contact.user_image">
              </v-avatar>
            </v-col>

            <v-col cols="8">
              <p class="ma-0">
                {{ props.item.contact.first_name }} {{ props.item.contact.last_name }}
              </p>
              <p class="ma-0">
                {{ props.item.contact.email }}
              </p>
              <p
                v-if="props.item.contact.phone"
                class="ma-0"
              >
                {{ props.item.contact.phone }}
              </p>
              <p
                v-if="props.item.contact.contact_type.length"
                class="ma-0"
              >
                {{ formatTags(props.item.contact.contact_type) }}
              </p>
            </v-col>
          </v-row>
        </td>
        <td class="text-center">
          {{ props.item.vendor.title }}
        </td>
        <td class="text-center">
          <v-chip
            v-if="props.item.response === 'yes'"
            class="ma-0 pa-0"
            color="green"
            hide-details
            small
            text-color="white"
          >
            <v-avatar class="darken-3 green">
              <v-icon>mdi-check</v-icon>
            </v-avatar>
            Bidding
          </v-chip>
          <v-chip
            v-else-if="props.item.response === 'maybe'"
            class="ma-0 pa-0"
            color="orange"
            hide-details
            small
            text-color="white"
          >
            <v-avatar class="darken-3 orange">
              ?
            </v-avatar>
            Maybe
          </v-chip>
          <v-chip
            v-else-if="props.item.response === 'no'"
            class="ma-0 pa-0"
            color="red"
            hide-details
            small
            text-color="white"
          >
            <v-avatar class="darken-3 red">
              <v-icon>mdi-bookmark-off</v-icon>
            </v-avatar>
            Not Bidding
          </v-chip>
          <v-chip
            v-else-if="props.item.response === 'opened'"
            class="ma-0 pa-0"
            color="blue"
            hide-details
            small
            text-color="white"
          >
            <v-avatar class="blue darken-3">
              <v-icon>mdi-check</v-icon>
            </v-avatar>
            Sending Proposal
          </v-chip>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'

export default {
  name: 'FeedbackTable',
  props: ['packageId', 'rfpId'],
  data() {
    return {
      headers: [
        {
          text: 'Contact',
          value: 'contact',
          sortable: false
        },
        { text: 'Company', value: 'vendor' },
        { text: 'Feedback', value: 'response' }
      ],
      responses: []
    }
  },
  firestore() {
    return {
      responses: db.collection('proposals').doc(this.rfpId).collection('bid_packages').doc(this.packageId).collection('feedback')
    }
  },
  mounted() {},
  methods: {
    formatTags(tags) {
      let tagStr = ''
      tags.forEach(t => {
        tagStr += t.label + ', '
      })
      return tagStr.slice(0, -2)
    }
  }
}
</script>

<style scoped>

</style>

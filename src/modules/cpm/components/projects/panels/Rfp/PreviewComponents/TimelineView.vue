<template>
  <div>
    <v-timeline v-if="proposal">
      <v-timeline-item
        v-for="(date,index) in proposalDates"
        :key="index"
      >
        <template v-slot:opposite>
          <span class="title">{{ date.value }}</span>
        </template>
        <v-card class="elevation-2 rounded-lg">
          <v-card-title class="headline px-6 py-4 white">
            <span class="grey--text text--darken-1">
              {{ date.label }}
            </span>
          </v-card-title>
          <v-divider class="grey lighten-3" />
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'

export default {
  name: 'TimelineView',
  props: {
    proposal: {
      type: Object,
      required: true
    }
  },
  computed: {
    proposalDates() {
      const dates = [

        { label: 'Sent out', value: 'sentOut' },
        { label: 'Mandatory Pre Bid', value: 'mandatoryPreBid' },
        { label: 'Bidder’s One-On-One Meetings', value: 'bidders1on1' },
        { label: 'Final RFIs', value: 'finalRfi' },
        { label: 'Last Addendum', value: 'lastAddendum' },
        {
          label: 'Technical Proposals and Lump Sum Bids',
          value: 'technicalProposals'
        },
        {
          label: 'Technical Evaluation Panel Review',
          value: 'technicalEvaluation'
        },
        { label: 'Interviews', value: 'interviews' },
        { label: 'Notice on Intent to Award', value: 'noticeOnIntent' },
        { label: 'Board Memo', value: 'boardMemo' },
        { label: 'Sharp HealthCare Board', value: 'sharpBoard' },
        { label: 'Notice to Proceed', value: 'noticeToProceed' },
        { label: 'kickOff', value: 'kickOff' }
      ]

      const auxArray = []

      dates.map(date => {
        let aux = ''

        if (date.value != '' && this.proposal[date.value]) {
          aux = new Date(this.proposal[date.value]).toLocaleDateString('en-US')
          // aux = `${aux.getFullYear()}-${aux.getMonth()+1}-${aux.getDate()}`
        }

        auxArray.push({ label: date.label, value: aux })
      })

      return auxArray
    }
  }
}
</script>


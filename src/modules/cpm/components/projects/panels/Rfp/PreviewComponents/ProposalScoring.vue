<template>
  <div>
    <table v-if="items.length > 0">
      <thead>
        <tr>
          <template v-for="(header,index) in headers">
            <th
              :key="index"
              :style="header.style ? header.style:''"
            >
              <strong> {{ header.text }} </strong>
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item,index) in items"
          :key="index"
          :class="getSelectedClass(item)"
        >
          <td> {{ item.label }}  </td>
          <td style="text-align: center;">
            {{ item.value }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      No scores will be held for this project.
    </div>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'

export default {
  name: 'ProposalScoring',
  props: {
    proposal: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      headers: [
        { text: 'Component', value: 'label' },
        { text: 'Points', value: 'value', style: 'text-align:center' }
      ],
      items: [
        { label: 'Technical Proposal', value: 0 },
        { label: 'Interview', value: 0 },
        { label: 'Total Technical/ Interview Score', value: 100 },
        { label: 'Value Weighted Score (V)', value: 'V = Points / 10' },
        { label: 'Lump Sum Bid', value: '$X' },
        { label: 'Best Value Bid Score', value: '$X / V' }

      ]

    }
  },
  mounted() {
    this.loadInitialAttributes()
  },
  methods: {
    getSelectedClass(item) {
      let className = ''
      switch (item.label) {
        case 'Technical Proposal':
          className = 'technical-proposal-row'
          break

        case 'Interview':
          className = 'interview-proposal-row'
          break
      }

      return className
    },
    loadInitialAttributes() {
      let scoreInterview = 0
      let score = 0


      if (this.proposal.interviewing && this.proposal.interviewing.length > 0) {
        this.proposal.interviewing.map(interview => {
          scoreInterview += parseInt(interview.score)
        })

        this.items[0].value = scoreInterview
      }

      if (this.proposal.scoring && this.proposal.scoring.length > 0) {
        this.proposal.scoring.map(scoreAux => {
          score += parseInt(scoreAux.score)
        })

        this.items[1].value = score
      }

      this.items[2].value = score + scoreInterview
    }
  }
}
</script>

<style scoped>
.technical-proposal-row{
  background-color: rgb(255, 255, 204);
}

.interview-proposal-row{
  background-color: rgb(204, 236, 255);
}

table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
      padding:9px !important;
  font-size: 12px;
}
</style>

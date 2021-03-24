<template>
  <div>
    <table v-if="scoring.length > 0">
      <thead>
        <tr>
          <th />
          <th style="text-align:center;">
            <strong>Technical Proposal</strong>
          </th>
          <th style="text-align:center;">
            <strong>Score</strong>
          </th>
        </tr>
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
          v-for="(item,index) in scoring"
          :key="index"
        >
          <td style="text-align: center;">
            {{ item.index }}
          </td>
          <td>{{ item.name }}</td>
          <td style="text-align: center;">
            {{ item.score }}
          </td>
        </tr>

        <tr>
          <td />
          <td style="text-align: right;">
            <strong>Sub-Total</strong>
          </td>
          <td style="text-align: center;">
            <strong>{{ subTotal }}</strong>
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
  name: 'ProposalScoringSummaryView',
  props: {
    proposal: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      headers: [
        { text: 'Tab #', value: 'index', style: 'text-align:center;' },
        { text: 'Criteria', value: 'name' },
        { text: '', value: 'score' }
      ]
    }
  },
  computed: {
    scoring() {
      if (!this.proposal.scoring) {
        return []
      }

      const aux = JSON.parse(JSON.stringify(this.proposal.scoring))

      aux.map((score, index) => {
        score.index = index + 1
      })

      return aux
    },
    subTotal() {
      let subtotal = 0
      this.scoring.map(item => {
        subtotal += parseInt(item.score)
      })

      return subtotal
    }
  }
}
</script>

<style scoped>

table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding:9px !important;
  font-size: 12px;
}
</style>


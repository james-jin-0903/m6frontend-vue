<template>
  <div>
    <table
      v-if="scoring.length > 0"
      style="width:100%;"
    >
      <tr>
        <td colspan="2">
          Project Name: {{ proposal.project.title }}
        </td>
        <td
          colspan="2"
          rowspan="2"
          style="height: 80px;vertical-align: top;"
        >
          Reviewer's Name:
        </td>
      </tr>
      <tr>
        <td colspan="2">
          Bidder's Name:
        </td>
      </tr>
      <tr>
        <template v-for="(header,index) in headers">
          <th
            :key="index"
            class="interview-header"
            :style="header.style ? header.style:''"
          >
            <strong> {{ header.text }} </strong>
          </th>
        </template>
      </tr>
      <template v-for="(score, index) in scoring">
        <tr :key="index">
          <td style="text-align:center;vertical-align:top">
            <strong> {{ score.index }}</strong>
          </td>
          <td>
            <div v-html="score.text" />
          </td>
          <td style="text-align:center;">
            {{ score.score }}
          </td>
          <td />
        </tr>
      </template>
      <tr>
        <td
          colspan="2"
          style="text-align:right;"
        >
        <!-- Totals -->
        </td>
        <td style="text-align:center;">
          {{ subTotal }}
        </td>
        <td />
      </tr>
    </table>
    <div v-else>
      No scores will be held for this project.
    </div>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'

export default {
  name: 'ProposalScoringDetailedView',
  props: {
    proposal: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      headers: [
        { text: ' ', style: 'width:5%;' },
        { text: 'Technical Scoring', style: 'text-align:center' },
        {
          text: 'Total Possible Points',
          style: 'text-align:center; width:10%;'
        },
        { text: 'Bidder', style: 'text-align:center' }
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
        score.text = '<strong>' + score.name + '</strong><br><br> ' + score.body
      })

      return aux
    },
    subTotal() {
      let subtotal = 0
      this.proposal.scoring.map(item => {
        subtotal += parseInt(item.score)
      })

      return subtotal
    }
  }

}
</script>

<style scoped>
.scoreHeader{
  border-bottom: solid #CCC 1px;
  margin-top: 25px;
  margin-bottom: 15px;
}

table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding:9px !important;
  font-size: 12px;
}
</style>


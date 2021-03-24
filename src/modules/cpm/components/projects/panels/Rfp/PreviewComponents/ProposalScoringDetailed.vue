<template>
  <div>
    <table
      v-if="scoring.length > 0"
      style="width:100%;"
    >
      <div>
        <template v-for="(item,index) in scoring">
          <tr
            :key="index"
            style="width:100%;"
          >
            <td>Tab {{ item.index }}</td>
            <td>{{ item.name }}</td>
            <td>Score of {{ item.score }}</td>
          </tr>
          <tr :key="index+'body'">
            <td
              colspan="3"
              v-html="item.body"
            />
          </tr>
        </template>
      </div>
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
        { text: 'Bidder', style: 'text-align:left' }
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


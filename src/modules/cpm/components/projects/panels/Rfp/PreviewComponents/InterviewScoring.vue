<template>
  <div>
    <table v-if="proposal.hasInterviewingScoring && items.length > 0">
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
        >
          <td>{{ index+1 }}</td>
          <td v-html="item.body" />
          <td>{{ item.score }}</td>
        </tr>

        <tr>
          <td />
          <td>Total Technical Score</td>
          <td>{{ total }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else>
      No interviews will be held for this project.
    </div>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'

export default {
  props: {
    proposal: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      headers: [
        { text: 'Item', value: 'time' },
        { text: 'Interview', value: 'firm', style: 'text-align:center' },
        { text: 'Score', value: 'firm' }
      ]
    }
  },
  computed: {
    items() {
      if (this.proposal.interviewing && this.proposal.interviewing.length > 0) {
        return this.proposal.interviewing
      }
      return []
    },
    total() {
      let total = 0

      if (this.proposal.interviewing && this.proposal.interviewing.length > 0) {
        this.proposal.interviewing.map(item => {
          total += parseInt(item.score)
        })
      }

      return total
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

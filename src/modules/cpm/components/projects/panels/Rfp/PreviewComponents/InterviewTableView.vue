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
          <td>{{ item.interviewTime }}</td>
          <td>{{ item.interviewFirm.completeName }}</td>
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
        { text: 'Time', value: 'time' },
        { text: 'Firm', value: 'firm' }
      ]
    }
  },
  computed: {
    items() {
      if (this.proposal.interviewsTable && this.proposal.interviewsTable.length > 0) {
        return this.proposal.interviewsTable
      }
      return []
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

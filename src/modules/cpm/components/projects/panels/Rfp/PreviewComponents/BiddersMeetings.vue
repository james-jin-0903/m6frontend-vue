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
        >
          <td>{{ item.date }}</td>
          <td>{{ item.location }}</td>
          <td>{{ item.time }}</td>
          <td>{{ item.company }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else>
      There are no bidders meetings.
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
        { text: 'Date', value: 'date' },
        { text: 'Location', value: 'location' },
        { text: 'Time', value: 'time' },
        { text: 'Company', value: 'company' }
      ]
    }
  },
  computed: {
    items() {
      if (this.proposal.biddersMeetings && this.proposal.biddersMeetings.length > 0) {
        return this.proposal.biddersMeetings
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

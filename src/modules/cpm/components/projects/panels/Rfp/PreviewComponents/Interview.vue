<template>
  <div>
    <table
      v-if="proposal.hasInterviewingScoring && items.length > 0"
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

      <tr
        v-for="(item,index) in items"
        :key="index"
      >
        <td style="text-align:center;vertical-align:top">
          <strong>{{ index +1 }}</strong>
        </td>
        <td v-html="item.text" />
        <td style="text-align:center;">
          {{ item.score }}
        </td>
        <td />
      </tr>
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
      No interviews will be held for this project.
    </div>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'

export default {
  name: 'Interview',
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
        { text: 'Interview Scoring', style: 'text-align:center' },
        {
          text: 'Total Possible Points',
          style: 'text-align:center;width:10%;'
        },
        { text: 'Bidder', style: 'text-align:center' }
      ]
    }
  },
  computed: {
    items() {
      if (this.proposal.interviewing && this.proposal.hasInterviewingScoring && this.proposal.hasInterviewingScoring === true && this.proposal.interviewing.length > 0) {
        this.proposal.interviewing.map((interview, index) => {
          interview.text = '<strong>' + interview.name + '</strong><br><br> ' + interview.body
        })

        return this.proposal.interviewing
      }
      return []
    },
    subTotal() {
      let subtotal = 0
      this.items.map(item => {
        subtotal += parseInt(item.score)
      })

      return subtotal
    }
  }
}
</script>

<style scoped>

.interview-row{
  padding-left: 16px;
}

.interview-header{
  font-size: 16px;
}

table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding:9px !important;
  font-size: 12px;
}

</style>


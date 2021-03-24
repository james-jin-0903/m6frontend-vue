<template>
  <div>
    <table v-if="proposal.lessonsLearned && proposal.lessonsLearned.length > 0 ">
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
          v-for="(item,index) in proposal.lessonsLearned"
          :key="index"
        >
          <td style="text-align:center;">
            {{ item.topic }}
          </td>
          <td v-html="item.observation" />
        </tr>
      </tbody>
    </table>
    <div v-else>
      No lessons learned will be held for this project.
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
        { text: 'Topic', value: 'topic', style: 'text-align:center;' },
        { text: 'Observation', value: 'observation' }
      ]
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

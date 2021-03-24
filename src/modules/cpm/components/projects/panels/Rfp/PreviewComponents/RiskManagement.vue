<template>
  <div>
    <table v-if="project.risks && project.risks.length > 0">
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
          v-for="(item,index) in project.risks"
          :key="index"
        >
          <td style="text-align:center;">
            {{ index +1 }}
          </td>
          <td>{{ item.issue }}</td>
          <td>{{ item.factors }}</td>
          <td :style="getStyle(item)">
            {{ item.riskScore }}
          </td>
          <td v-html="item.mitigation" />
        </tr>
      </tbody>
    </table>
    <div v-else>
      No risks will be held for this project.
    </div>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      headers: [
        {
          text: '#',
          sortable: false,
          value: 'id',
          style: 'text-align:center;'
        },
        {
          text: 'Issue',
          value: 'issue',
          style: 'text-align:center;'

        },
        {
          text: 'Factors',
          value: 'factors',
          style: 'text-align:center;'
        },
        {
          text: 'Risk Score',
          value: 'riskScore',
          style: 'text-align:center;'
        },
        {
          text: 'Sharp\'s Mitigation',
          value: 'mitigation',
          style: 'text-align:center;'
        }

      ]
    }
  },
  mounted() {},
  methods: {
    getStyle(item) {
      const aux = {
        'text-align': 'center'
      }

      const color = item.color ? item.color.color : ''
      if (color != '') {
        aux['background-color'] = color
      }
      return aux
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

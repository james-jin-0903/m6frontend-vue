<template>
  <div>
    <table v-if="proposal.hasAlternates === true && items.length > 0">
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
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else>
      There are no Alternates.
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
    },
    typeValue: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' }
      ]
    }
  },
  computed: {
    items() {
      if (this.proposal[this.typeValue] && this.proposal[this.typeValue].length > 0) {
        return this.proposal[this.typeValue]
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

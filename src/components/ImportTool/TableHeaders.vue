<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th
            v-for="(header, hi) in headers"
            :key="hi"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody />
    </template>
  </v-simple-table>
</template>

<script>
export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'Tableheaders',
  props: {
    headers: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>

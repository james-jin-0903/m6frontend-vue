<template>
  <div class="main-content">
    <v-data-table
      :headers="headers"
      hide-default-footer
      :items="grants"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td>{{ props.item.title }}</td>
        <td class="justify-center layout px-0">
          <v-icon
            class="mr-1"
            small
          >
            mdi-pencil
          </v-icon>
          <v-icon small>
            mdi-delete
          </v-icon>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'
export default {
  data() {
    return {
      headers: [
        {
          text: 'Title',
          value: 'title'
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false
        }
      ],
      grants: []
    }
  },
  firestore() {
    return {
      grants: db.collection('grants')
    }
  },
  mounted() {}
}
</script>

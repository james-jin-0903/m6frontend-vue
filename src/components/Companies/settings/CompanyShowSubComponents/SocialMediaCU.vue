<template>
  <div>
    <v-data-table
      class="elevation-0"
      :headers="headers"
      :items="items"
      :items-per-page="5"
    >
      <template #item.socialMedia="{ item }">
        <v-autocomplete
          v-model="item.icon"
          item-text="text"
          item-value="val"
          :items="socialMediaOptions"
          @input="e => inputEvent(e, item)"
        />
      </template>
      <template #item.url="{ item }">
        <v-text-field
          v-model="item.url"
          :label="`${item.socialMedia} Link`"
          :rules="websiteRules"
        />
      </template>
      <template #item.actions="{ item }">
        <v-btn
          color="red"
          icon
          @click="deletingItem(item)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'SocialMediaCU',
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    websiteRules: [
      v => !!v || 'Website is required',
      // eslint-disable-next-line no-useless-escape
      v => /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(v) || 'Website must be valid'
    ],
    headers: [
      { text: 'Social Media', value: 'socialMedia' },
      { text: 'url', value: 'url', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    socialMediaOptions: [
      { id: 'facebook', text: 'Facebook', val: 'mdi-facebook' },
      { id: 'twitter', text: 'Twitter', val: 'mdi-twitter' },
      { id: 'linkedin', text: 'LinkedIn', val: 'mdi-linkedin' },
      { id: 'instagram', text: 'Instagram', val: 'mdi-instagram' }
    ]
  }),
  methods: {
    inputEvent(val, item) {
      const social = this.socialMediaOptions.find(s => s.val === val)
      item.socialMedia = social.text
    },
    deletingItem(item) {
      this.$emit('change', this.items.filter(i => i.url !== item.url))
    }
  }
}
</script>

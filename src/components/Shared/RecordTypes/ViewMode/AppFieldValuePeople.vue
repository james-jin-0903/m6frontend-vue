<template>
  <p>
    {{ appValue?getAuthor(appValue.value):'' }}
  </p>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppFieldValuePeople',
  props: {
    appValue: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    ...mapGetters('Companies', {
      currentCompanyUsers: 'getCurrentCompanyUsers'
    })
  },
  methods: {
    getAuthor(id) {
      const res = this.currentCompanyUsers.find(u => this.$h.dg(u, 'user.id', '') === id)
      return this.$h.dg(res, 'user.firstName', '') + ' ' + this.$h.dg(res, 'user.lastName', '')
    }
  }
}
</script>

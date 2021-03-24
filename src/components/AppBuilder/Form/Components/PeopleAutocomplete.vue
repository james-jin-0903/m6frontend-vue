<template>
  <div class="w-full">
    <v-autocomplete
      v-model="userList"
      :chips="chips"
      :clearable="clearable"
      :filled="filled"
      item-text="fullname"
      item-value="user.id"
      :items="processedUser"
      :label="label"
      :multiple="multiple"
      :outlined="outlined"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    value: {
      type: [String, Array],
      default: () => ([])
    },

    label: {
      type: String,
      default: ''
    },

    filled: {
      type: Boolean,
      default: false
    },

    outlined: {
      type: Boolean,
      default: false
    },

    multiple: {
      type: Boolean,
      default: false
    },

    chips: {
      type: Boolean,
      default: false
    },

    clearable: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
  }),

  computed: {
    ...mapGetters('Companies', {
      users: 'getCurrentCompanyUsers'
    }),

    userList: {
      get() {
        return this.value || []
      },
      set(data) {
        this.$emit('input', data)
      }
    },

    processedUser() {
      return this.users
        .map(u => ({
          ...u,
          fullname: this.$h.dg(u, 'firstName', '')
                    + ' ' +
                    this.$h.dg(u, 'lastName', '')
        }))
    }
  }
}
</script>

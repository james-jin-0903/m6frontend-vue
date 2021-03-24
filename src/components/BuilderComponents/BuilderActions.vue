<template>
  <div>
    <v-btn
      class="white--text"
      color="red darken-2"
      @click="showDeleteDialog = true"
    >
      <v-icon>mdi-delete</v-icon>
    </v-btn>
    <v-btn
      class="white--text"
      color="green darken-2"
      style="float: right;"
      @click="updatingApp"
    >
      save
    </v-btn>

    <m6-confirm-delete
      message="Are you sure you want to delete this App?"
      :show="showDeleteDialog"
      title="Delete Current App"
      @cancel="cancelDelete"
      @confirm="confirmingDelete"
    />

    <m6-loading :loading="loading" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "BuilderActions",

  data: () => ({
    showDeleteDialog: false,
    loading: false
  }),

  computed: {
    ...mapState('AppBuilder', {
      app: 'app'
    })
  },

  methods: {
    ...mapActions('AppBuilder', {
      updateApp: 'updateApp'
    }),

    async updatingApp() {
      this.loading = true

      if (!this.$refs.formApp.validate()) {
        this.notifDanger('Please fill in all required fields')
        this.loading = false
        return
      }

      try {
        const res = await this.updateApp({
          params: {
            ...this.app,
            metadata: {
              ...this.app.metadata,
              appIcon: {
                icon: this.iconName,
                background: this.iconBackgroundColor,
                iconColor: this.iconColor
              }
            }
          }
        })
        this.loading = false
        this.notifSuccess('Updated!')
      } catch (e) {
        this.loading = false

        let errorMsg = ''
        for (const i in e.response.data) {
          errorMsg += e.response.data[i][0].replace('params.', '') + '<br />'
        }
        this.notifDanger(errorMsg)
      }
    },
  }
}
</script>
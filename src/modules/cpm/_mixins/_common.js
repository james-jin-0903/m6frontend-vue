export default {
  data: () => ({
    autoHideLoading: true,
    loading: true
  }),

  methods: {
    snotifyError(error, { title = 'Error', hideLoading = true } = {}) {
      if (hideLoading) {
        this.loading = false
      }

      this.$snotify.error(
        this.lodash.isString(error)
          ? error
          : error && error.msg
            ? error.msg
            : 'Something went wrong.',
        title
      )
    }
  }
}

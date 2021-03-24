import _common from './_common'

export default {
  mixins: [_common],

  data: () => ({
    resource: null
  }),

  computed: {
    showParameters() {
      return {}
    }
  },

  created() {
    this.fetchResource()
  },

  methods: {
    fetchResource() {
      return new Promise((resolve, reject) => {
        this.loading = true

        this.showResource(this.showParameters)
          .then(data => {
            this.resourceFetched(data)

            resolve(data)
          })
          .catch(error => {
            this.snotifyError(error)

            reject(error)
          })
      })
    },

    resourceFetched(data) {
      this.assignResourceData(data)

      if (this.autoHideLoading) {
        this.$nextTick(() => (this.loading = false))
      }
    },

    assignResourceData({ result, data } = {}) {
      this.resource = data || result || []
    }
  }
}

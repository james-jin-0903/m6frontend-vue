import { debounce } from 'lodash'

import _common from './_common'

export default {
  mixins: [_common],

  data: () => ({
    autoInit: true,
    resourcesRaw: [],
    search: ''
  }),

  computed: {
    indexParameters() {
      return { search: this.search || '' }
    },

    onSearchHooks() {
      return []
    },

    resources: {
      // getter
      get: function () {
        return this.resourcesRaw
      },
      // setter
      set: function (newValue) {
        this.resourcesRaw = newValue
      }
    },

    toUrlQuery() {
      return { search: this.search }
    }
  },

  created() {
    if (this.autoInit) {
      this.setVarsFromUrlQuery().then(this.fetchResources)
    }
  },

  methods: {
    setVarsFromUrlQuery(query) {
      query = query || this.$route.query

      return new Promise(resolve => {
        this.search = query.search

        resolve()
      })
    },

    fetchResources() {
      return new Promise((resolve, reject) => {
        this.loading = true

        this.indexResource(this.indexParameters)
          .then(data => {
            this.resourcesFetched(data)

            resolve(data)
          })
          .catch(error => {
            this.snotifyError(error)

            reject(error)
          })
      })
    },

    resourcesFetched(data) {
      this.assignResourcesData(data)

      if (this.autoHideLoading) {
        this.$nextTick(() => (this.loading = false))
      }
    },

    assignResourcesData({ result, data } = {}) {
      this.resourcesRaw = data || result || []
    },

    debounceSearch: debounce(function (search, focusSearch = true) {
      this.search = search === null || search === undefined ? '' : search

      this.fetchResources().then(() => {
        if (focusSearch) {
          document.querySelector('#search').focus()
        }

        this.$router.push({
          query: { ...this.toUrlQuery, _at: new Date().getTime() }
        })

        this.onSearchHooks.forEach(hook => hook())
      })
    }, 1000)
  }
}

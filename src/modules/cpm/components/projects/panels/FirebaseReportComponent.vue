<script>
export default {
  data() {
    return {
      firebaseUrl: process.env.VUE_APP_FIREBASE_APIURL
    }
  },
  computed: {
    environment() {
      return this.getEnvironment()
    }
  },
  methods: {
    getEnvironment() {
      let environment = ''

      const url = this.getUrl()

      switch (url) {
        case 'sharp.m6connect.com':
        case 'thr.m6connect.com':
        case 'apps.m6connect.com':
        case 'm6connect.com':
          environment = 'production'
          break

        default:
          environment = 'test'
          break
      }

      return environment
    },
    getUrl() {
      const url = location.host
      return url
    }
  }

}
</script>

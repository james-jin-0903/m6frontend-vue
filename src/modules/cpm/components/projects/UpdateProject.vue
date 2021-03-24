<template />

<script>
import { db } from '@/utils/Firebase'
export default {
  data() {
    return {
      axiosSettings: {
        baseUrl: process.env.VUE_APP_FIREBASE_APIURL,
        config: {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        }
      }
    }
  },
  computed: {
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
    }
  },
  methods: {
    getUrl() {
      const url = location.host
      return url
    },
    getBudget(project) {
      return new Promise((resolve, reject) => {
        try {
          this.axios
            .post(
              `${this.axiosSettings.baseUrl}/api/project/${project.id}/budgets/total/`,
              { environment: this.getEnvironment() }
              // this.axiosSettings.config
            )
            .then(response => {
              project.budget = response.data.budgetTotal
              resolve(true)
            })
        } catch (error) {
          reject(error)
        }
      })
    },
    getFinalCost(project) {
      return new Promise((resolve, reject) => {
        try {
          this.axios
            .post(
              `${this.axiosSettings.baseUrl}/api/project/${project.id}/allocated/total/`,
              { environment: this.getEnvironment() }
              // this.axiosSettings.config
            )
            .then(response => {
              project.final_cost = response.data.total
              resolve(true)
            })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
</script>

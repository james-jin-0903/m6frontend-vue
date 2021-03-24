import axios from 'axios'
import { isString } from 'lodash'

function isValidJSONString(str) {
  try {
    if (!isString(str)) {
      // sanitize JSON object
      str = JSON.stringify(str)
    }

    JSON.parse(str)

    return true
  } catch (e) {
    return false
  }
}

axios.interceptors.response.use(
  response => {
    if (response.data.error || !isValidJSONString(response.data)) {
      return Promise.reject(response.data.msg || 'Something went wrong.')
    }

    // Do something with response data
    return response
  },
  error => Promise.reject(error)
)

export default class ApiRestClass {
  constructor(endpoint, { host = '' } = {}) {
    this.host = host
    this.endpoint = endpoint
  }

  all(data = null) {
    return this.show(null, data)
  }

  show(id = null, params = null) {
    return new Promise((resolve, reject) => {
      const show = id ? `/${id}` : ''
      axios
        .get(`${this.host}${this.endpoint}${show}`, { params })
        .then(resolve)
        .catch(reject)
    })
  }

  store(data = null) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.host}${this.endpoint}`, data)
        .then(resolve)
        .catch(reject)
    })
  }

  update(id = null, data = null) {
    return new Promise((resolve, reject) => {
      axios
        .put(`${this.host}${this.endpoint}/${id}`, data)
        .then(resolve)
        .catch(reject)
    })
  }

  destroy(id, data = null) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${this.host}${this.endpoint}/${id}`, { data })
        .then(resolve)
        .catch(reject)
    })
  }

  restore(id, data = null) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.host}${this.endpoint}/${id}`, data)
        .then(resolve)
        .catch(reject)
    })
  }
}

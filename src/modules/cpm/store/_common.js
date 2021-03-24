import ApiRestClass from '@/utils/ApiRestClass'

export default class Common {
  constructor(endpoint, { host = '' } = {}) {
    this.api = new ApiRestClass(endpoint, { host })
  }

  index(_, data = null) {
    return new Promise((resolve, reject) => {
      this.api
        .all(data)
        .then(response => resolve(response.data))
        .catch(reject)
    })
  }

  store(_, data = null) {
    return new Promise((resolve, reject) => {
      this.api
        .store(data)
        .then(response => resolve(response.data))
        .catch(reject)
    })
  }

  show(_, { id, data = null }) {
    return new Promise((resolve, reject) => {
      this.api
        .show(id, data)
        .then(response => resolve(response.data))
        .catch(reject)
    })
  }

  update(_, { id, data = null }) {
    return new Promise((resolve, reject) => {
      this.api
        .update(id, data)
        .then(response => resolve(response.data))
        .catch(reject)
    })
  }

  destroy(_, { id, data = null }) {
    return new Promise((resolve, reject) => {
      this.api
        .destroy(id, data)
        .then(response => resolve(response.data))
        .catch(reject)
    })
  }

  restore(_, { id, data = null }) {
    return new Promise((resolve, reject) => {
      this.api
        .restore(id, data)
        .then(response => resolve(response.data))
        .catch(reject)
    })
  }
}

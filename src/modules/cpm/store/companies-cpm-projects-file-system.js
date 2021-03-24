import axios from 'axios'

const actions = {
  getSignedUrl(_, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const link = await axios.post(`${window.Drupal.settings.m6_platform.f_base.functions.api_url}/api/getsignedURL`, payload).then(res => res.data.url)
        resolve(link)
      } catch (e) {
        reject(e)
      }
    })
  },
  createThread(_, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = axios
          .post('/messenger/create/thread', payload)
        resolve(response)
      } catch (e) {
        reject(e)
      }
    })
  },
  sendMail(_, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios
          .post('/m6-platform/api/general', payload)

        resolve(response)
      } catch (e) {
        reject(e)
      }
    })
  },
  sendAddUsers(_, payload) {
    return new Promise((resolve, reject) => {
      try {
        axios.post('/messenger/add/users', payload)
          .then(response => {
            if (response && response.data && response.data.error) {
              throw response.data.error
            } else {
              resolve(response)
            }
          })
      } catch (e) {
        reject(e)
      }
    })
  },
  sendMessage(_, payload) {
    return new Promise((resolve, reject) => {
      try {
        axios.post('/messenger/insert', payload).then(response => {
          if (response && response.data && response.data.error) {
            throw response.data.error
          } else {
            resolve(response)
          }
        })
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default {
  namespaced: true,
  actions
}

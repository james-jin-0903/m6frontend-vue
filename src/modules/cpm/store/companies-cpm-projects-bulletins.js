import axios from 'axios'
import { dataGet } from '@/utils/helpers'

const actions = {
  fetchAuthorizers() {
    return new Promise((resolve, reject) => {
      axios.post('m6-platform/api/general', {
        action: 'get_authorizers'
      })
      .then(data => {
        const authorizerNames = dataGet(data, 'data.result')
        resolve(authorizerNames)
      })
      .catch(reject)
    })
  },
  fetchApprovalTypes() {
    return new Promise((resolve, reject) => {
      axios.post('/m6-platform/api/contracts', {
        action: 'get_approval_types'
      })
        .then(response => {
          let approvalTypes = []
          const temp = dataGet(response, 'data.result')
          approvalTypes = Object.keys(temp).map(key => {
            return { id: key, name: temp[key] }
          })
          
          resolve(approvalTypes)
        })
        .catch(reject)
    })
  }
}

export default {
  namespaced: true,
  actions
}
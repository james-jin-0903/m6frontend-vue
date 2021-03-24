import axiosConfig from '@/modules/cpm/config/axios'

import Common from './_common'

const getTotals = new Common('/api/project', {
  host: axiosConfig.firestoreApiUrl
})

const actions = {
  /* eslint-disable-next-line */
  show({ commit }, { projectId, data } = {}) {
    if (!projectId) return Promise.reject()

    return getTotals.show({}, { id: `${projectId}/totals`, data })
  }
}

export default {
  namespaced: true,
  actions
}

import { db } from '@/utils/Firebase'

const actions = {
  index(
    /* eslint-disable-next-line */
    { commit },
    { projectId, active, asSnapshot = false } = {}
  ) {
    if (!projectId) return Promise.reject()

    let ref = db
      .collection('cpm_projects')
      .doc(`${projectId}`)
      .collection('budgets')

    if (typeof active === 'boolean') {
      ref = ref.where('active', '==', active)
    }

    if (asSnapshot) {
      return ref.get()
    }

    return new Promise((resolve, reject) =>
      ref
        .get()
        .then(({ docs }) =>
          Promise.all(
            docs.map(async item => {
              const data = await item.data()

              return { ...data, id: data.id }
            })
          ).then(resolve)
        )
        .catch(reject)
    )
  }
}

export default {
  namespaced: true,
  actions
}

import { db } from '@/utils/Firebase'
import axios from 'axios'

const state = {

}

const getters = {

}

const mutations = {

}

const actions = {
  addNote(_, { note, projectId, commitmentId }) {
    if (!note || !projectId || !commitmentId) return Promise.reject()

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(projectId)
        .collection('commitments')
        .doc(commitmentId)
        .collection('reconcilation_notes')
        .add(note)
        .then(() => {
          resolve()
        })
        .catch(reject)
    })
  },
  updateNote(_, { note, projectId, commitmentId }) {
    if (!note || !projectId || !commitmentId) return Promise.reject()

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(projectId)
        .collection('commitments')
        .doc(commitmentId)
        .collection('reconcilation_notes')
        .doc(note.id)
        .update(note)
        .then(() => {
          resolve()
        })
        .catch(reject)
    })
  },
  deleteNote(_, { note, projectId, commitmentId }) {
    if (!note || !projectId || !commitmentId) return Promise.reject()

    return new Promise((resolve, reject) => {
      db.collection('cpm_projects')
        .doc(projectId)
        .collection('commitments')
        .doc(commitmentId)
        .collection('reconcilation_notes')
        .doc(note.id)
        .delete()
        .then(() => {
          resolve()
        })
        .catch(reject)
    })
  },
  getNotesByCommitmentsId(_, { projectId, commitmentsId = [] }) {
    if (!projectId || !commitmentsId.length) return Promise.reject()

    return new Promise((resolve, reject) => {
      axios
        .post(
          `${window.Drupal.settings.m6_platform.f_base.functions.api_url}/api/get-reconciliation-notes-by-commitments-id/`,
          {
            projectId,
            commitmentsId
          }
        )
        .then(response => {
          resolve(response.data)
        })
        .catch(reject)
    })
  }
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

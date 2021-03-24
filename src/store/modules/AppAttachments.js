/* eslint-disable no-empty-pattern */
/* eslint-disable camelcase */
import axios from 'axios'

const state = {
}
const getters = {
}
const mutations = {
}
const actions = {
  async post_attachment({}, data) {
    const res = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/file/app-builder`, data['file'], {
      headers: data['headers']
    })

    return res['data']
  },
  async set_stream_attachments({}, data) {
    const res = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/file/stream`, data['files'], {
      headers: data['headers']
    })

    return res['data']
  },
  async get_post_file_url({}, postId) {
    const res = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/file/post/${postId}`)
    return res['data']
  },
  async get_message_file_url({}, postId) {
    const res = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/file/message/${postId}`)
    return res['data']
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

import axios from 'axios'
import Compressor from 'compressorjs'
const vueAppHttpPoint = process.env.VUE_APP_HTTP
const vueAppEndPoint = process.env.VUE_APP_ENDPOINT

const state = {
  fileQueue: []
}

const getters = {}

const mutations = {
  addFilesToQueue(state, payload) {
    state.fileQueue.push(payload)
  },
  clearFileQueue(state) {
    state.fileQueue = []
  }
}

const actions = {
  uploadFileToS3(context, obj) {
    return new Promise((resolve, reject) => {
      const fileTypePartial = obj.type.split('/')[0]
      const data = {
        folder: fileTypePartial,
        fileType: obj.type,
        fileName: obj.name
      }
      axios
        .post(`${vueAppHttpPoint}${vueAppEndPoint}/api/file/upload`, data)
        .then(({ data }) => {
          const url = data.url
          let fileToUpload = new File([obj], obj.name, { type: obj.type })

          if (fileTypePartial === 'image') {
            new Compressor(obj, {
              quality: 0.6,
              success(result) {
                fileToUpload = result
              },
              error() {
                reject('Something went wrong when compressing the image')
              }
            })
          }
          const newHeaders = new Headers()
          newHeaders.append('x-amz-acl', 'public-read')
          newHeaders.append('Content-Type', fileToUpload.type)
          fetch(url, {
            method: 'PUT',
            mode: 'cors',
            body: fileToUpload,
            headers: newHeaders
          })
            .then(res => {
              if (res.ok) {
                const objUrl = url.split('?')[0]

                const resPayload = {
                  ok: true,
                  data: { link: objUrl, fileType: obj.type }
                }
                resolve(resPayload)
              } else {
                res.json().then(err => {
                  reject(err)
                })
              }
            })
            .catch(err => {
              reject(err)
            })
        })
        .catch(e => {
          const err = { ok: false, err: e }
          reject(err)
        })
    })
  },

  deleteFileFromS3(_, params) {
    return new Promise((resolve, reject) => {
      axios.post(`http://${process.env.VUE_APP_ENDPOINT}/api/file/delete`, params)
        .then(resolve)
        .catch(reject)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

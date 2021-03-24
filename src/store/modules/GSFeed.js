import { connect } from 'getstream'
import axios from 'axios'
import auth from './Auth'

const defaultState = {
  room: '',
  gsToken: '',
  foreignId: '',
  feed: {},
  currentGroup: '',
  client: {},
  buildActivity: {},
  actionPost: [],
  previewPost: {},
  feedNotification: {},
  timeline: [],
  appGsId: process.env.VUE_APP_GS_ID,
  appId: process.env.VUE_APP_ID,
  comments: [],
  commentsByPage: [],
  myTimeLine: {}
}

const state = () => defaultState

const getters = {
  getFeedNotification: state => state.feedNotification,
  getPreviewPost: state => state.previewPost,
  getBuildActivity: state => state.buildActivity,
  getTimeline: state => state.timeline,
  getActionPost: state => state.actionPost,
  getFeed: state => state.feed,
  getClient: state => state.client,
  getComments: state => state.commentsByPage
}

const mutations = {
  SET_GS_TOKEN: (state, payload) => state.gsToken = payload,
  SET_CLIENT: (state, token) => {
    state.client = connect(process.env.VUE_APP_GS_ID, token, process.env.VUE_APP_ID)
  },
  CREATE_ACTIVITY: (state, payload) => state.buildActivity = payload,
  SET_FEED: async (state, userID) => {
    state.feedNotification = await state.client.feed(
      'notification',
      userID,
      state.gsToken
    )
    state.feed = await state.client.feed(
      'users',
      userID,
      state.gsToken
    )
  },
  SET_CUSTOM_FEED: async (state, payload) => {
    state.feed = await state.client.feed(
      payload.type,
      payload.userId,
      state.gsToken
    )
    state.currentGroup = payload.id
  },
  SET_BUILDER_FEED: async (state, appId) => {
    state.foreignId = appId
    state.feed = await state.client.feed(
      'AppBuilder',
      appId,
      state.gsToken
    )
  },
  SET_COMPANIES_FEED: async (state, feedID) => {
    state.feedNotification = await state.client.feed(
      'notification',
      feedID,
      state.gsToken
    )
    state.feed = await state.client.feed(
      'companies',
      feedID,
      state.gsToken
    )
  },
  SET_CPM_FEED: async (state, cpmID) => {
    state.foreignId = cpmID
    state.feedNotification = await state.client.feed(
      'notification',
      cpmID,
      state.gsToken
    )
    state.feed = await state.client.feed(
      'cpm',
      cpmID,
      state.gsToken
    )
  },
  SET_ROOM: (state, payload) => state.room = payload,
  SET_TIMELINE: (state, payload) => state.timeline = payload,
  SET_PREVIEW_POST: (state, payload) => state.previewPost = payload,
  SET_USER: async (state, payload) => {
    await state.client.setUser(
      payload,
      state.gsToken
    )
  },
  UPDATE_USER: (state, payload) => {
    state.client.user(payload['id']).update(payload)
  },
  SET_COMMENTS: (state, payload) => {
    state.comments = payload
  },
  SET_COMMENTS_BY_PAGE: (state, payload) => {
    state.commentsByPage = state.comments.slice((payload * 5), (payload * 5) + 5)
  },
  SET_EMPTY_ACTION_POST: state => {
    state.actionPost = []
  },
  SET_ACTION_POST: (state, payload) => {
    if (!payload) {
      return
    }
    state.actionPost.splice(0, 1, payload)
  },
  SET_MY_TIMELINE: (state, payload) => state.myTimeLine = payload
}

const actions = {
  setMyTimeline({ state, commit, rootState }) {
    const payload = state.client.feed('user', rootState.Auth.user.id)
    commit('SET_MY_TIMELINE', payload)
  },
  addChildReaction({ state }, comment) {
    return new Promise(resolve => {
      state.client.reactions.addChild('like', comment, state.client.id).then(response => {
        resolve(response)
      })
    })
  },
  createActivity({ commit }, data) {
    commit('CREATE_ACTIVITY', data)
  },
  addChildReactionComment({ state }, { comment, text }) {
    return new Promise(resolve => {
      state.client.reactions.addChild(
        'comment',
        comment,
        state.client.id
      ).then(response => {
        state.client.reactions.update(response.id, {
          'text': text
        }).then(res => {
          resolve(res)
        })
      })
    })
  },
  async setPreviewPost({ state, commit }, payload) {
    const res = await axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/get_feed/${payload}/${state.room}`)

    commit('SET_PREVIEW_POST', res['data'])
  },
  addReaction({ state }, { type, id, whoNotify, options = null }) {
    return new Promise(resolve => {
      state.client.reactions.add(type, id, options, {
        targetFeeds: [`notification:${whoNotify}`]
      }).then(response => {
        resolve(response)
      })
    })
  },
  addActivity({ state }, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      payload['req']['room'] = state.room
      payload['req']['data']['time'] = new Date().toISOString()
      payload['req']['data']['foreign_id'] = `${Date.now()}-post-${Math.floor(Math.random() * 9999999)}`
      if (state.room === 'companies') {
        payload['req']['data']['to'] = ['companies:' + payload['compID']]
        payload['req']['data']['company'] = payload['compID']
      } else if (state.room === 'cpm') {
        payload['req']['data']['to'] = ['cpm:' + state.foreignId]
        payload['req']['data']['cpm'] = state.foreignId
      } else if (state.room === 'AppBuilder') {
        payload['req']['data']['to'] = ['AppBuilder:' + state.foreignId]
        payload['req']['data']['AppBuilder'] = state.foreignId
      } else if (state.room === 'groups') {
        payload['req']['data']['to'] = ['groups:' + state.currentGroup]
        payload['req']['data']['groups'] = state.currentGroup
      }
      const activity = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/feed/activity`, {
        ...payload['req']
      })
      resolve(activity)
    })
  },
  getGSFeedToken({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/getGSFeedToken`, {
        id: payload.id
      }).then(({ data }) => {
        commit('SET_GS_TOKEN', data.token)
        commit('SET_CLIENT', data.token)
        resolve(data.token)
      }).catch(e => reject(e))
    })
  },
  removeActivity({ state }, id) {
    return new Promise(resolve => {
      state.feed.removeActivity(id).then(response => {
        resolve(response)
      })
    })
  },
  updateActivity(_, updateProperties) {
    updateProperties.token = auth.state.user.id

    return new Promise(resolve => {
      axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/feed/activity`, updateProperties).then(() => {
        resolve(true)
      })
    })
  },
  removeReaction({ state }, id) {
    return new Promise(resolve => {
      state.client.reactions.delete(id).then(response => {
        resolve(response)
      })
    })
  },
  updateReaction({ state }, { id, text }) {
    return new Promise(resolve => {
      state.client.reactions.update(id, { 'text': text }).then(response => {
        resolve(response)
      })
    })
  },
  retrieveFeed({ state, commit }) {
    // TODO: refactor this function
    return new Promise((resolve, reject) => {
      if (state.room === 'companies') {
        const comp = auth.state.user.currentCompany

        if (comp) {
          axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/feed/activities/${state.room}/${comp}`).then(res => {
            state.timeline = []
            commit('SET_TIMELINE', res.data)
            resolve(true)
          }).catch(e => reject(e))
        }
      } else if (state.room === 'cpm') {
        const url = `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/feed/activities/cpm/${state.foreignId}`

        axios.get(url).then(res => {
          state.timeline = []
          commit('SET_TIMELINE', res.data)
          resolve(true)
        }).catch(e => reject(e))
      } else if (state.room === 'AppBuilder') {
        const url = `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/feed/activities/AppBuilder/${state.foreignId}`

        axios.get(url).then(res => {
          state.timeline = []
          commit('SET_TIMELINE', res.data)
          resolve(true)
        }).catch(e => reject(e))
      } else if (state.room === 'groups') {
        const url = `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/feed/activities/groups/${state.currentGroup}`
        axios.get(url).then(res => {
          state.timeline = []
          commit('SET_TIMELINE', res.data)
          resolve(true)
        }).catch(e => reject(e))
      } else {
        state.feed.get({
          reactions: { own: true, recent: true, counts: true }
        }).then(({ results }) => {
          state.timeline = []
          commit('SET_TIMELINE', results)
          resolve(true)
        }).catch(e => reject(e))
      }
    })
  },
  cleanFeed({ commit }) {
    commit('SET_TIMELINE', [])
  },
  retrieveActivityReactions({ state, commit }, id) {
    return new Promise((resolve, reject) => {
      state.client.reactions.filter({
        'activity_id': id,
        'kind': 'comment',
        'limit': 999999
      }).then(res => {
        commit('SET_COMMENTS', res.results)
        commit('SET_COMMENTS_BY_PAGE', 0)
        resolve(res.results)
      }).catch(e => reject(e))
    })
  },
  getCommentsByPage({ commit }, page) {
    commit('SET_COMMENTS_BY_PAGE', page)
  },
  retrieveChildReactions({ state }, reactionId) {
    return new Promise(resolve => {
      state.client.reactions.filter({
        'reaction_id': reactionId,
        'kind': 'comment'
      }).then(res => {
        resolve(res)
      })
    })
  },
  followUser({ state }, { type, id }) {
    return new Promise(resolve => {
      state.state.client.feed.follow(type, id)
      resolve(true)
    })
  },
  setFeed({ commit }, payload) {
    return new Promise(resolve => {
      commit('SET_FEED', payload)
      resolve(true)
    })
  },
  setCustomFeed({ commit }, payload) {
    commit('SET_CUSTOM_FEED', payload)
  },
  setCompanyFeed({ commit }, payload) {
    return new Promise(resolve => {
      commit('SET_COMPANIES_FEED', payload)
      resolve(true)
    })
  },
  setBuilderFeed({ commit }, payload) {
    return new Promise(resolve => {
      commit('SET_BUILDER_FEED', payload)
      resolve(true)
    })
  },
  setCpmFeed({ commit }, payload) {
    return new Promise(resolve => {
      commit('SET_CPM_FEED', payload)
      resolve(true)
    })
  },
  setUser({ commit }, payload) {
    return new Promise(resolve => {
      commit('SET_USER', payload)
      resolve(true)
    })
  },
  setRoom({ commit }, slugRoom) {
    commit('SET_ROOM', slugRoom)
  },
  updateUser({ commit }, payload) {
    return new Promise(resolve => {
      commit('UPDATE_USER', payload)
      resolve(true)
    })
  },
  setEmptyActionPost({ commit }) {
    commit('SET_EMPTY_ACTION_POST')
  },
  setActionPost({ commit }, payload) {
    return new Promise(resolve => {
      commit('SET_ACTION_POST', payload)
      resolve(true)
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

import axios from 'axios'
import { StreamChat } from 'stream-chat'

const defaultState = {
  gsToken: '',
  chats: [],
  client: {},
  connections: [],
  users: [],
  newChannel: {},
  messengerActiveChat: {}
}
const state = () => defaultState

const getters = {
  gsToken: state => state.gsToken,
  chats: state => state.chats,
  client: state => state.client,
  connections: state => state.connections,
  users: state => state.users,
  newChannel: state => state.newChannel,
  currentMessengerChat: state => state.messengerActiveChat
}

const mutations = {
  SET_GS_TOKEN: (state, payload) => (state.gsToken = payload),
  PUSH_CHAT: (state, payload) => {
    if (!state.chats.includes(payload)) {
      if (state.chats.length > 4) {
        state.chats.shift()
      }
      state.chats.push(payload)
    }
  },
  SET_MESSENGER_CHAT: (state, selectedChat) => {
    state.messengerActiveChat = selectedChat
  },
  REMOVE_CHAT: (state, payload) => {
    const channel = state.chats.find(chat => chat.id === payload)
    const index = state.chats.indexOf(channel)
    if (index > -1) {
      state.chats[index].stopWatching()
      state.chats.splice(index, 1)
    }
  },
  DELETE_CHAT: (state, payload) => {
    const channel = state.chats.find(chat => chat.id === payload)
    const index = state.chats.indexOf(channel)

    if (index > -1) {
      state.chats.splice(index, 1)
    }
  },
  SET_CHATS: (state, payload) => (state.chats = payload),
  SET_CLIENT: state => {
    state.client = new StreamChat(process.env.VUE_APP_GS_ID, null, {
      // logger: (type, msg) => {
      //   console.log(msg)
      // }
    })
  },
  SET_USER: async (state, payload) => {
    await state.client.setUser(payload, state.gsToken)
  },
  REMOVE_USER: async state => {
    await state.client.disconnect()
    await state.client.wsConnection.disconnect()
  },
  REMOVE_MESSAGE: async (state, msgId) => {
    await state.client.deleteMessage(msgId)
  },
  EDIT_MESSAGE: async (state, data) => {
    await state.client.updateMessage(data)
  },
  SET_MY_CONNECTIONS: (state, payload) => {
    state.connections = payload
  },
  SET_ALL_USERS: (state, payload) => {
    state.users = payload.users
  },
  PUSH_CONNECTION: (state, payload) => {
    state.connections.push(payload)
  },
  PUSH_NEW_CHANNEL: (state, payload) => {
    state.newChannel = payload
  },
  RESET_NEW_CHANNEL: state => {
    state.newChannel = {}
  }
}

const actions = {
  createChat({ state, commit, dispatch }, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      if (payload.isForMessenger) {
        dispatch('resetActiveMessengerChat')
      }
      const conversation = state.client.channel('messaging', null, {
        members: payload.members
      })
      await conversation.create()

      const connection = state.connections.find(
        item => item.id === conversation.id
      )

      if (connection !== undefined) {
        if (payload.isForMessenger) {
          dispatch('setActiveMessengerChat', connection)
        } else {
          commit('PUSH_CHAT', connection)
        }
      } else {
        if (payload.isForMessenger) {
          dispatch('setActiveMessengerChat', conversation)
        } else {
          commit('PUSH_CHAT', conversation)
        }
        commit('PUSH_CONNECTION', conversation)
      }
      resolve(true)
    })
  },
  makeGroupChat({ state, commit }, payload) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const conversation = state.client.channel(
          'messaging',
          `${Date.now()}-group-${Math.floor(Math.random() * 999999)}`,
          {
            name: payload.name,
            image: payload.image,
            members: payload.members
          }
        )

        await conversation.create()

        const connection = state.connections.find(
          item => item.id === conversation.id
        )

        if (connection !== undefined) {
          commit('PUSH_CHAT', connection)
        } else {
          commit('PUSH_CHAT', conversation)
          commit('PUSH_CONNECTION', conversation)
          commit('PUSH_NEW_CHANNEL', conversation)
        }
        resolve(true)
      } catch (e) {
        console.error(e)
        reject(e)
      }
    })
  },
  getGSToken({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/getGSToken`,
          {
            id: payload.id
          }
        )
        .then(({ data }) => {
          commit('SET_GS_TOKEN', data.token)
          commit('SET_CLIENT')
          resolve(data.token)
        })
        .catch(e => reject(e))
    })
  },
  pushChat({ commit, dispatch }, selectedChat) {
    return new Promise(resolve => {
      commit('PUSH_CHAT', selectedChat)
      dispatch('resetActiveMessengerChat')
      dispatch('setActiveMessengerChat', selectedChat)
      resolve(true)
    })
  },
  resetActiveMessengerChat({ commit }) {
    return new Promise(resolve => {
      commit('SET_MESSENGER_CHAT', {})
      resolve(true)
    })
  },
  setActiveMessengerChat({ commit }, payload) {
    return new Promise(resolve => {
      commit('SET_MESSENGER_CHAT', payload)
      resolve(true)
    })
  },
  removeClient({ commit }) {
    return new Promise(resolve => {
      commit('REMOVE_USER')
      resolve(true)
    })
  },
  removeMessage({ commit }, msgID) {
    return new Promise(resolve => {
      commit('REMOVE_MESSAGE', msgID)
      resolve(true)
    })
  },
  updateMessage({ commit }, info) {
    return new Promise(resolve => {
      commit('EDIT_MESSAGE', info)
      resolve(true)
    })
  },
  sendReaction(_, { channel, id, emoji }) {
    return new Promise(resolve => {
      channel
        .sendReaction(
          id,
          {
            type: emoji.aliases[0],
            myCustomField: emoji.data
          },
          null,
          true
        )
        .then(() => {
          resolve(true)
        })
    })
  },
  deleteReaction(_, { channel, id, emoji }) {
    return new Promise(resolve => {
      channel.deleteReaction(id, emoji.aliases[0]).then(() => {
        resolve(true)
      })
    })
  },
  removeChat({ commit }, payload) {
    return new Promise(resolve => {
      commit('REMOVE_CHAT', payload)
      resolve(true)
    })
  },
  deleteChat({ commit }, payload) {
    return new Promise(resolve => {
      commit('DELETE_CHAT', payload)
      resolve(true)
    })
  },
  async retrieveChats({ state, commit }, payload) {
    const filter = {
      type: 'messaging',
      members: {
        $in: [payload]
      }
    }
    // eslint-disable-next-line camelcase
    const sort = { created_at: -1 }

    const channels = await state.client.queryChannels(filter, sort, {
      watch: false,
      presence: true,
      state: false
    })

    const users = await state.client.queryUsers({ name: { $ne: '' } })

    commit('SET_MY_CONNECTIONS', channels)
    commit('SET_ALL_USERS', users)
  },
  setUser({ commit }, payload) {
    return new Promise(resolve => {
      commit('SET_USER', payload)
      resolve(true)
    })
  },
  sendMessage(_, { channel, message }) {
    return new Promise((resolve, reject) => {
      channel
        .sendMessage({
          text: message
        })
        .then(response => resolve(response))
        .catch(e => reject(e))
    })
  },
  quoteMessage(_, { channel, quoteMessageId, quoteMessage }) {
    return new Promise((resolve, reject) => {
      channel
        .sendMessage({
          text: quoteMessage,
          quoted_message_id: quoteMessageId
        })
        .then(response => resolve(response))
        .catch(e => reject(e))
    })
  },
  resetNewChannel({ commit }) {
    commit('RESET_NEW_CHANNEL')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

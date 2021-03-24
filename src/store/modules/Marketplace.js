import axios from 'axios'

const state = {}

const getters = {}

const mutations = {}

const actions = {
    getMarketplaces(_) {
        return new Promise( (resolve, reject) => {
            axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/marketplaces`)
            .then( ({ data }) => resolve(data))
            .catch( e => reject(e) )
        })
    },
    
    
    getSingleMarketplace(_, id) {
        return new Promise( (resolve, reject) => {
            axios.get(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/marketplaces/${id}`)
            .then( ({ data }) => resolve(data))
            .catch( e => reject(e) )
        })
    },


    createMarketplace(_, payload) {
        return new Promise( (resolve, reject) => {
            axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/marketplaces`, payload)
            .then( ({ data }) => resolve(data))
            .catch( e => reject(e) )
        })
    },


    updateMarketplace(_, payload) {
        return new Promise( (resolve, reject) => {
            axios.put(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/marketplaces/${payload.id}`, payload)
            .then( ({ data }) => resolve(data))
            .catch( e => reject(e) )
        })
    },

    deleteMarketplace(_, id) {
        return new Promise( (resolve, reject) => {
            axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/marketplaces/${id}`)
            .then( ({ data }) => resolve(data))
            .catch( e => reject(e) )
        })
    },

    createMarketplaceMedia(_, { marketplaceID, headers, file } = {}) {
        return new Promise( (resolve, reject) => {
            axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/marketplaces/${marketplaceID}/media`, file.file, {
                headers
            })
            .then( ({ data }) => resolve(data))
            .catch( e => reject(e) )
        })
    },


    deleteMarketplaceMedia(_, { marketplaceID, mediaID } = {}) {
        return new Promise( (resolve, reject) => {
            axios.delete(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/marketplaces/${marketplaceID}/media/${mediaID}`)
            .then( ({ data }) => resolve(data))
            .catch( e => reject(e) )
        })
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
import axios from 'axios'

const state = {
    categories: [],
    apps: [],
    marketplaces: [],
    worksCategories: [],
    audienceCategories: [],

    cart: {
        items: [
            {
                title: 'Works Premium',
                category: 'licenses',
                quantity: 5,
                price: 300,
                id: 1
            },
            {
                title: 'Pretty Forms',
                category: 'add-ons',
                quantity: 5,
                price: 300,
                id: 1
            },
        ]
    }
}

const mutations = {
    setCategories(state, payload) {
        state.categories = payload
    },
    addCartItem(state, payload) {
        state.cart.items.push(payload)
    }
}

const actions = {
    fetchCategories({ commit }) {
        //axios.get()
    },

    addToCart({ commit }, item) {
        if (!item) return false
        commit('addCartItem', item)
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
}
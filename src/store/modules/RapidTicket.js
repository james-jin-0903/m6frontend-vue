import axios from 'axios';
import { dataGet } from '@/utils/helpers'

const state = {
    emojis: [
        { emoji: '&#129324;', level: 6, text: 'Upset' }, // angry cursing face
        { emoji: '&#129298;', level: 5, text: 'Frustrated' }, // sick face with thermometer
        { emoji: '&#128580;', level: 4, text: 'Not Sure' }, // rolling eyes face
        { emoji: '&#128577;', level: 3, text: 'Sad' }, // frowney face
        { emoji: '&#129319;', level: 2, text: 'Looking Good' }, // bandaged face
        { emoji: '&#128578;', level: 1, text: 'Happy' } // smiley face
    ],
    ratings: [
        { color: '#C62828', level: 6, text: 'Stopped Working' }, // red darken-3
        { color: '#EF6C00', level: 5, text: 'Clunky' }, // orange darken-3
        { color: '#F9A825', level: 4, text: 'It Works' }, // yellow darken-3
        { color: '#1565C0', level: 3, text: 'I Wish You Could' }, // blue darken-3
        { color: '#2E7D32', level: 2, text: 'Good' }, // green darken-3
        { color: '#6A1B9A', level: 1, text: 'Experience Is Awesome' } // purple darken-3
    ],
}

const getters = {}

const mutations = {}

const actions = {
    createRapidTickets( _, rapidTickets ) {
        return new Promise( (resolve, reject) => {
            axios.post(`http://${process.env.VUE_APP_ENDPOINT}/api/rapid/ticket`, { rapidTickets })
            .then( ({ data }) => resolve(data))
            .catch( e => reject(e) )
            
        })
    },

    getList(_) {
        return new Promise( (resolve, reject) => {
            axios.get(`http://${process.env.VUE_APP_ENDPOINT}/api/rapid`)
            .then( ({data}) => resolve(data))
            .catch( e => reject(e) )
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

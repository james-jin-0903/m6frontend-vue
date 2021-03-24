import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from '../store/index'

Vue.use(VueAxios, axios)

axios.defaults.baseURL = process.env.VUE_APP_ENDPOINT
axios.defaults.headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${store.state.Auth.AccessToken}`
}

export { axios }

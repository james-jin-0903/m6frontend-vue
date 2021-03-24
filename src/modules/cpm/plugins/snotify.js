import Vue from 'vue'
import Snotify, { SnotifyPosition } from 'vue-snotify'
import 'vue-snotify/styles/material.scss'
const snotifyOptions = {
  toast: {
    position: SnotifyPosition.rightBottom,
    closeOnClick: true,
    timeout: 2500
  }
}
Vue.use(Snotify, snotifyOptions)

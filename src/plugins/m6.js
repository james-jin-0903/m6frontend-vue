import Vue from 'vue'
// place for custom components that will be shared across the app

import m6Loading from '@/components/_partials/M6Loading'
import M6Notification from '@/components/_partials/M6Notification'
import M6Upload from '@/components/_partials/M6Upload'
import GMap from '@/components/_partials/GMap'
import DefaultM6Modal from '@/components/user/settings/modals/DefaultM6Modal'

Vue.component(m6Loading.name, m6Loading)
Vue.component(M6Notification.name, M6Notification)
Vue.component(M6Upload.name, M6Upload)
Vue.component(GMap.name, GMap)
Vue.component(DefaultM6Modal.name, DefaultM6Modal)


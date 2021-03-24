import InfiniteLoading from 'vue-infinite-loading'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import App from './App.vue'
import Vue from 'vue'
import lineClamp from 'vue-line-clamp'
import Helpers from './utils/helpers'
import { i18n } from './plugins/i18n'
import './plugins'
import './modules/cpm/plugins'
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib'
import VueKonva from 'vue-konva'
import VueCarousel from 'vue-carousel'
import VueYouTubeEmbed from 'vue-youtube-embed'
import VueSocialSharing from 'vue-social-sharing'
import VueQRCodeComponent from 'vue-qrcode-component'
import Treeselect from '@riophae/vue-treeselect'
import DatetimePicker from 'vuetify-datetime-picker'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

Vue.component('treeselect', Treeselect)

Vue.use(VueCarousel)

Vue.use(DatetimePicker)

Vue.use(VueYouTubeEmbed)

Vue.use(Helpers)

Vue.config.productionTip = false
// Vue.config.silent = true

Vue.use(InfiniteLoading)

Vue.component('qr-code', VueQRCodeComponent)

Vue.use(lineClamp)

Vue.use(VueTelInputVuetify, {
  vuetify
})

Vue.use(VueKonva)

Vue.use(VueSocialSharing)

import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GMAPS_KEY,
    libraries: 'places'
  },
  installComponents: false
})

Vue.component('google-info-window', VueGoogleMaps.InfoWindow)
Vue.component('google-map', VueGoogleMaps.Map)
Vue.component('google-marker', VueGoogleMaps.Marker)
Vue.component('google-autocomplete', VueGoogleMaps.Autocomplete)

String.prototype.trunc =
  function (n) {
    return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '')
  }

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')

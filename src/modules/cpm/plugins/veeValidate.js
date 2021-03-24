import Vue from 'vue'
import * as VeeValidate from 'vee-validate/dist/vee-validate.full'
Vue.use(VeeValidate, { delay: 100 })
Vue.component('ValidationObserver', VeeValidate.ValidationObserver)
Vue.component('ValidationProvider', VeeValidate.ValidationProvider)

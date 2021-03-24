<template>
  <v-container fluid
    class="d-flex red vertical-hidden h-vh w-full marketplace-container ma-0 pb-0 pt-5 px-0"
  >
    <v-col cols='3' :class='[themeCommon.background, themeCommon.border]'>
      <sidebar></sidebar>
    </v-col>
    <v-col cols='9' class="pa-0 h-vh" :class='themeCommon.background'>
      <component :is='getView'></component>
    </v-col>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import Home from "./Home";
import Sidebar from './Sidebar'
import Cart from './Cart'
import App from './App'

export default {
  name: 'Marketplace',
  components: {
    Home,
    Sidebar,
    App,
    Cart//move app and home to Pages dir
  },
  data: () => ({}),
  computed: {
    ...mapState('PageControl', {
      showSidePanel: 'showSidePanel'
    }),
    getView() {
      let pages = {
        'default': Home,
        'app': App,
        'cart': Cart,
      }
      return pages[this.$route.meta?.page] || pages['default']
    },
    themeCommon() {
      return {
          text: this.$vuetify.theme.dark ? 'white--text' : '',
          background: this.$vuetify.theme.dark ? 'bg-container' : 'white',
          border: this.$vuetify.theme.dark ? 'border-dark' : 'border-light'
      }
    }
  },
  mounted() {
    this.setShowSidePanels(false)
  },
  beforeDestroy() {
    this.$vuetify.theme.dark = false
    this.setShowSidePanels(true)
  },
  methods: {
    ...mapMutations('PageControl', {
      setShowSidePanels: 'setShowSidePanels'
    })
  },
};
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;500;700;900&display=swap')

$accent: #FFFFFF
$container: #18191a
$content: #242526

.bg-accent
    background-color: $accent

.bg-container
    background-color: $container !important

.bg-content
    background-color: $content

.h-vh
  height: 100vh
.marketplace-container, .marketplace-container *
  font-family: 'M PLUS 1p', sans-serif

.vertical-hidden
  overflow-y: hidden

.border-dark
  border-right: 1px solid $content

.v-application .white .border-light
  border-right: 1px solid lightgray !important

.v-btn.v-btn--outlined
  border: thin solid #EDEDED !important

</style>

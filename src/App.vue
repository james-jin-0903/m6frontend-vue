<template>
  <v-app id="complete-app">
    <template v-if="$route.meta.rawTemplate || (pagePathName.indexOf('/video-call') === 0)">
      <template v-if="$route.meta.rawTemplate">
        <router-view />
      </template>
      <template v-else>
        <div
          class="align-center blue-grey d-flex darken-4 flex-column justify-center"
          style="width: 100vw;height: 100vh;padding: 45px"
        >
          <div class="mb-4 text-center white--text">
            If the <b class="white--text">call settings popup</b> doesn't appear in {{ secondsBackCounter }} seconds,<br> Please press the <b class="light-blue--text">Reload</b> button.<br>
            <span class="caption white--text"><b class="white--text">(Reason:</b> Sometimes app couldn't fetch resource properly.)</span>
          </div>
          <v-btn
            color="light-blue"
            dark
            rounded
            @click="reloadCurrentPage"
          >
            <v-icon left>
              mdi-reload
            </v-icon>
            Reload
          </v-btn>
        </div>
      </template>
    </template>

    <template v-else>
      <div class="grey h-full lighten-3">
        <template v-if="loggedIn && (!$route.meta.public || $route.meta.topNav)">
          <top-nav />
          <template v-if="$route.meta.topNav">
            <router-view class="top-60" />
          </template>
          <template v-else>
            <v-row
              class="grey lighten-3 mx-auto nav-content relative w-full"
              no-gutters
            >
              <div
                v-if="showPanels && $route.meta.page !== 'records'"
                class=""
              >
                <action-feed
                  v-if="showSidePanels"
                  class="fixed left-0 max-w-side mt-60 top-0 w-side"
                  :class="{'d-none': $vuetify.breakpoint.mdAndDown, 'w-side': $vuetify.breakpoint.lgAndUp}"
                />
                <m6-chat
                  class="fixed mt-60 right-0 top-0"
                  :class="{'d-none': $vuetify.breakpoint.xs, 'w-2__5': $vuetify.breakpoint.mdAndDown, 'w-side': $vuetify.breakpoint.lgAndUp }"
                />
              </div>

              <div
                v-if="showSidePanels"
                class="d-flex mt-60 w-full"
                :class="!$vuetify.breakpoint.mdAndDown ? 'justify-center' : 'justify-start'"
              >
                <router-view />
              </div>
              <v-col
                v-else
                cols="12"
              >
                <!-- Home / Company Profile -->
                <router-view class="mt-60" />
              </v-col>
            </v-row>
            <!-- Preview overlay -->
            <chat-wrapper />
            <general-overlay />
          </template>
          <footer-nav />
        </template>
        <template v-else>
          <router-view />
        </template>
      </div>
      <vue-snotify />
      <m6-notification
        :danger="notifDanger"
        :snackbar="notifShow"
        :success="notifSuccess"
        :text="notifText"
        top
        @closing="notifClose"
      />
      <loading />
    </template>
  </v-app>
</template>

<script>
import TopNav from '@/views/Home/TopNav'
import FooterNav from '@/views/Home/FooterNav'
import ActionFeed from '@/views/Home/ActionFeed'
import M6Chat from '@/components/Home/M6Chat'
import ChatWrapper from '@/components/Home/M6Chat/ChatWrapper'
import GeneralOverlay from '@/components/Shared/GeneralOverlay'
import Loading from '@/components/_partials/M6LoadingV2'
import { mapState, mapGetters, mapMutations } from 'vuex'
// mapActions
export default {
  name: 'App',
  components: {
    TopNav,
    FooterNav,
    ActionFeed,
    M6Chat,
    ChatWrapper,
    GeneralOverlay,
    Loading
  },
  data: () => ({
    pagePathName: '/',
    secondsBackCounter: 20
  }),
  computed: {
    ...mapState(['layout']),
    ...mapGetters('Auth', {
      loggedIn: 'loggedIn'
    }),
    ...mapGetters('PageControl', {
      showSidePanels: 'getShowSidePanels',
      showChatPanel: 'getShowChatPanel'
    }),
    ...mapState('SnackBarNotif', {
      notifShow: 'notifShow',
      notifSuccess: 'notifSuccess',
      notifDanger: 'notifDanger',
      notifText: 'notifText'
    }),
    showPanels: function () {
      return this.showChatPanel || this.showSidePanels
    }
  },
  mounted: function () {
    this.pagePathName = window.location.pathname
    const _this = this

    if (this.pagePathName.indexOf('/video-call') === 0) {
      const timeInterval = setInterval(function () {
        _this.secondsBackCounter--
        if (_this.secondsBackCounter <= 0 || _this.$route.meta.rawTemplate) {
          clearInterval(timeInterval)

          if (!_this.$route.meta.rawTemplate) {
            _this.reloadCurrentPage()
          }
        }
      }, 1000)
    }
  },
  methods: {
    ...mapMutations('SnackBarNotif', {
      notifClose: 'notifClose'
    }),
    reloadCurrentPage: function () {
      window.location.reload()
    }
  }
}
</script>

<style>
  .max-w-none {
    max-width: none !important;
  }
  #app {
    font-family: 'Raleway', sans-serif;
    font-size: 16px;
  }
  * {
    color: var(--v-secondary-lighten1);
  }
  .central-content {
    height: calc(100vh - 60px);
  }
  .mt-60 {
    margin-top: 60px;
  }
</style>

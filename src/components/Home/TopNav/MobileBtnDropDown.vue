<template>
  <div class="text-center">
    <v-menu
      :close-on-click="closeOnClick"
      offset-y
      top
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          class="blue ml-auto pa-6 white--text"
          :class="{
            'd-none': $vuetify.breakpoint.smAndUp,
          }"
          color="white"
          depressed
          icon
          rounded
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>

      <v-list :style="'background:none !important; box-shadow:none !important;'">
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          class="pa-0"
        >
          <v-list-item-title class="pb-1">
            <v-btn

              :color="item.color"
              dark
              fab
              rounded
              small
              @click="onClickOverlay(item)"
            >
              {{ item.title }}
            </v-btn>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-overlay
      class="record-overlay"
      opacity="0.7"
      :value="chatOverlay"
    >
      <v-row
        class="central-content flex flex-nowrap justify-space-between mx-auto relative top-6 transparent0 w-full"
        no-gutters
      >
        <div class="relative w-full">
          <v-btn
            absolute
            class="blue--text ml-auto pa-6 white"
            color="white"
            depressed
            icon
            right
            rounded
            :style="'top:-30px;'"
            @click="chatOverlay = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <m6-chat
            class="ml-auto"
            :light-mode="true"
            @click.native="chatOverlay = false"
          />
        </div>
      </v-row>
    </v-overlay>
    <v-overlay
      class="record-overlay"
      opacity="0.7"
      :value="actionOverlay"
    >
      <v-row
        class="central-content flex flex-nowrap justify-space-between mx-auto relative top-6 transparent0 w-full"
        no-gutters
      >
        <v-col
          class="dont-show-scroll vertical-scroll"
          cols="12"
          md="3"
        >
          <v-btn
            absolute
            class="blue--text ml-auto pa-6 white"
            color="white"
            depressed
            icon
            right
            rounded
            :style="'top:-30px;'"
            @click="actionOverlay = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <action-feed
            class="mt-6"
            :light-mode="true"
          />
        </v-col>
      </v-row>
    </v-overlay>
  </div>
</template>

<script>
import M6Chat from '@/components/Home/M6Chat'
import ActionFeed from '@/views/Home/ActionFeed'
export default {
  name: 'MobileBtnDropDown',
  components: {
    M6Chat,
    ActionFeed
  },
  props: {
    overlay: {
      type: String,
      default: null
    }
  },
  data: () => ({
    items: [
      { title: '+', type: '', color: 'yellow' },
      { title: 'B', type: 'action', color: 'orange' },
      { title: 'A', type: 'chat', color: 'red' }
    ],
    closeOnClick: true,
    chatOverlay: false,
    actionOverlay: false
  }),
  methods: {
    onClickOverlay(item) {
      switch (item.title) {
        case 'A':
          this.chatOverlay = true
          this.actionOverlay = false
          break
        case 'B':
          this.actionOverlay = true
          this.chatOverlay = false
          break
        default:
          this.actionOverlay = false
          this.chatOverlay = false
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-menu__content,
.v-list-item__title .v-btn--fab.v-btn--contained{
  box-shadow:none !important;
}
.v-list-item__title{
  text-align: right;
}
</style>

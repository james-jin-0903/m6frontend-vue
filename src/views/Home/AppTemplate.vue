<template>
  <div>
    <div @click="dialog = true">
      <slot name="actionbtn" />
    </div>
    <template>
      <slot
        v-if="navHeader"
        name="navheader"
      />
      <v-row
        v-if="dialog"
        id="record-header"
        class="dont-show-scroll mx-0 vertical-scroll"
      >
        <v-card
          class="grey lighten-3 relative w-full"
          tile
        >
          <div
            class="w-full white"
          >
            <slot name="header" />
            <v-divider class="blue-grey lighten-5 max-w-lg mx-auto w-full" />
            <div class="align-center d-flex justify-space-between max-w-lg mx-auto w-full">
              <slot name="tabs" />
              <v-spacer />
              <slot name="btns" />
            </div>
          </div>
          <div
            class="details-content grey h-fit lighten-3 min-h-full relative"
            :style="'padding-top: 16px; min-height: 80vw'"
          >
            <v-row
              class="align-start d-flex justify-space-between mt-0 mx-auto w-full"
              :class="{'max-w-lg': !website}"
            >
              <slot name="content" />
            </v-row>
          </div>
        </v-card>
        <v-btn
          v-show="!chatOverlay"
          bottom
          class="blue ml-auto pa-6 white--text"
          color="white"
          depressed
          fixed
          icon
          right
          rounded
          @click="chatOverlay = true"
        >
          <v-icon>mdi-message</v-icon>
        </v-btn>
        <v-overlay
          class="record-overlay"
          opacity="0.7"
          :value="chatOverlay"
        >
          <v-row
            class="central-content flex flex-nowrap justify-space-between mx-auto relative top-6 transparent0 w-full"
            no-gutters
          >
            <v-col
              cols="9"
            />
            <div
              class="relative w-side"
            >
              <v-btn
                absolute
                class="blue--text ml-auto pa-6 white"
                color="white"
                depressed
                icon
                left
                rounded
                :style="'left: -50px; top: 6px;'"
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
      </v-row>
    </template>
  </div>
</template>

<script>
import ActionFeed from '@/views/Home/ActionFeed'
import M6Chat from '@/components/Home/M6Chat'
export default {
  name: 'AppTemplate',
  components: {
    ActionFeed,
    M6Chat
  },
  props: {
    website: {
      type: Boolean,
      default: false
    },
    propsDialog: {
      type: Boolean,
      default: false
    },
    isPersistent: {
      type: Boolean,
      default: false
    },
    openDialog: {
      type: Boolean,
      default: false
    },
    navHeader: {
      type: Boolean,
      default: false
    },
    ctmTop: {
      type: Number,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    chatOverlay: false
  }),
  watch: {
    propsDialog(val) {
      this.dialog = val
    }
  },
  created() {
    this.dialog = this.openDialog
  }
}
</script>

<style lang="scss">
.spacing-tight {
  letter-spacing: 1px;
}
.links {
  transition: height 5s;
  height: 150px;
  overflow: hidden;
  -webkit-transition: height 0.5s ease;
  -moz-transition: height 0.5s ease;
  -o-transition: height 0.5s ease;
  transition: height 0.5s ease;
}
.active-tab-company {
  border-bottom: 3px solid rgb(49, 174, 220);
}
.v-dialog--scrollable {
  position: absolute;
  top: 60px;
  height: calc(100vh - 60px) !important;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: scroll;
}
.v-dialog--scrollable::-webkit-scrollbar {
  width: 0px;
}
.add-field .v-input input {
    border-bottom: 1px solid #F8F3EC;
    margin-bottom: -1px;
}
.panel {
    min-height: 300px;
}
.v-tabs-slider {
    color: #2196F3;
}
#record-header {
  margin-top: 0;
}
.record-overlay .v-overlay__content {
  width: 100%;
  height: 100%;
  top: 60px;
}
.top-1{
  top: 150px;
}
.ctm-top {
  top: 25px;
}
</style>

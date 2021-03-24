<template>
  <div>
    <v-dialog
      v-model="dialog"
      class="dont-show-scroll vertical-scroll mytest"
      fullscreen
      hide-overlay
      scrollable
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-text>
          <v-stepper v-model="stepperStep">
            <v-stepper-header>
              <template v-for="(tab, i) in filteredTabList">
                <v-stepper-step
                  :key="`stepper-step-${i}`"
                  :complete="stepperStep > i"
                  :step="i"
                  editable
                >
                  {{ tab.title }}
                </v-stepper-step>
                <v-divider
                  v-if="i < app.tabs.length - 1"
                  :key="`stepper-divider-${i}`"
                />
              </template>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content
                v-for="(tab, i) in filteredTabList"
                :key="`stepper-content-${i}`"
                :step="i"
              >
                <v-card
                  class="pa-2 stepper-content-card"
                >
                  <form-show-generator
                    :activate-stepper-save=" i == stepperStep ? activateSave : false"
                    :fields="$h.dg(tab, 'panels.0.fields', [])"
                    :filled-in-fields="false"
                    inherited-edit-mode
                    :panel="$h.dg(tab, 'panels.0', [])"
                    :show-outer-labels="false"
                    stepper-show
                    @closing="goingToNextStep"
                  />
                </v-card>

                <div class="flex-center pt-2">
                  <v-btn
                    v-show="stepperStep > 0"
                    text
                    @click="stepperStep = i - 1; finished = false"
                  >
                    back
                  </v-btn>

                  <v-btn
                    v-if="!finished"
                    color="primary"
                    outlined
                    @click="continueToNextStep(i, tab)"
                  >
                    Continue <v-icon>mdi-arrow-right-thick</v-icon>
                  </v-btn>

                  <v-btn
                    v-else
                    class="white--text"
                    color="green darken-2"
                    outlined
                    @click="emptySave"
                  >
                    Save
                  </v-btn>
                </div>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import FormShowGenerator from '@/components/AppBuilder/Form/FormShowGenerator.vue'

export default {
  name: 'index',
  components: {
    FormShowGenerator
  },
  data: () => ({
    dialog: true,
    e1: 1,
    stepperStep: 0,
    activateSave: false,
    finished: false
  }),

  computed: {
    ...mapState('AppBuilder', {
      app: 'app'
    }),

    filteredTabList() {
      return this.$h.dg(this.app, 'tabs', []).filter(t => t.title.toLowerCase() != 'home')
    }
  },

  methods: {
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    emptySave() {
      this.notifSuccess('Saved!')
    },
    continueToNextStep(i, tab) {
      if (i === this.stepperStep) this.activateSave = true
    },
    goingToNextStep() {
      if (this.stepperStep < this.filteredTabList.length - 1) {
        this.stepperStep = this.stepperStep + 1
      } else {
        this.finished = true
      }
      this.activateSave = false
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-center {
  display: flex;
  display: -webkit-flex;
  display: -ms-flexbox;
  justify-content: center;
}
.stepper-content-card {
  overflow: auto;
  height: 60vh;
}
</style>

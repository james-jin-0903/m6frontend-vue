<template>
  <v-container
    class="fill-height pa-0 rounded-lg"
    fluid
  >
    <v-row class="fill-height">
      <v-col
        class="fill-height hidden-sm-and-down pa-0 rel"
        md="6"
      >
        <left-side-screen />
      </v-col>

      <v-col
        class="d-flex right-background"
        cols="12"
        md="6"
      >
        <v-row>
          <v-col class="d-flex">
            <v-row>
              <v-col
                cols="12"
              >
                <v-col class="overflow-hidden">
                  <slot name="nav-btn" />
                </v-col>

                <v-col>
                  <slot name="header" />
                </v-col>

                <slot name="body" />


                <v-col class="d-flex justify-center">
                  <router-link
                    class="text-dec-none"
                    :to="{ name: 'auth.ForgotPassword' }"
                  >
                    <v-btn
                      class="custom-blue-text"
                      text
                    >
                      Forgot Your Password?
                    </v-btn>
                  </router-link>
                </v-col>

                <v-col>
                  <slot name="action-btn" />
                </v-col>

                <v-col class="d-flex justify-center pa-0">
                  <powered-by-m6 class="bottom-logo mt-6" />
                </v-col>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LeftSideScreen from './LeftSideScreen'
import PoweredByM6 from './PoweredByM6'

export default {
  name: 'AuthLayout',
  components: {
    LeftSideScreen,
    PoweredByM6
  }
}
</script>

<style lang="scss" scoped >
.right-background {
  background-color: #191e24;
}
.bottom-logo {
  width: 30%;
  height: auto;
}
.text-dec-none {
  text-decoration: none;
}
.custom-blue-text {
  color: #a4ceea !important;
}

.overflow-hidden {
  overflow: hidden;
}

.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

<template>
    <v-row class="d-block ma-0 pt-4 pb-6 px-7 deep-purple accent-4 width-100 vertical-scroll dont-show-scroll rounded-xl">
      <p class="white--text font-weight-regular text-h6 mb-4">Employee of the Month!</p>
      <v-row class="d-flex ma-0">
        <v-col cols="2" class="pa-0">
          <v-avatar size="90">
            <img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                alt="John"
            >
          </v-avatar>
        </v-col>
        <v-col cols="10" class="pl-5 pb-0">
          <div class="d-flex flex-column mb-2">
            <p class="mb-0 body-2 white--text text-h5">John Doeskiltsin</p>
            <p class="deep-purple--text text--lighten-4">IT Manager</p>
            <p class="deep-purple--text text--lighten-4">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor individunt ut labore et dolore magna.</p>
            <v-btn :depressed="true" max-width="230" min-height="45" class="deep-purple accent-3 white--text rounded-lg text-h6 font-weight-medium capitalize">
              Say Congrats to John!
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-row>
</template>

<script>
export default {
  data: () => ({
  }),
  name: "MonthEmployee",
  computed: {
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
</style>
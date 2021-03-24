<template>
  <v-row>
      <v-col sm='4' class="d-flex mb-5" v-for="n in 3" :key='n'>
            <div :class='themeCommon.content' class="rounded-lg w-full pa-5">
              <div class="d-flex">
                <v-avatar size='50' color='primary'>C</v-avatar>
                <div class="flex-grow-1">
                    <div class="px-3 font-weight-medium" :class='themeCommon.text'>Company name</div>
                    <v-rating small :value='5' color='orange' class="ml-1"></v-rating>
                    <div class="px-3 text-body-1 mt-3" :class='themeCommon.text'>Very useful</div>
                </div>
              </div>
            </div>
        </v-col>
  </v-row>
</template>

<script>
export default {
   computed: {
        themeCommon() {
            return {
                text: this.$vuetify.theme.dark ? 'white--text' : '',
                primary: this.$vuetify.theme.dark ? 'blue--text text--lighten-1' : 'blue--text text--darken-3',
                description: this.$vuetify.theme.dark ? 'grey--text text--lighten-1' : 'grey--text text--darken-2',
                content: this.$vuetify.theme.dark ? 'bg-content' : 'grey lighten-3',
                background: this.$vuetify.theme.dark ? 'bg-container' : 'white',
                accent: this.$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'
            }
        }
   }
}
</script>

<style>

</style>
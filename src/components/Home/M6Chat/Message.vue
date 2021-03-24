<template>
  <div class="mb-2" @click="isFocus = !isFocus" :class="sent? 'align-self-start' : 'align-self-end'">
      <div class="pa-2 text-body-2 rounded-xl"
           :class="!sent? 'rounded-tr-0 grey lighten-2 black--text' : 'rounded-tl-0 primary white--text'">
            <slot></slot>
      </div>
      <p v-if="isFocus" class="px-2 py-1 mb-0 text-caption grey--text text--darken-1">{{date}}</p>
  </div>
</template>

<script>
export default {
    data: () => ({
        isFocus: false
    }),
    props: {
        sent: {
            type: Boolean,
            default: false
        },
        date: {
            type: String, //Change this to DATE, so we can work with the backend
            default: '2 days ago'
        }
    }
}
</script>

<style>

</style>
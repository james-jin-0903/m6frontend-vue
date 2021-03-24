<template>
  <div class="pa-0">
    <v-btn
      block
      color="blue lighten-2 w-full justify-start"
      dark
      @click="executeHtml2Canvas"
    >
      New Ticket
    </v-btn>

    <snap-shot-dialog
      :image-test="imageTest"
      :show-dialog="showDialog"
      @closing="showDialog = false"
    />

    <m6-loading :loading="loading" />
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import SnapShotDialog from '@/components/Home/TopNav/SnapShotDialog'

export default {
  name: 'SnapShotNav',

  components: {
    SnapShotDialog
  },

  data: () => ({
    imageTest: '',
    showDialog: false,
    loading: false,
    expandOptions: false
  }),

  methods: {
    executeHtml2Canvas(ratingChosen) {
      this.loading = true
      this.$nextTick(() => {
        html2canvas(document.body).then(canvas => {
          this.imageTest = canvas.toDataURL()
          this.showDialog = true
          this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.r-btn {
    font-size: 1.4rem;
}
</style>

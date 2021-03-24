<template>
  <div style="width: 300px; height: 170px"
  :style="parentStyles">
      <div rounded
        :style='getStyles'
        :class='color'
        class="accent-3 darken-1 
        rounded-xl elevation-0 pa-10 d-flex flex-column">
            <div class="font-weight-medium">Visa</div>
            <v-spacer></v-spacer>
            <div class="white--text font-bold d-block">XXXX XXXX XXXX XXXX</div>
            <div class="white--text font-bold d-block">00/00</div>
            <div class="white--text font-bold d-block">Card Holder</div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        position: {
            type: Number,
            default: 0
        },
        color: {
            type: String,
            default: 'blue'
        },
        stacked: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        getStyles() {
            if (this.position === 0) 
            return {
                zIndex: 1,
                width: '100%',
                height: '100%'
            }

            let insideWallet = this.stacked
            console.log('actualizando')
            return {
                zIndex: `-${this.position}`,
                width: '300px',
                height: insideWallet ? `${(10 - this.position) * 10}%` : '170px',
                position: insideWallet ? 'absolute' : 'relative',
                top: insideWallet ? '50%' : '',
                transform: insideWallet ? 'translateY(-50%)' : ''
            }
        },
        parentStyles() {
            if (this.position === 0 || !this.stacked) return {}
            return {
                marginLeft: `-${(this.position * 12) * 100 / 100}%`
            }
        }
    }
}
</script>

<style>

</style>
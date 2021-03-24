<template>
    <div class="w-full" style='overflow-x:scroll; max-width: 100%'>
        <div
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
        :style="isHover ? 'width:100%;overflow-x:hidden' : ''"
        style="position: relative;z-index:10"
        class="relative d-flex">
            <Credit-card 
            v-for="(card, index) in ['blue accent-3', 'red darken-3', 'black']"
            :key='index' :position='index' :color='card' :stacked='!isHover'/>
        </div>
    </div>
</template>

<script>
import CreditCard from './CreditCard'

export default {
    components: {CreditCard},
    data: () => ({
        isHover: true
    }),
}
</script>

<style>

</style>
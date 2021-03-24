<template>
    <div class="px-3 w-full py-10 px-10">
        <div class="text-h5 font-weight-bold ghostwhite--text">Complete Order</div>
        <div class="py-10">
            <div class="d-flex py-5 pb-10 font-weight-medium text-left
            grey--text text--darken-3 cart-total_item">
                <div class="flex-grow-1 white--text">Total Cost</div>
                <div class="flex-grow-1 text-right white--text font-weight-black"> 30000 $</div>
            </div>
            <div class="d-flex py-5 font-weight-medium text-left
            grey--text text--darken-3 cart-total_item">
                <div class="flex-grow-1 white--text">Total Cost (Tax)</div>
                <div class="flex-grow-1 text-right white--text font-weight-black"> 30000 $</div>
            </div>
        </div>
        <v-btn class="rounded-lg elevation-0"
            block
            x-large
            color='#EC8A40'
            @click="$emit('submit')">
            <div class="white--text">Proceed to checkout</div>
        </v-btn>
    </div>
</template>

<script>
export default {
    name: 'Summary'
}
</script>

<style>

</style>
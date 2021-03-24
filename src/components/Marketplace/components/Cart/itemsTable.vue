<template>
    <table class="w-full my-5">
        <thead class="text-left" v-show='!checkout'>
            <tr class="">
                <th class="grey--text text--darken-1 py-3">Product</th>
                <th class="grey--text text--darken-1 py-3">Count</th>
                <th class="grey--text text--darken-1 py-3">Total Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr :key='index' v-for="(product, index) in items"
            :class="{'cart-item': !checkout}">
                <td class="flex-grow-1">
                    <div class="align-center d-flex" :class="{'py-5' : checkout}">
                        <v-avatar :size='checkout ? 60 : 100'
                        :color="checkout ? 'bg-cart-container' : 'grey lighten-4'" tile
                        class="mr-10 rounded-lg">
                            <v-icon color='grey'>mdi-package</v-icon>
                        </v-avatar>
                        <div class="font-medium">
                            <div :class="checkout ? 'ghostwhite--text': 'ghostblack--text'"
                            class="text-h6">
                                {{product.title}}
                            </div>
                            <div class="text-uppercase grey--text text-subtitle-2">
                                {{product.category}}
                            </div>
                        </div>
                    </div>
                </td>
                <td v-show="!checkout">{{product.quantity}}</td>
                <td v-show='!checkout'>
                    <a class="indigo--text text--accent-4 font-medium">
                        $ {{product.price * product.quantity}}
                    </a>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props: {
        checkout: {
            type: Boolean,
            default: false
        },
        items: {
            type: [Array, Object],
            default: () => ({})
        }
    }
}
</script>

<style>

</style>
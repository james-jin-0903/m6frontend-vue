<template>
  <div class="d-flex w-full" style="height: calc(100vh - 60px)">
    <v-col class="mt-header" v-show='checkout' cols='8'>
        <v-row align='center' class="mb-10">
            <v-btn @click="checkout = false" icon large class='mr-3'>
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <div class="text-h4 font-weight-bold ghostblack--text">Shopping Cart</div>
        </v-row>
        <div class="d-flex justify-center">
            <v-col class="pb-10 d-flex justify-space-between align-center cols-6" cols="11">
            <div class="d-flex flex-grow-1 align-center">
                <v-icon color='white' class="indigo accent-2 pa-3 rounded-pill">mdi-storefront-outline</v-icon>
                <v-divider class="indigo accent-2"></v-divider>
            </div>
            <div class="d-flex flex-grow-1 align-center">
                <v-icon color='white' class="indigo accent-2 pa-3 rounded-pill">mdi-cart-outline</v-icon>
                <v-divider class="indigo accent-2"></v-divider>
            </div>
            <div class="d-flex flex-grow-1 align-center">
                <v-icon class="indigo accent-2 pa-3 rounded-pill" color="white">mdi-account-details-outline</v-icon>
                <v-divider class='indigo accent-2'></v-divider>
            </div>
            <div class="d-flex flex-grow-1 align-center">
                <v-icon class="elevation-3 rounded-pill pa-3">mdi-credit-card-check-outline</v-icon>
                <div class="flex-grow-1 text-center text-body-1 font-weight-bold text-uppercase">Checkout</div>
            </div>
        </v-col>
        </div>
        <div class='mx-auto relative w-full'>
            <Wallet/>
        </div>
        <div class="pa-10">
            <v-text-field label="Card Holder Name" outlined></v-text-field>
            <v-row>
                <v-col class="flex-grow-1">
                    <v-text-field outlined label='XXXX XXXX XXXX XXXX'></v-text-field>
                </v-col>
                <v-col cols='3'>
                    <v-text-field outlined label="00/00"></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols='3'>
                    <v-text-field outlined label="CVC"></v-text-field>
                </v-col>
            </v-row>
        </div>
    </v-col>
    <v-col
    :cols='checkout ? 4 : "auto"'
    :class="{'bg-cart-container': checkout}"
    class=" px-10 flex-grow-1"
    style='height: 100vh; padding-top: 70px'>
        <v-row v-show='!checkout' align='center' class="mb-10">
            <v-btn icon fab  class='mr-5 elevation-3'>
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <div class="text-h4 ghostblack--text font-weight-black">Shopping Cart</div>
        </v-row>
        <div :class="{'bg-cart-content': checkout, 'pa-10 rounded-xl': checkout}">
            <div v-if="checkout"
            class="text-h4 font-weight-bold ghostwhite--text text-center">You're buying</div>
            <Items-table :items='items' :checkout='checkout'/>
        </div>
        <div v-show="checkout" class="bg-cart-content pa-10 mt-5 rounded-xl">
            <div class="d-flex pb-10 font-weight-medium text-left
            grey--text text--darken-3 cart-total_item">
                <div class="flex-grow-1 white--text">Total Cost</div>
                <div class="flex-grow-1 text-right white--text font-weight-black"> 30000 $</div>
            </div>
            <div class="d-flex font-weight-medium text-left
            grey--text text--darken-3 cart-total_item">
                <div class="flex-grow-1 white--text">Total Cost (Tax)</div>
                <div class="flex-grow-1 text-right white--text font-weight-black"> 30000 $</div>
            </div>
        </div>
    </v-col>
    <v-col
    cols='5'
    v-if="!checkout"
    class="bg-cart-container d-flex flex-row px-10 align-center"
    style='height: 100vh'>
        <Summary class="bg-cart-content rounded-xl elevation-card" @submit="showCheckout()"/>
    </v-col>
  </div>
</template>

<script>
import Summary from './components/Cart/Summary'
import ItemsTable from './components/Cart/itemsTable'
import Wallet from './components/Cart/wallet'
import { mapState } from 'vuex'

const defaults = {
    CHECKOUT_INFORMATION: {
        holder: "",
        number: null,
        code: null,
        expiration: null
    }
}

export default {
components: { Summary, ItemsTable, Wallet },
    data: () => ({
        checkout: false,
        checkoutInformation: defaults.CHECKOUT_INFORMATION,
    }),
    computed: {
        ...mapState('NewMarketplace', ['cart']),
        items() { return this.cart.items }
    },
    methods: {
        showCheckout() {
            this.checkout = true
        }
    }
}
</script>

<style>
.cart-item td{
    border-bottom: 1px solid #f5f5f5;
    padding-top: 10px;
    padding-bottom: 10px;
}
.bg-cart-container{background-color: #021D3E}
.bg-cart-content{background-color: #112A49}
.bg-cart-primary{background-color: #EC8A40}

.ghostblack--text {color:#021D3E !important}
.ghostwhite--text {color: #E9EAEF}

.mt-header {margin-top:60px}
</style>
<template>
  <div class="pa-5" style='width: 48%;'>
      <Appview/>
      <div class="">
          <div class="d-flex py-5">
              <v-spacer></v-spacer>
              <v-btn @click="addProduct = true" fab right class="fab self-end">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
          <Comparison-table :items='items' :properties='properties'/>

          <v-dialog v-model='addProduct' width="500">
              <v-card class="white">
                  <v-card-title class="text-center indigo accent-4">
                      <div class="white--text mx-auto">
                          Add new product
                      </div>
                  </v-card-title>
                  <v-card-text class="pa-10">
                      <v-text-field outlined
                      v-model='productDraft.column_header'
                      label='Product Name'>

                      </v-text-field>
                    <v-text-field outlined :key='prop'
                    :label='prop.name'
                    v-model='productDraft[prop.value]'
                    v-for="prop in properties">

                    </v-text-field>
                  </v-card-text>
                  <v-card-actions class="pb-5 px-10">
                      <v-btn large
                      color='indigo accent-3 rounded-pill'
                      block
                      @click='saveProduct()'
                      dark>Add</v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>
      </div>
  </div>
</template>

<script>
import Appview from './components/Appview'
import ComparisonTable from './components/ComparisonTable'

export default {
components: {ComparisonTable, Appview},
data: () => ({
    addProduct: false,
    productDraft: {},
    items: [
        {
            support: false, //bool for NO / YES,
            developers: 1,
            term: '14 days',
            liveshare: false,
            integrations: 0,
            column_header: 'FREE',
            price: 'Get free'
        },
        {
            support: true, //bool for NO / YES,
            developers: 3,
            term: '1 month',
            liveshare: true,
            integrations: 250,
            column_header: 'PREMIUM',
            color: 'blue accent-4',
            price: '750 $'
        },
        {
            support: true, //bool for NO / YES,
            developers: 500,
            term: 'LIFETIME',
            liveshare: true,
            integrations: '700+',
            column_header: 'ENTERPRISE',
            color: 'black',
            price: 'Contact'
        }
    ],
    properties: [
        {
            value: 'support',
            name: 'Custom Support'
        },
        {
            value: 'developers',
            name: 'Developers'
        },
        {
            value: 'term',
            name: 'Term'
        },
        {
            value: 'liveshare',
            name: 'Liveshare'
        },
        {
            value: 'integrations',
            name: 'Integrations'
        }
    ]
}),
methods: {
    saveProduct() {
        this.items.push(this.productDraft)
        this.productDraft = {}
        
    }
}
}
</script>

<style>
.comparison-table_row:not(:last-child) {border-bottom: 1px solid #f5f5f5}
.rounded-card {border-radius: 15px !important}
.rounded-tr-card:last-child {border-radius: 0 15px 0 0}
.rounded-br-card:last-child {border-radius: 0 0 15px 0}
.elevation-card {
    box-shadow: 0px 0px 10px 0px #dfdcdc
}
</style>
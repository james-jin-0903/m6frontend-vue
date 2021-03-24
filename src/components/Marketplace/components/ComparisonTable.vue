<template>
  <div class="white rounded-card elevation-card" style='overflow-x: auto'>
        <v-col class="pa-0 flex-grow-1 d-flex comparison-table_row">
            <v-col sm="3">
                <div class="black--text font-weight-bold text-h4 text-center">M6Works</div>
            </v-col>
            <v-col style="min-width: 300px" class="py-5 d-flex align-center text-capitalize
                font-weight-medium text-body-1 justify-center rounded-tr-card"
                v-for="(item, i) in items" :key='i'
                :class="{'grey lighten-5': i % 2 == 0}">
                {{item.column_header}}
            </v-col>
        </v-col>
          <div class="d-flex comparison-table_row" v-for="prop in properties" :key='prop.value'>
              <v-col sm='3' class="flex-grow-0">
                    <v-expansion-panels flat tile>
                        <v-expansion-panel>
                        <v-expansion-panel-header class="text-body-1 indigo--text text--accent-3">
                            {{prop.name}}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            descrition here
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    </v-expansion-panels>
              </v-col>
              <v-col class="pa-0 flex-grow-1 d-flex">
                  <v-col style="min-width: 300px" class="d-flex align-center justify-center grey--text text--darken-4"
                    v-for="(item, i) in items" :key='i'
                    :class="{'grey lighten-5': i % 2 == 0}">
                        <v-icon size='18' color='green' v-if="item[prop.value] === true">mdi-check</v-icon>
                        <v-icon size='18' v-else-if="item[prop.value] === false">mdi-window-close</v-icon>
                        <template v-else>
                          {{item[prop.value]}}
                        </template>
                  </v-col>
              </v-col>
          </div>
          <v-col class="pa-0 flex-grow-1 d-flex comparison-table_row">
            <v-col sm="3"></v-col>
            <v-col style="min-width: 300px" class="py-5 align-center justify-center rounded-br-card"
                v-for="(item, i) in items" :key='i'
                :class="{'grey lighten-5': i % 2 == 0}">
                <v-btn class="rounded-pill elevation-3" @click='seeInCart(item)' block dark :color='item.color'>
                    <b class="white--text font-weight-bold">$ {{item.price}}</b>
                </v-btn>
                <div class="text-center grey--text">per month</div>
            </v-col>
        </v-col>
      </div>
</template>

<script>
import { mapActions} from 'vuex'

export default {
    props: {
        items: {
            type: [Object, Array],
            default: () => ({})
        },
        properties: {
            type: [Object, Array],
            default: () => ({})
        }
    },
    methods: {
        ...mapActions({ addToCart: 'NewMarketplace/addToCart' }),
        seeInCart(i) {
            this.addToCart({
                price: i.price,
                title: i.column_header,
                quantity: 1,
                membership: 'monthly'
            })

            this.$router.push({name:'marketplace-cart'})
        }
    }
}
</script>

<style>

</style>
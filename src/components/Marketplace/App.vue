<template>
    <div class="h-vh vertical-scroll">
        <v-container class="relative d-flex align-center mt-10 py-10 px-10 marketplace-app-overview">
            <v-avatar color='purple' rounded size='100'>{{app.title}}</v-avatar>
            <div class="px-7 flex-grow-1">
                <div class="pl-3 text-h4 font-weight-bold white--text">{{app.title}}</div>
                <div class="pl-3 text-title grey--text text--lighten-2 text-uppercase">{{app.category}}</div>
                <div class="d-flex align-center">
                    <v-rating color='orange' :value='app.rating' readonly></v-rating>
                    ({{ app.ratings }})
                </div>
            </div>
            <v-btn rounded color='blue accent-3' dark large @click='showCheckout()'>FREE</v-btn>
            <v-card dark class="card-background rounded-xl pa-0">
                <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Irelia_6.jpg" alt="">
            </v-card>
        </v-container>
        <v-container class="px-10 py-10">
            <div>
                <div class="text-h6 font-weight-bold white--text">
                    <v-icon color='white'>mdi-image-text</v-icon>
                    Description
                </div>
                <div class="text-subtitle-1 font-weight-regular white--text">
                    {{app.description}}
                </div>
            </div>
            <div class="py-5">
                <div class="mt-5 marketplace-overview-items">
                    <Overview-items/>
                </div>
            </div>
            <div class="py-5">
                <div class="text-h6 font-weight-bold white--text mb-5">
                    <v-icon color='white'>mdi-monitor-screenshot</v-icon>
                    Screenshots
                </div>
                <Screenshots/>
            </div>
            <div class="text-h6 font-weight-bold white--text">
                <v-icon color="white">mdi-forum</v-icon>
                Ratings & Rewiews
            </div>
            <div class="mt-10">
                <v-row>
                    <v-btn @click='review = true' outlined color='primary'>
                        <v-icon>mdi-square-edit-outline</v-icon>
                        Write a review
                    </v-btn>
                </v-row>
                <Reviews/>
                <v-dialog v-model="review" width="500">
                    <v-card class="white">
                        <v-card-title>
                            <v-icon class="mr-5">mdi-square-edit-outline</v-icon>
                            Write a Review
                        </v-card-title>
                        <v-card-text class="pa-10">
                            <v-text-field outlined label="Title">

                            </v-text-field>
                            <div class="d-flex align-center py-3">
                                <div class="font-weight-bold text-body-1 text-primary">
                                    Rate this app: 
                                </div>
                                <v-rating color="orange"></v-rating>
                            </div>
                            <v-textarea outlined label="Description"></v-textarea>
                        </v-card-text>
                        <v-card-actions class="px-10 pb-5">
                            <v-btn large block color='blue accent-3' dark>
                                Leave Review
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
            <v-btn  @click='editDialog = true' fab fixed bottom right class="mx-5" color='white'>
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-dialog dark width='700' v-model='editDialog'>
                <v-card class=" elevation-15">
                    <v-card-title class="grey darken-3 pa-5 text-center headline white--text">
                        Edit App Marketplace
                        <v-spacer></v-spacer>
                        <v-icon @click='editDialog = false'>mdi-close</v-icon>
                    </v-card-title>
                    <v-card-text class="bg-content pa-5 vertical-scroll" style='height: 80vh'>
                        <div class="font-weight-medium text-h6 py-3">
                            <v-icon class="pr-2" color='blue'>mdi-checkbox-marked-circle</v-icon>Patient Information
                        </div>
                        <v-row>
                            <v-col class="px-2">
                                <v-text-field dark rounded placeholder="Last name" class="elevation-0 background rounded-lg"></v-text-field>
                            </v-col>
                            <v-col class="px-2">
                                <v-text-field dark rounded placeholder="First name" class="elevation-0 background rounded-lg"></v-text-field>
                            </v-col>                          
                        </v-row>
                        <v-row>
                            <v-col class="px-2">
                                <v-text-field dark rounded placeholder="Middle name" class="elevation-0 background rounded-lg"></v-text-field>
                            </v-col>
                            <v-col class="px-2">
                                <v-text-field dark rounded placeholder="D.O.B" class="elevation-0 background rounded-lg"></v-text-field>
                            </v-col>                          
                        </v-row>
                        <v-text-field dark rounded placeholder="Street Address" class="elevation-0 background rounded-lg"></v-text-field>
                        <v-row>
                            <v-col class="px-2">
                                <v-text-field dark rounded placeholder="City" class="elevation-0 background rounded-lg"></v-text-field>
                            </v-col>
                            <v-col class="px-2">
                                <v-text-field dark rounded placeholder="State" class="elevation-0 background rounded-lg"></v-text-field>
                            </v-col>                          
                        </v-row>
                        <v-row>
                            <v-col class="px-2">
                                <v-text-field dark rounded placeholder="Zipcode" class="elevation-0 background rounded-lg"></v-text-field>
                            </v-col>
                            <v-col class="px-2">
                                <v-text-field dark rounded placeholder="Country" class="elevation-0 background rounded-lg"></v-text-field>
                            </v-col>                          
                        </v-row>
                        <v-row>
                            <v-col class="px-2">
                                <v-text-field dark rounded placeholder="Primary Phone" class="elevation-0 background rounded-lg"></v-text-field>
                            </v-col>
                            <v-col class="px-2">
                                <v-text-field dark rounded placeholder="Secondary Phone" class="elevation-0 background rounded-lg"></v-text-field>
                            </v-col>                          
                        </v-row>
                        <v-row>
                            <v-col class="px-2">
                                <v-text-field dark rounded placeholder="Email" class="elevation-0 background rounded-lg"></v-text-field>
                            </v-col>
                            <v-col class="px-2">
                                <v-text-field dark rounded placeholder="Gender" class="elevation-0 background rounded-lg"></v-text-field>
                            </v-col>                          
                        </v-row>
                        <v-row>
                            <v-col class="px-2">
                                <v-text-field dark rounded placeholder="Ethnicity" class="elevation-0 background rounded-lg"></v-text-field>
                            </v-col>
                            <v-col class="px-2">
                                <v-text-field dark rounded placeholder="Primary Language" class="elevation-0 background rounded-lg"></v-text-field>
                            </v-col>                          
                        </v-row>
                        <v-row class="justify-space-between align-center">
                            <v-chip class=""><a class="white--text font-weight-bold">Works</a></v-chip>
                            <v-btn large color='blue accent-4' dark>Save and Continue</v-btn>
                        </v-row>
                        <v-row class="py-5 d-block">
                            <div :key='i' v-for="(section, i) in ['Chart', 'Initial Exam', 'Physical Assesment', 'Consents']"
                            class="font-weight-medium grey--text text--lighten-1 text--lighten-2 text-h6 py-3">
                                <v-icon class="pr-2">mdi-checkbox-marked-circle-outline</v-icon>{{section}}
                            </div>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-container>
        <v-dialog content-class="rounded-xl" v-model='checkoutDialog' width='1250'>
            <div class="white pa-2 rounded-xl">
                <Comparison-table :items='comparisonItems' :properties='comparisonProperties'/>

            </div>
        </v-dialog>
    </div>
</template>

<script>
import OverviewItems from './components/OverviewItems'
import Screenshots from './components/Screenshots'
import Reviews from './components/Reviews'
import ComparisonTable from './components/ComparisonTable'

function detectCardType(number) {
  const re = {
    electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
    maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/, // 1
    dankort: /^(5019)\d+$/,
    interpayment: /^(636)\d+$/,
    unionpay: /^(62|88)\d+$/, // 1
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/, // 1
    mastercard: /^5[1-5][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/,
    diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/, // 1
    discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    jcb: /^(?:2131|1800|35\d{3})\d{11}$/ // 1
  }

  for (const key in re) {
    if (re[key].test(number)) {
      return key
    }
  }
}
const defaults = {
  CHECKOUT_INFORMATION: {
    holder: '',
    number: null,
    code: null,
    expiration: null
  }
}
export default {
   components: {OverviewItems, Screenshots, Reviews, ComparisonTable},
   data: () => ({
       tab: 1,
       editDialog: false,
       checkoutDialog: false,
       app: {
           title: 'Demo APP',
           category: 'CATEGORY',
           description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore tempora ea assumenda excepturi eius dolor doloribus aliquam odit, id obcaecati sapiente vero magni facilis laboriosam officiis reiciendis voluptatem exercitationem qui?',
           ratings: 300,
           rating: 5

       },
       review: false,
       checkoutInformation: defaults.CHECKOUT_INFORMATION,
       comparisonItems: [
        {
            support: false, //bool for NO / YES,
            developers: 1,
            term: 'q',
            liveshare: false,
            integrations: 0,
            column_header: 'FREE',
            color: 'blue accent-2',
            price: 300
        },
        {
            support: true, //bool for NO / YES,
            developers: 3,
            term: 'q',
            liveshare: true,
            integrations: 250,
            column_header: 'PREMIUM',
            color: 'blue accent-3',
            price: 750
        },
        {
            support: true, //bool for NO / YES,
            developers: 500,
            term: 'q',
            liveshare: true,
            integrations: '700+',
            column_header: 'ENTERPRISE',
            color: 'blue accent-4',
            price: 500
        }
    ],
    comparisonProperties: [
        {
            value: 'support',
            name: 'Action Center'
        },
        {
            value: 'developers',
            name: 'Integrations'
        },
        {
            value: 'term',
            name: 'Messenger'
        },
        {
            value: 'liveshare',
            name: 'M6Points'
        },
        {
            value: 'integrations',
            name: 'Term'
        }
    ]
   }),
   methods: {
       showCheckout() {
           this.checkoutDialog = true
       },
       cancelCheckout () {
           this.checkoutDialog = false
           this.checkoutInformation = defaults.CHECKOUT_INFORMATION
       }
   },
   mounted(){
       if (this.$route.params.section && this.$route.params.section === 'checkout')
       this.showCheckout()

       if (this.$route.params.app)
       this.app = this.$route.params.app
   },
   computed: {
        themeCommon() {
            return {
                text: this.$vuetify.theme.dark ? 'white--text' : '',
                primary: this.$vuetify.theme.dark ? 'blue--text text--lighten-1' : 'blue--text text--darken-3',
                description: this.$vuetify.theme.dark ? 'grey--text text--lighten-1' : 'grey--text text--darken-2',
                content: this.$vuetify.theme.dark ? 'bg-content' : 'grey lighten-2',
                background: this.$vuetify.theme.dark ? 'bg-container' : 'white',
                accent: this.$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'
            }
        }
   }
}
</script>

<style scoped>
.marketplace-app-overview {
    z-index: 1;
}
/*.marketplace-overview-items {
    border-top: 1px solid #4d4d4d ;
    border-bottom: 1px solid #4d4d4d ;
}*/
.horizontal-scroll {
    overflow-x: scroll;
}
.creditCard {
    height: 200px;
    width: 400px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 15px;
}
.card-background{
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur() opacity(.9);
    z-index: -1
}
.card-background img {
    width: 100%;
    height: 100%;
    filter: blur(30px) opacity(.9);
}
</style>

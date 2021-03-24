<template>
    <v-row class="align-center px-10">
        <v-btn large fab class='elevation-0 flex-shrink-0 mr-n7 pr-5'
        :color='themeCommon.content'>
            <v-icon large>mdi-arrow-left</v-icon>
        </v-btn>
        <div class="flex-grow-1">
            <div class='rounded-xl'>
                <v-tabs-items v-model='app' class="rounded-xl w-full grey darken-4 elevation-7">
                    <v-tab-item :key='0'>
                        <v-card dark class="relative rounded-xl" style='z-index: 1'>
                            <div class="card-background rounded-xl">
                                <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Irelia_6.jpg" alt="">
                            </div>
                            <v-row class="pa-10 align-center">
                                <v-col class="flex-grow-1">
                                    <div class="white--text text-subtitle-1 font-weight-medium">CATEGORY</div>
                                    <div class="white--text text-h3 font-weight-bold">APP NAME</div>
                                    <v-rating color='orange' class="ml-n3"></v-rating>
                                    <div class="pb-10 pt-5 white--text w-full text-truncate">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                                    </div>
                                    <v-btn text dark @click='goToPreview()'>PREVIEW</v-btn>
                                    <v-btn @click='goToCheckout()' class="rounded-pill indigo accent-3 elevation-0" large dark>SEE SOFTWARE</v-btn>
                                </v-col>
                                <v-col class="justify-center d-flex">
                                    <img class='rounded-xl card-cover' style='z-index: 10; height: 370px; width: 250px; object-fit: cover' src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Irelia_6.jpg" alt="">
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </div>
        </div>
        <v-btn large fab class='elevation-0 flex-shrink-0 ml-n7 pl-5'
        :color='themeCommon.content'>
            <v-icon large>mdi-arrow-right</v-icon>
        </v-btn>
    </v-row>
</template>

<script>
export default {
    data: () => ({
        app: 0,
    }),
    computed: {
        themeCommon() {
            return {
                text: this.$vuetify.theme.dark ? 'white--text' : '',
                content: this.$vuetify.theme.dark ? 'bg-content' : 'grey lighten-2',
                background: this.$vuetify.theme.dark ? 'bg-container' : 'white'
            }
        }
    },
    methods: {
        goToPreview(){
            this.$router.push({name:'marketplace-app'})
        },
        goToCheckout(){
            this.$router.push({name:'marketplace-app', params: {section: 'checkout'}})
        }
    }
}
</script>

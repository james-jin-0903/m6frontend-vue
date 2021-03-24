<template>
    <v-card dark :class='themeCommon.background' class="appCreationForm elevation-15">
        <v-card-title :class='themeCommon.text' class="pa-5 headline" style='border-top-radius: 15px'>
            <v-btn small fab :class='themeCommon.accent' class="elevation-0 mr-3"
                v-if='currentPage > 0' @click='currentPage--'>
                <v-icon :color="themeCommon.text">mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            {{pages[currentPage].title || 'App Creation Form'}}
            <v-spacer></v-spacer>
            <v-btn v-show='currentPage > 0' small fab :class='themeCommon.accent' class="elevation-0 ml-3"
                @click='$emit("close")'>
                <v-icon :color="themeCommon.text">mdi-close</v-icon>
            </v-btn>
        </v-card-title>
        <v-tabs-items v-model='currentPage'>
            <v-tab-item :key='0'>
                <template>
                    <v-card-text :class='themeCommon.background' class="pa-5" style='height: 70vh'>
                        <div
                            :key='key'
                            v-for='(step, key) in steps'>
                            <div>
                                <Step-indicator :completed='step.selected.length'>{{step.title}}</Step-indicator>
                            </div>

                            <Stepper-selection
                                v-model="step.selected"
                                :items='step.options'/>
                        </div>
                    </v-card-text>
                    <v-card-actions @click='nextStep()' class="pa-5"
                        :class='themeCommon.background'>
                        <v-btn class="blue accent-3" dark block>
                            Continue
                        </v-btn>
                    </v-card-actions>
                </template>
            </v-tab-item>
            <v-tab-item :key='1'>
                <template>
                    <v-card-text :class='themeCommon.content' class="pa-5 vertical-hidden" style='height: 70vh'>
                        <Step-indicator @click='stickTo($e)' completed>Feature Image</Step-indicator>
                        <v-card dark class="relative rounded-xl">
                            <div class="card-background rounded-xl">
                            </div>
                            <v-row class="pa-5 align-center">
                                <v-col cols='6'>
                                    <div class="white--text text-body-1 font-weight-medium">CATEGORY</div>
                                    <div class="white--text text-subtitle-1 font-weight-bold">APP NAME</div>
                                    <v-rating color='orange' small class="ml-n3"></v-rating>
                                    <div class="pb-5 pt-3 white--text w-full text-truncate">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                                    </div>
                                    <v-btn x-small text dark>PREVIEW</v-btn>
                                    <v-btn x-small class="rounded-pill indigo accent-3 elevation-0" dark>SEE SOFTWARE</v-btn>
                                </v-col>
                                <v-col cols='6' class="justify-center d-flex">
                                    <Image-uploader/>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-card-text>
                    <v-card-actions @click='nextStep()' class="pa-5"  :class='themeCommon.background'>
                        <v-btn class="blue accent-3" dark block>
                            Save and Continue
                        </v-btn>
                    </v-card-actions>
                </template>
            </v-tab-item>
        </v-tabs-items>
    </v-card>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import StepIndicator from './StepIndicator'
import StepperSelection from './StepperSelection'
import ImageUploader from '../ImageUploader'
export default {
    components: {StepIndicator, StepperSelection, ImageUploader},
    data: () => ({
        currentPage: 0,
        marketplaces: [],
        pages: [
            {
                title: 'Add to Marketplace'
            },
            {
                title: 'Select Feature Image'
            }
        ],
        steps: [
            {
                title: 'App',
                options: ["Capital Projects", "Planning"],
                selected: []
            },
            {
                title: 'Marketplace',
                options: ["Work", "Audience"],
                selected: []
            },
            {
                title: 'Work Category',
                options: ['Healthcare', 'Construction', 'Owners', 'Estimating'],
                selected: []
            },
            {
                title: 'Audience Category',
                options: ['Supply Chain', 'Capital Purchasing'],
                selected: []
            }
        ]

    }),
    methods: {
        nextStep() {
            this.currentPage++
        },
        stickTo(e) {
            console.log(e)
        },
        ...mapActions('AppBuilder', {
            getAppList: 'getAppList'
        }),
        ...mapActions('Marketplace', {
            getMarketplaces: 'getMarketplaces',
            deleteMarketplace: 'deleteMarketplace'
        }),
    },
    computed: {
        ...mapState('AppBuilder', {
            appsList: 'appsList'
        }),
        themeCommon() {
            return {
                text: this.$vuetify.theme.dark ? 'white--text' : '',
                content: this.$vuetify.theme.dark ? 'bg-content' : 'grey lighten-2',
                background: this.$vuetify.theme.dark ? 'bg-container' : 'white',
                accent: this.$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'
            }
        }
    },
    async mounted(){
      try {
        await this.getAppList()
        this.marketplaces = await this.getMarketplaces()
      } catch(e) {
      }
    },
}
</script>

<style scoped>
.dialog-container{
    border-radius: 15px !important
}
.appCreationForm >>> .v-input .v-label{
    text-align: center;
    color: white;
    width: 100%;
    font-weight: bold;
}
</style>
<template>
    <div class="vertical-scroll" style='height: 100vh'>
        <v-container class="pa-10 mt-10">
            <AppGallery/>
        </v-container> 
        <v-container class="pa-10">
            <div :key='section' v-for="section in ['Featured Apps', 'Most downloaded']">
                <p class="text-h4 font-weight-bold" :class='themeCommon.text'>{{section}}</p>
            <v-row>
                <v-col cols='12' sm='4' :key='n' v-for='(a, n) in featured'>
                    <app-featured :data='a' @click.native='goToApp(a)'></app-featured>
                </v-col>
            </v-row>
            <br><br>

            </div>
            <p class="text-h4 font-weight-bold" :class='themeCommon.text'>
                Add-ons
            </p>
            <v-row>
                <v-col cols='12' sm='4' :key="n" v-for='(a,n) in addons'>
                    <app-widget :data='a' @click.native='goToApp(a)'></app-widget>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import AppFeatured from './components/App/Featured'
import AppWidget from './components/App/Widget'
import AppGallery from './components/Gallery'

export default {
    components: {AppFeatured, AppWidget, AppGallery},
    computed: {
        themeCommon() {
            return {
                text: this.$vuetify.theme.dark ? 'white--text' : 'black--text',
                content: this.$vuetify.theme.dark ? 'bg-content' : 'grey lighten-2',
                background: this.$vuetify.theme.dark ? 'bg-container' : 'white'
            }
        }
    },
    methods: {
        goToApp(app) {
            if (!app) return false
            this.$router.push({name: 'marketplace-app', params: {app: app}})
        }
    },
    data: () => ({
        rating: 5,
        appsCarrousel: 0,
        isDarkTheme: true,
        categories: [
            {
                icon: 'bx-home',
                name: 'Marketplace'
            },
            {
                icon: 'bx-network-chart',
                name: 'Collaboration'
            },
            {
                icon: 'bx-category-alt',
                name: 'Categories',
                sub: [
                    {
                        icon: 'bx-file',
                        name: 'Forms'
                    },
                    {
                        icon: 'bx-group',
                        name: 'Teams'
                    },
                    {
                        icon: 'bx-group',
                        name: 'Capital'
                    },
                    {
                        icon: 'bx-group',
                        name: 'Marketing'
                    },
                    {
                        icon: 'bx-group',
                        name: 'Facilities'
                    },
                    {
                        icon: 'bx-group',
                        name: 'Information Technology'
                    },
                ]
            },
        ],
        featured: [
            {
                img: 'https://bitdatos.com/wp-content/uploads/2020/09/VS-Code.png',
                title: 'Microsoft Excel',
                description: 'Organize data sets',
                category: 'CATEGORYHEERE',
                ratings: 300,
                rating: 5
            },
            {
                img: 'https://www.nubit.es/wp-content/uploads/2015/10/excel-2016.jpg',
                title: 'Visual Studio Code',
                description: 'Code Faster',
                category: 'CATEGORYHEERE',
                ratings: 300,
                rating: 5
            },
            {
                img: 'https://i.vimeocdn.com/video/822590268.webp?mw=1200&mh=682&q=70',
                title: 'Figma',
                description: 'Create beautiful Designs',
                category: 'CATEGORYHEERE',
                ratings: 300,
                rating: 5
            }
        ],
        addons: [
            {
                title: 'Validator',
                description: 'Quick validations for your forms',
                prefix: 'V',
                color: 'purple',
                category: 'CATEGORYHEERE',
                ratings: 300,
                rating: 5
            },
            {
                title: 'Magic Snip',
                description: 'Snip and sketch tools',
                prefix: 'Snip',
                color: 'red',
                category: 'CATEGORYHEERE',
                ratings: 300,
                rating: 5
            },
            {
                title: 'Datasets',
                description: 'Realtime reactive spreadsheets',
                prefix: 'DS',
                color: 'green',
                category: 'CATEGORYHEERE',
                ratings: 300,
                rating: 5
            }
        ]
    })
}
</script>

<style lang='sass'>
.card-background
    display: block
    position: absolute
    width: 100%
    height: 100%
    filter: blur() opacity(.5)
    z-index: -1
.card-cover
    filter: blur(5px) opacity(.9)
.accent
    background-color: #FFFFFF1A

.background
    background-color: #18191a

.content
    background-color: #242526
</style>

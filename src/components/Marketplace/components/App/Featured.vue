<template>
    <div>
        <div class="py-2">
            <div class="text-subtitle font-weight-bold" :class='themeCommon.text'>{{data.title}}</div>
            <div class="grey--text text--lighten-2" :class='themeCommon.description'>{{data.description}}</div>
            <v-rating
            v-model='rating'
            class="ml-n3"
            background-color="orange lighten-3"
            color="orange"
            ></v-rating>
        </div>
        <div class="rounded">
            <img style='height:175px; width: 100%' class="rounded" :src="data.img" alt=""/>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => new Array()
        }
    },
    data: () => ({
        rating: 5
    }),
    computed: {
        themeCommon() {
            return {
                text: this.$vuetify.theme.dark ? 'white--text' : 'black--text',
                description: this.$vuetify.theme.dark ? 'grey--text text--lighten-1' : 'grey--text text--darken-2'
            }
        }
    }
}
</script>
<template>
    <div class="d-flex">
        <v-avatar color='grey lighten-2' rounded="">a</v-avatar>
        <div class="flex-grow-1 px-2">
            <div class="font-weight-bold" :class='themeCommon.text'>{{data.title}}</div>
            <div :class='themeCommon.description'>{{data.description}}</div>
        </div>
        <v-btn rounded color='blue accent-4'>
            GET
        </v-btn>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: [Array, Object],
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
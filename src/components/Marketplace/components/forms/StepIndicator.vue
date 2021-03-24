<template>
    <div
        :class="completed ?  themeCommon.primary : themeCommon.disabled"
        class="font-weight-medium text-h6 py-3">
        <v-icon class="pr-2" :class='themeCommon.primary' v-if="completed">mdi-checkbox-marked-circle</v-icon>
        <v-icon class="pr-2" v-else>mdi-checkbox-marked-circle-outline</v-icon>
        <slot></slot>
    </div>
</template>
<script>
export default {
    props: {
        completed: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        themeCommon() {
            return {
                text: this.$vuetify.theme.dark ? 'white--text' : 'black--text',
                primary: this.$vuetify.theme.dark ? 'blue--text text--lighten-1' : 'blue--text text--darken-3',
                disabled: this.$vuetify.theme.dark ? 'grey--text text--lighten-1' : 'grey--text text--darken-2',
                description: this.$vuetify.theme.dark ? 'grey--text text--lighten-1' : 'grey--text text--darken-2'
            }
        }
    }
}
</script>
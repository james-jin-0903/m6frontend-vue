export const themeCommon = function() {
    return {
        text: this.$vuetify.theme.dark ? 'white--text' : '',
        background: this.$vuetify.theme.dark ? 'bg-content' : 'grey lighten-2'
    }
}
<template>
    <v-select
        v-model='model'
        chips
        flat
        :items='items'
        :menu-props="menuProps"
        :background-color="themeCommon.background"
        multiple
        solo
    >
        <template #label>
            <div :class='themeCommon.text'>Select</div>
        </template>
        <template #selection="{ item }">
            <v-chip :color="themeCommon.content">
                <a class="font-weight-bold" :class="themeCommon.text">
                    {{item}}
                </a>
            </v-chip>
        </template>
    </v-select>
</template>

<script>
export default {
    props: {
        items: {
            type: [Array, Object],
            default: []
        },
        input: {
            type: [Array, Object],
            default: []
        }
    },
    model: {
        prop: 'input',
        event: 'change'
    },
    computed: {
        model: {
            get: function() {
                return this.input
            },
            set: function(value) {
                this.$emit('change', value)
            }
        },
        themeCommon() {
            return {
                text: this.$vuetify.theme.dark ? 'white--text' : '',
                content: this.$vuetify.theme.dark ? 'bg-content' : 'grey lighten-2',
                background: this.$vuetify.theme.dark ? 'bg-container' : 'white',
                accent: this.$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'
            }
        }
    },
    data: () => ({
        menuProps: {
            offsetY: true
        }
    })
}
</script>

<style>

</style>
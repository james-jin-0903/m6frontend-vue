<template>
    <div class="pa-5">
        <v-row>
            <v-col :key='k' v-for='(i, k) in items' sm='3'>
                <div class="d-flex align-center flex-column">
                    <div class='text-uppercase grey--text text--darken-1
                        font-weight-bold text-subtitle-1'>{{i.label}}</div>
                    <v-icon x-large 
                        color="blue lighten--3"
                        class="py-2"
                        v-if='!i.isRating'>{{i.icon}}</v-icon>
                    <div v-else class="blue--text text-h4 py-2">{{i.value}}</div>
                    <div class='font-weight-medium grey--text text--lighten-1' v-if='!isRating'>{{i.value}}</div>
                    <v-rating small v-else v-model='rating' color="grey lighten-1"></v-rating>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    data: () => ({
        isRating: false,
        rating: 3.5,
        items: [
            {label: 'Ratings', isRating: true, value: 300},
            {label: 'Awards', value: 'Best App', icon: 'mdi-seal'},
            {label: 'Industry',  value: 'industry', icon: 'mdi-shape-outline'},
            {label: 'Languages', value: 'EN', icon: 'mdi-earth'},
        ]
    })
}
</script>

<style>

</style>
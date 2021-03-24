<template>
    <v-card-actions >
        <!-- <v-icon @click="likeIcon()">{{like_icon}}</v-icon> -->
        <p class="my-0">{{contLikes()}}</p>
        <v-spacer/>
        <p class="my-0">{{data}}</p>
    </v-card-actions>
</template>
<script>
export default {
    name: "ActionsBar",
    props: {
        data : Object
    },
    computed:{
        likeIcon: function () {
            return Date.now()
        }
    }
}
</script>
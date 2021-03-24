<template>
    <div
        style='width: 104px; height: 150px'
        @drop.prevent="onDropFile"
        @dragover.prevent
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
        class="rounded-lg content grey d-flex align-center justify-center relative">
        <template v-if="image">
            <img
            :src="image"
            alt=""
            class='rounded-lg'
            style='width: 100%; height: 100%; object-fit: cover'>
            <v-overlay absolute :value='isHover' @click.native="clear">
                <v-icon>mdi-pencil</v-icon>
            </v-overlay>
        </template>
        <v-icon large v-else>mdi-plus</v-icon>
    </div>
</template>

<script>
export default {
    data: () => ({
        isHover: false,
        image: 'https://lolstatic-a.akamaihd.net/frontpage/apps/prod/rg-irelia-reveal/es_ES/abd275e634ae15e22975cdeb5d03b65df6b65180/assets/img/content/hero-mobile.jpg'
    }),
    methods: {
        onDropFile(event) {
            if (!event.dataTransfer.items || event.dataTransfer.items.length > 1)
            return false


            const file = event.dataTransfer.items[0]
            const types = [
                'image/png',
                'image/jpeg'
            ]

            if (!types.find(t => t === file.type))
            return false

            this.image = URL.createObjectURL(file.getAsFile());
        },

        clear(event) {
            this.image = ''
        }
    }
}
</script>

<style>
.item_wrapper { width: 300px; height: 300px; position: relative}

.item_wrapper .item {
    /*propiedades normales del item */
}
.item_wrapper:hover .item {
    position: absolute;

    scale: 1.1
}
</style>
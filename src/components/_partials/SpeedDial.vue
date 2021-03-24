<template>
    <div class="speedDial" > 
        <v-speed-dial
            v-model="expandOptions"
            open-on-hover
            transition="slide-y-transition"
            :direction="direction"
            bottom
            top
        > 
            <template v-slot:activator>

                <v-btn color="red darken-2" dark icon v-if="expandOptions" >
                    <v-icon >
                        mdi-close
                    </v-icon>
                </v-btn>

                <v-btn fab small icon v-else >
                    <slot name="activatorBtn" ></slot>
                </v-btn>

            </template>

            <slot name="options"></slot>
            
        </v-speed-dial>
    </div>
</template>

<script>
export default {
    props: {
        direction: {
            type: String,
            default: "bottom"
        }
    },

    data: () => ({
        expandOptions: false,
    }),

    watch: {
        expandOptions(val) {
            this.$emit('expanding', val)
        }
    }
}
</script>

<style lang="scss" scoped>
.speedDial .v-speed-dial {
    position: relative !important;
    z-index: 1 !important;
}

.speedDial .v-speed-dial--bottom {
    bottom: 0px;
}

.speedDial .v-speed-dial--top {
    top: 0px;
}
</style>
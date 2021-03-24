<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        class="mx-2"
        icon
        tooltip="Messenger"
        v-on="on"
        @click="toggleMessenger"
      >
        <img
          alt="New group"
          class="mx-auto"
          height="24"
          :src="
            isFullScreen
              ? require('@/assets/svgs/messenger-collapse-new.svg')
              : require('@/assets/svgs/messenger-expand-new.svg')
          "
          width="24"
        >
      </v-btn>
    </template>
    <span>Messenger</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'ToggleMessengerBtn',
  data() {
    return {
      isFullScreen: false
    }
  },
  watch: {
    $route(to) {
      this.isFullScreen = to.name === 'messenger'
    }
  },
  mounted() {
    this.isFullScreen = this.$route.name === 'messenger'
  },
  methods: {
    toggleMessenger() {
      this.$router.push({ name: this.isFullScreen ? 'home' : 'messenger' })
    }
  }
}
</script>

<style  lang="scss" scoped>
.v-tooltip__content {
  background: black !important;
  opacity: 0.7 !important;
  padding: 4px !important;
  border-radius: 4px !important;
  span {
    color: white !important;
  }
}
</style>

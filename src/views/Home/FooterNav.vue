<template>
  <v-footer
    v-if="$vuetify.breakpoint.smAndDown"
    class="blue d-flex darken-3"
    fixed
    height="60"
    padless
  >
    <div
      fit
      :style="'width:100%; height:100%;'"
    >
      <v-tabs
        v-if="showTabs"
        active-class="blue darken-4"
        background-color="transparent"
        class="align-center d-flex justify-center"
        color="white"
        fit
        height="60"
        :hide-slider="true"
        padless
        :value="3"
        width="100%"
      >
        <v-tab
          v-for="(link, i) in quickAccessLinks"
          :key="'link' + i"
          class="mb-0"
          :to="link.url"
        >
          <v-icon
            color="white"
            size="20"
          >
            mdi-{{ link.icon }}
          </v-icon>
        </v-tab>
      </v-tabs>
    </div>
  </v-footer>
</template>

<script>
export default {
  name: 'FooterNav',
  data: () => ({
    showTabs: true,
    quickAccessLinks: [
      { url: '/', icon: 'home' },
      { url: '/companies', icon: 'office-building' },
      { url: '/records', icon: 'view-comfy' },
      { url: '/store', icon: 'storefront' },
      { url: '/user/settings', icon: 'cog' }
    ]
  })
}
</script>

<style>
footer div[role="tablist"] {
  width: 100% !important;
}
footer a[role="tab"] button.v-icon {
  font-size: 20px !important;
}
</style>

<style lang="scss" scoped>

.v-tab {
  min-width: 20%;
}
</style>


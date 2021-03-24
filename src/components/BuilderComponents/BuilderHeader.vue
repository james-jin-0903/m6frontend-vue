<template>
  <div>
    <slot name="zero-float" />
    <slot name="first-float" />
    <slot name="second-float" />
    <slot name="third-float" />
    <slot name="fourth-float" />

    <v-card
      class="d-flex justify-center rounded-0 w-full"
      flat
    >
      <div
        class="align-center d-flex justify-space-between mx-auto relative rounded-0 w-full"
        :class="{'max-w-lg pb-4 pt-6': !website, 'nav-bar px-4': website}"
        flat
      >
        <slot name="left-half" />

        <div
          class="flex-space-between"
        >
          <slot name="right-half" />
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'BuilderHeader',
  props: {
    website: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .nav-bar {
    height: 50px;
  }
</style>

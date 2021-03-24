<template>
  <v-container
    class="flat ma-0 pa-0"
  >
    <slot
      class="mt-4"
      name="actionCard"
    />
    <div
      class="card-custom-shadow pt-1 px-5 white"
      :class="recordView ? '' : 'mb-4 rounded-lg'"
      :height="info.height || 'inherit'"
      tile
    >
      <div class="font-weight-bold grey--text text--darken-2 text-body-1 text-center w-full">
        <div class="d-flex">
          <h6
            class="text-center title"
          >
            {{ info.title }}
          </h6>
          <v-spacer />
          <slot
            name="select"
          />
        </div>
      </div>
      <slot
        v-if="hasslot"
        align="center"
        class="font-weight-bold mb-0 purple--text text--darken-1"
        name="user"
      />
      <v-spacer />
      <slot name="previewText" />
      <!-- <v-icon left>{{info.icon}}</v-icon> -->
      <v-row
        align="center"
        class=""
        no-gutters
      >
        <v-col cols="1">
          <slot
            name="image"
          />
        </v-col>
        <v-col cols="11">
          <div class="d-flex">
            <slot name="input" />
          </div>
        </v-col>
        <v-col
          class="pb-6"
          cols="12"
        />
      </v-row>
    </div>
    <slot
      class="my-4"
      name="table"
    />
    <slot
      class="mt-4"
      name="bottomCard"
    />
  </v-container>
</template>

<script>
export default {
  name: 'HeaderComponent',
  props: {
    isTyping: {
      type: Boolean,
      default: false
    },
    recordView: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    },
    hasslot: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.header-title {
  font-size: 1.6em;
  line-height: 1;
}

.tip-container{
  margin-top: 10px;
}
.tip-container span{
  background: #606060;
  color: white;
  padding-right: 0.2rem;
  padding-left: 0.2rem;
  border-radius: 5px;
}
.tip-text{
font-size: 12px!important;
}
.tip-position{
  position: relative;
  bottom: 5px;
}
.title{
  font-size: 16px !important;
  font-weight: bolder;
}
.tip-container p{
  margin: 0;
}
.tip-container strong{
  font-weight: 900 !important;
}
</style>

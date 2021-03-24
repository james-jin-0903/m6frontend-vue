<template>
  <v-row column>
    <v-img
      :aspect-ratio="16 / 9"
      class="sidebar-image"
      max-width="100%"
      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    >
      <v-row
        align="end"
        class="fill-height ma-0"
      >
        <v-col
          class="lightbox pl-2 pt-2 white--text"
          cols="12"
        >
          <v-menu
            offset-y
            open-on-hover
            top
          >
            <template v-slot:activator="{ on }">
              <p
                class="subheading text-truncate"
                v-on="on"
              >
                {{ $h.dg(capitalPlan, 'name', 'N/A') }}
              </p>
            </template>

            <div class="pa-2 white">
              {{ $h.dg(capitalPlan, 'name', 'N/A') }}
            </div>
          </v-menu>

          <v-row class="ma-0">
            <v-col cols="12">
              <p class="body-2 ma-0 text-truncate">
                {{ projectsCount }}
              </p>
              <span class="caption">Projects Count</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-img>

    <div class="text-center">
      <v-btn
        color="blue"
        dark
        @click="showProjects"
      >
        Edit Plan
      </v-btn>
    </div>
  </v-row>
</template>

<script>
import DefaultCapital from '../DefaultCapital'
import Eventbus from '../../../../Eventbus'

export default {
  extends: DefaultCapital,
  methods: {
    showProjects() {
      Eventbus.$emit('show-projects-capital-plan', true)
    }
  }
}
</script>

<style lang="scss">
.sidebar-image {
  .lightbox {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .v-responsive__content {
    max-width: 100%;
  }
}
</style>

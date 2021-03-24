<template>
  <v-card
    class="myclass relative"
    tile
  >
    <builder-header
      class="top-60"
      :website="true"
    >
      <template v-slot:first-float>
        <app-activities-modal />
      </template>

      <template v-slot:second-float>
        <header-background-picker />
      </template>

      <template v-slot:left-half>
        <placeholders :website="true" />
      </template>

      <template v-slot:right-half>
        <div class="align-center d-flex">
          <tabs />
          <v-btn
            class="ml-10 mr-2"
            depressed
          >
            Log in
          </v-btn>
          <v-btn
            class="ml-2"
            color="primary"
            depressed
          >
            Sign up
          </v-btn>
        </div>
      </template>
    </builder-header>

    <v-divider class="blue-grey lighten-5 max-w-lg mx-auto w-full" />

    <builder-body
      :show-social="false"
      :website="true"
    />
  </v-card>
</template>

<script>
import BuilderHeader from '@/components/BuilderComponents/BuilderHeader'
import Tabs from '@/components/BuilderComponents/Tabs'
import BuilderBody from '@/components/BuilderComponents/BuilderBody'
import AppActivitiesModal from '@/components/BuilderComponents/Modals/AppActivitiesModal'
import HeaderBackgroundPicker from '@/components/BuilderComponents/Modals/HeaderBackgroundPicker'
import Placeholders from '@/components/BuilderComponents/Placeholders'
import DefaultFields from '@/components/BuilderComponents/DefaultFields'

export default {

  components: {
    BuilderHeader,
    Tabs,
    BuilderBody,
    AppActivitiesModal,
    HeaderBackgroundPicker,
    Placeholders,
    DefaultFields
  },

  data: () => ({
  })


}
</script>

<template>
  <v-card
    class="myclass relative"
    tile
  >
    <builder-header class="top-60">
      <template v-slot:zero-float>
        <v-btn
          absolute
          class="lighten-2 mr-5 pa-0 red white--text"
          dark
          fab
          left
          small
          style="top: 10px"
          top
          @click="$router.push('/records')"
        >
          <v-icon size="30">
            mdi-close
          </v-icon>
        </v-btn>
      </template>

      <template v-slot:first-float>
        <app-activities-modal />
      </template>

      <template v-slot:second-float>
        <header-background-picker />
      </template>

      <template v-slot:third-float>
        <app-department-modal />
      </template>

      <template v-slot:fourth-float>
        <m6-upload
          @loading="loading = !loading"
          @response="uploadAppBackground"
        >
          <v-btn
            absolute
            color="primary"
            dark
            fab
            left
            small
            style="top: 210px"
            top
          >
            <v-icon>mdi-camera-enhance-outline</v-icon>
          </v-btn>
        </m6-upload>
      </template>

      <template v-slot:left-half>
        <placeholders />
      </template>

      <template v-slot:right-half>
        <default-fields />
      </template>
    </builder-header>

    <v-divider class="blue-grey lighten-5 max-w-lg mx-auto w-full" />

    <tabs />

    <builder-body />

    <m6-loading :loading="loading" />
  </v-card>
</template>

<script>

import { mapState, mapActions, mapMutations } from 'vuex'
import BuilderHeader from '@/components/BuilderComponents/BuilderHeader'
import Tabs from '@/components/BuilderComponents/Tabs'
import BuilderBody from '@/components/BuilderComponents/BuilderBody'
import AppActivitiesModal from '@/components/BuilderComponents/Modals/AppActivitiesModal'
import AppDepartmentModal from '@/components/BuilderComponents/Modals/AppDepartmentModal'
import HeaderBackgroundPicker from '@/components/BuilderComponents/Modals/HeaderBackgroundPicker'
import Placeholders from '@/components/BuilderComponents/Placeholders'
import DefaultFields from '@/components/BuilderComponents/DefaultFields'

export default {
  name: 'BuilderMain',
  components: {
    BuilderHeader,
    Tabs,
    BuilderBody,
    AppActivitiesModal,
    HeaderBackgroundPicker,
    Placeholders,
    DefaultFields,
    AppDepartmentModal
  },

  data: () => ({
    loading: false
  }),

  computed: {
    ...mapState('AppBuilder', {
      app: 'app'
    })
  },

  methods: {
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),

    ...mapActions('AppBuilder', {
      updateApp: 'updateApp'
    }),

    async uploadAppBackground(data) {
      try {
        this.loading = true
        if (data.ok) {
          let metadata = JSON.parse(this.app.metadata)
          if (!metadata) {
            metadata = {}
          }
          metadata.background = data.data.link
          this.app.metadata = JSON.stringify(metadata)
          await this.updateApp({ params: this.app })
          this.notifSuccess('The image was uploaded')
          this.loading = false
        } else {
          this.loading = false
          this.notifDanger('There was an error while uploading')
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
        this.notifDanger('There was an error while uploading')
        this.loading = false
      }
    }
  },

  async mounted() {
    try {
      await this.$store.dispatch('AppBuilder/getApp', this.$route.params.id)
    } catch (e) {}
  }
}
</script>

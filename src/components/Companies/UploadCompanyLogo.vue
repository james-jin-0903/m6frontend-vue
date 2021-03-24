<template>
  <v-container>
    <div class="d-flex justify-center">
      <v-hover v-if="$h.dg(company, 'result.logo')">
        <template v-slot:default="{ hover }">
          <v-img
            alt="company profile logo"
            contain
            max-height="100"
            position="left center"
            :src="$h.dg(company, 'result.logo')"
          >
            <v-fade-transition>
              <v-overlay
                v-if="hover"
                absolute
                class="custom-overlay-profile-image"
                color="#036358"
              >
                <m6-upload
                  btn-button="purple"
                  @loading="loading = !loading"
                  @response="responseProfileImg"
                >
                  <v-icon>mdi-cloud-upload</v-icon>
                </m6-upload>
              </v-overlay>
            </v-fade-transition>
          </v-img>
        </template>
      </v-hover>
      <template v-else>
        <div class="align-center d-flex">
          Upload Company Logo
          <m6-upload
            btn-button="purple"
            @loading="loading = !loading"
            @response="responseProfileImg"
          >
            <v-icon>mdi-cloud-upload</v-icon>
          </m6-upload>
        </div>
      </template>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'UploadCompanyLogo',
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters('Companies', {
      company: 'getCurrentCompany'
    })
  },
  methods: {
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    ...mapActions('Companies', {
      updateCompany: 'updateCompany'
    }),
    async responseProfileImg(res) {
      if (res.ok) {
        this.company.result.logo = res.data.link

        try {
          this.loading = true
          await this.updateCompany(this.company.result)
          this.loading = false
          this.notifSuccess('Company Updated!')
        } catch (e) {
          this.loading = false
          this.notifDanger('There was an error while saving the file')
        }
      } else {
        this.notifDanger('There was an error while saving the file')
      }
    }
  }
}
</script>

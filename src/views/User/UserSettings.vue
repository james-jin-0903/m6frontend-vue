<template>
  <v-container
    class="pa-0"
    :class="[darkModeGlobal ? 'black-fb h-viewport' : 'white']"
    fluid
  >
    <v-container
      class="max-w-settings pa-0"
      fluid
    >
      <v-row class="mx-0 settings-container">
        <v-col
          class="min-h-full pa-0 settings-nav"
          cols="3"
        >
          <settings-side-nav />
        </v-col>
        <v-col
          class="pl-5 pr-0 py-4"
          :class="{'black pr-5': darkModeGlobal}"
          :cols="secondColumnComponent.size || 9"
        >
          <v-row class="ma-0">
            <v-col
              class="pa-0"
              :cols="!thirdColumnComponent.name ? 12 : 7"
            >
              <component
                :is="secondColumnComponent.name"
                class="h-full"
              />
            </v-col>
            <template v-if="!secondColumnComponent.size">
              <v-col
                class="pa-0 pl-5"
                :cols="5"
              >
                <component
                  :is="thirdColumnComponent.name"
                  class="h-full"
                />
              </v-col>
            </template>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import SettingsSideNav from '@/components/user/settings/SettingsSideNav'
import UserMangementTable from '@/components/user/settings/UserMangementTable'
import UserSettingsDetails from '@/components/user/settings/UserSettingsDetails'
import CompanyShow from '@/components/Companies/settings/CompanyShow'
import TaxonomyVocabulary from '@/components/user/settings/TaxonomyVocabulary'
import TaxonomyTerms from '@/components/user/settings/TaxonomyTerms'
import CoreTaxonomy from '@/components/Settings/CoreTaxonomy'
import AppRoles from '@/components/user/settings/AppRoles'
import ManageAppRoles from '@/components/user/settings/ManageAppRoles'
import MailTemplate from '@/components/Settings/MailTemplate'

export default {
  name: 'UserSettings',
  components: {
    SettingsSideNav,
    UserMangementTable,
    UserSettingsDetails,
    CompanyShow,
    TaxonomyVocabulary,
    TaxonomyTerms,
    AppRoles,
    ManageAppRoles,
    CoreTaxonomy,
    MailTemplate
  },
  computed: {
    ...mapState('UserSettingsControl', {
      secondColumnComponent: 'secondColumnComponent',
      thirdColumnComponent: 'thirdColumnComponent'
    }),
    ...mapState('PageControl', {
      darkModeGlobal: 'darkModeGlobal'
    })
  },
  mounted() {
    this.setShowSidePanels(false)
  },
  beforeDestroy() {
    this.setShowSidePanels(true)
  },
  methods: {
    ...mapMutations('PageControl', {
      setShowSidePanels: 'setShowSidePanels'
    })
  }

}
</script>

<style lang="scss">
.settings-container {
  height: calc(100vh - 60px);
  .settings-nav {
    border-right: 1px solid #ccc;
  }
}
.black-fb {
  background: #242526 !important;
}
.black-fb * :not(.v-btn--icon, .v-icon, .v-btn__content) { color: #fff !important; }

</style>

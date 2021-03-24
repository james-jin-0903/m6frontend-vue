<template>
  <v-card
    class="mb-4 min-h-full mx-auto pl-1 pr-4 py-4 transparent"
    flat
  >
    <p
      class="font-weight-bold mb-3 pl-2 text-h5"
      :class="[darkMode? 'white--text' : 'black--text']"
    >
      Configuration
    </p>
    <!-- links -->
    <div
      v-for="(set, setIndex) in links"
      :key="'set-' + setIndex"
    >
      <v-btn
        v-for="(link, index) in set"
        :key="`company-link-${setIndex}-${index}`"
        :ref="`company-link-${setIndex}-${index}`"
        class="align-center capitalize d-flex justify-start my-0 pointer pointer px-2 rounded-lg transparent w-full"
        :class="[darkMode? 'btns-dark-mode' : 'btns-light-mode']"
        dense
        elevation="0"
        height="46"
        @click="setLink(link.prefix, link.size, link.tab, `company-link-${setIndex}-${index}`)"
      >
        <!-- <v-icon color="grey darken-1">
          {{ 'mdi-' + link.icon }}
        </v-icon> -->
        <img
          class="ml-2"
          :src="link.image"
          style="height: auto; width: 16px"
        >
        <p
          class="mb-0 ml-3"
          :class="[darkMode? 'white--text' : 'black--text']"
        >
          {{ link.name }}
        </p>
      </v-btn>
      <v-divider
        v-if="setIndex !== links.length - 1"
        class="my-2 w-full"
        :class="[darkMode ? 'grey' : 'grey lighten-1']"
      />
    </div>
    <v-btn
      class="align-center capitalize d-flex justify-start my-0 pointer pointer px-2 py-6 rounded-lg w-full"
      :class="[darkMode? 'btns-dark-mode' : 'btns-light-mode']"
      color="transparent"
      :dark="darkMode"
      dense
      elevation="0"
      @click="$router.push('/cpm/import/tool')"
    >
      <img
        class="ml-2"
        src="@/assets/settings/cpm.png"
        style="height: auto; width: 16px"
      >
      <p
        class="mb-0 ml-3"
        :class="[darkMode? 'white--text' : 'black--text']"
      >
        Capital Projects Import Tool
      </p>
    </v-btn>
  </v-card>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import UploadCompanyLogo from '@/components/Companies/UploadCompanyLogo'
export default {
  name: 'SettingsSideNav',
  components: { UploadCompanyLogo },
  data: () => ({
    links: [
      [
        // profile
        {
          name: 'My profile',
          prefix: undefined,
          tab: undefined,
          icon: 'cog',
          image: require('../../../assets/settings/my-profile.png')
        }
      ],
      [
        // companyLinks
        {
          name: 'General',
          prefix: 'company-show',
          tab: 0,
          icon: 'cog',
          image: require('../../../assets/settings/general.png')
        },
        {
          name: 'Project Specs',
          prefix: 'company-show',
          tab: 1,
          icon: 'cog',
          image: require('../../../assets/settings/project-specs.png')
        },
        {
          name: 'Social Media',
          prefix: 'company-show',
          tab: 2,
          icon: 'cog',
          image: require('../../../assets/settings/soc-media.png')
        },
        {
          name: 'Locations',
          prefix: 'company-show',
          tab: 3,
          icon: 'cog',
          image: require('../../../assets/settings/locations.png')
        },
        {
          name: 'Codes',
          prefix: 'company-show',
          tab: 4,
          icon: 'cog',
          image: require('../../../assets/settings/codes.png')
        }
      ],
      [
        // userManagementLinks
        {
          name: 'All Users',
          prefix: 'user-mangement-table',
          size: undefined,
          tab: undefined,
          icon: 'cog',
          image: require('../../../assets/settings/all-users.png')
        },
        {
          name: 'App Permissions',
          prefix: 'app-roles',
          size: undefined,
          tab: undefined,
          icon: 'cog',
          image: require('../../../assets/settings/app-permissions.png')
        },
        {
          name: 'Company Roles',
          prefix: 'manage-app-roles',
          size: undefined,
          tab: undefined,
          icon: 'cog',
          image: require('../../../assets/settings/company-roles.png')
        }
      ],
      [
        // companyOrganization
        {
          name: 'Company Organization',
          prefix: 'taxonomy-vocabulary',
          tab: undefined,
          icon: 'plus',
          image: require('../../../assets/settings/company-organization.png')
        }
      ],
      [
        // extraLinks
        {
          name: 'Core Taxonomy',
          prefix: 'core-taxonomy',
          tab: undefined,
          icon: 'cog',
          image: require('../../../assets/settings/core-taxonomy.png')
        },
        {
          name: 'Mail Templates',
          prefix: 'mail-template',
          tab: undefined,
          icon: 'cog',
          image: require('../../../assets/settings/mail-templates.png')
        },
        {
          name: 'IT Applications',
          prefix: undefined,
          tab: undefined,
          icon: 'cog',
          image: require('../../../assets/settings/it-apps.png')
        },
        {
          name: 'Capital Projects Management',
          prefix: undefined,
          tab: undefined,
          icon: 'cog',
          image: require('../../../assets/settings/capital-management.png')
        }
      ]
    ],
    selectedLinkRef: 'company-link-0-0'
  }),
  computed: {
    ...mapState('PageControl', {
      darkMode: 'darkModeGlobal'
    }),
    btnLinksRef() {
      const btnLinks = []
      for (const [key, value] of Object.entries(this.$refs)) {
        if (/^company-link-/.test(key)) {
          btnLinks.push({ key: value })
        }
      }
      return btnLinks
    }
  },
  watch: {
    'darkMode'(val) {
      const self = this
      console.log(self.$vuetify.theme['--v-secondary-lighten1'])
      console.log(self.$vuetify.theme)
      this.$vuetify.theme['secondary'] = '#fff'
      this.$nextTick(() => {
        console.log(val)
        if (val === true) {
          console.log('blas')
          self.$vuetify.theme['--v-secondary-lighten1'] = '#fff'
          console.log(self.$vuetify.theme['--v-secondary-lighten1'])
        } else {
          self.$vuetify.theme['--v-secondary-lighten1'] = '#595959'
        }

        self.$refs[this.selectedLinkRef][0].$el.classList.add('active')
      })
    }
  },
  mounted() {
    this.$refs[this.selectedLinkRef][0].$el.click()
  },
  methods: {
    ...mapMutations('UserSettingsControl', {
      pickingComponent: 'setSecondColumnComponent'
    }),
    setLink(prefix, size, tab, ref) {
      this.selectedLinkRef = ref
      this.btnLinksRef.forEach(valor => {
        valor.key[0].$el.classList.remove('active')
      })

      this.$refs[ref][0].$el.classList.add('active')
      this.pickingComponent({ name: prefix, size: size, tab: tab })
    }
  }
}
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}
.no-flex {
  display: block;
}
.text-left {
  text-align: left;
}
.btns-dark-mode {
  &:hover {
    background: #101215 !important;
  }
  &:before {
    content: none;
  }
  &.active {
    background: #101215 !important;
  }
}
.btns-light-mode {
  &:hover {
    background: #f5f6f7 !important;
  }
  &:before {
    content: none;
  }
  &.active {
    background: #EBEDF0 !important;
  }
}
</style>

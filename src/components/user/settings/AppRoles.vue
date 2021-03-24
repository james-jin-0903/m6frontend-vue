<template>
  <v-container class="ma-0 pa-0">
    <h1
      class="font-weight-bold mb-4 text-h6 text-left w-full"
      :class="[!darkMode ? 'black--text' : 'white--text']"
    >
      App Permissions
    </h1>
    <v-divider class="grey my-2 w-full" />
    <v-autocomplete
      v-model="currentRole"
      class="mt-4"
      :dark="darkMode"
      item-text="name"
      item-value="id"
      :items="roles"
      label="Select Role"
      @change="getFields(currentApp)"
    />

    <v-expansion-panels
      v-if="currentRole"
      :dark="darkMode"
    >
      <v-expansion-panel
        v-for="app in apps"
        :key="app.id"
        @change="getFields(app.id)"
      >
        <v-expansion-panel-header>
          <div class="align-center d-flex item-img-container">
            <div
              class="item-img mr-5 pa-2 rounded"
              :class="[darkMode ? 'grey darken-3' : 'white']"
            >
              <v-img
                v-if="app.iconLink && app.iconLink !== ''"
                alt="m6app_img"
                class="image-icon"
                height="30"
                :src="app.iconLink"
                width="30"
              />
              <template v-else-if="app.metadata">
                <template v-if="app.metadata.appIcon">
                  <v-icon
                    :color="app.metadata.appIcon.iconColor"
                    :size="iconWidth"
                  >
                    {{ app.metadata.appIcon.icon }}
                  </v-icon>
                </template>
                <v-icon
                  v-else
                  :size="30"
                >
                  mdi-store
                </v-icon>
              </template>
              <v-icon
                v-else
                :size="30"
              >
                mdi-store
              </v-icon>
            </div>
            {{ app.title }}
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="m6CustomHeightRoles">
          <v-data-table
            :key="app.id"
            :headers="headers"
            :items="fields"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td class="text-left">
                  {{ item.label }}
                </td>
                <td>
                  <v-checkbox
                    v-model="item.read"
                    class="mt-0"
                    hide-details
                    value="1"
                    @change="updatePermission(item)"
                  />
                </td>
                <td>
                  <v-checkbox
                    v-model="item.write"
                    class="mt-0"
                    hide-details
                    value="1"
                    @change="updatePermission(item)"
                  />
                </td>
                <td>
                  <v-checkbox
                    v-model="item.deleteOpt"
                    class="mt-0"
                    hide-details
                    value="1"
                    @change="updatePermission(item)"
                  />
                </td>
                <td>
                  <v-checkbox
                    v-model="item.appBuilder"
                    class="mt-0"
                    hide-details
                    value="1"
                    @change="updatePermission(item)"
                  />
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'AppRoles',
  data() {
    return {
      fields: [],
      currentApp: null,
      currentRole: null,
      showCreateRole: false,
      headers: [
        {
          text: 'Panel - Field',
          value: 'label'
        },
        {
          text: 'Read'
        },
        {
          text: 'Write'
        },
        {
          text: 'Delete'
        },
        {
          text: 'App Builder'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('DynamicAppsModule', {
      apps: 'getApps'
    }),
    ...mapGetters('AppRoles', {
      roles: 'getRoles'
    }),
    ...mapState('PageControl', {
      darkMode: 'darkModeGlobal'
    })
  },
  async created() {
    await Promise.all(
      [
        this.$store.dispatch('DynamicAppsModule/set_apps'),
        this.$store.dispatch('AppRoles/fetchRoles'),
        this.$store.dispatch('AppRoles/getPermissions', { id: 1 })
      ]
    )
    // await this.getFields()
  },
  methods: {
    async getFields(id) {
      try {
        this.currentApp = id
        const fields = await this.$store.dispatch('DynamicAppsModule/getAllFields', {
          id,
          roleId: this.currentRole
        })

        this.fields = fields.map(item => {
          const permission = this.$h.dg(item, 'app_roles.permission', '0000')
          item.read = permission[0]
          item.write = permission[1]
          item.deleteOpt = permission[2]
          item.appBuilder = permission[3]
          return item
        })
      } catch (e) {
        this.$snotify.error(e, 'Error')
      }
    },
    async updatePermission(item) {
      try {
        const data = {
          'appRoleId': this.$h.dg(item, 'app_roles.id', 0),
          'role_id': this.$h.dg(item, 'app_roles.role_id', this.currentRole), // Hardcoded
          'app_id': this.$h.dg(item, 'app_roles.app_id', this.currentApp),
          'panel_id': this.$h.dg(item, 'app_roles.panel_id', item.panel_id),
          'field_id': this.$h.dg(item, 'app_roles.field_id', item.id),
          'permission': `${item.read}${item.write}${item.deleteOpt}${item.appBuilder}`
        }
        await this.$store.dispatch('AppRoles/updateRolePermissions', data)
        this.$snotify.success('Role updated', 'Success')
        await this.getFields(this.currentApp)
      } catch (e) {
        this.$snotify.error(e, 'Error')
      }
    },
    save() {},
    close() {}

  }
}
</script>

<style lang="scss" scoped>
 .m6CustomHeightRoles{
   min-height: 600px;
 }
</style>

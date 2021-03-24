<template>
  <m6-card-dialog
    title="Project Team"
    toolbar-color="#02a7f0"
  >
    <template v-slot:after:title>
      <v-tooltip
        v-if="$route.name === 'cpm.projects.show'"
        left
      >
        <template v-slot:activator="{ on }">
          <a
            class="pointer pr-1"
            :href="'/m6apps#/cpm/projects/' + $route.params.id + '/fullscreen/project-assignment'"
            target="_blank"
            v-on="on"
          >
            <v-icon
              light
              text
            >
              mdi-launch
            </v-icon>
          </a>
        </template>
        <span>{{ $t('general.openNewTab') }}</span>
      </v-tooltip>

      <v-icon
        class="cursor"
        light
        @click="editModal = true"
      >
        mdi-pencil
      </v-icon>

      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-icon
            v-if="isAdmin"
            class="cursor"
            color="white"
            v-on="on"
            @click="showSettings = true"
          >
            mdi-cog
          </v-icon>
        </template>
        <span>Settings</span>
      </v-tooltip>
    </template>

    <v-container
      v-if="teamMembers.length"
      class="pa-0 rounded-lg"
      fluid
      grid-list-md
    >
      <template v-for="(teamMember, index) in teamMembers">
        <v-row
          :key="teamMember.value + 'data' + index"
          align="center"
        >
          <v-col md="1">
            <v-avatar size="30">
              <img :src="getAvatar(teamMember)">
            </v-avatar>
          </v-col>
          <v-col md="6">
            <v-container
              class="pa-0 rounded-lg"
              fluid
              grid-list-md
            >
              <v-row>
                <v-col md="12">
                  {{ teamMember.user }}
                </v-col>
                <v-col md="12">
                  {{ teamMember.email }}
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col
            v-if="teamMember.type === 'manager'"
            md="5"
          >
            <v-chip
              color="primary"
              text-color="white"
            >
              Project Manager
            </v-chip>
          </v-col>
          <v-col
            v-else
            md="5"
          >
            <v-chip
              :style="getStyleColor(teamMember)"
              text-color="white"
            >
              Team Member
            </v-chip>
          </v-col>
        </v-row>
      </template>
    </v-container>

    <v-dialog
      v-model="editModal"
      max-width="500px"
      persistent
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            Edit Project Team
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />
        <v-card-text class="vertical-scroll">
          <v-container
            class="pa-0 rounded-lg"
            fluid
            grid-list-md
          >
            <v-row>
              <v-col md="12">
                <v-autocomplete
                  v-if="roles && projectManager"
                  v-model="editDraft.manager"
                  clearable
                  item-text="label"
                  :items="sortedProjectManager"
                  label="Project Manager"
                  return-object
                >
                  <template v-slot:item="{ item }">
                    {{ item.label }}
                  </template>
                  <template slot="no-options">
                    type to search users..
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col md="12">
                <v-autocomplete
                  id="teamMembers"
                  clearable
                  item-text="label"
                  :items="roleUsers"
                  label="Team Members"
                  multiple
                  :value="editDraft.teamMembers"
                  @input="setSelected"
                  @update:searchInput="getUsers"
                >
                  <template v-slot:selection="{ item }">
                    <v-chip
                      close
                      :style="getStyleRoleUser(item)"
                      @input="removeMember(item)"
                    >
                      {{ item.label }}
                    </v-chip>
                  </template>

                  <template v-slot:item="{ item }">
                    <div class="chip-member">
                      <strong>{{ item.user }}</strong>
                      <br>
                      {{ item.role }}, {{ item.email }}
                    </div>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :loading="submitLoading"
            text
            @click.prevent="closeDialog"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-3"
            dark
            :loading="submitLoading"
            @click.prevent="saveProject"
          >
            {{ submitLoading ? 'Saving...' : 'Save' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <settings-modal
      v-if="showSettings && type !== 'forecasted'"
      :show="showSettings"
      @close="showSettings = false"
    />
    <planned-settings-modal
      v-if="showSettings && type === 'forecasted'"
      :show="showSettings"
      @close="showSettings = false"
    />
  </m6-card-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { db } from '@/utils/Firebase'

import settingsModal from '../settings_modals/ProjectAssignment'
import PlannedSettingsModal from '../settings_modals/planned/ProjectAssignment'

export default {
  name: 'ProjectAssignment',
  components: {
    'settings-modal': settingsModal,
    'planned-settings-modal': PlannedSettingsModal
  },
  props: {
    type: {
      type: String,
      default: 'project'
    }
  },

  data() {
    return {
      isAdmin: true,
      showSettings: false,
      submitLoading: false,
      company_nid: this.currentCompany.id,
      roles: [],
      users: [],
      createModal: false,
      projectManager: [],
      project: {},
      showAddTeamMembers: false,
      settings: {},
      editModal: false,
      images: {},
      defaultImage: '/sites/all/themes/m6connect/images/default_userpdf.png',
      editDraft: {}
    }
  },

  computed: {
    ...mapGetters(['appLabel']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    sortedProjectManager() {
      let aux = []
        .concat(
          this.$h.dg(this, 'users.projectManager', []),
          this.$h.dg(this, 'users.projectCoordinator', [])
        )
        .flat()
      aux = this.lodash.orderBy(aux, 'label', 'asc')

      return aux
    },

    roleUsers() {
      const aux = []
      if (this.roles && this.roles.roles && this.roles.roles.length > 0) {
        const found = this.roles.roles.find(row => row.name === 'Member')
        if (!found) {
          this.roles.roles.push({
            name: 'Member',
            users: []
          })
          db
            .collection('settings')
            .doc(this.company_nid)
            .collection(`${this.settingCollectionName}`)
            .doc('roles').update({
              roles: this.roles.roles
            })
        }

        this.roles.roles.map(role => {
          role.users.map(user => {
            const auxObject = {
              role: role.name,
              user: user.label,
              email: user.email,
              label: user.label + ' - ' + role.name,
              color: role.color && role.color.hex ? role.color.hex : '#E0E0E0',
              value: user.value
            }
            if (role.vendorRole !== undefined) {
              auxObject.vendorRole = role.vendorRole
            }

            aux.push(auxObject)
          })
        })
      }
      return aux
    },

    teamMembers() {
      const aux = []

      if (this.project.manager) {
        const manager = { ...this.project.manager }
        manager.type = 'manager'
        manager.user = manager.label
        aux.push(manager)
      }
      if (this.project.teamMembers && this.project.teamMembers.length > -1) {
        this.project.teamMembers.forEach(teamMemberId => {
          const user = this.roleUsers.find(roleUser => roleUser.value === teamMemberId)

          if (user) {
            const userAux = { ...user }
            userAux.type = 'member'
            aux.push(userAux)
          }
        })
      }

      if (aux.length > 0) {
        const ids = this.getIds(aux)
        this.getImages(ids)
      }

      return aux
    },
    settingCollectionName() {
      if (this.$route.name.includes('forecasting')) {
        return 'planned_settings'
      } else {
        return 'settings'
      }
    }
  },

  watch: {
    project: function (newVal) {
      this.editDraft = { ...newVal }
    },
    roleUsers: function () {
      if (this.roles && this.roles.roles && this.roles.roles.length > 0) {
        this.roles.roles.map(role => {
          role.users.map(user => {
            const auxObject = {
              role: role.name,
              user: user.label,
              email: user.email,
              label: user.label + ' - ' + role.name,
              color: role.color && role.color.hex ? role.color.hex : '#E0E0E0',
              value: user.value
            }
            if (role.vendorRole !== undefined) {
              auxObject.vendorRole = role.vendorRole
            }

            if (role.name === 'Project Coordinator') {
              if (!this.projectManager) {
                this.projectManager = []
              }
              this.projectManager.push(auxObject)
            }
          })
        })
      }
    }
  },

  mounted() {
    this.getSettings()
  },

  firestore() {
    return {
      project: db
        .collection(this.appLabel.firebaseCollection)
        .doc(this.$route.params.id),
      users: db
        .collection('settings')
        .doc(this.company_nid)
        .collection(`${this.settingCollectionName}`)
        .doc(this.appLabel.usersCollection),
      roles: db
        .collection('settings')
        .doc(this.company_nid)
        .collection(`${this.settingCollectionName}`)
        .doc('roles')
    }
  },

  methods: {
    removeMember(memberRemove) {
      const index = this.editDraft.teamMembers.findIndex(member => member === memberRemove)

      if (index > -1) {
        this.editDraft.teamMembers.splice(index, 1)
      }
    },

    closeDialog() {
      this.editModal = false
    },

    getAvatar(teamMember) {
      let image = this.defaultImage
      if (this.images[teamMember.value]) {
        image = this.images[teamMember.value].user_image
      }

      return image
    },

    getIds(members = []) {
      const idsToGet = []

      for (let i = 0; i < members.length; i++) {
        const element = members[i]

        // Id not found in the images that we already have
        // if ( !this.images[element.value] ){
        idsToGet.push(parseInt(element.value))
        // }
      }

      return idsToGet
    },

    getStyleColor(teamMember) {
      if (teamMember.color) {
        return 'background:' + teamMember.color
      }

      return ''
    },

    alphabetical(val, order = '') {
      if (Array.isArray(val) && val.length > 0) {
        let value = [...val]
        switch (order) {
          case 'Ascending':
          case 'asc':
            value = value.sort()
            break
          case 'Descending':
          case 'desc':
            value = value.sort().reverse()
            break
          default:
            break
        }
        return value
      } else {
        return val
      }
    },

    showTeamMember(value) {
      this.showAddTeamMembers = value
    },
    getUsers(search, loading) {
      if (search) {
        this.searchUsers(loading, search, this)
      }
    },
    searchUsers: _.debounce((loading, search, vm) => {
      fetch(`/fm-dev/users/search/${escape(search)}`)
        .then(res => res.json())
        .then(json => {
          const rol = vm.roles.roles.find(row => row.name === 'Member')
          if (rol) {
            json.map(row => {
              const found = rol.users.find(e => e.value === row.value)
              if (!found) {
                rol.users.push(row)
              }
            })
            db
              .collection('settings')
              .doc(vm.company_nid)
              .collection(`${vm.settingCollectionName}`)
              .doc('roles')
              .update({
                roles: vm.roles.roles
              })
          }
        })
    }, 350),

    setSelected(value) {
      this.editDraft.teamMembers = value
      this.editDraft.vendorTeamMembers = []
      value.map(u => {
        if (u.vendorRole !== undefined) {
          this.editDraft.vendorTeamMembers.push(u.email)
        }
      })
      if (this.editDraft.teamMembers.length === 0) {
        this.showTeamMember(false)
      }
    },

    getStyleRoleUser(option) {
      return {
        'background-color': option.color,
        'font-size': '10px'
      }
    },

    getSettings() {
      db.collection('settings')
        .doc(this.company_nid)
        .collection(`${this.settingCollectionName}`)
        .doc(this.appLabel.settingsCollection)
        .get()
        .then(snap => {
          this.settings = snap.data()
          this.settings.phases = this.alphabetical(
            this.settings.phases,
            this.$h.dg(this.settings, 'project_order.phase_order')
          )
          this.settings.status = this.alphabetical(
            this.settings.status,
            this.$h.dg(this.settings, 'project_order.status_order')
          )

          if (
            this.$route.params.id === 'new' &&
            this.settings.defaultStandard
          ) {
            this.project.standard = this.settings.defaultStandard
          }
        })
    },

    saveProject() {
      db.collection(this.appLabel.firebaseCollection)
        .doc(this.$route.params.id)
        .update({
          manager: this.editDraft.manager,
          teamMembers: this.editDraft.teamMembers
        })
        .then(() => {
          this.editModal = false
          this.$snotify.success('The project has been saved', 'Success')
        })
    },

    getImages(usersId = []) {
      if (usersId.length <= 0) {
        return
      }

      const payload = {
        usersId
      }

      this.axios
        .post('/m6-platform/api/user_profile_images', payload)
        .then(response => {
          const results = response.data
          const data = {}

          usersId.forEach(userId => {
            if (results[userId]) {
              data[userId] = { user_image: results[userId] }
            } else {
              data[userId] = {
                user_image: this.defaultImage
              }
            }
          })

          this.images = { ...data }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.label-role-users {
  padding: 11px 30px;
  color: #000;
  border-radius: 30px;
  margin: 5px;
}
.chip-member {
  font-size: 10px;
}
</style>

<template>
  <div class="mb-5 relative">
    <div class="actions-container">
      <v-btn
        color="grey darken-4"
        icon
        @click="searchBar = !searchBar"
      >
        <v-icon :class=" !lightMode ? 'grey--text text--darken-2' : 'white--text' ">
          mdi-magnify
        </v-icon>
      </v-btn>
    </div>
    <div>
      <h4
        class="pointer"
        :class=" !lightMode ? 'mb-3 ml-1' : 'white--text mb-3 ml-1'"
        @click="showPannel = !showPannel"
      >
        <v-icon>
          mdi-chevron-{{ showPannel ? 'up' : 'down' }}
        </v-icon>
        {{ department.name }}
      </h4>
      <div v-if="showPannel">
        <input
          v-show="searchBar"
          ref="searchInput"
          v-model="searchInput"
          class="search-input"
          placeholder="Start Typing to Search"
          type="text"
        >
        <v-btn
          v-for="user in filteredUsers"
          :key="'user-' + department.name + user.id"
          class="capitalize d-flex justify-start my-0 pointer px-2 py-6 w-full"
          color="transparent"
          elevation="0"
          @click="startChat(user)"
        >
          <v-badge
            bottom
            class="mr-3"
            dot
            offset-x="10"
            offset-y="10"
          >
            <v-avatar
              :color="user.avatar ? 'transparent' : 'blue'"
              dark
              size="36"
            >
              <v-img
                v-if="user.avatar"
                :src="user.avatar"
              />
              <template v-else>
                <span class="text-uppercase white--text">{{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}</span>
              </template>
            </v-avatar>
          </v-badge>
          <div class="align-start d-flex flex-column">
            <p :class=" !lightMode ? 'grey--text text--darken-2 mb-0' : 'white--text mb-0' ">
              {{ user.firstName }} {{ user.lastName }}
            </p>
            <span :class="'text-caption ' + departmentColor(user.type)">{{ user.departmentName }}</span>
          </div>
        </v-btn>
        <div
          v-if="filteredUsers.length >= 4"
          class="align-center d-flex grey--text my-2 pointer text-caption"
          @click="changeView"
        >
          <v-divider class="blue-grey lighten-5" />
          <span class="mx-3">{{ showAll ? 'Show Less' : 'Show All' }}</span>
          <v-icon>
            mdi-chevron-{{ showAll ? 'up': 'down' }}
          </v-icon>
          <v-divider class="blue-grey lighten-5" />
        </div>
        <div
          v-if="filteredUsers.length === 0"
          :class=" !lightMode ? 'grey--text text--darken-2' : 'white--text' "
        >
          No results found
        </div>
      </div>
    </div>
    <div v-if="lastDepartment">
      <v-divider class="blue-grey lighten-4 mt-4" />
      <v-divider class="blue-grey lighten-4" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'DepartmentChat',
  props: {
    department: {
      type: Object,
      default: () => {}
    },
    lightMode: {
      type: Boolean,
      default: false
    },
    isForMessenger: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    showPannel: true,
    showAll: false,
    searchBar: false,
    searchInput: '',
    lastDepartment: false,
    users: []
  }),
  computed: {
    ...mapState(['layout', 'chats']),
    ...mapGetters('GSChat', { client: 'client' }),
    ...mapGetters('Auth', { currentUser: 'getUser' }),
    filteredUsers() {
      if (this.users) {
        return this.users.filter(user => {
          if (user.id.toString() === this.currentUser.id) {
            return false
          }
          if (user.firstName && user.firstName.toLowerCase().trim().indexOf(this.searchInput.toLowerCase().trim()) !== -1) {
            return true
          }
          if (user.lastName && user.lastName.toLowerCase().trim().indexOf(this.searchInput.toLowerCase().trim()) !== -1) {
            return true
          }
          return false
        })
      }
      return []
    }
  },
  watch: {
    department(value) {
      this.showAll = false
      if (value.users.length && value.users.length > 5) {
        this.users = value.users.slice(0, 5)
      } else {
        this.users = value.users.slice(0, 5)
      }
    }
  },
  mounted() {
    if (this.department.users.length && this.department.users.length > 5) {
      this.users = this.department.users.slice(0, 5)
    } else {
      this.users = this.department.users.slice(0, 5)
    }
  },
  methods: {
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger'
    }),
    async startChat(currentUser) {
      const response = await this.client.queryUsers({
        id: { $in: [currentUser.id.toString()] }
      })
      if (!response.users.length) {
        // Start New GSChat
        await this.makeUser(currentUser)
        await this.makeUser(this.currentUser)
      }

      this.$store.dispatch('GSChat/createChat', {
        members: [
          this.currentUser.id.toString(),
          currentUser.id.toString()
        ],
        isForMessenger: this.isForMessenger
      })
    },
    async makeUser(user) {
      const cUser = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        image: user.profilePic
      }

      await this.client.disconnect()
      await this.$store.dispatch('GSChat/getGSToken', user)
      await this.$store.dispatch('GSChat/setUser', cUser)
      return true
    },
    showSearchInputFunction() {
      this.showSearchInput = !this.showSearchInput
      this.$nextTick(() => this.$refs.searchInput.focus())
    },
    departmentColor(type) {
      return type === 'internal' ? 'grey--text text--darken-1' : 'blue--text text--darken-1'
    },
    changeView() {
      this.users = this.showAll ? this.department.users.slice(0, 5) : this.department.users
      this.showAll = !this.showAll
    }
  }
}
</script>

<style lang="scss" scoped>
.actions-container {
    position: absolute;
    right: 0;
    z-index: 1;
    margin-top: -5px;
}
.mdi-chevron-right::before {
    background: #ddd;
    border-radius: 100%;
    margin: 6px 6px 6px 10px;
}
.v-expansion-panel-content__wrap {
    padding: 0;
}
</style>

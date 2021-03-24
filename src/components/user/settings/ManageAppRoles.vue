<template>
  <v-container class="ma-0 pa-0">
    <h1
      class="font-weight-bold mb-4 text-h6 text-left w-full"
      :class="[!darkMode ? 'black--text' : 'white--text']"
    >
      Company Roles
    </h1>
    <v-divider class="grey my-2 w-full" />
    <v-card
      class="transparent"
      flat
    >
      <div class="d-flex justify-end">
        <v-btn
          color="green"
          dark
          icon
          rounded
          @click="openModal(false)"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
      <v-data-table
        :dark="darkMode"
        :headers="headers"
        :items="roles"
      >
        <template v-slot:item.groups="{item}">
          <template v-for="taxonomy in item.taxonomies">
            <v-chip
              class="mx-2 my-1"
              small
            >
              {{ getTaxonomyName(taxonomy) }}
            </v-chip>
          </template>
        </template>

        <template v-slot:item.actions="{item}">
          <v-btn
            color="blue"
            icon
            @click="openModal(item.id)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            color="red"
            icon
            @click="deleteFn(item.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-divider class="grey my-2 w-full" />

    <default-m6-modal
      v-if="showModalRole"
      @close="close"
    >
      <template slot="title">
        {{ !role.id ? 'Create New Role' : 'Edit Role' }}
      </template>
      <template slot="content">
        <v-form ref="newRoleForm">
          <v-text-field
            v-model="role.name"
            label="Role Name"
          />
          <v-autocomplete
            v-model="role.taxonomies"
            chips
            item-text="title"
            item-value="id"
            :items="terms"
            label="Select Company Feed Access"
            multiple
          />
        </v-form>
      </template>

      <template slot="actions">
        <v-spacer />
        <v-btn
          color="red"
          outlined
          text
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="green"
          outlined
          text
          @click="save"
        >
          Save
        </v-btn>
      </template>
    </default-m6-modal>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'ManageAppRoles',
  data() {
    return {
      headers: [
        {
          text: 'Role Name',
          value: 'name',
          width: '180px'
        },
        {
          text: 'Company Feeds',
          value: 'groups',
          sortable: false
        },
        {
          text: 'Actions',
          value: 'actions',
          align: 'right',
          width: '120px'
        }
      ],
      showModalRole: false,
      role: {},
      terms: []
    }
  },
  computed: {
    ...mapGetters('AppRoles', {
      roles: 'getRoles'
    }),
    ...mapState('PageControl', {
      darkMode: 'darkModeGlobal'
    })
  },
  async created() {
    await this.$store.dispatch('AppRoles/fetchRoles')
    this.terms = await this.$store.dispatch('Taxonomy/getAllTerms')
  },
  methods: {
    openModal(id) {
      if (!id) {
        this.role = {}
      } else {
        const role = this.roles.find(i => i.id === id)
        this.role = { ...role }
      }
      this.showModalRole = true
    },
    close() {
      this.showModalRole = false
      this.role = {}
    },
    async deleteFn(id) {
      try {
        await this.$store.dispatch('AppRoles/deleteRole', { id })
        await this.$store.dispatch('AppRoles/fetchRoles')
        this.$snotify.success('Role Deleted', 'Success')
      } catch (e) {
        this.$snotify.error(e, 'Error')
      }
    },
    async save() {
      try {
        if (this.role.id) {
          await this.$store.dispatch('AppRoles/updateRole', this.role)
          this.$snotify.success('Role Updated', 'Success')
        } else {
          await this.$store.dispatch('AppRoles/createRole', this.role)
          this.$snotify.success('Role Created', 'Success')
        }

        await this.$store.dispatch('AppRoles/fetchRoles')
        this.close()
      } catch (e) {
        this.$snotify.error(e, 'Error')
      }
    },
    getTaxonomyName(id) {
      const item = this.terms.find(i => i.id === id)
      if (item) {
        return item.title
      }
      return ''
    }
  }
}
</script>

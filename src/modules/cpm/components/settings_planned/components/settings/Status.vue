<template>
  <component-template>
    <template slot="button">
      <v-btn
        color="primary"
        dark
        fab
        small
        @click="showForm = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-container class="pt-0 rounded-lg">
      <label>Current Status</label>
      <v-list
        class="mainList"
        dense
      >
        <v-list-tile class="myListHeader">
          <v-list-tile-content>Name</v-list-tile-content>
          <v-list-tile-action>Action</v-list-tile-action>
        </v-list-tile>
        <draggable
          v-model="settings.status"
          :options="{ group: 'status' }"
          @end="drag = false"
          @start="drag = true"
          @update="saveOrder"
        >
          <v-list-tile
            v-for="(name, key) in settings.status"
            :key="key"
            class="myList"
          >
            <v-list-tile-avatar>
              <v-icon
                color="blue"
                small
              >
                mdi-drag-variant
              </v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>{{ name }}</v-list-tile-content>
            <v-list-tile-action
              style="flex-direction:row; justify-content: flex-end;"
            >
              <v-btn
                class="xs-btn"
                fab
                icon
                @click.prevent="editStatus(key, name)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                class="xs-btn"
                fab
                icon
                @click.prevent="deleteStatus(key, name)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </draggable>
      </v-list>
    </v-container>

    <v-card
      v-if="showForm"
      class="mt-2"
    >
      <v-card-text class="vertical-scroll">
        <v-form ref="form">
          <h6
            v-if="currentStatus"
            class="indigo--text"
          >
            Editing:
          </h6>
          <v-text-field
            v-model="status"
            color="blue"
            :label="`${appLabel.singular} Status Name`"
          />
          <input
            v-model="currentStatus"
            type="hidden"
          >
          <v-btn
            color="blue"
            outline
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue"
            dark
            type="submit"
            @click="saveStatus"
          >
            {{ submitLoading ? "Saving..." : "Save" }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </component-template>
</template>

<script>
import { db } from '@/utils/Firebase'
import ComponentTemplate from '../ComponentTemplate'
import { mapState, mapGetters } from 'vuex'
import draggable from 'vuedraggable'
export default {
  components: {
    ComponentTemplate,
    draggable
  },
  data() {
    return {
      status: '',
      currentStatus: '',
      settings: {},
      submitLoading: false,
      rules: {
        required: value => !!value || 'Required.'
      },
      showForm: false
    }
  },
  computed: {
    ...mapGetters(['appLabel']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  mounted() {
    db.collection('settings')
      .doc(this.currentCompany.id)
      .collection('planned_settings')
      .doc(this.appLabel.settingsCollection)
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('planned_settings')
            .doc(this.appLabel.settingsCollection)
            .set({
              status: []
            })
        }
      })
  },
  methods: {
    saveOrder() {
      console.log('saveOrder')
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          status: this.settings.status
        })
    },
    saveStatus() {
      if (this.status === '') {
        this.$snotify.error(
          `${this.appLabel.singular} status name is required`,
          'Error'
        )
        return
      }
      if (this.currentStatus === '') {
        if (!this.settings.status) {
          this.settings.status = []
        }
        this.settings.status.push(this.status)
      } else {
        this.$set(this.settings.status, this.currentStatus, this.status)
      }
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          status: this.settings.status
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} status has been saved`,
        'Success'
      )
      this.status = ''
      this.currentStatus = ''
    },
    deleteStatus(id, name) {
      const confirmation = confirm(
        `Do you want to delete this ${this.appLabel.singular} status: ${name}`
      )
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.status.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          status: this.settings.status
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} status has been deleted`,
        'Success'
      )
    },
    editStatus(id, name) {
      this.status = name
      this.currentStatus = id
      this.showForm = true
    },
    cancel() {
      this.status = ''
      this.currentStatus = ''
      this.showForm = false
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
    }
  }
}
</script>

<style lang="scss" scope>
.mainList {
  border: 1px solid #ccc;
  .v-list__tile__action {
    width: 20%;

    button {
      z-index: 1;
    }
  }
  .myListHeader {
    .v-list__tile__action {
      padding-right: 10px;
    }
  }
  .myList {
    border-bottom: 1px solid #ccc;

    &:first-child {
      border-top: 1px solid #ccc;
    }
    &:nth-child(odd) {
      background: #f9f9f9;
    }
    &:last-child {
      border-bottom: none;
    }
  }
  .v-list__tile__content {
    font-size: 13px;
  }
}
</style>

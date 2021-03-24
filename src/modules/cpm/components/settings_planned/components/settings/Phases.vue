<template>
  <component-template>
    <template slot="button">
      <v-btn
        color="primary"
        fab
        light
        small
        @click="showForm = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-container class="pt-2 rounded-lg">
      <v-list
        class="mainList"
        dense
      >
        <v-list-tile class="myListHeader">
          <v-list-tile-content>Name</v-list-tile-content>
          <v-list-tile-action>Action</v-list-tile-action>
        </v-list-tile>
        <draggable
          v-model="settings.phases"
          :options="{ group: 'status' }"
          @end="drag = false"
          @start="drag = true"
          @update="saveOrder"
        >
          <v-list-tile
            v-for="(name, key) in settings.phases"
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
                @click.prevent="edit(key, name)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                class="xs-btn"
                fab
                text
                @click.prevent="deletePhase(key, name)"
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
            v-if="currentPhase"
            class="indigo--text"
          >
            Editing:
          </h6>
          <v-text-field
            v-model="phase"
            color="blue"
            :label="`${appLabel.singular} ${appLabel.profile.phase} Name`"
          />
          <input
            v-model="currentPhase"
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
            @click="save"
          >
            {{ submitLoading ? 'Saving...' : 'Save' }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </component-template>
</template>

<script>
import { db } from '@/utils/Firebase.js'
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
      phase: '',
      currentPhase: '',
      settings: {},
      submitLoading: false,
      showForm: false,
      rules: {
        required: value => !!value || 'Required.'
      }
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
              phases: []
            })
        }
      })
  },
  methods: {
    saveOrder() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          phases: this.settings.phases
        })
    },
    save() {
      if (this.phase === '') {
        this.$snotify.error(
          `${this.appLabel.singular} ${this.appLabel.profile.phase} name is required`,
          'Error'
        )
        return
      }
      if (this.currentPhase === '') {
        if (!this.settings.phases) {
          this.settings.phases = []
        }
        this.settings.phases.push(this.phase)
      } else {
        this.$set(this.settings.phases, this.currentPhase, this.phase)
      }
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          phases: this.settings.phases
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} ${this.appLabel.profile.phase} has been saved`,
        'Success'
      )
      this.cancel()
    },
    deletePhase(id, name) {
      const confirmation = confirm(
        `Do you want to delete this ${this.appLabel.singular} ${this.appLabel.profile.phase}: ${name}`
      )
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.phases.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('planned_settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          phases: this.settings.phases
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} ${this.appLabel.profile.phase} has been deleted`,
        'Success'
      )
    },
    edit(id, name) {
      this.phase = name
      this.currentPhase = id
      this.showForm = true
    },
    cancel() {
      this.phase = ''
      this.currentPhase = ''
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

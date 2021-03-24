<template>
  <div>
    <v-card>
      <v-card-title class="relative">
        <v-btn
          absolute
          color="blue"
          dark
          fab
          right
          small
          @click="showForm = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="vertical-scroll">
        <div class="form-group">
          <label>
            {{ $t("general.current") }}
            {{ $t("general.status") }}
          </label>

          <v-list
            class="mainList"
            dense
          >
            <v-list-item class="myListHeader">
              <v-list-item-content>
                {{ $t("general.name") }}
              </v-list-item-content>

              <v-list-item-action>
                {{ $t("general.action") }}
              </v-list-item-action>
            </v-list-item>

            <draggable
              v-model="settings.status"
              :options="{ group: 'status' }"
              @end="drag = false"
              @start="drag = true"
              @update="saveOrder"
            >
              <v-list-item
                v-for="(name, key) in settings.status"
                :key="key"
                class="myList"
              >
                <v-list-item-avatar>
                  <v-icon
                    color="blue"
                    small
                  >
                    mdi-drag-variant
                  </v-icon>
                </v-list-item-avatar>

                <v-list-item-content>{{ name }}</v-list-item-content>

                <v-list-item-action
                  style="flex-direction: row; justify-content: flex-end"
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
                </v-list-item-action>
              </v-list-item>
            </draggable>
          </v-list>
        </div>
      </v-card-text>
    </v-card>

    <v-card
      v-if="showForm"
      class="mt-2 rounded-lg"
    >
      <v-card-text class="vertical-scroll">
        <v-form ref="form">
          <h6
            v-if="currentStatus"
            class="indigo--text"
          >
            {{ $t("general.editing") }}
          </h6>

          <v-text-field
            v-model="status"
            color="blue"
            :label="
              `${appLabel.singular} ${$t('general.status')} ${$t(
                'general.name'
              )}`
            "
          />

          <input
            v-model="currentStatus"
            type="hidden"
          >

          <v-btn
            color="blue"
            outlined
            @click="cancel"
          >
            Cancel
          </v-btn>

          <v-btn
            color="blue"
            dark
            type="button"
            @click="saveStatus"
          >
            {{ submitLoading ? $t("general.saving") : $t("general.save") }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'
import { mapState, mapGetters } from 'vuex'
import draggable from 'vuedraggable'
export default {
  components: {
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
      .collection('settings')
      .doc(this.appLabel.settingsCollection)
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc(this.appLabel.settingsCollection)
            .set({
              status: []
            })
        }
      })
  },
  methods: {
    saveOrder() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          status: this.settings.status
        })
    },
    saveStatus() {
      if (this.status === '') {
        this.$snotify.error(
          `${this.appLabel.singular} ${this.$t(
            'cpmSettings.settings.statusNameRequired'
          )}`,
          this.$t('alerts.error')
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
        .collection('settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          status: this.settings.status
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} ${this.$t(
          'cpmSettings.settings.statusSaved'
        )}`,
        this.$t('alerts.success')
      )
      this.status = ''
      this.currentStatus = ''
    },
    deleteStatus(id, name) {
      const confirmation = confirm(
        `${this.$t('general.deleteMsg')} ${this.appLabel.singular} ${this.$t(
          'general.status'
        )}: ${name}`
      )
      if (confirmation) {
        this.submitDelete(id)
      }
    },
    submitDelete(id) {
      this.settings.status.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          status: this.settings.status
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} ${this.$t(
          'cpmSettings.settings.statusDeleted'
        )}`,
        this.$t('alerts.success')
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
        .collection('settings')
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

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
            {{ $t('general.current') }}
            {{ $t('general.status') }}
          </label>

          <v-list
            class="mainList"
            dense
          >
            <v-list-tile class="myListHeader">
              <v-list-tile-content>
                {{ $t('general.name') }}
              </v-list-tile-content>

              <v-list-tile-action>
                {{ $t('general.action') }}
              </v-list-tile-action>
            </v-list-tile>

            <draggable
              v-model="settings.rfpStatus"
              :options="{ group: 'rfpStatus' }"
              @end="drag = false"
              @start="drag = true"
              @update="saveOrder"
            >
              <v-list-tile
                v-for="(status, key) in settings.rfpStatus"
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

                <v-list-tile-content>
                  {{ status.name }}
                </v-list-tile-content>

                <v-list-tile-action
                  style="flex-direction:row; justify-content: flex-end;"
                >
                  <v-btn
                    class="xs-btn"
                    fab
                    icon
                    @click.prevent="editStatus(key, status)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>

                  <v-btn
                    class="xs-btn"
                    fab
                    icon
                    @click.prevent="deleteStatus(key, status)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </draggable>
          </v-list>
        </div>
      </v-card-text>
    </v-card>

    <v-card
      v-if="showForm"
      class="mt-2"
    >
      <v-card-text class="vertical-scroll">
        <v-form ref="form">
          <h6
            v-if="currentRfpStatus"
            class="indigo--text"
          >
            {{ $t('general.editing') }}
          </h6>

          <v-text-field
            v-model="rfpStatus.name"
            color="blue"
            :label="
              `${appLabel.singular} ${$t('general.status')} ${$t(
                'general.name'
              )}`
            "
          />

          <input
            v-model="currentRfpStatus"
            type="hidden"
          >

          <v-btn
            color="blue"
            outline
            @click="cancel"
          >
            {{ $t('general.cancel') }}
          </v-btn>

          <v-btn
            color="blue"
            dark
            type="submit"
            @click="saveStatus"
          >
            {{ submitLoading ? $t('general.saving') : $t('general.save') }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <m6-confirm-delete
      :message="
        `${$t('general.deleteMsg')} ${appLabel.singular}
        ${$t('general.status')}: ${rfpStatus.name || ''}`
      "
      :show="showDeleteModal"
      :title="`${$t('general.delete')} ${$t('general.status')}`"
      @cancel="cancelDelete"
      @confirm="submitDelete"
    />
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
      showDeleteModal: false,
      rfpStatus: {
        name: ''
      },
      currentRfpStatus: '',
      settings: {
        rfpStatus: []
      },
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
      .doc('rfp')
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc('rfp')
            .set({
              rfpStatus: []
            })
        }
      })
  },
  methods: {
    saveOrder() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('rfp')
        .update({
          rfpStatus: this.settings.rfpStatus
        })
    },
    saveStatus() {
      if (!this.rfpStatus.name) {
        this.$snotify.error(
          `${this.appLabel.singular} ${this.$t(
            'cpmSettings.settings.statusNameRequired'
          )}`,
          this.$t('alerts.error')
        )
        return
      }

      const status = {
        id: new Date().getTime(),
        slug: this.slugify(this.rfpStatus.name),
        ...this.rfpStatus
      }

      if (this.currentRfpStatus === '') {
        if (!this.settings.rfpStatus) {
          this.settings.rfpStatus = []
        }
        this.settings.rfpStatus.push(status)
      } else {
        this.$set(this.settings.rfpStatus, this.currentRfpStatus, status)
      }
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('rfp')
        .update({
          rfpStatus: this.settings.rfpStatus
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} ${this.$t(
          'cpmSettings.settings.statusSaved'
        )}`,
        this.$t('alerts.success')
      )
      this.rfpStatus = { name: '' }
      this.currentRfpStatus = ''
    },
    slugify(str) {
      str = str.replace(/^\s+|\s+$/g, '')

      // Make the string lowercase
      str = str.toLowerCase()

      // Remove accents, swap ñ for n, etc
      const from =
        'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;'
      const to =
        'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------'
      for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
      }

      // Remove invalid chars
      str = str
        .replace(/[^a-z0-9 -]/g, '')
        // Collapse whitespace and replace by -
        .replace(/\s+/g, '-')
        // Collapse dashes
        .replace(/-+/g, '-')

      return str
    },
    deleteStatus(id, status) {
      this.rfpStatus = status
      this.currentRfpStatus = id
      this.showDeleteModal = true
    },
    cancelDelete() {
      this.showDeleteModal = false
      this.rfpStatus = {}
      this.currentRfpStatus = ''
    },
    submitDelete() {
      this.settings.rfpStatus.splice(this.currentRfpStatus, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('rfp')
        .update({
          rfpStatus: this.settings.rfpStatus
        })
        .then(() => {
          this.$snotify.success(
            `The ${this.appLabel.singular} ${this.$t(
              'cpmSettings.settings.statusDeleted'
            )}`,
            this.$t('alerts.success')
          )
          this.cancelDelete()
          this.showDeleteModal = false
        })
    },
    cancel() {
      this.showForm = false
    },
    editStatus(id, status) {
      this.rfpStatus = { ...status }
      this.currentRfpStatus = id
      this.showForm = true
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('rfp')
    }
  }
}
</script>

<style lang="scss" scoped>
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
    font-size: 0.8125rem;
  }
}
</style>

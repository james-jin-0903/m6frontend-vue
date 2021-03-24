<template>
  <div>
    <v-card>
      <v-card-title class="relative">
        <v-btn
          absolute
          color="blue"
          fab
          light
          right
          small
          @click="newL1"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="vertical-scroll">
        <div class="form-group">
          <label>{{ $t('cpmSettings.timelineAdmin.defaultActivities') }}</label>
          <v-list
            class="mainList"
            dense
          >
            <v-list-item class="myListHeader">
              <v-list-item-content>
                {{ $t('general.name') }}
              </v-list-item-content>
              <v-list-item-action>
                {{ $t('general.action') }}
              </v-list-item-action>
            </v-list-item>

            <draggable
              v-model="timelineDefault"
              @click="save"
              @end="drag = false"
              @start="drag = true"
            >
              <v-list-item
                v-for="(item, key) in timelineDefault"
                :key="key"
                class="myList"
              >
                <v-list-item-icon>
                  <v-icon
                    color="blue"
                    small
                  >
                    mdi-drag-variant
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  {{ item.name }}
                </v-list-item-content>

                <v-list-item-action
                  style="flex-direction:row; justify-content: flex-end;"
                >
                  <v-icon
                    class="ml-0 mr-0 pointer"
                    color="black"
                    size="18"
                    @click.stop="edit(item)"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    class="ml-2 mr-0 pointer"
                    color="black"
                    size="18"
                    @click.stop="deleteTimeline(item)"
                  >
                    mdi-delete
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
            </draggable>
          </v-list>
        </div>
      </v-card-text>
    </v-card>

    <!-- adding/editing modal -->
    <v-card
      v-if="showForm"
      class="mt-2"
    >
      <v-card-text class="vertical-scroll">
        <v-form ref="form">
          <v-card-text class="pa-2 vertical-scroll">
            <v-text-field
              v-model="name"
              color="blue"
              :label="$t('cpmSettings.timelineAdmin.timelineActivity')"
            />
          </v-card-text>

          <v-card-text class="pa-2 vertical-scroll">
            <v-textarea
              v-model="note"
              color="blue"
              :label="$t('cpmSettings.timelineAdmin.notes')"
            />
          </v-card-text>


          <v-checkbox
            v-model="type"
            :false-value="''"
            label="Final RFIs due date"
            true-value="final_rfis_due_date"
          />

          <v-btn
            color="blue"
            :disabled="loading"
            outline
            @click="cancel"
          >
            {{ $t('general.cancel') }}
          </v-btn>

          <v-btn
            color="blue"
            dark
            :disabled="loading"
            type="submit"
            @click="save"
          >
            {{ submitLoading ? $t('general.saving') : $t('general.save') }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <m6-confirm-delete
      :message="
        `${$t('general.sureDeleteResource', {
          resource: $t('cpmSettings.timelineAdmin.timelineActivity')
        })}: ${itemToDelete.name}`
      "
      :show="showDeleteModal"
      :title="
        `${$t('general.delete')} ${$t(
          'cpmSettings.timelineAdmin.timelineActivity'
        )}`
      "
      @cancel="cancelDelete"
      @confirm="submitDelete"
    />
    <!-- adding/editing modal -->
  </div>
</template>

<script>
import { db } from '@/utils/Firebase'
import draggable from 'vuedraggable'
import { mapState } from 'vuex'

export default {
  name: 'TimelineAdmin',
  components: {
    draggable
  },

  props: {
    included: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      timelineDefaultRef: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('rfp')
        .collection('timeline_default'),
      showDeleteModal: false,
      settings: [],
      loading: false,
      note: '',
      type: '',
      name: '',
      submitLoading: false,
      action: '',
      currentItem: {},
      currentIndex: -1,
      itemToDelete: {},
      showForm: false
    }
  },

  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    timelineDefault: {
      get() {
        return this.settings
          ? this.settings.map(item => ({ ...item, id: item.id }))
          : []
      },
      set(value) {
        value.map((item, index) => {
          if (index !== item.index) {
            this.timelineDefaultRef.doc(`${item.id}`).update({ index })

            item.index = index
          }
        })
      }
    }
  },

  methods: {
    newL1() {
      this.action = 'new'
      this.showForm = true
    },

    edit(item) {
      this.action = 'edit'
      this.currentItem = item
      this.name = item.name
      this.note = item.note
      this.type = item.type || ''
      this.showForm = true
    },
    deleteTimeline(item) {
      this.itemToDelete = item
      this.showDeleteModal = true
    },
    cancelDelete() {
      this.showDeleteModal = false
      this.itemToDelete = {}
    },
    submitDelete() {
      this.timelineDefaultRef
        .doc(this.itemToDelete.id)
        .delete()
        .then(() => {
          this.$snotify.success(
            this.$t('cpmSettings.timelineAdmin.timelineDeleted'),
            this.$t('alerts.success')
          )
          this.cancelDelete()
        })
    },

    save() {
      this.loading = true

      if (this.name === '') {
        this.$snotify.error(
          this.$t('cpmSettings.timelineAdmin.timelineRequired'),
          this.$t('alerts.error')
        )
        this.cancel()
        return
      }

      if (!this.note) {
        this.note = ''
      }

      if (!this.timelineDefault) {
        this.timelineDefault = []
      }

      if (this.action === 'new') {
        this.timelineDefaultRef
          .add({
            name: this.name,
            note: this.note,
            type: this.type,
            index: this.timelineDefault.length
          })
          .then(() =>
            this.$snotify.success(
              this.$t('cpmSettings.timelineAdmin.timelineCreated'),
              this.$t('alerts.success')
            )
          )
          .catch(() =>
            this.$snotify.error(
              this.$t('cpmSettings.timelineAdmin.wrongCreatingTimeline'),
              this.$t('alerts.error')
            )
          )
          .finally(this.cancel)
      } else {
        this.timelineDefaultRef
          .doc(`${this.currentItem.id}`)
          .update({
            name: this.name,
            note: this.note,
            type: this.type
          })
          .then(() =>
            this.$snotify.success(
              this.$t('cpmSettings.timelineAdmin.timelineUpdated'),
              this.$t('alerts.success')
            )
          )
          .catch(() =>
            this.$snotify.error(
              this.$t('cpmSettings.timelineAdmin.wrongUpdatingTimeline'),
              this.$t('alerts.error')
            )
          )
          .finally(this.cancel)
      }
    },

    cancel() {
      this.loading = false
      this.name = ''
      this.note = ''
      this.type = ''
      this.action = ''
      this.currentItem = {}
      this.currentIndex = -1
      this.showForm = false
    }
  },

  firestore() {
    return {
      settings: this.timelineDefaultRef.orderBy('index')
    }
  }
}
</script>

<style lang="scss">
.list-container {
  position: relative;
}
.list-overlay-cover {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.8);
}
</style>

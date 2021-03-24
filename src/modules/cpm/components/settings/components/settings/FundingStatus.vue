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
          <label>Funding Status</label>
          <v-list
            class="mainList"
            dense
          >
            <v-list-item class="myListHeader">
              <v-list-item-content>Name</v-list-item-content>
              <v-list-item-action>Action</v-list-item-action>
            </v-list-item>
            <draggable
              v-model="settings.fundingStatus"
              :options="{ group: 'status' }"
              @end="drag = false"
              @start="drag = true"
              @update="saveOrder"
            >
              <v-list-item
                v-for="(name, key) in settings.fundingStatus"
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
            v-if="fundingStatus"
            class="indigo--text"
          >
            Editing:
          </h6>
          <v-text-field
            v-model="status"
            color="blue"
            :label="`${appLabel.singular} Funding Status Name`"
          />
          <input
            v-model="fundingStatus"
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
            @click="saveFundingStatus"
          >
            {{ submitLoading ? "Saving..." : "Save" }}
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
      fundingStatus: '',
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
  methods: {
    saveOrder() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          fundingStatus: this.settings.fundingStatus
        })
    },
    saveFundingStatus() {
      if (this.status == '') {
        this.$snotify.error(
          `${this.appLabel.singular} funding status name is required`,
          'Error'
        )
        return
      }
      if (this.fundingStatus === '') {
        if (!this.settings.fundingStatus) {
          this.settings.fundingStatus = []
        }
        this.settings.fundingStatus.push(this.status)
      } else {
        this.$set(this.settings.fundingStatus, this.fundingStatus, this.status)
      }
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          fundingStatus: this.settings.fundingStatus
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} status has been saved`,
        'Success'
      )
      this.status = ''
      this.fundingStatus = ''
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
      this.settings.fundingStatus.splice(id, 1)
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          fundingStatus: this.settings.fundingStatus
        })
      this.$snotify.success(
        `The ${this.appLabel.singular} status has been deleted`,
        'Success'
      )
    },
    editStatus(id, name) {
      this.status = name
      this.fundingStatus = id
      this.showForm = true
    },
    cancel() {
      this.status = ''
      this.fundingStatus = ''
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

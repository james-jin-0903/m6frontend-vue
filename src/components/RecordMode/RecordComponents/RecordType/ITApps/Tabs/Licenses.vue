<template>
  <v-container
    v-if="!loading"
    class="mt-5 px-0 py-0 rounded-lg"
  >
    <template v-if="items.length === 0">
      <v-container
        class="align-center d-flex flex-column justify-center px-0 py-10 rounded-lg"
        :class="baseColor"
      >
        <p class="text-h5 white--text">
          There are no {{ itemsName }}
        </p>
        <v-divider class="mt-0 w-full white" />
        <a
          class="align-center border border-t-1 d-flex justify-center pointer py-3 text-body-2 w-full white--text"
          @click="dialog = true, dialogMode = true"
        >
          ADD NEW <v-icon class="white--text">mdi-plus</v-icon>
        </a>
        <v-divider class="mb-3 w-full white" />
      </v-container>
    </template>
    <template v-else>
      <v-card>
        <div :class="baseColor + ' card rounded-0 rounded-t-sm px-3 py-4 text-body-1 white--text capitalize'">
          {{ itemsName }}
        </div>
        <div class="licenses-container pa-3">
          <!-- here is going to render all the items - another slot -->
          <div
            v-for="(item, index) in items"
            :key="'item-'+index"
          >
            <v-row
              v-for="(keyName, index) in Object.keys(item)"
              :key="'key-'+ keyName"
              class="d-flex justify-center"
            >
              <template v-if="keyName !== 'id'">
                <v-col
                  class="pl-4 pr-16 py-1"
                  cols="12"
                >
                  <div class="d-flex justify-space-between">
                    <p class="font-weight-medium mb-0">
                      {{ keyName }}
                    </p>
                    <p
                      v-if="keyName == 'licenseType'"
                      class="mb-0"
                      :class="{ 'blue lighten-1 white--text rounded-xl px-3': keyName == 'licenseType' }"
                    >
                      {{ item[keyName]['value'] }}
                    </p>
                    <p
                      v-else
                      class="mb-0"
                      :class="{ 'blue lighten-1 white--text rounded-xl px-3': keyName == 'licenseType' }"
                    >
                      {{ item[keyName] }}
                    </p>
                  </div>
                  <v-divider class="grey lighten-2 mt-1" />
                </v-col>
                <template
                  v-if="index === 1"
                  class="pa-0"
                  cols="1"
                >
                  <v-btn
                    class="edit-license rounded-xl transparent"
                    elevation="0"
                    small
                    @click="showUpdateDialog(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </template>
            </v-row>
          </div>
        </div>
      </v-card>
    </template>

    <v-dialog
      v-model="dialog"
      max-width="600px"
      persistent
    >
      <v-form
        ref="form"
        v-model="valid"
        class="white"
      >
        <v-card-title :class="baseColor + ' white--text d-flex justify-space-between'">
          <span class="capitalize headline white--text">{{ titleDialog }}</span>
          <v-dialog
            v-if="!dialogMode"
            v-model="deleteDialog"
            width="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                color="white"
                icon
                v-on="on"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <delete-dialog
              :element="'lisense'"
              @closeDeleteModal="beforeDelete"
            />
          </v-dialog>
        </v-card-title>
        <v-card-text class="form-labels px-16 py-10">
          <v-select
            v-model="itemInfo.licenseType"
            :color="baseColor"
            item-text="value"
            :item-value="Object"
            :items="licenseTypes"
            label="Type"
            :rules="selectRules"
          />

          <v-text-field
            v-model="itemInfo.users"
            :color="baseColor"
            label="Estimated Users"
            :rules="quantityRules"
            type="number"
          />

          <v-text-field
            v-model="itemInfo.concurrentUsers"
            :color="baseColor"
            label="Estimated Concurrent Users"
            :rules="quantityRules"
            type="number"
          />

          <v-text-field
            v-model="itemInfo.licenses"
            :color="baseColor"
            label="Number of Licenses"
            :rules="quantityRules"
            type="number"
          />

          <v-textarea
            v-model="itemInfo.details"
            :color="baseColor"
          >
            <template v-slot:label>
              <div>
                Details <small>(optional)</small>
              </div>
            </template>
          </v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :color="baseColor"
            text
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            class="mr-4"
            :color="baseColor"
            :disabled="!valid"
            text
            @click="clickAction"
          >
            {{ titleAction }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-dialog>
  </v-container>
  <v-container
    v-else
    class="rounded-lg"
  >
    <v-progress-circular
      color="primary"
      indeterminate
      style="margin-left: 45%;"
    />
  </v-container>
</template>

<script>
import { items } from '@/mixins/items'
import { validations } from '@/mixins/form-validations'
import { mapActions } from 'vuex'
import DeleteDialog from '@/components/Dialogs/DeleteDialog'

export default {
  name: 'Licenses',
  components: {
    DeleteDialog
  },
  mixins: [items, validations],
  props: {
    info: Object
  },
  data: () => ({
    deleteDialog: false,
    baseColor: 'teal lighten-1',
    itemsName: 'licenses',
    itemInfo: {
      licenseType: null,
      users: null,
      concurrentUsers: null,
      licenses: null,
      details: ''
    },
    licenseTypes: [],
    loading: true
  }),
  methods: {
    ...mapActions('ITAppsModule', [
      'get_selects',
      'get_licensing',
      'post_licensing',
      'put_licensing',
      'delete_licensing'
    ]),
    post() {
      this.post_licensing({
        estimated_current_users: this.items[0]['concurrentUsers'],
        number_of_licenses: this.items[0]['licenses'],
        licensing_type: this.items[0]['licenseType']['id'],
        estimated_users: this.items[0]['users'],
        details: this.items[0]['details'],
        app_id: this.info.id
      }).then(res => (
        this.items[0]['id'] = res.data.licensing_id
      ))
    },
    put() {
      this.put_licensing({
        estimated_current_users: this.items[0]['concurrentUsers'],
        number_of_licenses: this.items[0]['licenses'],
        licensing_type: this.items[0]['licenseType']['id'],
        estimated_users: this.items[0]['users'],
        details: this.items[0]['details'],
        id: this.items[0]['id']
      })
    },
    beforeDelete(decision) {
      decision ? this.deleteItem() : this.deleteDialog = false
    },
    delete() {
      this.delete_licensing(this.itemInfo.id)
    }
  },
  created() {
    this.get_selects('/LicensingType').then(
      response => (response.data.forEach(item => {
        this.licenseTypes.push({
          id: item.id,
          value: item.value,
          field: item.field
        })
      }))
    )
    this.get_licensing(this.info.id).then(
      response => (
        Object.keys(response).length != 0 ? this.items.push(response) : null,
        this.loading = false
      )
    )
  }
}
</script>

<style lang="scss">
.licenses-container {
  min-height: 180px;
  overflow-x: auto;
  overflow-y: auto;
}
.btn-circle-add-item {
  position: absolute;
  top: 35px;
  right: 15px;
}
.edit-license {
  position: absolute;
  top: 65px;
  right: 20px;
}
</style>

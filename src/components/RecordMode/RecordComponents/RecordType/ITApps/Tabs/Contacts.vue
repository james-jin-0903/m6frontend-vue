<template>
  <v-container class="mt-5 px-0 py-0 rounded-lg">
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
        <v-btn
          :class="baseColor + ' btn-circle-add-item'"
          dark
          fab
          small
          @click="dialog = true, dialogMode = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <div class="items-container pa-3">
          <!-- here is going to render all the items - another slot -->
          <div
            v-for="(item, index) in items"
            :key="'item-'+index"
          >
            <div class="d-flex">
              <img
                alt=""
                class="mr-2 rounded-xl"
                height="50"
                src="@/assets/default_user.png"
                width="50"
              >
              <div>
                <p class="mb-0">
                  {{ item.name }}
                </p>
                <p>{{ item.email }}</p>
              </div>
              <div class="align-center d-flex ml-auto mr-0">
                <v-tooltip
                  v-for="(tag, pos) in item.tags"
                  :key="'tooltip-'+pos"
                  right
                  small
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      class="mr-2 rounded-xl text-caption"
                      :color="baseColor"
                      dark
                      small
                      v-on="on"
                    >
                      {{ tag }}
                    </v-btn>
                  </template>
                  <span>{{ tag }}</span>
                </v-tooltip>
                <v-btn
                  class="rounded-xl transparent"
                  elevation="0"
                  small
                  @click="showUpdateDialog(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </div>
            </div>
            <div v-if="index !== items.length - 1">
              <v-divider class="grey lighten-2 my-3" />
            </div>
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
          <v-btn
            v-if="!dialogMode"
            color="white"
            icon
            @click="deleteItem"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="form-labels px-16 py-10">
          <v-autocomplete
            v-model="itemInfo.name"
            :color="baseColor"
            :filter="customFilter"
            item-text="name"
            :items="dataPeople"
            label="Name"
            return-object
            :rules="nameRules"
            @change="changeCurrentItemInfo"
          />
          <v-text-field
            v-model="itemInfo.email"
            :color="baseColor"
            label="E-mail"
          />
          <v-text-field
            v-model="itemInfo.phone"
            :color="baseColor"
            label="Phone"
          />
          <v-autocomplete
            v-model="itemInfo.tags"
            :color="baseColor"
            :items="tagItems"
            label="Tags*"
            multiple
            :rules="tagRules"
          />
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
</template>

<script>
import { items } from '@/mixins/items'
import { validations } from '@/mixins/form-validations'

export default {
  name: 'Contacts',
  mixins: [items, validations],
  data: () => ({
    baseColor: 'blue lighten-1',
    itemsName: 'contacts',
    itemInfo: {
      name: '',
      email: '',
      phone: '',
      tags: []
    },
    tagItems: ['App', 'ITApps', 'Project']
  }),
  methods: {
    changeCurrentItemInfo(item) {
      this.itemInfo.name = item.name
      this.itemInfo.email = item.email
      this.itemInfo.phone = item.phone
    }
  }
}
</script>

<style lang="scss">
.items-container {
  height: 180px;
  overflow-x: auto;
  overflow-y: auto;
}
.btn-circle-add-item {
  position: absolute;
  top: 35px;
  right: 15px;
}
</style>
